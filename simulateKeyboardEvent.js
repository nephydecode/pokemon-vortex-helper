/**
 * Simulate a key event.
 * @param {Number} keyCode The keyCode of the key to simulate
 * @param {String} type (optional) The type of event : down, up or press. The default is down
 * @param {Object} modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
 * 
 * NOTE:
 * | keycode | Button |
 * | ------- | ------ |
 * |   32    |  Space |
 * |   37    |  Left  |
 * |   38    |   Up   |
 * |   39    |  Right |
 * |   40    |  Down  |
 */

 const keyButton = { "Space" : 32, "Left" : 37, "Up" : 38, "Right" : 39, "Down" : 40}

 function simulateKey (keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";	
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;
	
	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

// Setup some tests

var onKeyEvent = function (event) {
	var state = "pressed";
	
	if (event.type !== "keypress") {
		state = event.type.replace("key", "");
	}
	
	console.log("Key with keyCode " + event.keyCode + " is " + state);
};

document.addEventListener("keypress", onKeyEvent, false);
document.addEventListener("keydown", onKeyEvent, false);
document.addEventListener("keyup", onKeyEvent, false);

// Using the function
// simulateKey(38);
// simulateKey(38, "up");
// simulateKey(45, "press"); 

const MoveForSeconds = 1.5
const WaitForSeconds = 5


// LEFT (1.5S), WAIT2S, RIGHT(1.5S), WAIT2S - repeat
setInterval(()=> {
	simulateKey(keyButton["Left"], "down");
	setTimeout(()=> {simulateKey(keyButton["Left"], "up")},MoveForSeconds*1000);
}, (MoveForSeconds+WaitForSeconds)*2000)

setTimeout(()=>{
	setInterval(()=> {
		simulateKey(keyButton["Right"], "down");
		setTimeout(()=> {simulateKey(keyButton["Right"], "up")},MoveForSeconds*1000);
	}, (MoveForSeconds+WaitForSeconds)*2000)
},(MoveForSeconds+WaitForSeconds)*1000)