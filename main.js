$("#reveal").click(function(){
	$("#doc").reveal();
})
function ConverterController($scope){
	$scope.lines = [];
	$scope.text = localStorage["opts"];
	$scope.op = {
		cpy: {
			replace: /cpy (..),(..)/i,
			"with": function(vars){
				//this = main.prototype.op
				return {
					OpBits: "0101",
					Drain: op.reg(vars[1]), 
					Source: op.reg(vars[2]),
					Alu: "0000", 
				};
			},
		},
		mov: {
			replace: /mov (..),(..)/i,
			"with": function(vars){
				//this = main.prototype.op
				return {
					OpBits: "0101",
					Drain: op.reg(vars[1]), 
					Source: op.reg(vars[2]),
					Alu: "0000", 
				};
			},
		},
		movn: {
			replace: /movn (..)\,([0-9a-fA-F]{1,8})/i,
			"with": function(vars){
				return {
					OpBits: "0010",
					Drain: op.reg(vars[1]),
					Source: "00",
					Alu: op.num(vars[2]),
				}
			}
		},
		"alu enable": {
			replace: /alu enable (.+)/i,
			"with": function(vars){
				return {
					OpBits: "0110",
					Drain: "00",
					Source: "00",
					Alu: op.aluSelector(vars[1]),
				};
			},
		},
		"value to": {
			replace: /value to (..),(..)/i,
			"with": function(vars){
				return {
					OpBits: "00"+op.reg[vars[1]],
					Drain: "00",
					Source: "00",
					Alu: "0000",
				};
			}, 
		},
		"ax to cx": {
			replace: /ax to cx (..),(..)/i,
			"with": function(){
				return {
					OpBits: "0100",
					Drain: "00",
					Source: "00",
					Alu: "0000",
				};
			},
		},
		"no-op": {
			replace: /no-op (..),(..)/i,
			"with": function(vars){
				return {
					OpBits: "1111",
					Drain: "00",
					Source: "00",
					Alu: "00000000",
				}
			}
		},
	}
	$scope.meta = {
		reg: function(a){
			return (op.regs[a.toLocaleLowerCase()] || "??");
		},
		regs: {
			ax: "10",
			bx: "01",
			ix: "11",
			dx: "00",
		},
		aluSelector: function(string){
			string = string.toLocaleLowerCase();
			console.log(string)
			return op.alu[string];
		},
		alu: {
			add: "0000",
			sub: "0001",
			incdx: "0010",
			incbx: "0011",
			decdx: "0100",
			decbx: "0101",
			and: "0110",
			xor: "0111",
			or: "1000",
		},
		num: function(a){
			if(a.match(/[01]{1,8}/i)){
				return op.binnum(a);
			}else if(a.match(/[0-9]{1,8}/i)){
				return op.decnum(a);
			}else if(a.match(/[0-9a-fA-F]{1,2}/i)){
				return op.hexnum(a);
			};
		},
		hexnum: function(a){
			return parseInt(a, 16).toString(2)
		},
		binnum: function(a){
			return a;
		},
		decnum: function(a){
			return parseInt(a).toString(2);
		},
	}
	var op = $scope.meta;
	$scope.update = function(){
		$scope.lines = $scope.text.split('\n');
		for (var i = 0; i < $scope.lines.length; i++) {
			$scope.lines[i] = $scope.convertLine($scope.lines[i]);
		};
		localStorage["opts"] = $scope.text;
	};
	$scope.convertLine = function(line){
		for(i in $scope.op){
			var exp = $scope.op[i]
			if(typeof line == 'string' && line.match(exp.replace)){
				var RegExpOutp = exp.replace.exec(line);
				line = exp.with(RegExpOutp);
			}
		};
		return line;
	}
}