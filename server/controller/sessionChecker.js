const session = require('express-session');


const sess={};

// 세션 있으면 next로, 세션 없으면 index page로
sess.sessionExist = (req, res, next) => {
  // 세션이 존재하는지 확인
  if (req.session&&req.session.userId) {
    // 세션 정보가 있는 경우, 다음 미들웨어로 이동
    next();
  } else {
    // 세션 정보가 없는 경우, 로그인 페이지로 리다이렉트 또는 에러 처리 등을 수행할 수 있습니다.
    res.redirect('/index'); // 예시로 첫 페이지로 리다이렉트하도록 설정했습니다.
  }
};

// 세션 있으면 alert띄우면서 이전 페이지로, 세션 없으면 next로
sess.sessionNotExist=(req,res,next)=>{
    //세션 존재하는 경우
    if(req.session&&req.session.userId){
        res.render('accessFail',{msg:'이미 로그인했습니다. 접근할 수 없습니다.'});
    }else{ //세션 없는 경우
        next();
    }
}

module.exports = sess;
