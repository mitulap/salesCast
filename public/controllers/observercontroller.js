var myApp = angular.module('SalesCastObserve', []);


myApp.controller('ObserveCtrl', ['$scope', '$http', function($scope, $http) {

var refresh = function(){
    console.log("INTO REFRESH");
    $http.get('/observeclients').success(function(response){
        console.log("I got the data I requested");
        $scope.clients = response;
        $scope.client = "";
        console.log($scope.clients);
    });
};

refresh();

//check stock value and give alerts
$scope.checkStock = function(){
    

     $http.get('/getStock').success(function(response){
        console.log("I got the the sequence value");
        console.log("STOCK");
        console.log(response);

        for(x=0;x<response.length;x++) //for each store check stock value
        {
        	console.log("Product",response[x].client_id);
        	console.log(response[x].productInfo);

        	if(response[x].productInfo.constructor === Array){	//array of products
  				console.log("Multiple products");
	        	//for each product
	        	for(y=0;y<response[x].productInfo.length;y++)
	        	{
	        		var currentprice = response[x].productInfo[y].stock_current;
        			var minprice = response[x].productInfo[y].stock_min;
        			if(parseInt(currentprice) < parseInt(minprice))
	        		{
	        			alert("Product "+ response[x].productInfo[y].product_id + " has current stock value:" 
	        				+ currentprice +"  which is less then the minimum recommended of value: "
	        				+ minprice +". Please order");
	        		}
	        	};
        	}

        	else	//only one product
        	{
        		console.log("ONE PRODUCT");
        		var currentprice = response[x].productInfo.stock_current;
        		var minprice = response[x].productInfo.stock_min;
        		if(parseInt(currentprice) < parseInt(minprice))
	        		{
	        			alert("Product "+ response[x].productInfo.product_id + " has current stock value: " 
	        				+ currentprice +"  which is less then the minimum recommended of value: "
	        				+ minprice +". Please order");
	        		}
        	}
        }



    	});
    
	

    
	};
	//end of checkStock

    //Toggle Observe for Supermarkets
	$scope.observe = function(id,flagg){
	console.log("ID FOR UPDAteEE",id,flagg);
    $http.put('/toggleObserve/' + id +"/" + flagg, $scope.rclient).success(function(response){
        refresh();
    })

	};
    // end of observe
    

}]); 

