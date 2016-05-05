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

class Paddle {
	constructor( cxt, side ) {
		this.cxt = cxt;
		this.width = 6;
		this.height = 80;
		this.side = side;
		this.left = this.getStartingLeftPosition( this.cxt, side, this.width );
		this.top = this.getStartingTopPosition( this.cxt, this.height );
	}

	getStartingLeftPosition( cxt, side ) {
		var sideMargin = 30;

		if( side == 'left' )
			return sideMargin;
		else
			return this.cxt.width - this.width - sideMargin;
	}

	getStartingTopPosition() {
		var halfCanvas = this.cxt.height / 2;
		var halfPaddle = this.height / 2;

		return halfCanvas - halfPaddle;
	}

	draw() {
		this.cxt.fillRect( this.left, this.top, this.width, this.height );
	}
}