var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

var bodyParser=require('body-parser');
var mongojs=require('mongojs');

var clientdb = mongojs('clientor',['counter','product','shelf_productId','supermarket','warehouse']);
var serverdb = mongojs('serverdb',['counter','increment','product','sales','shelf_productId','supermarket','warehouse','registrationdata','bootstrapIds']);


var globalBool = 1;

app.use(bodyParser.json());

app.listen(3001);
console.log("Server is running on port 3001");


//Get Prodcut Details
app.post('/productDetails',function(req,res){

	console.log(req.body);
	serverdb.supermarket.find({client_id: req.body.marketId},{productInfo:1, _id:0},function(err, doc){
		console.log(doc);
		res.json(doc);
	});

});

//Send Prodcut Details to server
app.post('/sendCheckOutDataToServer/:marketId',function(req,res){

	var makret_id = req.params.marketId;
	console.log(makret_id);

	//console.log(req.body);
	/*serverdb.supermarket.find({client_id: req.body.marketId},{productInfo:1, _id:0},function(err, doc){
		console.log(doc);
		res.json(doc);
	});*/


	for(var z = 1; z < req.body.length ; z++ ){
		//console.log(req.body[z]);

		var productId = req.body[z][0];
		var quantity = req.body[z][1];

		callFunctionToUpdate(makret_id, productId, quantity);


	}

	if(globalBool == 1){
		res.json("Cart Data Successfully Updated.");
	}else{
		res.json("Error in Processing Request.")
	}



});

function callFunctionToUpdate(marketId, productId, quantity){

serverdb.supermarket.find()
        
        serverdb.supermarket.find({$and: [{client_id:marketId},  {"productInfo.product_id": productId}]},function(err,doc){
           // console.log(doc[0].product_shelf[0].productType);
            //console.log(doc[0].productInfo);


            for(var i = 0 ; i < doc[0].productInfo.length; i++){

            	if(doc[0].productInfo[i].product_id === productId){
            		var currentStock = doc[0].productInfo[i].stock_current;
            		var finalStock = currentStock - quantity;

            		serverdb.supermarket.update( {$and: [{client_id:marketId},  {"productInfo.product_id": productId}]}, 
            			{$set: {"productInfo.$.stock_current":finalStock, "productInfo.$.prev_stock":currentStock}}, 
				        function(err,d){
				        	
				        	globalBool = 1;
				    });
            		
            	}
            }

            //var newQuantity = doc[0].productInfo
        

  });

}