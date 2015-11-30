var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

var bodyParser=require('body-parser');
var mongojs=require('mongojs');

var clientdb = mongojs('clientor',['counter','product','shelf_productId','supermarket','warehouse']);
var serverdb = mongojs('serverdb',['counter','increment','product','sales','shelf_productId','supermarket','warehouse','registrationdata','bootstrapIds']);

app.use(bodyParser.json());

app.listen(3000);
console.log("Server is running on port 3000");

//Discover
app.post('/discover',function(req,res){
  var supermarketId=req.body.supermarketId;
  
   serverdb.counter.find({query:{supermarket_id: supermarketId}},function(err,doc){
        console.log(doc);
        res.json(doc);
    }); 
    
});




//
app.get('/populate',function(req,res){

  serverdb.supermarket.find(function(err,doc){

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



//Read and Write
app.post('/productDetailsRead/:super/:counter',function(req,res){
  console.log("HIIIIII")
  console.log("Supermarket....  "+ req.params.super)
  var supermarket=req.params.super;
  var counter=req.params.counter;
  console.log(req.body[0].desc);
   serverdb.supermarket.find({client_id: supermarket}).toArray(function(err,doc){
       // console.log(doc[0].product_shelf[0].productType);
       var data=[];
       console.log( req.body.length);
       console.log("Database");
       console.log(doc[0].product_shelf.length)
       


       for( var i=0; i < req.body.length; i++){
        for(var j=0; j < doc[0].product_shelf.length; j++){
        if(doc[0].product_shelf[j].productType.toLowerCase()==req.body[i].desc.toLowerCase()){
          
          var shelf=doc[0].product_shelf[j].shelf
          data.push({productId: req.body[i].product_id, shelf: shelf, productType: req.body[i].desc, supermarketId: supermarket, timestamp: new Date(), counterId: counter});
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
        console.log("DAAAATA"+data[k])
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

//Notify
//Get supermarkets which have observe flag value 1 and get stock
app.get('/getStock',function(req,res){
    console.log("Got GET request")
    
    serverdb.supermarket.find({query:{observe:"1"}},function(err,docs){
        console.log(docs);
        res.json(docs);
    });

}); //end of getstock


//Cancel Observe
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

  serverdb.bootstrapIds.find({clientId: req.body.clientId},
    function(err, doc){
      if(doc.length){
        res.json("CLient Already exists in bootstrap database");
      }else{
        serverdb.bootstrapIds.insert(req.body, function(err, doc){
          res.json(doc._id);
        });
      }
  });
  
});

//Methods for bootstrap.html page - End

//Methods for registration.html page - start

app.post('/registration', function (req, res){
  console.log(req.body);

  serverdb.supermarket.find({clientId: req.body.client_id},
    function(err, doc){
      console.log("Inside the ");
      if(doc.length){
        res.json("Client Already registered in database");
      }else{

        //
        serverdb.bootstrapIds.find({ $and: [{_id: mongojs.ObjectId(req.body.regId)}, {clientId: req.body.client_id}]}, function(err, doc){
          console.log(doc);
          if(doc.length){
            serverdb.supermarket.insert(req.body, function(err, doc){
              res.json("Client Registered Successfully");
            });

           
          }else{
            res.json("Bootstrap your client to register");
          }

        });
        
      }
  });
  
});

//Registration of Counter

app.post('/registrationCounter', function (req, res){
  console.log(req.body);

  serverdb.counter.find({counter_id: req.body.counter_id},
    function(err, doc){
      console.log("Inside the ");
      if(doc.length){
        res.json("Client Already registered in database");
      }else{

        //
        serverdb.bootstrapIds.find({ $and: [{_id: mongojs.ObjectId(req.body.regId)}, {clientId: req.body.counter_id}]}, function(err, doc){
          console.log(doc);
          if(doc.length){
            serverdb.counter.insert(req.body, function(err, doc){
              res.json("Client Registered Successfully");
            });

           
          }else{
            res.json("Bootstrap your client to register");
          }

        });
        
      }
  });
  
});



//Registration of Warehouse

app.post('/registrationWarehouse', function (req, res){
  console.log(req.body);

  serverdb.warehouse.find({counter_id: req.body.client_id},
    function(err, doc){
      console.log("Inside the ");
      if(doc.length){
        res.json("Client Already registered in database");
      }else{

        //
        serverdb.bootstrapIds.find({ $and: [{_id: mongojs.ObjectId(req.body.regId)}, {clientId: req.body.client_id}]}, function(err, doc){
          console.log(doc);
          if(doc.length){
            serverdb.warehouse.insert(req.body, function(err, doc){
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
    serverdb.supermarket.find({ $and: [{regId: req.body.regId}, {client_id: req.body.clientId}]}, function(err, doc){
      if(doc.length){
        serverdb.supermarket.remove({client_id: req.body.clientId}, function(err, doc){
          res.json("Client de-registered Successfully.")
        });
      }

      else{
        serverdb.counter.find({ $and: [{regId: req.body.regId}, {counter_id: req.body.clientId}]}, function(err, doc){
         if(doc.length){
          serverdb.counter.remove({counter_id: req.body.clientId}, function(err, doc){
           res.json("Client de-registered Successfully.")
         });

        }else{
          serverdb.warehouse.find({ $and: [{regId: req.body.regId}, {client_id: req.body.clientId}]}, function(err, doc){
            if(doc.length){
             serverdb.warehouse.remove({client_id: req.body.clientId}, function(err, doc){
               res.json("Client de-registered Successfully.")
             });


           }else{

            res.json("Client details not found. Please enter correct data to deregister.")
                
          
               }
             });

          }});

        }});  
        /*db.contactList.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
          res.json(doc);
        });*/

  });




//Methods for deregistration.html page - end

//Methods for updatereginfo.html page - start

app.post('/updateRegInfo', function(req, res){
    console.log("Request: "+req.body);
    serverdb.supermarket.find({$and: [{regId: req.body[0].regId}, {client_id: req.body[0].client_id}]}, function(err, doc){
      console.log("Inside Update"+req.body.client_name);
      if(doc.length){
        serverdb.supermarket.update(
          {client_id: req.body[0].client_id},
          {$set: {client_name: req.body.client_name, address: req.body.address, contact:{phone: req.body.contact.phone, email: req.body.contact.email}}},
          function(errr, result){
            res.json("Data Updated Successfully.");
          });
      }else{
        res.json("Data does not match. Please enter correct Cleint Id and Registration Id");
      }

    });

});


//Methods for updatereginfo.html page - end

//Methods for productDetailsExecute

      app.post('/productDetailsExecute',function(req,res){
        console.log("HIIIIII")
        console.log(req.body[0].desc);
        
        serverdb.supermarket.find({client_id: "WM2566"}).toArray(function(err,doc){
           // console.log(doc[0].product_shelf[0].productType);
            var data=[];
           console.log( req.body.length);
           console.log("Database");

           console.log(doc[0].productInfo.length);
           // var stock=doc[0].productInfo[j].stock_current;

            //calculating the stock limit
            for( var i=0; i < req.body.length; i++){
              console.log("Inside")

              for(var j=0; j < doc[0].productInfo.length; j++){

                console.log("HIII");
                if(doc[0].productInfo[j].product_id==req.body[i].product_id){
                  var prevStock=doc[0].productInfo[j].stock_current;
                  var stock= doc[0].productInfo[j].stock_current-1;
                  doc[0].productInfo[j].stock_current=doc[0].productInfo[j].stock_current-1;
            //update into serverdb
            //update into client DB
      // productInfo: {product_id: req.body[i].product_id }
      console.log("Inside")
      console.log("Product Stock"+doc[0].productInfo[j].product_id+" Stock: "+stock);
      console.log("Previos Stock"+prevStock);
      console.log(req.body[i].product_id);
      var reqProd=req.body[i].product_id;
      serverdb.supermarket.update({$and: [{client_id:"WM2566",  "productInfo.product_id": req.body[i].product_id}]}, {$set: {"productInfo.$.stock_current":stock, "productInfo.$.prev_stock":prevStock}}, 
        function(err,docs){
          if(err==null){
            

          }
        });


      /* {$set:{productInfo.$.stock_current: stock, productInfo.$.prev_stock: prevStock} }*/


      clientdb.supermarket.update( {$and: [{client_id:"WM2566",  "productInfo.product_id": req.body[i].product_id}]}, {$set: {"productInfo.$.stock_current":stock, "productInfo.$.prev_stock":prevStock}}, 
        function(err,d){

        });
      data.push({supermarket_id: "WM2566", product_id: reqProd, "stock_current": stock, "prev_stock":prevStock});
            console.log(data)
  

    }  

  }

  }
console.log(data);
  res.json(data);

  });
    });

     
//create and delete

//methods for create and delete
app.get('/counterlist',function(req,res){
  console.log("Got request");
  serverdb.counter.find(function(err,docs){
    res.json(docs);
  });
});

app.post('/addCounter',function(req,res){
  console.log("adding..");
  console.log(req.body);
  serverdb.counter.insert(req.body, function(err,doc){
    res.json(doc);
  });
});

app.delete('/removeCounter/:id',function(req,res){
  var id = req.params.id;
  console.log("delete");
  serverdb.counter.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
    res.json(doc);
  });
});


//Mehtods for market.html page - start

  app.put('/writeAttr', function(req, res){

    clientdb.supermarket.find({client_id: req.body.marketId}, function(err, doc){

      if(doc.length){

        clientdb.supermarket.update(
          {client_id: req.body.marketId},
          {$push : {counter: {counterId: req.body.counterId, counterName : req.body.counterName}}},
          function(errr, result){
            res.json("counter addedd Successfully into market.")
        });

      }else{
        res.json("Market ID is not valid.");
      }     
    });

  });

//Mehtods for market.html page - end

//Mehtods for market.html page - start

  app.put('/write', function(req, res){

    clientdb.supermarket.find({client_id: req.body.marketId}, function(err, doc){

      if(doc.length){

        clientdb.supermarket.update(
          {client_id: req.body.marketId},
          {$push : {counter: {counterId: req.body.counterId, counterName : req.body.counterName}}},
          function(errr, result){
            res.json("counter addedd Successfully into market.")
        });

      }else{
        res.json("Market ID is not valid.");
      }     
    });

  });

//Mehtods for market.html page - end
//method to update registration
app.post('/discoverSupermarket',function(req,res){
  var supermarketId=req.body.supermarketId;
  
   serverdb.supermarket.find({query:{client_id: supermarketId}},function(err,doc){
        console.log(doc);
        res.json(doc);
    }); 
    
});