import React, {useEffect, useState} from 'react';
import styles from './My.module.css';
import { BsGear } from 'react-icons/bs';
import { BsPersonCircle } from "react-icons/bs";
import { GiHistogram } from 'react-icons/gi';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function My(){

    const [userName, setUserName] = useState('');

    useEffect(()=>{
        getUser();
    },[]);

    async function getUser(){
        await axios
            .get('/api/main')
            .then((response) => {
                setUserName(response.data.userName);
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    const navigate = useNavigate();
    const handleClick = () => {

        axios.get('/api/logout')
        .then(res => {
            console.log(res.data);
            if(res.data.result){
                navigate('/first');
            }
        })
        .catch(err => console.log(err))
        
    }

    return(
        <div className={styles.my_container}>
            <div className={styles.top_bar}>
                {userName}
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