var express = require('express');
var admin = require("firebase-admin");
const { json } = require('body-parser');
var cors = require('cors');
var app = express();

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(json());

  app.get('/home',async (req,res)=>{
    console.log('home');
    const snapshot = await db.collection('food').get();
    const foods = [];
    
    snapshot.forEach((doc) => {
      foods.push(doc.data());
    });
    res.status(200).send(foods);
  });


  app.post('/order-food',async (req,res)=>{
    console.log('order-food');   
    console.log(req.body);
    const {userid,name,foodid,
    quantity,price,description,category,image,ratingCount,rating,location,title} = req.body;
    const documentPath = `${userid}/${userid}/${foodid}`;
   
   try{
   await  db.collection('order').doc(documentPath).set({
    name: name,
    quantity: quantity,
    price: price,
    foodid: foodid,
    userid: userid,
    description: description,
    category: category,
    image: image,
    ratingCount: ratingCount,
    rating: rating,
    location: location,
    title: title
  });

    res.status(200).send({message:'Order placed successfully'});}
    catch(e){console.log(e.message);
      res.status(400).send({error:'Order not placed'});
    }
  });

  app.get('/get-order/:id',async (req,res)=>{
    console.log('get-order');
    const userid = req.params.id;
    console.log(userid);
    try {
      const snapshot = await db.collection('order').doc(userid).collection(userid).get();
      snapshot.forEach((doc) => {console.log(doc.data());});
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push(doc.data());
      });

      res.status(200).send(orders);
    }
    catch(e){
      console.log(e.message);
      res.status(400).send({error:'Error in getting orders'});
    }
  })

  
  app.get('/get-order',async (req,res)=>{
    console.log('get-order');
    const {userid}=req.body;
    console.log(userid);
    try {
      const snapshot = await db.collection('order').doc(userid).collection(userid).get();
      snapshot.forEach((doc) => {console.log(doc.data());});
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push(doc.data());
      });

      res.status(200).send(orders);
    }
    catch(e){
      console.log(e.message);
      res.status(400).send({error:'Error in getting orders'});
    }
  })

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
