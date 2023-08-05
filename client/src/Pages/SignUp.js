import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
    const navigate = useNavigate();

    // 각 필드값 관리
    const [values, setValues] = useState({
        id: "",
        nickName: "",
        email: "",
        pw: "",
        pw_test: "",
    })

    // 필드 포커싱 시 밑줄 색 변환 관리
    const [id_color, setId_color] = useState(false);
    const [nickName_color, setNickName_color] = useState(false);
    const [email_color, setEmail_color] = useState(false);
    const [pw_color, setPw_color] = useState(false);
    const [pw_test_color, setPw_test_color] = useState(false);

    // 버튼 활성화 색상 관리
    const [button, setButton] = useState(false);

    // 각 필드의 에러메시지 관리
    const [id_error, setId_error] = useState("");
    const [nickName_error, setNickName_error] = useState("");
    const [email_error, setEmail_error] = useState("");
    const [pw_error, setPw_error] = useState("");
    const [pw_test_error, setPw_test_error] = useState("");

    // 각 필드의 포커싱 관리
    const [touching, setTouching] = useState({
        id: false,
        nickName: false,
        email: false,
        pw: false,
        pw_test: false,
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

    // const handleButton = e => {
    //     setButton(true);
    // }

    // 각 필드값 유효성 체크
    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => { // 비동기 처리 방지
        // 영문, 숫자로 이루어진 5-20자
        const idRegex = new RegExp('^[A-Za-z0-9]{5,20}$');

        if (touching.id === true) {
            setId_color(true);
            if (!idRegex.test(values.id)) {
                setId_error("아이디는 영문과 숫자로 이루어진 5자 이상, 20자 이내로 입력해주세요.");
            } else {
                setId_error("");
            }
        } else {
            setId_color(false);
            if (values.id === "" || idRegex.test(values.id)) {
                setId_error("");
            } else {
                setId_error("아이디는 영문과 숫자로 이루어진 5자 이상, 20자 이내로 입력해주세요.");
            }
        }
    }, [values.id, touching.id]);


    const handleChange2 = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }

    useEffect(() => {
        if (touching.nickName === true) {
            setNickName_color(true);
            if (values.nickName.length < 2 || values.nickName.length > 10) {
                setNickName_error("닉네임은 2자 이상, 10자 이내로 입력해주세요.");
            } else {
                setNickName_error("");
            }
        } else {
            setNickName_color(false);
            if (values.nickName === "" || !(values.nickName.length < 2 || values.nickName.length > 10)) {
                setNickName_error("");
            } else {
                setNickName_error("닉네임은 2자 이상, 10자 이내로 입력해주세요.");
            }
        }
    }, [values.nickName, touching.nickName]);


    const handleChange3 = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{3}');

        if (touching.email === true) {
            setEmail_color(true);
            //이메일 형식 제한
            if (!emailRegex.test(values.email)) {
                setEmail_error("올바른 이메일 형식을 사용해주세요.");
            } else {
                setEmail_error("");
            }
        } else {
            setEmail_color(false);
            if (values.email === "" || emailRegex.test(values.email)) {
                setEmail_error("");
            } else {
                setEmail_error("올바른 이메일 형식을 사용해주세요.");
            }
        }
    }, [values.email, touching.email]);

    const handleChange4 = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (touching.pw === true) {
            setPw_color(true);
            if (values.pw.length < 8 || values.pw.length > 20) {
                setPw_error("비밀번호는 8자 이상, 20자 이내로 입력해주세요.");
            } else {
                setPw_error("");
            }
        } else {
            setPw_color(false);
            if (values.pw === "" || !(values.pw.length < 8 || values.pw.length > 20)) {
                setPw_error("");
            } else {
                setPw_error("비밀번호는 8자 이상, 20자 이내로 입력해주세요.");
            }
        }
    }, [values.pw, touching.pw]);

    const handleChange5 = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (touching.pw_test === true) {
            setPw_test_color(true);
            if (values.pw !== values.pw_test) {
                setPw_test_error("비밀번호가 일치하지 않습니다.");
            } else {
                setPw_test_error("");
            }
        } else {
            setPw_test_color(false);
            if (values.pw_test === "" || !(values.pw !== values.pw_test)) {
                setPw_test_error("");
            } else {
                setPw_test_error("비밀번호가 일치하지 않습니다.");
            }
        }
    }, [values.pw_test, touching.pw_test]);

    // 모든 피드 입력 시 버튼 글씨 색 검정으로 변경
    useEffect(() => {
        if (id_error === "" && nickName_error === "" && email_error === "" && pw_error === "" && pw_test_error === ""){
            if (values.id !== "" && values.nickName !== "" && values.email !== "" && values.pw !== "" && values.pw_test !== ""){
                setButton(true);
            }else{
                setButton(false);
            }
        }else{
            setButton(false);
        }
    }, [values, id_error, nickName_error, email_error, pw_error, pw_test_error]);


    // 제출 했을 시
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit is called.');
        let isvalid = true;

        // 빈 칸으로 제출했을 경우
        if (values.id === "") {
            setId_error("아이디를 입력해주세요.");
            isvalid = false;
        }
        if (values.nickName === "") {
            setNickName_error("닉네임을 입력해주세요.");
            isvalid = false;
        }
        if (values.email === "") {
            setEmail_error("이메일을 입력해주세요.");
            isvalid = false;
        }
        if (values.pw === "") {
            setPw_error("비밀번호를 입력해주세요.");
            isvalid = false;
        }

        // 유효성 검사 모두 통과 시
        if (isvalid) {
            const id = values.id;
            const name = values.nickName;
            const password = values.pw;
            const email = values.email;

            try {
                const response = await axios.post('/api/signup', { // 서버로 회원가입 요청 전송
                    id: id,
                    name: name,
                    email: email,
                    password: password
                });
                console.log(response.data); // 서버의 응답 출력
                if (response.data.result === true){
                    navigate('/signupAuth');
                }else if(response.data.result === false){
                    window.alert(response.data.msg);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className={styles.container1}>
            <div className={styles.container2}>
                <div className={styles.navigation}>
                    <Link to="/first">
                        <button className={styles.back}>&#60;</button>
                    </Link>
                    <div className={styles.nav_text}>회원가입</div>
                </div>
                <form className={styles.login} onSubmit={handleSubmit}>
                    <input type="text" name="id" value={values.id} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} className={id_color ? styles.id_active : styles.id} placeholder="아이디" />
                    <div className={styles.error_msg}>{id_error}</div>
                    <input type="text" name="nickName" value={values.nickName} onChange={handleChange2} onFocus={handleFocus} onBlur={handleBlur} className={nickName_color ? styles.nickName_active : styles.nickName} placeholder="닉네임" />
                    <div className={styles.error_msg}>{nickName_error}</div>
                    <input type="text" name="email" value={values.email} onChange={handleChange3} onFocus={handleFocus} onBlur={handleBlur} className={email_color ? styles.email_active : styles.email} placeholder="이메일" />
                    <div className={styles.error_msg}>{email_error}</div>
                    <input type="password" name="pw" value={values.pw} onChange={handleChange4} onFocus={handleFocus} onBlur={handleBlur} className={pw_color ? styles.password_active : styles.password} placeholder="비밀번호" />
                    <div className={styles.error_msg}>{pw_error}</div>
                    <input type="password" name="pw_test" value={values.pw_test} onChange={handleChange5} onFocus={handleFocus} onBlur={handleBlur} className={pw_test_color ? styles.password_test_active : styles.password_test} placeholder="비밀번호 확인" />
                    <div className={styles.error_msg}>{pw_test_error}</div>
                    <input type="submit" className={button ? styles.submit_active : styles.submit} value="확인" />
                </form>
            </div>
        </div>
    );
}