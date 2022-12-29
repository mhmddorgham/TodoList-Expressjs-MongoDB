const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const Schema = mongoose.Schema;
//create array of new tasks
var newTasks = ["Task 1", "Task 2", "Task 3"];
//create a new database called todoDB, and connect to the mongose
mongoose.connect('mongodb://127.0.0.1:27017/todoDB', { useNewUrlParser: true });

//create a new Schema
const itemsSchema = new Schema({
  theName: String
})

const item = mongoose.model("item", itemsSchema);

//start using body parser in to get information
app.use(bodyParser.urlencoded({ extended: true }));

//Apply static css file to my server
app.use(express.static(__dirname + '/public'));

//start using EJS:
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  const theDate = new Date();
  const currDay = theDate.getDay();

  //Create data information the menstioned in the date:
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  console.log(theDate.toLocaleDateString("en-US", options)); // 9/17/2016

  //set today to date that has been generated using tolocaleDateString:
  today = theDate.toLocaleDateString("en-US", options);
  //render the index.ejs
  res.render('index', { theDay: today, newItems: newTasks });

})


app.post("/", (req, res) => {
  //set the new task in a new variable:
  var newTask = req.body.task;
  //put this task in the array
  newTasks.push(newTask);
  //redirect to the main page with passing newtasks in the page:
  res.redirect("/");
})

/**
 * app.post('/',(req,res)=>{
  const {fname,lname,email,birthday} = req.body
  res.render('submit',{first:fname,last:lname,email:email,birth:birthday})
})
 * 
 * 
 * 
 */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})