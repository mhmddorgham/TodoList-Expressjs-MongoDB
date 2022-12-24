const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  const theDate = new Date();
  const currDay = theDate.getDay();
  var today = ""

  switch (currDay) {
    case 0:
      today = "Sunday";
      break;
    case 1:
      today = "Monday";
      break;
    case 2:
      today = "Tuesday";
      break;
    case 3:
      today = "Wedensday";
      break;
    case 4:
      today = "Thursday";
      break;
    case 5:
      today = "Friday";
      break;
    case 6:
      today = "Saturday";
      break;
    default:
      console.log("Error, not day !");
      break;
  }
  res.render('index', { theDay: today });
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})