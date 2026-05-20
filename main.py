import requests
# url = "https://naikiyah-islamic-content.p.rapidapi.com/api/fiqhBasics"
url = "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json"
headers = {
	"Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

print(response.json())