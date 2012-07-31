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
	}
	$scope.meta = {
		reg: function(a){
			return op.regs[a]
		},
		regs: {
			ax: "00",
			bx: "01",
			cx: "10",
			dx: "11",
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
			if(line.match(exp.replace)){
				var RegExpOutp = exp.replace.exec(line);
				line = exp.with(RegExpOutp);
			}
		};
		return line;
	}

}