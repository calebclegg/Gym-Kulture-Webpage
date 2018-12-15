var express = require("express"); // This line calls the express module
var app = express(); //invoke express application
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("views"));// allows access to the content in views file

app.use(express.static("scripts"));// allows access to scripts folder 

app.use(express.static("Images"));// allows access to images folder 

var products = require("./model/products.json"); // allow the app to access the products.json file
var reviews= require("./model/reviews.json"); // allow the app to access the products.json file

app.set('view engine', 'jade')// set default view engine to jade
//renders the index vciew when user goes to site route
// route to render index page 
app.get("/", function(req, res){

    
   // res.send("This is the best class ever"); 
    res.render("index");
    console.log("Home Page!")   
    
});

// route to render index page 
app.get("/products", function(req, res){
   // res.send("This is the best class ever");
    res.render("products.jade",
    {products:products}
  );
    console.log("Products Page!");
      
})

// Now we need to tell the application where to run
// route to render add JSON page
app.get('/add', function(req, res){
   res.render('add.jade');
  console.log("Now you are adding an item!");
});


app.post('/add', function(req, res){
	var count = Object.keys(products).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
  //route to render addreview Json//
  app.get('/addreviews', function(req, res){
   res.render('addreviews.jade');
  console.log("Now you are leaving feedback!"); 
});    
 
  
app.post('/addreviews', function(req, res){
	var count = Object.keys(reviews).length; // Tells us how many reviews we have its not needed but is nice to show how we can do this
	console.log(count);
	
});      
  

  //editreviews page //
  app.get('/editreviews/:id', function(req, res){  
 function chooseProd(indTwo){
   return indTwo.id === parseInt(req.params.id)
  
 }
 
 console.log("Id of this review is " + req.params.id);
 // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  var indTwo = reviews.filter(chooseProd);
 // pass the filtered JSON data to the page as indOne  
 res.render('editreviews' , {indTwo:indTwo});
  console.log("Edit Review Page Shown");
 }); 
  // Create post request to edit the individual review
app.post('/editreviews/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = reviews; // declare data as the reviews json file
 var index = data.map(function(reviews){reviews.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.content  
 var z = parseInt(req.params.id)
 reviews.splice(index, 1, {name: req.body.name, content: y, id: z});
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
});

// end post request to edit the individual review


//end of editreviews // 
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(products, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var product = {
		name: req.body.name, // name called from the add.jade page textbox
		id: newId, // this is the variable created above
		price: req.body.price,
    activity: req.body.activity,// content called from the add.jade page textbox
    image: req.body.image,

	};
		console.log(product) // Console log the new product 
	var json  = JSON.stringify(products); // Convert from object to string
	
	// The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
	fs.readFile('./model/products.json', 'utf8', function readFileCallback(err, data){
							if (err){
		throw(err);
	 }else {
		products.push(product); // add the information from the above variable
		json = JSON.stringify(products, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
		fs.writeFile('./model/products.json', json, 'utf8'); // Write the file back
		
	}});
	res.redirect("/products")
});
//review page// 
// route to render add JSON page
  // From here on is JSON DATA Manipulation 
 app.get('/reviews', function(req, res){
 res.render("reviews", {reviews:reviews});
 console.log("Reviews on Show");
}); 
 
app.post('/reviews', function(req, res){
	var count = Object.keys(reviews).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var review = {
		name: req.body.name, // name called from the add.jade page textbox
		id: newId, // this is the variable created above
		content: req.body.content, // content called from the add.jade page textbox
  email: req.body.content, // email variable
   image: req.body.image, // image variable  
	};
		console.log(review) // Console log the new product 
	var json  = JSON.stringify(reviews); // Convert from object to string
	
	// The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
							if (err){
		throw(err);
	 }else {
		reviews.push(review); // add the information from the above variable
		json = JSON.stringify(reviews, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
		fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
		
	}}) 
	res.redirect("/reviews")
});
// end of review page// 

// function to delete database adta based on button press and form
app.get('/deletereview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 
 var data = reviews;
 
 var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
 
 reviews.splice(index, 1);
 
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./model/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
  

 
 console.log("Its Gone!");
});


// function to delete database adta based on button press and form
app.get('/delete/:id', function(req, res){
 var json = JSON.stringify(products);
 
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 
 var data = products;  
 
 var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
 
 products.splice(index, 1);
 
 json = JSON.stringify(products, null, 4);
 fs.writeFile('./model/products.json', json, 'utf8'); // Write the file back
 res.redirect("/products");
  

 
 console.log("Its Gone!");
});

/// edit product 

app.get('/edit/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
  
 }
 
 console.log("Id of this review is " + req.params.id);
 // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  var indOne = products.filter(chooseProd);
 // pass the filtered JSON data to the page as indOne
 res.render('edit' , {indOne:indOne}); 
  console.log("Edit Review Page Shown");
 });
 

// end Page to edit review 

// Create post request to edit the individual review
app.post('/edit/:id', function(req, res){
 var json = JSON.stringify(products);
 var keyToFind = parseInt(req.params.id); // Id passed through the url 
 var data = products; // declare data as the reviews json file
 var index = data.map(function(products){products.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.content
 var z = parseInt(req.params.id)
 products.splice(index, 1, {name: req.body.name, content: y, id: z});
 json = JSON.stringify(products, null, 4);
 fs.writeFile('./model/products.json', json, 'utf8'); // Write the file back
 res.redirect("/products");
});

// end post request to edit the individual review

// This function calls the show individual products page
app.get('/show' , function(req, res){
  res.render("show.jade"); 
  console.log("Individual page now loaded");  
   })
//
 app.get('/show/:name' , function(req, res){
    
// create a function to filter the products data
function findProd(which) {
   return which.name === req.params.name; 
}
  console.log(products.filter(findProd))
  indiOne = products.filter(findProd);
  
  res.render("show",
             {indi:indiOne} // Inside the {} option we call the products variable from line 10 above
            	);
	
	console.log("Individual page");
})

//Java

 

app.get('/login', function(req, res){
 
 res.render('login.jade');
 console.log('Login Please');
});

 



//

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Off we go again");
  
  });
   