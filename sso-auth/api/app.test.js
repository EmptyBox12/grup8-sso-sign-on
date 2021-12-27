const app = require("./app");
const request = require("supertest");
const db = require("./database/db");
const authRoute = require("./routes/authRoute");

app.use("/", authRoute);

afterAll(() => {
  db.end();
});
describe("login", () => {
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
        .send({
          username: "admin",
          password:
            "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5",
        });

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
        .send({
          username: "123313",
          password:
            "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("username not found");
    });

    test("shouldn't login with user account to user-manager", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3020/")
        .send({
          username: "user",
          password:
            "7c8de405033f341d1383dc5cd1dd60b1beca7bff4495f7a340709493edb671c5",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("not admin");
    });
  });
});

describe("verify token", () => {
  test("should verify if token is valid", async () => {
    const response = await request(app)
      .post("/verifyToken/?url=http://localhost:3010/")
      .send({
        token: "c62962cb-6c1c-4397-a9bb-d2b81b5fc1da",
      })
      .set({
        ip: "176.234.231.250",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("token is valid");
    expect(response.body.token).toBe("c62962cb-6c1c-4397-a9bb-d2b81b5fc1da");
  });

  test("should fail if token is expired", async () => {
    const response = await request(app)
      .post("/verifyToken/?url=http://localhost:3010/")
      .send({
        token: "5a6bd5b0-888d-4776-8f85-f40fd6d9bff4",
      })
      .set({
        ip: "176.234.231.250",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Token expired");
  });

  test("should fail if token has no permission to access url", async () => {
    const response = await request(app)
      .post("/verifyToken/?url=http://localhost:3020/")
      .send({
        token: "f2a3897c-7a81-4f8d-82f1-92ccdfad87f0",
      })
      .set({
        ip: "176.234.231.250",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("you don't have permission");
  });

  test("should fail if ip address is different", async () => {
    const response = await request(app)
      .post("/verifyToken/?url=http://localhost:3020/")
      .send({
        token: "c62962cb-6c1c-4397-a9bb-d2b81b5fc1da",
      })
      .set({
        ip: "176.234.231.350",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("you don't have permission");
  });

  test("should fail if token isn't provided", async () => {
    const response = await request(app)
      .post("/verifyToken/?url=http://localhost:3020/")
      .send({
        token: "",
      })
      .set({
        ip: "176.234.231.250",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("token not found");
  });

  test("should fail if token isn't in the database", async () => {
    const response = await request(app)
      .post("/verifyToken/?url=http://localhost:3020/")
      .send({
        token: "asddasadsdas",
      })
      .set({
        ip: "176.234.231.250",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("token not found");
  });
});
