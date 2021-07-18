const API_KEY = 'RGAPI-4bbd46ac-870e-4752-a885-21b292c7422e'
const BASE_URL = 'https://euw1.api.riotgames.com'
const GET_SUMMONER_BY_NAME = 'lol/summoner/v4/summoners/by-name'
const GET_LEAGUE_BY_SUMMONER = 'lol/league/v4/entries/by-summoner'

const fetch = require('node-fetch')

async function main() {
    const summoner = await getSummonerByName('AΣRYSun')
    const league = await getLeagueBySummonerId(summoner.id)
    console.log(league)
}

function getSummonerByName(name){
    return sendRequest(GET_SUMMONER_BY_NAME, name)
}

function getLeagueBySummonerId(id) {
    return sendRequest(GET_LEAGUE_BY_SUMMONER, id)
}

async function sendRequest(path, param){
    const config = {
        method: 'GET',
        headers: {
            'X-Riot-Token': API_KEY
        }
    }
    const response = await fetch(`${BASE_URL}/${path}/${encodeURIComponent(param)}`, config)
    return await response.json()
}

main()