
import os
from datetime import datetime, time


if datetime.now().time() >= time(6) and datetime.now().time() < time(11):
  os.system("networksetup -setairportpower en0 off")
else:
  print("turning on")
  os.system("networksetup -setairportpower en0 on")
