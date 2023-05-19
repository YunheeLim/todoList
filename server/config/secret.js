const secret ={}

// mysql 계정 설정
secret.db={
    DB_USER:"*** YOUR USER ID ***",
    DB_PASSWORD:"*** YOUR PASSWORD ***",
    DB_DATABASE:"*** YOUR DB NAME ***",
}

// 인증코드 메일 발송을 위한 계정 설정
secret.eAuth={
    user: '*** YOUR GMAIL ID ***',
    pass: '*** YOUR GMAIL PW ***',
}


module.exports=secret;
