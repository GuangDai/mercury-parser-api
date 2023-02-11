import requests
import sys
import time
url = sys[1]
times = 10
while times > 0:
  try:
    temp = requests.get(sys[1])
    break
  except:
    times -= 10
    time.sleep(10-times)
print(temp.url)
sys.stdout.flush()
