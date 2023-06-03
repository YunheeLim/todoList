import React, { useState, useEffect } from 'react';
import styles from "./SignUpAuth.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SignUpAuth() {
    const [number, setNumber] = useState(0);
    const [focusing, setFocusing] = useState(false);
    const [error, setError] = useState('');
    const [button, setButton] = useState(false);

    const handleFocus = (e) => {
        setFocusing(true);
    }

    const handleBlur = (e) => {
        setFocusing(false);
    }

    const handleChange = (e) => {
        setNumber(e.target.value);
    }

    // 모든 필드 입력 시 버튼 글씨 색 검정으로 변경
    useEffect(() => {
        if (number !== 0){
            setButton(true);
        }else{
            setButton(false);
        }
    }, [number]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit is called.');
        let isvalid = true;

        // 빈 칸으로 제출했을 경우
        if (number === "") {
            setError("인증번호를 입력해주세요.");
            isvalid = false;
        }

        // 유효성 검사 모두 통과 시
        if (isvalid) {
            // 인증번호 변수 전달
            const _number = number;
            try {
                const response = await axios.post('/api/signupAuth', { // 서버로 이메일 인증 요청 전송
                    number: _number
                });

                console.log(response.data); // 서버의 응답 출력
                
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className={styles.container1}>
            <div className={styles.container2}>
                <div className={styles.navigation}>
                    <Link to="/signup">
                        <button className={styles.back}>&#60;</button>
                    </Link>
                    <div className={styles.nav_text}>이메일 인증</div>
                </div>
                <div className={styles.confirm_text}>이메일을 전송했습니다. 확인 후 인증번호를 입력해주세요.</div>
                <form onSubmit={handleSubmit} className={styles.confirm}>
                    <input type="text" name="number" onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className={focusing ? styles.number_active : styles.number} placeholder="인증번호" />
                    <div className={styles.error_msg}>{error}</div>
                    <input type="submit" className={button ? styles.submit_active : styles.submit} value="확인" />
                </form>
            </div>
        </div>
    );
}