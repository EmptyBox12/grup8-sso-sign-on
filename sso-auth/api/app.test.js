const app = require("./app");
const request = require("supertest");
const db = require("./database/db");
const authRoute = require("./routes/authRoute");

app.use("/", authRoute);

beforeAll(() => {
  db.query(
    `insert into users (username,user_name,user_surname,user_password,user_email, user_type,createdAt,updatedAt) VALUES ('11adminTest','11admin', '11surname', '$2a$10$A3Yoyj3T.xt2DuKaKQ2qgeLsnL3.H12VztcQirbS2zqhGS87pA5/q', 'testadmin@tst.com','admin', '2021-12-26 01:48:41', '2021-12-26 01:48:41')`
  );
  db.query(
    `insert into users (username,user_name,user_surname,user_password,user_email, user_type,createdAt,updatedAt) VALUES ('11userTest','11user', '11surname', '$2a$10$A3Yoyj3T.xt2DuKaKQ2qgeLsnL3.H12VztcQirbS2zqhGS87pA5/q', 'testuser@tst.com','user', '2021-12-26 01:48:41', '2021-12-26 01:48:41')`
  );
  db.query(
    "SELECT id from users WHERE username = '11adminTest'",
    (err, results, fields) => {
      let id = results[0].id;
      console.log(id);
      db.query(
        `INSERT INTO token (user_id, token, expire_date, url, ip) VALUES ('${id}', 'c62962cb-6c1c-4397-a9bb-d2b81b5fc1da','2030-12-28 18:41:53', 'localhost:3010, localhost:3020', '176.234.231.250')`
      );
      db.query(
        `INSERT INTO token (user_id, token, expire_date, url, ip) VALUES ('${id}', '5a6bd5b0-888d-4776-8f85-f40fd6d9bff4','2021-12-20 18:41:53', 'localhost:3010, localhost:3020', '176.234.231.250')`
      );
      db.query(
        `INSERT INTO token (user_id, token, expire_date, url, ip) VALUES ('${id}', 'f2a3897c-7a81-4f8d-82f1-92ccdfad87f0','2030-12-28 18:41:53', 'localhost:3010', '176.234.231.250')`
      );
    }
  );
});

afterAll(() => {
  db.query("DELETE from users WHERE username = '11adminTest'");
  db.query("DELETE from users WHERE username = '11userTest'");
  db.query(
    "DELETE from token WHERE token = 'c62962cb-6c1c-4397-a9bb-d2b81b5fc1da'"
  );
  db.query(
    "DELETE from token WHERE token = '5a6bd5b0-888d-4776-8f85-f40fd6d9bff4'"
  );
  db.query(
    "DELETE from token WHERE token = 'f2a3897c-7a81-4f8d-82f1-92ccdfad87f0'"
  );
  db.end();
});

describe("login", () => {

  describe("login without credentials", () => {
    test("should return, user not found without username ", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3010/")
        .send({
          username: "",
          password: "pass123",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("username not found");
    });

    test("should return, password doesn't match without password ", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3010/")
        .send({ username: "11adminTest", password: "" });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("password doesn't match");
    });
  });

  describe("login with credentials", () => {
    test("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3010/")
        .send({
          username: "11adminTest",
          password: "pass123",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("logged in");
      expect(response.body.accessToken).toBeDefined();
    });

    test("shouldn't login with incorrect password", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3010/")
        .send({ username: "11adminTest", password: "123321313" });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("password doesn't match");
    });

    test("shouldn't login with incorrect username", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3010/")
        .send({
          username: "123313",
          password: "pass123",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("username not found");
    });

    test("shouldn't login with user account to user-manager", async () => {
      const response = await request(app)
        .post("/isAuthorized/?redirectURL=http://localhost:3020/")
        .send({
          username: "11userTest",
          password: "pass123",
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
