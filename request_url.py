import requests
import sys
import time
url = sys.argv[1]
times = 10
while times > 0:
  try:
    temp = requests.get(url)
    break
  except:
    times -= 10
    time.sleep((10-times)/10)
print(temp.url)
sys.stdout.flush()
