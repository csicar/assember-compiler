var converter = (function(){
  var exp = {
		cpy: {
			replace: /cpy (..)\,(..)/i,
			with: '<span class="command">'+
					'<span class="op-bits">0101</span>'+
					'<span class="sel-bits-1">{reg: $1}</span>'+
					'<span class="sel-bits-2">{reg: $2}</span>'+
					'<span class="alu">0000000</span>'+
					'<span class="gpu">0</span>'+
				  '</span>',
		},
		mov: {
			replace: /mov (..)\,(..)/i,
			with: '<span class="command">'+
					'<span class="op-bits">0101</span>'+
					'<span class="sel-bits-1">{reg: $1}</span>'+
					'<span class="sel-bits-2">{reg: $2}</span>'+
					'<span class="alu">0000000</span>'+
					'<span class="gpu">0</span>'+
				  '</span>',
		},
		"no operation": {
			replace: /no operation/i,
			with: '<span class="command">'+
					'<span class="op-bits">1111</span>'+
					'<span class="sel-bits-1">00</span>'+
					'<span class="sel-bits-2">00</span>'+
					'<span class="alu">0000000</span>'+
					'<span class="gpu">0</span>'+
				  '</span>',
		},
		"alu enable": {
			replace: /no operation/i,
			with: '<span class="command">'+
					'<span class="op-bits">0110</span>'+
					'<span class="sel-bits-1">00</span>'+
					'<span class="sel-bits-2">00</span>'+
					'<span class="alu">0000000</span>'+
					'<span class="gpu">0</span>'+
				  '</span>',
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
		ax: {
			replace: /\{reg: ax\}/i,
			with: "00",
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
			replace: /\{num: ([0-9a-fA-F]{1,8})\}/i,
			with: function(num){
				return parseInt(num, 16)
			},
		},
	};
	function parse(string){
		for(i in exp){
			while(string.match(exp[i]["replace"])){
				if(typeof exp[i]["with"] == 'string'){
					string = string.replace(exp[i]["replace"], exp[i]["with"]);
				}else{
					var RegExpOutp = exp[i].replace.exec(string);
					var RegExpFuncOutp = exp[i].with(RegExpOutp[1], RegExpOutp[2], RegExpOutp);
					string = string.replace(exp[i].replace, RegExpFuncOutp);
				};
			};
		};
		return string;	
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
