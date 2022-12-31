const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const Schema = mongoose.Schema;
var todoName = " ";
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

// Default Items
const firstTask = new item({
  theName: "Buid todolist"
})
const secondTask = new item({
  theName: "Design todolist"
})
const thirdTask = new item({
  theName: "Upload todolist on GitHub"
})

//add defualt items to default item array:
var defaultItems = [firstTask, secondTask, thirdTask];


// item.find((err, items) => {
//   err ? console.log(err) : items.forEach((obj) => { console.log(obj.theName) })
// });






// item.updateOne({ theName: "Buid todolist" }, { theName: "Build todolist" }, (err) => { err ? console.log(err) : console.log("Succefully Updated the item"); })

//Main Route
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

  item.find((err, items) => {

    if (err) {
      console.log(err)
    }
    else {
      if (items.length === 0) {
        item.insertMany(defaultItems, (err) => {
          err ? console.log(err) : console.log("Succefully Inserted items in the database");
        });
        res.redirect("/");
      }
      else {
        res.render('index', { theDay: today, newItems: items });
      }
    }
  })
});


//Subroutes
app.get("/:category", (req, res) => {

  todoName = req.params.category.charAt(0).toLocaleUpperCase() + req.params.category.slice(1).toLowerCase();
  const theDate = new Date();
  //Create data information the menstioned in the date:
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  console.log(theDate.toLocaleDateString("en-US", options));


  //set today to date that has been generated using tolocaleDateString:
  today = theDate.toLocaleDateString("en-US", options) + "\n" + todoName + " Todo List";
  //render the index.ejs

  item.find((err, items) => {

    if (err) {
      console.log(err)
    }
    else {
      if (items.length === 0) {
        item.insertMany(defaultItems, (err) => {
          err ? console.log(err) : console.log("Succefully Inserted items in the database");
        });
        res.redirect("/");
      }
      else {
        res.render('index', { theDay: today, newItems: items });
      }
    }
  })
})



app.post("/", (req, res) => {
  const newTask = new item({
    theName: req.body.task
  })
  newTask.save()
  res.redirect("/");
})



app.post("/delete", (req, res) => {
  //catch the obj id in a variable
  const deletedItemId = req.body.theCheckbox;
  //add the delete operation 
  item.deleteOne({ _id: deletedItemId }, (err) => { err ? console.log(err) : console.log("Succefully Deleted the element"); });
  res.redirect("/");
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})