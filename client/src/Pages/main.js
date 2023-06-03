import React, { useState } from 'react';
import styles from "./Main.module.css";
// import Profile from "./MainComponents/Feed/Profile";
// import Calendar from "./MainComponents/Feed/Calendar";
// import TodoList from "./MainComponents/Feed/TodoList";
import Navigation from './MainComponents/Navigation';
import Feed from './MainComponents/Feed/Feed';
import Search from './MainComponents/Search/Search';
import Notification from './MainComponents/Notification/Notification';
import My from './MainComponents/My/My';
import { TodoProvider } from './MainComponents/TodoContext';

export default function Main() {
    const [mode, setMode] = useState('feed');
    const changeMode = (mode) => {
        setMode(mode);
    }

    let component = null;
    if (mode === 'feed') {
        component = <TodoProvider>
                        <Feed></Feed>
                    </TodoProvider>
    } else if (mode === 'search'){
        component = <Search></Search>
    } else if (mode === 'notification'){
        component = <Notification></Notification>
    } else if (mode === 'my'){
        component = <My></My>
    }

    return (
        <div className={styles.container}>
            {component}
            <Navigation className={styles.navigation} mode={mode} changeMode={changeMode}></Navigation>
        </div>
    );
}