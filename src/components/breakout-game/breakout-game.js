class BreakoutGame {
	constructor() {
		window.addEventListener('load', () => {
			this.init();
		});

		window.addEventListener('resize', () => {
			this.init();
		});
	}

	init(cols = 4) {
		this.container = document.querySelector('[data-breakout-game]');

		if (!this.container) {
			return;
		}

		// Canvas related variables
		var canvas = this.container.querySelector('canvas');
		canvas.width = this.container.offsetWidth;
		canvas.height = this.container.offsetHeight;

		var ctx = canvas.getContext('2d');
		var ballRadius = 20;
		var x = canvas.width / 2;
		var y = canvas.height - 30;
		var dx = 3;
		var dy = -3;
		var paddleHeight = Math.round(canvas.height * 0.06);
		var paddleWidth = Math.round(canvas.height * 0.45);
		var paddleX = (canvas.width - paddleWidth) / 2;
		var rightPressed = false;
		var leftPressed = false;
		var brickColumnCount = 4;
		var brickRowCount = 12;
		var brickPadding = 2;
		var brickOffsetTop = 0;
		var brickOffsetLeft = 20;
		var brickWidth = Math.round(canvas.width / brickColumnCount);
		var brickHeight = 20;
		var score = 0;
		var lives = 999;

		var bricks = [];
		for (var c = 0; c < brickRowCount; c++) {
			bricks[c] = [];
			for (var r = 0; r < brickColumnCount; r++) {
				bricks[c][r] = { x: 0, y: 0, status: 1 };
			}
		}

		document.addEventListener('keydown', keyDownHandler, false);
		document.addEventListener('keyup', keyUpHandler, false);
		document.addEventListener('mousemove', mouseMoveHandler, false);

		function keyDownHandler(e) {
			if (e.key == 'Right' || e.key == 'ArrowRight') {
				rightPressed = true;
			} else if (e.key == 'Left' || e.key == 'ArrowLeft') {
				leftPressed = true;
			}
		}

		function keyUpHandler(e) {
			if (e.key == 'Right' || e.key == 'ArrowRight') {
				rightPressed = false;
			} else if (e.key == 'Left' || e.key == 'ArrowLeft') {
				leftPressed = false;
			}
		}

		function mouseMoveHandler(e) {
			var relativeX = e.clientX - canvas.offsetLeft;
			if (relativeX > 0 && relativeX < canvas.width) {
				paddleX = relativeX - paddleWidth / 2;
			}
		}
		function collisionDetection() {
			for (var c = 0; c < brickRowCount; c++) {
				for (var r = 0; r < brickColumnCount; r++) {
					var b = bricks[c][r];
					if (b.status == 1) {
						if (
							x > b.x &&
							x < b.x + brickWidth &&
							y > b.y &&
							y < b.y + brickHeight
						) {
							dy = -dy;
							b.status = 0;
							score++;
							if (score == brickColumnCount * brickRowCount) {
								document.location.reload();
							}
						}
					}
				}
			}
		}

		function drawBall() {
			ctx.beginPath();
			ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
			ctx.fillStyle = getComputedStyle(
				document.documentElement,
			).getPropertyValue('--ball-color');
			ctx.fill();
			ctx.closePath();
		}
		function drawPaddle() {
			ctx.beginPath();
			ctx.roundRect(
				paddleX,
				canvas.height - paddleHeight,
				paddleWidth,
				paddleHeight,
				8,
			);
			ctx.fillStyle = getComputedStyle(
				document.documentElement,
			).getPropertyValue('--paddle-color');
			ctx.fill();
			ctx.closePath();
		}
		function drawBricks() {
			for (var c = 0; c < brickRowCount; c++) {
				for (var r = 0; r < brickColumnCount; r++) {
					if (bricks[c][r].status == 1) {
						var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
						var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
						bricks[c][r].x = brickX;
						bricks[c][r].y = brickY;
						ctx.font = '16px Arial';
						ctx.fillText(
							'ОШИБКА 404. СТРАНИЦА БЫЛА УТЕРЯНА',
							brickX,
							brickY - brickHeight / 3.3,
						);
						// ctx.beginPath();
						// ctx.rect(brickX, brickY, brickWidth, brickHeight);
						ctx.fillStyle = getComputedStyle(
							document.documentElement,
						).getPropertyValue('--bricks-color');
						// ctx.fill();
						// ctx.closePath();
					}
				}
			}
		}
		function drawScore() {
			ctx.font = '16px Arial';
			ctx.fillStyle = '#0095DD';
			ctx.fillText('Score: ' + score, 8, 20);
		}
		function drawLives() {
			ctx.font = '16px Arial';
			ctx.fillStyle = '#0095DD';
			ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawBricks();
			drawBall();
			drawPaddle();
			// drawScore();
			// drawLives();
			collisionDetection();

			if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
				dx = -dx;
			}
			if (y + dy < ballRadius) {
				dy = -dy;
			} else if (y + dy > canvas.height - ballRadius) {
				if (x > paddleX && x < paddleX + paddleWidth) {
					dy = -dy;
				} else {
					lives--;
					if (!lives) {
						document.location.reload();
					} else {
						x = canvas.width / 2;
						y = canvas.height - 30;
						dx = 3;
						dy = -3;
						paddleX = (canvas.width - paddleWidth) / 2;
					}
				}
			}

			if (rightPressed && paddleX < canvas.width - paddleWidth) {
				paddleX += 7;
			} else if (leftPressed && paddleX > 0) {
				paddleX -= 7;
			}

			x += dx;
			y += dy;
			requestAnimationFrame(draw);
		}

		draw();
	}
}

export default new BreakoutGame();
