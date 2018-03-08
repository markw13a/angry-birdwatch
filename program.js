window.onload = function(){
	let submitButton = document.querySelector("button");
	submitButton.addEventListener("click", init); 
}

//Having this makes it easier to do any necessary housekeeping before launching main game loop
function init(){
	$('#winner').removeClass('visible');
	$('#loser').removeClass('visible');
	
	startGame();
}

function startGame(){
	//Time between screen refreshes in milliseconds
	let timebase = 10;
	let maximumForce = 1500;
	//Have hard-coded values for image width and height.
	//Would be safer to retrieve actual values from DOM, but we won't worry about that for now
	let bird = {
		xPos: 0,
		yPos: 0,
		xVel: 0,
		yVel: 0,
		xAcc: 0,
		yAcc: -9.81,
		timeElapsed: 0,
		height: 100,
		width: 73
	}
	//x and y coord are actually position of most bottom left pixel in image
	//That's why xPos is displaced 100px to the left of the border
	let oddie = {
		xPos : 1400,
		yPos: 0,
		height: 100,
		width: 100
	}
	
	launchBird(bird, timebase/1000, maximumForce);
	gameLoop();

	function gameLoop(){
		updatePosition(bird, timebase/1000);
		
		if(hasHitTarget(bird, oddie)){
			gameWon();
		}
		else if(hasHitBoundary(bird)){
			gameLost();
		}
		else{
			setTimeout(gameLoop, timebase);
		}
	}
}

function launchBird(bird, timebase, maximumForce){
	let angleInRadians = degreesToRadians(getAngle());
	let resultantForce = getForce() * maximumForce;
	let xComponent;
	let yComponent;
	
	xComponent = resultantForce * Math.cos(angleInRadians);
	yComponent = resultantForce * Math.sin(angleInRadians);
	//Had originally thought about setting xAcc and yAcc equal to corresponding force components,
	//but this is more correct as the force is not applied continuously to the object
	bird.xVel = xComponent * timebase;
	bird.yVel = yComponent * timebase;
}

function degreesToRadians(angle){
	return angle * (Math.PI / 180);
}

function getAngle(){
	return document.querySelector("#angle").value;
}

function getForce(){
	return document.querySelector("#force").value;
}

function updatePosition(bird, timebase){
	//Need to update bird fields as well as actual position of image in DOM
	let dx = bird.xPos + (bird.xVel * bird.timeElapsed) + 0.5 * (bird.xAcc * bird.timeElapsed * bird.timeElapsed);
	bird.xPos = dx;
	
	let dy = bird.yPos + (bird.yVel * bird.timeElapsed) + 0.5 * (bird.yAcc * bird.timeElapsed * bird.timeElapsed);
	bird.yPos = dy;
	//Find and update DOM positions
	let birdElement = $('#bird');
	let regex = /([0-9]*)px/g;
	birdElement.css({'left': dx});
	birdElement.css({'bottom': dy});
	
	//console.log("1st Term: " + bird.yPos + (bird.yVel * bird.timeElapsed));
	//console.log("2nd Term: " + 0.5 * (bird.yAcc * bird.timeElapsed * bird.timeElapsed));
	bird.timeElapsed += timebase;
}

////
function hasHitTarget(bird, oddie){
	if(xCoordsOverlap(bird, oddie) && yCoordsOverlap(bird, oddie)){
		return true;
	}
	else{
		return false;
	}
}

function xCoordsOverlap(bird, oddie){
	//Only need to check extreme boundaries of image for collision
	let birdRightEdge = bird.xPos + bird.width;
	let oddieRightEdge = oddie.xPos + oddie.width;
	//Left boundary
	if(bird.xPos >= oddie.xPos && bird.xPos <= oddieRightEdge){
		return true;
	}
	//Right boundary
	else if(birdRightEdge >= oddie.xPos && birdRightEdge <= oddieRightEdge){
		return true;
	}
	else{
		return false;
	}
}

function yCoordsOverlap(bird, oddie){
	let birdTop = bird.yPos + bird.height;
	let oddieTop = oddie.yPos + oddie.height;
	//Bottom boundary
	if(bird.yPos >= oddie.yPos && bird.yPos <= oddieTop){
		return true;
	}
	//Top boundary
	else if(birdTop >= oddie.yPos && birdTop <= oddieTop){
		return true;
	}
	else{
		return false;
	}
}
////

function hasHitBoundary(bird){
	let xPos = bird.xPos;
	let yPos = bird.yPos;
	
	if(xPos < 0){
		return true;
	}
	else if(xPos > 1500 - bird.width){
		return true;
	}
	else if(yPos > 700 - bird.height){
		return false; //Might be fun to disable the height ceiling
	}
	else if(yPos < 0){
		return true;
	}
	else{
		return false;
	}
}

function gameLost(){
	$("#loser").toggleClass('visible');
}

function gameWon(){
	$("#winner").toggleClass('visible');
}