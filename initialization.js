document.addEventListener( 'DOMContentLoaded', function() {
	var fillColor = '#333333';

	var canvas = document.querySelector('#pongCanvas');
	var cxt = canvas.getContext('2d');
	cxt.fillStyle = fillColor;
	cxt.width = canvas.width;
	cxt.height = canvas.height;

	var controller = new GameController( cxt );

	var startButton = document.querySelector('#start');
	startButton.addEventListener('click', function() {
		controller.start();
	});

	var stopButton = document.querySelector('#stop');
	stopButton.addEventListener('click', function() {
		controller.stop();
	});
});

class GameController {

	constructor( cxt ) {
		this.ball = new Ball( cxt, -1, -1 );
		this.leftPaddle = new Paddle( cxt, 'left' );
		this.rightPaddle = new Paddle( cxt, 'right' );

		this.ball.draw();
		this.leftPaddle.draw();
		this.rightPaddle.draw();

		this.initializeControls();
		this.frameCount = 0;
	}

	initializeControls() {
		this.speedReference = {
			'38' : -1.75,
			'40' : 1.75,
			'65' : -1.75,
			'90' : 1.75
		};

		var object = this;
		document.onkeydown = function(e) {
			//right paddle
			if( e.keyCode == '38' ) {
				//up arrow
				object.paddleControlKeyPress('right', e.keyCode);
			}
			if( e.keyCode == '40' ) {
				//down arrow
				object.paddleControlKeyPress('right', e.keyCode);
			}

			//left paddle
			if( e.keyCode == '65' ) {
				//'a' key
				object.paddleControlKeyPress('left', e.keyCode);
			}
			if( e.keyCode == '90' ) {
				//'z' key
				object.paddleControlKeyPress('left', e.keyCode);
			}
		};
		document.onkeyup = function(e) {
			//right paddle
			if( e.keyCode == '38' ) {
				//up arrow
				object.paddleControlKeyRelease('right', e.keyCode);
			}
			if( e.keyCode == '40' ) {
				//down arrow
				object.paddleControlKeyRelease('right', e.keyCode);
			}

			//left paddle
			if( e.keyCode == '65' ) {
				//'a' key
				object.paddleControlKeyRelease('left', e.keyCode);
			}
			if( e.keyCode == '90' ) {
				//'z' key
				object.paddleControlKeyRelease('left', e.keyCode);
			}
		}
	}

	advanceFrame() {
		this.ball.moveAtSpeed();
		this.leftPaddle.moveAtSpeed();
		this.rightPaddle.moveAtSpeed();

		this.ball.handleWallDetection();
		this.handlePaddleCollision();
	}

	start() {
		var object = this;
		this.intervalController = setInterval(function() {
			object.advanceFrame();
		}, 5);
	}

	stop() {
		clearInterval(this.intervalController);
	}

	paddleControlKeyPress(paddle, passedControl) {
		if( paddle == 'left' ) {
			if( this.leftPaddle.controlStack.indexOf( passedControl ) == -1 ) {
				this.leftPaddle.controlStack.push(passedControl);
			} else {
				this.leftPaddle.controlStack.splice( this.leftPaddle.controlStack.indexOf( passedControl ), 1);
				this.leftPaddle.controlStack.push(passedControl);
			}
			console.log(this.leftPaddle.controlStack);
			this.setPaddleSpeed('left');
		}
		if( paddle == 'right' ) {
			if( this.rightPaddle.controlStack.indexOf( passedControl ) == -1 ) {
				this.rightPaddle.controlStack.push(passedControl);
			} else {
				this.rightPaddle.controlStack.splice( this.rightPaddle.controlStack.indexOf( passedControl ), 1);
				this.rightPaddle.controlStack.push(passedControl);
			}
			console.log(this.rightPaddle.controlStack);
			this.setPaddleSpeed('right');
		}
	}

	paddleControlKeyRelease(paddle, passedControl) {
		if( paddle == 'left' ) {
			this.leftPaddle.controlStack.reverse();
			this.leftPaddle.controlStack.splice( this.leftPaddle.controlStack.indexOf( passedControl ), 1);
			this.leftPaddle.controlStack.reverse();
			console.log(this.leftPaddle.controlStack);

			if( this.leftPaddle.controlStack.length == 0 )
				this.leftPaddle.ySpeed = 0;
			else
				this.setPaddleSpeed('left');
		}
		if( paddle == 'right' ) {
			this.rightPaddle.controlStack.reverse();
			this.rightPaddle.controlStack.splice( this.rightPaddle.controlStack.indexOf( passedControl ), 1);
			this.rightPaddle.controlStack.reverse();
			console.log(this.rightPaddle.controlStack);

			if( this.rightPaddle.controlStack.length == 0 )
				this.rightPaddle.ySpeed = 0;
			else
				this.setPaddleSpeed('right');
		}
	}

	setPaddleSpeed(paddle) {
		if( paddle == 'left' ) {
			var speed = this.speedReference[ this.leftPaddle.controlStack[ this.leftPaddle.controlStack.length - 1 ] ];
			console.log(speed);
			this.leftPaddle.ySpeed = speed;
		}
		if( paddle == 'right' ) {
			var speed = this.speedReference[ this.rightPaddle.controlStack[ this.rightPaddle.controlStack.length - 1 ] ];
			console.log(speed);
			this.rightPaddle.ySpeed = speed;
		}
	}

	handlePaddleCollision() {
		var directionMultiplier = (this.ball.xSpeed < 0) ? 1 : -1;

		//left paddle
		if( this.ball.left <= this.leftPaddle.left + this.leftPaddle.width &&
			this.ball.left > this.leftPaddle.left &&
			this.ball.top >= this.leftPaddle.top &&
			this.ball.top + this.ball.height <= this.leftPaddle.top + this.leftPaddle.height ) {

			this.ball.paddleBounces++;
			this.ball.xSpeed = -this.ball.xSpeed + (this.ball.paddleBounces / 10 * directionMultiplier);
		}

		//right paddle
		if( this.ball.left + this.ball.width >= this.rightPaddle.left &&
			this.ball.left + this.ball.width < this.rightPaddle.left + this.rightPaddle.width &&
			this.ball.top >= this.rightPaddle.top &&
			this.ball.top + this.ball.height <= this.rightPaddle.top + this.rightPaddle.height ) {
			
			this.ball.paddleBounces++;
			this.ball.xSpeed = -this.ball.xSpeed + (this.ball.paddleBounces / 10 * directionMultiplier);
		}
	}
}

class MovableObject {
	constructor( cxt, width, height, left, top, initialXSpeed, initialYSpeed ) {
		this.cxt = cxt;
		this.setSize(width, height);
		this.setPosition( left, top );
		this.xSpeed = initialXSpeed;
		this.ySpeed = initialYSpeed;
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
	}

	setPosition( left, top ) {
		this.left = left;
		this.top = top;
	}

	draw() {
		this.cxt.fillRect( this.left, this.top, this.width, this.height );
	}

	move( left, top ) { 
		//padded area is to eliminate ghost lines leftover from semi-transparent pixels.
		this.cxt.clearRect( this.left - 0.5, this.top - 0.5, this.width + 1, this.height + 1 ); 

		this.left = left;
		this.top = top;
		this.draw();
	}

	moveAtSpeed() {
		this.move(this.left + this.xSpeed, this.top + this.ySpeed);
	}

	reverseYSpeed() {
		this.ySpeed = -this.ySpeed;
	}
}

class Paddle extends MovableObject {
	constructor( cxt, side ) {

		var width = 6;
		var height = 80;

		super( cxt, width, height, 0, 0, 0, 0);

		this.side = side;
		var left = this.calculateInitialLeftPosition( cxt, side, width );
		var top = this.calculateInitialTopPosition( cxt, height );

		this.setPosition( left, top );	//reset position with new calculations we can do after 'this' is initialized.
		this.controlStack = [];
	}

	calculateInitialLeftPosition( cxt, side, paddleWidth ) {
		var sideMargin = 30;

		if( side == 'left' )
			return sideMargin;
		else
			return cxt.width - paddleWidth - sideMargin;
	}

	calculateInitialTopPosition( cxt, paddleHeight ) {
		var halfCanvas = cxt.height / 2;
		var halfPaddle = paddleHeight / 2;

		return halfCanvas - halfPaddle;
	}

	moveAtSpeed() {
		var newTop = this.top + this.ySpeed;

		if( newTop <= 0 || newTop + this.height >= this.cxt.height )
			return;
		else
			super.moveAtSpeed();
	}
}

class Ball extends MovableObject {
	constructor( cxt, initialXSpeed, initialYSpeed ) {
		var size = 10;
		var left = ( cxt.width / 2 ) - ( size / 2 );
		var top = ( cxt.height / 2 ) - ( size / 2 );

		super( cxt, size, size, left, top, initialXSpeed, initialYSpeed);
		this.size = size;
		this.paddleBounces = 0;
	}

	handleWallDetection() {
		if( this.top <= 0 ) {
			this.reverseYSpeed();
		}
		if( this.top + this.height >= this.cxt.height ) {
			this.reverseYSpeed();
		}
	}
}