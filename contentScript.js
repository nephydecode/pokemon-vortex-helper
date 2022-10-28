
// bestMove('Lopunny (Mega)', 'Whiscash', ['Flail', 'Focus Punch', 'Fling', 'Solar Beam'])

const validParanthesis = {'Amped' : 'Amped', 'Low Key' : 'Low Key', 'Ice' : 'Ice', 'Noice' : 'Noice', 'Hangry' : 'Hangry', 'Crowned' : 'Crowned', 'Eternamax' : 'Eternamax', 'Single Strike' : 'Single Strike', 'Rapid Strike' : 'Rapid Strike', 'Cell' : 'Cell', 'Complete' : 'Complete', 'Core' : 'Core', 'Partial' : 'Partial', 'Unbound' : 'Unbound', 'Baile' : 'Baile', 'Pau' : 'Pau', 'PomPom' : 'PomPom', 'Sensu' : 'Sensu', 'Midday' : 'Midday', 'Midnight' : 'Midnight', 'Dusk' : 'Dusk', 'School' : 'School', 'Meteor' : 'Meteor', 'Dusk Mane' : 'Dusk Mane', 'Dawn Wings' : 'Dawn Wings', 'Ultra' : 'Ultra', 'Average' : 'Average', 'Small' : 'Small', 'Large' : 'Large', 'Super' : 'Super', 'F' : 'F', 'M' : 'M', 'Shield' : 'Shield', 'Blade' : 'Blade', 'Mega' : 'Mega', 'Mega X' : 'Mega X', 'Mega Y' : 'Mega Y', 'Primal' : 'Primal', 'Origin' : 'Origin', 'Resolute' : 'Resolute', 'Aria' : 'Aria', 'Pirouette' : 'Pirouette', 'Sky' : 'Sky', 'Therian' : 'Therian', 'Black' : 'Black', 'White' : 'White', 'Attack' : 'Attack', 'Defense' : 'Defense', 'Speed' : 'Speed', 'Plant' : 'Plant', 'Sandy' : 'Sandy', 'Steel' : 'Steel', 'Alolan' : 'Alolan', 'Galarian' : 'Galarian', 'Hisuian' : 'Hisuian', 'Zen' : 'Zen', 'Galarian Zen' : 'Galarian Zen', 'Red Striped' : 'Red Striped', 'Blue Striped' : 'Blue Striped', 'White Striped' : 'White Striped', 'Heat' : 'Heat', 'Wash' : 'Wash', 'Phone' : 'Phone', 'Pokedex' : 'Pokedex', 'Frost' : 'Frost', 'Spin' : 'Spin', 'Cut' : 'Cut' }

// console.log(pokemonParser('Dark Lopunny (Mega)'))

async function bestMove(attacker, defender, movelist) {
    typedex = await(fetchDex('type'))
    attackdex = await(fetchDex('attack'))
    pokedex = await(fetchDex('poke'))
    // console.log(pokedex[attacker])
    // console.log(attackdex)
    // console.log(typedex['WATER'])

    attackerTypes = pokedex[attacker].length
    defenderTypes = pokedex[defender].length
    console.log(`attacker has ${attackerTypes} type(s)`)
    console.log(`defender has ${defenderTypes} type(s)`)

    let maxDmg = 0;
    let maxDmgMove;

    for (let move=0; move<movelist.length; move++){
        let dmg = attackdex[movelist[move]].damage;
        if(pokedex[attacker].includes(attackdex[movelist[move]].type)) dmg *= 1.5   // STAB
        dmg *= typedex[pokedex[defender][0]][attackdex[movelist[move]].type]        // EFFECTIVENESS TYPE 1
        if(defenderTypes===2) dmg *= typedex[pokedex[defender][1]][attackdex[movelist[move]].type] // EFFECTIVENESS TYPE 2

        if(dmg>maxDmg){
            maxDmg = dmg
            maxDmgMove = movelist[move]
        }
        console.log(`${movelist[move]} dmg - ${dmg}`)
    }
    console.log(`${maxDmgMove} has the highest damage of ${maxDmg}`)
    console.log({move: maxDmgMove, dmg: maxDmg})
    return {move: maxDmgMove, dmg: maxDmg};
}

// ATTACK, POKE, TYPE
async function fetchDex(dexType) {
    return await fetch(chrome.runtime.getURL(`db/${dexType}dex.json`)).then((response) => { return response.json()})
}

function pokemonParser(pokemon){
    let parsedName = pokemon;
    if(pokemon.startsWith('Shiny')) parsedName = parsedName.replace('Shiny ', '')
    if(pokemon.startsWith('Dark')) parsedName = parsedName.replace('Dark ', '')
    if(pokemon.startsWith('Mystic')) parsedName = parsedName.replace('Mystic ', '')
    if(pokemon.startsWith('Metallic')) parsedName = parsedName.replace('Metallic ', '')
    if(pokemon.startsWith('Shadow')) parsedName = parsedName.replace('Shadow ', '')
    if(pokemon.includes('(')) { 
        let SubName = pokemon.slice(pokemon.indexOf('('));
        if(validParanthesis[SubName.slice(1,-1)]===undefined) {
            parsedName = parsedName.replace(SubName, '')
            parsedName = parsedName.slice(0,-1)
        }
    }
    return parsedName
}

// VARIABLE - Stop at this number
const SIDEQUESTNO = 9999;
const STOPATLEGENDARY = false;
const FASTESTRUN = false;
const BATTLETOWER = true;
const AUTOBATTLE = true;

const TIMER = FASTESTRUN ? 100 : (Math.random()+0.1)*1000+150;
const intervalChecker = AUTOBATTLE ? setInterval(()=> autoNext(), TIMER) : false;

const pages = {
    Start: "Start",
    Select : "Select",
    Battle : "Battle",
    Next : "Next",
    Error : "Error",
    Sidequest : "Sidequest",
    Battletower : "Battletower",
    Team : "Team"
}

document.addEventListener('keydown', (event) => {
    var code = event.code;
    if(code==="ShiftLeft") autoNext();
  }, false);
  
async function autoNext () {
    checkPage().then(async (e)=> {
        // console.log(e);
        switch(e){
            case "Start":
                if(window.location.href.slice(48,-1) >= SIDEQUESTNO){
                    clearInterval(intervalChecker)
                    console.log(`Reached target Sidequest #${SIDEQUESTNO}. AutoBattler script has been stopped.`)
                    break
                }
                if(STOPATLEGENDARY){
                    const firstEnemyPokemon = document.getElementsByClassName('trainerOpponent')[6].nextElementSibling.innerHTML;
                    const indexOfLevel = document.getElementsByClassName('trainerOpponent')[6].nextElementSibling.innerHTML.indexOf('</em>') + 6
                    const firstEnemyPokemonLevel = firstEnemyPokemon.slice(indexOfLevel,indexOfLevel+3)
                    console.log(`LEVEL OF FIRST POKEMON : ${firstEnemyPokemonLevel}`)
                    if(firstEnemyPokemonLevel>100){
                        clearInterval(intervalChecker)
                        break
                    }
                }
                const answer = addbits(document.querySelectorAll("label")[6].innerText.slice(27,-3).replaceAll(' ',''))
                document.getElementById('nojs-solve-v').value = answer
                document.getElementsByTagName("form")[0].submit()
            case "Select" :
                document.getElementsByTagName("form")[0].submit()
                break
            case "Battle" :
                const header = document.querySelector('h3.heading-maroon.no-right-border-rad.margin-right-2');
                if(header!==undefined && header!==null && header.innerText === 'Select an Attack'){
                    try{
                        let enemyPokemon = document.querySelectorAll('h4')[0].innerText.slice(0,document.querySelectorAll('h4')[0].innerText.indexOf(' - '))
                        if(enemyPokemon.slice(-1)===' ') enemyPokemon = enemyPokemon.slice(0,-1)
                        const defender = pokemonParser(enemyPokemon)
                        let myPokemon = document.querySelectorAll('h4')[1].innerText.slice(0,document.querySelectorAll('h4')[1].innerText.indexOf(' - '))
                        if(myPokemon.slice(-1)===' ') myPokemon = myPokemon.slice(0,-1)
                        const attacker = pokemonParser(myPokemon)
                        const movelist = []
                        for(let i=0;i<4;i++) movelist.push(document.getElementsByClassName('height-100 pad-top-5')[i].innerText)
                        const _bestMove = await bestMove(attacker, defender, movelist)
                        console.log(_bestMove)
                        const bestMoveIndex = movelist.indexOf(_bestMove)
                        console.log(bestMoveIndex)
                        document.getElementsByClassName('height-100 pad-top-5')[bestMoveIndex].click()
                    } catch (e){
                        console.log(e)
                        document.getElementsByTagName("form")[1].submit()
                        break
                    }
                }
                document.getElementsByTagName("form")[1].submit()
                break
            case "Next":
                document.getElementsByClassName("menu-tab")[0].click()
                break
            case "Error" :
                window.location.href = BATTLETOWER ? "https://www.pokemon-vortex.com/season-battle-tower/" : "https://www.pokemon-vortex.com/sidequests/"
                break
            case "Sidequest" :
                document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0].click()
                break
            case "Battletower" :
                document.getElementsByClassName('button-maroon button-small width-25 margin-bottom-10')[0].click()
            case "Team" :
                // do nothing
                break;
            default:
                break
        }
    });
}

async function checkPage() {

    // SELECT POKEMON PAGE
    const header = document.getElementsByClassName("heading-maroon width-95");
    if (header!==undefined) {     
        for ( let i = 0; i< header.length; i++){
            if (document.querySelectorAll("label")[6] !== undefined && document.querySelectorAll("label")[6].style[0] === 'font-size') return pages.Start;
            if ( header[i].innerHTML === "Select your next Pokémon to battle") return pages.Select;
        }
    }

    // COMPLETE BATTLE PAGE
    if (document.getElementsByClassName("heading-maroon no-bot-border-rad margin-bottom-3")[0]!== undefined && document.getElementsByClassName("heading-maroon no-bot-border-rad margin-bottom-3")[0].innerHTML === "Congratulations! You won the battle!") { 
        return pages.Next;
    }

    if (document.getElementsByClassName('alert-red')[0]!==undefined && document.getElementsByClassName('alert-red')[0].innerText === "You have already completed a battle within the last 10 seconds. This is in effect to stop players having an advantage over others.") {
        return pages.Next;
    }

    if(document.querySelector('h3.heading-maroon')!==null 
        && document.querySelector('h3.heading-maroon')!==undefined
        && document.querySelector('h3.heading-maroon').innerText!==null 
        && document.querySelector('h3.heading-maroon').innerText == 'An error has occurred, please refresh the page or return to the battle select page you came from.'){
        return pages.Error;
    }

    if(document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0]!==null && document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0]!==undefined){
        return pages.Sidequest;
    }

    const battle = document.getElementsByClassName("heading-maroon no-right-border-rad margin-right-2");
    if (battle[0] !== undefined && battle[0].innerHTML == "Select an Attack" || battle[0] !== undefined && battle[0].innerHTML === "Attack Results") {
        return pages.Battle;
    }

    const h2header = document.querySelector('h2.heading-maroon.no-bot-border-rad.margin-bottom-3')
    if(h2header!== undefined && h2header!== null) {
        if(h2header.textContent === 'Sorry, you lost the battle.') return pages.Next
        if(h2header.textContent === 'Season Battle Tower') return pages.Battletower;
        if(h2header.textContent === 'Manage Your Pokémon Team') return;
    }

    const alert = document.getElementsByClassName('alert-red')
    if (alert[0]!== undefined && alert[0]!==null){
        if(alert[0].innerHTML.slice(44) === 'An error has occurred. Please try again later.') return pages.Error
    }

}

// Simple Equation Solver with only + and - operations
function addbits(s) {
    var total = 0,
        s = s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
        
    while (s.length) {
      total += parseFloat(s.shift());
    }
    return total;
  }