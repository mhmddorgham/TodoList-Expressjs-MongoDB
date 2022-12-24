const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
var newTasks = [];


app.use(bodyParser.urlencoded({ extended: true }))

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

  res.render('index', { theDay: today, newItems: newTasks });

})


app.post("/", (req, res) => {
  var newTask = req.body.task;
  newTasks.push(newTask);

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