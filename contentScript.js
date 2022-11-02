// VARIABLE - Stop at this number
const SIDEQUESTNO = 9999;
const STOPATLEGENDARY = false;
const FASTESTRUN = false;
const BATTLETOWER = true;
let AUTOBATTLE = true;
const SUBMIT = true;
const TRAINFIRSTPOKE = false;

const TIMER = FASTESTRUN ? 100 : (Math.random()+0.1)*1000+350;
const intervalChecker = AUTOBATTLE ? setInterval(()=> autoNext(), TIMER) : false;

const pages = { Start: "Start", Select : "Select", Battle : "Battle", Next : "Next", Error : "Error", Sidequest : "Sidequest", Battletower : "Battletower", Team : "Team", SidequestCompletion : "SidequestCompletion", SidequestPrize : "SidequestPrize" }

if(isNumeric(window.location.href.slice(48,-1)) && (window.location.href.slice(48,-1) >= SIDEQUESTNO)) {
    console.log(`Reached target Sidequest #${SIDEQUESTNO}. AutoBattler script has been stopped.`)
    intervalchecker = false
}
else if (AUTOBATTLE){
    console.log('interval run')
    intervalChecker = setInterval(()=> autoNext(), TIMER)
}

// console.log(pokemonParser('Dark Lopunny (Mega)'))

async function bestMove(attacker, defender, movelist) {
    typedex = await(fetchDex('type'))
    attackdex = await(fetchDex('attack'))
    pokedex = await(fetchDex('poke'))

    attackerTypes = pokedex[attacker].length
    defenderTypes = pokedex[defender].length
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
    return new Promise(function(resolve){resolve({move: maxDmgMove, dmg: maxDmg})});
}

// ATTACK, POKE, TYPE
async function fetchDex(dexType) {
    return await fetch(chrome.runtime.getURL(`db/${dexType}dex.json`)).then((response) => {return response.json()})
}

const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  };

async function bestPokemon(myPokemonList, opponentPokemon){
    // await console.log(myPokemonList)
    // await console.log(opponentPokemon)
    let teamdex;
    var maxDmgPoke = ""
    let maxDmg = 0;
    teamdex = {"Camerupt": ["Lava Plume","Earth Power","Rock Slide","Take Down"],"Lopunny": ["Flail","Jump Kick","Bounce","Dizzy Punch"],"Magneton": ["Tri Attack","Electro Ball","Mirror Shot","Gyro Ball"],"Rhyperior": ["Stone Edge","Earthquake","Megahorn","Hammer Arm"],"Sableye": ["Scratch","Night Shade","Fury Swipes","Feint Attack"],"Turtonator": ["Shell Trap","Tackle","Smog","Incinerate"]
    }
    teamdex = await readLocalStorage('teamdex')
    // console.log(x)
    for (let poke = 0; poke < myPokemonList.length; poke++){
        bestMoveObj = await bestMove(pokemonParser(myPokemonList[poke]), pokemonParser(opponentPokemon), teamdex[pokemonParser(myPokemonList[poke])])
        if(bestMoveObj.dmg > maxDmg){
            maxDmg = bestMoveObj.dmg
            maxDmgPoke = myPokemonList[poke]
        }
    }
    return new Promise(function(resolve){resolve(maxDmgPoke)});
}

async function availPokemonMatchup(){
    const availPokemon = []
    let availEnemyPoke = ""
    for(let i = 0; i<6; i++){
        const currentPoke = document.querySelectorAll('strong')[i].children[0];
        if(currentPoke.children[0]==undefined) availPokemon.push(currentPoke.innerText)
    }
    for(let i = 6; i<12; i++){
        const enemyPoke = document.querySelectorAll('strong')[i].children[0];
        if(enemyPoke.children[0]===undefined) {
            availEnemyPoke = enemyPoke.innerText
            break
        }
    }
    return new Promise(function(resolve){resolve({myPokemonList: availPokemon, opponentPokemon: availEnemyPoke})});
}

function pokemonParser(pokemon){
    const validParanthesis = {'Amped' : 'Amped', 'Low Key' : 'Low Key', 'Ice' : 'Ice', 'Noice' : 'Noice', 'Hangry' : 'Hangry', 'Crowned' : 'Crowned', 'Eternamax' : 'Eternamax', 'Single Strike' : 'Single Strike', 'Rapid Strike' : 'Rapid Strike', 'Cell' : 'Cell', 'Complete' : 'Complete', 'Core' : 'Core', 'Partial' : 'Partial', 'Unbound' : 'Unbound', 'Baile' : 'Baile', 'Pau' : 'Pau', 'PomPom' : 'PomPom', 'Sensu' : 'Sensu', 'Midday' : 'Midday', 'Midnight' : 'Midnight', 'Dusk' : 'Dusk', 'School' : 'School', 'Meteor' : 'Meteor', 'Dusk Mane' : 'Dusk Mane', 'Dawn Wings' : 'Dawn Wings', 'Ultra' : 'Ultra', 'Average' : 'Average', 'Small' : 'Small', 'Large' : 'Large', 'Super' : 'Super', 'F' : 'F', 'M' : 'M', 'Shield' : 'Shield', 'Blade' : 'Blade', 'Mega' : 'Mega', 'Mega X' : 'Mega X', 'Mega Y' : 'Mega Y', 'Primal' : 'Primal', 'Origin' : 'Origin', 'Resolute' : 'Resolute', 'Aria' : 'Aria', 'Pirouette' : 'Pirouette', 'Sky' : 'Sky', 'Therian' : 'Therian', 'Black' : 'Black', 'White' : 'White', 'Attack' : 'Attack', 'Defense' : 'Defense', 'Speed' : 'Speed', 'Plant' : 'Plant', 'Sandy' : 'Sandy', 'Steel' : 'Steel', 'Alolan' : 'Alolan', 'Galarian' : 'Galarian', 'Hisuian' : 'Hisuian', 'Zen Mode' : 'Zen Mode', 'Galarian Zen' : 'Galarian Zen', 'Red Striped' : 'Red Striped', 'Blue Striped' : 'Blue Striped', 'White Striped' : 'White Striped', 'Heat' : 'Heat', 'Wash' : 'Wash', 'Phone' : 'Phone', 'Pokedex' : 'Pokedex', 'Frost' : 'Frost', 'Spin' : 'Spin', 'Cut' : 'Cut' }
    let parsedName = pokemon;
    try{
        if(pokemon.startsWith('Shiny')) parsedName = parsedName.replace('Shiny ', '')
        if(pokemon.startsWith('Dark')) parsedName = parsedName.replace('Dark ', '')
        if(pokemon.startsWith('Mystic')) parsedName = parsedName.replace('Mystic ', '')
        if(pokemon.startsWith('Metallic')) parsedName = parsedName.replace('Metallic ', '')
        if(pokemon.startsWith('Shadow')) parsedName = parsedName.replace('Shadow ', '')
        if(pokemon.includes('(')) { 
    if(pokemon.includes('(')) { 
        if(pokemon.includes('(')) { 
            let SubName = pokemon.slice(pokemon.indexOf('('));
            if(validParanthesis[SubName.slice(1,-1)]===undefined) {
                parsedName = parsedName.replace(SubName, '')
                parsedName = parsedName.slice(0,-1)
            }
        }
        return parsedName
    }
    catch(e){
        return(e)
    }
}

document.addEventListener('keydown', (event) => {
    var code = event.code;
    AUTOBATTLE = true;
    if(code==="ShiftLeft") autoNext();
  }, false);
  
async function autoNext () {
    checkPage().then(async (e)=> {
        // console.log(e);
        switch(e){
            case "Start":
                const currentSideQuestNo = window.location.href.slice(48,-1)
                await chrome.storage.local.set({'currentSideQuestNo' : currentSideQuestNo})
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
                if(AUTOBATTLE && currentSideQuestNo <= SIDEQUESTNO && TRAINFIRSTPOKE) {
                    document.getElementsByTagName("form")[0].submit()
                }
                else if (AUTOBATTLE && currentSideQuestNo <= SIDEQUESTNO) {
                    await SelectBestPokeAndContinue(); 
                    // document.getElementsByTagName("form")[0].submit()
                }
                    
                break;
            case "Select" :
                await SelectBestPokeAndContinue(); 
                break
            case "Battle" :
                await chrome.storage.local.get('currentSideQuestNo', async function(result) {
                    const _currentSideQuestNo = result.currentSideQuestNo
                    var content = document.getElementById('content')
                    var iDiv = document.createElement('h2');
                    iDiv.id = 'block';
                    iDiv.className = 'block';
                    iDiv.textContent = `current sidequest is ${_currentSideQuestNo}, stopping : ${SIDEQUESTNO}`
                    iDiv.style.backgroundColor = "maroon"
                    iDiv.style.color = "white"
                    iDiv.style.borderRadius = "25px"
                    iDiv.style.padding = 5
                    if(document.getElementById('block')===null) content.insertBefore(iDiv, content.firstChild);
                    const header = document.querySelector('h3.heading-maroon.no-right-border-rad.margin-right-2');
                    if(header!==undefined && header!==null && header.innerText === 'Attack Results'){
                        if(SUBMIT) document.getElementsByTagName("form")[1].submit()  
                    }
                    if(header!==undefined && header!==null && header.innerText === 'Select an Attack'){
                        let enemyPokemon = document.querySelectorAll('h4')[0].innerText.slice(0,document.querySelectorAll('h4')[0].innerText.indexOf(' - '))
                        if(enemyPokemon.slice(-1)===' ') enemyPokemon = enemyPokemon.slice(0,-1)
                        const defender = pokemonParser(enemyPokemon)
                        pokedex = await(fetchDex('poke'))
                        if(pokedex[defender]!==undefined){
                            let myPokemon = document.querySelectorAll('h4')[1].innerText.slice(0,document.querySelectorAll('h4')[1].innerText.indexOf(' - '))
                            if(myPokemon.slice(-1)===' ') myPokemon = myPokemon.slice(0,-1)
                            const attacker = pokemonParser(myPokemon)
                            const movelist = []
                            for(let i=0;i<4;i++) movelist.push(document.getElementsByClassName('height-100 pad-top-5')[i].innerText)
                            const _bestMove = await bestMove(attacker, defender, movelist)
                            console.log(_bestMove)
                            const bestMoveIndex = movelist.indexOf(_bestMove.move)   
                        const bestMoveIndex = movelist.indexOf(_bestMove.move)   
                            const bestMoveIndex = movelist.indexOf(_bestMove.move)   
                            console.log(bestMoveIndex)
                            document.getElementsByClassName('height-100 pad-top-5')[bestMoveIndex].click()
                            if(SUBMIT) document.getElementsByTagName("form")[1].submit()
                        }
                    }
                  });
                  setTimeout(()=>{document.getElementsByTagName("form")[1].submit()}, 4000) 
                break
            case "BattleAttackResults" :
                if (SUBMIT) document.getElementsByTagName("form")[1].submit()
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
            case "SidequestCompletion":
                document.getElementsByClassName('button-black button-large margin-top-10 margin-bottom-15')[0].click()
                break
            case "SidequestPrize":
                const prizes = document.querySelector('div.alert-green').nextElementSibling.innerText.replaceAll('\n', ', ')
                prizes[0] = "$" + prizes[0]
                alert(prizes)
                break
            case "Battletower" :
                document.getElementsByClassName('button-maroon button-small width-25 margin-bottom-10')[0].click()
            case "Team" :
                const teamList = [];
                const teamdex = {};

                for(let i =0; i<document.querySelectorAll('h4.color-maroon').length; i+=2){teamList.push(pokemonParser(document.querySelectorAll('h4.color-maroon')[i].children[0].innerText))}
                for(let i = 0; i < teamList.length; i++ ){
                    teamdex[teamList[i]] = document.getElementsByClassName('back')[i].children[0].children[3].innerHTML.replace('\n<b class="color-maroon" style="backface-visibility: hidden;">\n<i class="ion-flash" style="backface-visibility: hidden;"></i> Attacks <i class="ion-flash" style="backface-visibility: hidden;"></i>\n</b><br style="backface-visibility: hidden;">\n','').replaceAll('<br style="backface-visibility: hidden;">\n', ', ').replace('\n', '').split(', ')
                }
                chrome.storage.local.set({'teamdex': teamdex});
                // do nothing
                break;
            default:
                break
        }
    });
}

async function SelectBestPokeAndContinue() {
    chrome.storage.local.get('teamdex', async (e) => { console.log(e.teamdex); });
    const availPoke = await availPokemonMatchup();
    const defender = pokemonParser(availPoke.opponentPokemon);
    pokedex = await (fetchDex('poke'));
    Promise.all([availPokemonMatchup(), fetchDex('poke'), bestPokemon(availPoke.myPokemonList, availPoke.opponentPokemon)]).then((values) => {
        console.log(values);
    });
    if (pokedex[defender] !== undefined) {
        // const bestPoke = await bestPokemon(availPoke.myPokemonList, availPoke.opponentPokemon).then(response => console.log(response))
        const bestPoke = await bestPokemon(availPoke.myPokemonList, availPoke.opponentPokemon).then(async (e) => {
            const parsedPoke = pokemonParser(e);
            console.log(parsedPoke);
            const pokeSelect = document.getElementsByClassName('height-100 pad-top-30');
            for (let i = 0; i < 6; i++) {
                if (pokemonParser(pokeSelect[i].children[2].children[0].children[0].innerText) === parsedPoke)
                    pokeSelect[i].click();
                if (SUBMIT)
                    document.getElementsByTagName("form")[0].submit();
            }
        });
    }
    if (SUBMIT)
        setTimeout(() => { document.getElementsByTagName("form")[0].submit(); }, 6000);
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

    if(document.querySelector('div.alert-green')!==null){
        return pages.SidequestPrize
    }

    if(document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0]!==null && document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0]!==undefined){
        return pages.Sidequest
    }

    if(document.getElementsByClassName('button-black button-large margin-top-10 margin-bottom-15')[0]!==null && document.getElementsByClassName('button-black button-large margin-top-10 margin-bottom-15')[0]!==undefined){
        return pages.SidequestCompletion
    }

    const battle = document.getElementsByClassName("heading-maroon no-right-border-rad margin-right-2");
    if (battle[0] !== undefined) {
        if(battle[0].innerHTML === "Attack Results") return pages.Battle
        if(battle[0].innerHTML === "Select an Attack") return pages.Battle;
    }

    const h2header = document.querySelector('h2.heading-maroon.no-bot-border-rad.margin-bottom-3')
    if(h2header!== undefined && h2header!== null) {
        if(h2header.textContent === 'Sorry, you lost the battle.') return pages.Next
        if(h2header.textContent === 'Season Battle Tower') return pages.Battletower;
        if(h2header.textContent === 'Manage Your Pokémon Team') return pages.Team;
    }

    const alert = document.getElementsByClassName('alert-red')
    if (alert[0]!== undefined && alert[0]!==null){
        if(alert[0].innerHTML.slice(44) === 'An error has occurred. Please try again later.') return pages.Error
    }

    if(console.log(document.body.children.length === 2)) return pages.Error

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


// Check if string is Numeric
function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str)) 
  }