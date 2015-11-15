var myApp = angular.module('application',[]);

myApp.controller('discover', ['$scope', '$http', function($scope, $http) {


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
	
	$http.post('/discover', $scope.discoverClient).success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("Not a valid Supermarket/ No counters registered");
		}
		else{
			
			$scope.clientDetails=response;
			console.log($scope.clientDetails)
		}

	});
};

$scope.read=function(){

	//read

};

	




}]);

myApp.controller('shelf',['$scope','$http', function($scope,$http){

$http.get('/populateProduct').success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("No products in database");
		}
		else{
			
			$scope.products=response;
			console.log($scope.products)
		}

	});

			$scope.productDetails=[];	
$scope.displayProduct=function(){

	$http.post('/productDetails', $scope.product).success(function(response){

		if(response==undefined || response==null ||response[0]==null){
			alert("Not a valid Supermarket");
		}
		else{
		
			$scope.productDetails.push(response[0]);
			
			$scope.product.productId="";
			console.log($scope.productDetails);
			
			

		}

	});
}

$scope.requestRead=function(){
	var sendDetails=JSON.stringify($scope.productDetails);
	
	
	$http.post('/productDetailsRead',sendDetails).success(function(response){
			
			$scope.shelfDetails=response;
			var details=$scope.shelfDet
			console.log("In the product Details")
			console.log($scope.shelfDetails)

			
	});
	


	/*$http.post('/shelfDetails',$scope.shelfDet).success(function(response){
				console.log("HIIIII")
				console.log($scope.shelfDet);
				$scope.shelfDetails=response;
				
				console.log(response);

			});*/
}




}]);