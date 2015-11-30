var myApp = angular.module('updateApp', []);

myApp.controller('updateregistrationController',['$scope','$http', function($scope, $http){

	console.log("Hello world from registrationController!")

	$http.get('/populate').success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("No supermarkets in database");
		}
		else{
			
			$scope.supermarkets=response;

			console.log($scope.supermarkets)
		}

	});


	$scope.discover=function(){
	
	$http.post('/discoverSupermarket', $scope.discoverClient).success(function(response){
		

			$scope.superDetails=response;
				console.log($scope.superDetails)
			$scope.superDetails.client_id=response[0].client_id;
			$scope.superDetails.client_name=response[0].client_name;

			$scope.superDetails.address=response[0].address;
			$scope.superDetails.regId=response[0].regId;

			$scope.superDetails.contact=response[0].contact;
			//$scope.superDetails.contac=response[0].contact;
			
		

	});
};

	
	$scope.updateSupermarket = function(){
		console.log($scope.superDetails);
			//$scope.superDet=$scope.superDetails;
			
			//var sendDetails=JSON.stringify($scope.superDetails)
			$http.post('/updateRegInfo', $scope.superDetails).success(function(response){
				console.log(response);
				$scope.resData = response;
		});
	};

}]);

