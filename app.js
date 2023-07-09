const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const itemSchema = import("mongo_utils.js");
// const mongoClient = require('mongodb').MongoClient;

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

const url = 'mongodb://127.0.0.1:27017/todolistDB';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Perform database operations...
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
const itemSchema = {
    task:{ type: String }
};

const Item = new mongoose.model("Item",itemSchema);

const itemName1 = new Item({task:"welcome"});
const itemName2 = new Item({task:"how is it?"});
const itemName3 = new Item({task:"click + to add tasks"});
const defaultItems = [itemName1,itemName2,itemName3];
// defaultItems.save();//for saving one element
// Item.insertMany([itemName1,itemName2,itemName3]);//for inserting multiple elements

console.log("item saved");

app.get('/', (req, res) => {
  let display_items;
  
  Item.find()
    .then((ItemsInDB) => {
      display_items = ItemsInDB;
        
      // display_items.forEach(element => {
      //   console.log(element.task);
      // });
  
      // Pass the retrieved data to the view for rendering
      res.render('list', { pro: "Progress", itemsList: display_items });
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors that occur during the find() operation
    });
});

app.post('/',(req,res)=>{
    let item = req.body.newItem;
    // items.push(item);
    // if(item != null){
    const newItem = new Item({task:item});
    newItem.save().then(()=>{
        console.log("new item is inserted....")
        res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
    });
    // console.log(item + " " + typeof(item));
    if(item === null)res.redirect('/');
})
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log("server connected..."+ port))
