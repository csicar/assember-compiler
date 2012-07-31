var converter = (function(){
  function toHTML(input){
		return '<span class="command">'+
					'<span class="op-bits">'+input[0]+'</span>'+
					'<span class="sel-bits-1">'+input[1]+'</span>'+
					'<span class="sel-bits-2">'+input[2]+'</span>'+
					'<span class="alu">'+input[3]+'</span>'+
				'</span>';
  }
  var exp = {
		cpy: {
			replace: /cpy (..)\,(..)/i,
			with: ["0101","{reg: $1}","{reg: $2}", "000000000"],
		},
		mov: {
			replace: /mov (..)\,(..)/i,
			with: ["0101", "{reg: $1}", "{reg: $2}", "00000000"],
		},
		"no operation": {
			replace: /no operation/i,
			with: ["1111", "00", "00", "00000000"],
		},
		"alu enable": {
			replace: /no operation/i,
			with: ["0110", "00", "00", "00000000"],
		},
		"mov n": {
			replace: /movn (..)\,([0-9a-fA-F]{1,8})/i,
			with: '<span class="command">'+
					'<span class="op-bits">0010</span>'+
					'<span class="sel-bits-1">{reg: $1}</span>'+
					'<span class="sel-bits-2">00</span>'+
					'<span class="alu">{num: $2}</span>'+
					'<span class="gpu">0</span>'+
				  '</span>',
		},
		reg: {
			replace: /\{reg: ax\}/i,
			with: function(){return "00"},
		},
		bx: {
			replace: /\{reg: bx\}/i,
			with: "01",
		},
		cx: {
			replace: /\{reg: cx\}/i,
			with: "10"
		},
		dx: {
			replace: /\{reg: dx\}/i,
			with: "11",
		},
		binnum: {
			replace: /\{num: ([01]{8})\}/i,
			with: "$1",
		},
		hexnum: {
			replace: /\{num: ([0-9a-fA-F]{1,2})\}/i,
			with: function(string){
				return parseInt(string[1], 16).toString(2);
			},
		},
	};
	function parse(string){
		for(i in exp){
			while(string.match(exp[i]["replace"])){
				if(typeof exp[i]["with"] == 'string'){
					string = string.replace(exp[i]["replace"], exp[i]["with"]);
				}else if(typeof exp[i]["with"] == 'function'){
					var RegExpOutp = exp[i].replace.exec(string);
					var RegExpFuncOutp = exp[i].with(RegExpOutp);
					string = string.replace(exp[i].replace, RegExpFuncOutp);
				}else{
					for (var n = 0; n < exp[i]["with"].length; i++) {
						string = string.replace(exp[i]["replace"], exp[i]["with"][n]);
					};
				};
			};
		};
		return toHTML(string);	
	};
	function ret(input, opt){
		var outp = "";
		input = input.split("\n");
		for (var i = 0; i < input.length; i++) {
			outp += parse(input[i])+"<br>";
		};	
		return outp;
	};
	ret.prototype.exp = exp;
	ret.prototype.parse = parse;
	return ret;
})();
localStorage["operations"] = localStorage["operations"] || "";
$("textarea").html(localStorage["operations"])
$("textarea").keyup(update);
$(update);
function update(){
	$(".outp").html(converter($("textarea").attr("value"), "html"))
	localStorage["operations"] = $("textarea").attr("value")
}
