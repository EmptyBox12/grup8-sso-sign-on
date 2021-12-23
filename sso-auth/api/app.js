const express = require("express");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const app = express();
const port = 3001;
const db = require("./database/db");

const logger = require("morgan");
const Writable = require("stream").Writable;

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// access writer
class AccessStream extends Writable {
  write(line) {
    //export 'S'uccess queries to logs table
    db.query(
      `INSERT INTO logs (LOG_INFO, ACCESS) VALUES ('${line}', 'Success')`,
      (err) => {
        if (err) throw err;
      }
    );
  }
}
let successWriter = new AccessStream();

// error writer
class ErrorStream extends Writable {
  write(line) {
    //export 'E'rror queries to logs table
    db.query(
      `INSERT INTO logs (LOG_INFO, ACCESS) VALUES ('${line}', 'Error')`,
      (err) => {
        if (err) throw err;
      }
    );
    console.log("Error:" + line);
  }
}
let errorWriter = new ErrorStream();
const skipSuccess = (req, res) => res.statusCode < 400;
const skipError = (req, res) => res.statusCode >= 400;

//error logging
app.use(
  logger("combined", {
    skip: skipSuccess,
    stream: errorWriter,
  })
);

//success logging
app.use(
  logger("combined", {
    skip: skipError,
    stream: successWriter,
  })
);

app.use("/", authRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
