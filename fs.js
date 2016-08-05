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
				ACT_TELEPORT        		: [84, 46, 110, 190],
				ACT_REPAIR	  		: [82, 114],
				ACT_USE		  		: [70],
				ACT_STOP	  		: [83], // Only Used on Alpha
				ACT_CREATE_GROUP	: [71],
				ACT_SHOW_BACKPACK	: [66, 98],
				ACT_SHOW_MAP		: [77], // Will be removed
				ACT_SHOW_QUICKBUFF	: [86]
			}
		},

	});
});
