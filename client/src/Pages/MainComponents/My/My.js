import React from 'react';
import styles from './My.module.css';
import { BsGear } from 'react-icons/bs';
import { BsPersonCircle } from "react-icons/bs";
import { GiHistogram } from 'react-icons/gi';
import { Link } from "react-router-dom";
import axios from "axios";

export default function My(){
    const handleClick = () => {
        try {
            const response = axios.get('/api/logout');
            // todo: response.data.success 받기
            window.location = "/First";
        } catch (error) {
            console.error(error);
        }
        
    }

    return(
        <div className={styles.my_container}>
            <div className={styles.top_bar}>
                홍길동
                <BsGear size="18px" className={styles.gear}></BsGear>
            </div>
            <div className={styles.info}>
                <div className={styles.profile_image}><BsPersonCircle size="50px" color="#BDBDBD"></BsPersonCircle></div>
                <div className={styles.follower}>
                    <div>4</div>
                    <div>팔로워</div>
                </div>
                <div className={styles.following}>
                    <div>4</div>
                    <div>팔로잉</div>
                </div>
                <div className={styles.history}>
                    <GiHistogram size="16px"></GiHistogram>
                    <div>나의 기록</div>
                </div>
            </div>
            <div className={styles.saying}>
                <p>자신이 자신의 지휘관이다.</p>
                <p>-플라우투스</p>
            </div>
            <button className={styles.logout} onClick={handleClick}>로그아웃</button>
        </div>
    );
}