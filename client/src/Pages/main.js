import React from 'react';
import styles from "./Main.module.css";
import Calendar from "./Calendar";
import { RiHome6Fill, RiNotification2Fill } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { BsPersonCircle, BsFillPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Main(){

    return(
        <div className={styles.container}>
            <div className={styles.top_bar}>todo mate</div>
            <div className={styles.container2}>
                <div className={styles.left}>
                <div className={styles.container3}>
                    <div className={styles.self_image}>
                        <BsPersonCircle size="45px" color="#D8D8D8"/>
                    </div>
                    <div className={styles.profile}>
                        <div className={styles.name}>홍길동</div>
                        <div className={styles.self_introduction}>프로필에 자기소개를 입력해보세요</div>
                    </div>

                </div>
                <div className={styles.calendar}><Calendar></Calendar></div>
                </div>
                <div className={styles.right}>할 일 리스트</div>
            </div>
            <div className={styles.navigation}>
                <div className={styles.feed_icon_container}>
                    <RiHome6Fill size="30px" className={styles.icons} /> 
                    <div className={styles.icon_texts}>피드</div>
                </div>
                <div className={styles.search_icon_container}>
                    <BiSearch size="30px" className={styles.icons} />
                    <div className={styles.icon_texts}>검색</div>
                </div>
                <div className={styles.notification_icon_container}>
                    <RiNotification2Fill size="30px" className={styles.icons} />
                    <div className={styles.icon_texts}>알림</div>
                </div>
                <div className={styles.my_icon_container}>
                    <BsFillPersonFill size="30px" className={styles.icons} />
                    <div className={styles.icon_texts}>My</div>
                </div>
            </div>
        </div>
    );
}