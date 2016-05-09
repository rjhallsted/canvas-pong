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

	var endButton = document.querySelector('#end');
	endButton.addEventListener('click', function() {
		controller.end();
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
	}

	advanceFrame() {
		this.ball.moveAtSpeed();
		this.leftPaddle.moveAtSpeed();
		this.rightPaddle.moveAtSpeed();

		this.ball.handleCollsionDetection();
	}

	start() {
		var object = this;
		this.intervalController = setInterval(function() {
			object.advanceFrame();
		}, 5);
	}

	end() {
		clearInterval(this.intervalController);
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
}

class Ball extends MovableObject {
	constructor( cxt, initialXSpeed, initialYSpeed ) {
		var size = 10;
		var left = ( cxt.width / 2 ) - ( size / 2 );
		var top = ( cxt.height / 2 ) - ( size / 2 );

		super( cxt, size, size, left, top, initialXSpeed, initialYSpeed);
		this.size = size;
	}

	handleCollsionDetection() {
		if( this.top <= 0 ) {
			this.reverseYSpeed();
		}
		if( this.top >= this.cxt.height ) {
			this.reverseYSpeed();
		}
	}
}