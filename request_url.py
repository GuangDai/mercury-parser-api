import requests
import sys
url = sys[1]
temp = requests.get(sys[1])
print(temp.url)
sys.stdout.flush()
