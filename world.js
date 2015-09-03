var GameController;

(function($, jQuery, window){
	"use strict";
	
	var console = window.console;
if (Object.prototype.__defineGetter__&&!Object.defineProperty) {
   Object.defineProperty=function(obj,prop,desc) {
      if ("get" in desc) obj.__defineGetter__(prop,desc.get);
      if ("set" in desc) obj.__defineSetter__(prop,desc.set);
   }
}var debug =
{
	debugging: true,

	log : function()
	{
		if(!debug.debugging)
			return;
	}
};var GlobalState = {};

GlobalState.MoveSpeed 	= 300;
GlobalState.TilesPerRow = 13;
GlobalState.TileW = 40;
GlobalState.TileH = 40;
GlobalState.TileWHalf = GlobalState.TileW / 2;
GlobalState.TileHHalf = GlobalState.TileH / 2;
GlobalState.LocationImageFolders =  ['stairways','shops','locations','portals','relics'];
GlobalState.BorderImage = 'http://cdn.fallensword.com/world/realm/realm_top.png';
GlobalState.FPS = 1000 / 30;
GlobalState.TooltipDelay = 200;
GlobalState.InvertCamera = true;

GlobalState.DefaultVisionRadius = GlobalState.TileW;/*(function(){
	var fps = GlobalState.FPS;
	
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(callback){ // Fallback
					window.setTimeout(callback, fps);
				};
	})();
})();*/


(function() {
	window.requestAnimationFrame = function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};

}());

window.requestAnimFrame = window.requestAnimationFrame;/*
 * stats.js r6
 * http://github.com/mrdoob/stats.js
 *
 * Released under MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * How to use:
 *
 *  var stats = new Stats();
 *  parentElement.appendChild( stats.domElement );
 *
 *  setInterval(function () {
 *
 *  	stats.update();
 *
 *  }, 1000/60);
 *
 */

var Stats = function () {

	var _mode = 0, _modesCount = 2, _container,
	_frames = 0, _time = new Date().getTime(), _timeLastFrame = _time, _timeLastSecond = _time,
	_fps = 0, _fpsMin = 1000, _fpsMax = 0, _fpsDiv, _fpsText, _fpsCanvas, _fpsContext, _fpsImageData,
	_ms = 0, _msMin = 1000, _msMax = 0, _msDiv, _msText, _msCanvas, _msContext, _msImageData,
	_mb = 0, _mbMin = 1000, _mbMax = 0, _mbDiv, _mbText, _mbCanvas, _mbContext, _mbImageData,
	_colors = {
		fps: {
			bg: { r: 16, g: 16, b: 48 },
			fg: { r: 0, g: 255, b: 255 }
		},
		ms: {
			bg: { r: 16, g: 48, b: 16 },
			fg: { r: 0, g: 255, b: 0 }
		},
		mb: {
			bg: { r: 48, g: 16, b: 26 },
			fg: { r: 255, g: 0, b: 128 }
		}
	};

	_container = document.createElement( 'div' );
	_container.style.cursor = 'pointer';
	_container.style.width = '80px';
	_container.style.opacity = '0.9';
	_container.style.zIndex = '10001';
	_container.addEventListener( 'click', swapMode, false );

	// fps

	_fpsDiv = document.createElement( 'div' );
	_fpsDiv.style.backgroundColor = 'rgb(' + Math.floor( _colors.fps.bg.r / 2 ) + ',' + Math.floor( _colors.fps.bg.g / 2 ) + ',' + Math.floor( _colors.fps.bg.b / 2 ) + ')';
	_fpsDiv.style.padding = '2px 0px 3px 0px';
	_container.appendChild( _fpsDiv );

	_fpsText = document.createElement( 'div' );
	_fpsText.style.fontFamily = 'Helvetica, Arial, sans-serif';
	_fpsText.style.textAlign = 'left';
	_fpsText.style.fontSize = '9px';
	_fpsText.style.color = 'rgb(' + _colors.fps.fg.r + ',' + _colors.fps.fg.g + ',' + _colors.fps.fg.b + ')';
	_fpsText.style.margin = '0px 0px 1px 3px';
	_fpsText.innerHTML = '<span style="font-weight:bold">FPS</span>';
	_fpsDiv.appendChild( _fpsText );

	_fpsCanvas = document.createElement( 'canvas' );
	_fpsCanvas.width = 74;
	_fpsCanvas.height = 30;
	_fpsCanvas.style.display = 'block';
	_fpsCanvas.style.marginLeft = '3px';
	_fpsDiv.appendChild( _fpsCanvas );

	_fpsContext = _fpsCanvas.getContext( '2d' );
	_fpsContext.fillStyle = 'rgb(' + _colors.fps.bg.r + ',' + _colors.fps.bg.g + ',' + _colors.fps.bg.b + ')';
	_fpsContext.fillRect( 0, 0, _fpsCanvas.width, _fpsCanvas.height );

	_fpsImageData = _fpsContext.getImageData( 0, 0, _fpsCanvas.width, _fpsCanvas.height );

	// ms

	_msDiv = document.createElement( 'div' );
	_msDiv.style.backgroundColor = 'rgb(' + Math.floor( _colors.ms.bg.r / 2 ) + ',' + Math.floor( _colors.ms.bg.g / 2 ) + ',' + Math.floor( _colors.ms.bg.b / 2 ) + ')';
	_msDiv.style.padding = '2px 0px 3px 0px';
	_msDiv.style.display = 'none';
	_container.appendChild( _msDiv );

	_msText = document.createElement( 'div' );
	_msText.style.fontFamily = 'Helvetica, Arial, sans-serif';
	_msText.style.textAlign = 'left';
	_msText.style.fontSize = '9px';
	_msText.style.color = 'rgb(' + _colors.ms.fg.r + ',' + _colors.ms.fg.g + ',' + _colors.ms.fg.b + ')';
	_msText.style.margin = '0px 0px 1px 3px';
	_msText.innerHTML = '<span style="font-weight:bold">MS</span>';
	_msDiv.appendChild( _msText );

	_msCanvas = document.createElement( 'canvas' );
	_msCanvas.width = 74;
	_msCanvas.height = 30;
	_msCanvas.style.display = 'block';
	_msCanvas.style.marginLeft = '3px';
	_msDiv.appendChild( _msCanvas );

	_msContext = _msCanvas.getContext( '2d' );
	_msContext.fillStyle = 'rgb(' + _colors.ms.bg.r + ',' + _colors.ms.bg.g + ',' + _colors.ms.bg.b + ')';
	_msContext.fillRect( 0, 0, _msCanvas.width, _msCanvas.height );

	_msImageData = _msContext.getImageData( 0, 0, _msCanvas.width, _msCanvas.height );

	// mb

	try { 

		if ( performance && performance.memory && performance.memory.totalJSHeapSize ) {

			_modesCount = 3;

		}

	} catch ( error ) { };

	_mbDiv = document.createElement( 'div' );
	_mbDiv.style.backgroundColor = 'rgb(' + Math.floor( _colors.mb.bg.r / 2 ) + ',' + Math.floor( _colors.mb.bg.g / 2 ) + ',' + Math.floor( _colors.mb.bg.b / 2 ) + ')';
	_mbDiv.style.padding = '2px 0px 3px 0px';
	_mbDiv.style.display = 'none';
	_container.appendChild( _mbDiv );

	_mbText = document.createElement( 'div' );
	_mbText.style.fontFamily = 'Helvetica, Arial, sans-serif';
	_mbText.style.textAlign = 'left';
	_mbText.style.fontSize = '9px';
	_mbText.style.color = 'rgb(' + _colors.mb.fg.r + ',' + _colors.mb.fg.g + ',' + _colors.mb.fg.b + ')';
	_mbText.style.margin = '0px 0px 1px 3px';
	_mbText.innerHTML = '<span style="font-weight:bold">MB</span>';
	_mbDiv.appendChild( _mbText );

	_mbCanvas = document.createElement( 'canvas' );
	_mbCanvas.width = 74;
	_mbCanvas.height = 30;
	_mbCanvas.style.display = 'block';
	_mbCanvas.style.marginLeft = '3px';
	_mbDiv.appendChild( _mbCanvas );

	_mbContext = _mbCanvas.getContext( '2d' );
	_mbContext.fillStyle = '#301010';
	_mbContext.fillRect( 0, 0, _mbCanvas.width, _mbCanvas.height );

	_mbImageData = _mbContext.getImageData( 0, 0, _mbCanvas.width, _mbCanvas.height );

	function updateGraph( data, value, color ) {

		var x, y, index;

		for ( y = 0; y < 30; y++ ) {

			for ( x = 0; x < 73; x++ ) {

				index = (x + y * 74) * 4;

				data[ index ] = data[ index + 4 ];
				data[ index + 1 ] = data[ index + 5 ];
				data[ index + 2 ] = data[ index + 6 ];

			}

		}

		for ( y = 0; y < 30; y++ ) {

			index = (73 + y * 74) * 4;

			if ( y < value ) {

				data[ index ] = _colors[ color ].bg.r;
				data[ index + 1 ] = _colors[ color ].bg.g;
				data[ index + 2 ] = _colors[ color ].bg.b;

			} else {

				data[ index ] = _colors[ color ].fg.r;
				data[ index + 1 ] = _colors[ color ].fg.g;
				data[ index + 2 ] = _colors[ color ].fg.b;

			}

		}

	}

	function swapMode() {

		_mode ++;
		_mode == _modesCount ? _mode = 0 : _mode;

		_fpsDiv.style.display = 'none';
		_msDiv.style.display = 'none';
		_mbDiv.style.display = 'none';

		switch( _mode ) {

			case 0:

				_fpsDiv.style.display = 'block';

				break;

			case 1:

				_msDiv.style.display = 'block';

				break;

			case 2:

				_mbDiv.style.display = 'block';

				break;
		}

	}

	return {

		domElement: _container,

		update: function () {

			_frames ++;

			_time = new Date().getTime();

			_ms = _time - _timeLastFrame;
			_msMin = Math.min( _msMin, _ms );
			_msMax = Math.max( _msMax, _ms );

			updateGraph( _msImageData.data, Math.min( 30, 30 - ( _ms / 200 ) * 30 ), 'ms' );

			_msText.innerHTML = '<span style="font-weight:bold">' + _ms + ' MS</span> (' + _msMin + '-' + _msMax + ')';
			_msContext.putImageData( _msImageData, 0, 0 );

			_timeLastFrame = _time;

			if ( _time > _timeLastSecond + 1000 ) {

				_fps = Math.round( ( _frames * 1000) / ( _time - _timeLastSecond ) );
				_fpsMin = Math.min( _fpsMin, _fps );
				_fpsMax = Math.max( _fpsMax, _fps );

				updateGraph( _fpsImageData.data, Math.min( 30, 30 - ( _fps / 100 ) * 30 ), 'fps' );

				_fpsText.innerHTML = '<span style="font-weight:bold">' + _fps + ' FPS</span> (' + _fpsMin + '-' + _fpsMax + ')';
				_fpsContext.putImageData( _fpsImageData, 0, 0 );

				if ( _modesCount == 3 ) {

					_mb = performance.memory.usedJSHeapSize * 0.000000954;
					_mbMin = Math.min( _mbMin, _mb );
					_mbMax = Math.max( _mbMax, _mb );

					updateGraph( _mbImageData.data, Math.min( 30, 30 - ( _mb / 2 ) ), 'mb' );

					_mbText.innerHTML = '<span style="font-weight:bold">' + Math.round( _mb ) + ' MB</span> (' + Math.round( _mbMin ) + '-' + Math.round( _mbMax ) + ')';
					_mbContext.putImageData( _mbImageData, 0, 0 );

				}

				_timeLastSecond = _time;
				_frames = 0;

			}

		}

	};

};
/**
 * 
 * @param {Object} w
 * @param {Object} h
 * @property {jQuery} Element 
 * @property {HTMLCanvasElement} 
 * @property {CanvasRenderingContext2D} Context The canvas context
 */
function BackBuffer(w, h)
{
	var c = $('<canvas width="'+w+'" height="'+h+'" style="display:block !important"></canvas>');
	
	/**
	 * The jQuery element
	 * @type jQuery
	 */
	this.Element = c;
	
	/**
	 * The html canvas element
	 * @type HTMLCanvasElement
	 */
	this.Canvas = c[0];
	
	/**
	 * The canvas drawing context
	 * @type CanvasRenderingContext2D
	 */
	this.Context = this.Canvas.getContext("2d");
	
	// Cache W & H
	/**
	 * Cached width of the canvas. Should not be changed directly.
	 * @see BackBuffer#SetSize
	 * @type Number
	 */
	this.W = w;
	
	/**
	 * Cached height of the canvas. Should not be changed directly.
	 * @see BackBuffer#SetSize
	 * @type Number
	 */
	this.H = h;
	
	return this;
}

/**
 * 
 * @param {Object} w
 * @param {Object} h
 */
BackBuffer.prototype.SetSize = function(w, h)
{
	var c = this.Canvas;
	
	this.W = w;
	this.H = h;
	
	this.Element.attr({'width':w, 'height':h});
};

/**
 * Draws the BackBuffers contents to another Context.
 * @param {Object} c
 * @param {Number} dX
 * @param {Number} dY
 * @param {Float} scale
 */
BackBuffer.prototype.DrawToContext = function(c, dX, dY)
{
	c.drawImage(this.Canvas, dX, dY);
};

BackBuffer.prototype.DrawToContextAdvanced = function(c, sX, sY, sW, sH, dX, dY, dW, dH)
{
	c.drawImage(this.Canvas, sX, sY, sW, sH, dX, dY, dW, dH);
};

BackBuffer.prototype.Clear = function()
{
	this.Context.clearRect(0,0, this.W, this.H);
};function Vector2(x, y)
{
	/**
	 * @type Number
	 */
	this.X = x || 0;
	
	/**
	 * @type Number
	 */
	this.Y = y || 0;
}

/**
 * Sets the vectors x, y.
 * @param {Number} x
 * @param {Number} y
 * @return {Vector2}
 */
Vector2.prototype.Set = function(x, y)
{
	this.X = x;
	this.Y = y;
	
	return this;
};

/**
 * Checks equality
 * @param {Vector2} vector
 * @return {Boolean}
 */
Vector2.prototype.Equals = function(vector)
{
	return (this.X === vector.X && this.Y === vector.Y);
};

/**
 * Adds the parameter vector to this vector.
 * @param {Vector2|Number} vector
 * @param {Number} [y]
 * @return {Vector2}
 */
Vector2.prototype.Add = function(vector, y)
{
	this.X += (y === undefined) ? vector.X : vector;
	this.Y += (y === undefined) ? vector.Y : y;
	
	return this;
};

/**
 * Subtracts the parameter vector from this vector.
 * @param {Vector2|Number} vector
 * @param {Number} [y]
 * @return {Vector2}
 */
Vector2.prototype.Subtract = function(vector, y)
{
	this.X -= (y === undefined) ? vector.X : vector;
	this.Y -= (y === undefined) ? vector.Y : y;
	
	return this;
};

/**
 * Multiplies the vector uniformly by the scalar.
 * @param {Number} scalar
 * @return {Vector2}
 */
Vector2.prototype.Multiply = function(scalar)
{
	this.X *= scalar;
	this.Y *= scalar;
	
	return this;
};

/**
 * Divideds the vector uniformly by the scalar.
 * @param {Number} scalar
 * @return {Vector2}
 */
Vector2.prototype.Divide = function(scalar)
{
	this.X /= scalar;
	this.Y /= scalar;
	
	return this;
};

/**
 * Multiplies the vector by the scalars.
 * @param {Number} scalarX
 * @param {Number} scalarY
 * @return {Vector2}
 */
Vector2.prototype.NonUniformMultiply = function(scalarX, scalarY)
{
	this.X *= scalarX;
	this.Y *= scalarY;
	
	return this;
};

/**
 * Divideds the vector by the scalars.
 * @param {Number} scalarX
 * @param {Number} scalarY
 * @return {Vector2}
 */
Vector2.prototype.NonUniformDivide = function(scalarX, scalarY)
{
	this.X /= scalarX;
	this.Y /= scalarY;
	
	return this;
};

/**
 * Gets the length of the Vector2
 * @return {Number}
 */
Vector2.prototype.Length = function()
{
	return Math.sqrt(this.LengthSq());
};

/**
 * Gets the length squared of the Vector2
 * @return {Number}
 */
Vector2.prototype.LengthSq = function()
{
	return this.X * this.X + this.Y * this.Y;
};

/**
 * Inverts/Negates the Vector2.
 * @return {Vector2}
 */
Vector2.prototype.Negate = function()
{	
	this.X = -this.X;
	this.Y = -this.Y;
	
	return this;
};

/**
 * Inverts/Negates the Vector2 and returns a new Vector2.
 * @return {Vector2}
 */
Vector2.prototype.Negated = function()
{	
	return new Vector2(-this.X, -this.Y);
};

/**
 * Normalizes the Vector2.
 * @return {Vector2}
 */
Vector2.prototype.Normalize = function()
{	

	return this.Divide(this.Length());
};

/**
 * Returns a new Vector2 of the normalized vector.
 * @return {Vector2}
 */
Vector2.prototype.Normalized = function()
{
	var x = this.X,
		y = this.Y,
		l = (x !== 0 || y !== 0) ? this.Length() : 1;
	
	x = x / l;
	y = y / l;
	
	return new Vector2(x, y);
};

/**
 * Creates a new Vector2
 * @return {Vector2}
 */
Vector2.prototype.Clone = function()
{
	return new Vector2(this.X, this.Y);
};

Vector2.prototype.Zero = new Vector2(0, 0);/*global Vector2 GameController*/
var lol = true;

var CAM_SPEED = 0.009,
	ZOOM_SPEED = 0.01;

function Camera(viewportW, viewportH)
{
	this.Position = new Vector2();
	this._actualPosition = new Vector2();
	
	this._startPosition = new Vector2();
	this._endPosition 	= new Vector2();
	
	this.SetViewport(viewportW, viewportH);
	
	this._actualZoom = 1;
	this._zoom = 1;
	this._startZoom = 1;
	this._endZoom = 1;
	
	this.ZoomMin = 0.1;
	this.ZoomMax = 10;
	
	this._boundsX = 0;
	this._boundsY = 0;
}

Camera.prototype.SetViewport = function(w, h)
{
	this._viewportW = w;
	this._viewportH = h;
	
	this._viewportWHalf = this._viewportW / 2;
	this._viewportHHalf = this._viewportH / 2;
	
	this._viewportCenter = new Vector2(this._viewportWHalf, this._viewportHHalf);
};

Camera.prototype.SetBounds = function(minX, minY, maxX, maxY)
{
	this._bounds = 
	{
		left: minX,
		right: maxX,
		top: minY,
		bottom: maxY
	};
};

Camera.prototype.Update = function(gameTime)
{
	var moved = false,
		positionDifference = this.Position.Clone().Subtract(this._actualPosition),
		length 	= positionDifference.Length(),
		elapsed = gameTime.Elapsed;
		
	if (length > 0.00001) 
	{
		GameController.Stage.Redraw = true;
		var distance = length * elapsed * CAM_SPEED;
		
		this._actualPosition.Add(positionDifference.Normalize().Multiply((distance > length) ? length : distance));
		
		moved = true;
	}
		
	// Zoom
	var target 	= this._zoom,
		end 	= this._endZoom,
		start 	= this._startZoom;
	
	if (end !== target) // Camera target has moved
	{
		start = this._actualZoom;
		end   = target;
	}
	
	var zoomDifference = end - this._actualZoom;
	
	if (zoomDifference < -0.001 || zoomDifference > 0.1) 
	{
		var flip = 1;
		
		if (zoomDifference < 0) 
		{
			flip *= -1;
			zoomDifference *= -1;
		}
		
		var distance = zoomDifference * elapsed * ZOOM_SPEED;
		
		this._actualZoom += flip * ((distance > zoomDifference)? zoomDifference : distance);
		
		moved = true;
	}
	
	if (!moved) 
	{	
		return;
	}
	
	// Keep in Bounds
	var bounds = this._bounds;
	
	var w = this._viewportWHalf,
		h = this._viewportHHalf,
		z = this._actualZoom,
		wZ = w / z,
		hZ = h / z,
		bL = bounds.left + wZ,
		bR = bounds.right - wZ,
		bT = bounds.top + hZ,
		bB = bounds.bottom - hZ,
		x = this._actualPosition.X,
		y = this._actualPosition.Y;
	
	if (x < bL)
	{
		this._actualPosition.X = bL;
		this.Position.X = bL;
	}
	else if(x > bR)
	{
		this._actualPosition.X = bR;
		this.Position.X = bR;
	}
	
	if (y < bT) 
	{
		this._actualPosition.Y = bT;
		this.Position.Y = bT;
	}
	else if(y > bB)
	{
		this._actualPosition.Y = bB;
		this.Position.Y = bB;
	}
	
	var min = this.ZoomMin,
		max = this.ZoomMax,
		val = this._actualZoom;
	
	if (val < min) 
	{
		this._actualZoom = min;
	}
	else if (val > max) 
	{
		this._actualZoom = max;
	}
};

/*
Camera.prototype.Update = function(gameTime)
{
	if(lol)
		console.profile();
	
	var pos  = this._updatePosition(gameTime.Elapsed),
		zoom = this._updateZoom(gameTime.Elapsed);
	
	if (pos || zoom) 
	{
		this.KeepInBounds();
	}
	
	if(lol)
		console.profileEnd();
};

Camera.prototype._updatePosition = function(elapsed)
{
	var positionDifferenceX  = this.Position.Clone().Subtract(this._actualPosition),
		length = positionDifference.Length();
		
	if (length > 1) 
	{
		GameController.Stage.Redraw = true;
		
		this._actualPosition.Add(positionDifference.Normalize().Multiply(length * elapsed * CAM_SPEED));
		
		return true;
	}
	
	return false;
};

Camera.prototype._updateZoom = function(elapsed)
{
	var target 	= this._zoom,
		end 	= this._endZoom,
		start 	= this._startZoom;
	
	if (end !== target) // Camera target has moved
	{
		start = this._actualZoom;
		end   = target;
	}
	
	var zoomDifference = end - this._actualZoom;
	
	if (zoomDifference < -0.001 || zoomDifference > 0.1) 
	{
		var flip = 1;
		
		if (zoomDifference < 0) 
		{
			flip *= -1;
			zoomDifference *= -1;
		}
		
		this._actualZoom += flip * (zoomDifference * elapsed * ZOOM_SPEED);
		
		return true;
	}
	
	return false;
};

Camera.prototype.KeepInBounds = function()
{
	// X
	var bounds = this._bounds;
	
	var w = this._viewportWHalf,
		h = this._viewportHHalf,
		z = this._actualZoom,
		wZ = w / z,
		hZ = h / z,
		bL = bounds.left + wZ,
		bR = bounds.right - wZ,
		bT = bounds.top + hZ,
		bB = bounds.bottom - hZ,
		x = this._actualPosition.X,
		y = this._actualPosition.Y;
	
	if (x < bL)
	{
		this._actualPosition.X = bL;
		this.Position.X = bL;
	}
	else if(x > bR)
	{
		this._actualPosition.X = bR;
		this.Position.X = bR;
	}
	
	if (y < bT) 
	{
		this._actualPosition.Y = bT;
		this.Position.Y = bT;
	}
	else if(y > bB)
	{
		this._actualPosition.Y = bB;
		this.Position.Y = bB;
	}
};
*/

/**
 * Gets the screen position translated from a world position.
 * @param {Vector2} worldPosition
 * @return {Vector2}
 */
Camera.prototype.GetScreenPosition = function(worldPosition)
{
	return worldPosition.Clone().Subtract(this._actualPosition).Multiply(this._actualZoom).Add(this._viewportCenter);
};

/**
 * Gets the screen position translated from a world position.
 * @param {Vector2} worldPosition
 * @return {Vector2}
 */
Camera.prototype.GetScreenPositionX = function(worldPositionX)
{
	return ((worldPositionX - this._actualPosition.X) * this._actualZoom) + this._viewportWHalf;
};

/**
 * Gets the screen position translated from a world position.
 * @param {Vector2} worldPosition
 * @return {Vector2}
 */
Camera.prototype.GetScreenPositionY = function(worldPositionY)
{
	return ((worldPositionY - this._actualPosition.Y) * this._actualZoom) + this._viewportHHalf;
};

/**
 * Gets the world position translated from a screen position.
 * @param {Vector2} screenPosition
 * @return {Vector2}
 */
Camera.prototype.GetWorldPosition = function(screenPosition)
{
	
	var x = screenPosition.X,
		y = screenPosition.Y,
		vC= this._viewportCenter,
		aP= this._actualPosition,
		z = this._actualZoom;
	
	return new Vector2(((x - vC.X) / z) + aP.X, ((y - vC.Y) / z) + aP.Y);
	
	
	//return (screenPosition.Clone().Subtract(this._viewportCenter).Divide(this._actualZoom).Add(this._actualPosition));
};

/**
 * Gets the world position translated from a screen position at a specific zoom.
 * @param {Vector2} screenPosition
 * @param {Float} zoom
 * @return {Vector2}
 */
Camera.prototype.GetWorldPositionAtZoom = function(screenPosition, zoom)
{
	return (screenPosition.Clone().Subtract(this._viewportCenter).Divide(zoom).Add(this.Position));
};

/**
 * Applys the camera's transformation matrix to the canvas.
 * @param {CanvasRenderingContext2D} context2d
 */
Camera.prototype.ApplyMatrix = function(context2d)
{
	var p  = this._actualPosition,
		z  = this._actualZoom,
		vX = this._viewportWHalf,
		vY = this._viewportHHalf;
	
	// Move Centre to Top Left
	context2d.translate(vX, vY);
	
	// Scale
	context2d.scale(z, z);

	// Set Position
	context2d.translate((-p.X + 0.5) << 0, (-p.Y + 0.5) << 0);
};

Camera.prototype.ApplyCenter = function(context2d)
{
	var vX = this._viewportWHalf,
		vY = this._viewportHHalf;
	
	// Move Centre to Top Left
	context2d.translate(vX, vY);
};

Camera.prototype.ApplyZoom = function(context2d)
{
	var z  = this._actualZoom;
	
	// Scale
	context2d.scale(z, z);
};

Camera.prototype.ApplyPosition = function(context2d)
{
	var p  = this._actualPosition;
	
	// Set Position
	context2d.translate(-p.X, -p.Y);
};

(function(){
	Object.defineProperty(Camera.prototype, 'Zoom', {
		get: function()
		{
			return this._zoom;
		},
		
		set: function(val)
		{
			if (val < this.ZoomMin) 
			{
				val = this.ZoomMin;
			}
			else if (val > this.ZoomMax) 
			{
				val = this.ZoomMax;
			}
			
			this._zoom = val;
			
			return this._zoom;
		}
	});
})();/**
 * A GameTime object.
 */
function GameTime() {
	var _last = new Date().getTime(),
		self  = this;
	
	/**
	 * Time elapsed time in milliseconds since creation.
	 * @type Number
	 */
	this.Time = 0;
	
	/**
	 * Running total since last frame we called _draw on.
	 * @type Number
	 */
	this.Total = 0;
	
	/**
	 * Time elapsed since last update in milliseconds.
	 * @type Number
	 */
	this.Elapsed = 0;
	
	this.Update = function(now) {
		
		if (now === undefined || !window.webkitRequestAnimationFrame) {
			now = new Date().getTime();
		}
		
		self.Elapsed = now - _last;
		
		if (self.Elapsed > 1000) 
		{
			self.Elapsed = 1000;
		}
		
		self.Time += self.Elapsed;
		self.Total += self.Elapsed;
		
		_last = now;
	};
}/**
 * Creates a new texture or returns an already loaded texture
 * @param {String} src
 * @return {Texture}
 * @constructor
 */
function Texture(src)
{
	var checkTextureIndex = Texture.prototype.check(src);
    
    return (checkTextureIndex > -1) ? Texture.prototype.getTexture(checkTextureIndex) : Texture.prototype.addTexture.call(this, src);
}

/**
 * @private
 */
Texture.prototype._stringList = [];

/**
 * @private
 */
Texture.prototype._objectList = [];

/**
 * Check to see if the texture is already loaded lol
 * @param {String} srcString
 * @static
 * @return {Number} Index Position
 */
Texture.prototype.check = function(srcString)
{
    return $.inArray(srcString, Texture.prototype._stringList);
};

/**
 * @param {Number} index
 * @return {Texture}
 */
Texture.prototype.getTexture = function(index)
{
    return Texture.prototype._objectList[index];
};

/**
 * Loads texture and adds it to the texture hash
 * @param {Number} index
 * @return {Texture}
 */
Texture.prototype.addTexture = function(srcString)
{
    var self = this;
    
    Texture.prototype._stringList.push(srcString);
    Texture.prototype._objectList.push(self);
    
    this.image = new Image();
    
    // Default Ready State
	this.readyFunctions = [];
	
    this.isReady = false;
    
	/**
	 * Width of Texture
	 * @type Number
	 */
	this.W = 0;
	
	/**
	 * Height of Texture
	 * @type Number
	 */
	this.H = 0;
		
    // Set onLoad
    this.image.onload = function()
    {
        var image = self.image;
		
		self.W = image.width;
		self.H = image.height;
		
		self.isReady = true;
        
        self.onReady();
    };
    
    // Load Image
    this.image.src = srcString;
    
    this.src = srcString;
    
    return this;
};

/**
 * Abstract method
 * @param {Number} index
 * @return {Texture}
 */
Texture.prototype.OnReady = function(fn)
{
    this.readyFunctions.unshift(fn);
	
	if (this.isReady) 
	{
		this.onReady();
	}
};

Texture.prototype.onReady = function()
{
	var fns = this.readyFunctions,
		len = fns.length;
	
	while (len--)
	{
		fns.pop().call(this);
	}
};

/**
 * Gets the src attr of the texture
 * @param {Object} srcString
 * @return {String} Source URL
 */
Texture.prototype.GetSrc = function(srcString)
{
    return this.image.src;
};

/**
 * Is the texture ready?
 * @return {Boolean} isReady
 */
Texture.prototype.Ready = function()
{
    return this.isReady;
};

/**
 * Draws texture to Context
 * @param {Context2d} c
 * @param {Number} sX Source Image X
 * @param {Number} sY Source Image Y
 * @param {Number} sH Source Width
 * @param {Number} sW Source Height
 * @param {Number} dX Context Destination X
 * @param {Number} dY Context Destination Y
 * @param {Number} [dW] Destination Width, defaults to sW if blank
 * @param {Number} [dH] Destination Height, defaults to sH if blank
 * @return {Boolean} true if drawn false if not drawn
 */
Texture.prototype.Draw = function(c, sX, sY, sW, sH, dX, dY, dW, dH)
{
   	if (!this.isReady) 
    {
        return false;
    }
    
	dW = dW || sW;
	dH = dH || sH;
	
    c.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
	
	return true;
};

/**
 * Are all textures loaded?
 * @return {Boolean} True if any textures are loading.
 * @static
 */
Texture.prototype.IsLoading = function()
{

    var list = Texture.prototype._objectList,
		length = list.length;
    
	for(var i = length; i--;)
    {
        if (!list[i].isReady)
        {
            return true;
        }
    }
	
    return false;
};

/*HCS.utils.namespace('HCS.classes').Texture = Texture;*//**
 * 
 * @param {Number} w
 * @param {Number} h
 * @param {Texture} texture
 * @param {Array} frames
 */
function Sprite(w, h, texture, frames)
{
	// Dimensions
	/**
	 * Width of the sprite.
	 * @type float
	 */
	this.W = w;
	/**
	 * Height of the sprite.
	 * @type float
	 */
	this.H = h;
	
	// Texture
	/**
	 * Width of the sprite.
	 * @type Texture
	 */
	this.Texture = texture;
	
	/**
	 * Is the sprite due a redraw?
	 * @type Boolean
	 */
	this.Redraw = true;
	
	// Animation
	/**
	 * Current frame of animation of the sprite.
	 * @type Number
	 */
	this.frame = 0;
	
	/**
	 * Frame array.
	 * @type Array
	 */
	this.frames = frames;
	
	/**
	 * Total number of frames in the animation.
	 * @type Number
	 */
	this.frameCount = this.frames.length;
	
	/**
	 * Is the sprite animated?
	 * @type Boolean
	 */
	this.animated = (this.frameCount > 1);
	
	/**
	 * Array of Vectors of each frame relative to the Texture.
	 * @type Array
	 */
	this.frameSources = new Array(this.frameCount);
	
	if(!this.animated)
	{
		this.frameSources[0] = frames[0].source;
	}
	else
	{
		this.frameDurations = new Array(this.frameCount);
		
		for(var i = this.frameCount; i--;)
		{
			this.frameDurations[i] = frames[i].duration * 10;
			
			this.frameSources[i] = frames[i].source;
		}
	}
		
	// State Data
	/**
	 * Is the sprite paused (Not animating?).
	 * @type Boolean
	 */
	this.Paused = false;
	
	/**
	 * Current time elapsed this frame
	 * @type Number
	 */
	this.elapsedTimeThisFrame = 0;
}

/**
 * 
 * @param {GameTime} gameTime
 */
Sprite.prototype.Update = function(gameTime)
{
	// If not animated return
	if (!this.animated || this.Paused) 
	{
		return false;
	}
		
	// Update frame
	return this.updateFrame(gameTime);
};

/**
 * 
 * @param {GameTime} gameTime
 */
Sprite.prototype.updateFrame = function(gameTime){	
	// Calculate frame time
	this.elapsedTimeThisFrame += gameTime.Elapsed;
	
	// TODO: sort frame length
	if(this.elapsedTimeThisFrame > this.frameDurations[this.frame])
	{
		this.frame++;
		
		this.frame = this.frame % this.frameCount;
		
		this.elapsedTimeThisFrame -= this.frameDurations[this.frame];
		
		this.Redraw = true;
	}
	
	return this.Redraw;
};

/**
 * 
 * @param {GameTime} gameTime
 * @param {CanvasRenderingContext2D} c
 * @param {Number} x
 * @param {Number} y
 */
Sprite.prototype.Draw = function(gameTime, c, x, y){
	return this.drawFrame(gameTime, c, this.frame, x, y);
};

/**
 * 
 * @param {GameTime} gameTime
 * @param {CanvasRenderingContext2D} c
 * @param {Array} frame
 * @param {Number} x
 * @param {Number} y
 * @param {Float} scale
 */
Sprite.prototype.drawFrame = function(gameTime, c, frame, x, y)
{
	// Don't draw if not needed
	if (!this.Redraw || this.Texture === undefined) 
	{
		return false;
	}
	
	var w = this.W,
		h = this.H,
		dX = x || this.X,
		dY = y || this.Y;
	
	// Round (Hackily) the X/Y for faster drawing
	dX = (0.5 + dX) << 0;
	dY = (0.5 + dY) << 0;
	
	var frameSource = this.frameSources[this.frame];
	
	var tex = this.Texture.Draw(c, frameSource.x, frameSource.y, w, h, dX, dY, w, h);
	
	this.Redraw = tex;
	
	return tex;
};/*global AStarNode */

/**
 * AStar Pathfinding Yay
 * @param {Integer} w Width of grid
 * @param {Integer} h Height of grid
 * @param {Function} [blocked] Blocked function
 */
function AStarGrid(w, h, blocked){
	var numNodes = w * h;
	
	this.width  = w;
	this.height = h;
	
	this.friends = [-1, 1, -w, w, -w-1, -w+1, w-1, w+1];
	
	this.friendsXDir = [-1, 1, 0, 0, -1, 1, -1, 1];
	this.friendsYDir = [0, 0, -1, 1, -1, -1, 1, 1];
	
	this.numFriends = this.friends.length;
	
	var nodes = [];
	
	for(var y = 0, index = 0; y < h; y++)
	{
		for(var x = 0; x < w; x++, index++)
		{
			nodes[index] = new AStarNode(index, x, y);
		}
	}
	
	this.nodes = nodes;
	
	this.queueClear  = 0;
	this.queueOpen   = 1;
	this.queueClosed = 2;
	
	if(blocked !== undefined)
	{
		this.isBlocked = blocked;
	}
};

/**
 * Overridable method to test if a node is blocked
 * @param {Integer} x
 * @param {Integer} y
 * @return {Boolean}
 */
AStarGrid.prototype.isBlocked = function(x, y){ return false; };

/**
 * Test if the node is within the grid
 * @param {Integer} x
 * @param {Integer} y
 * @return {Boolean}
 */
AStarGrid.prototype.outOfNodeBounds = function(x, y){
	return x < 0 || x >= this.width || y < 0 || y >= this.height;
};

/**
 * Incriments the clear, open, closed instead of clearing nodes (faster)
 */
AStarGrid.prototype.clearNodes = function()
{
	this.queueClear += 3;
	
	if(this.queueClear + 2 < 0)
	{
		this.queueClear  = 0;
		this.queueOpen   = 1;
		this.queueClosed = 2;
		
		var length = this.nodes.length;
		
		for(var i = 0; i < length; i++)
		{
			this.nodes[i].queue = 0;
		}
	}
	else
	{
		this.queueOpen	+= 3;
		this.queueClosed += 3;
	}
};

/**
 * Test if the node is within the grid
 * @param {Integer} sx Start Node X
 * @param {Integer} sy Start Node Y
 * @param {Integer} ex End Node X
 * @param {Integer} ey End Node Y
 * @param {Array} [out] Output array for the path
 * @return {Boolean}
 */
AStarGrid.prototype.search = function(sx, sy, ex, ey, out)
{
	var startNode = this.getNode(sx, sy),
		endNode = this.getNode(ex, ey);

	if(!startNode || !endNode)
	{
		return false;
	}
	
	return this.searchNodes(startNode, endNode, out);
};

/**
 * Ged node from grid
 * @param {Integer} x
 * @param {Integer} y
 * @return {AStarNode|false} Returns AStarNode or false if out of bounds
 */
AStarGrid.prototype.getNode = function(x, y)
{
	if(!this.outOfNodeBounds(x, y))
	{
		return this.nodes[y * this.width + x];
	}
	else
	{
		return false;
	}
};

/**
 * Test if the node is within the grid
 * @param {AStarNode} startNode
 * @param {AStarNode} endNode
 * @param {Array} [out] Output array for the path
 * @return {Boolean}
 */
AStarGrid.prototype.searchNodes = function(startNode, endNode, out)
{
	if(this.isBlocked(startNode.x, startNode.y) || this.isBlocked(endNode.x, endNode.y))
	{
		return false;
	}
	
	this.clearNodes();
	
	var open = [];
	
	startNode.costFromStart = 0;
	startNode.costEstimateToEnd = startNode.getCostEstimate(endNode);
	startNode.parent = -1;
	
	open.push(startNode);
	
	while(open.length > 0)
	{
		var current = open.shift();
		
		var index = current.index;
		
		if(index === endNode.index)
		{
			if(out !== undefined)
			{
				var node = endNode;
				
				while(node.parent !== -1)
				{
					out.push({x:node.x, y:node.y});
					node = this.nodes[node.parent];
				}
				
				out.push({x:startNode.x, y:startNode.y});
				out.reverse();
			}
			
			return true;
		}
		
		current.queue = this.queueClosed;
	
		var xPos = current.x,
			yPos = current.y,
			friends		= this.friends,
			numFriends	= this.numFriends,
			friendsXDir	= this.friendsXDir,
			friendsYDir = this.friendsYDir;
		
		for(var i = 0; i < numFriends; i++)
		{
			var fx = xPos + friendsXDir[i],
				fy = yPos + friendsYDir[i];
			
			if(this.outOfNodeBounds(fx, fy))
			{
				continue;
			}
			
			if(this.isBlocked(fx, fy))
			{
				continue;
			}
			
			// init costs
			var friend = this.nodes[index+friends[i]],
				costFromStart = current.costFromStart + current.getFriendCost(friend);
				
			if(friend.queue <= this.queueClear)
			{
				friend.costEstimateToEnd = friend.getCostEstimate(endNode);
			}
			else if (costFromStart >= friend.costFromStart)
			{
				continue;
			}
			
			// if friend is clear / cost is better
			friend.parent = index;
			friend.costFromStart = costFromStart;
			
			if(friend.queue === this.queueClosed)
			{
				friend.queue = this.queueClear;
			}
			
			if(friend.queue !== this.queueOpen)
			{
				friend.queue = this.queueOpen;
				
				
				var openLength = open.length,
					added = false;
				
				for(var o = 0; o < openLength; o++)
				{
					var d = friend.compare(open[o]);
					
					if(d < 0)
					{
						open.splice(o, 0, friend);
						added = true;
						break;
					}
				}
				
				if(!added)
				{
					open.push(friend);
				}
			}
		}
	}
	
	return false;
};/**
 * Creates an AStarNode for pathfinding
 * @param {Object} index
 * @param {Object} x
 * @param {Object} y
 */
function AStarNode(index, x, y)
{
	this.index = index;
	
	this.x = x;
	this.y = y;
	
	this.parent = 0;
	
	this.costFromStart = 0;
	this.costEstimateToEnd = 0;
	
	this.queue = 0;
};

/**
 * 
 * @param {AStarNode} node
 * @return {Integer} returns -1 0 1 comparatively
 */
AStarNode.prototype.compare = function(node)
{
	var d = this.getCost() - node.getCost();
	
	if (d === 0)
	{
		return 0;
	}
	
	return (d > 0.0) ? 1 : -1;
};

/**
 * @return {Number} Estimated cost from start to end
 */
AStarNode.prototype.getCost = function()
{
	return this.costFromStart + this.costEstimateToEnd;
};

/**
 * Returns cost of move between based on 
 * @param {AStarNode} node
 * @return {Number} Cost of move
 */
AStarNode.prototype.getFriendCost = function(node)
{
	var dx = this.x - node.x,
		dy = this.y - node.y;

	return (dx !== 0 && dy !==0) ? 1.414 : 1;
};

/**
 * 
 * @param {Object} node
 * @return {Number} 
 */
AStarNode.prototype.getCostEstimate = function(node)
{
	return Math.abs(this.x - node.x);
};/*global GameController Vector2 */

function Mouse()
{
	/**
	 * Position of the mouse relative to the stage (in pixels)
	 * @type Vector2
	 */
	this.Screen = new Vector2(-1, -1);

	/**
	 * Position of the mouse relative to the world (in pixels)
	 * @type Vector2
	 */
	this.World  = new Vector2(-1, -1);

	/**
	 * Position of the mouse relative to the realm (in tiles)
	 * @type Vector2
	 */
	this.Realm  = new Vector2(-1, -1);

	this.Player = {
		Diff: new Vector2(-1, -1),
		Direction: new Vector2(-1,-1),
		Distance: -1
	};

	/**
	 * @type Array[Function]
	 * @private
	 */
	this._onMoveFunctions = [];

	/**
	 * @type Array[Function]
	 * @private
	 */
	this._onTileEnterFunctions = [];

	/**
	 * @type Array[Function]
	 * @private
	 */
	this._onTileLeaveFunctions = [];
}

Mouse.prototype.Update = function(x, y)
{
	var oldScreen = this.Screen.Clone();

	x = (x === undefined) ? oldScreen.X : x;
	y = (y === undefined) ? oldScreen.Y : y;

	if (!GameController.Realm)
	{
		return false;
	}

	var oldWorld = this.World,
		oldRealm = this.Realm,
		screen = this.Screen.Set(x, y),
		player = GameController.Player.PositionInPixels,
		world  = GameController.Camera.GetWorldPosition(screen),
		realm  = GameController.Realm.PositionToCoordinate(world.X, world.Y);

	this.Player.Diff = world.Clone().Subtract(player);
	this.Player.Direction = this.Player.Diff.Normalized();
	this.Player.Distance = this.Player.Diff.Length();

	this.World  = world;
	this.Realm  = realm;

	// Dispatch Screen
	this._onMove();

	// Leave First
	if ((oldScreen.X !== -1 && oldScreen.Y !== -1) && !oldRealm.Equals(realm))
	{
		this._onTileLeave();
	}

	// Enter Second
	if ((screen.X !== -1 && screen.Y !== -1) && !oldRealm.Equals(realm))
	{
		this._onTileEnter();
	}
};

Mouse.prototype.OnMove = function(fn)
{
	var len = this._onMoveFunctions.push(fn);

	return this._onMoveFunctions[len-1];
};

Mouse.prototype.OnTileEnter = function(fn)
{
	var len = this._onTileEnterFunctions.push(fn);

	return this._onTileEnterFunctions[len-1];
};

Mouse.prototype.OnTileLeave = function(fn)
{
	var len = this._onTileLeaveFunctions.push(fn);

	return this._onTileLeaveFunctions[len-1];
};

Mouse.prototype._onMove = function()
{
	var fns = this._onMoveFunctions,
		len = fns.length;

	for (var i = 0; i < len; i++)
	{
		fns[i].call(this, this);
	}
};

Mouse.prototype._onTileEnter = function()
{
	var fns = this._onTileEnterFunctions,
		len = fns.length;

	for (var i = 0; i < len; i++)
	{
		fns[i].call(this, this);
	}
};

Mouse.prototype._onTileLeave = function()
{
	var fns = this._onTileLeaveFunctions,
		len = fns.length;

	for (var i = 0; i < len; i++)
	{
		fns[i].call(this, this);
	}
};
function MouseController(mouse, router)
{
	var self = this;

	/**
	 * @type Realm
	 */
	this._realm = false;
	this._maxDistanceFromPlayer = false;
	this._inTile = false;

	var onEnter = mouse.OnTileEnter(function(mouse){
		var realm = self._realm,
			tile  = mouse.Realm,
			player= mouse.Player;

		if (!realm)
		{
			return;
		}

		var maxDist;

		if ((maxDist = self._maxDistanceFromPlayer) !== false) {
			if (mouse.Player.Distance > maxDist) {
				return;
			}
		}

		self._inTile = true;

		// Router
		router.OnTileEnter(mouse);

		if(!MouseController.prototype.Check(realm, tile))
		{
			return;
		}

		// Tool Tip
		$.publish('show.mapTooltip', {html:  realm.GetTooltip(tile.X, tile.Y), x: mouse.Screen.X, y: mouse.Screen.Y});
	});

	var onLeave = mouse.OnTileLeave(function(mouse){
		self._inTile = false;

		// Tool Tip
		$.publish('hide.mapTooltip');

		// Router
		router.OnTileLeave(mouse);
	});

	mouse.OnMove(function(mouse){
		var realm = self._realm,
			tile  = mouse.Realm;

		var maxDist;

		if ((maxDist = self._maxDistanceFromPlayer) !== false) {
			if (mouse.Player.Distance < maxDist) {
				onEnter(mouse);
			}
			else
			{
				onLeave(mouse);
			}
		}

		if(!MouseController.prototype.Check(realm, tile))
		{
			return;
		}

		// Tool Tip
		$.publish('refresh.mapTooltip', {x: mouse.Screen.X, y: mouse.Screen.Y});
	});
}

MouseController.prototype.SetMaxDistance = function(distance)
{
	return (this._maxDistanceFromPlayer = distance);
};

MouseController.prototype.SetRealm = function(realm)
{
	this._realm = realm;
};

MouseController.prototype.Check = function(realm, tile)
{
	return (!(tile.X < 0 || tile.Y < 0 || tile.X > realm.W || tile.Y > realm.Y));
};/*global GlobalState Sprite Texture*/
/**
 * Creates a TileSet and breaks it into individual index based Tile Molds.
 * @param {Number} set
 * @param {Array} lookup
 */
var TileSet = function(set, lookup, tileW, tileH)
{
	//TODO: Define tileset location somewhere
	this._texture = new Texture('http://cdn.fallensword.com/tiles/' + set + '_sheet.png');

	/**
	 * @type Array.<Sprite>
	 */
	this._molds = [];

	this._build(lookup, tileW, tileH);

	return this;
};

/**
 * Builds the tileset using the lookup array provided.
 * @param {Array} lookup
 */
TileSet.prototype._build = function(lookup, tileW, tileH)
{
	// Build Frame Sources
	var indexPosX = 0,
		indexPosY = 0,
		perRow  = GlobalState.TilesPerRow,
		texture = this._texture,
		lookupLength = lookup.length,
		tileSources = new Array(lookupLength),
		molds = new Array(lookupLength);

	this._count = lookupLength;

	// Create Mold Templates
	for(var i = 0; i < lookupLength; i++){
		var f = lookup[i].f,
			frameCount = (f === null || f < 1) ? 1 : f;

		tileSources[i] = new Array(frameCount);

		for(var j = 0; j < frameCount; j++)
		{
			// Duration
			var d = (lookup[i].d !== undefined) ? lookup[i].d[j] : 0;

			tileSources[i][j] = {
				source: {
					x: indexPosX * tileW,
					y: indexPosY * tileH
				},
				duration: d
			};

			// If we're not at the end of the row continue
			indexPosX++;

			indexPosX %= perRow;

			if (indexPosX === 0)
			{
				indexPosY++;
			}
		}

		molds[i] = new Sprite(tileW, tileH, texture, tileSources[i]);
	}

	this._molds = molds;
};

/**
 * Gets a tile mold from the TileSet.
 * @param {Object} index
 * @return {Sprite}
 */
TileSet.prototype.GetMold = function(index)
{
	return this._molds[index];
};

/**
 * Gets the number of different tiles in the set.
 * @return {Number}
 */
TileSet.prototype.Count = function()
{
	return this._molds.length;
};

/**
 * Updates the Tile Molds in the TileSet.
 * @param {GameTime} gameTime
 */
TileSet.prototype.Update = function(gameTime)
{
	var sprites = this._molds,
		length  = sprites.length,
		updated = false;

	for (var i = length; i--;)
	{
		if (sprites[i].Update(gameTime))
		{
			updated = true;
		}
	}

	return updated;
};/**
 * A realm tile
 * @param {Realm} realm
 * @param {Number} realmX
 * @param {Number} realmY
 * @param {Sprite} mold
 */
function Tile(realm, realmX, realmY, mold)
{
	/**
	 * @type Sprite
	 */
	this.mold = mold;
	
	// Set Tile Coordinates
	this.RealmX = realmX;
	this.RealmY = realmY;
	
	// Set Drawing Coordinates
	this.X = (this.RealmX + realm.PaddingX) * mold.W;
	this.Y = (this.RealmY + realm.PaddingY) * mold.H;

	this.Redraw = true;
	this.lastFrame = -1;
}

/**
 * Draws the tile
 * @param {GameTime} gameTime
 * @param {Context2d} c
 */
Tile.prototype.Draw = function(gameTime, c)
{
	var mold = this.mold;
	
	if(!this.Redraw && mold.frame==this.lastFrame)
		return false;

	var a = mold.Redraw;
	mold.Redraw = true;
	var drawn = mold.Draw(gameTime, c, this.X, this.Y, 1);
	mold.Redraw = a;
	
	if(drawn)
	{
		this.Redraw = false;
		this.lastFrame = mold.frame;
	}
		
	return drawn;
};/*global Tile*/

/**
 * A realm tile location
 * @param {Realm} realm
 * @param {Number} realmX
 * @param {Number} realmY
 * @param {Sprite} mold
 */
function TileLocation(realm, realmX, realmY, mold, tip)
{
	this.Tooltip = tip;
	
	this.TileIndex = realm.CoordinateToIndex(realmX, realmY);
	
	Tile.prototype.constructor.call(this, realm, realmX, realmY, mold);
}

// Extend Sprite
TileLocation.prototype = (function() {
    function TempProto() {}
	
	TempProto.prototype = Tile.prototype;
	
	var proto = new TempProto();
	
	proto.constructor = TileLocation;
	
	return proto;
})();

TileLocation.prototype.Update = function(gameTime)
{
	return this.mold.Update(gameTime);
};/*global Tile*/

/**
 * A realm tile location
 * @param {Realm} realm
 * @param {Number} realmX
 * @param {Number} realmY
 * @param {Sprite} molds
 * @param {String} tip Tooltip
 * @param {Integer} direction Titan Direction
 */
function Titan(realm, realmX, realmY, molds, tip, direction)
{
	this.DirectionMolds = molds;
	
	TileLocation.prototype.constructor.call(this, realm, realmX, realmY, molds[direction], tip);
	
	var mold = this.mold;
	
	// Set Drawing Coordinates
	this.X = this.RealmX * mold.W;
	this.Y = this.RealmY * mold.H;
}

// Extend Sprite
Titan.prototype = (function() {
    function TempProto() {}
	
	TempProto.prototype = TileLocation.prototype;
	
	var proto = new TempProto();
	
	proto.constructor = Titan;
	
	return proto;
})();

Titan.prototype.ChangeDirection = function(direction)
{
	this.mold = this.DirectionMolds[direction];
	
	this.Redraw = true;
	this.mold.Redraw = true;
};

Titan.prototype.Update = function(gameTime)
{
	return this.mold.Update(gameTime);
};/*global GlobalState CANVAS_W_HALF CANVAS_H_HALF GameController Sprite TileLocation Texture Vector2 GameData  TileSet BackBuffer CANVAS_H CANVAS_W Tile*/

/**
 * @class A realm object.
 * @param {Object} realm
 */
function Realm(realm)
{


	/**
	 * Realm ID
	 * @type Number
	 */
	this.ID = realm.id;

	/**
	 * Width of realm in tiles.
	 * @type Number
	 */
	this.W = realm.w;

	/**
	 * Width of realm in tiles.
	 * @type Number
	 */
	this.H = realm.h;

	/**
	 * Width of each tile in realm.
	 * @type Number
	 */
	this.TileW = GlobalState.TileW;

	/**
	 * Height of each tile in realm.
	 * @type Number
	 */
	this.TileH = GlobalState.TileH;

	/**
	 * Padding tiles on left/right of the realm
	 * @type Number
	 */
	this.PaddingX = 0;

	/**
	 * Padding tiles on top/bottom of the realm.
	 * @type Number
	 */
	this.PaddingY = 0;

	/**
	 * Total width of the realm including padding tiles.
	 * @type Number
	 */
	this.RowWidth  = this.W; // default to realm width

	/**
	 * Total height of the realm including padding tiles.
	 * @type Number
	 */
	this.RowHeight = this.H; // default to realm height

	this.RenderWidth  = this.RowWidth * this.TileW;
	this.RenderHeight = this.RowHeight * this.TileH;

	// Set the padding propperly
	var xPad = Math.max(0, Math.floor((CANVAS_W_HALF - (this.W * this.TileW)) / this.TileW)),
		yPad = Math.max(0, Math.floor((CANVAS_H_HALF - (this.H * this.TileH)) / this.TileH));

	if (xPad < REALM_PADDING_X)
	{
		xPad = REALM_PADDING_X;
	}

	if (yPad < REALM_PADDING_Y)
	{
		yPad = REALM_PADDING_Y;
	}

	this.SetPadding(xPad, yPad);

	// Tiles //////////////////////////////////////////////////////////////////
	/**
	 * Realms base TileSet
	 * @type TileSet
	 */
	this.Tileset = new TileSet(realm.set, realm.tile_lookup, this.TileW, this.TileH);

	this.modifiedTiles = [];
	this.clearDynamic = false;

	/**
	 * Array of all tiles in the realm (Includes Padding Tiles)
	 * @type Array<Tiles>
	 */
	this.Tiles = this._buildTiles(realm.tiles);
	this.TilesInView = [];

	/**
	 * Have the tiles in view changed
	 * @type Boolean
	 */
	this.TilesInViewChanged = false;

	this.Blocking = realm.block;

	// Locations //////////////////////////////////////////////////////////////
	this.Locations = {};
	this.Locations.Fixed   = this._buildFixedLocations(realm.fixed);
	this.Locations.Dynamic = [];

	// BackBuffer /////////////////////////////////////////////////////////////
	var backBuffer = Realm.prototype.BackBuffer;

	backBuffer.SetSize(this.RenderWidth, this.RenderHeight);

	var dynamicBuffer = Realm.prototype.DynamicBackBuffer;
	dynamicBuffer.SetSize(this.W * this.TileW, this.H * this.TileH);

	var min = Math.min(1, Math.max(CANVAS_H / (this.ColHeight * 40), CANVAS_W / (this.RowWidth * 40))),
		max = Math.max(2, Math.min(CANVAS_H / (this.ColHeight * 40), CANVAS_W / (this.RowWidth * 40)));

	GameController.Camera.SetBounds(0, 0, this.RenderWidth, this.RenderHeight);

	this.topLeft 	 = new Vector2(0, 0);
	this.bottomRight = new Vector2(CANVAS_W, CANVAS_H);

	this.footprintTexture = undefined;

	$.publish('setZoomLevels', {min: min, max: max});
}

Realm.prototype.BackBuffer = new BackBuffer(0,0);
Realm.prototype.DynamicBackBuffer = new BackBuffer(0,0);

/**
 * Sets the padding of the realm, recalculates the row width.
 * @param {Number} [x] Number of tiles padding in X
 * @param {Number} [y] Number of tiles padding in Y
 */
Realm.prototype.SetPadding = function(x, y)
{
	var xPadding = x,
		yPadding = y;

	this.PaddingX = xPadding;
	this.PaddingY = yPadding;

	this.RowWidth = this.W + xPadding * 2;
	this.ColHeight = this.H + yPadding * 2;

	// Set Render Width & Height
	this.RenderWidth = this.RowWidth * this.TileW;
	this.RenderHeight = this.ColHeight * this.TileH;
};

/**
 * Builds the tiles
 * @param {Array} Tiles Indicies
 */
Realm.prototype._buildTiles = function(tiles)
{
	var paddingX = this.PaddingX,
		paddingY = this.PaddingY,
		randomTiles = GameData.defines().randomTiles,
		rLength = randomTiles.length,
		maxY = this.H + paddingY,
		maxX = this.W + paddingX,
		w = this.W,
		h = this.H,
		w1 = w-1,
		h1 = h-1;

	var builtTiles = new Array((this.RowWidth * this.ColHeight)),
		i = 0;

	this.modifiedTiles = Array((this.RowWidth * this.ColHeight));

	for(var y = -paddingY; y < maxY; y++){
		for(var x = -paddingX; x < maxX; x++, i++){
			var isPadding = (x < 0 || y < 0 || x >= w1 || y >= h1),
				m = (isPadding) ? randomTiles[Math.floor(Math.random() * rLength)] : tiles[y][x],
				t = '';

			var tile = new Tile(this, x, y, this.Tileset.GetMold(m));

			builtTiles[i] = tile;
		}
	}

	return builtTiles;
};


Realm.prototype._buildFixedLocations = function(fixedLocations)
{
	var realmId = this.ID,
		output  = [],
		texture = new Texture('http://cdn.fallensword.com/realms/' + realmId + '_sheet.png');

	// Build Frame Sources
	var indexPosX = 0,
		indexPosY = 0,
		tileSources = [],
		tileW = GlobalState.TileW,
		tileH = GlobalState.TileH,
		perRow = GlobalState.TilesPerRow;

	var realm = this;


	// TODO: Make locations into an array
	$.each(fixedLocations, function(i, location){
		// TODO: Find out why andrew's code sends NULL?
		// TODO: Find out why andrew's code sends < 1
		var f = location.f,
			frameCount = (f === null || f < 1) ? 1 : f;

		tileSources[i] = new Array(frameCount);

		var startIndex= location.i,
			indexPosX = startIndex % perRow,
			indexPosY = ~~(startIndex / perRow);

		for(var j = 0; j < frameCount; j++)
		{
			var d = (location.d.length > 0) ? location.d[j] : 0;

			tileSources[i][j] = {
				source: {
					x: indexPosX * tileW,
					y: indexPosY * tileH
				},
				duration: d
			};

			indexPosX++;

			if (indexPosX === perRow)
			{
				indexPosY++;
			}

			indexPosX %= perRow;
		}

		var tip = '';

		switch (location.type)
		{
			case 0: // Stairway
				tip = '<div class="stairway"><span class="icon"></span>'+location.name+'</div>';
				break;

			case 1: // Shop
				tip = '<div class="shop"><span class="icon"></span>'+location.name+'</div>';
				break;

			case 2: // Scenery
				if (location.info === undefined || location.info === '') {
					break;
				}
				tip = '<div class="scenery">'+location.info.replace(/\\'/ig, "'")+'</div>';
				break;

			case 3: // Portal
				tip = '<div class="portal"><span class="icon"></span>'+location.name+'</div>';
				break;

			case 4: // Relic
				tip = '<div class="relic"><span class="icon"></span>'+location.name+'</div>';
				break;

		}

		output[i - 1] = new TileLocation(realm, location.x, location.y, new Sprite(tileW, tileH, texture, tileSources[i]), tip);
	});

	return output;
};

Realm.prototype._buildDynamicLocations = function(dynamicLocations)
{
	var realm  = this,
		output = [],
		tileW  = GlobalState.TileW,
		tileH  = GlobalState.TileH,
		perRow = GlobalState.TilesPerRow;

	$.each(dynamicLocations, function(l, location){
		switch (location.type) {
			case 0: // Titan
				var baseCreatureID = location.base_creature_id,
					texture = new Texture('http://cdn.fallensword.com/titans/' + baseCreatureID + '_sheet.png');

				var numDirections = location.data.length;
				var indexPosX = 0,
					indexPosY = 0,
					directionSources = [],
					directionSprites = [];

				for (var i = 0; i < numDirections; i++)
				{
					var direction = location.data[i],
						f = direction.f,
						frameCount = (f === null || f < 1) ? 1 : f;

					directionSources[i] = new Array(frameCount);

					for(var j = 0; j < frameCount; j++)
					{
						var d = (frameCount > 1) ? direction.d[j] : 0;

						directionSources[i][j] = {
							source: {
								x: indexPosX * tileW,
								y: indexPosY * tileH
							},
							duration: d
						};

						indexPosX++;

						if (indexPosX === perRow)
						{
							indexPosY++;
						}

						indexPosX %= perRow;
					}

					directionSprites[i] = new Sprite(tileW, tileH, texture, directionSources[i]);
				}

				output[l] = new Titan(realm, parseInt(location.x), parseInt(location.y), directionSprites, '<div class="creature creature-4"><span class="icon"></span>'+location.name+'</div>', location.dir);
				break;

			case 1: // Markers
				var texture = new Texture('http://cdn.fallensword.com/skin/v2/tutorial/square_swirly_yellow.png'),
					source = [];

				var dur = 7;

				for (var z=0; z <= 11; z++)
				{
					source[z] = { source: { x: (z * 72), y: 0 }, duration: dur };
				}

				var lol = (output[l] = new TileLocation(realm, parseInt(location.x), parseInt(location.y), new Sprite(72, 72, texture, source), '<div class="scenery">Tutorial Target Location</div>'));

				// Set Drawing Coordinates
				lol.X = (lol.RealmX * tileW) - 16;
				lol.Y = (lol.RealmY * tileH) - 16;

				break;

			case 2: // Indicators
				var texture = new Texture('http://cdn.fallensword.com/skin/v2/realm/indicators.png'),
				tooltip = null,
				source = [],
				offset = 0;

				if (location.subtype == 3) {
					offset += (location.blocked == 1 ? 3 : 0) * tileW;
				}

				source[0] = {
					source: {
								x: (tileW*location.subtype) + offset,
								y: 0
							},
					duration: 0
				};

				if (location.subtype < 3)
				{
					tooltip = '<div class="scenery">Quest: ' + location.name + '</div>';
				}

				var lol = (output[l] = new TileLocation(realm, parseInt(location.x), parseInt(location.y), new Sprite(tileW, tileH, texture, source), tooltip));

				// Set Drawing Coordinates
				lol.X = lol.RealmX * lol.mold.W;
				lol.Y = lol.RealmY * lol.mold.H;

				break;
		}
	});

	this.clearDynamic = true;
	this.dynamicDirty = true;
	return output;
};

/**
 * Gets the tooltip of the current tile
 * @param {Integer} x
 * @param {Integer} y
 * @return {String} html tooltip
 */
Realm.prototype.GetTooltip = function(x, y)
{
	var locations = this.Locations,
		dynamic   = locations.Dynamic,
		fixed	  = locations.Fixed;

	// Check for Dynamic & Return (They're More Important)
	for(var i = dynamic.length; i--;)
	{
		if (dynamic[i].RealmX === x && dynamic[i].RealmY === y && dynamic[i].Tooltip != null)
		{
			return dynamic[i].Tooltip;
		}
	}

	// Check for Static & Return
	for(var i = fixed.length; i--;)
	{
		if (fixed[i].RealmX === x && fixed[i].RealmY === y)
		{
			return fixed[i].Tooltip;
		}
	}

	// Otherwise Return false

	return false;
};

/**
 * Checks if a tile is a padding tile or a realm tile.
 * @param {Number} index
 * @return {Boolean} true if the tile is part of the padding
 */
Realm.prototype.IsPaddingTile = function(index)
{
	var paddingX = this.PaddingX,
		paddingY = this.PaddingY,
		rowWidth = this.RowWidth,
		realmW = this.W,
		realmH = this.H;

	// Is it in the top/bottom padding?
	if (index < rowWidth * paddingY || index > rowWidth * paddingY + realmH)
	{
		return true;
	}

	// Is it in the left/right padding?
	var rowPosition = index % rowWidth;

	if (rowPosition < paddingX || rowPosition > paddingX + realmW)
	{
		return true;
	}

	// Must be a realm tile
	return false;
};

Realm.prototype.CoordinateToPosition = function(x, y)
{
	var t = this.Tiles[this.CoordinateToIndex(x, y)];

	return new Vector2(t.X, t.Y);
};

/**
 * Converts a tile coordinate to an index. This includes padding and accepts negative coordinates relative to the realm.
 * @param {Number} x
 * @param {Number} y
 * @return {Number} Index
 */
Realm.prototype.CoordinateToIndex = function(x, y)
{
	var rowWidth = this.RowWidth;

	y = y + this.PaddingY;

	return ((y * rowWidth) + x + this.PaddingX);
};

/**
 * Converts a tile coordinate to an index. This includes padding and accepts negative coordinates relative to the realm.
 * @param {Number} x
 * @param {Number} y
 * @return {Number} Index
 */
Realm.prototype.CoordinateToIndexAutoPadding = function(x, y)
{
	var lX = x - this.PaddingX,
		lY = y - this.PaddingY;

	return this.CoordinateToIndex(lX, lY);
};

/**
 * Converts a tile coordinate to an index. This includes padding and accepts negative coordinates relative to the realm.
 * @param {Number} x
 * @param {Number} y
 * @return {Number} Index
 */
Realm.prototype.CoordinateToIndexAutoPaddingFAST = function(x, y, rowWidth)
{
	return ((y * rowWidth) + x);
};

/**
 * Converts a tile coordinate to an index. This excludes padding.
 * @param {Number} x
 * @param {Number} y
 * @return {Number} Index
 */
Realm.prototype.CoordinateToIndexNoPadding = function(x, y)
{
	return y * this.W + x;
};

/**
 * Converts a tile index to relative to realm coordinates. It is possible to return negative coordinates.
 * @param {Number} index
 */
Realm.prototype.IndexToCoordinate = function(index)
{
	var rowWidth = this.RowWidth,
		y = (Math.floor(index / rowWidth)) - this.PaddingY,
		x = (index % rowWidth) - this.PaddingX;

	return {x: x, y: y};
};

/**
 * Converts a world position into a realm coordinate
 * @param {Float} x
 * @param {Float} y
 * @return {Vector2}
 */
Realm.prototype.PositionToCoordinate = function(x, y)
{
	return new Vector2((x <= 0) ? 0 : (~~(x / this.TileW))  - this.PaddingX, (y <= 0) ? 0 : (~~(y / this.TileH)) - this.PaddingY);
};


/**
 * Checks if a tile is blocked. Note: the indexing starts from the first tile (including padding tiles).
 * @param {Number} index
 * @return {Boolean} true if tile is blocked
 */
Realm.prototype.IsBlocked = function(index)
{
	var coords = this.IndexToCoordinate(index);

	return this.IsBlockedXY(coords.x, coords.y);
};

/**
 * Checks if a tile is blocked. Note: The coordinates exclude padding tiles.
 * @param {Number} x
 * @param {Number} y
 * @return {Boolean} true if tile is blocked
 */
Realm.prototype.IsBlockedXY = function(x, y)
{
	// Simply out of bounds
	return ((x < 0 || y < 0 || x > this.W || y > this.H) || this.Blocking.charAt(this.CoordinateToIndexNoPadding(x, y)) === '1');
};

/**
 * Updates the realm.
 * @param {GameTime} gameTime
 * @param {Array} tilesToUpdate
 */
Realm.prototype.Update = function(gameTime, tilesToUpdate)
{
	// Update the TileSet
	this.tilesetDirty = this.Tileset.Update(gameTime);

	// Update Locations
	var fixed = this.Locations.Fixed;

	this.fixedDirty = false;

	for (var i = fixed.length; i--;)
	{
		if (fixed[i].Update(gameTime))
		{
			this.fixedDirty = true;
		}
	}

	var dynamic = this.Locations.Dynamic;

	//this.dynamicDirty = false;

	for (var i = dynamic.length; i--;)
	{
		if (dynamic[i].Update(gameTime))
		{
			this.dynamicDirty = true;
		}
	}

	// Update tiles in view
	var lastTilesInView = this.TilesInView.splice(0);
	this.TilesInView = this.CalculateTilesInView();

	if (lastTilesInView.length !== this.TilesInView.length)
	{
		this.TilesInViewChanged = true;
		return;
	}

	var tilesInView = this.TilesInView;

	for (var i = tilesInView.length; i--;)
	{
		if (lastTilesInView[i] !== tilesInView[i])
		{
			this.TilesInViewChanged = true;

			return;
		}
	}
};

Realm.prototype.CalculateTilesInView = function()
{
	var rowWidth = this.RowWidth,
		pX = this.PaddingX,
		pY = this.PaddingY,
		tw = this.TileW,
		th = this.TileH,
		camera = GameController.Camera,
		tl = camera.GetWorldPosition(this.topLeft),
		br = camera.GetWorldPosition(this.bottomRight),
		left 	= Math.max(~~(tl.X / tw) - 1, 0),
		top  	= Math.max(~~(tl.Y / th) - 1, 0),
		right 	= Math.min(~~(br.X / tw) + 1, rowWidth),
		bottom 	= Math.min(~~(br.Y / th) + 1, this.ColHeight);

	var maxLength = (right - left) * (bottom - top),
		tilesInView = new Array(maxLength);

	var i = -1;

	for (var y = top; y < bottom; y++)
	{
		for (var x = left; x < right; x++)
		{
			tilesInView[++i] = this.CoordinateToIndexAutoPaddingFAST(x, y, rowWidth);
		}
	}

	return tilesInView;
};

/**
 * Draws the realm.
 * @param {GameTime} gameTime
 * @param {Context2d} c
 * @param {Array} tilesToDraw
 */
Realm.prototype.Draw = function(gameTime, c, force)
{
	if (!force && !this.tilesetDirty && !this.fixedDirty && !this.dynamicDirty && !this.TilesInViewChanged && (this.footprintsUpdated == undefined  || !this.footprintsUpdated))
	{
		return false;
	}

	var tiles = this.Tiles,
		tilesInView = this.TilesInView,
		modifiedTiles = this.modifiedTiles,
		numTilesInView = tilesInView.length,
		context = Realm.prototype.BackBuffer.Context,
		self = this;

	if(numTilesInView > 0)
	{
		for (var i = numTilesInView; i--;)
		{
			modifiedTiles[tilesInView[i]] = tiles[tilesInView[i]].Draw(gameTime, context);
		}
	}

	this.TilesInViewChanged = false;

	// Draw Locations
	var fixed = this.Locations.Fixed;

	for (var i = fixed.length; i--;)
	{
		var fixedLocation = fixed[i],
			tileIndex = fixedLocation.TileIndex,
			tileInView = false;

		for(var j=numTilesInView;j--;)
		{
			if (tilesInView[j] === tileIndex)
			{
				tileInView = true;
				break;
			}
		}

		if (tiles[fixedLocation.TileIndex] && tileInView)
		{
			if (modifiedTiles[fixedLocation.TileIndex])
			{
				fixedLocation.Redraw = true;
				fixedLocation.mold.Redraw = true;
			}

			// TODO: Redraw tile below for transparency support
			if (fixedLocation.Draw(gameTime, context)) {
				modifiedTiles[fixedLocation.TileIndex] = true;
			}
		}
	}

	var dynamic = this.Locations.Dynamic,
		dynBuffer = Realm.prototype.DynamicBackBuffer,
		dynContext = dynBuffer.Context,
		dynamicBufferCleared = false;

	//if(this.clearDynamic)
	{
		dynBuffer.Clear();
		this.clearDynamic = false;
		dynamicBufferCleared = true;
	}

	for (var i = dynamic.length; i--;)
	{
		var dynamicLocation = dynamic[i],
			tileIndex = dynamicLocation.TileIndex,
			tileInView = false;

		for(var j=numTilesInView;j--;)
		{
			if (tilesInView[j] === tileIndex)
			{
				tileInView = true;
				break;
			}
		};

		dynamicLocation.Redraw = true;

		if(tileInView && (dynamicLocation.Redraw || dynamicLocation.mold.frame!=dynamicLocation.lastFrame))
		{
			if(!dynamicBufferCleared)
				dynContext.clearRect(dynamicLocation.X, dynamicLocation.Y, dynamicLocation.mold.W, dynamicLocation.mold.H);

			dynamicLocation.Draw(gameTime, dynContext);
		}

	}

	// hoofprints
	if(GameController.footprintsEnabled && this.footprintTexture != undefined && GameController.Player != undefined && self.footprintTileList != undefined)
	{
		var len = self.footprintTileList.length;
		for(var i = 0; i < len; i++)
		{
			self.footprintTileList[i].Redraw = true;
			self.footprintTileList[i].Draw(gameTime, dynContext);
		}
	}

	this.dynamicDirty = false;
	this.footprintsUpdated = false;

	return true;
};/*global AStarGrid GameController Mouse BackBuffer Realm*/

function Router()
{
	this._tileW = 0;
	this._tileH = 0;
	
	this._pathfinder = undefined;
	
	this._currentRoute = [];
	this._plannedRoute = [];
	this._badRoute     = [];

	this._teleportActive = false;
	
	var self = this;
	
	$.subscribe('click.mapCanvas', function()
	{
		if (self._teleportActive)
		{
			GameController.Player.Teleport(self._plannedRoute[self._plannedRoute.length - 1].x, self._plannedRoute[self._plannedRoute.length - 1].y);
		}
		else if (!GameController.Player.Moving)
		{
			self.SetCurrentRoute();
		}
		else
		{
			GameController.Player._clearMoveQueues();
		}
	});
	
	$.subscribe('move.player', function(e, data){
		self._currentRoute.shift();
		
		self.Draw();
	});
	
	$.subscribe('move-end.player', function(e, data){
		self._currentRoute = [];
		
		self.Draw();
	});
	
	$.subscribe('5-success.action-response', function(e, data){
		self._currentRoute = [];
		self._plannedRoute = [];
		self._badRoute     = [];
	});
}

Router.prototype.BackBuffer = new BackBuffer(0,0);

/**
 * 
 * @param {Realm} realm
 */
Router.prototype.Init = function(realm)
{
	var w = realm.W,
		h = realm.H;
	
	// Set Tile W
	this._tileW = realm.TileW;
	this._tileH = realm.TileH;
	
	// Set Zero Zero Tile
	this._zeroX = realm.PaddingX * realm.TileW;
	this._zeroY = realm.PaddingY * realm.TileH;
	
	// Set the render size
	Router.prototype.BackBuffer.SetSize(realm.RenderWidth, realm.RenderHeight);
	
	this._pathfinder = new AStarGrid(w, h, function(x, y){return realm.IsBlockedXY(x, y);});
};

Router.prototype.Update = function(gameTime)
{
	
};

Router.prototype.Draw = function()
{
	var buffer = Router.prototype.BackBuffer,
		c = buffer.Context,
		zX = this._zeroX,
		zY = this._zeroY,
		w  = this._tileW,
		h  = this._tileH;
	
	// Clear Buffer
	buffer.Clear();

	var planned = this._plannedRoute,
		plannedLen = planned.length;
	
	if (plannedLen > 0) {
		if (!this._teleportActive)
		{
			Router.prototype._drawRouteAsDottedLines(planned,  c, zX, zY, w, h, 4, 'rgba(0,255,0,0.5)', 4);
		}
		Router.prototype._drawRouteAsOutlines([planned[plannedLen - 1]], c, (this._teleportActive ? 'rgba(0,0,255,0.5)' : 'rgba(0,255,0,0.5)'), zX, zY, w, h, 4);
	}
	
	Router.prototype._drawRouteAsDottedLines	(this._currentRoute,  c, zX, zY, w, h, 4, 'rgba(255,0,0,.5)', 4);
	Router.prototype._drawRoute					(this._badRoute, 	  c, 'rgba(255,0,0,0.5)', 	zX, zY, w, h);
};

Router.prototype.toggleTeleport = function(){
	if (this._teleportActive)
	{
		this.deactivateTeleport();
	}
	else
	{
		this.activateTeleport();
	}
};

Router.prototype.activateTeleport = function(){
	var $button = $('.teleport');

	if (!$button.hasClass('cooldown'))
	{
		this._teleportActive = true;
		$button.addClass('activated');

		this.Draw();
	}
};

Router.prototype.deactivateTeleport = function(){
	this._teleportActive = false;

	$('.teleport').removeClass('activated');
	this.Draw();
};

Router.prototype.cooldownTeleport = function(seconds){
	$('.teleport').addClass('cooldown');
	this.deactivateTeleport();

	setTimeout(function () {
		$('.teleport').removeClass('cooldown');
	}, seconds * 1000);
};

Router.prototype._drawRouteAsDots = function(route, context, zX, zY, w, h, dotRadius, fillStyle, lineWidth, strokeStyle){
	var routeLen = route.length;
	
	// Is there a route?
	if (!routeLen) 
	{
		return false;
	}
	
	var fullCircle = Math.PI * 2;
	
	// Add half a tile
	zX += (w / 2);
	zY += (h / 2);
	
	// Set Style
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.fillStyle = fillStyle;
		
	// Draw Planned Route
	for (var i = 0; i < routeLen; i++)
	{
		var thisTile = route[i];
		
		//context.moveTo(zX + (thisTile.x * w), zY + (thisTile.y * h));
		context.beginPath();
			context.arc(zX + (thisTile.x * w), zY + (thisTile.y * h), dotRadius, 0, fullCircle);
			context.fill();
			context.stroke();
		
		if ((i + 1) === routeLen) {
			continue;
		}
				
		var nextTile = route[i + 1],
			xDir = nextTile.x - thisTile.x,
			yDir = nextTile.y - thisTile.y;

		context.beginPath();
			context.arc(zX + (thisTile.x * w) + (xDir * (w/2)), zY + (thisTile.y * h) + (yDir * (h/2)), dotRadius, 0, fullCircle);
			context.fill();
			context.stroke();
	}
	
	return true;
};


Router.prototype._drawRouteAsLines = function(route, context, zX, zY, w, h, lineWidth, strokeStyle){
	var routeLen = route.length;
	
	// Is there a route?
	if (!routeLen) 
	{
		return false;
	}
	
	// Add half a tile
	zX += w / 2;
	zY += h / 2;
	
	// Set Style & Width
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	
	// Move to start
	context.beginPath();
	context.moveTo(zX + (route[0].x * w), zY + (route[0].y * h));
	
	// Draw Planned Route
	for (var i = 0; i < routeLen; i++)
	{
		context.lineTo(zX + (route[i].x * w), zY + (route[i].y * h), w, h);
	}
	
	// Stroke
	context.stroke();
	
	return true;
};

Router.prototype._drawRouteAsDottedLines = function(route, context, zX, zY, w, h, lineWidth, strokeStyle, dashLength){
	var routeLen = route.length;
	
	// Is there a route?
	if (!routeLen) 
	{
		return false;
	}
	
	// Add half a tile
	zX += w / 2;
	zY += h / 2;
	
	// Set Style & Width
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;

	// Draw Planned Route
	for (var i = 1; i < routeLen; i++)
	{
		var dX = (route[i].x - route[i-1].x) * w,
			dY = (route[i].y - route[i-1].y) * h,
			distance = Math.sqrt(dX * dX + dY * dY),
			dashes = Math.floor(distance / dashLength),
			dashX = dX / dashes,
			dashY = dY / dashes;
		
		var startX = zX + (route[i-1].x * w),
			startY = zY + (route[i-1].y * h);

		context.beginPath();
		
		context.moveTo(startX, startY);
				
		// Draw first (half dash)
		startX += dashX / 2;
		startY += dashY / 2;
		
		context.lineTo(startX, startY);
		
		for(var j = dashes - 1; j > 1; j--)
		{
			startX += dashX;
			startY += dashY;
			
			if (j % 2)
				context.moveTo(startX, startY);
			else
				context.lineTo(startX, startY);
		}
						
		// Draw last (half dash)
		startX += dashX;
		startY += dashY;
		
		context.moveTo(startX, startY);
		context.lineTo(startX + dashX / 2, startY + dashY / 2);
		
		context.stroke();
	}
	
	return true;
};

Router.prototype._drawRouteAsOutlines = function(route, context, fillStyle, zX, zY, w, h, outlineWidth)
{
	var routeLen = route.length;
	
	if (!routeLen) {
		return false;
	}
	
	// Set Colour
	context.fillStyle = fillStyle;
	
	// Draw Planned Route
	for (var i = routeLen; i--;) 
	{
		var tile = route[i];

		var tlX = zX + (tile.x * w) - outlineWidth,
			tlY = zY + (tile.y * h) - outlineWidth;
		
		// Top
		context.fillRect(tlX, tlY, w + (outlineWidth * 2), outlineWidth);
		
		// Left
		context.fillRect(tlX, tlY + outlineWidth, outlineWidth, h);
		
		// Right
		context.fillRect(tlX + w + outlineWidth, tlY + outlineWidth, outlineWidth, h);
		
		// Bottom
		context.fillRect(tlX, tlY + h + outlineWidth, w + (outlineWidth * 2), outlineWidth);
	}
	
};

Router.prototype._drawRoute = function(route, context, fillStyle, zX, zY, w, h)
{
	var routeLen = route.length;
	
	if (routeLen > 0) 
	{
		// Set Colour
		context.fillStyle = fillStyle;
		
		// Draw Planned Route
		for (var i = routeLen; i--;) 
		{
			var tile = route[i];
			
			context.fillRect(zX + (tile.x * w), zY + (tile.y * h), w, h);
		}
	}
};

Router.prototype.OnTileEnter = function(mouse)
{
	var player = GameController.Player,
		pP = player.PositionInTiles,
		pX = player._currentSend.x || pP.X,
		pY = player._currentSend.y || pP.Y,
		mR = mouse.Realm,
		dX = mR.X,
		dY = mR.Y;
	
	var route = [],
		pathFound = this._pathfinder.search(pX, pY, dX, dY, route);
	
	if (pathFound) 
	{
		this._plannedRoute 	= route;
		this.Draw();
	}
	else 
	{
		this._badRoute = [{x:dX, y:dY}];
		this.Draw();
	}
};

Router.prototype._setPlannedRoute = function(route)
{
	this._plannedRoute = route;
};

Router.prototype.SetCurrentRoute = function()
{
	var player       = GameController.Player,
		fullRoute    = player.SetRoute(this._plannedRoute),
		fullRouteLen = fullRoute.length,
		position     = player.PositionInTiles,
		newRoute     = []; //[{ x: position.X, y: position.Y}];

	
	for (var i = 0; i < fullRouteLen; i++) 
	{
		var thisRouteLen = fullRoute[i].length;
		
		for (var j = 0; j < thisRouteLen; j++) 
		{
			newRoute.push(fullRoute[i][j]);
		}
	}
	
	this._currentRoute = newRoute;
	
	this.Draw();
};

Router.prototype.OnTileLeave = function(mouse)
{
	this._plannedRoute 	= [];
	this._badRoute 		= [];
	
	this.Draw();
};

Router.prototype.Check = function(realm, tile)
{
	return (!realm || !(tile.X < 0 || tile.Y < 0 || tile.X > realm.W || tile.Y > realm.Y));
};/*global GlobalState HCS Vector2 Sprite Texture BackBuffer GameData GameController*/
var _playerMoveSpeed = GlobalState.MoveSpeed;

function Player()
{
	var self = this;

	this.PositionInTiles  = new Vector2();
	this.PositionInPixels = new Vector2();

	this._rotation = 0;
	
	this._moveTime = 0;
	this._lastPosition = new Vector2(-1,-1);
	
	this._moveQueue = [];
	this._sendQueue = [];
	
	this._currentQueue = false;
	this._currentMove  = false;
	this._currentSend  = new Vector2(-1,-1);
	this._predictedPosition = new Vector2(-1,-1);
	
	this._waitingForResponse = 0;
	this._lastResponse 		 = 0;

	this._hidePlayer         = false;
	this._teleporting        = false;
	this._teleportStage      = 0;

	/** @type Vector2 */
	this._teleportLocation   = false;
	
	this.Moving = false;
	this._resetting = false;
	
	this.dragging = false;

	this._subscribe();

	/** @type Sprite */
	this.AvatarSprite   = this._initPlayer();

	/** @type Sprite */
	this.TeleportSprite = this._initTeleport();

	$.subscribe('25-success.action-response', function(e, data){
		if (data.player.location.x == self.PositionInTiles.X && data.player.location.y == self.PositionInTiles.Y)
		{
			self._teleporting = false;
			GameController.Router.deactivateTeleport();
			return;
		}

		GameController.Router.cooldownTeleport(GameData.player().teleportCooldown);

		self._teleportLocation = new Vector2(data.player.location.x, data.player.location.y);
		self._teleportStage    = -36;
	});
}

Player.prototype.Teleport = function(x, y){
	if (!this.Moving)
	{
		this._lastPosition = false;
		this._currentSend = false;
		this._clearMoveQueues();

		this._teleporting = true;

		GameData.doAction(
			HCS.DEFINES.ACTION.TELEPORT,
			FETCH_FLAGS.ACTIONS + FETCH_FLAGS.PLAYER_STATS,
			{'x': x, 'y': y},
			0
		);
	}
};

Player.prototype.AvatarBackBuffer   = new BackBuffer(0,0);
Player.prototype.TeleportBackBuffer = new BackBuffer(0,0);

Player.prototype._initPlayer = function()
{
	var texture = new Texture('http://cdn.fallensword.com/world/player.png'),
		w       = 24,
		h       = 52,
		frames  = new Array(9);

	for (var i = 0; i < 9; i++) {
		frames[i] = {source: {x: i * 24, y: 0}, duration: 10};
	}

	// Create Sprite
	var sprite  = new Sprite(w, h, texture, frames),
		bb      = Player.prototype.AvatarBackBuffer;

	sprite.Paused = true;
	bb.SetSize(w, h);

	texture.OnReady(function(){
		sprite.Redraw = true;
		sprite.Draw(0, bb.Context, 0, 0);
	});

	return sprite;
};

Player.prototype._initTeleport = function()
{
	var texture = new Texture('http://cdn.fallensword.com/world/tp.png'),
		w       = 64,
		h       = 64,
		frames  = new Array(36);

	for (var i = 0; i < 36; i++) {
		frames[i] = {source: {x: i * 64, y: 0}, duration: 10};
	}

	var sprite  = new Sprite(w, h, texture, frames),
		bb      = Player.prototype.TeleportBackBuffer;

	bb.SetSize(w, h);

	texture.OnReady(function(){
		sprite.Redraw = true;
		sprite.Draw(0, bb.Context, 0, 0);
	});

	return sprite;
};

Player.prototype.SetRoute = function(route){
	var routeLength = route.length;
	
	this._clearMoveQueues();
	
	if (this._predictedPosition.X === -1) 
	{
		this._predictedPosition = new Vector2(route[0].x, route[1].y);
	}

	for(var i = 1; i < routeLength; i++)
	{
		var pp = this._predictedPosition,
			xDir = route[i].x - pp.X,
			yDir = route[i].y - pp.Y;
		
		$.publish('move-attempt.player', {x: xDir, y: yDir});
	}
	
	return this._moveQueue;
};

Player.prototype.SetPosition = function(x, y, moveCamera)
{
	var tileW = GlobalState.TileW,
		tileH = GlobalState.TileH;

	this._predictedPosition = new Vector2(x, y);
	this.PositionInTiles.Set(x, y);
	this.PositionInPixels.Set(((GameController.Realm.PaddingX + x) * tileW) + GlobalState.TileWHalf, ((GameController.Realm.PaddingY + y) * tileH) + GlobalState.TileHHalf);

	if (moveCamera)
	{
		GameController.Camera.Position = this.PositionInPixels.Clone();
		GameController.Camera._actualPosition = this.PositionInPixels.Clone().Add(1, 1);
	}
};

Player.prototype._subscribe = function()
{
	/**
	 * @type Player
	 */
	var self = this;
	
	// Realm Change
	$.subscribe('id.realm', function(){
		var loc = GameData.player().location;
		
		self._predictedPosition = new Vector2(loc.x, loc.y);

		self._lastPosition = false;
		self._currentSend = false;
		
		// Set Pos?
	});
	
	// Acknowledge Response
	$.subscribe('4-success.action-response', function(e, data){
		self._lastResponse++;
		
		if (data.response.response === 0)
		{
			return true; // no errors
		}
		
		// see if they have run out of stamina
		if(data.response.response==3 || data.response.response==4)
		{
			openNoStaminaDialog();
		}
		
		// Error Checking & Resetting
		self._currentSend = false;
		self._clearMoveQueues();

		self._currentMove = {x: data.player.location.x, y: data.player.location.y, t: 100};
		self._resetting = true;

		return false;
	});
	
	$.subscribe('5-success.action-response', function(e, data){
		self._clearMoveQueues();
		
		self._currentSend = new Vector2(-1, -1);
		
		var pp = data.player.location;
		
		self._predictedPosition = new Vector2(pp.x, pp.y);
	});
	
	// Move Attempted
	$.subscribe('move-attempt.player', function(e, data){
		if ((data.repeat && self.Moving) || self._teleporting) {
			return;
		}
		
		var xDir = data.x,
			yDir = data.y;
				
		if (!self._predictPosition(xDir, yDir)) 
		{
			return;
		}
		
		var pp = self._predictedPosition;
		
		// Add to the animation queue
		self._moveQueue.push(self._createMoveSequence(pp, xDir, yDir));

		// Add to the server queue
		self._sendQueue.push({x: pp.X, y: pp.Y, t: _playerMoveSpeed});
	});
	
	var keys = HCS.defines.keys;
	
	// Stop Key
	$.subscribe('keydown.controls', function(e, data){
		if (data !== keys.STOP) 
		{
			return;
		}
		
		self._clearMoveQueues();
	});
	
	$.subscribe('dragstart.mapCanvas', function(){
		self.dragging = true;
	});
	
	$.subscribe('dragend.mapCanvas', function(){
		self.dragging = false;
	});
};

/**
 * Tests & Updates the predicted position. 
 * @param {Number} x
 * @param {Number} y
 * @return {Boolean} Move Allowed?
 */
Player.prototype._predictPosition = function(x, y)
{
	var tmp = this._predictedPosition.Clone().Add(x, y),
		notBlocked = !GameController.Realm.IsBlockedXY(tmp.X, tmp.Y);
		
	if (notBlocked) 
	{
		this._predictedPosition = tmp;
	}

	return notBlocked;
};

Player.prototype._clearMoveQueues = function()
{
	// Reset Queues
	this._moveQueue.length = 0;
	this._sendQueue.length = 0;
	
	// Update Predicted Position
	var cS = this._currentSend;
		
	this._predictedPosition = (cS === false) ? this.PositionInTiles.Clone() : new Vector2(cS.x, cS.y);
};

Player.prototype._createMoveSequence = function(end, xDir, yDir)
{
	var startX = end.X - xDir,
		startY = end.Y - yDir,
		t = _playerMoveSpeed;
	
	if (xDir === 0 || yDir === 0) 
	{	
		return [{x: end.X, y: end.Y, t: t}];
	}
	else 
	{
		var r = GameController.Realm,
			col = r.IsBlockedXY(end.X, startY),
			row = r.IsBlockedXY(startX, end.Y);
		
		
		if ((!col && !row) || (row && col)) // Diagonal
		{
			return [{x: end.X, y: end.Y, t: t * 1.414}];
		}
		else if (row) // X then Y
		{
			return [{x: end.X, y: startY, t: t * 1.414}, 
					{x: end.X, y: end.Y, t: t}];
		}
		else // Y then X
		{
			return [{x: startX, y: end.Y, t: t * 1.414},
					{x: end.X,  y: end.Y, t: t}];
		}
	}
};

Player.prototype.Update = function(gameTime)
{
	var moveQueue = this._moveQueue,
		moveQueueLength = moveQueue.length,
		moveTime = this._moveTime;

	// Execute the next queued move
	// - Removed "this._waitingForResponse === this._lastResponse" from if statement below. - Zorg
	if (moveQueueLength > 0 && moveTime === 0 && this._currentQueue === false)
	{
		var currentQueue = (this._currentQueue = moveQueue.shift());
		
		if (currentQueue !== false) 
		{
			this._waitingForResponse++;
			var send = this._sendQueue.shift();
			this._currentSend = send;
			
			$.publish('move-attempt-2.player', {
				x: send.x,
				y: send.y
			});
		}
	}
	
	var cQ = this._currentQueue;
	
	// There's a move to be done
	if (cQ !== false || this._resetting) 
	{
		var currentMove = this._currentMove;

		// It's a new move
		if (moveTime === 0) 
		{
			if (this._resetting) {
				this._resetting = false;
				
				return;
			}
			
			// Last Position
			var lastPosition = (this._lastPosition = this.PositionInTiles.Clone());

			// TODO: check this location is not already added in lookup

			if(GameController.footprintsEnabled)
			{
				if(GameController.Realm.footprintTileList == undefined)
					GameController.Realm.footprintTileList = [];

				// check this location isn't on the footprint list
				var len = GameController.Realm.footprintTileList.length,
					found = false;

				for(var i = 0; i < len; i++)
				{
					var t = GameController.Realm.footprintTileList[i];
					if(t.RealmX == lastPosition.X && t.RealmY == lastPosition.Y)
					{
						found = true;
						break;
					}
				}

				if(!found)
				{
					this._dropFootprint(lastPosition.X, lastPosition.Y);
				}
			}

			// Current Move
			currentMove = (this._currentMove = this._currentQueue.shift());
			
			// Move Time & Speed
			moveTime += currentMove.t;
			this._moveSpeed = currentMove.t;
			
			// Animate
			this.AvatarSprite.Paused = false;
			
			// Rotation
			if (!this._resetting) {
				this._rotation = this._calculateRotation(currentMove.x, currentMove.y, lastPosition.X, lastPosition.Y);
			}
		}
		
		moveTime -= gameTime.Elapsed;
		
		// Cleanup Move Time
		if (moveTime < 0) 
		{
			moveTime = 0;
		}
		
		// LERP
		this._lerp(this._calculatePercentMoved(moveTime), currentMove);
		
		if (!this.dragging)
		{
			GameController.Camera.Position = this.PositionInPixels.Clone();
		}

		// Have we stopped?
		if (moveTime === 0) 
		{
			// Set last position
			this._lastPosition = this.PositionInTiles.Clone();
			
			// Update State
			this.PositionInTiles.Set(currentMove.x, currentMove.y);
			
			// Clear Current Move
			this._currentMove = false;
			
			$.publish('move.player');
			
			// STOP!
			if (cQ.length === 0) {
				$.publish('move-stop.player');
				
				if (moveQueue.length < 1)
				{
					$.publish('move-end.player');
				}
				
				this.AvatarSprite.Paused = true;
				this._currentQueue = false;
			}
		}
		
		// Save State
		this._moveTime = moveTime;
		this.Moving = true;
	}
	else
	{
		this.Moving = false;
	}

	// Update Avatar
	this._updateAvatar(gameTime);
};

Player.prototype._calculateRotation = function(aX, aY, bX, bY)
{
	var x = aX - bX,
		y = aY - bY,
		target = 0;
	
	if(x === 0 && y === 0){}						//
	else if(x ===  0 && y === -1){ target = 0;   } 	// n
	else if(x ===  1 && y === -1){ target = 45;  } 	// ne
	else if(x ===  1 && y ===  0){ target = 90;  } 	// e
	else if(x ===  1 && y ===  1){ target = 135; } 	// se
	else if(x ===  0 && y ===  1){ target = 180; } 	// s
	else if(x === -1 && y ===  1){ target = 225; } 	// sw
	else if(x === -1 && y ===  0){ target = 270; } 	// w
	else if(x === -1 && y === -1){ target = 315; } 	// nw
	
	return target * Math.PI / 180;
};

Player.prototype._calculatePercentMoved = function(moveTime)
{
	return (this._moveSpeed - moveTime) / this._moveSpeed;
};

Player.prototype._lerp = function(percent, newPosition)
{
	var old = this._lastPosition,
		oldX = old.X,
		oldY = old.Y,
		newX = newPosition.x,
		newY = newPosition.y;
	
	var x = (GameController.Realm.PaddingX + (oldX + (percent * (newX - oldX)))) * GlobalState.TileW,
		y = (GameController.Realm.PaddingY + (oldY + (percent * (newY - oldY)))) * GlobalState.TileH;
	
	this.PositionInPixels.Set(x + GlobalState.TileWHalf, y + GlobalState.TileHHalf);
};

Player.prototype._dropFootprint = function(x, y)
{
	if(GameController.footprintsEnabled)
	{
		var source = [];

		source[0] = {
			source: {
				x: 0,
				y: 0
			},
			duration: 0
		};

		var tileLocation = new TileLocation(GameController.Realm, x, y, new Sprite(40, 40, GameController.Realm.footprintTexture, source), '');
		tileLocation.X = tileLocation.RealmX * 40;
		tileLocation.Y = tileLocation.RealmY * 40;
		GameController.Realm.footprintTileList.push(tileLocation);
		GameController.Realm.footprintsUpdated = true;
	}
};

/**
 * Updates the player Avatar
 * @param {GameTime} gameTime
 * @return {Boolean}
 */
Player.prototype._updateAvatar = function(gameTime)
{
	if (this._teleporting && this._teleportLocation)
	{
		var teleport  = this.TeleportSprite;

		// Hide player for duration
		if (this._teleportStage < 0)
		{
			this._teleportStage++;
			if (this._teleportStage == -8)
			{
				this._hidePlayer = true;
			}
			else if (this._teleportStage == 0)
			{
				this._dropFootprint(this.PositionInTiles.X, this.PositionInTiles.Y);
				this.SetPosition(this._teleportLocation.X, this._teleportLocation.Y, false);

				this._teleportStage = 35;
				GameController.Router._setPlannedRoute([{'x':this._teleportLocation.X, 'y':this._teleportLocation.Y}]);
				GameController.Router.Draw();
			}
		}
		else if (this._teleportStage > 0)
		{
			this._teleportStage--;

			if (this._teleportStage == 28)
			{
				this._hidePlayer       = false;
			}
			else if (this._teleportStage == 0)
			{
				this._teleporting      = false;
				this._teleportLocation = false;
			}
		}

		var bb = Player.prototype.TeleportBackBuffer;

		bb.Clear();
		if (this._teleporting)
		{
			if (this._teleportStage < 0)
			{
				teleport.frame = 36 + this._teleportStage;
			}
			if (this._teleportStage > 0)
			{
				teleport.frame = this._teleportStage;
			}
			return teleport.Draw(0, bb.Context, 0, 0);
		}
	}

	var avatar = this.AvatarSprite;

	if (avatar.Update(gameTime))
	{
		Player.prototype.AvatarBackBuffer.Clear();
		return avatar.Draw(gameTime, Player.prototype.AvatarBackBuffer.Context, 0, 0);
	}
	
	// Avatar not updated
	return false;
};

Player.prototype.Draw = function(gameTime, c)
{
	c.save();
		c.translate(this.PositionInPixels.X, this.PositionInPixels.Y);
		
		c.rotate(this._rotation);

		c.translate(-12, -27);

		if (!this._hidePlayer)
		{
			Player.prototype.AvatarBackBuffer.DrawToContext(c, 0, 0);
		}

		if (this._teleporting && this._teleportLocation)
		{
			c.translate(-20, 0);
			Player.prototype.TeleportBackBuffer.DrawToContext(c, 0, 0);
		}
	c.restore();
};/*global GameController CANVAS_W CANVAS_H BackBuffer*/

function Darkness()
{
	// Setup BackBuffer
	var backBuffer = Darkness.prototype.BackBuffer;
	
	backBuffer.SetSize(CANVAS_W, CANVAS_H);
	
	// Default Vision Radius
	this._visionRadius = false;
}

Darkness.prototype.BackBuffer = new BackBuffer();

Darkness.prototype.SetVisionRadius = function(radius){
	this._visionRadius = radius;
};

/**
 * Draws the darkness
 * @param {GameTime} gameTime
 * @param {CanvasRenderingContext2D} c
 * @param {Player} player
 * @param {Camera} camera
 */
Darkness.prototype.Draw = function(gameTime, c, player, camera)
{
	var context = Darkness.prototype.BackBuffer.Context;
	
	var r = this._visionRadius;
	
	if (r === false)
	{
		return;
	}
	
	var pp = camera.GetScreenPosition(player.PositionInPixels);
	context.clearRect(0,0,CANVAS_W,CANVAS_H);
	context.save();
		context.fillStyle = "rgba(0,0,0,.9)";
		
		context.fillRect(0, 0, CANVAS_W, CANVAS_H);
		
		context.globalCompositeOperation = 'destination-out';

		var aZ = camera._actualZoom,
			aR = r * aZ;
		
		// Create Radial Gradient
		var radgrad = (this._radialGradient = context.createRadialGradient(pp.X,pp.Y,0,pp.X,pp.Y,aR));

		radgrad.addColorStop(0, 'rgba(0,0,0,.9)');
		radgrad.addColorStop(1, 'rgba(0,0,0,0)');
		
		context.fillStyle = radgrad;
		
		context.fillRect(pp.X-aR, pp.Y-aR, aR*2, aR*2);
	context.restore();
	
	Darkness.prototype.BackBuffer.DrawToContext(c, 0,0);
};/*global GameController BackBuffer Camera CANVAS_H CANVAS_W Realm*/

var stageTopLeft = new Vector2(0,0);

function Stage(w, h, camera)
{
	Stage.prototype.BackBuffer.SetSize(w, h);
	
	this.Redraw = false;
	
	this.Camera = camera;
	
	this._lastCameraPosition = camera._actualPosition.Clone();
	this._lastCameraZoom 	 = camera._actualZoom;
	
}

Stage.prototype.BackBuffer = new BackBuffer(0, 0);

Stage.prototype.Update = function(gameTime)
{
	this.Redraw = true;
};

Stage.prototype.Draw = function(gameTime, c)
{
	if (!this.Redraw)
	{	
		return false;
	}

	var realmBuffer  = Realm.prototype.BackBuffer,
		camera 		 = this.Camera,
		player 		 = GameController.Player;
	
	/*
	this._lastCameraPosition = camera._actualPosition.Clone();
	this._lastCameraZoom 	 = camera._actualZoom;
	*/
	
	c.save();
		// Apply Camera Transformations
		camera.ApplyMatrix(c);

		// Draw Realm
		realmBuffer.DrawToContext(c, 0, 0);
		
		var p = GameController.Realm.CoordinateToPosition(0,0);
		Realm.prototype.DynamicBackBuffer.DrawToContext(c, p.X, p.Y);

		// Draw pathfinding
		Router.prototype.BackBuffer.DrawToContext(c, 0, 0);

		// Draw Player
		player.Draw(gameTime, c);
	c.restore();
	
	GameController.Darkness.Draw(gameTime, c, player, camera);
	
	return true;
};/*global Mouse GameController Vector2 Player Router Camera GameData Texture CANVAS_H CANVAS_W lol Realm Stage MouseController*/

GameController = (function()
{
	function GC()
	{
		this._forceRealmDraw = false;

		this._initted = false;

		/**
		 * @type Stage
		 */
		this.Stage = undefined;

		/**
		 * @type Camera
		 */
		this.Camera = undefined;

		/**
		 * @type Realm
		 */
		this.Realm = undefined;

		/**
		 * @type Router
		 */
		this.Router = undefined;

		/**
		 * @type Avatar
		 */
		this.Player = undefined;

		this.Mouse = undefined;
		this.MouseController = undefined;

		this._texturesLoadingLast = false;
		this._texturesLoading = false;

		this.footprintsEnabled = false;
		this.footprintTileList = [];
	}

	GC.prototype.Ready = function()
	{
		return this._initted;
	};

	GC.prototype.InitGame = function(gameTime){
		var self = this;

		this.Camera = new Camera(CANVAS_W, CANVAS_H);

		this.Player = new Player();

		this.Router = new Router();

		this.Mouse  = new Mouse();
		this.MouseController = new MouseController(this.Mouse, this.Router);

		this.Darkness = new Darkness();

		this.Stage  = new Stage(CANVAS_W, CANVAS_H, this.Camera);

		$.publish('setupMouse');

		$.subscribe(DATA_EVENTS.REALM.FIXED, function(e, data){
			var realm = (self.Realm = new Realm(data.b));

			self.MouseController.SetRealm(realm);
			self.Router.Init(realm);

			var p = GameData.player().location,
				x = p.x,
				y = p.y;

			self.Player.SetPosition(x, y, true);

			self._initted = true;

			realm.Tileset._texture.OnReady(function(){
				self._forceRealmDraw = true;
			});

			self.Realm.Locations.Dynamic = self.Realm._buildDynamicLocations(GameData.realm().dynamic);

			// load footprint texture
			realm.footprintTexture = new Texture('http://cdn.fallensword.com/footprints/footprint.png');
		});

		$.subscribe(DATA_EVENTS.REALM.DYNAMIC, function(e, data){

			if(GameData.player().masterRealm > 0)
				return;

			self.Realm.Locations.Dynamic = self.Realm._buildDynamicLocations(data.b);
		});

		// Update the darkness levels
		$.subscribe(DATA_EVENTS.REALM.DARK+' '+DATA_EVENTS.PLAYER_STATS.VISION+' '+DATA_EVENTS.FIXED, function(e, data){
			self.UpdateDarkness();
		});
	};

	GC.prototype.Update = function(gameTime, mouse)
	{
		if (!this.Ready())
		{
			return;
		}

		GameController.Stage.Redraw = false;

		this.Realm.Update(gameTime);
		this.Player.Update(gameTime);
		this.Router.Update(gameTime);
		this.Camera.Update(gameTime);
		this.Mouse.Update();

		this.Stage.Update(gameTime);
	};

	GC.prototype.Draw = function(gameTime, c){
		if (!this.Ready())
		{
			return;
		}

		// Store
		var last = (this._texturesLoadingLast = this._texturesLoading);
		var now  = (this._texturesLoading = Texture.prototype.IsLoading());
		var force = (last && !now) || this._forceRealmDraw;

		var realmDrawn = this.Realm.Draw(gameTime, c, force);

		// TODO: optimize stage
		if (realmDrawn || GameController.Stage.Redraw)
		{
			this._forceRealmDraw = false;

			GameController.Stage.Redraw = true;

			this.Stage.Draw(gameTime, c);
		}
	};

	GC.prototype.UpdateMouse = function(stageX, stageY){
		this.Mouse.Update(stageX, stageY);
	};

	GC.prototype.UpdateDarkness = function(){
		var darkness = this.Darkness,
			mouseController = this.MouseController,
			isDark = GameData.realm().dark,
			playerVision = GameData.player().visionRadius;

		// Not Dark
		if (!isDark) {

			darkness.SetVisionRadius(false);
			mouseController.SetMaxDistance(false);

			return;
		}
		else
		{
			var visionRadius = GlobalState.TileWHalf + (GlobalState.TileW * playerVision);

			darkness.SetVisionRadius(1000);
			//mouseController.SetMaxDistance(visionRadius);
			mouseController.SetMaxDistance(false);
		}
	};

	GC.prototype.ToggleFootprints = function(){
		this.Realm.footprintTileList = [];
		this.footprintsEnabled = !this.footprintsEnabled;
		var $button = $('#toggle-footprints-button');
		if(!this.footprintsEnabled)
		{
			$button.removeClass('green');
			$button.addClass('yellow');
		}
		else
		{
			$button.addClass('green');
			$button.removeClass('yellow');
		}

		this.Realm.footprintsUpdated = true;
	};

	return new GC();
})();var CANVAS_ISFLASH = false,
	CANVAS_W,
	CANVAS_H,
	CANVAS_W_HALF,
	CANVAS_H_HALF,
	REALM_PADDING_X,
	REALM_PADDING_Y,
	BORDER_SIZE = 30,
	FPS = GlobalState.FPS;

var BORDER;

var DEBUGGING = false;

(function($) {
	$.widget('hcs.derp', {
		_create: function() {
			var parent = (this.parent = this.element.parent());

			this.element.attr({width: parent.width(), height: parent.height()});

			// Mouse State
			this.ListeningToMouse = false;

			// Constants
			this._initConstants();

			// Setup Canvas
			var context;
			this._initCanvas(context);

			// Debug
			this._initDebug();

			// Initialize game
			GameController.InitGame();
			this._postGameInit();

			// Run Game
			this._run();
		},

		_initConstants: function()
		{
			var parent = this.element.parent();
			CANVAS_W = parent.width();
			CANVAS_H = parent.height();

			CANVAS_W_HALF = CANVAS_W / 2;
			CANVAS_H_HALF = CANVAS_H / 2;

			REALM_PADDING_X = Math.ceil(CANVAS_W_HALF / GlobalState.TileW);
			REALM_PADDING_Y = Math.ceil(CANVAS_H_HALF / GlobalState.TileW);
		},

		_initCanvas: function(context){
			this._initNativeCanvas(context);
		},

		_initNativeCanvas: function(context){
			var self = this;

			context = self.element[0].getContext('2d');

			self.context = context;
			/*
			// Setup Mouse
			var parent = self.element.parent();

			parent.bind({
				'mouseenter': function(e, data){
					parent.bind('mousemove', function(e2){
						self._updateMouse(e2, self);
					});
				},

				'mouseleave': function(e, data){
					parent.unbind('mousemove');

					self._mouseX = undefined;
					self._mouseY = undefined;
				},

				'click': function(e, data){
					$.publish('mapClick');
				}
			});

			self.element.bind('touchstart', function(e, data){
				var p = GameData.player().location;
				$.publish('move-attempt.player', {x: p.x + 1, y: p.y + 1});
			});
			*/

			// Tooltips
			self.options.tooltips.mapTooltip('setBaseOffset', {x: GlobalState.TileWHalf, y: GlobalState.TileHHalf + 10});
		},

		// Mouse Handling
		_updateMouse: function(e, element) {
			var o = element.offset();

			GameController.UpdateMouse(e.pageX - o.left, e.pageY - o.top);
		},

		_postGameInit: function()
		{
			var self = this,
				$window = $(document),
				camera = GameController.Camera;

			this.startMousePos = new Vector2(-1, -1);
			this.lastMousePos  = new Vector2(-1, -1);
			this.mouseMovedDistance = 0;

			var slider = $('<div id="map-zoom"></div>')
				.appendTo(this.element.parent())
				.css(
				{
					position: 'absolute',
					top: '25px',
					left: '25px'
				})
				.slider(
				{
					min: 500,
					max: 2000,
					value: 1000,
					orientation: 'vertical',
					slide: function (e, ui){
						camera.Zoom = ui.value / 1000;

						if (camera.Zoom > 0.85 && camera.Zoom < 1.1)
						{
							camera.Zoom = 1;

							slider.slider('value', 1000);

							return false;
						}

						return true;
					}
				});


			$.subscribe('setZoomLevels', function(e, data)
			{
				var min = data.min,
					max = data.max;

				camera.ZoomMin = data.min;
				camera.ZoomMax = data.max;

				camera.Zoom = camera.Zoom;
				camera._actualZoom = camera.Zoom;

				slider.slider('option',
				{
					min: min * 1000,
					max: max * 1000,
					value: camera.Zoom * 1000
				});
			});

			var $overlay = $('#mapCanvasOverlay');

			$overlay.bind(
			{
				'mouseenter.derp': function(e)
				{
					$overlay.bind('mousemove.derp', function(e2){
						self._updateMouse(e2, $overlay);
					});

					return true;
				},
				'mouseleave.derp': function(e)
				{
					$overlay.unbind('mousemove.derp');

					GameController.UpdateMouse(-1, -1);

					return true;
				},
				'mousedown.derp': function(e)
				{
					$('#guild-chat-input-msg').blur();
					$('#chat-input-msg').blur();

					var last = self.lastMousePos;

					// Reset Moved Distance
					self.mouseMovedDistance = 0;

					// Set Start
					self.startMousePos	.Set(e.screenX, e.screenY);

					// Set Last
					self.lastMousePos	.Set(e.screenX, e.screenY);

					switch(e.button)
					{
						case 0: // Left Button
							e.preventDefault();

							var onMove = function(e)
							{
								e.preventDefault();

								var last = self.lastMousePos,
									x = e.screenX,
									y = e.screenY,
									z = camera.Zoom,
									diffX = (last.X === -1) ? 0 : (last.X - x) / z,
									diffY = (last.Y === -1) ? 0 : (last.Y - y) / z;

								self.mouseMovedDistance += (diffX * diffX) + (diffY * diffY);

								camera.Position.Add(diffX, diffY);

								self.lastMousePos.Set(x, y);

								return false;
							};

							$.publish('dragstart.mapCanvas');

							$window.bind({
								'mousemove.derp': onMove,
								'mouseup.derp': function()
								{
									e.preventDefault();

									// Reset dragging
									self.dragging = false;

									// Reset Last Position
									self.lastMousePos = new Vector2(-1, -1);

									// Unbind (for performance)
									$(this).unbind('mousemove.derp mouseup.derp');

									// If mouse hasn't moved far, click
									if (self.mouseMovedDistance <= 25)
									{
										$.publish('click.mapCanvas');
									}

									$.publish('dragend.mapCanvas');

									return false;
								}
							});

							return false;
						break;
					}
				},
				'mousewheel.derp': function(e, delta)
				{
					// Stop the document jumping around like an idiot
					e.preventDefault();

					var mouseX = e.offsetX,
						mouseY = e.offsetY,
						camera = GameController.Camera,
						min	= camera.ZoomMin,
						max = camera.ZoomMax,
						z = camera.Zoom,
						oldMousePos = camera.GetWorldPosition(new Vector2(mouseX, mouseY));

					if((delta > 0 && z === max) || (delta < 0 && z === min))
						return;

					camera.Zoom += (delta * ((max - min) / 100)) * 10;

					slider.slider('option', 'value', camera.Zoom * 1000);

					var newZ = camera.Zoom,
						deltaPos = oldMousePos.Subtract(camera.GetWorldPositionAtZoom(new Vector2(mouseX, mouseY), newZ));

					camera.Position.Add(deltaPos);
				},
				'contextmenu.derp': function(e)
				{
					// TODO: Right Click Menu

					return false;
				},
				'click.derp': function(e)
				{
					return false;
				}
			});
		},

		// Run
		_run: function()
		{
			var self = this,
				gameTime = (this.gameTime = new GameTime());

			(function update(time){

				// Update Clock
				gameTime.Update(time);

				// Update
				GameController.Update(gameTime, 0);

				if (gameTime.Total < FPS)
				{
					setTimeout( update, FPS - gameTime.Total );
					return;
				}
				else
				{
					gameTime.Total = 0;
				}

				// Draw
				self._draw(gameTime);

				// LOOP!
				requestAnimFrame( update );
			})();
		},

		// Drawing
		_draw: function(gameTime) {
			var self 	= this,
				canvas 	= self.element,
				context = self.context;

			if(canvas === undefined || context === undefined)
				return;

			if(DEBUGGING)
				if(this.stats)
					this.stats.update();

			GameController.Draw(gameTime, context);
		},

		// DEBUGGING CODE
		_initDebug: function()
		{
			this._initStats();
		},

		_initStats: function(){
			if(!DEBUGGING)
				return;

			var self = this;

			function position(el)
			{
				$(stats.domElement).css({'position': 'fixed', 'display': 'block !important'})
				.position({
					my: 'center top',
					at: 'center top',
					of: $('body'),
					offset: '0 20'
				});

				//$(stats.domElement).find('*').css({'display': 'block !important'})
			}

			// Done inside a try/catch because IE is lame
			try{
				var stats = new Stats();

				self.stats = stats;

				var jEl = $(stats.domElement);

				jEl.appendTo($('body'))
					.css({'text-shadow':'none'})
					.children(':eq(0)')
						.css('background','rgb(48,48,144)')
					.end()
					.children(':eq(1)')
						.css('background','rgb(48,144,48)');

				setTimeout(function(){
					position(jEl);
				}, 1000);

				$(window).resize(function(){
					position(jEl);
				});
			}
			catch(e)
			{
				// Do Nothing
			}
		}
	});
})(jQuery);(function($) 
{
	$.widget('hcs.mapTooltip', {
		_create: function(){
			var self = this;
			var tooltip = $('<div id="mapTooltip" title="Default"></div>')
							.appendTo(this.element.parent());
			
			this.tooltip = tooltip;

			var col = this.tooltip.qtip({
				overwrite: true,

				style: {
					classes: 'qtip-tipsy qtip-custom'
				},

				position: {
					my: 'bottom center',
					at: 'top center',
					effect: false,
					viewport: $(window)
				},

				show: {
					ready: true
				},

				hide: {
					leave: false,
					effect: false
				}
			});

			this.mouseX = 0;
			this.mouseY = 0;

			$(document).mousemove(function(e)
			{
				self.mouseX = e.pageX;
				self.mouseY = e.pageY;

				if(self.visible)
				{
					self.api.set('position.target', [self.mouseX, self.mouseY-30]);
				}
			});

			this._subscribe();
			this.visible = false;
			this.api = col.qtip('api');
		},
		
		_subscribe: function(){
			var self = this;
			
			// Show
			$.subscribe('show.mapTooltip', function(e, data){
				if (!data.html)
				{
					return;
				}

				self.visible = true;
				self.api.set('content.text', data.html);
				self.api.set('position.target', [self.mouseX, self.mouseY-30]);
				self.api.show();
			});
			
			// Hide
			$.subscribe('hide.mapTooltip', function(e, data){
				self.api.hide();
				self.visible = false;
			});
			
			// Refresh
			$.subscribe('refresh.mapTooltip', function(e, data)
			{
			});
		},

		hide: function(){
		}
	});
})(jQuery);$(function(){
	var tooltips = $('#mapCanvasOverlay').mapTooltip();

	$('#mapCanvas').derp({'tooltips': tooltips});
});HCS.utils.namespace(HCS.namespace+'.world.defines').fetchFlags = {
	playerStats			: 1,
	playerBackpackCount	: 2,
	playerBackpackItems	: 4,
	playerPrefs			: 8,
	playerBuffs			: 16,
	
	worldDefines		: 32,
	worldRealmStatic	: 64,
	worldRealmDynamic	: 128,
	worldRealmActions	: 256,
	
	PLAYER_EQUIPMENT		: 512,
	PLAYER_NOTIFICATIONS	: 1024,
	
	all	: 2047
};

var world_settings = {};GameData = function($)
{
	var fetchFlags = HCS.world.defines.fetchFlags;
	var _time = 0, _defines = {}, _player = {}, _realm = {}, _masterRealm = {}, _actions = [];
	var self = this;
	
	$.subscribe('move-attempt-2.player', function(e, data)
	{
		_player.moving = true;
		GameData.doAction(4, fetchFlags.playerStats + fetchFlags.worldRealmActions + fetchFlags.worldRealmDynamic + FETCH_FLAGS.PLAYER_NOTIFICATIONS, data, 0);
	});
	
	$.subscribe('move-stop.player', function(e, data)
	{
		_player.moving = false;
	});
	
	function time(d) 
	{ 
		if(d === undefined)
			return _time;
		
		return $.extend(_time, d);
	}
	
	function defines(d) 
	{ 
		if(d === undefined)
			return _defines;
		
		return $.extend(_defines, d);
	}
	
	function player(d) 
	{ 
		if(d === undefined)
			return _player;
		
		return $.extend(_player, d);
	}
	
	function realm(d) 
	{
		if(d === undefined)
			return _realm;
		
		return $.extend(_realm, d);
	}
	
	function masterRealm(d)
	{
		if(d === undefined)
			return _masterRealm;
		
		return $.extend(_masterRealm, d);
	}
	
	function actions(d)
	{ 
		if(d === undefined)
			return _actions;
		
		return $.extend(_actions, d);
	}
	
	function fetch(flag)
	{
		this.doAction(-1, flag, 0, 0);
	}
	
	function _processResponse(z)
	{
		// store old value
		var d = _defines;
		var p = _player;
		var r = _realm;
		var m = _masterRealm;
		var a = _actions;
		var t = _time;
		
		/*
		z.time 			= (z.time !== undefined) ? z.time : t;
		z.defines 		= (z.defines !== undefined) ? z.defines : d;
		z.player 		= (z.player !== undefined) ? z.player : p;
		z.actions 		= (z.actions !== undefined) ? z.actions : a;
		z.realm 		= (z.realm !== undefined) ? z.realm : r;
		z.masterrealm 	= (z.masterrealm !== undefined) ? z.masterrealm : m;
		*/
		
		// update
		_time		= z.time;
		
		_defines 	= $.extend(true, {}, _defines, z.defines, {actionTypes: ['Stairway', 'Shop', 'Portal', 'Relic', 'Crate', 'Quest', 'Creature', 'Player']});
		
		_player 	= $.extend(true, {}, _player, z.player);
		
		_realm 		= $.extend(true, {}, _realm, z.realm);

		_masterRealm= $.extend(true, {}, _masterRealm, z.masterRealm);
		
		if (z.time !== undefined) {
			$.publish(DATA_EVENTS.TIME, {a: t, b: _time});
		}
		
		if(z.actions !== undefined)
			_actions = z.actions;
		
		// DEFINES
		if(z.defines !== undefined)
		{
			if(d !== z.defines)
				$.publish(DATA_EVENTS.DEFINES.ANY, {a: d, b: _defines});
		}
		
		// PLAYER
		if(z.player !== undefined)
		{			
			// STATS
			
			if(z.player.fsp === undefined || z.player.gold === undefined || z.player.stamina === undefined || z.player.xp === undefined || z.player.hasGroup === undefined || z.player.location === undefined || z.player.masterRealm === undefined || z.player.bank === undefined)
			{
				// do nothing
			}
			else
			{
				var statChanges = 
				{
					fsp		: (p.fsp 	  !== _player.fsp),
					gold	: (p.gold 	  !== _player.gold),
					stamina	: (p.stamina  !== _player.stamina),
					level	: (p.level	  !== _player.level),
					xp		: ((p.xp === undefined && _player.xp !== undefined) || (p.xp.base  !== _player.xp.base || p.xp.current  !== _player.xp.current || p.xp.next !== _player.xp.next)),
					hasGroup: (p.hasGroup !== _player.hasGroup),
					location: (p.location !== _player.location),
					masterRealm: (p.masterRealm !== _player.masterRealm),
					lastTimeCheck: (p.lastTimeCheck !== _player.lastTimeCheck),
					bank: (p.bank !== _player.bank),
					vision: (p.visionRadius !== _player.visionRadius),
					xpGain: (p.xpGain !== _player.xpGain),
					staminaGain: (p.staminaGain !== _player.staminaGain),
					goldGain: (p.goldGain !== _player.goldGain),
					guildId: (p.guildId !== _player.guildId),
					teleportCooldown: (p.teleportCooldown !== _player.teleportCooldown)
				};

				var statsChanged = false;
				
				$.each(statChanges, function(i, v)
				{
					if(!v)
						return true;
						
					statsChanged = true;
					return false;
				});
				
				if(statsChanged)
				{
					if(statChanges.masterRealm)
						$.publish(DATA_EVENTS.PLAYER_STATS.MASTER_REALM, {a: p.masterRealm, b: _player.masterRealm});
					
					if(statChanges.fsp)
						$.publish(DATA_EVENTS.PLAYER_STATS.FSP, 		{a: p.fsp, 		b: _player.fsp});
					
					if(statChanges.gold)
						$.publish(DATA_EVENTS.PLAYER_STATS.GOLD, 		{a: p.gold, 	b: _player.gold});
					
					if(statChanges.bank)
						$.publish(DATA_EVENTS.PLAYER_STATS.BANK, 		{a: p.gold, 	b: _player.gold});
						
					if(statChanges.stamina)
						$.publish(DATA_EVENTS.PLAYER_STATS.STAMINA, 	{a: p.stamina, 	b: _player.stamina});
						
					if(statChanges.level)
						$.publish(DATA_EVENTS.PLAYER_STATS.LEVEL, 		{a: p.level, 	b: _player.level});
					
					if(statChanges.xp)
						$.publish(DATA_EVENTS.PLAYER_STATS.XP, 			{a: p.xp, 		b: _player.xp});
					
					if(statChanges.hasGroup)
						$.publish(DATA_EVENTS.PLAYER_STATS.GROUP,		{a: p.hasGroup, b: _player.hasGroup});
					
					if(statChanges.location)	
						$.publish(DATA_EVENTS.PLAYER_STATS.LOCATION,	{a: p.location, b: _player.location});
				
					if(statChanges.lastTimeCheck)	
						$.publish(DATA_EVENTS.PLAYER_STATS.LASTTIMECHECK,	{a: p.lastTimeCheck, b: _player.lastTimeCheck});
					
					if(statChanges.vision)	
						$.publish(DATA_EVENTS.PLAYER_STATS.VISION,	{a: p.visionRadius, b: _player.visionRadius});
					
					if(statChanges.xpGain)	
						$.publish(DATA_EVENTS.PLAYER_STATS.XP_GAINPER,	{a: p.xpGain, b: _player.xpGain});
						
					if(statChanges.goldGain)	
						$.publish(DATA_EVENTS.PLAYER_STATS.GOLD_GAINPER,	{a: p.goldGain, b: _player.goldGain});
						
					if(statChanges.staminaGain)	
						$.publish(DATA_EVENTS.PLAYER_STATS.STAMINA_GAINPER,	{a: p.staminaGain, b: _player.staminaGain});
					
					$.publish(DATA_EVENTS.PLAYER_STATS.ANY,
						{
							a: 
							{
								fsp		 : p.fsp,
								gold	 : p.gold,
								bank	 : p.bank,
								stamina  : p.stamina,
								level	 : p.level,
								xp		 : p.xp,
								hasGroup : p.hasGroup,
								location : p.location,
								masterRealm : p.masterRealm,
								lastTimeCheck : p.lastTimeCheck,
								xpGain: p.xpGain,
								staminaGain: p.staminaGain,
								goldGain: p.goldGain,
								guildId: p.guildId,
								teleportCooldown: p.teleportCooldown
							}, 
							b: 
							{
								fsp		 : _player.fsp,
								gold	 : _player.gold,
								bank	 : _player.bank,
								stamina  : _player.stamina,
								level	 : _player.level,
								xp		 : _player.xp,
								hasGroup : _player.hasGroup,
								location : _player.location,
								masterRealm : _player.masterRealm,
								lastTimeCheck : _player.lastTimeCheck,
								xpGain: _player.xpGain,
								staminaGain: _player.staminaGain,
								goldGain: _player.goldGain,
								guildId: _player.guildId,
								teleportCooldown: _player.teleportCooldown
							}
						}
					);
				}

				if (z.player.teleportCooldown == -1)
				{
					$('.teleport').addClass('disabled');
				}
				else
				{
					$('.teleport').removeClass('disabled');
				}
			}
			
			if (z.player.equipment !== undefined)
			{
				var equipmentChanged = false,
					durabilityChanged = false,
					a = p.equipment || [],
					b = z.player.equipment || [],
					len = b.length;
				
				var changed = [],
					durability = [];
				
				for (var i = len; i--;)
				{
					var aE = a[i] || {type:-1,itemId:-1,name:-1,rarity:-1,current:-1,max:-1},
						bE = b[i] || {type:-1,itemId:-1,name:-1,rarity:-1,current:-1,max:-1};
					
					if (aE !== bE) 
					{
						changed[i] = equipmentChanged = true;
						
						if (aE.current !== bE.current || aE.max !== bE.max)
						{
							durability[i] = durabilityChanged = true;
						}
					}
				}
				
				var equipSlotLookup = HCS.DEFINES.ITEM_TYPE_REVERSE;
				
				var tempA = [],
					tempB = [];
					
				// Loop Durabilities
				if (durabilityChanged)
				{
					for (var i = len; i--;)
					{
						var data = {};
						
						tempA[i] = (data.a = (a[i] === undefined) ? { current: -1, max: -1 } : { current: a[i].current, max: a[i].max });
						tempB[i] = (data.b = (b[i] === undefined) ? { current: -1, max: -1 } : { current: b[i].current, max: b[i].max });
						
						if (!durability[i]) {
							continue;
						}
						
						$.publish(DATA_EVENTS.PLAYER_DURABILITY[equipSlotLookup[b[i].type]], data);
					}
					
					$.publish(DATA_EVENTS.PLAYER_DURABILITY.ANY, {
						a: {
							helmet: {current: tempA[0].current, max: tempA[0].max},
							gloves: {current: tempA[2].current, max: tempA[2].max},
							amulet: {current: tempA[7].current, max: tempA[7].max},
							weapon: {current: tempA[4].current, max: tempA[4].max},
							armor:  {current: tempA[1].current, max: tempA[1].max},
							shield: {current: tempA[5].current, max: tempA[5].max},
							ring:  	{current: tempA[6].current, max: tempA[6].max},
							boots:  {current: tempA[3].current, max: tempA[3].max},
							rune: 	{current: tempA[8].current, max: tempA[8].max}
						},
						b: {
							helmet: {current: tempB[0].current, max: tempB[0].max},
							gloves: {current: tempB[2].current, max: tempB[2].max},
							amulet: {current: tempB[7].current, max: tempB[7].max},
							weapon: {current: tempB[4].current, max: tempB[4].max},
							armor:  {current: tempB[1].current, max: tempB[1].max},
							shield: {current: tempB[5].current, max: tempB[5].max},
							ring:  	{current: tempB[6].current, max: tempB[6].max},
							boots:  {current: tempB[3].current, max: tempB[3].max},
							rune: 	{current: tempB[8].current, max: tempB[8].max}
						}	
					});
				}
				
				// Loop Durabilities
				if (equipmentChanged)
				{
					var dataA = [],
						dataB = [];
					
					for (var i = len; i--;)
					{
						dataA[b[i].type] = a[i];
						dataB[b[i].type] = b[i];
						
						if (!changed[i]) {
							continue;
						}
						
						$.publish(DATA_EVENTS.PLAYER_EQUIPMENT[equipSlotLookup[b[i].type]], { a: a[i], b: b[i] });
					}
										
					$.publish(DATA_EVENTS.PLAYER_EQUIPMENT.ANY, {
						a: {
							helmet: dataA[0],
							gloves: dataA[2],
							amulet: dataA[7],
							weapon: dataA[4],
							armor:  dataA[1],
							shield: dataA[5],
							ring:  	dataA[6],
							boots:  dataA[3],
							rune: 	dataA[8]
						},
						b: {
							helmet: dataB[0],
							gloves: dataB[2],
							amulet: dataB[7],
							weapon: dataB[4],
							armor:  dataB[1],
							shield: dataB[5],
							ring:  	dataB[6],
							boots:  dataB[3],
							rune: 	dataB[8]
						}
					});
				}
			}
			
			// EVENT
			if (z.player.event !== undefined)
			{
				$('#world-event-progress').css('width', z.player.event.width + 'px');
				$('#event-line').html(z.player.event.line);
				$('#event-name').html(z.player.event.name);
				$('#event-qualify').html(z.player.event.qualify);
				$('#event-progress').html(z.player.event.progress);
				$('#event-total').html(z.player.event.total);
				$('#event-time').html(z.player.event.time);
			}
			
			// BACKPACK
			if(z.player.backpack !== undefined)
			{
				var backpackChanged = false;
				
				// COUNT
				var bpCountMaxChanged	  = p.backpack === undefined || p.backpack.max !== z.player.backpack.max;
				var bpCountCurrentChanged = p.backpack === undefined || p.backpack.current !== z.player.backpack.current;
				
				if(bpCountMaxChanged || bpCountCurrentChanged)
				{
					backpackChanged = true;
					
					if(bpCountMaxChanged)
						$.publish(DATA_EVENTS.PLAYER_BACKPACK.MAX,	{a: (p.backpack === undefined) ? 0 : p.backpack.max, b: z.player.backpack.max});
						
					if(bpCountCurrentChanged)
						$.publish(DATA_EVENTS.PLAYER_BACKPACK.CURRENT,{a: (p.backpack === undefined) ? 0 : p.backpack.current, b: z.player.backpack.current});
				}
				
				// ITEMS
				var backpackItemChanged = p.backpack === undefined || p.backpack.items !== z.player.backpack.items;
								
				if(backpackItemChanged)
				{
					backpackChanged = true;
										
					$.publish(DATA_EVENTS.PLAYER_BACKPACK.ITEMS, {a: (p.backpack === undefined) ? [] : p.backpack.items, b: z.player.backpack.items});
				}
				
				if(backpackChanged)
					$.publish(DATA_EVENTS.PLAYER_BACKPACK.ANY, {a: p.backpack, b: z.player.backpack});
			}
			
			// PREFS
			if(z.player.prefs !== undefined)
			{
				if(p.prefs !== z.player.prefs)
					$.publish(DATA_EVENTS.PLAYER_PREFS.ANY, {a: p.prefs, b: z.player.prefs});
			}
			
			// BUFFS
			if(z.player.buffs !== undefined)
			{
				if(p.buffs !== z.player.buffs)
					$.publish(DATA_EVENTS.PLAYER_BUFFS.ANY, {a: p.buffs, b: z.player.buffs});
			}
			
			// NOTIFICATIONS
			if (z.player.notifications !== undefined)
			{
				if(p.notifications !== z.player.notifications)
					$.publish(DATA_EVENTS.PLAYER_NOTIFICATIONS.ANY, {a: p.notifications, b: z.player.notifications});
			}
			
			if(p !== z.player)
				$.publish(DATA_EVENTS.PLAYER.ANY, {a: p, b: z.player});
		}
		
		// MASTER REALM
		if(z.masterRealm !== undefined && z.masterRealm !== "")
		{
			if(z.masterRealm.id === undefined || z.masterRealm.minlevel === undefined || z.masterRealm.name === undefined || z.masterRealm.stairways === undefined)
			{
				// do nothing
			}
			else
			{				
				$.publish(DATA_EVENTS.MASTER_REALM.ANY, {a: m, b: z.masterRealm});
			}
		}

		// REALM
		if(z.realm !== undefined)
		{
			// FIXED
			if(z.realm.id === undefined || z.realm.w === undefined || z.realm.h === undefined || z.realm.dark === undefined || z.realm.name === undefined || z.realm.set === undefined || z.realm.fixed === undefined || z.realm.block === undefined || z.realm.tiles === undefined)
			{
				// do nothing
			}
			else
			{
				var fixedChanges = 
				{
					id		: (r.id		  	!== z.realm.id),
					w		: (r.w		  	!== z.realm.w),
					h		: (r.h  		!== z.realm.h),
					dark	: (r.dark		!== z.realm.dark),
					name	: (r.name	 	!== z.realm.name),
					set		: (r.set	 	!== z.realm.set),
					fixed	: (r.fixed	 	!== z.realm.fixed),
					block	: (r.block 	  	!== z.realm.block),
					tiles		: (r.tiles		 !== z.realm.tiles),
					tile_lookup	: (r.tile_lookup !== z.realm.tile_lookup)
				};
				
				var fixedChanged = false;
				
				$.each(fixedChanges, function(i, v)
				{
					if(!v)
						return true;
						
					fixedChanged = true;
					return false;
				});
				
				// TODO: sort this.
				var tempDynamic = $.extend({}, _realm.dynamic); 
				if(z.realm.dynamic !== undefined)
				{
					_realm.dynamic = z.realm.dynamic;
				}


				if(fixedChanged)
				{
					if(fixedChanges.id)	
						$.publish(DATA_EVENTS.REALM.ID,			{a: r.id, 		b: z.realm.id});
					
					if(fixedChanges.w)	
						$.publish(DATA_EVENTS.REALM.WIDTH,		{a: r.w, 		b: z.realm.w});
					
					if(fixedChanges.h)	
						$.publish(DATA_EVENTS.REALM.HEIGHT,		{a: r.h, 		b: z.realm.h});
					
					if(fixedChanges.dark)	
						$.publish(DATA_EVENTS.REALM.DARK,		{a: r.dark, 	b: z.realm.dark});
						
					if(fixedChanges.name)	
						$.publish(DATA_EVENTS.REALM.NAME,		{a: r.name, 	b: z.realm.name});
						
					if(fixedChanges.set)	
						$.publish(DATA_EVENTS.REALM.TILESET,	{a: r.set, 		b: z.realm.set});
						
					if(fixedChanges.fixed)
						$.publish(DATA_EVENTS.REALM.LOCATIONS_FIXED,	{a: r.fixed, 	b: z.realm.fixed});
						
					if(fixedChanges.block)
						$.publish(DATA_EVENTS.REALM.BLOCK,	{a: r.block, 	b: z.realm.block});
						
					if(fixedChanges.tiles)	
						$.publish(DATA_EVENTS.REALM.TILES,	{a: r.tiles, 	b: z.realm.tiles});
					
					if(fixedChanges.tile_lookup)	
						$.publish(DATA_EVENTS.REALM.TILE_LOOKUP,	{a: r.tile_lookup, 	b: z.realm.tile_lookup});
						
					$.publish(DATA_EVENTS.REALM.FIXED, 
					{
						a: 
						{
							id: 		 r.id,
							w: 			 r.w,
							h: 			 r.h,
							dark: 		 r.dark,
							name: 		 r.name,
							set: 		 r.set,
							fixed:  	 r.fixed,
							block: 		 r.block,
							tiles: 		 r.tiles,
							tile_lookup: r.tile_lookup
						},
						b: 
						{
							id: 			z.realm.id,
							w: 				z.realm.w,
							h: 				z.realm.h,
							dark: 			z.realm.dark,
							name: 			z.realm.name,
							set: 			z.realm.set,
							fixed: 		 	z.realm.fixed,
							block: 			z.realm.block,
							tiles: 			z.realm.tiles,
							tile_lookup: 	z.realm.tile_lookup
						}
					});
				}
				
				if(z.realm.dynamic !== undefined)
				{
					_realm.dynamic = tempDynamic;
				}
			}
			
			if(z.realm.dynamic !== undefined)
			{
				var dynamicChanged = ((r.dynamic === undefined && z.realm.dynamic !== undefined) || (r.dynamic.length !== z.realm.dynamic.length));
				
				if(!dynamicChanged)
				{
					for (var i = r.dynamic.length; i--;) {
						var a  = r.dynamic[i],
							b  = z.realm.dynamic[i];
						
						if (a.id !== b.id || a.x !== b.x || a.y !== b.y) {
							dynamicChanged = true;
						}
					}
				}

				if (dynamicChanged) {
					$.publish(DATA_EVENTS.REALM.LOCATIONS_DYNAMIC, {
						a: r.dynamic,
						b: z.realm.dynamic
					});
					
					$.publish(DATA_EVENTS.REALM.DYNAMIC, {
						a: r.dynamic,
						b: z.realm.dynamic
					});
				}
				_realm.dynamic = z.realm.dynamic;
			}
			
			if(r !== z.realm)
				$.publish(DATA_EVENTS.REALM.ANY,	{a: r, b: z.realm});
		}
		
		// ACTION LIST
		// HOOF REMOVED
		/*if(z.actions !== undefined)
		{
			if(a !== z.actions)
				$.publish(DATA_EVENTS.ACTIONS.ANY,	{a: a, b: z.actions});
		}*/
	}
	
	/**
	 * Performs an action and processes the response
	 * @param {Integer} action Action ID
	 * @param {Integer} fetch Fetch Flags
	 * @param {Object} data JSON data to be sent
	 * @param {Integer} attempts Number of attempts
	 */
	function doAction(action, fetch, data, attempts)
	{
		var d = $.extend({a: action, d: fetch}, data);

		$.ajax({
			url: 'fetchdata.php',
			cache: false,
			dataType: 'json',
			data: d,
			success: function(response, textStatus, XMLHttpRequest)
			{
				if (attempts < 10 && response && response.response && (response.response.response == 5 || response.response.response == 7))
					GameData.doAction(action, fetch, data, attempts + 1);
				else
				{
					response = $.extend(true, response, {defines: {actionTypes: ['Stairway', 'Shop', 'Portal', 'Relic', 'Crate', 'Quest', 'Creature', 'Player']}});
					_processResponse(response);
					$.publish(action + '-success.action-response', response);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				if (attempts < 10)
					GameData.doAction(action, fetch, data, attempts + 1);
				else
					$.publish(action + '-error.action-response', errorThrown);
			}
		});
	}
	
	return {
		time : time,
		defines : defines,
		player  : player,
		realm   : realm,
		actions : actions,
		fetch	: fetch,
		process : _processResponse,
		masterRealm: masterRealm,
		doAction: doAction
	};
}(jQuery);(function($) {
	var states = HCS.defines.ui.states;

	$.widget('hcs.widget', {
		_delegate: function(element, selector, handler, merge)
		{
			merge = (merge===undefined) ? true : merge;

			handler = handler || {};

			if(merge)
			{
				handler = $.extend(
				{
					hover		: this._onHover,
					mouseleave	: this._onMouseLeave,
					mousedown	: this._onMouseDown,
					mouseup		: this._onMouseUp,
					focus		: this._onFocus,
					blur		: this._onBlur
				}, handler);
			}

			element.delegate(selector, handler);
		},

		_onHover: function(e)
		{
			if($(this).hasClass(states.disabled))
				return false;

			$(this).toggleClass(states.hover);
		},

		_onMouseLeave: function(e)
		{
			$(this).removeClass(states.active);
		},

		_onMouseDown: function(e)
		{
			if($(this).hasClass(states.disabled))
				return false;

			$(this).addClass(states.active);
		},

		_onMouseUp: function(e)
		{
			if($(this).hasClass(states.disabled))
				return false;

			$(this).removeClass(states.active);
		},

		_onFocus: function(e)
		{
			$(this).addClass(states.focus);
		},

		_onBlur: function(e)
		{
			$(this).removeClass(states.focus);
		}
	});
})(jQuery);(function($){

/* Stats
 * Character: 	Name, Level, Rank, Attack, Defense, HP, Armor, Damage
 * Stamina:		Stamina, Gain/Hr, Next Gain
 * Equipment:	Gloves, Helmet, Amulet, Weapon, Armor, Shield, Ring, Boots, Rune
 * Backpack:	
 * Gold: 		Gold, Bank, Gain/Hr, Next Gain
 * XP Bar:		Level, Progress, Current XP, Next XP, Remaining, Gain Per Hour, Next Gain
 */

var formatNumber = HCS.utils.formatNumber,
	secondsToString = HCS.utils.secondsToString,
	XP_PROGRESS_TIME_PER_PERCENT = 50;

$.widget('hcs.topBar', {

	_create: function(){
		var self = this;
		
		// Cache inital variables
		this._timestamp = this.options.initialTime;
		this._player 	= $.extend({}, this.options.initialPlayer);
		
		// Cleanup the init stuff
		delete this.options.initialTime;
		delete this.options.initialPlayer;
		
		this._onSecondTickList = [];
		
		this._internalClock = setInterval(function(){
			var timestamp = (self._timestamp += 1);
			
			var list = self._onSecondTickList,
				listLen = list.length;
			
			for (var i = 0; i < listLen; i++) {
				list[i](timestamp);
			}
		}, 1000);
		
		var cache = (this._cache = {});
		
		this._setupPlayerStats(cache);
	},
	
	_onSecondTick: function(fn){
		this._onSecondTickList.push(fn);
	},
	
	_setupPlayerStats: function(cache){
		cache = {
			character: {},
			stamina: {},
			equipment: {},
			backpack: {},
			fsp: {},
			gold: {},
			xp: {}
		};
		
		cache.character = this._setupPlayerStatsCharacter();
		cache.stamina 	= this._setupPlayerStatsStamina();
		cache.equipment = this._setupPlayerStatsEquipment();
		cache.backpack 	= this._setupPlayerStatsBackpack();
		cache.fsp		= this._setupPlayerFSP();
		cache.gold		= this._setupPlayerStatsGold();
		cache.xp		= this._setupPlayerXPBar();
		
		this._lastTimeCheck = GameData.player().lastTimeCheck;
		
		var self = this;
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.LASTTIMECHECK, function(e, data){
			self._lastTimeCheck = data.b;
		});
		
		$.subscribe(DATA_EVENTS.TIME, function(e, data){
			self._timestamp = data.b;
		});

		this._onSecondTick(function(timestamp){			
			var secondsUntilNextGain = 3600 - (timestamp - self._lastTimeCheck),//secondsUntilNextGain = 3600 - (timestamp - self._lastTimeCheck),
				secondsUntilNextGainString = secondsToString(Math.max(1, secondsUntilNextGain));

			cache.stamina.gainNext.html(secondsUntilNextGainString);
			cache.gold.gainNext.html(secondsUntilNextGainString);
			cache.xp.gainNext.html(secondsUntilNextGainString);
			
			if (secondsUntilNextGain < 0)
			{
				//self._lastTimeCheck += 3600;
				self._lastTimeCheck = timestamp;
				
				GameData.fetch(FETCH_FLAGS.PLAYER_STATS);
			}
		});
	},
	
	_setupPlayerStatsCharacter: function(){
		var $head = $('statbar-character'),
			$tooltip= $('#statbar-character-tooltip'),
			// Sub elements
			$name 	= $('.stat-name', 	$tooltip).next(),
			$level 	= $('.stat-level', 	$tooltip).next(),
			$rank 	= $('.stat-rank', 	$tooltip).next(),
			$attack = $('.stat-attack', $tooltip).next(),
			$defense= $('.stat-hp', 	$tooltip).next(),
			$hp 	= $('.stat-armor', 	$tooltip).next(),
			$armor 	= $('.stat-damage', $tooltip).next();

		$.subscribe(DATA_EVENTS.PLAYER_STATS.LEVEL, function(e, data){
			$level.html(data.b);
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.RANK, function(e, data){
			$rank.html(data.b);
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.ATTACK, function(e, data){
			$attack.html(data.b);
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.DEFENSE, function(e, data){
			$defense.html(data.b);
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.HP, function(e, data){
			$hp.html(data.b);
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.ARMOR, function(e, data){
			$armor.html(data.b);
		});
	
		return {
			head:		$head,
			name: 		$name,
			level: 		$level,
			rank: 		$rank,
			attack: 	$attack,
			defense:	$defense,
			hp:			$hp,
			armor:		$armor
		};
	},
	
	_setupPlayerStatsStamina: function(){
		var $head = $('#statbar-stamina'),
			$tooltip = $('#statbar-stamina-tooltip'),
			$value = $('.stat-name', $tooltip).next(),
			$gain = $('.stat-stamina-gainPerHour', $tooltip).next(),
			$next = $('.stat-stamina-nextGain', $tooltip).next();
				
		$.subscribe(DATA_EVENTS.PLAYER_STATS.STAMINA, function(e, data){
			var current = data.b.current,
				max 	= data.b.max;
			
			$head.html(formatNumber(current));
			
			$value.html(formatNumber(current) + ' / ' + formatNumber(max));
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.STAMINA_GAINPER, function(e, data){
			$gain.html('+'+data.b);
		});
		
		return {
			head: 		$head,
			values: 	$value,
			gainPer:	$gain,
			gainNext:	$next 
		};
	},
	
	_setupPlayerStatsEquipment: function(){
		var $head = $('#statbar-equipment'),
			$tooltip = $('#statbar-equipment-tooltip'),
			$slots = {
				gloves: $('.stat-durability-gloves', $tooltip).next(),
				helmet: $('.stat-durability-helmet', $tooltip).next(),
				amulet: $('.stat-durability-amulet', $tooltip).next(),
				weapon: $('.stat-durability-weapon', $tooltip).next(),
				armor: 	$('.stat-durability-armor' , $tooltip).next(),
				shield: $('.stat-durability-shield', $tooltip).next(),
				ring: 	$('.stat-durability-ring'  , $tooltip).next(),
				boots: 	$('.stat-durability-boots' , $tooltip).next(),
				rune: 	$('.stat-durability-rune'  , $tooltip).next()
			};
		
		$tooltip.delegate('.statbar-equipment-repair', 'click', function(e){
			e.preventDefault();
			
			GameData.doAction(HCS.DEFINES.ACTION.REPAIR_BY_SLOT, FETCH_FLAGS.PLAYER_STATS + FETCH_FLAGS.PLAYER_EQUIPMENT, { t: $(this).data('equiptype') }, 0);
			
			return false;
		});
		
		$tooltip.delegate('.statbar-equipment-repairall', 'click', function(e){
			e.preventDefault();
			
			GameData.doAction(HCS.DEFINES.ACTION.REPAIR_ALL, FETCH_FLAGS.PLAYER_STATS + FETCH_FLAGS.PLAYER_EQUIPMENT, {}, 0);
			
			return false;
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_EQUIPMENT.ANY, function(e, data){
			var overallDurability = 0,
				numPieces = 0,
				somethingsBroken = false,
				lowestDurability = 100;
			
			$.each(data.b, function(key, value){
				if (value.itemId < 0)
				{
					$slots[key].html('-<a href="#" class="statbar-equipment-repair" data-equiptype="'+value.type+'">Repair</a>');
				}
				else
				{
					var thisDurability = (value.current / value.max) * 100;


					if (value.rarity !== HCS.DEFINES.ITEM_RARITY.CRYSTALLINE)
					{

						if (thisDurability <= 0)
						{
							somethingsBroken = true;
						}

						if (thisDurability < lowestDurability)
						{
							lowestDurability = thisDurability;
						}

						$slots[key].html(value.current+' / '+value.max+' ('+Math.round(thisDurability)+'%)'+ '<a href="#" class="statbar-equipment-repair" data-equiptype="'+value.type+'">Repair</a>');

						// Overall stuff
						overallDurability += thisDurability;
						numPieces++;
					}
					else
					{
						$slots[key].html(value.current+' / '+value.max+' <font style="cyan">(Crystal)</font>'+ '<a href="#" class="statbar-equipment-repair" data-equiptype="'+value.type+'">Repair</a>');
					}
				}
			});
			
			if (!numPieces) { // No equipment
				$head.html('');
			}
			else
			{
				overallDurability /= numPieces;
				
				if (!somethingsBroken) // No item's are completely broken 
				{ 
					if (overallDurability <= 0) // All equipment is broken
					{
							$.publish('error.message', 'All of your equipment is broken, you\'re naked!', 'error');
					}
					else if (overallDurability < 10) // Equipment is about to break
					{
						$.publish('warning.message', 'Your equipment is about to break!');
					}
				}
				
				$head.html(Math.round(lowestDurability * 10) / 10 + '%');
			}
			
			if (somethingsBroken) {
				$.publish('error.message', 'Some of your equipment is broken!', 'error');
			}
		});
	
		return {
			head: $head,
			tooltip: $tooltip,
			slots: $slots
		};
	},
	
	_setupPlayerStatsBackpack: function(cache){
		var $head = $('#statbar-inventory'),
			$tooltip = $('#statbar-inventory-tooltip');
		
		$.subscribe(DATA_EVENTS.PLAYER_BACKPACK.ANY, function(e, data){
			var b = data.b,
				current = b.current,
				max = b.max;
			
			$head.html(formatNumber(current) + ' / ' + formatNumber(max));
		});
		
		return {
			head: $head,
			tooltip: $tooltip
		};
	},
	
	_setupPlayerFSP: function(cache)
	{
		var $head = $('#statbar-fsp'),
			$tooltip = $('#statbar-inventory-fsp');
			
		$.subscribe(DATA_EVENTS.PLAYER_STATS.FSP, function(e, data){
			$head.html(formatNumber(data.b));
		});
	
		return {
			head: $head,
			tooltip: $tooltip
		};
	},
	
	_setupPlayerStatsGold: function(cache){
		var $head = $('#statbar-gold'),
			$tooltip = $('#statbar-gold-tooltip'),
			$gold = $('.stat-gold', $tooltip).next(),
			$bank = $('.stat-bank', $tooltip).next(),
			$gainPer = $('.stat-gold-gainperhour', $tooltip).next(),
			$gainNext = $('.stat-gold-nextGain', $tooltip).next();
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.GOLD, function(e, data){
			var gold = formatNumber(data.b);
			
			$head.html(gold);
			$gold.html(gold);
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.BANK, function(e, data){
			$bank.html(formatNumber(data.b));
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.GOLD_GAINPER, function(e, data){
			$gainPer.html('+'+formatNumber(data.b));
		});
		
		return {
			head: $head,
			tooltip: $tooltip,
			gold: $gold,
			bank: $bank,
			gainPer: $gainPer,
			gainNext: $gainNext
		};
	},
	
	_setupPlayerXPBar: function(cache){
		var $head = $('#statbar-xp'),
			$tooltip 	= $('#statbar-level-tooltip'),
			$level 		= $('.stat-level', $tooltip).next(),
			$progress 	= $('.stat-xp-progress', $tooltip).next(),
			$remaining 	= $('.stat-xp-remaining', $tooltip).next(),
			$total 		= $('.stat-xp-total', $tooltip).next(),
			$gainPer 	= $('.stat-xp-gainPerHour', $tooltip).next(),
			$gainNext 	= $('.stat-xp-nextGain', $tooltip).next(),
			$progressBar= $('#statbar-xp-progress');
				
		// Temp Code
		/*
		var tempXP = GameData.player().xp,
			tempPerc =  ((tempXP.current - tempXP.base) / (tempXP.next - tempXP.base)) * 100;
		
		$progressBar.css('width', tempPerc+'%');
		
		$progress.html(formatNumber(tempXP.current - tempXP.base)+' / '+formatNumber(tempXP.next - tempXP.base)+' ('+(Math.round(tempPerc*100)/100)+'%)');
		*/
		// End Temp Code
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.XP, function(e, data){
			var	a = data.a,
				b = data.b,
				levelChanged = ((a.base === b.base) ? false : ((a.base<b.base)?1:-1)),
				percentA = ((a.current - a.base) / (a.next - a.base)) * 100,
				percentB = ((b.current - b.base) / (b.next - b.base)) * 100;
			
			// Text Stats
			$progress.html(formatNumber(b.current - b.base)+' / '+formatNumber(b.next - b.base)+' ('+(Math.round(percentB*100)/100)+'%)');
			$remaining.html(formatNumber(b.next - b.current));
			$total.html(formatNumber(b.current));
			
			// Animate XP Bar
			if (!levelChanged) { // No change, animate normally
				var percentDiff = ~~(Math.abs(percentB - percentA));
				
				$progressBar.animate({'width': percentB + '%'}, {duration: percentDiff * XP_PROGRESS_TIME_PER_PERCENT, easing:'linear'});
			}
			else // Level Changed, do special animation
			{
				if (levelChanged > 0) // Level Up
				{
					$progressBar.animate({'width': '100%'}, {
							duration: ~~((100 - percentA) * XP_PROGRESS_TIME_PER_PERCENT),
							complete: function(e){
								$progressBar
									.css('width', '0%')
									.delay(1)
									.animate({'width':percentB+'%'},{duration: ~~(percentB * XP_PROGRESS_TIME_PER_PERCENT),easing:'linear'});
							},
							easing:'linear'
						});
				}
				else // De-levelled
				{
					$progressBar.animate({'width': '0%'}, {
							duration: ~~(percentA * XP_PROGRESS_TIME_PER_PERCENT),
							complete: function(e){
								$progressBar
									.css('width', '100%')
									.delay(1)
									.animate({'width':percentB+'%'},{duration: ~~(percentB * XP_PROGRESS_TIME_PER_PERCENT),easing:'linear'});
							},
							easing:'linear'
						});
				}
			}
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.XP_GAINPER, function(e, data){
			$gainPer.html('+'+formatNumber(data.b));
		});
		
		$.subscribe(DATA_EVENTS.PLAYER_STATS.LEVEL, function(e, data){
			var up = (data.b > data.a);
			
			$level.html(formatNumber(data.b));
			
			$.publish(((up)?'ok':'error')+'.message', ((up) ? 'You have levelled up!' : 'You have de-levelled!'));
		});
	
		return {
			head: $head,
			tooltip: $tooltip,
			level: $level,
			progress: $progress,
			remaining: $remaining,
			total: $total,
			gainPer: $gainPer,
			gainNext: $gainNext,
			progressBar: $progressBar
		};
	}
});
})(jQuery);(function($){
	var KEYS = HCS.defines.keys;

	$.widget('hcs.worldControls', {
		_create: function()
		{
			var repeat = function(e, key){
				$.publish('keydown.controls', key);
			};

			$.subscribe('keydown.controls', function(e, key)
			{
				var xDir = 0,
					yDir = 0;

				switch(key)
				{
					case KEYS.REPAIR:
						GameData.doAction(HCS.DEFINES.ACTION.REPAIR_ALL, FETCH_FLAGS.PLAYER_STATS + FETCH_FLAGS.PLAYER_EQUIPMENT, 0);
						return; // Return we don't want to deal with the directions
					break;
					
					case KEYS.DIRECTION_N	: yDir = -1; break;
					case KEYS.DIRECTION_S	: yDir =  1; break;

					case KEYS.DIRECTION_E	: xDir =  1; break;
					case KEYS.DIRECTION_W	: xDir = -1; break;

					case KEYS.DIRECTION_NE	: yDir = -1; xDir =  1; break;
					case KEYS.DIRECTION_NW	: yDir = -1; xDir = -1; break;

					case KEYS.DIRECTION_SE	: yDir = 1; xDir =   1; break;
					case KEYS.DIRECTION_SW	: yDir = 1; xDir =  -1; break;

				}

				if (xDir === 0 && yDir === 0) {
					return;
				}

				$.publish('move-attempt.player', {x: xDir, y: yDir});
			});

			$.subscribe('keyrepeat.controls', function(e, key)
			{
				var xDir = 0,
					yDir = 0;

				switch(key)
				{
					case KEYS.DIRECTION_N	: yDir = -1; break;
					case KEYS.DIRECTION_S	: yDir =  1; break;

					case KEYS.DIRECTION_E	: xDir =  1; break;
					case KEYS.DIRECTION_W	: xDir = -1; break;

					case KEYS.DIRECTION_NE	: yDir = -1; xDir =  1; break;
					case KEYS.DIRECTION_NW	: yDir = -1; xDir = -1; break;

					case KEYS.DIRECTION_SE	: yDir = 1; xDir =   1; break;
					case KEYS.DIRECTION_SW	: yDir = 1; xDir =  -1; break;

				}

				if (xDir === 0 && yDir === 0) {
					return;
				}

				$.publish('move-attempt.player', {x: xDir, y: yDir, repeat: true});
			});

			$.publish('ready.hcs-element', self.widgetBaseClass);
		}
	})
})(jQuery);(function($) {

	var uiDialogClasses = 'ui-dialog ' + 'ui-widget ' + 'ui-widget-content ',
		sizeRelatedOptions = {
		buttons : true,
		height : true,
		maxHeight : true,
		maxWidth : true,
		minHeight : true,
		minWidth : true,
		width : true
	}, resizableRelatedOptions = {
		maxHeight : true,
		maxWidth : true,
		minHeight : true,
		minWidth : true
	};
	
	var iconsMiniMode = ['ui-icon-arrowreturnthick-1-s', 'ui-icon-arrowreturnthick-1-s'],
		iconsMinimise = ['ui-icon-arrowthickstop-1-s', 'ui-icon-arrowthick-1-n'];
	
	$.widget('hcs.worldDialog', $.ui.dialog, $.extend({},
		$.hcs.widget.prototype, {
			options : {
				autoOpen : false,
				closeOnEscape : true,
				dialogClass : 'cR',
				
				minimisable: true,
				minimised: false,
				
				modes: 
				{
					standard: true,
					mini: false,
					text: false
				},
				
				mode: 'standard'
			},
	
			_create : function() {
				var self = this;
				
				$.ui.dialog.prototype['_create'].apply(self, arguments);
				
				$.extend(self.options, {
					open : function(e, ui) {
						self._onBeforeOpen();
					},
					close : function(e, ui) {
						self._onBeforeClose();
					}
				});
				
				var uiDialogTitlebar = self.uiDialogTitlebar;
				
				self.uiDialog.appendTo('#worldDialogs');
			},
			
			_setupMiniMode: function(uiDialogTitlebar){
				var self = this,
					uiDialogTitlebarMinimode = $('<a href="#"></a>')
						.addClass(
							'ui-dialog-titlebar-minimode ' +
							'ui-corner-all'
						)
						.attr('role', 'button')
						.hover(
							function() {
								uiDialogTitlebarMinimode.addClass('ui-state-hover');
							},
							function() {
								uiDialogTitlebarMinimode.removeClass('ui-state-hover');
							}
						)
						.focus(function() {
							uiDialogTitlebarMinimode.addClass('ui-state-focus');
						})
						.blur(function() {
							uiDialogTitlebarMinimode.removeClass('ui-state-focus');
						})
						.click(function(event) {
							self.toggleMiniMode(event);
							return false;
						})
						.appendTo(uiDialogTitlebar),
					
					uiDialogTitlebarMinimodeText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
						.addClass(
							'ui-icon ' +
							iconsMiniMode[(self.options.minimode ? 1 : 0)]
						)
						.text('Mini Mode')
						.appendTo(uiDialogTitlebarMinimode);
					
				return uiDialogTitlebarMinimode;
			},
			
			_setupMinimisable: function(uiDialogTitlebar){
				var self = this,
				
					uiDialogTitlebarMinimise = $('<a href="#"></a>')
						.addClass(
							'ui-dialog-titlebar-minimise ' +
							'ui-corner-all'
						)
						.attr('role', 'button')
						.hover(
						function() {
								uiDialogTitlebarMinimise.addClass('ui-state-hover');
							},
							function() {
								uiDialogTitlebarMinimise.removeClass('ui-state-hover');
							}
						)
						.focus(function() {
							uiDialogTitlebarMinimise.addClass('ui-state-focus');
						})
						.blur(function() {
							uiDialogTitlebarMinimise.removeClass('ui-state-focus');
						})
						.click(function(event) {
							self.toggleMinimised(event);
							
							return false;
						})
						.appendTo(uiDialogTitlebar),
					
					uiDialogTitlebarMinimiseText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
						.addClass(
							'ui-icon ' +
							iconsMinimise[(self.options.minimised ? 1 : 0)]
						)
						.text('Minimise/Maximise')
						.appendTo(uiDialogTitlebarMinimise);
						
					return uiDialogTitlebarMinimise;
			},
			
			_onBeforeOpen: function()
			{
				/*
				var self = this;
				
				if (self.preMinimisedState !== undefined) 
				{				
					self.uiDialog.css('position', 'absolute');
					self.options.height = self.preMinimisedState.autoHeight;
					
					$.ui.dialog.prototype['_size'].apply(self, arguments);
					
					self.preMinimisedState = undefined;
				}
				*/
				this._onOpen();
			},
			
			_onOpen : function() {},
			
			_onBeforeClose: function()
			{
				//this.uiDialog.css('position', 'absolute');
				
				this._onClose();
			},
			
			_onClose : function() {},
			
			toggleMinimised : function(event){
				var self = this,
					button = self.uiDialogTitlebarMinimise.find('span');
				
				if (self.options.minimised) {
					self.restore();
					
					button
						.removeClass(iconsMinimise[1])
						.addClass(iconsMinimise[0]);
				}
				else {
					self.minimise();
					
					button
						.removeClass(iconsMinimise[0])
						.addClass(iconsMinimise[1]);
				}
			},
			
			minimise: function(event)
			{
				var self = this,
					position = self.uiDialog.position(),
					w = 0;
				
				self._onBeforeMinimise();
				
				self.options.minimised = true;
				
				self.preMinimisedState = 
				{
					w: self.uiDialog.width(),
					h: self.uiDialog.height(),
					autoHeight: self.options.height,
					left: position.left,
					top: position.top
				};

				// If draggable, Remove Draggable
				if (self.options.draggable)
				{
					self.uiDialog
						.removeData("draggable")
						.unbind(".draggable")
						.removeClass("ui-draggable" + " ui-draggable-dragging" + " ui-draggable-disabled");
					
					self.uiDialog.unbind('.draggable');
				}
								
				self.uiDialogTitlebar.children().each(function(i,v){
					w += $(this).outerWidth();
				});
				
				w += 8;
								
				self.options.height = 0;
				
				self.uiDialog.css({
					'height'	: self.uiDialog.find('.ui-dialog-titlebar:first').outerHeight(),
					'width'		: w,
					'position'	: 'fixed',
					'left'		: 10,
					'top'		: '',
					'bottom'	: 10
				});
				
				self._onAfterMinimise();
			},
			
			_onBeforeMinimise: function(){},
			
			_onAfterMinimise: function(){},
			
			restore: function(event)
			{
				return;
				
				var self = this,
					stored = self.preMinimisedState;
				
				self._onBeforeRestore();
				
				self.options.minimised = false;
				
				self.uiDialog.css({
						'position'	: 'absolute',
						'width'		: 'auto',
						'height'	: 'auto',
						'left'		: stored.left,
						'top'		: stored.top
					});
				
				self.options.height = stored.autoHeight;
				$.ui.dialog.prototype['_size'].apply(self, arguments);
				
				self.element.css('overflow', 'hidden');
				
				$.ui.dialog.prototype._makeDraggable.call(self);
				
				self._onAfterRestore();
			},
			
			_onBeforeRestore: function(){},
			
			_onAfterRestore: function(){},
			
			toggleMiniMode: function(event){
				var self = this;
				
				self._onBeforeMiniMode();
				
				if(!self.options.minimode)
					self.element.addClass('hcs-mini');
				else
					self.element.removeClass('hcs-mini');
					
				self.options.minimode = self.element.is('.hcs-mini');
				
				self._onAfterMiniMode();
			},
			
			_onBeforeMiniMode: function(){},
			
			_onAfterMiniMode: function(){}
		}));
})(jQuery);(function(){
	
$.widget('hcs.worldDialogSettings', $.hcs.worldDialog, {
	options: {
		autoOpen: false,
		closeOnEscape: true,
		width: 500,
		resizable: false,
		title: 'Settings',
		modal: true
	},
	
	_create: function()
	{
		// Call Super
		$.hcs.worldDialog.prototype._create.apply(this, arguments);
		
		var self = this;
		
		$('#world-settings').bind('click', function(){
			self.open();
		});
		
		this.element.find('.tabs:first').tabs();
		
		// publish element ready
		$.publish('ready.hcs-element', this.widgetBaseClass);
	},
	
	_initSettings: function()
	{
		var stored = localStorage.getItem('HCS.world.settings');
		
		if (stored !== null && stored !== undefined) 
		{
			world_settings = $.extend(world_settings, stored);
		}
		
		$.publish('init.worldSettings', world_settings);
	}
});
	
})(jQuery);(function($)
{
	$.widget('hcs.worldBuffList', $.hcs.widget, {
		_create: function()
		{
			var self = this;
			
			self._subscribe();
			self._bind();
			
			// publish element ready
			$.publish('ready.hcs-element', this.widgetBaseClass);
		},
	
		_subscribe: function()
		{
			var self = this;

			$.subscribe('buffs.player', function(e, data)
			{
				var buffs = data.b;
				var html = '';
				var t = GameData.time();
					
				$.each(buffs, function(i,v)
				{
					this.percent = self._calcPercent(this, t);
					this.timeRemaining = self._calcTimeRemaining(this, t);
				});

				/*buffs = buffs.sort(function(a, b)
				{
					return ( a.percent < b.percent) ? -1 : (a.percent > b.percent ) ? 1 : 0;
				});*/
				
				buffs = buffs.sort(function(a, b)
				{
					return ( a.timeRemaining < b.timeRemaining) ? -1 : (a.timeRemaining > b.timeRemaining ) ? 1 : 0;
				});
				
				$.each(buffs, function(i, v)
				{
					html += self._drawBuff(v, t);
				});
				self.element.html(html);
			});
		},
		
		_bind: function()
		{
			var self = this,
				fetchFlags = HCS.world.defines.fetchFlags;
			this._delegate(this.element, '.buffListBuff', {
				click: function(e)
				{
					GameData.doAction(22, fetchFlags.playerBuffs, {id:$(this).data('buff')}, 0);
				}
			});
			
		},
		
		_drawBuff: function(buff, t)
		{
			var timeLeft = buff.expires - t,
				m = Math.floor(timeLeft / 60),
				s = timeLeft - (m*60);
						
			return '<li class="buffListBuff buff-'+buff.id+' tip-static" data-buff="'+buff.id+'" data-tipped="<div style=\'width: 250px; font-size: 12px;\'><center><span style=\'color: rgb(0, 255, 0)\'><b>'+buff.name+'</b> ['+buff.level+']</span><br>'+buff.tooltip+'<br>Time Remaining: '+m+'m '+s+'s<br>[Click to De-activate]"></div><span class="buffStack">'+((buff.stack>0)?buff.stack:'')+'</span><span class="buffDurationContainer"><span class="buffDuration'+((buff.percent < 21)?' warning':'')+'" style="width: '+buff.percent+'%"></span></span><span class="buffTimeRemaining">'+m+'m&nbsp;'+s+'s</div></li>';
		},
		
		_calcPercent: function(buff, t)
		{
			return Math.round(((buff.expires - t) / buff.duration)*100);
		},
		
		_calcTimeRemaining: function(buff, t)
		{
			return (buff.expires - t);
		}
	});
	
}) (jQuery);(function($) {
	var fetchItemType = 2;
	
	$.widget('hcs.worldCrate', {
		_create: function()
		{
			var self = this;
			
			var of = $('#messageCenter');
			
			$.subscribe('6-success.action-response', function(e, data)
			{
				if(data.response.response !== 0)
					return;
				
				var itemData = data.response.data,
					item_id = itemData.id,
					inv_id	= -1,
					t		= fetchItemType,
					vcode	= itemData.vcode,
					uid		= -1,
					targetPlayer = -1;
				
				self.element.css({'width':0}).position({
					my: 'center bottom',
					at: 'center bottom',
					of: of
				}).attr(
				{
					'class': 'tip-dynamic',
					'data-tipped': 'fetchitem.php?item_id='+item_id+'&inv_id='+inv_id+'&t='+fetchItemType+'&p='+targetPlayer+'&uid='+uid+'&vcode='+vcode
				});
			});
		}
	});

})(jQuery);

(function($)
{
	var fileserver = 'http://cdn.fallensword.com/';

	$.widget('hcs.worldMasterRealm', $.hcs.widget, {
		_create: function() {
			var self = this;

			var world 	= self.element.find('.masterRealmWorld'),
				map 	= self.element.find('.masterRealmMap'),
				desc	= self.element.find('.masterRealmDesc');

			self.options.subElements = {
				world: world,
				map: map,
				desc: desc
			};

			map.bind('click', function(e, data){
				GameData.doAction(5, 511, {id:e.target.hash.slice(1)});
				return false;
			});

			$.subscribe('masterRealm.stats-player', function(e, data){
				if(!data.b)
					return self.element.hide();
			});

			$.subscribe('update.masterRealm', function(e, data){
				self._renderMasterRealm(data.b);
			});

			$.publish('ready.'+self.widgetBaseClass);
		},

		_renderMasterRealm : function(masterRealm)
		{
			var self = this;

			var world = self.options.subElements.world,
				map   = self.options.subElements.map,
				desc  = self.options.subElements.desc;

			map.html(self._generateMap(masterRealm.stairways));
			world.html('<img src="'+fileserver+'masterrealms/'+masterRealm.id+'.jpg" usemap="#masterRealmMap" />');
			desc.html('<img src="'+fileserver+'masterrealms/mini_'+masterRealm.id+'.gif" />');

			self.element.show();
		},

		_generateMap : function(stairways)
		{
			var html = '';

			$.each(stairways, function(i, stairway){
				html += '<area shape="circle" coords="'+stairway.x+','+stairway.y+',25" href="#'+stairway.id+'" class="tip-static" data-tipped="'+stairway.name+'<br /><strong>Click to Travel</strong>"/>';
			});

			return html;
		}
	});
})(jQuery);(function($)
{
	var formatNumber = HCS.utils.formatNumber,
		MESSAGE_TYPE = {
			ERROR: 'error',
			OK: 'okay',
			WARNING: 'warning',
			INFO: 'info'
		};
	
	$.widget('hcs.worldMessageCenter', $.hcs.widget,
	{
		backpackFullNotified: false,
		
		options: 
		{
			offset: '0 -20'
		},
		
		_create: function()
		{
			var self = this;

			var inRealm = $('#mapCanvas'),
				inMasterRealm = $('#masterRealmContainer');
			
			this.positionOf = inRealm;
			
			$.subscribe(HCS.DEFINES.DATA_EVENTS.PLAYER_STATS.MASTER_REALM, function(e,data){
				self.positionOf = (data.b > 0) ? inMasterRealm : inRealm;
			});
			
			self._subscribe();
			
			self._delegate(this.element, '.message', 
			{
				click: function()
				{
					$(this).hide();
					self._reposition();
				}
			});
		},
		
		_reposition: function()
		{
			this.element.position({
				my: 'center bottom',
				at: 'center bottom',
				of: this.positionOf,
				offset: this.options.offset,
				collision: 'fit'
			});
		},
		
		_displayMessage: function(msg, type, time)
		{
			var self = this,
				time = time || 3000;
			
			$('<p class="message '+type+'">' + msg + '</p>')
				.appendTo(self.element)
				.delay(time)
				.animate({'opacity': 0}, {duration: 500, easing: 'linear', complete: function(){
					$(this).remove();
					self._reposition();
				}});
			
			// re-centre
			self._reposition();
		},
		
		_subscribe: function()
		{
			var self = this;
			
			var responses = '';
			
			for (var i = -1; i < 100; i++) 
			{
				responses += i + '-success.action-response '
			}
			
			$.subscribe('error.message error', function(e, data)
			{
				if(window.location.host !== 'jt.huntedcow.com')
					return;
				
				console.error(data);
				console.trace();
				
				self._displayMessage(data, MESSAGE_TYPE.ERROR, 3000);
			});
			
			$.subscribe('warning.message', function(e, data)
			{
				if(window.location.host !== 'jt.huntedcow.com')
					return;
				
				console.warn(data);
				console.trace();
				
				self._displayMessage(data, MESSAGE_TYPE.WARNING, 3000);
			});
			
			$.subscribe('ok.message', function(e, data)
			{
				if(window.location.host !== 'jt.huntedcow.com')
					return;
					
				console.info(data);
				console.trace();
				
				self._displayMessage(data, MESSAGE_TYPE.OK, 3000);
			});
			
			$.subscribe('info.message', function(e, data)
			{
				self._displayMessage(data, MESSAGE_TYPE.INFO, 3000);
			});
			
			$.subscribe(responses, function(e, data)
			{
				if(data.response === undefined)
					return;
				
				var response = data.response,
					actionCode = parseInt(e.type.split('-',1)[0]);
				
				//console.log(response, actionCode)
				
				switch(actionCode)
				{
					case 0: // Quest
							/*if (response.response === 0) 
							{
								var txt = response.data,
									time = Math.max(3000, txt.length * 55);

								self._displayMessage(txt.replace(/\\'/ig, "'"), '', time);
								return;
							}
							
							var txt = response.msg,
								time = Math.max(3000, txt.length * 55);
							
							self._displayMessage(txt, MESSAGE_TYPE.ERROR, time);*/
						break;
					
					case 1: // View Creature
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
						
					case 2: // PvE
							if (response.response === 0) 
							{
								var itemId = response.data.item.id || -1;
								
								if (itemId === -2) 
								{
									if(!self.backpackFullNotified)
									{
										self._displayMessage('You cannot carry any more items, your backpack is full.', MESSAGE_TYPE.ERROR);
										self.backpackFullNotified = true;
									}
								}
							}
							else
							{
								
								self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
							}
						break;
					
					case 3: // PvP
						break;
					
					case 4: // Move
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
						
					case 5: // Stairway
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					
					case 6: // Crate
							if(response.response === 0)
								self._displayMessage('You opened the chest and received 1 x '+response.data.name+'. This item can now be found in your mailbox!' , '', 4000);
							else
								self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					
					case 7: // Portal View
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
						
					case 8: // Portal Use
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					
					case 9: // Relic View
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					
					case 10: // Relic Empower
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
						
					case 11: // Relic Capture
						if (response.response === 0) 
						{
							self._displayMessage(response.msg, MESSAGE_TYPE.OK);
							return;
						}
						
						self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						
						break;
					
					case 12: // Group Create
						if(response.response === 0)
						{
							self._displayMessage('Attack group created.', MESSAGE_TYPE.OK);
						}
						else
						{
							self._displayMessage((response.msg !== null)?response.msg:'An error occured when attempting to create an attack group.');
						}
						break;
					
					case 13: // Shop View
							if(response.response === 0)
								return;
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
						
					case 14: // Shop Buy
							if(response.response === 0)
								self._displayMessage('You purchased '+response.data.name+' for '+formatNumber(response.data.cost)+ ' gold.', MESSAGE_TYPE.OK);
							else
							
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					
					case 15: // Repair
							if(response.response === 0)
								self._displayMessage('Successfully repaired all items for '+formatNumber(response.data)+ ' gold.', MESSAGE_TYPE.OK);
							else
								self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					
					case 19:
						if(response.response === 0)
							self._displayMessage('Item Discarded', MESSAGE_TYPE.OK);
						else
							self._displayMessage('Error Discarding Item', MESSAGE_TYPE.ERROR);
						break;
					case HCS.DEFINES.ACTION.REPAIR_BY_SLOT:
						if(response.response === 0)
							self._displayMessage('Repaired item for '+formatNumber(response.data)+ ' gold.', MESSAGE_TYPE.OK);
						else
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					case 21:
						if(response.response !== 0)
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					case 22:
						if(response.response === 0)
							self._displayMessage('Buff De-activated.', MESSAGE_TYPE.OK);
						else
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					case 25:
						if(response.response !== 0)
							self._displayMessage(response.msg, MESSAGE_TYPE.ERROR);
						break;
					default:
						if(response.response === 0)
							return;

						console.log(actionCode);
						self._displayMessage('Unhandled Error', MESSAGE_TYPE.ERROR);
						break;
				}
			});
		}
	});
})(jQuery);(function($)
{
	var formatNumber = HCS.utils.formatNumber,
		NOTIFICATION_TYPE = {
			0: 'News',
			1: 'Log',
			2: 'Guild Log',
			3: 'Guild Chat',
			4: 'Guild Group',
			5: 'Guild Chat Leader',
			6: 'Guild Chat Hall',
			7: 'Rewards 1',
			8: 'Rewards 2',
			9: 'Repairs',
			10: 'Mailbox',
			11: 'Level Up'
		};
	
	$.widget('hcs.notifications', $.hcs.widget,
	{
		_create: function()
		{
			var self = this;
			self._subscribe();
		},
		
		_subscribe: function()
		{
			var self = this;
			
			$.subscribe(HCS.DEFINES.DATA_EVENTS.PLAYER_NOTIFICATIONS.ANY, function(e, data)
			{
				var n = data.b;
				var $ul = $('#notifications');
				// check which notifications need to be added
				if(n[0] && $('#notification-news').length==0)
					$ul.prepend('<li class="notification" id="notification-news"><a href="index.php?cmd=news"><span class="notification-icon" id="notification-icon-news"></span><p class="notification-content">News updated!</p></a></li>');
				if(n[1] && $('#notification-log').length==0)
					$ul.prepend('<li class="notification" id="notification-log"><a href="index.php?cmd=log"><span class="notification-icon" id="notification-icon-log"></span><p class="notification-content">New log messages</p></a></li>');
				if(n[2] && $('#notification-guild-log').length==0)
					$ul.prepend('<li class="notification" id="notification-guild-log"><a href="index.php?cmd=guild&subcmd=log"><span class="notification-icon" id="notification-icon-guild-log"></span><p class="notification-content">Guild Log updated!</p></a></li>');
				if(n[3] && $('#notification-guild-chat').length==0)
					$ul.prepend('<li class="notification" id="notification-guild-chat"><a href="index.php?cmd=guild&subcmd=chat"><span class="notification-icon" id="notification-icon-guild-chat"></span><p class="notification-content">New Guild chat message</p></a></li>');
				if(n[4] && $('#notification-guild-group').length==0)
					$ul.prepend('<li class="notification" id="notification-guild-group"><a href="index.php?cmd=guild&subcmd=groups"><span class="notification-icon" id="notification-icon-guild-group"></span><p class="notification-content">New attack group created.</p></a></li>');
				if(n[5] && $('#notification-guild-chat-leader').length==0)
					$ul.prepend('<li class="notification" id="notification-guild-chat-leader"><a href="index.php?cmd=guild&subcmd=chat&chat_type=1"><span class="notification-icon" id="notification-icon-guild-chat-leader"></span><p class="notification-content">New Guild Leaders message</p></a></li>');
				if(n[6] && $('#notification-guild-hall').length==0)
					$ul.prepend('<li class="notification" id="notification-guild-hall"><a href="index.php?cmd=guild&subcmd=hall"><span class="notification-icon" id="notification-icon-guild-hall"></span><p class="notification-content">New Guild Hall message</p></a></li>');
				if(n[7] && $('#notification-rewards-1').length==0)
					$ul.prepend('<li class="notification-w" id="notification-rewards-1"><a href="index.php?cmd=points&subcmd=matomyrewards"><span class="notification-title">Matomy Rewards!</span>Check out the latest Matomy rewards!</a></li>');
				if(n[8] && $('#notification-rewards-2').length==0)
					$ul.prepend('<li class="notification-w" id="notification-rewards-2"><a href="index.php?cmd=points&subcmd=trialpayrewards"><span class="notification-title">TrialPay Rewards!</span>Check out the latest TrialPay rewards!</a></li>');
				if(n[9] && $('#notification-repair').length==0)
					$ul.prepend('<li class="notification" id="notification-repair"><a href="index.php?cmd=blacksmith"><span class="notification-icon" id="notification-icon-repair"></span><p class="notification-content">Some of your items are broken.</p></a></li>');
				if(n[10] && $('#notification-mailbox').length==0)
					$ul.prepend('<li class="notification" id="notification-mailbox"><a href="index.php?cmd=tempinv"><span class="notification-icon" id="notification-icon-mailbox"></span><p class="notification-content">Mailbox has item(s)</p></a></li>');
				if(n[11] && $('#notification-levelup').length==0)
					$ul.prepend('<li class="notification" id="notification-levelup"><a href="index.php?cmd=levelup"><span class="notification-icon" id="notification-icon-level-up"></span><p class="notification-content">Level Up!</p></a></li>');
				
				// check which notifications need to be removed
				if(!n[0] && $('#notification-news').length>0)
					$('#notification-news').remove();
				if(!n[1] && $('#notification-log').length>0)
					$('#notification-log').remove();
				if(!n[2] && $('#notification-guild-log').length>0)
					$('#notification-guild-log').remove();
				if(!n[3] && $('#notification-guild-chat').length>0)
					$('#notification-guild-chat').remove();
				if(!n[4] && $('#notification-guild-group').length>0)
					$('notification-guild-group').remove();
				if(!n[5] && $('#notification-guild-chat-leader').length>0)
					$('notification-guild-chat-leader').remove();
				if(!n[6] && $('#notification-guild-hall').length>0)
					$('notification-guild-hall').remove();
				if(!n[7] && $('#notification-rewards-1').length>0)
					$('notification-rewards-1').remove();
				if(!n[8] && $('#notification-rewards-2').length>0)
					$('notification-rewards-2').remove();
				if(!n[9] && $('#notification-repair').length>0)
					$('notification-repair').remove();
				if(!n[10] && $('#notification-mailbox').length>0)
					$('notification-mailbox').remove();
				if(!n[11] && $('#notification-levelup').length>0)
					$('notification-levelup').remove();
			});
		}
	});
})(jQuery);(function($) {
	var states 	= HCS.defines.ui.states,
		fetchFlags = HCS.world.defines.fetchFlags,
		KEYS 	= HCS.defines.keys,
		ACTION	= HCS.DEFINES.ACTION;

	$.widget('hcs.worldActionlist', $.hcs.widget, {
		options: {
			actionTypes		: ["Stairway","Shop","Portal","Relic","Crate","Quest","Creature","Player"],
			creatureTypes	: ["Normal","Champion","Elite","Super Elite","Titan","Legendary"],
			locationTypes	: ["Stairway","Shop","Scenery","Portal","Relic"]
		},

		_create: function()
		{
			var self = this;

			// create HCS widget
			self.actions = [];

			// temp loading stuff
			this.options.loading  = '<li class="actionListItem loading first last hcs-state-disabled"><div class="header"><a href="#" class="icon"></a>Moving...</div></li>';

			var l = $('<ul id="actionListLoading" class="actionList '+states.disabled+'">'+this.options.loading+'</ul>').css({'position': 'absolute', 'top': '-9999px'}).insertBefore(this.element);
			this.options.loadingItemHeight = l.height();
			l.remove();

			// temp list
			this.options.tempList = $('<ul id="actionListTemp" class="actionList"></ul>').css({'position': 'absolute', 'top': '-9999px'}).insertBefore(this.element);

			// dragabble
			self.dragging = false;

			self.container = this.element.parent();

			self.container.draggable({
				distance: 10,
				handle: '#actionContainerHeader',
				start: function(){
					self.dragging = true;
					$(document).bind('mouseup.'+self.widgetBaseClass, function(e){
						setTimeout(function(){
							self.dragging = false;
							// unbind
							$(document).unbind('mouseup.'+self.widgetBaseClass);
						}, 100);
					});
				}
			});

			this._bind();
			this._subscribe();

			// Append To Root Top
			//this.element.parent().appendTo($('#root-top'));

			// Reposition
			this.reposition();

			this._updateActionList({}, {b: GameData.actions()});
			this._maximiseList();

			this.tab = $('#actionListTab');

			/*
			$('#actionListTab')
				.
			*/

			/*setInterval(function()
			{
				if (self.actions !== GameData.actions())
				{
					GameData.fetch(FETCH_FLAGS.ACTIONS);
				}
			}, 1000);*/

			// load initial actions
			GameData.fetch(FETCH_FLAGS.ACTIONS);

			// publish element ready
			$.publish('ready.hcs-element', this.widgetBaseClass);
		},

		reposition: function()
		{
			$('#actionContainer')
				.position({
					my: 'right top',
					at: 'right top',
					of: '#worldPage',
					offset: '-20 40',
					collision: 'none none'
				});
		},

		_subscribe: function()
		{
			var self = this;

			$.subscribe('update.defines', function(e, data){
				self.options.actionTypes 	 = data.b.actionTypes;
				self.options.creatureTypes 	 = data.b.creatureTypes;
				self.options.locationTypes 	 = data.b.locationTypes;
			});

			$.subscribe('hasGroup.stats-player', function(e, data)
			{
				self.options.inGroup = (data.b === 1);
			});

			$.subscribe('move-attempt-2.player', function()
			{
				self._minimiseList();
			});

			$.subscribe('4-success.action-response 25-success.action-response move-end.player', function(e, data)
			{
				if (
					GameController.Player._moveQueue.length === 0 &&
					GameController.Player._waitingForResponse === GameController.Player._lastResponse
				)
				{
					self._updateActionList(e, {b: GameData.actions()});
					self._maximiseList();
				}
			});

			$.subscribe(DATA_EVENTS.PLAYER_BUFFS.ANY, function(e, data)
			{
				// check shield imp is still active
				var shieldImpVal = 0;
				var l = data.b.length;
				for(var i=0; i<l; i++)
				{
					var buff = data.b[i];
					if(buff['id']==55)
					{
						shieldImpVal = buff['stack'];
						break;
					}
				}
				if (shieldImpVal > 0) {
					$('#actionlist-shield-imp').show().html(shieldImpVal);
				}
				else
				{
					//$('#actionlist-shield-imp').hide();
					$('#actionlist-shield-imp').show().html();
				}
			});

			$.subscribe('-1-success.action-response 5-success.action-response', function(e, data){
				if (
					GameController.Player._moveQueue.length === 0 &&
					GameController.Player._waitingForResponse === GameController.Player._lastResponse
				)
				{
					self._updateActionList(e, {b: GameData.actions()});
					self._maximiseList();
				}
			});

			$.subscribe('2-success.action-response', function(e, data)
			{
				var passback = data.passback;

				if (passback < 0) { return true }

				var action = self.actions[passback];

				if (action!==undefined && action.type !== 6) { return true }

				if(data.response.response !== 0) // If bad response do nothing.
				{
					return;
				}

				var combatData = data.response.data;

				if(combatData.type !== 0)
				{
					return; // Not a regular combat, return.
				}

				if(quickCombatEnabled)
				{
					var item = combatData.item,
						combatOutput =  '<span class="verbs"><a class="view-combat verb default" href="#"></a></span>' +
										'<span class="xp">XP: ' +HCS.utils.formatNumber(combatData.xp_gain)+ '</span> ' +
								        '<span class="gold">Gold: ' +HCS.utils.formatNumber(combatData.gold_gain) + (((combatData.guild_tax_gain) > 0) ? ' ['+HCS.utils.formatNumber(combatData.guild_tax_gain)+']':'')  +'</span>' +
										((item.id >= 0) ? '<span class="drop"><a href="#" class="discard tip-static" data-tipped="Discard?" data-invid="'+combatData.inventory_id+'"></a>[ <span class="item rarity-'+item.rarity +
										' tip-dynamic" data-tipped="fetchitem.php?item_id='+item.id+'&inv_id=-1&t=2&p=-1&uid=-1&vcode='+item.vcode+'">' +
										combatData.item.name+'</span> ]</span> ' : '');

					self.element
						.height('auto')
						.find('.actionListItem:eq('+passback+')>.header')
							.addClass('quickCombat '+((combatData.winner === 0) ? 'win' : 'lose'))
							.html(combatOutput);
				}
				else
				{
					GameData.fetch(1409);
				}

				// send event that combat has completed
				$.publish('after-update.combat');

				// Prevent Default
				e.preventDefault();
				return false;
			});

			$.subscribe(HCS.DEFINES.DATA_EVENTS.PLAYER_STATS.MASTER_REALM, function(e,data){
				if(data.b > 0) // In a master realm
				{
					self.container.hide();
				}
				else
				{
					self.container.show();
				}
			});

			$.subscribe('keydown.controls', function(e, key){
				switch(key)
				{
					case KEYS.ACTION_NO_1:
						self.element.find('.attack-1').click();
					break;

					case KEYS.ACTION_NO_2:
						self.element.find('.attack-2').click();
					break;

					case KEYS.ACTION_NO_3:
						self.element.find('.attack-3').click();
					break;

					case KEYS.ACTION_NO_4:
						self.element.find('.attack-4').click();
					break;

					case KEYS.ACTION_NO_5:
						self.element.find('.attack-5').click();
					break;

					case KEYS.ACTION_NO_6:
						self.element.find('.attack-6').click();
					break;

					case KEYS.ACTION_NO_7:
						self.element.find('.attack-7').click();
					break;

					case KEYS.ACTION_NO_8:
						self.element.find('.attack-8').click();
					break;

					case KEYS.USE:
						self.element.find('.use:first').click();
					break;

					case KEYS.RELOAD:
						GameData.fetch(1409);
					break;

					case KEYS.TELEPORT:
						$('.teleport').click();
					break;
				}
			});


			$.subscribe('0-success.action-response', function(e, data) {
				// quest response

				console.log('bing');

				var txt;
				if(data.response.response===0)
					txt = data.response.data;
				else
					txt = data.response.msg;

				txt = txt.replace(/\\'/ig, "'");
				txt = txt.replace(/\\"/ig, '"');

				//$('#actionListTemp .actionListItem.quest .pretext').html(txt);
				//$('#actionListTemp .actionListItem.quest .killData').html('');
				//$('#actionListTemp p.action-button').replaceWith('<p class="action-button"><a href="#" id="action-button-quest-refresh" class="action-refresh">Ok</a></p>');

				var html = txt;
				var $dialogQuest = $('#dialog-quest');
				$dialogQuest.dialog({
					buttons: [
						{
							id: "ok-button-quest-"+$dialogQuest.data('quest-id'),
							text: "Ok",
							click: function() { $(this).dialog('close'); }
						}
					]
				});
				$dialogQuest.html(html);

				self._maximiseList();

				GameData.fetch(1409);
			});
			/*
			$.subscribe('ready.worldManager', function(e, data){
				self.reposition();
			});
			*/

			var actionCodes = [
					ACTION.QUEST,
					ACTION.CREATURE_VIEW,
					ACTION.RELIC_CAPTURE,
					ACTION.SHOP_VIEW,
					ACTION.CREATURE_COMBAT,
					ACTION.STAIRWAY,
					ACTION.CRATE,
					ACTION.PORTAL_VIEW,
					ACTION.RELIC_VIEW,
					ACTION.GROUP_CREATE
				],
				actions = function()
				{
					var str = '';
					for (var i = actionCodes.length; i--;)
					{
						str += actionCodes[i] + '-success.action-response ';
					}

					return str;
				}();

			$.subscribe(actions, function(e, data)
			{
				if (data.passback == "")
				{
					return;
				}

				self.element.children(':eq('+data.passback+')').children('.header').children('.icon:first').removeClass('loading');
			});
		},

		_bind: function()
		{
			var self = this;

			this._delegate(this.element, '.actionListItem>div.header',
			{
				mouseout : function(e)
				{
					var $from 	= $(e.fromElement),
						$to 	= $(e.toElement),
						fromIsBase = $from.is('.header');

					if((fromIsBase || $from.is('.verbs')) && $to.is('.verb,.icon,.discard,.drop'))
					{
						self._liOnMouseLeave(e);
					}
					if ($to.is('.header,.verbs'))
					{
						self._liOnMouseEnter(e);
					}
				},

				mouseleave	: self._liOnMouseLeave,
				mouseenter	: self._liOnMouseEnter,

				mousedown : function(e)
				  {
					  var $t = $(e.target);

					  if($t.is('.'+states.disabled+',.verbs,.verb,.icon,.discard,.drop'))
					  		return false;

					  if(playerActionBoxNotSelectable && $t.parent().hasClass('player'))
						  return false;

					  $(e.currentTarget).addClass(states.active).find('.default:first').addClass(states.active);
				  },
				mouseup	: function(e)
				{
					$(e.currentTarget).removeClass(states.active).find('.default:first').removeClass(states.active);
				},

				click : function(e)
				{
					if(self.dragging)
						return false;

					// Highlighting names wont cause an attack anymore ~ Zorg
					if(getSelection().toString()){
						return;
					}

					var $this = $(this),
						$eT = $(e.target);

					if ($eT.is('.discard'))
					{
						GameData.doAction(19, fetchFlags.playerBackpackCount, {
							id: $eT.data('invid')
						}, 0);

						$eT.parent().fadeOut(200);

						return false;
					}

					if($this.is('.'+states.disabled+',.quest') || $eT.is('.icon,.drop'))
						return false;

					if(playerActionBoxNotSelectable && $this.parent().hasClass('player'))
						return false;

					$this.find('.default:first').trigger('click');
				}
			}, false);

			this._delegate(this.element, '.verbs a', {
				click: function(e)
				{
					self._doAction($(this).closest('.actionListItem').index(), $(this), 0);
					return false;
				}
			});

			this._delegate(this.element, 'a.action-button', {
				click: function(e)
				{
					self._doAction($(this).closest('.actionListItem').index(), $(this), 0);
					return false;
				}
			});

			this._delegate(this.element, 'a.action-refresh', {
				click: function(e)
				{
					GameData.fetch(1409);
				}
			});

			this._delegate(this.element.parent().find('#actionContainerHeader'), '.refresh', {
				click: function(e)
				{
					GameData.fetch(1409);
				}
			});

			this._delegate(this.element.parent().find('#actionContainerHeader'), '.portal', {
				click: function(e)
				{
					if(confirm('Are you sure you want to use the Instant Portal?'))
						GameData.doAction(HCS.DEFINES.ACTION.INSTANT_PORTAL, FETCH_FLAGS.ALL, {'xcv': xcv}, 0);
				}
			});

			this._delegate(this.element.parent().find('#actionContainerHeader'), '.teleport', {
				click: function(e)
				{
					GameController.Router.toggleTeleport();
				}
			});
		},

		_doAction: function(index, source)
		{
			var action 	 = GameData.actions()[index],
				data 	 = {},
				doAction = -1,
				fetch 	 = 256;

			if(action !== undefined && action.type !== undefined)
			{
				switch(action.type)
				{
					case 0: // Stairway
						doAction = 5;
						data.id = action.data.id;
						fetch = fetchFlags.all - fetchFlags.PLAYER_EQUIPMENT;
						break;

					case 1: // Shop
						doAction = 13;
						data.id = action.data.id;
						fetch = fetchFlags.playerStats;
						break;

					case 2: // Portal
						doAction = 7;
						data.id = action.data.id;
						fetch = fetchFlags.playerStats;
						break;

					case 3: // Relic
						if(source.is('.view'))
						{
							doAction = ACTION.RELIC_VIEW;
							data.id = action.data.id;
							fetch = 0;
							break;
						}
						if(source.is('.attack'))
						{
							doAction = ACTION.RELIC_CAPTURE;
							data.id = action.data.id;
							fetch = 0;
							break;
						}
						break;

					case 4: // Crate
						doAction = 6;
						fetch = fetchFlags.playerStats;
						data.id = action.data.id;
						break;

					case 5: // Quests
						doAction = 0;
						fetch = 0; //fetchFlags.playerStats + fetchFlags.playerBackpackCount + fetchFlags.playerBackpackItems + fetchFlags.worldRealmDynamic;
						data.id = action.data.id;

						var $dialogQuest = $('#dialog-quest');
						$dialogQuest.dialog({
							title: "Quest: "+action.data.name,
							position: ['center', 250],
							width: 500,
							buttons: [
								{
									id: "action-button-quest-"+data.id,
									text: action.data.button_text,
									click: function()
									{
										GameData.doAction(0, 0, {id: $dialogQuest.data('quest-id')}, 0);
										GameData.fetch(1409);
									}
								}
							]
						});
						$dialogQuest.data('quest-id', data.id);

						var html = '<p class="pretext">'+action.data.pretext+'</p>'
						+ ((action.data.req_killed_count <= 0) ? '' : '<p class="killData">[<strong>'+action.data.kill_count+'</strong>/<strong>'+action.data.req_killed_count+'</strong>] '+action.data.creature_name+((action.data.req_killed_count > 1)?'s':'')+' killed.</p>')
						+ '</div>';
						$dialogQuest.html(html);
						return; // don't process an action for this.
						break;

					case 6: // Creature
						fetch = fetchFlags.playerStats + fetchFlags.playerBackpackCount + fetchFlags.playerBuffs + fetchFlags.worldRealmDynamic + fetchFlags.PLAYER_EQUIPMENT + FETCH_FLAGS.PLAYER_NOTIFICATIONS;

						var isTitan = source.parents('.actionListItem').is('.creature-4');

						if(isTitan)
						{
							data.titan = action.data.checksum;
						}

						if(source.is('.view'))
						{
							doAction = 1;

							data.id = action.data.id;
							break;
						}
						if(source.is('.attack'))
						{
							doAction = 2;

							data.id = action.data.id;

							break;
						}
						if(source.is('.create-group'))
						{
							doAction = ACTION.GROUP_CREATE;
							fetch = FETCH_FLAGS.ACTIONS + FETCH_FLAGS.PLAYER_STATS + FETCH_FLAGS.REALM_DYNAMIC;
							data.id = action.data.id;

							break;
						}
						if(source.is('.use-group'))
						{
							doAction = 2;
							data.id = action.data.id;
							data.group = 1;

							break;
						}
						if (source.is('.view-combat'))
						{
							$.publish('view-combat.combatDialog', index);
							return;
						}

						break;
					case 7: // Other Player
						if (source.is('.view'))
						{
							window.location = 'index.php?cmd=profile&player_id=' + action.data.id;

							break;
						}

						if (source.is('.attack'))
						{
							window.location = 'index.php?cmd=attackplayer&target_username=' + action.data.name;

							break;
						}

						if (source.is('.msg'))
						{
							openQuickMsgDialog(action.data.name);

							break;
						}

						break;
				}

				// Display loading symbol?
				this.element.children(':eq('+index+')').children('.header').children('.icon:first').addClass('loading');
			}

			// Add the passback
			data.passback = index;

			GameData.doAction(doAction, fetch, data, 0);
		},

		_liOnMouseEnter: function(e)
		{
			var $ct = $(e.currentTarget);

			if ($ct.is('.quest,.' + states.disabled))
			{
				return true;
			}

			if(playerActionBoxNotSelectable && $ct.parent().hasClass('player'))
				return true;

			$ct.addClass(states.hover)
				.find('.default:first')
					.addClass('hcs-state-hover');

			return true;
		},

		_liOnMouseLeave: function(e)
		{
			var $ct = $(e.currentTarget),
				$from = $(e.fromElement),
				$to   = $(e.toElement);

			if($ct.is('.quest,.'+states.disabled)){
				return true;
			}

			if(playerActionBoxNotSelectable && $ct.parent().hasClass('player'))
				return true;

			$ct.removeClass(states.hover+' '+states.active)
				.find('.verb')
					.removeClass(states.hover+' '+states.active);
			/*
			if($to.is('.verb'))
			{
				$to.addClass(states.hover);
			}else{
				$ct.find('.default:first').addClass(states.hover);
			}
			*/
			return true;
		},

		_minimiseList: function()
		{
			this.element.css({height: this.options.loadingItemHeight}, {duration: 100, easing: 'linear', queue: false}).html(this.options.loading);
			$.publish('minimize.actionlist');
		},

		_maximiseList: function()
		{
			var html = this.element.html(),
				tempList = this.options.tempList,
				height = this.options.tempList.height();

			this.element.html(tempList.html()).css({height: height}, {duration:  height * .1, easing: 'linear', queue: false});

			// publish action list update completed
			$.publish('after-update.actionlist');
		},

		_sortActions: function(actions)
		{
			actions = actions.sort(function(a, b)
			{
				// if a/b is not a creature sort by type
				if(a.type !== 6 || b.type !== 6)
					return ( a.percent < b.percent) ? -1 : (a.percent > b.percent ) ? 1 : 0;

				// else sort by creature type
				return ( a.data.creature_type < b.data.creature_type) ? 1 : (a.data.creature_type > b.data.creature_type ) ? -1 : 0;
			});
		},

		_updateActionList: function(e, data)
		{
			if(this.options.actionTypes === undefined)
				return;

			var self = this,
				actions = data.b;

			self._sortActions(actions);

			var l = actions.length,
				html = '';

			if (l > 0)
			{
				var counter = {
					creatures: 1
				};

				var first, last;

				for (var i = 0; i < l; i++)
				{
					first = (i === 0);
					last = (i === (l - 1));

					html += this._processAction(actions[i], first, last, counter);
				}
			}
			else
			{
				html = '<li class="actionListItem empty first last hcs-state-disabled"><div class="header"><a href="#" class="icon"></a>No Actions Available</div></li>';
			}

			this.options.tempList.html(html);
		},

		_processAction: function(action, first, last, counter)
		{
			var actionType = this.options.actionTypes[action.type];

			var sameGuild = '';

			if(action.type == 7 && action.data.guild_id == GameData.player().guildId)
			{
				// check if in the same guild
				sameGuild = ' guild';
			}

			var html = '<li class="actionListItem '+actionType.toLowerCase() + ((action.type == 6) ? ' creature-' + action.data.creature_type : '') + sameGuild + ((first)?' first':'')+((last)?' last':'')+'">'
					 + '<div class="header">'
					 + '<div class="verbs">';

			switch(action.type)
			{
				case 0: // Stairway
					html += '<a href="#" id="action-stairway-'+action.data.id+'" class="use verb default stairway tip-static" data-tipped="Travel to '+action.data.name+'"></a>';
					break;

				case 1: // Shop
					html += '<a href="#" class="use verb default shop tip-static" data-tipped="Browse '+actionType+'"></a>';
					break;

				case 2: // Portal
					html += '<a href="#" class="view verb default portal tip-static" data-tipped="Enter '+actionType+'"></a>';
					break;

				case 3: // Relic
					html += '<a href="#" class="view verb default relic tip-static" data-tipped="Examine '+actionType+'"></a>'; // view

					if(this.options.inGroup)  // if in group, attack relic
					{
						html += '<a href="#" class="attack verb capture-relic tip-static" data-tipped="Capture Relic"></a>';
					}
					break;

				case 4: // Crate
					html += '<a href="#" class="use verb default crate tip-static" data-tipped="Open '+actionType+'"></a>'; // view
					break;

				case 5: // Quest
					html += '<a href="#" id="view-button-quest-'+action.data.id+'" class="view verb default tip-static" data-tipped="View Quest '+action.data.name+'"></a>';
					break;

				case 6: // Creature
					html += '<a href="#" class="view verb tip-static" data-tipped="Look at the '+action.data.name+'"></a>';
					if(action.data.creature_type == 0 || action.data.creature_type == 5 || action.data.creature_type == 4)
					{
						if (action.data.creature_type == 4) {
							alert("Titan found");
						}
						}
						// numbered actions
						html += '<a class="verb attack attack-'+counter.creatures+' action-attack-creature-'+action.data.base_creature_id+' default" href="#" title="Attack '+action.data.name+'"></a>';

						if (this.options.inGroup) {
							html += '<a class="verb use-group" href="#" title="Group Attack ' + action.data.name + '"></a>';
						}

						counter.creatures++;
					}
					else
					{
						html += '<a class="verb attack default" href="#" title="Attack '+action.data.name+'"></a>';

						if(this.options.inGroup)
							html += '<a class="verb use-group" href="#" title="Group Attack '+action.data.name+'"></a>';
						else
							html += '<a class="verb create-group" href="#" title="Create Group"></a>';
					}
					break;
				case 7: // Other Player
					html += '<a href="#" class="view verb default" title="Look at '+action.data.name+'"></a>'
						  + '<a class="verb msg" href="#" title="Send Message to '+action.data.name+'"></a>'
					      + '<a class="verb attack" href="#" title="Attack '+action.data.name+'"></a>';
					break;
			}

			// Close action header and verbs
			html += '</div><a href="#" class="icon tip-static" data-name="'+action.data.name+'" data-tipped="'+ ((action.type == 6 && action.data.creature_type != 0 && action.data.creature_type != 4 && action.data.creature_type != 5) ? this.options.creatureTypes[action.data.creature_type] : actionType )+'"></a>'
				 +action.data.name+'</div>';

			return '</li>' + html;
		}

	});
})(jQuery);(function($) {
	$.widget('hcs.worldCoord', $.hcs.widget, {
		_create: function()
		{
			this._subscribe();
			
			// publish element ready
			$.publish('ready.hcs-element', self.widgetBaseClass);
		},
		
		_subscribe: function()
		{
			var self = this;
			
			$.subscribe('location.stats-player', function(e, data)
			{
				self._setCoords(data.b);
			});
		},
		
		_setCoords: function(location)
		{
			this.element.html(location.x + ',' + location.y);
		}
	});
})(jQuery);(function($)
{
$.widget('hcs.worldDialogRelicConfirm', $.hcs.worldDialog, {
	options: {
		modal: true,
		resizable: false,
		zIndex: 100000
	},
	
	_create: function()
	{
		// Call Super
		$.hcs.worldDialog.prototype._create.apply(this, arguments);
		
		$.publish('ready.hcs-element', this.widgetBaseClass);
		
		return;
		
		// Cache Elements
		this._cache = this._cacheElements();
		
		// Delegate
		var self = this;
		
		this._delegate(this.element, '.button', {
			click: function()
			{				
				GameData.doAction(2, 287, {
					id: $(this).data('creature-id')
				}, 0);
				
				self.close();
				
				return false;
			}
		});
		
		// Subscribe to Events
		this._subscribe();
				
		// publish element ready
		$.publish('ready.hcs-element', this.widgetBaseClass);
	},
	
	_subscribe: function(){
		var self = this;
		
		$.subscribe(ACTION_VIEW_RELIC, function(e, data){
			// TODO: Make andrew change reponse to reSponse
			self._setupRelic(data.reponse.data);
			
			self.open();
		});
	}
});
})(jQuery);(function($)
{
var MIN_BONUSES,
	ACTION_VIEW_RELIC = '9-success.action-response',
	RELIC_ICON_URL = HCS.defines.fileserver + 'relics/',
	EMPTY_DEFENDER = '<li class="defender"></li>',
	EMPTY_BONUS = '<li class="bonus"></li>',
	MIN_DEFENDERS = (MIN_BONUSES = 6),
	RELIC_STATES = {
		UNCONTROLLED   : 'uncontrolled',
		CONTROLLED_DEF : 'controlled-def',
		CONTROLLED_DEF_EMPOWERED : 'controlled-def-empowered',
		CONTROLLED_DEF_NO_PERMISSION : 'controlled-def-nopermission',
		CONTROLLED_ATT : 'controlled-atk'
	},
	RELIC_STATES_ALL = function(){
		var all = '';
		
		$.each(RELIC_STATES, function(i, v){
			all += v + ' ';
		});
		
		return all;
	}();

$.widget('hcs.worldDialogRelicAbout', $.hcs.worldDialog, {
	options: {
		autoOpen: false,
		closeOnEscape: true,
		width: 500,
		resizable: false,
		title: 'About Relics',
		modal: true,
		zIndex: 100000
	},
	
	_create: function()
	{
		// Call Super
		$.hcs.worldDialog.prototype._create.apply(this, arguments);
		
		$.publish('ready.hcs-element', this.widgetBaseClass);
				
		// Subscribe to Events
		this._subscribe();
				
		// publish element ready
		$.publish('ready.hcs-element', this.widgetBaseClass);
	},
	
	_subscribe: function(){
		var self = this;
		
		$.subscribe('showAboutRelics', function(e, data){
			self.open();
		});
	}
});
})(jQuery);(function($)
{

var ACTION_VIEW_RELIC = '9-success.action-response',
	RELIC_ICON_URL = HCS.defines.fileserver + 'relics/',
	EMPTY_DEFENDER = '<li class="defender"></li>',
	EMPTY_BONUS = '<li class="bonus"></li>',
	MIN_DEFENDERS = 6,
	MIN_BONUSES = 6,
	RELIC_STATES = {
		UNCONTROLLED   : 'uncontrolled',
		CONTROLLED_DEF : 'controlled-def',
		CONTROLLED_DEF_EMPOWERED : 'controlled-def-empowered',
		CONTROLLED_DEF_NO_PERMISSION : 'controlled-def-nopermission',
		CONTROLLED_ATT : 'controlled-atk'
	},
	RELIC_STATES_ALL = function(){
		var all = '';
		
		$.each(RELIC_STATES, function(i, v){
			all += v + ' ';
		});
		
		return all;
	}();

$.widget('hcs.worldDialogRelic', $.hcs.worldDialog, {
	options: {
		autoOpen: false,
		closeOnEscape: true,
		width: 500,
		resizable: false,
		title: 'Relic',
		zIndex: 9999
	},
	
	_create: function()
	{
		// Call Super
		$.hcs.worldDialog.prototype._create.apply(this, arguments);
		
		// Cache Elements
		this._cache = this._cacheElements();
		
		// Delegate
		var self = this;
		
		this._delegate(this.element, '.button', {
			click: function()
			{
				var state = self.element.data('relic-state'),
					id = self.element.data('relic-id'),
					action = -1;
				
				switch (state)
				{
					case RELIC_STATES.UNCONTROLLED:
						action = 11; // Attack
					break;
					
					case RELIC_STATES.CONTROLLED_ATT:
						action = 11; // Attack
					break;
					
					case RELIC_STATES.CONTROLLED_DEF:
						action = 10; // Empower
					break;
					
					case RELIC_STATES.CONTROLLED_DEF_EMPOWERED:	
						action = 16; // Remove Empower
					break;
				}
				
				if(action > 0)
					GameData.doAction(action, 1, {id: id}, 0);
				
				//self.close();
				
				return false;
			}
		});
		
		this._delegate(this.element, '.relic-help', 
		{
			click: function()
			{
				$.publish('showAboutRelics');
			}
		});
		
		
		// Subscribe to Events
		this._subscribe();
				
		// publish element ready
		$.publish('ready.hcs-element', this.widgetBaseClass);
	},
	
	_subscribe: function(){
		var self = this;
		
		// View Relic
		$.subscribe(ACTION_VIEW_RELIC + ' 10-success.action-response 16-success.action-response', function(e, data)
		{
			var d = data.response.data;
			
			self.element.data('relic-id', d.id);
			self._setupRelic(d);
			
			self.open();
		});
		
		// Capture (Only Undefended)
		$.subscribe('11-success.action-response', function(e, data)
		{
			if (data.response.response !== 0) 
			{	
				return;
			}
			
			var d = data.response.data;
			
			if (d.is_undefended) 
			{
				self.element.data('relic-id', d.id);
				self._setupRelic(d);
				
				self.open();
				
				return;
			}
			
			self.close();			
		});
	},
	
	_setupRelic: function(relic)
	{
		var cache = this._cache,
			isControlled = (relic.controlled_time > 0);
		
		var state = this._setDialogClass(relic);
		
		// Head
		cache.relicIcon.attr('src', RELIC_ICON_URL + relic.id + '.gif');
		cache.relicName.html(relic.name + ((relic.empower_level > 0) ? ' [Empowered]' : ''));
		
		// Bonuses
		cache.bonusTitle.html('Bonuses');
		var bonusHTML = this._buildBonusList(relic.stats);
		bonusHTML += this._buildBonusList(relic.enhancements);
		cache.bonusList.html(bonusHTML);
		
		// Defenders
		var numDefenders = relic.defenders.length;
		cache.defendersTitle.html('Defenders ('+numDefenders+')');
		cache.defendersList.html(this._buildDefendersList(relic.defenders));
		
		// Captured By
		cache.capturedBy.attr('class', 'capture-by' + ((isControlled)?'':' not-captured'));

		// Duration
		if (isControlled) // Uncontrolled
		{
			cache.capturedBy.removeClass('not-captured');
		}
		else
		{
			cache.capturedBy.addClass('not-captured');
		}
		
		var buttonText = '',
			captureDuration = HCS.utils.secondsToString(relic.controlled_time);
	
		cache.button.show();
		cache.costUpkeep.hide();
		cache.capturedBy.html(' ');
		
		
		switch (state)
		{
			case RELIC_STATES.UNCONTROLLED:
				buttonText = 'Capture';
				cache.captureDuration.html('');
				cache.capturedBy.html('Abandoned');
			break;
			
			case RELIC_STATES.CONTROLLED_ATT:
				cache.capturedBy.html('<a href="index.php?cmd=guild&subcmd=view&guild_id='+relic.controlled_by.guild_id+'"><span class="guild-icon" style="background-image:url(\''+ HCS.utils.getGuildImage(relic.controlled_by.guild_id, true) +'\')"></span>'+relic.controlled_by.guild_name+'</a>');
				buttonText = 'Attack';
				cache.costUpkeep.hide();
			break;
			
			case RELIC_STATES.CONTROLLED_DEF_NO_PERMISSION:
				buttonText = '';
				cache.button.hide();
			break;
			
			case RELIC_STATES.CONTROLLED_DEF:
				cache.costUpkeep.show().html('<span class="gold">' + relic.empower_cost + 'g</span> per hour per guild member.');
				buttonText = 'Empower';
			break;
			
			case RELIC_STATES.CONTROLLED_DEF_EMPOWERED:
				buttonText = 'Remove Empowerment';
			break;
		}
		
		cache.captureDuration.html(captureDuration);
		
		cache.button.html(buttonText);
	},
	
	_setDialogClass : function(relic)
	{
		var isOwner = relic.is_owner,
			hasPermission = relic.empower_permission,
			state = (relic.controlled_time < 0) ? RELIC_STATES.UNCONTROLLED : (
						(!isOwner) ? RELIC_STATES.CONTROLLED_ATT : (
							(!hasPermission)? RELIC_STATES.CONTROLLED_DEF_NO_PERMISSION : (
								(relic.empower_level > 0) ? RELIC_STATES.CONTROLLED_DEF_EMPOWERED : RELIC_STATES.CONTROLLED_DEF
							)
						)
					);

		this.element
			.data('relic-state', state)
			.removeClass(RELIC_STATES_ALL)
			.addClass(state);
				
		return state;
	},
	
	_buildBonusList: function(bonuses, fillEmpty)
	{
		var html = '',
			numBonuses = bonuses.length;
		
		for(var i = 0; i < numBonuses; i++)
		{
			var b = bonuses[i];
			html += '<li class="bonus"><span class="name">'+b.name+'</span> <span class="level">+'+b.value+((b.is_percent!=undefined && b.is_percent==1)?'%':'')+'</span></li>';
		}
		
		/*
		for (var i = Math.max(0, MIN_BONUSES - numBonuses); i--;) 
		{
			html += EMPTY_BONUS;
		}
		*/
		return html;
	},
	
	_buildDefendersList: function(defenders)
	{
		var html = '',
			numDefenders = defenders.length;
		
		// Populate
		for(var i = 0; i < numDefenders; i++)
		{
			var d = defenders[i];
			html += '<li class="defender"><span class="name"><a href="index.php?cmd=profile&player_id=' + d.player_id +'" class="defender-link" data-player-id="'+d.player_id+'">'+d.player_name+'</a></span> <span class="level">[ '+d.player_level+' ]</span></li>';
		}
		
		//var empty = EMPTY_DEFENDER;
		
		// Fill Blanks
		/*for (var i = Math.max(0, MIN_DEFENDERS - numDefenders); i--;) 
		{
			html += empty;
		}*/
		
		return html;
	},
	
	_cacheElements: function(){
		var thisEl = this.element;
		
		return {
			// .relic-icon
				relicIcon : $('.relic-icon', thisEl),
			
			// .relic-name
				relicName : $('.relic-name', thisEl),
			
			// .relic-help
				relicHelp : $('.relic-help', thisEl),
			
			// .defenders-title
				defendersTitle : $('.defenders-title', thisEl),
			
			// .defenders-list
				defendersList  : $('.defenders-list', thisEl),
							
			// .bonus-title
				bonusTitle : $('.bonus-title', thisEl),
			
			// .bonus-list
				bonusList : $('.bonus-list', thisEl),
			
			// .cost-upkeep
				costUpkeep : $('.cost-upkeep', thisEl),
			
			// .captured-by
				capturedBy : $('.capture-by', thisEl),
				
			// .capture-duration
				captureDuration : $('.capture-duration', thisEl),
				
			// .button
				button : $('.button', thisEl)
		};
		
	}
});
})(jQuery);(function($)
{
	var ACTION_VIEW_CREATURE = '1-success.action-response',
		CREATURE_URL = HCS.defines.fileserver + 'creatures/',
		MIN_ENHANCEMENTS = 4,
		EMPTY_ENHANCEMENT = '<li class="enhancement"></li>';
	
$.widget('hcs.worldDialogViewCreature', $.hcs.worldDialog, {
	options: {
		autoOpen: false,
		closeOnEscape: true,
		width: 500,
		resizable: false,
		title: 'View Creature',
		zIndex: 9999
	},
	
	_create: function()
	{
		// Call Super
		$.hcs.worldDialog.prototype._create.apply(this, arguments);
		
		// Cache Elements
		this._cache = this._cacheElements();
		
		// Delegate
		var self = this;
		
		this._delegate(this.element, '.yes', {
			click: function()
			{				
				GameData.doAction(2, FETCH_FLAGS.PLAYER_STATS + FETCH_FLAGS.PLAYER_BACKPACK_COUNT + FETCH_FLAGS.REALM_DYNAMIC + FETCH_FLAGS.PLAYER_EQUIPMENT, {
					id: $(this).data('creature-id'),
					passback: $(this).data('passback')
				}, 0);
				
				self.close();
				
				return false;
			}
		});
		
		// Subscribe to Events
		this._subscribe();
		
		// publish element ready
		$.publish('ready.hcs-element', this.widgetBaseClass);
	},
	
	_subscribe: function(){
		var self = this;
		
		$.subscribe(ACTION_VIEW_CREATURE, function(e, data)
		{
			if(data.response.response !== 0)
				return false;
			
			self._setupCreature(data.response.data, data.passback);
			
			self.open();
			
			$.publish('ready.view-creature');
		});
	},
	
	_setupCreature: function(creature, passback)
	{
		var cache = this._cache;
		
		//console.log('CREATURE', creature);
		
		// Name
		cache.name.html(creature.name);
		
		// Level
		cache.level.html(creature.level);
		
		// Classification
		cache.classification.html(creature.creature_class);
		
		// Portrait
		cache.portrait.css('background-image', 'url(\'' + CREATURE_URL + creature.image_id + '.jpg\')');

		// Health
		cache.healthmax.html(creature.hp);
		
		// Titan
		var titan = creature.titan;
		
		if (titan !== null) 
		{
			var percent = titan.current / titan.max * 100;
			// Set and show
			cache.healthtitan
				.html('<span class="health-titan-bar" style="width:'+percent+'%;margin-right:-'+percent+'%"></span>' + titan.current + '/' + titan.max)
				.show();
		}
		else 
		{
			// Hide
			cache.healthtitan.hide();
		}
		
		// Description
		cache.description.html(creature.description);
		
		// Enhancements
		var enhancements = creature.enhancements,
			enhHTML = '';
		
		if (enhancements == null) 
		{
			for (var i = MIN_ENHANCEMENTS; i--;) 
			{
				enhHTML += EMPTY_ENHANCEMENT;
			}
		}
		else
		{
			var length = enhancements.length;
					
			for (var i = 0; i < length; i++) 
			{
				enhHTML += '<li class="enhancement">'+enhancements[i].name+'<span class="enhancement-level">[ '+enhancements[i].value+' ]</span></li>';
			}
			
			for (var i = Math.max(0, MIN_ENHANCEMENTS - length); i--;) 
			{
				enhHTML += EMPTY_ENHANCEMENT;
			}
			
		}
		
		cache.enhancements.html(enhHTML);
				
		// Attribute Values
		$(cache.attributeAtk[1]).html(HCS.utils.formatNumber(creature.attack));
		$(cache.attributeArm[1]).html(HCS.utils.formatNumber(creature.armor));
		$(cache.attributeDmg[1]).html(HCS.utils.formatNumber(creature.damage));
		$(cache.attributeDef[1]).html(HCS.utils.formatNumber(creature.defense));

		cache.guide.html('View in the Fallen Sword Guide').attr('href', 'http://guide.fallensword.com/index.php?cmd=creatures&subcmd=view&creature_id=' + creature.base_id);
		cache.attack.html('Attack ' + creature.name).data({'passback': passback, 'creature-id': creature.id});
	},
	
	_cacheElements: function()
	{
		var thisEl = this.element;
		
		return {
			// .name
			name : $('.name:first', thisEl),
			
			// .info
			info : $('.info:first', thisEl),
				// .level
				level : $('.level:first', thisEl),
				// .classification
				classification : $('.classification:first', thisEl),
				
			// .portrait
			portrait : $('.portrait:first', thisEl),
				// .health-max
				healthmax   : $('.health-max:first', thisEl),
				// .health-titan
				healthtitan : $('.health-titan:first', thisEl),
			
			// .description
			description : $('.description:first', thisEl),
			
			// .enhancements
			enhancements : $('.enhancements:first', thisEl),
			
			// .attributes
			attributes : $('.attributes:first', thisEl),
				// .attribute-atk
				attributeAtk : $('.attribute-atk', thisEl),
				// .attribute-arm
				attributeArm : $('.attribute-arm', thisEl),
				// .attribute-dmg
				attributeDmg : $('.attribute-dmg', thisEl),
				// .attribute-def
				attributeDef : $('.attribute-def', thisEl),

			guide : $('.guide', thisEl),

			// .attack
			attack : $('.yes:first', thisEl)
		};
	}
});
})(jQuery);(function($){

var formatNumber = HCS.utils.formatNumber,
	fileserver = 'http://cdn.fallensword.com/';

$.widget('hcs.worldDialogCombat', $.hcs.worldDialog, {
	options: {
		avatarWidth	: 200,
		avatarHeight: 200,
		combatSpeed	: 0,
		autoOpen: false,
		closeOnEscape: true,
		width: 454,
		resizable: false,
		buttons: [
			{
				id: 'close-combat-viewer',
				text: 'Close Combat Viewer',
				click: function()
				{
					$(this).worldDialogCombat("close");
				}
			}
		],
		zIndex: 9999
	},

	_create: function()
	{
		$.hcs.worldDialog.prototype._create.apply(this, arguments);

		var self = this;

		var combatants = {el: $('.combatants', this.element) };

		combatants.attacker				= {el: $('.attacker', combatants.el) };
		combatants.attacker.name 		= $('.name'			, combatants.attacker.el);
		combatants.attacker.overlay		= $('.overlay'		, combatants.attacker.el);
		combatants.attacker.avatar 		= $('.avatar'		, combatants.attacker.el);
		combatants.attacker.healthbar 	= $('.healthbar'	, combatants.attacker.el);
		combatants.attacker.specials 	= $('.specials'		, combatants.attacker.el);

		combatants.defender				= {el: $('.defender', combatants.el) };
		combatants.defender.name 		= $('.name'			, combatants.defender.el);
		combatants.defender.overlay 	= $('.overlay'		, combatants.defender.el);
		combatants.defender.avatar 		= $('.avatar'		, combatants.defender.el);
		combatants.defender.healthbar 	= $('.healthbar'	, combatants.defender.el);
		combatants.defender.specials 	= $('.specials'		, combatants.defender.el);

		combatants.attacker.overlay.animate({'opacity': 0}, 0);
		combatants.defender.overlay.animate({'opacity': 0}, 0);

		var roundContianer = $('.round-container', this.element);

		roundContianer.css({height: '150px', 'overflow-x': 'hidden', 'overflow-y': 'auto'});

		var	rounds 	= $('.rounds', this.element),
			result 	= $('.result', this.element),
			loot 	= $('.loot'	 , this.element),
			notes 	= $('.note'	 , this.element);

		loot.bind('click', function(e){e.preventDefault();});

		this.subElements = {
			combatants	: combatants,
			roundCont 	: roundContianer,
			rounds		: rounds,
			result		: result,
			loot		: {el: loot, types: []},
			notes		: notes
		};

		var lootChildren = self.subElements.loot.el.children('div');

		this.subElements.loot.types = [$(lootChildren[0]), $(lootChildren[1]), $(lootChildren[2]), $(lootChildren[3])];

		this._subscribe();

		this.conflicts = [];

		this._delegate(this.element, '.discard', {
			click: function(e){
				var $eT = $(e.target);

				GameData.doAction(19, FETCH_FLAGS.PLAYER_BACKPACK_COUNT, {
					id: $eT.data('invid')
				}, 0);

				$eT.parent().fadeOut(200);

				return false;
			}
		});

		// publish element ready
			$.publish('ready.hcs-element', self.widgetBaseClass);
	},

	_onOpen: function()
	{
		var self = this;

		if(self.options.minimised)
			self.toggleMinimised();

		self.subElements.roundCont = $('.round-container', this.element);

		/*var jsp = this.subElements.roundCont.data('jsp');

		if(jsp)
			jsp.reinitialise();
		else
			self.subElements.roundCont.jScrollPane();*/

		if(this.subElements.roundCont.find('.round-container-shadow').length < 1)
			$('<div class="round-container-shadow"></div>').prependTo(self.subElements.roundCont.find('.jspContainer')).css({'width':16+'px', 'height':self.subElements.roundCont.height()+'px'});

		$.ui.dialog.prototype['_setOption'].apply(self, ['title', 'View Combat: ' + self.conflict.attacker.name + ' vs ' + self.conflict.defender.name]);

		$.publish('combat-start.combatDialog');
	},

	_onClose: function()
	{
		var jsp = this.subElements.roundCont.data('jsp');

		if(jsp !== undefined)
		{
			this.subElements.roundCont.find('.round-container-shadow').remove();
			jsp.destroy();
		}
	},

	_onBeforeMiniMode: function(){
		var self = this;

		if(self.options.minimised)
			self.restore();
	},

	_onAfterMiniMode: function()
	{
		var self = this;

		if(self.options.minimode)
			self.element.css('overflow', 'hidden').parent().css({
				'overflow': 'hidden',
				'width':'292px'
			});
		else
			self.element.parent().css({
				'width':'500px'
			});

		self.subElements.roundCont = $('.round-container', this.element);

		var jsp = this.subElements.roundCont.data('jsp');

		if(jsp)
			jsp.reinitialise();
		else
			self.subElements.roundCont.jScrollPane();

		var children = self.element.children(),
			w = 0;

		for (var i = children.length(); i--;) {
			w = Math.max(w, children[i].width());
		}

		self.element.width(w);

		$.ui.dialog.prototype._size.apply(self, arguments);
	},

	_subscribe: function()
	{
		var self = this;

		$.subscribe('2-success.action-response', function(e, data){
			if(data.response.response != 0){
				return $.publish('error.message', data.response.msg);
			}

			self.conflicts[data.passback] = data.response.data;

			if(quickCombatEnabled)
			{
				return false;
			}

			$.publish('view-combat.combatDialog', data.passback);
		});

		$.subscribe('view-combat.combatDialog', function(e, data){
			self.conflict = self.conflicts[data];

			if(!self.isOpen())
				self.open();
			else
				self._onOpen(e, {}, self);
		});

		$.subscribe('combat-start.combatDialog', function(e)
		{
			var data = self.conflict;

			self._renderCombatants(data);
			self._renderRounds(data);
			self._renderResult(data);
			self._renderLoot(data);

			self.subElements.roundCont.find('.jspVerticalBar').css('opacity', 0);

			if(self.options.combatSpeed == 0)
				return $.publish('combat-end.combatDialog');

			self.subElements.rounds.children().clearQueue();

			$.publish('combat-advance.combatDialog', {currentRound: 0, uid: data.uid});

			self.subElements.roundCont.addClass('inCombat');
		});

		$.subscribe('combat-advance.combatDialog', function(e, data)
		{
			var currentRound = data.currentRound;

			if(self.conflict.uid != data.uid)
				return;

			if(currentRound == self.conflict.combat.length)
				return $.publish('combat-end.combatDialog');

			var roundData = self.conflict.combat[currentRound];

			self._advanceLog(roundData, currentRound);
			self._advanceOverlay(roundData, currentRound);

			setTimeout(function(){
				data.currentRound++;
				$.publish('combat-advance.combatDialog', data);
			}, self.options.combatSpeed * 2);

		});

		$.subscribe('combat-end.combatDialog', function(e)
		{
			var $rounds = self.subElements.rounds;

			// unhide hidden rounds
			$rounds.children(':hidden').show();

			// set healthbars
			self._setHealthBar(self.subElements.combatants.attacker.healthbar, $rounds.find('.attacker-health:not(:empty):last').text(), self.conflict.attacker.hp, self.options.combatSpeed);
			self._setHealthBar(self.subElements.combatants.defender.healthbar, $rounds.find('.defender-health:not(:empty):last').text(), self.conflict.defender.hp, self.options.combatSpeed);

			// show scrollbar
			self.subElements.roundCont.find('.jspVerticalBar').animate({'opacity': 1}, self.options.combatSpeed);

			// show result
			self.subElements.result.children(':first').fadeIn();

			// show loot/output
			self.subElements.loot.el.parent().fadeIn();
		});
	},

	_advanceLog: function(combatRound, index)
	{
		var self = this;

		var $round = self.subElements.rounds.children(':eq('+(index)+')');

		$round.clearQueue().show().fadeIn(self.options.combatSpeed * 2);

		var attackerHealth = $round.find('.attacker-health:eq(0)').text();

		if(attackerHealth != '')
			self._setHealthBar(self.subElements.combatants.attacker.healthbar, attackerHealth, self.conflict.attacker.hp, self.options.combatSpeed);

		var defenderHealth = $round.find('.defender-health:eq(0)').text();

		if(defenderHealth != '')
			self._setHealthBar(self.subElements.combatants.defender.healthbar, defenderHealth, self.conflict.defender.hp, self.options.combatSpeed);

		var jsp = self.subElements.roundCont.data('jsp');

		if(jsp !== undefined)
		{
			jsp.reinitialise();
			jsp.scrollToBottom({duration: self.options.combatSpeed, queue: true});
		}
	},

	_advanceOverlay: function(combatRound, index)
	{
		var self = this,
			dmg = combatRound.damage || 0,
			overlay = ((index % 2) == 1) ? self.subElements.combatants.attacker.overlay : self.subElements.combatants.defender.overlay,
			overlayClass = 'overlay',
			overlayText = '';

		if(dmg > 0)
		{
			overlayClass += ' hit';
			overlayText = combatRound.damage;
		}
		else
		{
			overlayClass += ' missed';
			overlayText = '';
		}

		overlay
			.attr('class', overlayClass)
			.animate({opacity: .9}, self.options.combatSpeed * .7)
				.delay(self.options.combatSpeed * .6)
					.animate({opacity: 0}, self.options.combatSpeed * .7)
			.children(':first')
					.html(overlayText)
	},

	_combat: function(combatResponse)
	{
		var self = this;

		self._renderCombatants(combatResponse);
		self._renderRounds(combatResponse);

		self.open();
	},

	_renderCombatants: function(combatData)
	{
		var self = this;
		// attacker
		self._renderCombatant(self.subElements.combatants.attacker, combatData.attacker, combatData.specials[0], fileserver);
		self._setHealthBar(self.subElements.combatants.attacker.healthbar, combatData.attacker.hp, combatData.attacker.hp, 0);

		// defender
		self._renderCombatant(self.subElements.combatants.defender, combatData.defender, combatData.specials[1], 'http://cdn.fallensword.com/');
		self._setHealthBar(self.subElements.combatants.defender.healthbar, combatData.defender.hp, combatData.defender.hp, 0);
	},

	_renderCombatant: function(elements, combatantData, specials, fs)
	{
		elements.name.html(combatantData.name);
		elements.avatar.css('background-image', 'url('+ fs + combatantData.img_url+')');

		specials = specials || [];

		var numSpecials = specials.length,
			html = '';

		if(numSpecials > 0)
		{
			var globalSpecials = GameData.defines().combatGlobalSpecials;

			for(var i = 0; i < numSpecials; i++)
			{
				var s = specials[i];

				html += '<a class="special special-'+s.id+'" href="#" title="'+HCS.utils.sprintf(globalSpecials[s.id], s.params)+'"></a>';
			}
		}

		elements.specials.html(html);
	},

	_setHealthBar: function(element, current, max, duration)
	{
		var self = this;
		var percent = current / max;

		var w = element.children('.health:first').width() * percent;

		element
			.children('.health:first')
				.html(current + '/' + max)
			.end()
			.children('.bar:first')
				.css('background-color', self._healthPercentToColor(percent * 100, [-150,-150,-150]))
				.animate({'width': w}, {duration: duration * 2, queue: false, easing: 'easeInQuad'})
			.end()
				.children('.inner-bar:first')
					.animate({'width': w, 'backgroundColor': 'rgb('+self._healthPercentToColor(percent * 100, [-55,-55,-55])+')'}, {duration: (duration * .1), queue: false, easing: 'easeOutQuad'});
	},

	_healthPercentToColor: function(percent, modifier)
	{
		if(modifier === undefined)
			modifier = [0,0,0];

		var color = [0,0,0];

		if(percent < 50)
			color = [255, Math.floor((percent / 50) * 255), 0];
		else
			color = [Math.floor(((100 - percent) / 50) * 255), 255, 0];

		color = [
					Math.max(0,color[0]+modifier[0]),
					Math.max(0,color[1]+modifier[1]),
					Math.max(0,color[2]+modifier[2])
				];

		return 'rgb('+color.join(',')+')';
	},

	_renderRounds: function(combatData)
	{
		var self = this;

		var names = [combatData.attacker.name, combatData.defender.name];
		var attackerHP = combatData.attacker.hp, oldAttackerHP = -1;
		var defenderHP = combatData.defender.hp, oldDefenderHP = -1;

		var rounds   = combatData.combat;
		var noRounds = combatData.combat.length;
		var isEven, attacker, defender;

		var html = '';
		var define = GameData.defines();
		var combatEnhancements 	= GameData.defines().enhancements;
		var combatSpecials 		= GameData.defines().combatSpecials;

		for(var i = 0; i < noRounds; i++)
		{
			attacker = i % 2;
			defender = (i + 1) % 2;

			isEven = (attacker == 0);

			html += '<li class="round '+ ((isEven) ? 'attacker' : 'defender') + ((rounds[i].damage > 1) ? ' hit': '') + '">';

			// Enhancements
			var numEnh = rounds[i].enhancements.length,
				enhancements = '';

			if(numEnh > 0)
			{
				for(var e = 0; e < numEnh; e++)
				{
					var enhancement = rounds[i].enhancements[e];

					enhancements += '<span class="enhancement enhancement-'+enhancement+'" title="' + combatEnhancements[enhancement] + '"></span>';
				}
			}

			// Specials
			var numSpecials = rounds[i].specials.length,
				specials = '';

			for(var s = 0; s < numSpecials; s++)
			{
				var special = rounds[i].specials[s];

				specials += '<div class="special special-'+special.id+'">' + HCS.utils.sprintf(combatSpecials[special.id], special.params) + '</div>';
			}

			attackerHP = (isEven) ? attackerHP : rounds[i].hp;
			defenderHP = (!isEven) ? defenderHP : rounds[i].hp;

			html += '<span class="output"><span class="health attacker-health">' + attackerHP + '</span>'
				  + '<span class="health defender-health">'+ defenderHP +'</span><span class="message">'
				  + names[attacker]
				  + ((rounds[i].damage > 0) ? ' hits for '+rounds[i].damage+' damage.' : ' misses.')
				  + '</span>'
				  + ((attacker) ? enhancements  : '')
				  + ((defender) ? enhancements  : '')
				  + ((attacker) ? specials : '')
				  + ((defender) ? specials : '')
				  + '</span>';

			html += '</li>';

			oldAttackerHP = attackerHP;
			oldDefenderHP = defenderHP;
		}

		self.subElements.rounds.html(html);
	},

	_renderResult: function(combatData)
	{
		var html,
			resultClass;

		if(combatData.winner == 0) // attacker
		{
			html = 'Your group were victorious!';
			resultClass = 'win';
		}
		else if(combatData.winner == 1) // defender
		{
			html = 'Your group were defeated!';
			resultClass = 'lose';
		}
		else
		{
			html = 'Combat was unresolved.';
			resultClass = 'unresolved';
		}
		switch(combatData.type)
		{
			case 0: // PvE
				if(combatData.winner == 0) // attacker
				{
					html = 'You were victorious!';
					resultClass = 'win';
				}
				else if(combatData.winner == 1) // defender
				{
					html = 'You were defeated!';
					resultClass = 'lose';
				}
				else
				{
					html = 'Combat was unresolved.';
					resultClass = 'unresolved';
				}
			break;

			case 2: // GvE
				if(combatData.winner == 0) // attacker
				{
					html = 'Your group was victorious!';
					resultClass = 'win';
				}
				else if(combatData.winner == 1) // defender
				{
					html = 'Your group was defeated!';
					resultClass = 'lose';
				}
				else
				{
					html = 'Combat was unresolved.';
					resultClass = 'unresolved';
				}
			break;
		}

		this.subElements.result.children(':first').attr({'class': resultClass, style: 'display:none'}).html(html);
	},

	_renderLoot: function(combatData)
	{
		var self = this,
			el = self.subElements.loot.el,
			lootItem = this.element.find('.drop'),
			div;

		// hide loot panel children
		el.children().hide();

		// switch on combat type
		switch(combatData.type)
		{


			case 0: // Standard Combat
				div = self.subElements.loot.types[0];

				var labels  = {
					xp 		: div.find('dt.xp'),
					money 	: div.find('dt.money'),
					tax 	: div.find('dt.tax')
				};

				var values = {
					xp 		: div.find('dd.xp'),
					money 	: div.find('dd.money'),
					tax 	: div.find('dd.tax')
				};

				values.xp.html		(formatNumber(combatData.xp_gain));
				values.money.html	(formatNumber(combatData.gold_gain));
				values.tax.html		(formatNumber(combatData.guild_tax_gain));

				// loot item
				if(combatData.item.id < 0)
				{
					lootItem.hide();
				}
				else
				{
					lootItem
							.html('<a href="#" class="discard tip-static" data-tipped="Discard?" data-invid="'+combatData.inventory_id+'"></a>[ <span class="item-text rarity-'+combatData.item.rarity +
								  ' tip-dynamic" data-tipped="fetchitem.php?item_id='+combatData.item.id+'&inv_id=-1&t=2&p=-1&uid=-1&vcode='+combatData.item.vcode+'">' +
								  combatData.item.name+'</span> ]')
							.show();
				}

				// show
				div.show();

				// hide main contianer
				el.parent().hide();
			break;

			case 2: // Group vs Creature
				div = self.subElements.loot.types[1];

				var values = {
					xpleader: div.find('dd.xp-leader'),
					xprest	: div.find('dd.xp-rest'),
					money 	: div.find('dd.money')
				};

				values.xpleader.html	(formatNumber(combatData.xp_gain));
				values.xprest.html		(formatNumber(combatData.gold_gain));
				values.money.html		(formatNumber(combatData.guild_tax_gain));



				// loot item
				if(combatData.item.id < 0)
				{
					lootItem.hide();
				}
				else
				{
					lootItem
							.html('[ <span class="item-text rarity-'+combatData.item.rarity +
								  ' tip-dynamic" data-tipped="fetchitem.php?item_id='+combatData.item.id+'&inv_id=-1&t=2&p=-1&uid=-1&vcode='+combatData.item.vcode+'">' +
								  combatData.item.name+'</span> ]')
							.show();
				}

				// show
				div.show();

				// hide main contianer
				el.parent().hide();
			break;
		}
	}
});

})(jQuery);(function($){

$.widget('hcs.worldDialogPortal', $.hcs.worldDialog, {
	options: {
		width: 500,
		resizable: false,
		zIndex: 9999
	},
	
	_create: function()
	{	
		var self = this;
		
		$.hcs.worldDialog.prototype._create.apply(self, arguments);

		var portalCont 	= $('.portal-container', this.element),
			portalList 	= $('.portals', portalCont);
		
		//portalCont.css({height: '476px', width: '476px', 'overflow': 'hidden'});
		
		self.subElements = {
			portalCont: portalCont,
			portalList: portalList
		};
		
		self._bind();
		self._subscribe();
		
		// publish element ready
		$.publish('ready.hcs-element', self.widgetBaseClass);
	},
	
	_bind: function()
	{
		var self = this;

		this._delegate(this.element, '.portal', {
				click : function(e)
				{
					if(!self.portals)
						return;
						
					$.publish('prompt.worldDialogPortal', {portal: self.portal, destination: self.portals[$(this).index()]});
				}
			});
	},
	
	_subscribe: function()
	{
		var self = this;
		
		$.subscribe('7-success.action-response', function(e, data){
			self.portal = data.response.data.portal;
			self.portals = data.response.data.portals;
			
			self._renderPortalLocations(self.portals);
			
			if(self.isOpen())
				return self._onOpen();

			self.open();
			
			var portalId = data.response.data.portal,
				portalTitle = 'Portal';
			
			// Get portal name
			$.each(GameData.realm().fixed, function(i, v){
				if(v.type != 3 || v.id != portalId)
					return true;
				
				portalTitle = v.name;
				
				return false;
			});
			
			// Set Title
			$.ui.dialog.prototype['_setOption'].apply(self, ['title', portalTitle]);
		});
		
		$.subscribe('8-success.action-response', function(e, data){
			if(data.response.response != 0)
				return;
			
			self.close();
		});
	},
	
	_onOpen: function()
	{	
		this.subElements.portalCont = $('.portal-container', this.element);
		
		/*var jsp = this.subElements.portalCont.data('jsp');
		
		if(jsp)
			jsp.reinitialise();
		else
			this.subElements.portalCont.jScrollPane({animateScroll: true, mouseWheelSpeed: 200});
		*/
	},
	
	_onClose: function()
	{	
		/*var jsp = this.subElements.portalCont.data('jsp')
		
		if(jsp !== undefined)
			jsp.destroy();*/
	},
	
	_renderPortalLocations: function(portals)
	{
		var numPortals = portals.length;

		var html = '';
		
		for(var i = 0; i < numPortals; i++)
		{
			var portal = portals[i];
			
			html += '<li class="portal"><span class="level">'+portal.min_level+'</span><span class="name">'+portal.name+'</span><span class="cost">'+portal.cost+'</span>';
		}

		this.subElements.portalList.html(html);
	}
});

})(jQuery);(function($)
{
	var fetchItemType = 2,
		fetchFlags = HCS.world.defines.fetchFlags,
		fetchFlag = 511;
	
	var fileserver = 'http://cdn.fallensword.com/';
	
	$.widget('hcs.worldDialogPortalConfirm', $.hcs.worldDialog, {
		options: {
			modal: true,
			resizable: false,
			minHeight: 0,
			zIndex: 100000
		},
		
		_create: function()
		{
			$.hcs.worldDialog.prototype._create.apply(this, arguments);
			
			var self = this;
			
			self.portalData = {};
			
			var thisEl = this.element;
			
			// Sub Elements
			this.confirmText 	 = thisEl.find('.confirmText');

			self._delegate(self.element, '.cancel>.button', 
			{
				click: function()
				{
					$.publish('cancel.worldDialogPortalConfirm');
					
					self.close();
					
					return false;
				}
			});
			
			self._delegate(self.element, '.yes>.button', {
				click: function()
				{
					$.publish('confirm.worldDialogPortalConfirm');
					
					self.close();

					GameData.doAction(8, 511, {id:self.portalData.portal, t: self.portalData.destination.id}, 0);
					
					return false;
				}
			});
			
			$.subscribe('prompt.worldDialogPortal', function(e, data)
			{
				self.portalData = data;
				
				self.open();
			});
			
			$.ui.dialog.prototype['_setOption'].apply(self, ['title', 'Confirm Destination']);
			
			$.publish('ready.hcs-element', self.widgetBaseClass);
		},
		
		_onOpen: function()
		{
			var self = this;
			
			if (self.portalData === undefined) 
				return;
				
			var html =  '<span class="location">'+
							self.portalData.destination.name
						+'</span><span class="cost">'+
							HCS.utils.formatNumber(self.portalData.destination.cost) +
						'</span>';
			
			self.confirmText.html(html);
			
			// Prefetch Images of Master Realm
			var a = new Image();
			a.src = fileserver + 'masterrealms/'+self.portalData.destination.id+'.jpg';
			
			var b = new Image();
			b.src = fileserver + 'masterrealms/mini_'+self.portalData.destination.id+'.gif';
		}
	});
})(jQuery);
(function($){

var fetchItemType = 2;

$.widget('hcs.worldDialogShop', $.hcs.worldDialog, {
	options: {
			width: 500,
			resizable: false,
			title: 'Shop',
			zIndex: 9999
	},
	
	_create: function()
	{	
		var self = this;
		
		$.hcs.worldDialog.prototype._create.apply(this, arguments);
		
		var shopInventory		= $('.shopInventory:first', self.element),
			shopInventoryList	= $('.shopInventoryList:first', self.element);
			
		self.subElements = {
			shopInventory : shopInventory,
			shopInventoryList : shopInventoryList
		};

		self._subscribe();

		self._delegate(shopInventoryList, '.shopInventoryItem', {
			click: function(){
				var index = $(this).index();
				
				if(index < 0)
					return false;

				var shopItem = self.shop.items[index];
				
				$.publish('prompt.worldDialogShop', {id: self.shop.id, itemId: shopItem.id, price: shopItem.cost, vcode: shopItem.vcode, name: shopItem.name});
				
				return false;
			}
		});
		
		// publish element ready
		$.publish('ready.hcs-element', self.widgetBaseClass);
	},
	
	_onOpen: function()
	{	
		var self = this;
		
		$.publish('start.shopDialog');
		
		self.subElements.shopInventory = $('.shopInventory', this.element);

		/*var jsp = self.subElements.shopInventory.data('jsp');
		
		if(jsp)
			jsp.reinitialise();
		else
			self.subElements.shopInventory.jScrollPane();*/
			
			
			
		/*
		if(this.subElements.roundCont.find('.round-container-shadow').length < 1)
			$('<div class="round-container-shadow"></div>').prependTo(self.subElements.roundCont.find('.jspContainer')).css({'width':16+'px', 'height':self.subElements.roundCont.height()+'px'});
		*/
	},
	
	_onClose: function()
	{	
		var jsp = this.subElements.shopInventory.data('jsp');
		
		if(jsp !== undefined)
		{
			//this.subElements.shopInventory.find('.round-container-shadow').remove();
			jsp.destroy();
		}
	},

	_subscribe: function()
	{
		var self = this;
		
		$.subscribe('13-success.action-response', function(e, data){
			
			if(data.response.response != 0)
				return $.publish('error.message', data.response.msg);
			
			self.shop = data.response.data;
			if(!self.isOpen())
				self.open();
			else
				self._onOpen(e, {}, self);

			$.ui.dialog.prototype['_setOption'].apply(self, ['title', self.shop.name]);
			self._setOption('title', self.shop.name);
		});
		
		$.subscribe('start.shopDialog', function(e, data){
			self._createShop(self.shop.items);
		});
	},
	
	_createShop: function(shopInventory)
	{
		var self = this,
			html = '',
			numItems = shopInventory.length,
			playerId = GameData.player().id;
		
		for(var i = 0; i < numItems; i++)
			html += self._createItem(shopInventory[i], playerId);
		
		self.subElements.shopInventoryList.html(html);
	},
	
	_createItem: function(itemData, playerId)
	{
		var item_id = itemData.id,
			inv_id	= -1,
			t		= fetchItemType,
			vcode	= itemData.vcode,
			uid		= -1,
			targetPlayer = playerId;
		
		return '<li class="shopInventoryItem">'
             + '	 <a href="#" class="inventory-item-slot tip-dynamic" data-tipped="fetchitem.php?item_id='+item_id+'&inv_id='+inv_id+'&t='+fetchItemType+'&p='+targetPlayer+'&uid='+uid+'&vcode='+vcode+'""><span class="inventory-item inventory-item-size-2x3" style="background-image: url('+HCS.defines.fileserver+'/items/'+item_id+'.gif)"></span></a>'
             + '     <span class="price">'+HCS.utils.formatNumber(itemData.cost)+'<span class="moneyIcon tip-static" data-tipped="Gold"></span></span>'
             + '</li>';
	}
});

})(jQuery);(function($)
{
	var fetchItemType = 2,
		fetchFlags = HCS.world.defines.fetchFlags,
		fetchFlag = fetchFlags.playerStats + fetchFlags.playerBackpackCount;
	
	$.widget('hcs.worldDialogShopConfirm', $.hcs.worldDialog, {
		options: {
			modal: true,
			resizable: false,
			zIndex: 100000
		},
		
		_create: function()
		{
			$.hcs.worldDialog.prototype._create.apply(this, arguments);
			
			var self = this;
			
			this.shoppingData = {};
			
			// sub elements 
			this.confirmText 	= this.element.find('.confirmText');
			this.inventoryItem 	= this.element.find('.inventory-item-slot');
			this.cost			= this.element.find('.price');

			self._delegate(self.element, '.cancel>.button', 
			{
				click: function()
				{
					$.publish('cancel.worldDialogShopConfirm');
					
					self.close();
					
					return false;
				}
			});
			
			self._delegate(self.element, '.yes>.button',
			{
				click: function()
				{
					$.publish('confirm.worldDialogShopConfirm');
					
					self.close();
					
					GameData.doAction(14, fetchFlag, {id: self.shoppingData.id, item_id: self.shoppingData.itemId}, 0);
					
					return false;
				}
			});
			
			$.subscribe('prompt.worldDialogShop', function(e, data)
			{
				self.shoppingData = data;
				
				self.open();
			});
			
			$.ui.dialog.prototype['_setOption'].apply(self, ['title', 'Confirm Purchase']);
			
			$.publish('ready.hcs-element', self.widgetBaseClass);
		},
		
		_onOpen: function()
		{
			var self = this;
			
			if (self.shoppingData === undefined) 
				return;
			
			var item_id = self.shoppingData.itemId,
				inv_id	= -1,
				t		= 2,
				vcode	= self.shoppingData.vcode,
				uid		= -1,
				targetPlayer = -1;
			
			var html = self.shoppingData.name;
			
			self.confirmText.html(html);

			var invItem = 	'<span class="inventory-item inventory-item-size-2x3 tip-dynamic" ' +
							'data-tipped="'+'fetchitem.php?item_id='+item_id+'&inv_id='+inv_id+'&t='+fetchItemType+'&p='+targetPlayer+'&uid='+uid+'&vcode='+vcode+'" ' +
							'style="background-image:url(\''+HCS.defines.fileserver+'/items/'+item_id+'.gif\')"></span>';
			
			$(self.inventoryItem).html(invItem);
			
			self.cost.html(HCS.utils.formatNumber(self.shoppingData.price));
		}
	});
	
})(jQuery);
(function($)
{
	var openWindow = HCS.utils.openWindow,
		fetchFlags = HCS.world.defines.fetchFlags,
		repairFetchFlags = fetchFlags.playerStats;
	
	$.widget('hcs.worldQuickLinks', $.hcs.widget, {
		_create: function()
		{
			var self = this;
			self.backpackData = self.element.find('#backpackData');
			
			self._subscribe();
			self._bind();
			
			// publish element ready
			$.publish('ready.hcs-element', this.widgetBaseClass);
		},
	
		_subscribe: function()
		{
			var self = this;

			$.subscribe('backpack.player', function(e, data)
			{
				self.backpackData.html(data.b.current+'/'+data.b.max);
			});
		},
		
		_bind: function()
		{
			this._delegate(this.element, '.quickLinkIcon', {
				click: function(e)
				{
					var $t = $(this).parent();
					if($t.is('#quickLink-Backpack'))
					{
						$.error('Not yet implemented.');
					}
					else if($t.is('#quickLink-Map'))
					{
						openWindow('index.php?cmd=world&subcmd=map', 'fsMap', 650, 650, ',scrollbars,resizable')
					}
					else if($t.is('#quickLink-Repair'))
					{
						GameData.doAction(15, repairFetchFlags, {}, 0);
					}
				}
			});
		}
	});
}) (jQuery);(function($) {
	$.widget('hcs.worldRealmname', $.hcs.widget, {
        _create: function() {
            this._setText(GameData.realm().name);
			
			this._subscribe();
			
			// publish element ready
			$.publish('ready.hcs-element', this.widgetBaseClass);
        },
		
		_subscribe: function()
		{
			var self = this;
			
			$.subscribe('name.realm', function(e, data)
			{
				self._setText(data.b);
			});
		},
		
		_setText: function(text)
		{
			this.element.html(text);
		}
    });
})(jQuery);(function($) {
	var KEYS = HCS.defines.keys;

	$.widget('hcs.worldNavigator', $.hcs.widget, {
			options: {player: {}},

		_create: function()
		{
			var self = this;

			this.listening = false;

			this.options.controls = this.element.find('th');

			this.options.controls.click(function(e){self._controlClicked($(this));});

			this._subscribe();

			// publish element ready
			$.publish('ready.hcs-element', self.widgetBaseClass);
		},

		_subscribe: function()
		{
			var self = this;

			$.subscribe('move-attempt.player', function(e, data)
			{
				self.options.controls.addClass('disabled');
			});

			$.subscribe('move-success.player move-fail.player', function(e, data)
			{
				self.options.controls.removeClass('disabled');
			});

			$.subscribe('4-success.action-response', function(e, data)
			{
				if(data.response.response != 0)
					return $.publish('move-fail.player');

				$.publish('move-success.player');
			});

			$.subscribe('keydown.controls keyrepeat.controls', function(e, key)
			{
				var $dir;

				switch(key)
				{
					case KEYS.DIRECTION_N:
					case KEYS.DIRECTION_S:
						$dir = $('th'+(((key == KEYS.DIRECTION_N) ? '.n' : '.s') + ':not(.e,.w)'), self.element);
					break;

					case KEYS.DIRECTION_W:
					case KEYS.DIRECTION_E:
						$dir = $('th'+(((key == KEYS.DIRECTION_W) ? '.w' : '.e') + ':not(.n,.s)'), self.element);
					break;

					case KEYS.DIRECTION_NE:
					case KEYS.DIRECTION_NW:
						$dir = $('th.n'+(((key == KEYS.DIRECTION_NW) ? '.w' : '.e')), self.element);
					break;

					case KEYS.DIRECTION_SE:
					case KEYS.DIRECTION_SW:
						$dir = $('th.s'+(((key == KEYS.DIRECTION_SW) ? '.w' : '.e')), self.element);
					break;
				}

				if(!$dir)
					return;

				$dir.click();
			});
		},

		_controlClicked: function(control)
		{
			x = ((control.hasClass('e')) ? 1 : ((control.hasClass('w')) ? -1 : 0));
			y = ((control.hasClass('s')) ? 1 : ((control.hasClass('n')) ? -1 : 0));

			$.publish('move-attempt.player', {x:x, y:y});
		}
	});
})(jQuery);(function($)
{
	$.widget('hcs.worldRealm', $.hcs.widget, {
		_create: function() {
			var self = this;
			
			self.options.elementsReady = {
				//'hcs-worldRealmname':			false,
				//'hcs-worldCoord':				false,
				//'hcs-worldControls':			false,
				//'hcs-worldActionlist':		false,
				'hcs-worldDialogCombat':		false,
				'hcs-worldDialogPortal':		false,
				'hcs-worldDialogShop':			false,
				'hcs-worldDialogRelic':		 	false,
				'hcs-worldDialogRelicConfirm':	false,
				'hcs-worldDialogRelicAbout':	false,
				'hcs-worldDialogShopConfirm': 	false,
				'hcs-worldDialogPortalConfirm': false,
				'hcs-worldDialogViewCreature': 	false
				//'hcs-worldBuffList': 			false,
				//'hcs-worldQuickLinks': 		false
			};
			
			$.hcs.worldDialog.prototype.options.appendTo = self.options.worldPage;
			
			$.subscribe('ready.hcs-element', function(e, data)
			{
				self.options.elementsReady[data] = true;
				
				var ready = true;
				
				$.each(self.options.elementsReady, function(i, v)
				{
					if(v)
						return true;
						
					ready = false;
				});
						
				if(!ready)
					return;
				
				$.publish('ready.'+self.widgetBaseClass);
			});
			
			var worldControls 			= $('#worldPage')				.worldControls(),
				worldRealmname 			= $('#worldName')				.worldRealmname(),
				worldCoord 				= $('#worldCoord')				.worldCoord(),
				worldActionlist 		= $('#actionList')				.worldActionlist(),
				worldBuffList 			= $('#buffList')				.worldBuffList(),
				worldQuickLinks			= $('#quickLinksContainer')		.worldQuickLinks(),
				worldCrate				= $('#crate')					.worldCrate();
			
			setTimeout(function(){
				var worldCrate				= $('#crate')					.worldCrate(),
				 	worldDialogViewCreature	= $('#dialog-viewcreature')		.worldDialogViewCreature(),
					worldDialogCombat 		= $('#combatDialog')			.worldDialogCombat(),
					worldDialogPortal 		= $('#portalDialog')			.worldDialogPortal(),
					worldDialogRelicConfirm	= $('#dialog-relic-confirm')	.worldDialogRelicConfirm(),
					worldDialogRelicAbout 	= $('#dialog-relic-about')		.worldDialogRelicAbout(),
					worldDialogRelic 		= $('#dialog-relic')			.worldDialogRelic(),
					worldDialogPortalConfirm= $('#portalDialogConfirm')		.worldDialogPortalConfirm(),
					worldDialogShop 		= $('#shopDialog')				.worldDialogShop(),
					worldDialogShopConfirm  = $('#shopDialogConfirm')		.worldDialogShopConfirm();
			}, 1000);

			$.subscribe('masterRealm.stats-player', function(e, data){
				if(data.b)
					return self.element.hide();
				
				self.element.show();
			})
		},
		
		_elementsReady: function(){
			var ready = true;

			$.each(this.options.elementsReady, function(i, v){ if(v) return true; ready = false} );
			
			return ready;
		}
	});
})(jQuery);(function($)
{
	$.widget('hcs.worldManager', $.hcs.widget, {
		_create: function() {
			this.options.elementsReady = {
				'hcs-worldRealm' : false,
				'hcs-worldMasterRealm' : false
			};
			
			var progressDialog = $('#progressDialog').dialog({autoOpen: false, modal: true, title: 'Working...'}),
				progressBar    = $('#progressDialogBar').progressbar({value: 0});
			
			this._subscribe();
			
			$('#worldDialogs').appendTo('body');
			
			$('#dialog-settings').worldDialogSettings();
			$('#masterRealmContainer').worldMasterRealm({worldPage: this.element, progressDialog: progressDialog, progressBar: progressBar});
			$('#realmContainer').worldRealm({worldPage: this.element, progressDialog: progressDialog, progressBar: progressBar});		
			$('#messageCenter').worldMessageCenter();
			$('#notifications').notifications();

		},
		
		_subscribe: function() {
			var self = this;
			
			$.subscribe('ready.hcs-worldRealm ready.hcs-worldMasterRealm', function(e, data){
				self.options.elementsReady[e.namespace] = true;
				
				var ready = true;
				
				$.each(self.options.elementsReady, function(i, v)
				{
					if(v)
						return true;
						
					ready = false;
				});
						
				if(!ready)
					return;
				
				$.publish('ready.worldManager');
			});
		},
		
		_elementsReady: function(){
			var ready = true;
	
			$.each(this.options.elementsReady, function(i, v){ if(v) return true; ready = false});
			
			return ready;
		}
	});
})(jQuery);$(function() {

		var fetchFlags = HCS.world.defines.fetchFlags;

		setTimeout(function(){
			GameData.process(initialGameData);
			$('#statbar-container').topBar({initialPlayer:initialGameData.player, initialTime: initialGameData.time});
		}, 100);

		$('#worldPage').worldManager();

		$('#worldHelpOverlay').click(function(){ $(this).fadeOut(100); });
		$('#help-button')
			.click(function(e){
				var $help = $('#worldHelpOverlay');
				e.preventDefault();
				if ($help.css('display') == 'none')
				{
					$help.fadeIn(100);
				}
				else
				{
					$help.fadeOut(100);
				}
			});

});})($, jQuery, window);
