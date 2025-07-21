const API_KEY = "YOUR API KEY HERE";
const characterName = "CHARACTER NAME";
const urlString = "https://open.api.nexon.com/heroes/v1/id?character_name=" + characterName;
  
const answer = fetch(urlString, {
  headers:{
    "x-nxopen-api-key": API_KEY
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error))

console.log(answer);
