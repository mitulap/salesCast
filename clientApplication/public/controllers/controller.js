var myApp = angular.module('MyApp', []);

myApp.controller('MainController',['$scope','$http', function($scope, $http){

	console.log("Hello world from registrationController!")

	$scope.rows = ['<td><input type="text" class="form-control input-small" id="productId_1" ng-model="checkOutData.productId_1" placeholder="Product ID"></td><td><input type="text" class="form-control input-small" id="quantity_1" ng-model="checkOutData.quantity_1" placeholder="Product Quantity"></td>'];
  
  	$scope.counter = 2;
  
	$scope.addRow = function() {
		//$scope.rows.push('Row ' + $scope.counter);
	    $scope.rows.push('<td><input type="text" class="form-control input-small" id="productId_'+ $scope.counter +'" ng-model="checkOutData.productId_'+ $scope.counter +'" placeholder="Product ID"></td><td><input type="text" class="form-control input-small" id="quantity_'+ $scope.counter +'" ng-model="checkOutData.quantity_'+ $scope.counter +'" placeholder="Product Quantity"></td>');
	    $scope.counter++;
	}

	$scope.getProductData = function(){
		console.log($scope.checkOutData);
		$http.post('/productDetails', $scope.checkOutData).success(function(response){
			//$scope._rows = response.productInfo;
			//$scope.resData = response[0].productInfo[0];
			$scope.resData = response[0].productInfo;
			console.log($scope.resData);
		});
	};

	$scope.sendCheckOutData = function(){
		console.log($scope.checkOutData);
		var val;
		var tbl = $('table#checkOut tr').get().map(function(row) {

		  return $(row).find('td').get().map(function(cell) {
		  	var id;
		  	if(!($(cell).html().indexOf("input") > -1)){
		  		id = String($(cell).html());
		  		//alert(typeof(id));
		  		val = document.getElementById(id).value;
		  	}
		  	if($(cell).html().indexOf("input") > -1){
		  		return val;
		  	}
		    return $(cell).html();
		  });
		});
			console.log(tbl);

		$http.post('/sendCheckOutDataToServer/' + $scope.checkOutData.marketId, tbl ).success(function(response){
			//$scope._rows = response.productInfo;
			//$scope.resData = response[0].productInfo[0];
			$scope.resData = response[0].productInfo;
			console.log($scope.resData);
			$scope.serverResponse = response;
		});
		/*$http.post('/sendCheckOutDataToServer', $scope.checkOutData).success(function(response){
			//$scope._rows = response.productInfo;
			//$scope.resData = response[0].productInfo[0];
			//$scope.resData = response[0].productInfo;

			var tbl = $('table#whatever tr').map(function() {
			  return $(this).find('td').map(function() {
			    return $(this).html();
			  }).get();
			}).get()
			console.log(tbl);
		});*/
	};


}]);

