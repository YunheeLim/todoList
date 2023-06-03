import React from 'react';
import { BsPersonCircle } from "react-icons/bs";
import styles from './Profile.module.css';

export default function Profile() {
    return(
        <div className={styles.container3}>
            <div className={styles.self_image}>
                <BsPersonCircle size="45px" color="#D8D8D8" />
            </div>
            <div className={styles.profile}>
                <div className={styles.name}>홍길동</div>
                <div className={styles.self_introduction}>프로필에 자기소개를 입력해보세요</div>
            </div>
        </div>        
    ); 
}

