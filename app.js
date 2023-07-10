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

const customListSchema = {
  name : {type : String},
  items : [itemSchema]
};
const List = new mongoose.model("List",customListSchema);

const ListItem1 = new List({
  name:'home',
  items:[{task:"welcome home"}]
})

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

app.get('/:customName',(req,res)=>{
  const customName = req.params.customName;
  console.log(customName);
  List.findOne({ name: customName })
  .then(foundList => {
    if (!foundList) {
      const list = new List({
        name: customName,
        items: defaultItems
      });
      list.save();
      const url = "/"+customName;
      res.redirect(url);
    }
    else {
      res.render("list", { pro: "<" + customName + ">", itemsList: foundList });
    }
  })
  .catch(err => {
    console.log(err);
    // Handle the error appropriately
  });
  // ListItem1.save()
  //   .then(()=>{
  //     console.log("custom route insertion done....");
  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   });
})

app.post('/',(req,res)=>{
    const item = req.body.newItem;
    const listName = req.body.postFrom;
    console.log(listName + typeof(listName));
    // items.push(item);
    // if(item != null){
    const newItem = new Item({task:item});

    if(listName === "Progress"){
    newItem.save().then(()=>{
        console.log("new item is inserted....")
        res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
    });
    }
    else{
      List.findOne({name:listName})
        .then((foundList)=>{
          console.log(typeof(foundList.items));
          foundList.items.push(newItem);
          console.log("pushed");
          foundList.save()
            .then()
            .catch((err)=>{
              console.log(err);
            })
          res.redirect('/' + listName);
        })
        .catch((err)=>{
          console.log(err);
        })
    }
    // console.log(item + " " + typeof(item));
})


app.post('/delete',(req,res)=>{
  const del_item_id = req.body.checkboxOfItem;
  Item.findByIdAndRemove(del_item_id)
    .then(()=>{
      console.log("item deleted...")
      res.redirect('/');
    })
    .catch((err)=>{
      console.log(err);
    });
})

const port = process.env.PORT || 3000;
app.listen(port,()=>console.log("server connected..." + port))
