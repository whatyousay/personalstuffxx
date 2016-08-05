(function($){
	$.widget('hcs.controls', {
		options: {
			keys: {
				DIR_N		 : [87, 38],
				DIR_S		 : [88, 40],
				DIR_W		 : [65, 37],
				DIR_E		 : [68, 39],

				DIR_NW		 : [81],
				DIR_NE		 : [69],

				DIR_SW		 : [90],
				DIR_SE		 : [67],

				// Action Numbers
				ACT_NO_1	 : [49, 97],
				ACT_NO_2	 : [50, 98],
				ACT_NO_3	 : [51, 99],
				ACT_NO_4	 : [52, 100],
				ACT_NO_5	 : [53, 101],
				ACT_NO_6	 : [54, 102],
				ACT_NO_7	 : [55, 103],
				ACT_NO_8	 : [56, 104],

				// Misc Actions
				ACT_RELOAD 			: [48, 96, 192],
				ACT_TELEPORT        : [84, 46, 110, 190],
				ACT_REPAIR	  		: [82, 114],
				ACT_USE		  		: [70],
				ACT_STOP	  		: [83], // Only Used on Alpha
				ACT_CREATE_GROUP	: [71],
				ACT_SHOW_BACKPACK	: [66, 98],
				ACT_SHOW_MAP		: [77], // Will be removed
				ACT_SHOW_QUICKBUFF	: [86]
			}
		},

		_create: function()
		{
			var self = this;

			this.keys = this.options.keys;
			this.down = [];
			this.repeating = false;

			var keys = this.keys,
				down = this.down;

			$(document).bind('keydown', function(e)
			{
				var $t = $(e.target);

				if($t.is(':input'))
				{
					return true;
				}

				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
					return;
				}

				var code = e.which;

				$.each(keys, function(i, v)
				{
					var index = $.inArray(code, v);

					if (index < 0) return true;
					if (index > 0) e.preventDefault();

					if (down[v[index]])
					{
						$.publish('keyrepeat.controls', i);
						return true;
					}

					down[v[index]] = true;

					$.publish('keydown.controls', i);

					return false;
				});

				if(!self.repeating)
					self._startTimer();
			});

			$(document).bind('keyup', function(e)
			{
				var $t = $(e.target);

				if($t.is(':input'))
				{
					return true;
				}

				var code = e.which;

				$.each(keys, function(i, v)
				{
					var index = $.inArray(code, v);

					if (index < 0) return true;

					if (!down[v[index]]) return true;

					down[v[index]] = false;

					$.publish('keyup.controls', i);
					$.publish('keypress.controls', i);

					return false;
				});

				var keysDown = false;

				$.each(down, function(i,v)
				{
					if(!v)
						return true;

					keysDown = true;

					return false;
				});

				if(keysDown)
					return;

				self.repeating = false;
			});

			/*
			 * $(document).bind('keydown keyup keypress', function(e){
			 * //console.log(e.type, e.keyCode ? e.keyCode : e.which); });
			 *
			 * $.subscribe('keydown.worldControls', function(e, data){
			 * //console.log(e.type, data); })
			 *
			 * $.subscribe('keyup.worldControls', function(e, data){
			 * //console.log(e.type, data); })
			 *
			 * $.subscribe('keydown.worldControls', function(e, data){
			 * setTimeout(function(){ self._handleKey(data); }, 0); })
			 *
			 * $.subscribe('keyrepeat.worldControls', function(e, data){
			 * setTimeout(function(){ self._handleKey(data); }, 0); })
			 */

			this._startTimer();

			// publish element ready
			$.publish('ready.hcs-element', self.widgetBaseClass);
		},

		_startTimer: function()
		{
			return;

			var self	= this,
				start 	= new Date().getTime(),
				time 	= 0,
				speed 	= 1000/10,
				keys 	= this.options.keys,
				down 	= this.down;

			function instance()
			{
				time += speed;

				$.each(keys, function(i, v)
				{
					var index = -1;

					$.each(down, function(j, x)
					{
						if(!x)
							return;

						index = $.inArray(j, v);
					});

					if (index < 0) return true;

					$.publish('keyrepeat.controls', i);
				});

				var diff = (new Date().getTime() - start) - time;

				if(!self.repeating)
					return;

				window.setTimeout(instance, Math.max(1, (speed - diff)));
			}

			self.repeating = true;

			window.setTimeout(instance, speed);
		}
	});
});
