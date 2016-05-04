document.addEventListener( 'DOMContentLoaded', function() {
	var fillColor = '#333333';

	var canvas = document.querySelector('#pongCanvas');
	var cxt = canvas.getContext('2d');
	cxt.fillStyle = fillColor;
	cxt.width = canvas.width;
	cxt.height = canvas.height;

	drawPaddle( cxt, 'left');
	drawPaddle( cxt, 'right');
});


function drawPaddle( cxt, side ) {
	var width = 6;
	var height = 80;

	var topPosition = getPaddleTopPosition( cxt, height );

	var leftPosition = getPaddleLeftPosition( cxt, side, width );

	cxt.fillRect( leftPosition, topPosition, width, height );
}

function getPaddleLeftPosition( cxt, side, paddleWidth ) {
	var sideMargin = 30;

	if( side == 'left' ) {
		return sideMargin;
	}
	else
		return cxt.width - paddleWidth - sideMargin;
}

function getPaddleTopPosition( cxt, paddleHeight ) {
	var halfCanvas = cxt.height / 2;
	var halfPaddle = paddleHeight / 2;

	return halfCanvas - halfPaddle;
}