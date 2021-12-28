const express = require("express");
require('dotenv').config()
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const app = express();
const db = require("./database/db");


const logger = require("morgan");
const Writable = require("stream").Writable;

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// info writer
class InfoStream extends Writable {
  write(line) {
	 //export info level queries to logs table
    db.query(
      `INSERT INTO logs (LOG, Level) VALUES ('${line}', 'Info')`,
      (err) => {
        if (err) throw err;
      }
    );
  }
}
let infoWriter = new InfoStream();

// error writer
class DebugStream extends Writable {
  write(line) {
	  //export debug level queries to logs table
    db.query(
      `INSERT INTO logs (LOG, Level) VALUES ('${line}', 'Debug')`,
      (err) => {
        if (err) throw err;
      }
    );
  }
}
let debugWriter = new DebugStream();

logger.token("host", function (req, res) {
  return req.headers["host"];
});

//Info logging
app.use(
  logger("[:date[clf]] :method :url :status :referrer :host :user-type", {
    stream: infoWriter,
  })
);

// Debug logging
app.use(
  logger("combined", {
    stream: debugWriter,
  })
);

app.use("/", authRoute);

module.exports = app;
