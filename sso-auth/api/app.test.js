const app = require("./app");
const request = require("supertest");
const db = require("./database/db");
const authRoute = require("./routes/authRoute");

app.use("/", authRoute);

afterAll(() => {
  db.end();
});

describe("login without credentials", () => {
  test("should return, user not found without username ", async () => {
    const response = await request(app)
      .post("/isAuthorized/?redirectURL=http://localhost:3010/")
      .send({
        username: "",
        password:
          "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("username not found");
  });

  test("should return, password doesn't match without password ", async () => {
    const response = await request(app)
      .post("/isAuthorized/?redirectURL=http://localhost:3010/")
      .send({ username: "admin", password: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("password doesn't match");
  });
});

describe("login with credentials", () => {
  test("should login with correct credentials", async () => {
    const response = await request(app)
    .post("/isAuthorized/?redirectURL=http://localhost:3010/")
    .send({ username: "admin", password: "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5" });

  expect(response.statusCode).toBe(200);
  expect(response.body.msg).toBe("logged in");
  expect(response.body.accessToken).toBeDefined();
  });

  test("shouldn't login with incorrect password", async () => {
    const response = await request(app)
    .post("/isAuthorized/?redirectURL=http://localhost:3010/")
    .send({ username: "admin", password: "123321313" });

  expect(response.statusCode).toBe(400);
  expect(response.body.msg).toBe("password doesn't match");
  });

  test("shouldn't login with incorrect username", async () => {
    const response = await request(app)
    .post("/isAuthorized/?redirectURL=http://localhost:3010/")
    .send({ username: "123313", password: "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5" });

  expect(response.statusCode).toBe(400);
  expect(response.body.msg).toBe("username not found");
  });

  test("shouldn't login with user account to user-manager", async () => {
    const response = await request(app)
    .post("/isAuthorized/?redirectURL=http://localhost:3020/")
    .send({ username: "user", password: "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5" });

  expect(response.statusCode).toBe(400);
  expect(response.body.msg).toBe("not admin");
  });

});
