
var songQueue = [];
var currentQ = 69;
var spins = 1;
const userId = Math.random() * 128
var stopped = false;
var myScore = 0;
var opScore = 0;
var count = 0;

var connection = new signalR.HubConnectionBuilder()
  	.withUrl('', { accessTokenFactory: () => this.loginToken })
	.build()


connection.on("initSignal", (message) => {
    console.log("Signal initialized, message:" + message);
})

connection.on("search", (message) => {
    console.log("Connected to search, messeage:" + message);
})

connection.on("answer", (message) => {
	count += 1
	if((count == 2 || message.result)){

		stopped = true;
		document.getElementById('audio-control').pause();
		addScore(message.result, message.id);

		if(message.result) {

			document.getElementById("ans"+(message.index+1)).style.color = "green";
			document.getElementById("ans"+(message.index+1)).style.backgroundColor = "rgba(0, 255, 0, 0.1)";

		} else {

			document.getElementById("ans"+(message.index+1)).style.color = "red";
			document.getElementById("ans"+(message.index+1)).style.backgroundColor = "rgba(255, 0, 0, 0.1)";
		
		}
					
		setTimeout(() => {
			resetColors();
			setSongs();
			stopped = false;
			count = 0;
		}, 2000);
	} else {
		onWrong(message);
		}
	})


	connection.on("game", (message) => {
		songQueue = [];
		document.getElementById('searching').style.visibility = "hidden";
		document.getElementById('game-content').style.visibility = "visible";
    	setSongs();
	})


	connection.onclose(() => console.log('disconnected'));

	connection.start();

function onWrong(message){
	document.getElementById("ans"+(message.index+1)).style.color = "red";
	document.getElementById("ans"+(message.index+1)).style.backgroundColor = "rgba(255, 0, 0, 0.1)";
	if (message.id == userId) {
		stopped = true;
		}
}

function sendMessage(userId){
	document.getElementById('start-button').style.visibility = "hidden";
	document.getElementById('searching').style.visibility = "visible";

	var xmlhttp = new XMLHttpRequest(); 
	var theUrl = "";
	xmlhttp.open("POST", theUrl);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(userId);
}

function setSongs(){

	if(songQueue.length == 0){
		end();
	} else {
		currentQ = songQueue.shift();
		var songName = findButtonClicked(currentQ, currentQ.correctIndex).replace(" ", "%20")
		moveToNext("" + songName + ".mp3")
		document.getElementById('ans1-text').innerHTML = currentQ.song1.name;
		document.getElementById('ans2-text').innerHTML = currentQ.song2.name;
		document.getElementById('ans3-text').innerHTML = currentQ.song3.name;
		document.getElementById('ans4-text').innerHTML = currentQ.song4.name;
	}
}

function end(){
	var text = "";
	document.getElementById('game-content').style.visibility = "hidden";
	document.getElementById('end').style.visibility = "visible";
	if(myScore > opScore) {
		text = "You Won!";
	} else if (opScore > myScore) {
		text = "You lost!";
	} else {
		text = "Draw!"
	}
	document.getElementById('end-text').innerHTML = text;
}

function resetColors(){
	document.getElementById("ans1").style.color = "black";
	document.getElementById("ans1").style.backgroundColor = "rgba(0, 255, 0, 0)";
	document.getElementById("ans2").style.color = "black";
	document.getElementById("ans2").style.backgroundColor = "rgba(0, 255, 0, 0)";
	document.getElementById("ans3").style.color = "black";
	document.getElementById("ans3").style.backgroundColor = "rgba(0, 255, 0, 0)";
	document.getElementById("ans4").style.color = "black";
	document.getElementById("ans4").style.backgroundColor = "rgba(0, 255, 0, 0)";
}


function moveToNext(song) {
	var audioPlayer = document.getElementById('audio-src');
	audioPlayer.src = song;
	document.getElementById('audio-control').load();
	document.getElementById('audio-control').play();
}

function playAudio(){
	if(3 > spins) {
		document.getElementById('audio-control').play();
		spins += 1;
		date = new Date();
	}
}

function checkAnswer(index){
	if(!stopped) {
		stopped = true;
		
		if (currentQ.correctIndex == index) {
			sendAnswer(JSON.stringify({id: userId, result: true,index: index}));
	 	} else {
 			sendAnswer(JSON.stringify({id: userId, result: false,index: index}));
	 	}
	}
}

function sendAnswer(answer) {
	var xmlhttp = new XMLHttpRequest(); 
	var theUrl = "";
	xmlhttp.open("POST", theUrl);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(answer);
}

function findButtonClicked(object, index){
	if(index == 0) {
		return object.song1.name;
	} else if (index == 1) {
		return object.song2.name;
	} else if (index == 2) {
		return object.song3.name;
	} else {
		return object.song4.name;
	}
}

function onHover(){
	document.getElementById("ans"+(message.index+1)).style.color = "gray";
	document.getElementById("ans"+(message.index+1)).style.backgroundColor = "rgba(0, 0, 0, 0.1)";
}

function onNotHover(){
	document.getElementById("ans"+(message.index+1)).style.color = "color";
	document.getElementById("ans"+(message.index+1)).style.backgroundColor = "rgba(0, 0, 0, 0)";
}

function addScore(result, id){
	if(id == userId && result) {			
		myScore += 1;
		document.getElementById("myScore").innerHTML = "Your Score: " + myScore;
	} else if (result && id != userId) {
		opScore += 1;
		document.getElementById("opScore").innerHTML = "Opponent's Score: " + opScore;
	}
}

window.onkeypress = function(event) {
	if (event.keyCode == 49 || event.keyCode == 50 || event.keyCode == 51 || event.keyCode == 52) {
		checkAnswer(event.keyCode-49)
	}
}

function testUnique() {
	var xmlhttp = new XMLHttpRequest(); 
	var theUrl = "";
	xmlhttp.open("POST", theUrl);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(userId);
}
