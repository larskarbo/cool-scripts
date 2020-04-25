from glob import glob
import re
import os
paths = glob('../*/')


r = "\/(.*)\/"
for path in paths:
  dirname = path[3:-1]
  git = os.path.isdir(path + "/.git")
  # print(git)
  if not git:
    print(path[3:-1])
