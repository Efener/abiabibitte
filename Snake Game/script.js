const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
//let foodX, foodY, food2X, food2Y;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let velocitymultip = 1;
let snakeBody = [];
let setIntervalId;
let score = 0;
let speedBoostApplied = false;
let time = 100;
let first = true;


// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `En Yüksek Skor: ${highScore}`;


let food1 = {
    score: 1,
    x:0,
    y:0,
    color: "red"
};
let food2 = {
    score:3,
    x:-1,
    y:-1,
    color: "yellow"
};


const updateFoodPosition = (food) => {
    // Passing a random 1 - 30 value as food position
    food.x = Math.floor(Math.random() * 30) + 1;
    food.y = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Oyun Bitti! Tekrar oynamak için TAMAM'a tıklayın...");
    location.reload();
}

const changeDirection = e => {
    // Changing velocity value based on key press
    if(e.key === "w" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "s" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "a" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "d" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${food1.y} / ${food1.x}"></div>`;
    html += `<div class="food2" style="grid-area: ${food2.y} / ${food2.x}; background-color: ${food2.color};"></div>`;

    if(score != 0 && score % 3 == 0 && !speedBoostApplied && time > 20) 
    {
        time/= 1.25;
        speedBoostApplied = true;
        clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, time);
    }
    if(score % 3 !== 0)
    {
        speedBoostApplied = false;
    }

    // Checking if the snake hit the food
    if(snakeX === food1.x && snakeY === food1.y) {
        if(score != 0 && score % 5 === 0)
        {
            updateFoodPosition(food2);
        }
            updateFoodPosition(food1);
            snakeBody.push([food1.y, food1.x]); // Pushing food position to snake body array
            score+= food1.score; // increment score by 1
        
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Skor: ${score}`;
        highScoreElement.innerText = `En Yüksek Skor: ${highScore}`;
    }
    if(snakeX === food2.x && snakeY === food2.y)
    {
        if(score != 0 && score % 5 === 0)
        {
            updateFoodPosition(food2);
        }
        food2.x = -1;
        food2.y = -1;
        snakeBody.push([food2.y, food2.x],[food2.y, food2.x],[food2.y, food2.x]); // Pushing food position to snake body array
        score+= food2.score; // increment score by 3
    
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Skor: ${score}`;
    highScoreElement.innerText = `En Yüksek Skor: ${highScore}`;

    }
    



    // Updating the snake's head position based on the current velocity
    snakeX += velocityX //* velocitymultip;
    snakeY += velocityY //* velocitymultip;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1 ; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position
    console.log(snakeBody.length);
    if(snakeBody.length < 2)
    {
        snakeBody.push(snakeX-1,snakeY);
    }
    

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if(snakeBody.length > 3)
        {
            if (i!= 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
        
    }

    playBoard.innerHTML = html;
}

updateFoodPosition(food1)

    setIntervalId = setInterval(initGame, time);
document.addEventListener("keyup", changeDirection);