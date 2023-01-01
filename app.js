const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var _ = require('lodash');
const app = express();
const PORT = process.env.PORT || 3000;
const Schema = mongoose.Schema;
var todoName = "";
var nameOfList = " "
var SubpagesURL = " ";
var newTaskCateg
//create array of new tasks
var newTasks = [];
var theListName = "";
//create a new database called todoDB, and connect to the mongose
mongoose.connect('mongodb://127.0.0.1:27017/todoDB', { useNewUrlParser: true });

//start using body parser in to get information
app.use(bodyParser.urlencoded({ extended: true }));

//Apply static css file to my server
app.use(express.static(__dirname + '/public'));

//start using EJS:
app.set('view engine', 'ejs');


//create a Schema of items
const itemsSchema = new Schema({
  theName: String
})
//create model of item schema:
const item = mongoose.model("item", itemsSchema);

// Default Items
const firstTask = new item({
  theName: "Buid todolist"
})
//
const secondTask = new item({
  theName: "Design todolist"
})
//thirdTask
const thirdTask = new item({
  theName: "Upload todolist on GitHub"
})

//add defualt items to default item array:
var defaultItems = [firstTask, secondTask, thirdTask];


// item.find((err, items) => {
//   err ? console.log(err) : items.forEach((obj) => { console.log(obj.theName) })
// });

//Create list collections:

//Create list schema:
var listSchema = new Schema({
  theCategory: String,
  //create the listitems as an array in the schema, so we can store array:
  listItems: [itemsSchema]
})


//create model of list schema:
const List = mongoose.model("list", listSchema);

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


app.get('/favicon.ico', (req, res) => res.status(204));

//Subroutes
app.get("/:category", (req, res) => {

  //add the category name in a variable:
  todoName = req.params.category;
  todoName = _.lowerCase(todoName);

  //create a new date:
  const theDate = new Date();
  //Create data information the mentioned in the date:
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  console.log(theDate.toLocaleDateString("en-US", options));


  //set today to date that has been generated using tolocaleDateString + category of the list:
  var today = theDate.toLocaleDateString("en-US", options);

  SubpagesURL = "/" + todoName;

  //check if the collection is already exists before creating a new collection
  List.findOne({ theCategory: todoName }, (err, theList) => {
    if (err) {
      console.log(err);
    }
    else {
      if (!theList) {
        const categoryList = new List({
          theCategory: todoName,
          listItems: defaultItems
        });
        categoryList.save();
        res.redirect("/" + todoName);
      }
      else {
        res.render('sublists', { theDay: today, theListName: _.capitalize(todoName), newItems: theList.listItems });
      }
    }
  })
})

console.log(todoName);
// //Add the route of the sublists dynamically based on the name of the category:
// app.post(SubpagesURL, (req, res) => {
//   newTaskCateg = new item({
//     theName: req.body.task
//   })
//   newTaskCateg.save();
//   defaultItems.push(newTaskCateg)
//   res.redirect("/" + todoName);
// })


//the main post route
app.post("/", (req, res) => {
  const theTaskName = req.body.task;
  theListName = req.body.button;
  const newTask = new item({
    theName: theTaskName
  })

  if (theListName === " ") {
    newTask.save()
    res.redirect("/");
  } else {
    List.findOne({ theCategory: theListName }, (err, foundList) => {
      foundList.listItems.push(newTask);
      foundList.save();
      res.redirect("/" + theListName)
    })

  }
})



app.post("/delete", (req, res) => {
  //catch the obj id in a variable
  const deleteMainItems = req.body.MainCheckbox;
  const deleteFromList = req.body.Subcheckbox;
  const nameOfTheList = req.body.theNameOfList;
  console.log(deleteFromList);
  console.log(deleteMainItems);
  console.log(nameOfTheList);
  //add the delete operation
  if (deleteMainItems !== undefined) {
    console.log("Yesssss");
    item.deleteOne({ _id: deleteMainItems }, (err) => { err ? console.log(err) : console.log("Succefully Deleted the element"); });
    res.redirect("/");
  } else {
    //print the name of the list in the console:
    console.log("Look here");

    // use findoneandUpdate method to findthe category with specefied name, then pull the item from the list items using the id, then redirect to the name 
    List.findOneAndUpdate({ theCategory: nameOfTheList }, { $pull: { listItems: { _id: deleteFromList } } }, (err, foundList) => {
      if (!err) {
        res.redirect("/" + nameOfTheList);
      }
    })
  }
}
)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})


  //create a new list collections:

  // List.find((err, lists) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     for (let i = 0; i < lists.length; i++) {
  //       if (lists[i].category === todoName) {
  //         break;
  //       }
  //       else if (lists[i].category !== todoName && i == lists.length - 1) {
  //         categoryList = new List({
  //           category: todoName,
  //           listItems: defaultItems
  //         })
  //         categoryList.save();
  //       }
  //     }
  //   }
  // })

