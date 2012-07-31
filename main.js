var converte = (function(){
	var main = function(text){
		text.split("\n");
		for (var i = 0; i < text.length; i++) {
			text[i]
		};
	}
	main.prototype.op = {
		cpy: {
			replace: /cpy (..),(..)/i,
			"with": function(vars){
				//this = main.prototype.op
				return ["0101", op.reg(vars[0]), op.reg(vars[1])];
			},
		},
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
	var op = main.prototype.op;
	return main;
})()

function ConverterController($scope){
	$scope.lines = []
	$scope.update = function(){
		$scope.lines = $scope.text.split('\n');
		for (var i = 0; i < $scope.lines.length; i++) {
			$scope.convertLine($scope.lines[i])
		};
	}
	$scope.convertLine = function(line){
		
	}  	
}