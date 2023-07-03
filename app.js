const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var items = [];

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.render('list',{pro:"Progress",itemsList:items}); 
});
app.post('/',(req,res)=>{
    item = req.body.newItem;
    items.push(item);
    res.redirect('/');
})
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log("server connected..."+ port))
