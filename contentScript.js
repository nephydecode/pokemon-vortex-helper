
// VARIABLE - Stop at this number
const SIDEQUESTNO = 9999;
const STOPATLEGENDARY = false;
const FASTESTRUN = false;
const BATTLETOWER = true;

const TIMER = FASTESTRUN ? 100 : (Math.random()+0.1)*1000+150;
const intervalChecker = setInterval(()=> autoNext(), TIMER);

const pages = {
    Start: "Start",
    Select : "Select",
    Battle : "Battle",
    Next : "Next",
    Error : "Error",
    Sidequest : "Sidequest",
    Team : "Team"
}

document.addEventListener('keydown', (event) => {
    var code = event.code;
    if(code==="ShiftLeft") autoNext();
  }, false);
  
function autoNext () {
    checkPage().then((e)=> {
        console.log(e);
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