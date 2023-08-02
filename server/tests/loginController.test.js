const { login } = require("../controller/loginController");

describe("로그인 기능", () => {
  real_id = "jennyeunjin";
  real_pw = "12345678";
  fake_id = "!!";

  test("정상 로그인 되어야 함", async () => {
    result = await login(real_id, real_pw);
    expect(result.msg).toEqual("로그인에 성공했습니다.");
  });

  test("로그인 실패해야 함", async () => {
    result = await login(fake_id, real_pw);
    expect(result.msg).toEqual("아이디 또는 비밀번호가 일치하지 않습니다.");
  });
});
