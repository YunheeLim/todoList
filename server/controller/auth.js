// 문자열의 바이트 수를 확인하는 함수
function getByteLength(str) {
  const encoder = new TextEncoder();
  const encodedStr = encoder.encode(str);
  return encodedStr.length;
}

// 문자열이 이메일 형식으로 이루어져있는지 확인하는 함수
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

module.exports.isValidInput = (user) => {
  var id = user.id;
  var name = user.name;
  var email = user.email;
  var password = user.password;

  var id_length = getByteLength(id);
  var name_length = getByteLength(name);
  var pw_length = getByteLength(password);

  // id 검사: 영문 5자 이상 && 20자 이하
  if (id_length < 5 || id_length > 20) {
    return false;
  }

  // name 검사: 영문 30자 이하 || 한글 10자 이하
  if (name_length > 30 || name_length == 0) {
    return false;
  }

  // email 검사: 이메일 형식으로 이루어져있는지
  if (!validateEmail(email)) {
    return false;
  }

  // 비밀번호 검사: 8자 이상 && 20자 이하
  if (pw_length < 8 || pw_length > 20) {
    return false;
  }

  return true;
};
