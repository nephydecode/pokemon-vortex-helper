const pages = {
    Start: "Start",
    Select : "Select",
    Battle : "Battle",
    Next : "Next"
}

let currentPage;

document.addEventListener('keydown', (event) => {
    var name = event.key;
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
        currentPage = "Next";
        return pages.Next;
    }

    // BATTLE PAGE
    const battle = document.getElementsByClassName("heading-maroon no-right-border-rad margin-right-2");
    if (battle[0] !== undefined && battle[0].innerHTML == "Select an Attack" || battle !== undefined && battle[0].innerHTML === "Attack Results") {
        currentPage = "Battle";
        return pages.Battle;
    }

    // COMPLETE BATTLE PAGE
    if (document.getElementsByClassName("heading-maroon no-bot-border-rad margin-bottom-3")[0].innerHTML === "Congratulations! You won the battle!") { 
        currentPage = "Next";
        return pages.Next;
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