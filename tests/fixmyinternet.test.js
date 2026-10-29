import { test, expect } from 'bun:test';
import { assess, wifiDevice, run } from '../fixmyinternet';

test('detects actual Wi-Fi interface, including older AirPort naming', () => {
  expect(wifiDevice('Hardware Port: Ethernet\nDevice: en0\n\nHardware Port: Wi-Fi\nDevice: en3')).toBe('en3');
  expect(wifiDevice('Hardware Port: AirPort\nDevice: en1')).toBe('en1');
  expect(wifiDevice('Hardware Port: Ethernet\nDevice: en0')).toBeUndefined();
});
test('working HTTPS takes priority over missing IPv4 or blocked probes', () => {
  expect(assess({ https: true, badIP: true, direct: false }).action).toBe('1');
});
test('distinguishes DNS, DHCP, captive portal, and TLS/filtering failures', () => {
  expect(assess({ direct: true, dns: false }).action).toBe('2');
  expect(assess({ badIP: true, route: '' }).action).toBe('3');
  expect(assess({ portal: true, direct: true, dns: false }).action).toBe('5');
  expect(assess({ direct: true, dns: true }).action).toBe('8');
  expect(assess({ wifiOff: true, route: '' }).action).toBe('4');
});
test('does not diagnose DNS simply because direct probes failed', () => {
  expect(assess({ direct: false, dns: false, route: 'utun4' }).action).toBe('8');
});
test('hung commands terminate and failures remain visible', async () => {
  const r = await run(['/bin/sleep', '5'], 100);
  expect(r.code).not.toBe(0);
  expect(r.ms).toBeLessThan(2000);
  expect((await run(['/nonexistent/fixmyinternet-test'])).code).not.toBe(0);
});

import { diagnose, checkRows } from '../fixmyinternet';
function fakeRunner(googleOK) {
  return async cmd => {
    const url = cmd.at(-1);
    let out = '', code = 1;
    if (cmd.includes('-listallhardwareports')) { out = 'Hardware Port: Wi-Fi\nDevice: en7'; code = 0; }
    if (url === 'http://alwayshttp.com/') { out = '200'; code = 0; }
    if (url === 'https://www.google.com/' && googleOK) { out = '200'; code = 0; }
    if (cmd.includes('--dns') || cmd.includes('--proxy') || cmd.includes('--nc')) code = 0;
    await Bun.sleep(url === 'http://alwayshttp.com/' ? 15 : 1);
    return { cmd, out, code, err: '', ms: 1 };
  };
}
test('progress reports pending and completed checks separately; Google counts as HTTPS', async () => {
  const updates = [];
  const result = await diagnose(s => updates.push(s), fakeRunner(true));
  expect(checkRows(updates[0]).every(r => r.state === 'running')).toBe(true);
  expect(updates.some(s => s.raw.google && !s.raw.alwayshttp)).toBe(true);
  expect(result.https).toBe(true);
  expect(checkRows(result).some(r => r.state === 'running')).toBe(false);
  expect(checkRows(result).find(r => r.label === 'google.com · HTTPS').state).toBe('pass');
  expect(checkRows(result).find(r => r.label === 'apple.com · HTTPS').state).toBe('fail');
});
test('plain HTTP success does not imply HTTPS works; missing lease is inconclusive', async () => {
  const result = await diagnose(() => {}, fakeRunner(false));
  expect(result.https).toBe(false);
  expect(checkRows(result).find(r => r.label === 'alwayshttp.com · HTTP').state).toBe('pass');
  expect(checkRows(result).find(r => r.label === 'DHCP lease').state).toBe('warning');
  result.raw.alwayshttp.out = '503';
  expect(checkRows(result).find(r => r.label === 'alwayshttp.com · HTTP').state).toBe('fail');
});
