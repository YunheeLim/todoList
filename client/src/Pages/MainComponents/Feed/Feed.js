import React, { useState, useEffect } from 'react';
import styles from './Feed.module.css';
import Profile from './Profile';
import Calendar from './Calendar';
import TodoList from './TodoList';
import { TodoProvider } from '../TodoContext';
import { format } from 'date-fns';
import axios from "axios";

export default function Feed(){
    const [user, setUser] = useState([]);
    
    useEffect(()=>{
        getUser();
    },[]);

    async function getUser(){
        await axios
            .get('/api/main')
            .then((response) => {
                setUser(response.data);
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    // const getDate = (_date) => {
    //     setYear(format(_date, 'Y'));
    //     setMonth(format(_date, 'M'));
    //     setDay(format(_date, 'd'));
    // }

    return(
        <div className={styles.feed_container}>
            <div className={styles.top_bar}>todo mate</div>
            <TodoProvider>
                <div className={styles.container2}>
                    <div className={styles.left}>
                        <Profile userName={user.userName}></Profile>
                    <div className={styles.calendar}><Calendar></Calendar></div>
                    </div>
                    <div className={styles.right}><TodoList userId={user.userId}></TodoList></div>
                </div>
            </TodoProvider>            
        </div>

    );
}