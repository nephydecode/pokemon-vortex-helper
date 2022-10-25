
setInterval(()=> {
    autoNext();
}, 500)

const pages = {
    Start: "Start",
    Select : "Select",
    Battle : "Battle",
    Next : "Next",
    Error : "Error",
    Sidequest : "Sidequest"
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
                window.location.href = 'https://www.pokemon-vortex.com/sidequests/'
                break
            case "Sidequest" :
                document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0].click()
                break
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

    if(document.querySelector('h3.heading-maroon')!==null 
        && document.querySelector('h3.heading-maroon')!==undefined
        && document.querySelector('h3.heading-maroon').innerText!==null 
        && document.querySelector('h3.heading-maroon').innerText == 'An error has occurred, please refresh the page or return to the battle select page you came from.'){
        return pages.Error;
    }

    if(document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0]!==null && document.getElementsByClassName('button-maroon button-large margin-bottom-15 margin-top-10')[0]!==undefined){
        return pages.Sidequest;
    }

    // BATTLE PAGE
    const battle = document.getElementsByClassName("heading-maroon no-right-border-rad margin-right-2");
    if (battle[0] !== undefined && battle[0].innerHTML == "Select an Attack" || battle !== undefined && battle[0].innerHTML === "Attack Results") {
        return pages.Battle;
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