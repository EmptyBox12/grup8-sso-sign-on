import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserCard from "../Usercard";

describe("UserCard", () => {
  test("renders information", () => {
    let user = {
      id: "1",
      username: "testname",
      user_name: "name",
      user_surname: "surname",
      user_email: "test@gmail.com",
      user_type: "admin",
    };
    render(<UserCard user={user} />);
    let userInfo = screen.getByText("testname / name surname");
    let leftSide = screen.getByText("1");
    let emailInfo = screen.getByText("test@gmail.com / admin");

    expect(userInfo).toBeInTheDocument();
    expect(leftSide).toBeInTheDocument();
    expect(emailInfo).toBeInTheDocument();
  });
});
