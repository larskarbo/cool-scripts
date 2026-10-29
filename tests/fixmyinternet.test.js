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
