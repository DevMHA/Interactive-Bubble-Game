let canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let c = canvas.getContext("2d")





class Ball {

    constructor(x, y) {
        this.isHovered = false;
        this.baseR = 30
        this.r = this.baseR;
        this.x = x || randomInFromInterval(0 + this.r, window.innerWidth - this.r);
        this.y = y || randomInFromInterval(0 + this.r, window.innerHeight - this.r);
        this.vx = (Math.random() - .5) * 4
        this.vy = (Math.random() - .5) * 4
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.letter = letters[Math.floor(Math.random() * letters.length)];
        this.draw()


    }
    draw() {

        c.save(); 
        if (this.isHovered) {
            c.shadowBlur = 30;             
            c.shadowColor = this.color;    
        } else {
            c.shadowBlur = 0;
        }

        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.shadowBlur = 0; 
        c.fillStyle = "white";
        c.font = `${this.r}px Arial`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(this.letter, this.x, this.y);
        c.restore();  
    }

    update() {
        if (this.x + this.r > window.innerWidth || this.x - this.r < 0) {
            this.vx = -this.vx
        }
        if (this.y + this.r > window.innerHeight || this.y - this.r < 0) {
            this.vy = -this.vy
        }
        this.x += this.vx
        this.y += this.vy
        this.draw()

    }



}
let balls = []
for (let i = 0; i < 20; i++) {
    balls.push(new Ball)
}
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update()
    })
    requestAnimationFrame(animate)
}

function changeBackground() {
    const hue = Math.random() * 360;
    canvas.style.background = `hsla(${hue}, 80%, 85%, 0.3)`;
    canvas.style.backdropFilter = "blur(15px)";
    canvas.style.webkitBackdropFilter = "blur(15px)";
}

setInterval(changeBackground, 2000);
changeBackground();


animate()
window.addEventListener('click', function (e) {
    balls.push(new Ball(e.clientX, e.clientY))
})
window.addEventListener('mousemove', function (e) {
    balls.forEach(ball => {
        let distance = Math.sqrt((e.clientX - ball.x) ** 2 + (e.clientY - ball.y) ** 2);

        ball.isHovered = distance < ball.r;  

      
        if (distance < 100 && ball.r < ball.baseR * 4) {
            ball.r += 1;
        } else if (ball.r > ball.baseR) {
            ball.r -= 1;
        }
    });
});

window.addEventListener('resize', function () {
    canvas.width = window.width
    canvas.height = window.height
})

let currentWord = "";
const wordDisplay = document.getElementById("wordDisplay");
const resetBtn = document.getElementById("resetBtn");

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let ball of balls) {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.r) {
            currentWord += ball.letter;
            wordDisplay.textContent = currentWord;

            let utter = new SpeechSynthesisUtterance(ball.letter);
            utter.lang = "en-US";
            speechSynthesis.speak(utter);
            break;
        }
    }
});

const hiddenInput = document.getElementById("hiddenInput");


function focusInput() {
    hiddenInput.focus();
}
focusInput();

document.addEventListener("click", focusInput);


hiddenInput.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
        event.preventDefault();

        if (currentWord.length > 0) {
            currentWord = currentWord.slice(0, -1);
            wordDisplay.textContent = currentWord;
        }
    }
});




function randomInFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)

}