//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require('mongoose');
const { redirect } = require("express/lib/response");
const date = require(__dirname + "/date.js");
const _=require('lodash');
// console.log(date);

const app = express();



// var tasks= ["washing","market","food"];

// var work =[];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://sanil:Sanil987@cluster0.dbzsw.mongodb.net/todolist');
let day=date();

const item = new mongoose.Schema(
  {
    name : String
  }
);
const task =mongoose.model("task",item);
const data1 = new task({name:"coding"});
const data2= new task({name:"rom rom"});
const data3= new task({name:"sanil"});
const defaultItems = [data1,data2,data3];

const listSchema = {
  name :String,
  items : [item]
};

const List = mongoose.model("List", listSchema);


// front page

app.get('/',function(req,res)
{   
   

   task.find({} ,function (err,result) {

   if(result.length===0)
   {
    task.insertMany(defaultItems,function(err)
  {
  if(err){
    console.log("err")
  }
  else{
    console.log("successfully inserted");
  }
  res.redirect('/');
     });
   }else 
   { res.render("list",{listTitle: day, task: result});
     }
  
    });
  
    app.get("/:customListName", function(req,res){

    const customListName = req.params.customListName;
       List.findOne({name:customListName},function(err,foundList){
         if(!err)
         {
           if(!foundList)
           { 
              // create a new list
            const list = new List({
              name:customListName,
              items:defaultItems
            });
             list.save();
            res.redirect("/"+ customListName);
           }
           else
           { 
            // show existing list
            res.render("list",{listTitle: foundList.name, task: foundList.items});

           }
         }
       });
 
    });
  
    });


app.post("/", function(req , res){

    let item = req.body.taskName;
    const listname=req.body.list;
    const data4=new task({name:item});
    if(listname===day)
    {
      data4.save();
      res.redirect('/');
 
    }
   else{
     List.findOne({name:listname},function(err,foundlist){
       foundlist.items.push(data4);
       foundlist.save();
       res.redirect("/"+listname);
     });
   }
     

     
});




app.post("/delete",function(req, res)
{  
   const del =req.body.checkbox;

   const listname = _.capitalize(req.body.listname);
  console.log(req.body.listname);
   if(listname===day)
   {
    task.findByIdAndRemove(del,function(err)
    {
     if(err){
       console.log("err")
     }
     else{
       console.log("successfully deleted");
       res.redirect('/');
     }
    });
   }
   else{
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:del}}}, function(err,foundList){
      if(!err)
      {
        res.redirect("/"+listname);
      }
    }
    )
  }

   
  
});


// work page

// app.get('/work', function(req,res)
// {
//   res.render("list",{listTitle:"work" , task:work})
// });

// about

app.get('/about', function(req,res)
{
res.render("about")
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function()
{
  console.log("server started on port 3000");
});
