import React from 'react';
import styles from './Feed.module.css';
import Profile from './Profile';
import Calendar from './Calendar';
import TodoList from './TodoList';
import { TodoProvider } from '../TodoContext';

export default function Feed(){
    return(
        <div className={styles.feed_container}>
            <div className={styles.top_bar}>todo mate</div>
            <TodoProvider>
                <div className={styles.container2}>
                    <div className={styles.left}>
                        <Profile></Profile>
                    <div className={styles.calendar}><Calendar></Calendar></div>
                    </div>
                    <div className={styles.right}><TodoList></TodoList></div>
                </div>
            </TodoProvider>            
        </div>

    );
}