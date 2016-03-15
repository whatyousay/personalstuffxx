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
				ACT_TELEPORT        : [84, 46, 110],
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
})(jQuery);var hcsLibsLoaded = true;

// Safe Console
if(false || window.console === undefined)
{
	window.console =
	{
		assert: function(){},
		count: function(){},
		debug: function(){},
		dir: function(){},
		dirxml: function(){},
		error: function(){},
		group: function(){},
		groupCollapsed: function(){},
		groupEnd: function(){},
		info: function(){},
		log: function(){},
		markTimeline: function(){},
		profile: function(){},
		profileEnd: function(){},
		time: function(){},
		timeEnd: function(){},
		trace: function(){},
		warn: function(){}
	};
}

var quickMsgDialog, quickMsgTip;

$(function() {
	quickMsgTip = $(".validateTips");
	quickMsgDialog = $("#quickMessageDialog");

	quickMsgDialog.dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {

			'Send Message': function()
			{
				$("#quickMsgDialog_msg").attr("disabled", "disabled");

				var targetPlayer = $("#quickMsgDialog_targetUsername").html();
				var message = $("#quickMsgDialog_msg").val();

				$.get("index.php", { cmd: "message", subcmd: "send", target_player: targetPlayer, msg: message, ajax: "1", xc: ajaxXC }, function(data)
				{
					var result = data.split("|");
					if(result[0]==0)
						quickMsgDialog.dialog("close");
					else
					{
						$("#quickMsgDialog_msg").removeAttr("disabled");
						updateTip(result[1]);
					}
				});
			},
			'Cancel': function()
			{
				$(this).dialog("close");
			}
		}
	});

	$('#dialog_msg').dialog({
							autoOpen: false,
							modal: true,
							title: 'Info',
							buttons:
							{
								'Ok': function()
								{
									$(this).dialog('close');
								}
							}
							});
});

function updateTip(t)
{
	quickMsgTip.text(t).addClass("ui-state-highlight");

	setTimeout(function()
	{
		quickMsgTip.removeClass("ui-state-highlight", 3000);
	}, 500);
}

function openQuickMsgDialog(targetUsername)
{
	$(function() {
		$("#quickMsgDialog_targetUsername").html(targetUsername);
		$("#quickMsgDialog_targetPlayer").val(targetUsername);
		$("#quickMsgDialog_msg").val("");
		$("#quickMsgDialog_msg").removeAttr("disabled");
		quickMsgTip.text("Please enter a message before clicking 'Send'.");

		quickMsgDialog.dialog("open");
	});
}

function openNoStaminaDialog()
{
	// check if the div exists
	if(!$('#dialog_noStamina').length)
	{
		// create the div
		$('body').append('<div id="dialog_noStamina"></div>');
	}

	$content = "<img src='http://cdn.fallensword.com/media/dist/img/pages/tired_knight.png' alt='Tired Knight' style='float: right'>You have run out of stamina!<br><br><strong>You gain stamina every hour</strong>, however you can <a href='index.php?cmd=points&subcmd=reserve'>transfer stamina</a> from your reserve (if you have any) or you can get +25 current stamina on the <a href='index.php?cmd=points'>Character Upgrades page</a>.";
	$('#dialog_noStamina').html($content);


	// show the dialog
	$('#dialog_noStamina').dialog({
		modal: true,
		title: 'Out of stamina!',
		buttons:
		{
			'Upgrade': function()
			{
				window.location.href = "index.php?cmd=points";
			}
		},
		zIndex: 9999
	});
}

function reportFSBox()
{
	$('#dialog_reportFSBox').dialog({
								modal: true,
								title: 'FSBox Reporting',
								buttons:
								{
									'Send Report': function()
									{
										$self = $(this);

										$.ajax({
											url: "index.php",
											success: function(data)
											{
												if(data.result==0)
												{
													$('#fsBoxMessage').html("[ Message Reported ]");
													$self.dialog('close');
													$('#dialog_msg').html('FSBox message reported successfully!');
													$('#dialog_msg').dialog('open');
												}
												else
												{
													$('#dialog_msg').html(data.msg);
													$('#dialog_msg').dialog('open');
												}
											},
											error: function(data)
											{
												$(this).dialog('close');
												$('#dialog_msg').html('FSBox message reporting failed, please try again.');
												$('#dialog_msg').dialog('open');
											},
											data:
											{
												"cmd": "news",
												"subcmd": "reportfsbox",
												"reason": $('#reportFSBox_reason').val(),
												"id": $('#reportFSBox_id').val()
											},
											dataType: "json"
										});
									},
									'Cancel': function()
									{
										$(this).dialog('close');
									}
								}});
}

// <namespace>
(function() {
	var namespace=function(c,f,b){var e=c.split(f||"."),g=b||window,d,a;for(d=0,a=e.length;d<a;d++){g=g[e[d]]=g[e[d]]||{};}return g;};

	namespace('HCS').namespace = 'HCS';

	// <utils>
		var NS_UTILS = HCS.namespace+'.utils';

		namespace(NS_UTILS).namespace = namespace;

		namespace(NS_UTILS).sprintf = function(format, data){
			for(var i = data.length + 1; i--;)
				format = format.replace(new RegExp('%'+i, 'ig'), data[i - 1]);

			return format;
		};

		namespace(NS_UTILS).formatNumber = function(nStr){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}

		// Hoofy's XML Stuff

		var xmlobj = new Array();

		namespace(NS_UTILS).getXMLHttpRequestObj = function()
		{
			if(window.XMLHttpRequest)
				return new XMLHttpRequest();
			else if(window.ActiveXObject)
				return new ActiveXObject("Microsoft.XMLHTTP");
			return null;
		}

		namespace(NS_UTILS).parseXML = function(text)
		{
			if (window.DOMParser)
			{
				var parser = new DOMParser();
				return parser.parseFromString(text, "text/xml");
			}

			var xmlTemp = new ActiveXObject("Microsoft.XMLDOM");
			xmlTemp.async="false";
			xmlTemp.loadXML(text);
			return xmlTemp;
		}

		namespace(NS_UTILS).sendRequest = function(doc, index, finalStr)
		{
			// check for existing requests
			var isNonIE = !(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion >= "4.0");
			try
			{
				// instantiate object for Mozilla, Nestcape, etc.
				xmlobj[index]=new XMLHttpRequest();
			}
			catch(e1)
			{
				try
				{
					// instantiate object for Internet Explorer
					xmlobj[index]=new ActiveXObject('Msxml2.XMLHTTP');
				}
				catch(e2)
				{
					try
					{
						xmlobj[index]=new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch (e3)
					{
						// Ajax is not supported by the browser
						xmlobj[index]=null;
						return false;
					}
				}
			}

			// set response handler
			if(isNonIE)
			{
				xmlobj[index].onreadystatechange = function()
				{
					if (xmlobj[index].readyState == 4)
					{
						if (xmlobj[index].status == 200)
						{
							savedItemData[index] = xmlobj[index].responseText+finalStr;
							Tip(savedItemData[index]);
							}
					}
				}
			}

		   // open socket connection
			xmlobj[index].open('GET',doc,isNonIE);
			// send GET request
			xmlobj[index].send(null);
		}

		namespace(NS_UTILS).openWindow = function(url, name, w, h, features)
		{
			var left = (screen.availWidth - w) / 2,
				top  = (screen.availHeight - h) / 2

			window.open(url, name, "width="+w+", height="+h+", left="+left+", top="+top+features);
		};

		namespace(NS_UTILS).secondsToString = function(seconds)
		{
			var d = Math.floor(seconds / 86400),
				h = Math.floor((seconds % 86400) / 3600),
				m = Math.floor(((seconds % 86400) % 3600) / 60),
				s = ((seconds % 86400) % 3600) % 60;

			return (
					((d > 0) ? d + 'd ' : '') +
					((h > 0) ? h + 'h ' : '') +
					((m > 0) ? m + 'm ' : '') +
					((s > 0) ? s + 's ' : '')
				   );
		};

		namespace(NS_UTILS).getGuildImage = function(guildId, mini)
		{
			return 'http://cdn.fallensword.com/guilds/' + guildId + ((mini)?'_mini':'') + '.jpg';
		};
	// </utils>

	// <defines>
		var NS_DEFINES = HCS.namespace+'.defines';

		// <fileserver>
			namespace(NS_DEFINES).fileserver = 'http://cdn.fallensword.com/';
		// </fileserver>

		// <keys>
			namespace(NS_DEFINES).keys = {
				DIRECTION_N  : 'DIR_N',
				DIRECTION_S  : 'DIR_S',
				DIRECTION_W  : 'DIR_W',
				DIRECTION_E  : 'DIR_E',
				DIRECTION_NE : 'DIR_NE',
				DIRECTION_NW : 'DIR_NW',
				DIRECTION_SE : 'DIR_SE',
				DIRECTION_SW : 'DIR_SW',

				ACTION_NO_1  : 'ACT_NO_1',
				ACTION_NO_2  : 'ACT_NO_2',
				ACTION_NO_3  : 'ACT_NO_3',
				ACTION_NO_4  : 'ACT_NO_4',
				ACTION_NO_5  : 'ACT_NO_5',
				ACTION_NO_6  : 'ACT_NO_6',
				ACTION_NO_7  : 'ACT_NO_7',
				ACTION_NO_8  : 'ACT_NO_8',
				ACTION_NO_9  : 'ACT_NO_9',

				RELOAD    : 'ACT_RELOAD',
				TELEPORT  : 'ACT_TELEPORT',

				STOP	: 'ACT_STOP',
				USE		: 'ACT_USE',
				REPAIR 	: 'ACT_REPAIR',
				GROUP	: 'ACT_CREATE_GROUP',
				BACKPACK: 'ACT_SHOW_BACKPACK',
				MAP		: 'ACT_SHOW_MAP',
				QUICKBUFF: 'ACT_SHOW_QUICKBUFF',
			};
		// </keys>

		// <ui>
			var NS_DEFINES_UI = NS_DEFINES + '.ui';
			namespace(NS_DEFINES_UI).states = {
				hover 		: 'hcs-state-hover',
				focus 		: 'hcs-state-focus',
				active 		: 'hcs-state-active',
				disabled 	: 'hcs-state-disabled',
				help		: 'hcs-state-help'
			};
		// </ui>
	// </defines>

	// <modules>
		var NS_MODULES = HCS.namespace+'.modules';
		// <quickbuff>
			namespace(NS_MODULES).quickbuff = {
				open: function(playerId){
					openWindow('index.php?cmd=quickbuff&tid='+playerId, 'fsQuickBuff', 618, 500, ',scrollbars');
				}
			};
		// </quickbuff>

		// <combatsetmanagemet>
		namespace(NS_MODULES).combatSetManagment = {
			toggle: function()
			{
				var combatSetDiv = document.getElementById("profileCombatSetDiv");
				if(combatSetDiv.style.display=="none")
					combatSetDiv.style.display = "block";
				else
					combatSetDiv.style.display = "none";
			}
		}
		// </combatsetmanagemet>

		// <reportdiv>
		namespace(NS_MODULES).report = {
			open: function()
			{
				document.getElementById("reportDiv").style.display = 'block';
			}
		}
		// </reportdiv>

		// <reportdiv>
		namespace(NS_MODULES).bioReport = {
			open: function()
			{
				document.getElementById("bioReportDiv").style.display = 'block';
			}
		}
		// </reportdiv>



	// </modules>

	// <detection>
		var NS_DEFINES_DETECTION = HCS.namespace+'.detection';

		namespace(NS_DEFINES_DETECTION).ie6 = false;
	// </detection>

})();
// </namespace>

(function($) {
	// Construct Publish/Subscribe/Unsubscribe
	var o = $({});$.each({'subscribe':'bind','unsubscribe':'unbind','publish':'trigger'},function(fn,api){$[fn]=function(){o[api].apply(o,arguments)}});

	/*function getSubscribers()
	{
		return o.data('events');
	}

	function logPublishEvents()
	{
		var eventList = getSubscribers();
		var events = "";
		$.each(eventList, function(i,v)
		{
			events += v[0].type+'.'+v[0].namespace+' ';

		});

		$.subscribe(events, function(e, data)
		{
			console.log(e.type + ' ' + e.namespace); // + '" (', e, ') a: <', data.a, '> b: <', data.b, '>');//, e, 'a', data.a, 'b', data.b);
		});
	}


	HCS.utils.namespace('HCS.utils').getSubscribers = getSubscribers;
	HCS.utils.namespace('HCS.utils').logPublishEvents = logPublishEvents;
	*/

	// <controls>
	HCS.utils.namespace('HCS.modules').controls = $(document).controls();
	// </controls>
})(jQuery);

function openWindow(url, name, w, h, features){return HCS.utils.openWindow(url, name, w, h, features)}

function getXMLHttpRequestObj(){return HCS.utils.getXMLHttpRequestObj() }

function parseXML(text){return HCS.utils.parseXML(text)}

function sendRequest(doc, index, finalStr){return HCS.utils.sendRequest(doc, index, finalStr);}

function fetchGuildChat(){return HCS.modules.guildchat.fetch()}

function sendGuildChat(u){return HCS.modules.guildchat.send(u)}

function quickBuff(playerId){return HCS.modules.quickbuff.open(playerId)}

function toggleCombatSetManagement(){return HCS.modules.combatSetManagment.toggle()}

function openReportDiv(){return HCS.modules.report.open()}

function openBioReportDiv(){return HCS.modules.bioReport.open()}

function purchaseStarterPack(playerId, playerUsername, playerEmail, st, pbc)
{
	var $starterPackDiv = $('#starter-pack');
	var html = '<a id="starter-pack-purchase" class="awesome orange" href="#" style="width: 250px; margin-bottom: 10px;">Purchase for $10 (Best Value!)</a>';

	html += '<form id="starter-pack-points-form" action="index.php" method="post"><input type="hidden" name="cmd" value="points"><input type="hidden" name="subcmd" value="doupgrade"><input type="hidden" name="xc" value="'+$('#g_xc').val()+'"><input type="hidden" name="quantity" value="1"><input type="hidden" name="upgrade_id" value="27"></form>';
	html += '<a id="starter-pack-points" class="awesome orange" href="#" style="width: 250px; margin-bottom: 10px;">Purchase for 75 FSP</a>';
	html += '<a id="starter-pack-no-thanks" class="awesome yellow" href="#" style="width: 250px;">Cancel</a>';
	$starterPackDiv.html(html);
	$starterPackDiv.dialog({
		title: 'Purchase Starter Pack',
		width: 275,
		resizable: false,
		modal: true
	});

	$('#starter-pack-no-thanks').live('click', function()
	{
		$starterPackDiv.dialog('close');
	});

	$('#starter-pack-purchase').live('click', function()
	{
		window.location = 'https://www.huntedcow.com/shop/item/fallen-sword-starter-pack?quantity=1&clear_cart=true&redirect_checkout=true';
	});

	$('#starter-pack-points').live('click', function()
	{
		// make purchase
		$('#starter-pack-points-form').submit();
		return false;
	});

	$('#starter-pack-back').live('click', function()
	{
		// make purchase
		purchaseStarterPack(playerId, playerUsername, playerEmail, st, pbc);
		return false;
	});
}

function purchaseChampionsPack(playerId, playerUsername, playerEmail, st, pbc)
{
	var $championPackDiv = $('#champions-pack');
	var html = '<a id="champion-pack-purchase" class="awesome orange" href="#" style="width: 250px; margin-bottom: 10px;">Purchase for $40 (Best Value!)</a>';

	html += '<form id="champion-pack-points-form" action="index.php" method="post">';
	html += '<input type="hidden" name="cmd" value="points">';
	html += '<input type="hidden" name="subcmd" value="doupgrade">';
	html += '<input type="hidden" name="xc" value="'+$('#g_xc').val()+'">';
	html += '<input type="hidden" name="quantity" value="1">';
	html += '<input type="hidden" name="upgrade_id" value="29">';
	html += '</form>';
	html += '<a id="champion-pack-points" class="awesome orange" href="#" style="width: 250px; margin-bottom: 10px;">Purchase for 350 FSP</a>';
	html += '<a id="champion-pack-no-thanks" class="awesome yellow" href="#" style="width: 250px;">Cancel</a>';
	$championPackDiv.html(html);
	$championPackDiv.dialog({
		title: 'Purchase Champion Pack',
		width: 275,
		resizable: false,
		modal: true
	});

	$('#champion-pack-no-thanks').live('click', function()
	{
		$championPackDiv.dialog('close');
	});

	$('#champion-pack-purchase').live('click', function()
	{
		window.location = 'https://www.huntedcow.com/shop/item/fallen-sword-champions-pack?quantity=1&clear_cart=true&redirect_checkout=true';
	});

	$('#champion-pack-points').live('click', function()
	{
		// make purchase
		$('#champion-pack-points-form').submit();
		return false;
	});

	$('#champion-pack-back').live('click', function()
	{
		// make purchase
		purchaseChampionsPack(playerId, playerUsername, playerEmail, st, pbc);
		return false;
	});
}


//New Stuffs that does the page thingy
function loadPage(data)
{
	$.ajax({
		url: "index.php",
		type: "post",
		data: data,
		success: function(data)
		{
			$('#pCC').html(data['tpl']);
		},
		dataType: "json"
	});
	return false;
}

function submitForm(id, data, formId, success)
{
	$('#pCC').on('click', id, function(e)
	{
		var $d = $(formId+' :input');
		$d.each(function()
		{
			data[this.name] = $(this).val();
		});

		$.ajax({
			url: "index.php",
			type: "post",
			data: data,
			success: function(d)
			{
				if(d["response"]["response"]!=0)
				{
					var t = "Error",
						m = d["response"]["msg"];
					$('#dialog_msg')
						.html(m)
						.dialog('option', {'title': t})
						.dialog('open');
				}
				else
				{

					success(d);
				}
			},
			dataType: "json"
		});
	});
}

function drawPercentBar(width, percent, color, background)
{
	var pixels = width * (percent / 100);
	if (!background) { background = "none"; }

	document.write("<div style=\"position: relative; line-height: 1em; background-color: "
		+ background + "; border: 1px solid black; width: "
		+ width + "px\">");
	document.write("<div style=\"height: 1.5em; width: " + pixels + "px; background-color: "
		+ color + ";\"></div>");
	document.write("<div style=\"position: absolute; text-align: center; padding-top: .25em; width: "
		+ width + "px; top: 0; left: 0\">" + percent + "%</div>");
	document.write("</div>");
}HCS.DEFINES = {};

HCS.DEFINES.ITEM_RARITY = {
	COMMON: 		0,
	RARE: 			1,
	UNIQUE: 		2,
	LEGENDARY: 		3,
	SUPERELITE: 	4,
	CRYSTALLINE: 	5,
	EPIC: 			6
};

HCS.DEFINES.ITEM_TYPE = {
	HELMET: 		0,
	ARMOR:			1,
	GLOVES:			2,
	BOOTS:			3,
	WEAPON:			4,
	SHIELD:			5,
	RING:			6,
	AMULET:			7,
	RUNE:			8,
	QUEST:			9,
	POTION:			10,
	COMPONENT:		11,
	RESOURCE:		12,
	RECIPE:			13,
	GIFT:			14
};

HCS.DEFINES.ITEM_TYPE_REVERSE = [
	"HELMET",
	"ARMOR",
	"GLOVES",
	"BOOTS",
	"WEAPON",
	"SHIELD",
	"RING",
	"AMULET",
	"RUNE",
	"QUEST",
	"POTION",
	"COMPONENT",
	"RESOURCE",
	"RECIPE",
	"GIFT"
];

HCS.DEFINES.ACTION = {
	QUEST: 					0,
	CREATURE_VIEW:			1,
	CREATURE_COMBAT: 		2,
	PLAYER_COMBAT: 			3,
	PLAYER_MOVE:			4,
	STARWAY:				5,
	CRATE:					6,
	PORTAL_VIEW:			7,
	PORTAL_USE:				8,
	RELIC_VIEW:				9,
	RELIC_EMPOWER:			10,
	RELIC_CAPTURE:			11,
	GROUP_CREATE:			12,
	SHOP_VIEW:				13,
	SHOP_BUY:				14,
	REPAIR_ALL: 			15,
	RELIC_REMOVE_EMPOWER: 	16,
	LOGIN:					17,
	RESET_PASSWORD:			18,
	DROP_ITEM:				19,
	REPAIR_BY_SLOT:			20,
	INSTANT_PORTAL:			21,
	TELEPORT:			    25
};

var FETCH_FLAGS = {
	PLAYER_STATS : 			1,
	PLAYER_BACKPACK_COUNT: 	2,
	PLAYER_BACKPACK_ITEMS:	4,
	PLAYER_PREFRENCES:		8,
	PLAYER_BUFFS:			16,
	
	DEFINES:				32,
	REALM_STATIC:			64,
	REALM_DYNAMIC:			128,
	ACTIONS:				256,
	
	PLAYER_EQUIPMENT:		512,
	PLAYER_NOTIFICATIONS:	1024,
	
	ALL: 					2047
};

HCS.DEFINES.DATA_EVENTS = {
	DEFINES : {
		ANY: 'update.defines'
	},
	
	PLAYER_STATS : {
		ANY:				'stats.player',
				
		LEVEL:  			'level.stats-player',
		XP: 				'xp.stats-player',
		XP_GAINPER:			'xpGainPer.stats-player',
		
		STAMINA:			'stamina.stats-player',
		STAMINA_GAINPER:	'staminaGainPer.stats-player',
		
		FSP: 				'fsp.stats-player',
		GOLD: 				'gold.stats-player',
		GOLD_GAINPER:		'goldGainPer.stats-player',
		BANK:				'bank.stats-player',
		TELEPORT_COOLDOWN:  'teleportCooldown.stats-player',
		
		RANK:  				'rank.stats-player',
		ATTACK:  			'attack.stats-player',
		DEFENSE:  			'defense.stats-player',
		HP:  				'hp.stats-player',
		ARMOR:  			'armor.stats-player',
		DAMAGE:  			'damage.stats-player',

		MASTER_REALM: 		'masterRealm.stats-player',
		GROUP:				'hasGroup.stats-player',
		LOCATION:			'location.stats-player',
		LASTTIMECHECK:		'lastTimeCheck.stats-player',
		
		VISION:				'vision.stats-player'
	},
	
	PLAYER_EQUIPMENT: {
		ANY		: 'equipment.player',
		HELMET 	: 'helmet.equipment-player',
		ARMOR 	: 'armor.equipment-player',
		GLOVES 	: 'gloves.equipment-player',
		BOOTS	: 'boots.equipment-player',
		WEAPON 	: 'weapon.equipment-player',
		SHIELD 	: 'shield.equipment-player',
		RING	: 'ring.equipment-player',
		AMULET 	: 'amulet.equipment-player',
		RUNE	: 'rune.equipment-player'
	},

	PLAYER_DURABILITY: {
		ANY		: 'durability.player',
		HELMET 	: 'helmet.durability-player',
		ARMOR 	: 'armor.durability-player',
		GLOVES 	: 'gloves.durability-player',
		BOOTS	: 'boots.durability-player',
		WEAPON 	: 'weapon.durability-player',
		SHIELD 	: 'shield.durability-player',
		RING	: 'ring.durability-player',
		AMULET 	: 'amulet.durability-player',
		RUNE	: 'rune.durability-player'
	},
	
	PLAYER_BACKPACK: {
		ANY : 		'backpack.player',
		MAX : 		'max.backpack-player',
		CURRENT: 	'current.backpack-player',
		ITEMS: 		'items.backpack-player'
	},
	
	PLAYER_PREFS: {
		ANY : 'prefs.player'
	},
	
	PLAYER_BUFFS: {
		ANY : 'buffs.player'
	},
	
	PLAYER_DURABILITY: {
		ANY : 	'update.durability-player',
		GLOVES: 'gloves.durability-player',
		HELMET: 'helmet.durability-player',
		AMULET: 'amulet.durability-player',
		WEAPON: 'weapon.durability-player',
		ARMOR:  'armor.durability-player',
		SHIELD: 'shield.durability-player',
		RING: 	'ring.durability-player',
		BOOTS: 	'boots.durability-player',
		RUNE: 	'rune.durability-player'
	},
	
	PLAYER_EQUIPMENT: {
		ANY : 	'update.equipment-player',
		GLOVES: 'gloves.equipment-player',
		HELMET: 'helmet.equipment-player',
		AMULET: 'amulet.equipment-player',
		WEAPON: 'weapon.equipment-player',
		ARMOR:  'armor.equipment-player',
		SHIELD: 'shield.equipment-player',
		RING: 	'ring.equipment-player',
		BOOTS: 	'boots.equipment-player',
		RUNE: 	'rune.equipment-player'
	},
	
	PLAYER_NOTIFICATIONS: {
		ANY : 'notifications.player'
	},
	
	PLAYER: {
		ANY : 'update.player'
	},
	
	REALM: {
		ANY: 		'update.realm',
		FIXED:		'fixed.realm',
		DYNAMIC: 	'dynamic.realm',
		
		ID:			'id.realm',
		WIDTH: 		'w.realm',
		HEIGHT:		'h.realm',
		DARK:		'dark.realm',
		NAME:		'name.realm',
		TILESET:	'tileset.realm',
		
		BLOCK:		'block.realm',
		TILES:		'tiles.realm',
		TILE_LOOKUP:'tile_lookup.realm',
		
		LOCATIONS_FIXED: 'fixed-locations.realm',
		LOCATIONS_DYNAMIC: 'dynamic-locations.realm'
	},
	
	MASTER_REALM: {
		ANY: 		'update.masterRealm'
	},
	
	ACTIONS: {
		ANY: 'update.actions'
	},
	
	TIME: 'update.time'
};(function($)
{
	$.fn.paginate = function(options)
	{
		var self = this;
		var settings =
		{
				'maxLinks':5,
				'startPage':0,
				'showFirstLast': true,
				'showNextPrev': true
		};
				
		$.extend(settings, options);
		
		var currentPage = settings.startPage;
		var totalPages = 0;
		
		return this.each(function()
		{
			// hide all pages
			var c=0;
			$('li', this).each(function()
			{
				// assign the pages ids
				$(this).addClass('hcsPaginate_page_'+c)
					   .addClass('hcsPaginate_hidden');
				c++;
			});
			totalPages = c;
			if(currentPage>=totalPages)
				currentPage = totalPages-1;
			
			// show the first page
			$('.hcsPaginate_page_'+currentPage, self).removeClass('hcsPaginate_hidden');
			
			$(this).append('<div class="hcsPaginate_pageLinks"></div>');
			_updatePageLinks(true);
		});
		
		function _updatePageLinks(init)
		{
			// build page links and bind them
			var pageLinkHTML = '';
			
			if(settings.showFirstLast)
				pageLinkHTML += '<a class="hcsPaginate_pageLink" data-page="0"><<</a>';
			if(settings.showNextPrev && currentPage>0)
				pageLinkHTML += '<a class="hcsPaginate_pageLink" data-page="'+(currentPage-1)+'"><</a>';
			
			var linkCount = settings.maxLinks,
				maxDirLinks = Math.floor(linkCount/2),
				s = 0,
				c = 0;

			if(currentPage>=maxDirLinks)
			{
				var v = (totalPages-currentPage+maxDirLinks);
				var adjustment = 0;
				
				if(v<settings.maxLinks)
					adjustment = settings.maxLinks-v;
				s = currentPage-maxDirLinks-adjustment;
				if(s<0) s=0;
			}
			
			for(var i=s; c<=maxDirLinks*2 && i<totalPages; i++, c++)
				pageLinkHTML += '<a class="hcsPaginate_pageLink hcsPaginate_pageLink_'+i+'" data-page="'+i+'">'+(i+1)+'</a>';
			
			if(settings.showNextPrev && currentPage<totalPages-1)
				pageLinkHTML += '<a class="hcsPaginate_pageLink" data-page="'+(currentPage+1)+'">></a>';
			if(settings.showFirstLast)
				pageLinkHTML += '<a class="hcsPaginate_pageLink" data-page="'+(totalPages-1)+'">>></a>';
			
			$('.hcsPaginate_pageLinks', self).html(pageLinkHTML);
			// show current page
			$('.hcsPaginate_pageLink_'+currentPage, self).addClass('hcsPaginate_selected');
			// bind the page links
			if(init)
			{
				$('.hcsPaginate_pageLink', self).live('selectstart', (function(){return false;}));
				$('.hcsPaginate_pageLink', self).live('mousedown', (function(){return false;}));
				$('.hcsPaginate_pageLink', self).live('click', function()
				{
					var newPage = $(this).data('page');
					$('.hcsPaginate_page_'+currentPage, self).addClass('hcsPaginate_hidden');
					currentPage = newPage;
					$('.hcsPaginate_page_'+currentPage, self).removeClass('hcsPaginate_hidden');
					_updatePageLinks(false);
				});
			}
		}
	};
})(jQuery);(function($){

$.widget('hcs.guildStore', $.ui.dialog, $.extend({}, {
	
	options : {
		perPage: 30,
		guildId: -1,
		playerId: -1,
		width: 644,
		height: 400,
		resizable: false,
		invSize: 0,
		zIndex: 9999
	},
	
	_create : function()
	{
		var self = this;
		
		// create dialog
		$.ui.dialog.prototype['_create'].apply(self, arguments);
		
		self.$tabs = $("#guildStore_tabs"); 
		self.$tabs.tabs({
			selected: -1,
			select: function(event, ui)
			{
				self._showPage($(ui.tab).attr('data-type'), ui.index);
			}
		});
		
		// move to clean space
		self.uiDialog.appendTo($('#cleanSpace'));
		self._loadData();
		self._createTitleBar();
		self._initMenus();
		
		// events
		$('.guildStoreItem').live('click', function()
		{
			// get data
			var invId = $(this).data('inv');
			var page = self.$tabs.tabs('option', 'selected');
			self._takeItem(invId, page, false);
			return false;
		});
		
		$('#guildStore_filterApply').live('click', function()
		{
			self._applyFilter();
			return false;
		});
		
		$('#guildStore_filterClear').live('click', function()
		{
			// clear input fields
			$('#guildStore_filterMinLevel').val('');
			$('#guildStore_filterMaxLevel').val('');
			$('#guildStore_filterSet').attr('checked', false);
			
			// reset the tabData
			self._clearFilter();
			return false;
		});
	},
	
	_createTitleBar : function()
	{
		var self = this,
			$title = this.uiDialogTitlebar.find(".ui-dialog-title:first");
		//$title.html("Guild Store");
		var t = $("#dialog_guildStoreTitle")
			.appendTo($title)
			.delegate('.guildStoreTabLink', 'click', function(e, data)
			{
				var target = e.target,
					$target = $(target),
					index = $target.parent().index();
				self.$tabs
					.children(':eq(0)')
						.children(':eq('+index+')')
							.children('a:first')
								.click();
				
				$target.parent()
					.addClass('ui-state-active')
					.siblings()
						.removeClass('ui-state-active');
				
				return false;
			});
		self.$fakeTabs = t.find('ul:first');
	},
	
	_initMenus : function()
	{
		var self = this;
		
		// context menus
		$.contextMenu(
		{
			selector: '.guildStoreContextMenuTagged',
			events:
			{
				show: function(opt) { }
			},
			items:
			{
				takeItem: {name: "Take Item", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					self._takeItem(this.data('inv'), page, false)
				}},
				useItem: {name: "Equip Item", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					self._useItem(this.data('inv'), page)
				}},
				untagItem: {name: "Untag Item", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					self._untagItem(this.data('inv'), page)
				}},
				seperator: "---------",
				cancel: {name: "Cancel", callback: $.noop}
			}
		});

		$.contextMenu(
	    {
			selector: '.guildStoreContextMenu',
			events:
			{
				show: function(opt) { $('.guildStoreTagItemOption').html('<span>Tag Item ('+this.data('tag-cost')+'g)</span>') }
			},
			items:
			{
				takeItem: {name: "Take Item", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					self._takeItem(this.data('inv'), page, false)
				}},
				useItem: {name: "Equip Item", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					self._useItem(this.data('inv'), page)
				}},
				tagItem: {name: "Tag Item", className: 'guildStoreTagItemOption', callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					self._tagItem(this.data('inv'), page)
				}},
				seperator: "---------",
				cancel: {name: "Cancel", callback: $.noop}
			}
		});
	},
	
	_updateItemCount : function()
	{
		$('#guildStore_current').html(this.tabData[-1].length);
	},
	
	_loadData : function()
	{
		var self = this;
		var tabData;
		self.maxType = -1;
		
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				self.srcData = data;
				self._applyFilter();

				self.$fakeTabs.children(':eq(0)').children('a:first').click();
				self._updateItemCount();
			},
			data:
				{
					"cmd": "guild",
					"subcmd": "fetchinv"
				},
			dataType: "json"
		});
	},

	_showPage : function(type, page)
	{
		var self = this,
			tabData = this.tabData,
			perPage = this.options.perPage,
			guildId = this.options.guildId,
			playerId = this.options.playerId,
			$tab = $('#guildStoreTab_'+type);
		
		if(tabData[type]===undefined || tabData[type].length===0)
		{
			// no items of this type
			$tab.html("[ No items of this type ]");
			return;
		}
		
		var tabDataLength = tabData[type].length;
		var html = '';
		// create the pages
		html += '<div id="guildStorePages_'+type+'" class="hcsPaginate_pageList"><ul class="guildStoreItemList">';
		var c=0,
			p=0;			
		
		for(var i=0; i<tabDataLength; i++)
		{
			if(c===0)
				html += '<li><div class="guildStoreTabContent">';
			
			var item = tabData[type][i],
				menuClass = item.tg?'guildStoreContextMenuTagged':'guildStoreContextMenu';

			html += '<div style="padding: 2px; float: left;"><a href="#" id="guildStore_item'+item.a+'" class="inventory-item-slot inventory-item-size-2x3 tip-dynamic" data-tipped="fetchitem.php?item_id='+item.b+'&inv_id='+item.a+'&t=4&p='+guildId+'&extra=3&currentPlayerId='+playerId+'"><span class="inventory-item inventory-item-size-2x3 guildStoreItem '+menuClass+'" data-page="'+p+'" data-inv="'+item.a+'" data-tag-cost="'+item.c+'" style="background-image: url(';
			if(item.t == 15) // composed potion
				html += HCS.defines.fileserver+'composing/potions/'+item.extra.design+'_'+item.extra.color;
			else
				html += HCS.defines.fileserver+'items/'+item.b;
			html += '.gif)"></span></a></div>';
			if(++c===perPage)
			{
				html += '</div></li>';
				c=0;
				p++;
			}
		}
		html += '</ul></div>';
		html += '<div style="clear: both"></div>';
		$tab.html(html);

		$('#guildStorePages_'+type).paginate({'startPage':page, 'maxLinks':21});
	},
	
	_takeItem : function(invId, page, equip)
	{
		var self = this;
		// ajax call to take item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				if(data.r==1)
				{
					$('#dialog_msg').dialog({
						title: 'Information',
						buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
					});
					$('#dialog_msg').html(data.m).dialog('open');
				}
				else
				{
					// remove from srcData
					var s = self.srcData.length;
					for(var i=0; i<s; i++)
					{
						if(self.srcData[i].a==invId)
						{
							self.srcData.splice(i, 1);
							break;
						}
					}
					
					var t = data.t;
					if(equip)
					{
						// try to auto-equip the item
						var backpackInvId = data.b;
						
						$.ajax({
							url: "index.php",
							success: function(data)
							{
								if(data.r==1)
								{
									$('#dialog_msg').dialog({
										title: 'Information',
										buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
									});
									$('#dialog_msg').html(data.m).dialog('open');
								}
							},
							data:
							{
								"cmd": "profile",
								"subcmd": "equipitem",
								"inventory_id": backpackInvId,
								"ajax": 1
							},
							dataType: "json"
						});
					}
					
					self._applyFilter();
					self._updateItemCount();
				}
			},
			data:
			{
				"cmd": "guild",
				"subcmd": "inventory",
				"subcmd2": "takeitem",
				"guildstore_id": invId,
				"ajax": 1
			},
			dataType: "json"
		});
	},
	
	_tagItem : function(invId, page)
	{
		var self = this;
		// ajax call to tag item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				if(data.r==1)
				{
					$('#dialog_msg').dialog({
							title: 'Information',
							buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
						});
					$('#dialog_msg').html(data.m).dialog('open');
				}
				else
				{
					// set item as tagged
					var s = self.srcData.length;
					for(var i=0; i<s; i++)
					{
						if(self.srcData[i].a==invId)
						{
							self.srcData[i].tg = true;
							break;
						}
					}
					
					self._applyFilter();
				}
			},
			data:
				{
					"cmd": "guild",
					"subcmd": "inventory",
					"subcmd2": "doaddtags",
					"guildstore_id": invId,
					"ajax": 1
				},
			dataType: "json"
		});
	},
	
	_untagItem : function(invId, page)
	{
		var self = this;
		// ajax call to tag item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				if(data.r==1)
				{
					$('#dialog_msg').dialog({
							title: 'Information',
							buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
						});
					$('#dialog_msg').html(data.m).dialog('open');
				}
				else
				{
					// set item as untagged
					var s = self.srcData.length;
					for(var i=0; i<s; i++)
					{
						if(self.srcData[i].a==invId)
						{
							self.srcData[i].tg = false;
							break;
						}
					}
					
					self._applyFilter();
				}
			},
			data:
				{
					"cmd": "guild",
					"subcmd": "inventory",
					"subcmd2": "doremovetags",
					"guildstore_id": invId,
					"ajax": 1
				},
			dataType: "json"
		});
	},
	
	_useItem : function(invId, page)
	{
		var self = this;
		
		var l = self.tabData[-1].length,
			item;
		
		// find the item
		for(var i=0; i<l; i++)
		{
			if(self.tabData[-1][i].a==invId)
			{
				item = self.tabData[-1][i];
				break;
			}
		}
		
		if(!item.eq)
		{
			$('#dialog_msg').dialog({
					title: 'Information',
					buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
				});
			$('#dialog_msg').html('This item cannot be equipped').dialog('open');
			return;
		}
		
		self._takeItem(item.a, page, true);
	},
	
	
	_applyFilter : function()
	{
		var min = $('#guildStore_filterMinLevel').val(),
			max = $('#guildStore_filterMaxLevel').val();
			setOnly = ($('#guildStore_filterSet').attr('checked')=='checked');

		min = (min=="")?-1:parseInt(min);
		max = (max=="")?-1:parseInt(max);
		if(isNaN(min)) min = -1;
		if(isNaN(max)) max = -1;
				
		var data = this.srcData,
			l = data.length,
			tabData = new Array(l);
		// store data for tab
		for(var i=0; i<l; i++)
		{
			if(min!=-1)
			{
				if(data[i]['l']<min)
					continue;
			}
			if(max!=-1)
			{
				if(data[i]['l']>max)
					continue;
			}
			if(setOnly)
			{
				if(!data[i]['s'])
					continue;
			}
			
			if(tabData[data[i]['t']]===undefined)
				tabData[data[i]['t']] = new Array();
			
			if(data[i]['t']>self.maxType)
				self.maxType = data[i]['t'];
			
			tabData[data[i]['t']].push(data[i]);
			
			// show all tab
			if(tabData[-1]===undefined)
				tabData[-1] = new Array();
			tabData[-1].push(data[i]);
		}
		
		this.tabData = tabData;
		
		// find current page
		var type = this.$tabs.tabs('option', 'selected')-1;
		
		var $page = $('#guildStorePages_'+type).find('.hcsPaginate_selected');
		var page = $page.data('page');
		
		this._showPage(type, page);
	},
	
	_clearFilter : function()
	{
		this._applyFilter(-1, -1, false);
	}
}));

})(jQuery);(function($){

$.widget('hcs.backpack', {

	options : {
		perPage: 20,
		guildId: -1,
		playerId: -1,
		invSize: 1,
		folderId: -1,
		type: -1,
		page: 0,
		foldersEnabled: true,
		ordering: 0,
		checkboxesEnabled: true
	},

	_create : function()
	{
		var self = this;
		self.type = self.options.type;
		self.page = self.options.page;
		self.folderId = self.options.folderId;
		self.ordering = self.options.ordering;
		self.selectedCount = 0;
		self.itemByInvId = new Array();
		self.$tabs = $("#backpack_tabs");

		self._loadData();
		self._initMenus();

		// events
		$('.backpackTabLink').live('click', function()
		{
			// get data
			self.type = $(this).data('type');
			self.page = 0;
			self._showPage(self.type, self.page);
			return false;
		});

		$('.backpackItem, .backpackCheckbox').live('click', function(e)
		{
			$element = $(this);
			var isCheckbox = $element.hasClass('backpackCheckbox');
			if(e.ctrlKey || e.metaKey || isCheckbox)
			{
				if(!self.options.foldersEnabled)
					return false;

				var $itemElement = $element;

				if(isCheckbox)
				{
					$itemElement = $('#item_span'+$element.data('inv'));
				}

				if($itemElement.hasClass('backpack-selected'))
				{
					$itemElement.removeClass('backpack-selected');
					self.selectedCount--;
				}
				else
				{
					$itemElement.addClass('backpack-selected');
					self.selectedCount++;
				}

				// count how many are selected
				if(self.selectedCount == 1 && $('#backpack-multi-options').length == 0)
				{
					// add multi select options
					$('#backpackContainer').append('<div id="backpack-multi-options"></div>');

					var len = self.folderData.length;
					if(len > 1)
					{
						$('#backpack-multi-options').append('<div style="padding-top: 5px; text-align: center;">Move selected to: <select id="target-folder"></select><input type="button" id="backpack-move-selected-button" value="Go" class="custombutton"></div>');

						// list folders within the select
						for(var i = 0; i < len; i++)
						{
							$('#target-folder').append('<option value="' + self.folderData[i].a + '">' + self.folderData[i].n + '</option>');
						}
					}
				}
				else if(self.selectedCount == 0)
				{
					// remove the multi select options
					$('#backpack-multi-options').remove();
				}
			}
			else
			{
				// get data
				var invId = $(this).data('inv');
				var item = self.itemByInvId[invId];

				if(item.c)
					return true; // choosable item

				// determine what to do with the item
				if(item.eq)
				{
					self._equipItem(invId);
				}
				else if(item.u)
				{
					if(item.t == 10 || item.t == 15)
					{
						if(confirm('Are you sure you want to use this item?'))
						{
							self._useItem(invId);
						}
					}
					else
						self._useItem(invId);
				}
			}

			return isCheckbox;
		});

		$('#backpack_filterApply').on('click', function()
		{
			self._applyFilter();
			return false;
		});

		$('#backpack_filterClear').on('click', function()
		{
			// clear input fields
			$('#backpack_filterMinLevel').val('');
			$('#backpack_filterMaxLevel').val('');
			$('#backpack_filterSet').attr('checked', false);

			// reset the tabData
			self._clearFilter();
			return false;
		});

		$('.backpackFolderImage').live('click', function()
		{
			$('#backpack-folder-' + self.folderId).attr('src', 'http://cdn.fallensword.com/folder.gif');
			self.folderId = $(this).data('folder');
			$('#backpack-folder-' + self.folderId).attr('src', 'http://cdn.fallensword.com/folder_on.gif');
			self._applyFilter();
		});

		$('#backpack-move-selected-button').live('click', function()
		{
			// get the id's of all the selected items and move them to the picked folder
			var invIdList = [];
			$('.backpack-selected').each(function (index)
			{
				invIdList.push($(this).data('inv'));
				$(this).removeClass('backpack-selected');
				self.selectedCount--;
			});

			self._moveItem(invIdList, $("#target-folder option:selected").val());
			$('#backpack-multi-options').remove();
		});
	},

	_initMenus : function()
	{
		var self = this;

		// context menus
		$.contextMenu(
		{
			selector: '.backpackContextMenuEquippable',
			build: function($trigger, e) {
				var items =
				{
					useItem: {name: "Equip Item", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						self._equipItem(this.data('inv'), page)
					}},
					destroyItem: {name: "Destroy Item", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						if(confirm('Are you sure you want to destroy this item?'))
							self._destroyItem(this.data('inv'), page)
					}},
					fragItem: {name: "Break Down", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						if(confirm('Are you sure you want to break down this item?'))
							self._fragItem(this.data('inv'), page)
					}},
					fragItemType: {name: "Break Down All", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						if(confirm('Are you sure you want to break down all items of this type?'))
							self._fragItemType(this.data('inv'), page)
					}}
				};

				self._addContextFolderMenu(items);

				items['seperator'] =
				{
					name: "---------"
				};

				items['cancel'] = {name: "Cancel", callback: $.noop};

				return {
					items: items
				};
			},
			events:
			{
				show: function(opt) { }
			}
		});

		$.contextMenu(
		{
			selector: '.backpackContextMenuUsable',
			events:
			{
				show: function(opt) { }
			},
			build: function($trigger, e)
			{
				var invId = $trigger.data('inv');
				var thisItem = self.itemByInvId[invId];

				var items = {};

				if(thisItem['t'] == 12)
				{
					items['extractItem'] = {name: "Extract Item", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						self._useItem(invId, page);
					}};

					items['extractByType'] = {name: "Extract All [" + thisItem['n'] + "]", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						self._extractItemByType(invId, page);
					}};
				}
				else
				{
					items['useItem'] = {name: "Use Item", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');

						if(confirm('Are you sure you want to use this item?'))
						{
							self._useItem(invId, page);
						}
					}};
				}

				items['destroyItem'] = {name: "Destroy Item", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					if(confirm('Are you sure you want to destroy this item?'))
						self._destroyItem(invId, page);
				}};

				items['fragItem'] = {name: "Break Down", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					if(confirm('Are you sure you want to fragment this item?'))
						self._fragItem(invId, page)
				}};

				items['fragItemType'] = {name: "Break Down All", callback: function() {
					var page = self.$tabs.tabs('option', 'selected');
					if(confirm('Are you sure you want to break down all items of this type?'))
						self._fragItemType(invId, page)
				}};

				self._addContextFolderMenu(items);

				items['seperator'] =
				{
					name: "---------"
				};

				items['cancel'] = {name: "Cancel", callback: $.noop};

				return {
					items: items
				};
			}
		});

		$.contextMenu(
		{
			selector: '.backpackContextMenu',
			events:
			{
				show: function(opt) { }
			},
			build: function($trigger, e)
			{
				var items =
				{
					destroyItem: {name: "Destroy Item", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						if(confirm('Are you sure you want to destroy this item?'))
							self._destroyItem(this.data('inv'), page);
					}},
					fragItem: {name: "Break Down", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						if(confirm('Are you sure you want to fragment this item?'))
							self._fragItem(this.data('inv'), page)
					}},
					fragItemAll: {name: "Break Down All", callback: function() {
						var page = self.$tabs.tabs('option', 'selected');
						if(confirm('Are you sure you want to break down all items of this type?'))
							self._fragItemType(this.data('inv'), page)
					}}
				};

				self._addContextFolderMenu(items);

				items['seperator'] =
				{
					name: "---------"
				};

				items['cancel'] = {name: "Cancel", callback: $.noop};

				return {
					items: items
				};
			}
		});
	},

	_addContextFolderMenu : function(menuItems)
	{
		var self = this;

		if(!self.options.foldersEnabled)
			return;

		var len = self.folderData.length;

		if(len > 1)
		{
			menuItems['sendToFolder'] = {
				name: "Send to Folder",
				items: {}
			};

			var callback = function(key, opt)
			{
				var folderId = parseInt(key);
				self._moveItem([this.data('inv')], folderId);
			};

			for(var i = 0; i < len; i++)
			{
				var folder = self.folderData[i];
				if(folder.a != self.folderId)
				{
					menuItems['sendToFolder']['items'][folder.a] =
					{
						name: folder.n,
						callback: callback
					}
				}
			}
		}
	},

	_applyFilter : function()
	{
		var min = $('#backpack_filterMinLevel').val(),
			max = $('#backpack_filterMaxLevel').val(),
			self = this;
		setOnly = ($('#backpack_filterSet').attr('checked')=='checked');

		min = (min=="")?-1:parseInt(min);
		max = (max=="")?-1:parseInt(max);
		if(isNaN(min)) min = -1;
		if(isNaN(max)) max = -1;

		var data = this.srcData,
			l = data.length,
			tabData = new Array(l);

		// store data for tab
		for(var i=0; i<l; i++)
		{
			if(min!=-1)
			{
				if(data[i]['l']<min)
					continue;
			}
			if(max!=-1)
			{
				if(data[i]['l']>max)
					continue;
			}
			if(setOnly)
			{
				if(!data[i]['s'])
					continue;
			}

			if(self.options.foldersEnabled)
			{
				if(self.folderId == -1 && data[i]['f'] > 0)
					continue;
				else if(self.folderId > 0 && data[i]['f'] != self.folderId)
					continue;
			}

			var type = data[i]['t'];
			if(type == 15)
				type = 10;

			if(tabData[type]===undefined)
				tabData[type] = new Array();

			if(type > self.maxType)
				self.maxType = type;

			tabData[type].push(data[i]);

			// show all tab
			if(tabData[-1] === undefined)
				tabData[-1] = new Array();
			tabData[-1].push(data[i]);
		}

		this.tabData = tabData;
		this._showPage(self.type, self.page);
	},

	_showPage : function(type, page)
	{
		var self = this,
			tabData = this.tabData,
			perPage = this.options.perPage,
			guildId = this.options.guildId,
			$tab = $('#backpackTab_'+type);

		// Hide all tooltips
		$('.qtip').remove();

		// hide all the tabs
		for(i = -1; i < 14; i++)
		{
			$('#backpackTab_'+i).hide();
			$('#backpackTabLink_'+i).removeClass('tab-selected');
		}

		if(tabData[type]===undefined || tabData[type].length===0)
		{
			// no items of this type
			$tab.html("[ No items of this type ]");
			$tab.show();
			$('#backpackTabLink_' + type).addClass('tab-selected');
			return;
		}

		var tabDataLength = tabData[type].length;
		var html = '';
		// create the pages
		html += '<div id="backpackPages_'+type+'" class="hcsPaginate_pageList"><ul class="backpackItemList">';
		var c=0,
			p=0;

		for(var i = 0; i < tabDataLength; i++)
		{
			if(c===0)
				html += '<li><div class="backpackTabContent">';

			var item = tabData[type][i];

			// store item so it can be looked up by invId
			self.itemByInvId[item.a] = item;

			var menuClass = "backpackContextMenu";
			var extra = 0;
			if(item.eq)
			{
				extra = 9;
				menuClass = "backpackContextMenuEquippable";
			}
			else if(item.u && !item.c)
			{
				extra = 5;
				menuClass = "backpackContextMenuUsable";
			}

			//item_giftSelect
			if(item.c)
			{
				// container with choice
				html += '<div style="padding: 2px; float: left;"><a href="#" id="backpack_item'+item.a+'" data-inv='+item.a+' class="inventory-item-slot inventory-item-size-2x3 tip-dynamic" data-tipped="fetchitem.php?item_id='+item.b+'&inv_id='+item.a+'&t=0&p='+self.options.playerId+'&currentPlayerId='+self.options.playerId+'&extra='+extra+'"><span id="item_span'+item.a+'" class="inventory-item inventory-item-size-2x3 backpackItem item_giftSelect '+menuClass+'" data-page="'+p+'" data-inv="'+item.a+'" data-gift="'+item.a+'" style="background-image: url(';
			}
			else
			{
				html += '<div style="padding: 2px; float: left;"><a href="#" id="backpack_item'+item.a+'" data-inv='+item.a+' class="inventory-item-slot inventory-item-size-2x3 tip-dynamic" data-tipped="fetchitem.php?item_id='+item.b+'&inv_id='+item.a+'&t=0&p='+self.options.playerId+'&currentPlayerId='+self.options.playerId+'&extra='+extra+'"><span id="item_span'+item.a+'" class="inventory-item inventory-item-size-2x3 backpackItem '+menuClass+'" data-page="'+p+'" data-inv="'+item.a+'" style="background-image: url(';
			}

			if(item.t == 15) // composed potion
				html += HCS.defines.fileserver+'composing/potions/'+item.extra.design+'_'+item.extra.color;
			else
				html += HCS.defines.fileserver+'items/'+item.b;
			html += '.gif)"></span></a>'

			if(self.options.checkboxesEnabled)
			{
				html += '<br><input class="backpackCheckbox" type="checkbox" id="backpack_checkbox'+item.a+'" data-inv='+item.a+'>';
			}

			html += '</div>';

			if(++c===perPage)
			{
				html += '</div></li>';
				c=0;
				p++;
			}
		}

		var extraSlots = 0;
		// work out how many extra slots are required to pad out
		var remainder = Math.floor(tabDataLength / perPage);
		if(remainder < 1)
			extraSlots = perPage - (tabDataLength - (Math.floor(tabDataLength / perPage) * perPage));

		for(var i = 0; i < extraSlots; i++)
		{
			html += '<div style="padding: 2px; float: left;"><span class="backpackEmptySlot inventory-item-size-2x3"></span>';

			if(self.options.checkboxesEnabled)
			{
				html += '<br><input class="backpackCheckbox" type="checkbox" disabled>';
			}

			html += '</div>';
		}

		html += '</div></li>';
		html += '</ul></div>';
		html += '<div style="clear: both"></div>';

		$tab.html(html);
		$tab.show();

		$('#backpackPages_'+type).paginate({'startPage':self.page, 'maxLinks':8});
		$('#backpackTabLink_'+type).addClass('tab-selected');
	},

	_equipItem : function(invId)
	{
		var self = this;
		self.page =  $('#backpackPages_'+self.type).find('.hcsPaginate_selected').data('page');

		// non-ajax equip call
		window.location = 'index.php?cmd=profile&subcmd=equipitem&inventory_id=' + invId + '&backpack_page=' + self.page + '&backpack_type=' + self.type + "&folder_id=" + self.folderId;
	},

	_useItem : function(invId)
	{
		var self = this;
		self.page =  $('#backpackPages_'+self.type).find('.hcsPaginate_selected').data('page');

		// non-ajax equip call
		window.location = 'index.php?cmd=profile&subcmd=useitem&inventory_id=' + invId + '&backpack_page=' + self.page + '&backpack_type=' + self.type + "&folder_id=" + self.folderId;
	},

	_extractItemByType : function(invId)
	{
		var self = this;
		self.page =  $('#backpackPages_'+self.type).find('.hcsPaginate_selected').data('page');

		// non-ajax equip call
		window.location = 'index.php?cmd=profile&subcmd=useitem&inventory_id=' + invId + '&by_type=1&backpack_page=' + self.page + '&backpack_type=' + self.type + "&folder_id=" + self.folderId;
	},

	_destroyItem : function(invId, page, equip)
	{
		var self = this;
		// ajax call to take item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				if(data.r==1)
				{
					$('#dialog_msg').dialog({
						title: 'Information',
						buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
					});
					$('#dialog_msg').html(data.m).dialog('open');
				}
				else
				{
					// remove from srcData
					var s = self.srcData.length;
					for(var i=0; i<s; i++)
					{
						if(self.srcData[i].a==invId)
						{
							self.srcData.splice(i, 1);
							break;
						}
					}
					self._applyFilter();
					self._updateItemCount();
				}
			},
			data:
			{
				"cmd": "profile",
				"subcmd": "dodropitems",
				"removeIndex[]": invId,
				"ajax": 1
			},
			dataType: "json"
		});
	},

	_fragItem : function(invId, page, equip)
	{
		var self = this;
		// ajax call to take item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				if(data.r==1)
				{
					$('#dialog_msg').dialog({
						title: 'Information',
						buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
					});
					$('#dialog_msg').html(data.m).dialog('open');
				}
				else
				{
					// remove from srcData
					var s = self.srcData.length;
					for(var i=0; i<s; i++)
					{
						if(self.srcData[i].a==invId)
						{
							self.srcData.splice(i, 1);
							break;
						}
					}
					self._applyFilter();
					self._updateItemCount();

					if (data.m) {
						$('#dialog_msg').dialog({
							title: 'Information',
							buttons: [{
								text: 'Ok', click: function () {
									$(this).dialog('close');
								}
							}]
						});
						$('#dialog_msg').html(data.m).dialog('open');
					}
				}
			},
			data:
			{
				"cmd": "profile",
				"subcmd": "dofragitems",
				"fragIndex[]": invId,
				"ajax": 1
			},
			dataType: "json"
		});
	},

	_fragItemType : function(invId, page, equip)
	{
		var self = this;
		// ajax call to take item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				$('#dialog_msg').dialog({
					title: 'Information',
					buttons: [{
						text: 'Ok', click: function () {
							if (data.r == 0)
								location.reload();
							else
								$(this).dialog('close');
						}
					}]
				});

				$('#dialog_msg').html(data.m).dialog('open');
			},
			data:
			{
				"cmd": "profile",
				"subcmd": "dofragitemstype",
				"fragIndex[]": invId,
				"ajax": 1
			},
			dataType: "json"
		});
	},

	_moveItem : function(invIdList, folderId)
	{
		var self = this;
		// ajax call to take item
		$.ajax({
			url: "index.php",
			success: function(data)
			{
				if(data.r==1)
				{
					$('#dialog_msg').dialog({
						title: 'Information',
						buttons: [{ text: 'Ok', click: function(){$(this).dialog('close');} }]
					});
					$('#dialog_msg').html(data.m).dialog('open');
				}
				else
				{
					var s = self.srcData.length;
					for(var i = 0; i < s; i++)
					{
						var invIdListLen = invIdList.length;
						for(var j = 0; j < invIdListLen; j++)
						{
							if(self.srcData[i].a == invIdList[j])
							{
								self.srcData[i].f = folderId;
								break;
							}
						}
					}

					// update
					self._applyFilter();
					self._updateItemCount();
				}
			},
			data:
			{
				"cmd": "profile",
				"subcmd": "sendtofolder",
				"inv_list": JSON.stringify(invIdList),
				"folder_id": folderId,
				"ajax": 1
			},
			dataType: "json"
		});
	},

	_updateItemCount : function()
	{
		$('#backpack_current').html(this.srcData.length);
	},

	_loadData : function()
	{
		var self = this;
		var tabData;
		self.maxType = -1;

		$.ajax({
			url: "index.php",
			success: function(data)
			{
				self.srcData = data['items'];

				// sort the data before allocating to tabs
				switch(self.ordering)
				{
					case 0:
						self.srcData.sort(function(a, b)
						{
							return (a['o'] - b['o']);
						});
						break;
					case 1:
						self.srcData.sort(function(a, b)
						{
							if(a['l'] == b['l'])
							{
								var an = a['n'].toLowerCase();
								var bn = b['n'].toLowerCase();
								if(an < bn) return -1;
								if(an > bn) return 1;
								return 0;
							}
							else
								return (a['l'] - b['l']);
						});
						break;
					case 2:
						self.srcData.sort(function(a, b)
						{
							if(a['l'] == b['l'])
							{
								var an = a['n'].toLowerCase();
								var bn = b['n'].toLowerCase();
								if(an < bn) return -1;
								if(an > bn) return 1;
								return 0;
							}
							else
								return (b['l'] - a['l']);
						});
						break;
				}

				self._applyFilter();
				self._updateItemCount();
				self._updateFolders(data['folders']);
			},
			data:
			{
				"cmd": "profile",
				"subcmd": "fetchinv"
			},
			dataType: "json"
		});
	},

	_clearFilter : function()
	{
		this._applyFilter(-1, -1, false);
	},

	_updateFolders : function(folderData)
	{
		if(!this.options.foldersEnabled)
			return;

		var html = '',
			self = this;

		var len = folderData.length;
		for(var i = 0; i < len; i++)
		{
			var folder = folderData[i];
			html += '<div class="backpackFolder"><img class="backpackFolderImage" id="backpack-folder-' + folder.a + '" data-folder="' + folder.a + '" src="http://cdn.fallensword.com/folder.gif" border=0 alt="Click to select folder"><br>' + folder.n + '</div>';
		}

		self.folderData = folderData;

		$('#backpackFolders').html(html);
		$('#backpack-folder-' + this.folderId).attr('src', 'http://cdn.fallensword.com/folder_on.gif');
	}
});

})(jQuery);(function($){
	$.widget('hcs.chat', {
		options:
		{
			playerId: -1,
			guildId: -1,
			delayTime: 10,
			pollTime: 3,
			maxPollTime: 6,
			minPollTime: 2
		},

		_create: function() {
			var self = this;
			this.lastIndex = -1;
			this.maxLines = 50;
			this.delaySegments = 5;
			this.chatData = [];
			this.delayCounter = 0;
			this.delayTimer = undefined;
			this.pollTimer = undefined;
			this.waitingForData = false;

			// create segments for chat delay
			$chatDelayIndicator = $('#chat-delay-indicator');
			for(var i = 0; i < this.delaySegments; i++)
			{
				// create a segment div
				$segment = $('<div></div>').attr('id', 'chat-delay-indicator-segment-'+i)
					.attr('class', 'chat-delay-indicator-segment');

				if(i == this.delaySegments-1)
				{
					// add final border
					$segment.addClass('chat-delay-indicator-segment-final');

				}

				$chatDelayIndicator.append($segment);
			}

			$("#chat-div").html("");

			self.fetchChat();

			$('#chat-input-msg').on('keyup', function(event) {
				if(event.keyCode == 13)
					self.sendChat();
			});

			$('#chat-send-button').on('click', function(event) {
				self.sendChat();
			});

			$('#chat-div').on('click', '.chat-report-link', function () {
				if(confirm('Are you sure you wish to report this message?'))
				{
					$.getJSON('index.php',
						{
							'cmd': 'chat',
							'subcmd': 'report',
							'id': $(this).data('chat-id')
						},
						function(data)
						{
							var str = "";
							if(data.error != "")
							{
								str = 'Error: '+data.error;
							}
							else
							{
								str = 'Message Reported';
							}

							$chatError = $('#chat-error');
							$chatError.html(str).fadeIn(200);
							setTimeout(function() {
								$chatError.fadeOut(200);
							}, 5000);
						}
					);
				}
			});

			$('#chat-div').on('click', '.chat-ban-link', function () {
				var self = this;

				if(confirm('Are you sure you wish to ban '+$(this).data('player-name')+' from chat for '+$(this).data('hours')+' hours?'))
				{
					$.getJSON('index.php',
						{
							'cmd': 'chat',
							'subcmd': 'ban',
							'length': $(this).data('hours'),
							'id': $(this).data('chat-id')
						},
						function(data)
						{
							var str = "";
							if(data.error != "")
							{
								str = 'Error: '+data.error;
							}
							else
							{
								str = 'Player "'+ $(self).data('player-name') +'" Banned for '+ $(self).data('hours') +' hours';
							}

							$chatError = $('#chat-error');
							$chatError.html(str).fadeIn(200);
							setTimeout(function() {
								$chatError.fadeOut(200);
							}, 5000);
						}
					);
				}
			});
		},

		sendChat: function()
		{
			var self = this,
				waitingForData = self.waitingForData;

			self.waitingForData = true;

			clearTimeout(self.pollTimer);

			$.getJSON('index.php',
				{
					'cmd': 'chat',
					'subcmd': 'send',
					'lastIndex': self.lastIndex,
					'msg': $('#chat-input-msg').val()
				},
				function(data)
				{
					if(data.error != "")
					{
						// show error
						$chatError = $('#chat-error');
						$chatError.html('Error: '+data.error).fadeIn(200);
						setTimeout(function() {
							$chatError.fadeOut(200);
						}, 5000);
					}
					else
					{
						$('#chat-input-msg').val('');

						if(!waitingForData)
						{
							// process the new chat data
							self.processChatData(data);
							self.waitingForData = false;
						}
					}

					self.pollTimer = setTimeout(function() { self.fetchChat(); }, self.options.pollTime * 1000);
					self.sendingChat = false;
				}
			);
		},

		fetchChat: function()
		{
			var self = this;

			self.waitingForData = true;

			$.getJSON('index.php',
				{
					'cmd': 'chat',
					'subcmd': 'fetch',
					'lastIndex': self.lastIndex
				},
				function(data)
				{
					if(data != undefined)
					{
						self.processChatData(data);
					}

					self.waitingForData = false;
					self.pollTimer = setTimeout(function() { self.fetchChat(); }, self.options.pollTime * 1000);
				}
			);
		},

		processChatData: function(data)
		{
			var self = this;
			var newChatCount = 0;
			$.each(data.chat, function(i, v)
			{
				self.chatData.push(v);

				if(v.id > self.lastIndex)
					self.lastIndex = v.id;
				newChatCount++;
			});

			if(newChatCount >= 1)
			{
				self.options.pollTime--;
				if(self.options.pollTime < self.options.minPollTime)
					self.options.pollTime = self.options.minPollTime;
			}
			else
			{
				self.options.pollTime++;
				if(self.options.pollTime > self.options.maxPollTime)
					self.options.pollTime = self.options.maxPollTime;
			}

			if(this.chatData.length > this.maxLines)
			{
				this.chatData = this.chatData.slice(-this.maxLines);
			}

			if(self.delayTimer != undefined)
			{
				clearTimeout(self.delayTimer);
			}

			self.delayCounter = data.counter;

			if(self.delayCounter > 0)
			{
				self.delayTimer = setTimeout(function() { self.updateTimer(self); }, data.next_tick_seconds * 1000);
			}

			this.updateDisplay();
			this.updateDelayDisplay();
		},

		updateTimer: function(obj)
		{
			obj.delayCounter--;
			if(obj.delayCounter <= 0)
			{
				obj.delayCounter = 0;
			}
			else
			{
				obj.delayTimer = setTimeout(function() { obj.updateTimer(obj); }, obj.options.delayTime * 1000);
			}

			obj.updateDelayDisplay();
		},

		updateDisplay: function()
		{
			var self = this;
			// refresh the chat div
			$chatDiv = $('#chat-div');

			var autoScroll = false;
			if($chatDiv.scrollTop() == $chatDiv[0].scrollHeight || $chatDiv.html() == "")
				autoScroll = true;

			$chatDiv.html('');

			$.each(this.chatData, function(i, v) {
				var $div = $('<div></div>').css({'width': '100%'});

				if(self.options.adminLevel > 0)
				{
					$div.append('<span class="chat-report">[B <a href="#" class="chat-ban-link" data-chat-id="'+ v.id +'" data-player-name="'+ v.username +'" data-hours="2" title="Ban for 2 Hours">2</a> <a href="#" class="chat-ban-link" data-chat-id="'+ v.id +'" data-player-name="'+ v.username +'" data-hours="24" title="Ban for 24 Hours">24</a> <a href="#" class="chat-ban-link" data-player-name="'+ v.username +'" data-chat-id="'+ v.id +'" data-hours="96" title="Ban for 96 Hours">96</a>]</span> ');
				}
				else
				{
					$div.append('<span class="chat-report">[<a href="#" class="chat-report-link" data-chat-id="'+ v.id +'">R</a>]</span> ');
				}

				$div.append('<span class="chat-time">(' + v.time + ')</span> ');
				$div.append('<span class="chat-username"><a href="index.php?cmd=profile&player_id='+ v.player_id +'" style="color: '+ v.color +'">' + v.username + '</a> [' + v.level + ']: </span>');
				$div.append('<span class="chat-msg">'+ v.msg +'</span>');

				if(self.options.playerId == v.player_id)
					$div.addClass('chat-self');

				$chatDiv.append($div);
			});

			// scroll to the bottom of the div
			if(autoScroll)
			{
				$chatDiv.scrollTop($chatDiv[0].scrollHeight);
			}
		},

		updateDelayDisplay: function()
		{
			// update the segments
			for(var i = 0; i < this.delaySegments; i++)
			{
				if(i < this.delayCounter)
					$('#chat-delay-indicator-segment-'+i).addClass('active');
				else
					$('#chat-delay-indicator-segment-'+i).removeClass('active');
			}
		}
	});
})(jQuery);(function($){
	$.widget('hcs.guildchat', {
		options:
		{
			playerId: -1,
			guildId: -1,
			delayTime: 10,
			pollTime: 3,
			maxPollTime: 6,
			minPollTime: 2
		},

		_create: function() {
			var self = this;
			this.lastIndex = -1;
			this.maxLines = 50;
			this.delaySegments = 5;
			this.chatData = [];
			this.delayCounter = 0;
			this.delayTimer = undefined;
			this.pollTimer = undefined;
			this.waitingForData = false;

			// create segments for chat delay
			$chatDelayIndicator = $('#guild-chat-delay-indicator');
			for(var i = 0; i < this.delaySegments; i++)
			{
				// create a segment div
				$segment = $('<div></div>').attr('id', 'guild-chat-delay-indicator-segment-'+i)
					.attr('class', 'chat-delay-indicator-segment');

				if(i == this.delaySegments-1)
				{
					// add final border
					$segment.addClass('chat-delay-indicator-segment-final');

				}

				$chatDelayIndicator.append($segment);
			}

			$("#guild-chat-div").html("");

			self.fetchChat();

			$('#guild-chat-input-msg').on('keyup', function(event) {
				if(event.keyCode == 13)
					self.sendChat();
			});

			$('#guild-chat-send-button').on('click', function(event) {
				self.sendChat();
			});
		},

		sendChat: function()
		{
			var self = this,
				waitingForData = self.waitingForData;

			self.waitingForData = true;

			clearTimeout(self.pollTimer);

			$.getJSON('index.php',
				{
					'cmd': 'guild',
					'subcmd': 'sendchat',
					'lastIndex': self.lastIndex,
					'msg': $('#guild-chat-input-msg').val()
				},
				function(data)
				{
					if(data.error != "")
					{
						// show error
						$chatError = $('#guild-chat-error');
						$chatError.html('Error: '+data.error).fadeIn(200);
						setTimeout(function() {
							$chatError.fadeOut(200);
						}, 5000);
					}
					else
					{
						$('#guild-chat-input-msg').val('');

						if(!waitingForData)
						{
							// process the new chat data
							self.processChatData(data);
							self.waitingForData = false;
						}
					}

					self.pollTimer = setTimeout(function() { self.fetchChat(); }, self.options.pollTime * 1000);
					self.sendingChat = false;
				}
			);
		},

		fetchChat: function()
		{
			var self = this;

			self.waitingForData = true;

			$.getJSON('index.php',
				{
					'cmd': 'guild',
					'subcmd': 'newfetchchat',
					'lastIndex': self.lastIndex
				},
				function(data)
				{
					if(data != undefined)
					{
						self.processChatData(data);
					}

					self.waitingForData = false;
					self.pollTimer = setTimeout(function() { self.fetchChat(); }, self.options.pollTime * 1000);
				}
			);
		},

		processChatData: function(data)
		{
			var self = this;
			var newChatCount = 0;
			$.each(data.chat, function(i, v)
			{
				self.chatData.push(v);

				if(v.id > self.lastIndex)
					self.lastIndex = v.id;
				newChatCount++;
			});

			if(newChatCount >= 1)
			{
				self.options.pollTime--;
				if(self.options.pollTime < self.options.minPollTime)
					self.options.pollTime = self.options.minPollTime;
			}
			else
			{
				self.options.pollTime++;
				if(self.options.pollTime > self.options.maxPollTime)
					self.options.pollTime = self.options.maxPollTime;
			}

			if(this.chatData.length > this.maxLines)
			{
				this.chatData = this.chatData.slice(-this.maxLines);
			}

			if(self.delayTimer != undefined)
			{
				clearTimeout(self.delayTimer);
			}

			self.delayCounter = data.counter;

			if(self.delayCounter > 0)
			{
				self.delayTimer = setTimeout(function() { self.updateTimer(self); }, data.next_tick_seconds * 1000);
			}

			this.updateDisplay();
			this.updateDelayDisplay();
		},

		updateTimer: function(obj)
		{
			obj.delayCounter--;
			if(obj.delayCounter <= 0)
			{
				obj.delayCounter = 0;
			}
			else
			{
				obj.delayTimer = setTimeout(function() { obj.updateTimer(obj); }, obj.options.delayTime * 1000);
			}

			obj.updateDelayDisplay();
		},

		updateDisplay: function()
		{
			var self = this;
			// refresh the chat div
			$chatDiv = $('#guild-chat-div');

			var autoScroll = false;
			if($chatDiv.scrollTop() == $chatDiv[0].scrollHeight || $chatDiv.html() == "")
				autoScroll = true;

			$chatDiv.html('');

			$.each(this.chatData, function(i, v) {
				var $div = $('<div></div>').css({'width': '100%'});

				$div.append('<span class="chat-time">(' + v.time + ')</span> ');
				$div.append('<span class="chat-username"><a href="index.php?cmd=profile&player_id='+ v.player_id +'" style="color: '+ v.color +'">' + v.username + '</a> [' + v.level + ']: </span>');
				$div.append('<span class="chat-msg">'+ v.msg +'</span>');

				if(self.options.playerId == v.player_id)
					$div.addClass('chat-self');

				$chatDiv.append($div);
			});

			// scroll to the bottom of the div
			if(autoScroll)
			{
				$chatDiv.scrollTop($chatDiv[0].scrollHeight);
			}
		},

		updateDelayDisplay: function()
		{
			// update the segments
			for(var i = 0; i < this.delaySegments; i++)
			{
				if(i < this.delayCounter)
					$('#guild-chat-delay-indicator-segment-'+i).addClass('active');
				else
					$('#guild-chat-delay-indicator-segment-'+i).removeClass('active');
			}
		}
	});
})(jQuery);(function($){
	
	$.widget('hcs.nav', {
		
		_create : function()
		{
			this.calcHeights();
			//this._toggle = (Modernizr.csstransitions)?this._toggleCSS:this._toggleJS;
			this._toggle = this._toggleCSS;
			//this._toggle = this._toggleJS;
			this._init();
			this._bind();
		},
		
		_init : function()
		{
			/*var j = this.state.length;
			for(var i=0; i<j; i++)
			{
				var s = this.state[i];
				if(s==1)
					this.element.children(':eq('+i+')').children('ul:first').css('height', this.heights[i]);
			}*/
			
			if(this.state===-1)
				return;
			
			var i = this.state;
			this.element.children(':eq('+i+')').children('ul:first').css('height', this.heights[i]);
		},
		
		_bind : function()
		{
			var self = this;
			
			this.element.bind('click', function(e)
			{
				var $t = $(e.target).parent();
				if ($(e.target).is('.nav-level-1')) {
					
				} else if($t.is('.nav-heading'))
					return self._toggle($t);
				else if($t.parent().is('.nav-heading'))
					return self._toggle($t.parent());
				else if($t.parent().is('.nav-level-0'))
				{
					// top level link (clear state)
					self._saveState(-1);
				}
				return true;
			});
		},
		
		toggle : function(d)
		{
			if(typeof d=="number")
				this._toggleByIndex(d);
			this._toggleByElement(d);
		},
		
		_toggle : function($e)
		{
			// overridden
		},
		
		_toggleByElement : function($e)
		{
			this._toggle($e);
		},
		
		_toggleByIndex : function(i)
		{
			this._toggleByElement(this.element.children(':eq('+i+')'));
		},
		
		_toggleCSS : function($e)
		{
			var $ul = $e.children('ul:first');
			if(!$ul.hasClass('nav-animated'))
				$ul.addClass('nav-animated');
			var h = 0;
			if($ul.height()<=0)
			{
				h = this.heights[$e.index()];
				
				// close currently open
				if(this.state!=-1)
				{
					this.element.children(':eq('+this.state+')').children('ul:first').css({'height': 0, 'display': 'none'});
				}
				
				$ul.css('display', 'block');
			}

			$ul.css('height', h);
			this._saveState($e.index());
			return false;
		},
		
		/*_toggleJS : function($e)
		{
			var $ul = $e.children('ul:first');
			var h = 0, s = 0;
			if($ul.height()<=0)
			{
				h = this.heights[$e.index()]
				
				// close currently open
				if(this.state!=-1)
					this.element.children(':eq('+this.state+')').children('ul:first').css('height', 0);
			
				$ul.removeClass('nav-hidden');
			}
			else
			{
				$ul.addClass('nav-hidden');
			}
		
			//$ul.animate({height: h}, 200);
			$ul.attr("height", h);
			this._saveState($e.index());
			return false;
		},*/
		
		_saveState : function(id)
		{
			//var id = this.element.attr('id');
			
			if(!Modernizr.localstorage)
				return;
			//localStorage.setItem('hcs.nav.'+id, this.state.join('|'));
			this.state = id;
			localStorage.setItem('hcs.nav.openIndex', id);
		},
		
		_fetchState : function()
		{
			if(!Modernizr.localstorage)
				return -1;
			
			// see if we have state data stored
			//return (localStorage.getItem('hcs.nav.'+id)===null)?[]:localStorage.getItem('hcs.nav.'+id).split('|');
			return (localStorage.getItem('hcs.nav.openIndex')==='undefined' || localStorage.getItem('hcs.nav.openIndex')===null)?-1:localStorage.getItem('hcs.nav.openIndex');
		},
		
		calcHeights : function()
		{
			var heights = [];
			var headings = this.element.children();
		
			// initialize heights offscreen
			var $offMenu = this.element.clone();
			
			$offMenu.find('*')
						.andSelf()
						.removeClass('nav-closed');
			$offMenu.css({
				position:'absolute',
				top: 0,
				left: 0,
				width: 300
			});
			$offMenu.appendTo($('body'));
			
			$offMenu.children().each(function(i)
			{
				heights[i] = $(this).children('ul:first').height();
			});
			
			this.state = this._fetchState();
			
			$offMenu.remove();
			this.heights = heights;
			this.headings = headings;
		}
	});
	
	$(function()
	{
		$('#dialog_msg').dialog({ resizable: false, draggable: false, autoOpen: false });
		$('#nav').nav();
		
		// Quick Buff
		$(".guild-buff-check-off").on('click', function(){ return switchQB(this, 'guild', true); });
		$(".guild-buff-check-on").on('click', function(){ return switchQB(this, 'guild', false); });
		
		$(".ally-buff-check-off").on('click', function(){ return switchQB(this, 'ally', true); });
		$(".ally-buff-check-on").on('click', function(){ return switchQB(this, 'ally', false); });
		
		$("#guild-quick-buff").click(function(){
			var sendstring = "";
			$(".guild-buff-check-on").each(function(){
				if (sendstring.length != "")
				{
					sendstring = sendstring + ',' + $(this).data('name');
				}
				else
				{
					sendstring = $(this).data('name');
				}
			});
			openWindow('index.php?cmd=quickbuff&t='+sendstring, 'fsQuickBuff', 618, 500, ',scrollbars');
		});
		
		$("#ally-quick-buff").click(function(){
			var sendstring = "";
			$(".ally-buff-check-on").each(function(){
				if (sendstring.length != "")
				{
					sendstring = sendstring + ',' + $(this).data('name');
				}
				else
				{
					sendstring = $(this).data('name');
				}
			});
			openWindow('index.php?cmd=quickbuff&t='+sendstring, 'fsQuickBuff', 618, 500, ',scrollbars');
		});
	});
	
	function switchQB(object, mode, status)
	{
		if (status)
		{
			$(object).addClass(mode + '-buff-check-on');
			$(object).removeClass(mode + '-buff-check-off');
		}
		else
		{
			$(object).addClass(mode + '-buff-check-off');
			$(object).removeClass(mode + '-buff-check-on');
		}
		
		return false;
	}

})(jQuery);(function($) {
	// Tutorial Widget
	// ********************
	$.widget('legacy.tutorial', {

		options:
		{
			id: 'tutorials',													// ID of parent $container
			box_spacing: 10,													// Distance in pixels between dropped boxes
			arrow_space: 2,														// Distance in pixels arrow lands away from object edge
			arrow_start: 100,													// Distance in pixels arrow starts away from object edge
			drop_speed: 0.5,													// Speed multiplier of addBox animation
			shunt_speed: 0.3,													// Speed multiplier for reposBoxes animation
			arrow_speed: 0.2,													// Speed multiplier of flying arrow animation
			easing: 'easeOutBounce',											// Easing method of dropping animation
			arrow_easing: 'easeOutBounce',										// Easing method of flying arrow animation
			tip_closed: 120,													// Closed width of tutorial
			tip_open: 250,														// Opened out width of tutorial
			default_text: 'Click to open!',										// Text displayed on closed tutorials
			close_text: 'Close this Dialog',									// Button text on killable tutorials
			arrows: [															// Image file for arrow highlighting
								'http://cdn.fallensword.com/tutorial/arrow_1.png',
								'http://cdn.fallensword.com/tutorial/arrow_2.png',
								'http://cdn.fallensword.com/tutorial/arrow_3.png',
								'http://cdn.fallensword.com/tutorial/arrow_4.png',
								'http://cdn.fallensword.com/tutorial/arrow_5.png'
							],
			arrowPos: [],
			preload: [],																// List of images to preload
			dataUrl: 'index.php?cmd=tutorial&subcmd=fetch',
			data: {},
			openBoxId: -1,
			inited: false
		},

		_create: function()
		{
			var self = this;
			$container = ( this.$container = $('<div/>', { 'id': this.options.id }).appendTo(this.element) );

			// Preload images, drops will not trigger until window load
			var cache = ( this.cache = [] );

			$.each(this.options.preload, function(){
				var cacheImage = document.createElement('img');
				cacheImage.src = this;
				cache.push(cacheImage);
			});

			this.tutorialList = this.options.data;
			this.arrowList = [];

			// create the boxes
			$.each(this.tutorialList, function(key, val)
			{
				self.addBox(val);
			});

			self.options.inited = true;

			// update arrow callback
			setInterval(function()
			{
				self.updateArrows();
			}, 100);
		},

		refresh: function()
		{
			var self = this;

			if(!self.options.inited)
				return;

			// fetch new data
			$.ajax({
				type: 'POST',
				url: self.options.dataUrl,
				success: function(newData)
					{
						// compare data
						$.each(newData, function(key, val)
						{
							var updatedTutorialData = newData[key];
							var storedTutorialData = self.tutorialList[key];

							// check if this tutorial box already exists
							if(storedTutorialData===undefined)
							{
								// add it
								self.tutorialList[key] = val;
								self.addBox(self.tutorialList[key]);
								// continue
								return true;
							}

							// check if objective data has changed
							var totalValue = 0;
							$.each(storedTutorialData.objective, function(objK, objV)
							{
								// check if the value has changed
								if(updatedTutorialData.objective[objK].value!=objV.value)
								{
									$('#tutorial-box-'+key+' .tutorial-objective-'+objK+'-value').html(updatedTutorialData.objective[objK].value);

									if(updatedTutorialData.objective[objK].value==objV.complete)
										$('#tutorial-box-'+key+' .tutorial-objective-'+objK).addClass('tutorial-objective-completed');

									// update the stored objective data
									storedTutorialData.objective[objK].value = updatedTutorialData.objective[objK].value;
								}

								if(val.objective[objK].value==objV.complete)
								{
									totalValue+=parseInt(objK);
								}

								// check if this objective is completed
								var completed = false;
								if(val.objective[objK]['value']==val.objective[objK]['complete'])
									completed = true;

								if(completed)
								{
									// continue
									return true;
								}
							}); // end of objective loop

							// check if all objectives are complete
							if(totalValue==storedTutorialData.complete)
							{
								self.removeBox(key);
							}
						});

						// check for tutorials that no longer exist (ie. completed)
						$.each(self.tutorialList, function(key, val)
						{
							if(newData[key]===undefined)
							{
								// mark all objectives as completed
								$.each(val.objective, function(objK, objV)
								{
									$('#tutorial-box-'+key+' .tutorial-objective-'+objK+'-value').html(objV.complete);
									$('#tutorial-box-'+key+' .tutorial-objective-'+objK).addClass('tutorial-objective-completed');
								});

								// remove it
								self.removeBox(key);
							}
						});
					},
			dataType: 'json'});
		},

		// Called to spawn a static box or animate a dropped box
		addBox: function(properties)
		{
			var self = this,
				land_at = self.options.box_spacing, // Landing coordinates
				$wrapper = $('<div/>', { 'id': 'tutorial-box-'+properties.id, 'class': 'tutorial' }) // Wrapping div container
					.appendTo(self.$container),
				$img = $('<img/>', { 'class': 'tutorialimg', 'src': properties.icon_off })	// Tutorial image
					.data('on', properties.icon_on)
					.data('off', properties.icon_off)
					.appendTo($wrapper)
					.click(function(){
						if ($(this).parent().width() < self.options.tip_open) {
							$.post('index.php', { 'target': properties.id, 'cmd': 'tutorial', 'subcmd': 'open' });
							self.openBox($img, $box, $wrapper, properties);
						} else {
							$.post('index.php', { 'target': 0, 'cmd': 'tutorial', 'subcmd': 'close' });
							self.closeAll();
							self.reposBoxes(true);
						}
					}),
				$box = $('<div/>', { 'class': 'tutorialinner' }) // Tutorial text box
					.html('<span class="tutorialhead1">' + properties.title + '</span><p>' + self.options.default_text + '</p>')
					.css('width', self.options.tip_closed + 'px')
					.appendTo($wrapper);

			// Determine landing coordinates, captain!
			$('.tutorial', self.$container).each(function(){
				land_at += $(this).height() + self.options.box_spacing;
			});

			land_at -= $wrapper.height() + self.options.box_spacing;

			// Pre-open box if specified in properties
			if (properties.open == true) {
				self.openBox($img, $box, $wrapper, properties);
			}

			// Drop box from the sky?
			if (properties.landed == true) {
				$wrapper.css('bottom', land_at + 'px' );
			} else {
				$wrapper
					.css('bottom', $(window).height() + 'px' )
					.animate({ 'bottom': land_at }, Math.floor( ($(window).height() - land_at) / self.options.drop_speed ), self.options.easing);
			}
		},

		// Expand and fill in content for a box
		openBox: function($img, $box, $wrapper, properties)
		{
			var self = this;

			this.closeAll();

			$img.attr('src', $img.data('on'));
			self.openBoxId = properties.id;

			// create any objective text
			var objText = '',
				i = 1;

			for(var k in properties.objective)
			{
				var obj = properties.objective[k];
				var completedClass = '';
				if(obj['value']==obj['complete'])
					completedClass = ' tutorial-objective-completed';
				objText += '<p class="tutorial-objective-'+i+completedClass+'">'+obj['string']+' (<span class="tutorial-objective-'+i+'-value">'+obj['value']+'</span>/'+obj['complete']+')</p>';
				i++;
			}

			$box
				.css('width', this.options.tip_open + 'px')
				.children('span')
					.addClass('tutorialhead2')
				.end()
					.children('p')
						.html(properties.content + objText);
			$wrapper.addClass('tutorial-open');

			if (properties.killable == true) {
				var $kill = $('<input/>', { 'type': 'button', 'value': self.options.close_text })
					.appendTo($box)
					.click(function(){
						$.post('index.php', { 'target': properties.id, 'cmd': 'tutorial', 'subcmd': 'kill' }, function(){
								$wrapper.remove();
								self.reposBoxes(true);

								// Remove arrow if found
								if (typeof self.$arrow !== 'undefined') {
									self.$arrow.remove();
								}
							});
						});
			}

			this.reposBoxes(false);
		},

		removeBox: function(tutorialId)
		{
			var self = this;

			// Remove arrow if found
			$('.tutorialarrow').each(function(){
				$(this).remove();
			});

			$('#tutorial-box-'+tutorialId).fadeOut(500, function()
				{
					$(this).remove();

					if(self.openBoxId==tutorialId)
					{
						self.openBoxId = -1;
					}

					self.reposBoxes(true);
					// remove the tutorial data
					delete self.tutorialList[tutorialId];
				});
		},

		// Close all boxes in to smaller boxes without main content
		closeAll: function()
		{
			var self = this;

			// Shrink all tutorials
			$('.tutorialinner', this.$container).each(function(){
				var $this = $(this);

				if ($this.width() == self.options.tip_open) {
					$this.parent().removeClass('tutorial-open');
					$this
						.css('width', self.options.tip_closed + 'px')
						.children('span')
							.removeClass('tutorialhead2')
					.end()
						.children('p')
							.html(self.options.default_text)
					.end()
						.children('input')
							.remove();
				}
			});

			// Switch off all icons
			$('.tutorialimg', this.$container).each(function(){
				$(this).attr('src', $(this).data('off'));
			});

			// Remove arrow if found
			$('.tutorialarrow').each(function(){
				$(this).remove();
			});
		},

		// Bump all boxes up or down depending on new heights, animate for dropping down
		reposBoxes: function(animate)
		{
			var self = this;
			var land_at = self.options.box_spacing;

			// Cycle through and shunt wrappers
			$('.tutorial', this.element).each(function(){
				$(this).stop(false, true);

				// Only animates on dropping, not rising
				if (animate) {
					$(this).animate({ 'bottom': land_at }, Math.floor( (parseInt($(this).css('bottom')) - land_at) / self.options.shunt_speed ), self.options.easing);
				} else {
					$(this).css('bottom', land_at + 'px');
				}
				land_at += $(this).height() + self.options.box_spacing;
			});
		},

		checkElement: function(elementSelector, secondarySelector)
		{
			$highlightElement = $(elementSelector);

			if(!$highlightElement)
				return [];

			// special cases
			if(elementSelector=="#nav-character-profile")
			{
				// check parent is visible
				if($highlightElement.parent().parent().height()<=0)
					return [];
			}

			if($highlightElement.length>0 && $highlightElement.is(':visible'))
			{
				// check that secondary selector doesn't exist (used to not show arrow on a certain page)
				if(secondarySelector!="")
				{
					if($(secondarySelector).length>0)
					{
						return [];
					}
				}
				return $highlightElement;
			}
			return [];
		},

		updateArrows: function()
		{
			var self = this;

			// check objectives of currently open tutorial
			if(self.openBoxId==undefined || self.openBoxId==-1)
				return;

			var activeTutorial = self.tutorialList[self.openBoxId];
			if(activeTutorial.objective===undefined)
				return;

			for(var i in activeTutorial.objective)
			{
				// check if this requires a highlight
				var obj = activeTutorial.objective[i];
				if(obj.highlight===undefined)
					continue;

				// check if there is a suitable highlight available for the arrow
				var $highlightElement;
				var highlightIndex = -1;
				for(var j=0; j<obj.highlight.length; j++)
				{
					$highlightElement = self.checkElement(obj.highlight[j][0], obj.highlight[j][1]);
					if($highlightElement.length>0)
					{
						highlightIndex = j;
						break;
					}
				}

				// test if the arrow currently exists
				if(self.arrowList[i]!==undefined)
				{
					if($highlightElement.length<=0)
					{
						// element no longer exists so remove the arrow
						self._removeArrow(self.arrowList[i]);
						delete self.arrowList[i];
					}
					else
					{
						if(self.arrowList[i].is(':animated'))
							return;

						// check to see if the arrow needs moved
						var curPos = self.arrowList[i].offset();

						// make adjustments
						var targetPos = self._getArrowPosFromElement(self.arrowList[i], $highlightElement);
						targetPos.x += obj.highlight[j][2] - self.options.arrow_space;
						targetPos.y += obj.highlight[j][3];

						if(curPos.left!=targetPos.x || curPos.top!=targetPos.y)
						{
							// arrow needs to be moved
							self.arrowList[i].animate({left: targetPos.x, top: targetPos.y});
						}

					}
				}
				else if($highlightElement.length>0)
				{
					// arrow needs to be spawned
					self.arrowList[i] = self._spawnArrow(i, $highlightElement, obj.highlight[highlightIndex][2], obj.highlight[highlightIndex][3]);
				}
			}
		},

		_spawnArrow: function(i, $element, offsetX, offsetY)
		{
			var self = this;
			var position = $element.offset();
			$arrow = $('<img/>', { 'src': self.options.arrows[i-1], 'id': 'tutorial-arrow-'+i,'class': 'tutorialarrow', 'z-index': 9999 })
			.load(function() {
				// Fly in only after image has loaded
				$(this).appendTo('body');

				var targetPos = self._getArrowPosFromElement($(this), $element);
				$(this).css({
						'top': (targetPos.y + offsetY) + 'px',
						'left': (targetPos.x - self.options.arrow_start) + 'px',
						'opacity': 0
					})
					.animate({
							'top': (targetPos.y + offsetY),
							'left': (targetPos.x - self.options.arrow_space + offsetX),
							'opacity': 1
						},
						1000,
						self.options.arrow_easing
					);
			})
			.click(function(){
				// If arrow is in the way of something else, click to remove it
				$.post('index.php', { 'cmd': 'tutorial', 'subcmd': 'close' });
				self.closeAll();
				self.reposBoxes(true);
			});

			return $arrow;
		},

		_removeArrow: function($arrow)
		{
			$arrow.remove();
			//$arrow.fadeOut(500, function() { $(this).remove(); });
		},

		_getArrowPosFromElement: function($arrow, $element)
		{
			var self = this;
			var position = $element.offset();
			var x = position.left - $arrow.width();
			var y = Math.floor((position.top + ($element.height() / 2)) - ($arrow.height() / 2));

			return {'x': x, 'y': y};
		}
	});
})(jQuery);$(function(){
	submitForm('#notepad_saveChanges', {"cmd": "notepad", "subcmd": "update", "ajax": "1"}, '#notepad_form', function(data){
		$('#dialog_msg')
			.html("Notepad saved successfully!")
			.dialog('option', {'title': "Notepad Saved"})
			.dialog('open');
	});
});
