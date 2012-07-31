function ConverterController($scope){
	$scope.lines = [];
	$scope.op = {
		cpy: {
			replace: /cpy (..),(..)/i,
			"with": function(vars){
				//this = main.prototype.op
				return {
					OpBits: "0101",
					Drain: op.reg(vars[1]), 
					Source: op.reg(vars[2]),
					Alu: "00000000", 
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
					Alu: "00000000", 
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
		}
	}
	$scope.meta = {
		reg: function(a){
			return (op.regs[a] || "??");
		},
		regs: {
			ax: "00",
			bx: "01",
			cx: "10",
			dx: "11",
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
		}
	}
	var op = $scope.meta;
	$scope.update = function(){
		$scope.lines = $scope.text.split('\n');
		console.log("asd")
		for (var i = 0; i < $scope.lines.length; i++) {
			$scope.lines[i] = $scope.convertLine($scope.lines[i]);
		};
		console.log($scope.lines)
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