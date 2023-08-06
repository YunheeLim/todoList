import React, { useState, useEffect } from 'react';
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login(){
    const navigate = useNavigate();

    // 각 필드값 관리
    // const [id, setId] = useState("");
    // const [pw, setPw] = useState("");
    const [values, setValues] = useState({
        id: "",
        pw: "",
    });

    // 필드 포커싱 시 밑줄 색 변환 관리
    const [id_color, setId_color] = useState(false);
    const [pw_color, setPw_color] = useState(false);

    // 버튼 활성화 색상 관리
    const [button, setButton] = useState(false);

    // 각 필드의 에러메시지 관리
    const [id_error, setId_error] = useState("");
    const [pw_error, setPw_error] = useState("");

    // 각 필드의 포커싱 관리
    const [touching, setTouching] = useState({
        id: false,
        pw: false,
    })

    const handleFocus = e => {
        setTouching({
            ...touching,
            [e.target.name]: true,
        })
    }

    const handleBlur = e => {
        setTouching({
            ...touching,
            [e.target.name]: false,
        })
    }

    const handleChange_id = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
        setId_error("");
    }

    const handleChange_pw = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
        setPw_error("");
    }

    // 모든 피드 입력 시 버튼 글씨 색 검정으로 변경
    useEffect(() => {
        if (values.id !== "" && values.pw !== ""){
            setButton(true);
        }else{
            setButton(false);
        }
    
    }, [values.id, values.pw]);

    // 버튼 클릭 시
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit is called.');
        let isvalid = true;

        // 빈 칸으로 제출했을 경우
        if (values.id === "") {
            setId_error("아이디를 입력해주세요.");
            isvalid = false;
        }
        if (values.pw === "") {
            setPw_error("비밀번호를 입력해주세요.");
            isvalid = false;
        }

        // 유효성 검사 모두 통과 시
        if (isvalid) {
            const id = values.id;
            const password = values.pw;

            try {
                const response = await axios.post('/api/login', { // 서버로 로그인 요청 전송
                    id: id,
                    password: password
                });

                console.log(response.data); // 서버의 응답 출력
                if (response.data.result){
                    navigate('/main');
                } else{
                    window.alert(response.data.msg);
                }
                
            } catch (error) {
                console.error(error);
            }
        }
    }

    return(
        <div className={styles.container1}>
            <div className={styles.container2}>
                <div className={styles.navigation}>
                <Link to="/first">
                    <button className={styles.back}>&#60;</button>
                </Link>
                    <div className={styles.nav_text}>로그인</div>
                </div>
                <form className={styles.login} onSubmit={handleSubmit}>
                    <input type="text" name="id" onChange={handleChange_id} onFocus={handleFocus} onBlur={handleBlur} className={touching.id ? styles.id_active : styles.id} placeholder="아이디" />
                    <div className={styles.error_msg}>{id_error}</div>
                    <input type="password" name="pw" onChange={handleChange_pw} onFocus={handleFocus} onBlur={handleBlur} className={touching.pw ? styles.password_active : styles.password} placeholder="비밀번호"/>
                    <div className={styles.error_msg}>{pw_error}</div>
                    <input type="submit" className={button ? styles.submit_active : styles.submit} value="확인"/>
                </form>
            </div>    
        </div>
    );  
}