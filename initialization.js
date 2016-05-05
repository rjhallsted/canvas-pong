document.addEventListener( 'DOMContentLoaded', function() {
	var fillColor = '#333333';

	var canvas = document.querySelector('#pongCanvas');
	var cxt = canvas.getContext('2d');
	cxt.fillStyle = fillColor;
	cxt.width = canvas.width;
	cxt.height = canvas.height;

	var leftPaddle = new Paddle( cxt, 'left' );
	leftPaddle.draw();
	leftPaddle.move( leftPaddle.top - 50 );

	var rightPaddle = new Paddle( cxt, 'right' );
	rightPaddle.draw();

	var pongBall = new Ball( cxt );
	pongBall.draw();
});

class MovableObject {
	constructor( cxt, width, height, left, top ) {
		this.cxt = cxt;
		this.setSize(width, height);
		this.setPosition( left, top );
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
		this.cxt.clearRect( this.left, this.top, this.width, this.height );

		this.left = left;
		this.top = top;
		this.draw();
	}
}

class Paddle extends MovableObject {
	constructor( cxt, side ) {

		var width = 6;
		var height = 80;

		super( cxt, width, height, 0, 0);

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

	move( top ) {
		super.move( this.left, top );
	}
}

class Ball extends MovableObject {
	constructor( cxt ) {
		var size = 10;
		var left = ( cxt.width / 2 ) - ( size / 2 );
		var top = ( cxt.height / 2 ) - ( size / 2 );

		super( cxt, size, size, left, top );
		this.size = size;
	}
}