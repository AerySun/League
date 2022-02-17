require('dotenv').config()
const { prompt } = require('enquirer')
const { readFile } = require('fs/promises')
const fetch = require('node-fetch')

const BASE_URL = 'https://euw1.api.riotgames.com'
const GET_SUMMONER_BY_NAME = 'lol/summoner/v4/summoners/by-name'
const GET_LEAGUE_BY_SUMMONER = 'lol/league/v4/entries/by-summoner'
const GET_MASTERY_BY_SUMMONER = 'lol/champion-mastery/v4/champion-masteries/by-summoner'

async function getChampions(){
    const championsList = JSON.parse(await readFile('./src/champions.json'))
    return Object.values(championsList.data).reduce((result, champion) => {
        return {
            ...result, 
            [champion.key]: champion.name
        }
    }, {})
}

async function main() {
    console.log(process.env.API_KEY)
    const response = await prompt({
        type: 'input',
        name: 'summonername',
        message: 'What is your Summoner name?'
        })
    const summoner = await getSummonerByName(response.summonername)
    const mastery = await getMasteryBySummonerId(summoner.id)
    const league = await getLeagueBySummonerId(summoner.id)
    console.log(mastery)
    console.log(league)
}

function getSummonerByName(name){
    return sendRequest(GET_SUMMONER_BY_NAME, name)
}

function getLeagueBySummonerId(id) {
    return sendRequest(GET_LEAGUE_BY_SUMMONER, id)
}

async function getMasteryBySummonerId(id){
    const champions = await getChampions()
    const response = await sendRequest(GET_MASTERY_BY_SUMMONER, id)
    return response.map(mastery => {
        return {
            champion: champions[mastery.championId],
            championLevel: mastery.championLevel,
            championPoints: mastery.championPoints
        }
    }).filter(mastery => mastery.champion !== undefined)
}

async function sendRequest(path, param){
    const config = {
        method: 'GET',
        headers: {
            'X-Riot-Token': process.env.API_KEY
        }
    }
    const response = await fetch(`${BASE_URL}/${path}/${encodeURIComponent(param)}`, config)
    const json = await response.json()
    if ('status' in json){
        console.log(json)
        process.exit(1)
    }
    return json
}

main()