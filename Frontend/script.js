
var songQueue = [];
var currentQ = 0;
var correct = 0;
var date = new Date();
var totalDate = new Date();
var spinData;
var data = [];
var spins = 1;


function launchRequest(){
	var xmlhttp = new XMLHttpRequest();
	var url = ""
	console.log("request launched!")
	xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		processSongData(this.responseText);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function parseResponse(myArr){
	var arr = JSON.parse(myArr);
	for(var i = 0; i < arr.length; i++){
		songQueue.push(createQuestion(arr, i));
	}
}

function setSongs(){
	console.log("Songs set");
	if(currentQ != 0){
		recordData();
	}
	currentQ = songQueue.shift();
	var songName = currentQ.songs[currentQ.correct-1].song.name.replace(" ", "%20")
	moveToNext("" + songName + ".mp3")
	document.getElementById('ans1T').innerHTML = currentQ.songs[0].song.name;
	document.getElementById('ans2T').innerHTML = currentQ.songs[1].song.name;
	document.getElementById('ans3T').innerHTML = currentQ.songs[2].song.name;
	document.getElementById('ans4T').innerHTML = currentQ.songs[3].song.name;
}

function processSongData(myArr){
	var arr = JSON.parse(myArr);
	for(var i = 0; i < arr.length; i++){
		songQueue.push(createQuestion(arr, i));
	}
	setSongs();
}

function removeElement(arr, j){
	var newArr = []
	for(var i = 0; i < arr.length; i++){
		if(i != j){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

function createQuestion(arr, j){
	var songs = [arr[j]];
	var newArr = removeElement(arr, j);
	for(var i = 0; i < 3; i++){
		var num = Math.floor(Math.random() * newArr.length);
		songs.push(newArr[num]);
		newArr = removeElement(newArr, num);
	}
	var ran = Math.floor(Math.random() * songs.length-1)+1;
	const temp = songs[0];
	songs[0] = songs[ran];
	songs[ran] = temp;
	
	var question = {songs: songs,correct: ran+1}
	return question;
} 


function checkAnswer(index){
	 if(songQueue.length == 0){
	 	postData();
	 	document.getElementById('message').innerHTML = "Finished!";
	 	return;
	 }
	 if (currentQ.correct == index) {
	 	correct++;
		onSongClicked(true)
	 	setSongs();
	 } else {
 		onSongClicked(false)
		setSongs();
	 }
}

function playAudio(){
	if(3 > spins) {
		document.getElementById('audio-control').play();
		spins += 1;
		date = new Date();
	}
}


function moveToNext(song) {
	var audioPlayer = document.getElementById('audio-src');
	audioPlayer.src = song;
	document.getElementById('audio-control').load();
	document.getElementById('audio-control').play();
}

function recordData(){
	var songName = currentQ.songs[currentQ.correct-1].song.name;
	const songData = {song: songName, spinData: spinData, spins: spins}
	spins = 1;
	spinData = [];
	data.push(songData);
	console.log(JSON.stringify(songData));
	date = new Date();
}

function onSongClicked(answer){
	console.log("Here");
	var currentTime = new Date();
	const diff = Math.abs(date-currentTime);
	const diff2 = Math.abs(totalDate-currentTime);
	var songName = currentQ.songs[currentQ.correct-1].song.name;
	spinData = {spins: spins, finalTime: diff, answer: answer, totalTime: diff2};
}


function postData(){
	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	var theUrl = "";
	xmlhttp.open("POST", theUrl);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send(JSON.stringify(data));
}




