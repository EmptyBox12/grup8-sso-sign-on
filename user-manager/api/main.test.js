const request = require("supertest");
const app = require("./server");
const router = require("./users/users.controller");
app.use("/users", router);

test("should getUsers", async () => {
  const response = await request(app)
    .get("/users/?url=http://localhost:3020/")
    .set({
      ip: "176.234.231.250",
      authorization: `Bearer 9992ef4a-1229-4f8c-94f2-1f8bc660c0c2`,
    });
  expect(response.statusCode).toBe(200);
});
