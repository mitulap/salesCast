var myApp = angular.module('SalesCastCreate', []);


myApp.controller('CreateCtrl', ['$scope', '$http', function($scope, $http) {

	var refresh = function(){
		console.log("refresh");
		$http.get('/counterlist').success(function(response){
        	console.log("I got the data I requested");
        	$scope.counterlist = response;
        	$scope.counter = "";
        	console.log($scope.counterlist);
    	});
	};

	refresh();

	$scope.addCounter = function(){
		console.log($scope.counter);
		$http.post('/addCounter',$scope.counter).success(function(response){
			console.log(response);
			refresh();
		});
	};

	$scope.removeCounter = function(id){
		console.log("Removing counter");
		$http.delete('/removeCounter/' + id).success(function(response){
			refresh();
		});
	};
}]);