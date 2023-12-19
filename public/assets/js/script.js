window.onload = function (){
    const canvasHeight = 600;
    const canvasWidth = 900;
    let blockSize = 30;
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    let loose = false;
    let duration = 30;
    let speed = 100;
    let timeout;
    let score = 0; // Millisecond
    let apple;
    let snake;
    let ctx;

    init();
    function init() {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        document.body.appendChild(canvas);
        //Context
        ctx = canvas.getContext('2d');
        showStart();
    }

    function launch(){
        snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        apple = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        delay = 100;
        refreshCanvas();
    }

    function refreshCanvas(){
        snake.advance();
        //Verifier si le serpent est entrer en collision
        if(snake.checkCollision()){
            gameOver();
            return;
        }
        //Verifier si le serpent a manger une pomme
        if(snake.isEatingApple(apple)) {
            score++;
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
        ctx.fillStyle = 'black';
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
        ctx.fillStyle = 'gray';
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
        this.draw = function(){
            const radius = blockSize / 2;
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ctx.save();
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            const newX = Math.round(Math.random() * (widthInBlocks - 1));
            const newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX,newY];
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