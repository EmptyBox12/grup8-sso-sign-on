const express = require("express");
const authRoute = require("./routes/authRoute");
const app = express();
const port = 3001;

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoute)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
