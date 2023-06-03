import React from 'react';
import styles from "./SignUpResult.module.css";
import { Link } from "react-router-dom";

export default function SignUpResult() {

    return (
        <div className={styles.container1}>
            <div className={styles.container2}>
                <div className={styles.navigation}>
                    <Link to="/">
                        <button className={styles.back}>&#60;</button>
                    </Link>
                    <div className={styles.nav_text}>회원가입 완료</div>
                </div>
                <div className={styles.text}>축하합니다. 회원가입이 완료되었습니다!</div>
                <Link to="/login">
                    <button className={styles.login_btn}>로그인하기</button>
                </Link>
                <Link to="/first">
                    <button className={styles.signUp_btn}>첫 화면으로 돌아가기</button>
                </Link>
            </div>
        </div>
    );
}