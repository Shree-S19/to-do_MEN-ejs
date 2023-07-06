const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const itemSchema = import("mongo_utils.js");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    task:{ type: String }
};

const Item = mongoose.model("Item",itemSchema);

const itemName1 = new Item({task:"welcome"});
const itemName2 = new Item({task:"how is it?"});
const itemName3 = new Item({task:"click + to add tasks"});
const defaultItems = [itemName1,itemName2,itemName3];

Item.create(itemName1)

app.get('/',(req,res)=>{
    // Item.find({},(err,Items_inserted)=>{
    //     if(err)console.log(err);
    //     else if(Items_inserted.length === 0){
    //         Item.insertMany(defaultItems,(err)=>{
    //             if(err)console.log(err);
    //             else console.log("default items are inserted");
    //         });
    //     }
    // res.render('list',{pro:"Progress",itemsList:Items_inserted});
    // });
    res.render('list',{pro:"Progress",itemsList:defaultItems});
});

app.post('/',(req,res)=>{
    item = req.body.newItem;
    items.push(item);
    res.redirect('/');
})
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log("server connected..."+ port))
