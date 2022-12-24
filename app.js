const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  const today = new Date();
  if (today.getDay() === 6 || today.getDay() === 0) {
    res.send("Its Holiday and index is " + today.getDay())
  } else {
    res.send("its Workday and index is " + today.getDay());
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})