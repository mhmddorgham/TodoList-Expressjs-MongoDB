const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const Schema = mongoose.Schema;
//create array of new tasks
var newTasks = [];
//create a new database called todoDB, and connect to the mongose
mongoose.connect('mongodb://127.0.0.1:27017/todoDB', { useNewUrlParser: true });

//start using body parser in to get information
app.use(bodyParser.urlencoded({ extended: true }));

//Apply static css file to my server
app.use(express.static(__dirname + '/public'));

//start using EJS:
app.set('view engine', 'ejs');


//create a new Schema
const itemsSchema = new Schema({
  theName: String
})

const item = mongoose.model("item", itemsSchema);

const firstTask = new item({
  theName: "Buid todolist"
})
const secondTask = new item({
  theName: "Design todolist"
})
const thirdTask = new item({
  theName: "Upload todolist on GitHub"
})


// item.insertMany([firstTask, secondTask, thirdTask], (err) => { err ? console.log(err) : console.log("Succefully Inserted items in the database"); })

// const defaultItems = [firstTask, secondTask, thirdTask]

// newTasks.push(defaultItems)


newTasks.push(firstTask);
newTasks.push(secondTask);
newTasks.push(thirdTask);


item.find((err, tasks) => {
  err ? console.log(err) : tasks.forEach((ele) => { console.log(ele.theName) })
})

app.get("/", (req, res) => {
  const theDate = new Date();

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
  // const newTask = new item({
  //   theName: req.body.task
  // })
  // //put this task in the array
  // newTasks.push(newTask);
  // //redirect to the main page with passing newtasks in the page:
  // res.redirect("/");



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