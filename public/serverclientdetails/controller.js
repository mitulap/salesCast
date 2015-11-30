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


var param_array = window.location.href.split('?')[1].split('&')[0];
var counter_array=window.location.href.split('?')[1].split('&')[1];
$scope.sprmrkt=param_array.split('=')[1];
$scope.countr=counter_array.split('=')[1];
//$scope.product.supermarketId=param_array.split('=')[1];
//alert($scope.product.supermarketId)


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
	
	var sendSuper=param_array.split('=')[1];
	var counter=counter_array.split('=')[1];
	$http.post('/productDetailsRead/'+sendSuper+'/'+counter,sendDetails).success(function(response){
			
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


$scope.execute=function(){
	var sendDetails=JSON.stringify($scope.productDetails);
	
	
	$http.post('/productDetailsExecute',sendDetails).success(function(response){
			
			$scope.stockDetails=response;
			
			console.log("In the stock Details")
			console.log($scope.stockDetails)

			
	});
}


$scope.remove=function(p){
	
	var index = -1;		
		var comArr = eval( $scope.productDetails );
		for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].name === p.product_id ) {
				index = i;
				break;
			}
		}
		if( index == -1 ) {
			//alert( "Something gone wrong" );
		}
		$scope.productDetails.splice( index, 1 );	
};



}]);
