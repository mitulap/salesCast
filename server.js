var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

var bodyParser=require('body-parser');
var mongojs=require('mongojs');


var bootstrapData = mongojs('serverdb',['bootstrapIds']);

var clientdb=mongojs('clientor',['counter','product','shelf_productId','supermarket','warehouse']);
var serverdb=mongojs('serverdb',['counter','increment','product','sales','shelf_productId','supermarket','warehouse']);
app.use(bodyParser.json());

app.listen(3000);
console.log("Server is running on port 3000");


app.post('/discover',function(req,res){
	var supermarketId=req.body.supermarketId;
	
	 serverdb.counter.find({query:{supermarket_id: supermarketId}},function(err,doc){
        console.log(doc);
        res.json(doc);
    }); 
    
});

app.get('/populate',function(req,res){

	clientdb.supermarket.find(function(err,doc){

		console.log(doc);
		res.json(doc);
	});

})

/*app.post('/read',function(req,res){

	//

	clientdb.supermarket.findAndModify({query:{}, update: {$set{stock_current: }},new: true},function(err,doc){

	})


})
*/

app.get('/populateProduct',function(req,res){

	clientdb.product.find(function(err,doc){

		
		res.json(doc);
	});

})

app.post('/productDetails',function(req,res){
	var productName=req.body.productId;
	
	 serverdb.product.find({query:{product_name: productName}},function(err,doc){
        
        res.json(doc);
    }); 
    
});

app.post('/productDetailsRead',function(req,res){
	console.log("HIIIIII")
	console.log(req.body[0].desc);
	 serverdb.supermarket.find({client_id: "WM2566"}).toArray(function(err,doc){
       // console.log(doc[0].product_shelf[0].productType);
       var data=[];
       console.log( req.body.length);
       console.log("Database");
       console.log(doc[0].product_shelf.length)
       


       for( var i=0; i < req.body.length; i++){
       	for(var j=0; j < doc[0].product_shelf.length; j++){
        if(doc[0].product_shelf[j].productType.toLowerCase()==req.body[i].desc.toLowerCase()){
        	
        	var shelf=doc[0].product_shelf[j].shelf
        	data.push({productId: req.body[i].product_id, shelf: shelf, productType: req.body[i].desc, supermarketId: "WM2566", timestamp: new Date(), counterId: "1"});
        	/* var batch = serverdb.shelf_productId.initializeUnorderedBulkOp({useLegacyOps: true});
     			batch.insert({productId: req.body[i].product_id, shelf: shelf, productType: req.body[i].desc, supermarketId: "WM2566", timestamp: new Date(), counterId: "1"});*/
        	/*serverdb.shelf_productId.insert({productId: req.body[i].product_id, shelf: shelf, productType: req.body[i].desc, supermarketId: "WM2566", timestamp: new Date(), counterId: "1"}, function(err,docs){
        	
        		data.push(docs);
        		console.log(data);
        		
        	});*/


        	}
        }
    }

   /* batch.execute(function(err,docs){
    	 res.json(docs);
    })
       */
       console.log("Data"+ data);

       for(var k=0; k<data.length;k++){
       serverdb.shelf_productId.insert(data[k], function(err,docs){
          
            
            console.log("Insert into the server");
            console.log(docs);
            
            
          });

       clientdb.shelf_productId.insert(data[k],function(err,doc){
      console.log(doc);
     
  });
     }

     res.json(data)
    }); 
});

app.post('/shelfDetails',function(req,res){
console.log("I am one 1")
console.log(req.body)
var data=[];


for(var i=0;i<req.body.length;i++){
	clientdb.shelf_productId.insert(req.body[i],function(err,doc){
			console.log(doc);
			data.push(doc)
	});
}


res.json(data);


});	 


//function to get Supermarket's and toggle Observe
app.get('/observeclients',function(req,res){
    console.log("Got GET request")
    
    serverdb.supermarket.find(function(err,docs){
        console.log(docs);
        res.json(docs);
    });

});

//Get supermarkets which have observe flag value 1 and get stock
app.get('/getStock',function(req,res){
    console.log("Got GET request")
    
    serverdb.supermarket.find({query:{observe:"1"}},function(err,docs){
        console.log(docs);
        res.json(docs);
    });

}); //end of getstock

//Toggle observeFlag for Supermarkets
app.put('/toggleObserve/:id/:flagg',function(req,res){
  console.log("Toggle Observe");
  var id = req.params.id;
  var flagg = req.params.flagg;
 
    serverdb.supermarket.findAndModify({query:{client_id: id},
    update: {$set:{observe:flagg}},
    new: true},function(err,doc){
        res.json(doc);
    }); 
}); //end of to


//Methods for bootstrap.html page - Start
app.post('/bsAdd', function (req, res){
  console.log(req.body);

  bootstrapData.bootstrapIds.find({clientId: req.body.clientId},
    function(err, doc){
      if(doc.length){
        res.json("CLient Already exists in bootstrap database");
      }else{
        bootstrapData.bootstrapIds.insert(req.body, function(err, doc){
          res.json(doc._id);
        });
      }
  });
  
});

//Methods for bootstrap.html page - End


//Methods for registration.html page - start

app.post('/registration', function (req, res){
  console.log(req.body);

  serverdb.registrationdata.find({clientId: req.body.clientId},
    function(err, doc){
      console.log("Inside the ");
      if(doc.length){
        res.json("Client Already registered in database");
      }else{

        //
        serverdb.bootstrapIds.find({ $and: [{_id: mongojs.ObjectId(req.body.regId)}, {clientId: req.body.clientId}]}, function(err, doc){
          console.log(doc);
          if(doc.length){
            serverdb.registrationdata.insert(req.body, function(err, doc){
              res.json("Client Registered Successfully");
            });
          }else{
            res.json("Bootstrap your client to register");
          }

        });
        
      }
  });
  
});

//Methods for registration.html page - end

//Methods for deregistration.html page - start


app.post('/deregistration', function(req, res){

  console.log(req.body);

  /*{ $and: [{_id: mongojs.ObjectId(req.body.regId)}, {clientId: req.body.clientId}]}*/
  serverdb.registrationdata.find({ $and: [{regId: req.body.regId}, {clientId: req.body.clientId}]}, function(err, doc){
    if(doc.length){
      serverdb.registrationdata.remove({clientId: req.body.clientId}, function(err, doc){
        res.json("Client de-resitered Successfully.")
      });
    }else{
      res.json("Client details not found. Please enter correct data to deregister.")

      /*db.contactList.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
      });*/
    }
  });

});

//Methods for deregistration.html page - end

//Methods for updatereginfo.html page - start

app.post('/updateRegInfo', function(req, res){

    serverdb.registrationdata.find({$and: [{regId: req.body.regId}, {clientId: req.body.clientId}]}, function(err, doc){
      console.log(req.body);
      if(doc.length){
        serverdb.registrationdata.update(
          {clientId: req.body.clientId},
          {$set: {clientName: req.body.clientName, desc: req.body.desc}},
          function(errr, result){
            res.json("Data Updated Successfully.");
          });
      }else{
        res.json("Data does not match. Please enter correct Cleint Id and Registration Id");
      }

    });

});

//Methods for updatereginfo.html page - start

