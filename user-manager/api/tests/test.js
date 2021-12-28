const userService = require("../users/user.service");
test("gelAll test", async () => {
  const deneme = await userService.getAll();
  expect(deneme).toBe("err: deneme");
});
