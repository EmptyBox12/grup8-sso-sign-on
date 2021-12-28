const app = require("./server");
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, "localhost", () =>
  console.log("Server listening on port " + port)
);
