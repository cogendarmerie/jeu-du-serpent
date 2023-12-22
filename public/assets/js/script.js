window.onload = function (){
    //begin:intro
    document.querySelector("#intro button").addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById("intro").classList.add("hidden");
    });
    // end:intro

    //begin::clock
    const clock = document.querySelector('#clock');
    clock.innerHTML = new Date().toLocaleTimeString();
    //Afficher l'heure en temps reel
    setInterval(function(){
        clock.innerHTML = new Date().toLocaleTimeString();
    }, 1000);
    // end::clock

    const canvasHeight = 600;
    const canvasWidth = 900;
    let blockSize = 30;
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    let speed = 100;
    let timeout;
    let score = 0; // Millisecond
    let apple;
    let snake;
    let ctx;
    let badAppleEatCount = 0;
    let alertTimeout;

    init();
    function init() {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        document.querySelector('#container').appendChild(canvas);
        //Context
        ctx = canvas.getContext('2d');
        showStart();
    }

    function launch(){
        snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        apple = new Apple([10, 10]);
        score = 0;
        badAppleEatCount = 0;
        clearTimeout(timeout);
        delay = 100;
        refreshCanvas();
    }

    function showAlert(content, persist = 14000){
        const alert = document.getElementById('alert');
        alert.querySelector("p").innerHTML = content;
        alert.classList.add('show');
        clearTimeout(alertTimeout);
        alertTimeout = setTimeout(() => {
            alert.classList.remove('show');
        }, persist);
    }

    function refreshCanvas(){
        snake.advance();
        //Verifier si le serpent est entrer en collision
        if(snake.checkCollision()){
            const phrases = ['Les murs sont comme les limites du serpent : elles sont là pour lui rappeler qu\'il doit rester dans le game.', 'Quand le serpent rencontre le mur, c\'est comme une discussion entre un perroquet et une porte - ça ne mène nulle part !', 'Hé, serpent, les murs ne sont pas des partenaires de danse, laisse-les tranquilles !', 'Le serpent pense que les murs sont comme des côtes flottantes : ils bougent quand il s\'approche un peu trop près.', 'On dirait que le serpent a choisi les murs comme ses partenaires de jeu préférés. Il ne cesse de les fréquenter !', 'Si seulement les murs pouvaient parler, ils raconteraient des histoires incroyables sur le nombre de fois où ce serpent est venu dire bonjour.'];
            showAlert(phrases[Math.floor(Math.random() * phrases.length)]);
            gameOver();
            return;
        }
        //Verifiier si le serpent se rentre dans lui meme
        if(snake.checkSelfCollision()){
            const phrases = ["Erreur de direction : queue n'est pas au menu!", "Je mords ma queue... encore? C'est du réchauffé!", "Serpent dans un dilemme auto-dévorant!", "Se mordre la queue : pas le meilleur plan, serpy!"];
            showAlert(phrases[Math.floor(Math.random() * phrases.length)]);
            gameOver();
            return;
        }
        //Verifier si le serpent a manger une pomme
        if(snake.isEatingApple(apple)) {
            if(apple.bad===1){
                badAppleEatCount++;
                score--;
                if(badAppleEatCount >= 3 || score<=0){
                    const phrases = ["Alerte à la surdose de dégoût : le serpent a abusé des pommes pourries!", "Quelque chose me dit que ce serpent a un goût pour le mauvais fruit!", "Vous aviez été mis en garde : manger des pommes pourries, c'est comme danser avec un rhinocéros... ça peut vous laisser des séquelles !", "Répéter que les pommes pourries ne sont pas comestibles, c'est comme répéter à un chat qu'il ne devrait pas chasser les licornes. Ça devrait être évident, mais apparemment, on insiste !"];
                    showAlert(phrases[Math.floor(Math.random() * phrases.length)]);
                    gameOver();
                    return;
                }
            } else {
                score++;
            }
            snake.eatApple = true;
            do {
                apple.setNewPosition();
            } while(apple.isOnSnake(snake))
            if(score % 5 === 0){
                speedUp();
            }
        }
        ctx.clearRect(0,0,canvasWidth, canvasHeight);
        drawScore();
        snake.draw();
        apple.draw();
        timeout = setTimeout(refreshCanvas, delay);
    }

    function write(text, font, position){
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = '#210124';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = '5';
        ctx.strokeText(text, position[0], position[1]);
        ctx.fillText(text, position[0], position[1]);
        ctx.restore();
    }

    function gameOver(){
        write('Game Over', 'bold 70px sans-serif', [centreX, centreY - 180]);
        write('Appuyer sur espace pour rejouer', 'bold 30px sans-serif', [centreX, centreY - 120]);
    }

    function showStart(){
        write('Jeu du serpent', 'bold 70px sans-serif', [centreX, centreY - 180]);
        write('Appuyer sur espace pour jouer', 'bold 30px sans-serif', [centreX, centreY - 120]);
    }

    function drawScore() {
        ctx.save();
        ctx.font = 'bold 200px sans-serif';
        ctx.fillStyle = '#5ab778';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function speedUp(){
        speed /= 1.1;
    }

    function drawBlock(ctx, position){
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    //Draw Snake
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        this.draw = function (){
            ctx.save();
            ctx.fillStyle = "green";
            for(let i = 0; i < body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        }
        this.advance = function (){
            const nextPosition = this.body[0].slice();
            switch (this.direction){
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                default:
                    throw('Invalid Direction');
            }
            this.body.unshift(nextPosition);
            if(!this.eatApple)
                this.body.pop();
            else
                this.eatApple = false;
        };

        this.setDirection = function (newDirection){
            let allowedDirections;
            switch (this.direction){
                case "left":
                case "right":
                    allowedDirections = ['up', 'down'];
                    break;
                case "down":
                case "up":
                    allowedDirections = ['left', 'right'];
                    break;
                default:
                    throw('Invalid direction');
            }
            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        //Verifier si le serpent est entrer en collision avec lui meme
        this.checkSelfCollision = function() {
            const head = this.body[0];
            for(let i = 1; i < this.body.length; i++) {
                const segment = this.body[i];
                if(head[0] === segment[0] && head[1] === segment[1]) {
                    return true;
                }
            }
            return false;
        };
        //Verifier si le serpent est entrer en collision
        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1);
            const snakeX = head[0];
            const snakeY = head[1];
            const minX = 0;
            const minY = 0;
            const maxX = widthInBlocks-1;
            const maxY = heightInBlocks-1;
            const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            wallCollision = isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls;
            for(let i = 0;i < rest.length;i++){
                snakeCollision = snakeX === rest[i][0] && snakeY === rest[i][1];
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat){
            const head = this.body[0];
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
        };
    }

    function Apple(position){
        this.position = position;
        this.bad = false;
        this.draw = function(){
            const radius = blockSize / 2;
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ctx.save();
            if(this.bad === 1){
                ctx.fillStyle = "#210124";
            } else {
                ctx.fillStyle = "#750D37";
            }
            ctx.beginPath();
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.badApple = function(){
            this.bad = Math.floor(Math.random() * 2);
            if(this.bad === 1){
                setTimeout(()=>{
                    this.bad = 0;
                }, Math.floor(Math.random() * 4000));
            } else {
                setTimeout(()=>{
                    this.bad = 1;
                    setTimeout(()=>{
                        this.bad = 0;
                    }, Math.floor(Math.random() * 4000));
                }, Math.floor(Math.random() * 4000));
            }
            return this.bad;
        }
        this.setNewPosition = function(){
            const newX = Math.round(Math.random() * (widthInBlocks - 1));
            const newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX,newY];
            this.bad = this.badApple();
        };
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;
            for(let i = 0;i < snakeToCheck.body.length;i++){
                isOnSnake = this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1];
            }
            return isOnSnake;
        };
    }

    window.addEventListener('keyup', function (e){
        let direction;
        switch (e.code){
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'Space':
                launch();
                return;
        }
        snake.setDirection(direction);
    });
}