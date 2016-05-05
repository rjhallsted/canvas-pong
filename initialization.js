document.addEventListener( 'DOMContentLoaded', function() {
	var fillColor = '#333333';

	var canvas = document.querySelector('#pongCanvas');
	var cxt = canvas.getContext('2d');
	cxt.fillStyle = fillColor;
	cxt.width = canvas.width;
	cxt.height = canvas.height;

	var leftPaddle = new Paddle( cxt, 'left' );
	leftPaddle.draw();

	var rightPaddle = new Paddle( cxt, 'right' );
	rightPaddle.draw();

	drawBall( cxt );
});

function drawBall( cxt ) {
	var size = 10;

	var leftPosition = ( cxt.width / 2 ) - ( size / 2 );
	var topPosition = ( cxt.height / 2 ) - ( size / 2 );

	cxt.fillRect( leftPosition, topPosition, size, size );
}

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
}