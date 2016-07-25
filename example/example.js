import env from 'node-env-file'
import PokeAPI from '../src'

env(__dirname + '/.env');

var username = process.env.PGO_USERNAME || 'USER'
var password = process.env.PGO_PASSWORD || 'PASS'
var provider = process.env.PGO_PROVIDER || 'ptc'
var lat = process.env.LATITUDE || 40.759211
var lng = process.env.LONGITUDE || -73.984472


const Poke = new PokeAPI()

async function init() {

  //set player location
  Poke.player.location = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  }

  //login
  const api = await Poke.login(username, password, provider)

  // just update the profile...
  let player = await Poke.GetPlayer()

  // get map objects..
  while( true ){
    let cells = await Poke.GetMapObjects()
    for(let cell of cells) {
      // catchable pokemons from here?
      if (cell.catchable_pokemons.length > 0){
        cell.catchable_pokemons.map(pokemon => {
          pokemon.encounterAndCatch()
        })
      }

      // wild pokemons
      if (cell.wild_pokemons.length > 0){
        // we have wild pokemons, you cannot catch these..
      }

      // forts
      if (cell.forts.length > 0){
        // forts..
        for (let fort of cell.forts){
          if (fort.isCheckpoint)
            fort.search()
        }
      }
    }
    
    //just walk a little (1 - 15 meters..)
    await Poke.player.walkAround()

    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

init().catch(console.log)