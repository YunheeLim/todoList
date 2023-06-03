import React, { useState } from 'react';
import { RiHome6Fill, RiNotification2Fill } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import styles from './Navigation.module.css';

export default function Navigation(props) {
    const [selected, SetSelected] = useState({
        'feed': true,
        'search': false,
        'notification': false,
        'my': false,
    });

    const handleChange_feed = () => {
        props.changeMode('feed');
        SetSelected({
            feed: true,
            search: false,
            notification: false,
            my: false,
        });
    }

    const handleChange_search = () => {
        props.changeMode('search');
        SetSelected({
            feed: false,
            search: true,
            notification: false,
            my: false,
        });
    }

    const handleChange_notification = () => {
        props.changeMode('notification');
        SetSelected({
            feed: false,
            search: false,
            notification: true,
            my: false,
        });
    }

    const handleChange_my = () => {
        props.changeMode('my');
        SetSelected({
            feed: false,
            search: false,
            notification: false,
            my: true,
        });
    }

    return (
        <div className={styles.navigation}>
            <div className={styles.feed_icon_container} onClick={handleChange_feed}>
                <RiHome6Fill size="30px"
                    className={
                        selected.feed
                            ? styles.icons_selected
                            : styles.icons
                    } />
                <div className={
                    selected.feed
                        ? styles.icon_texts_selected
                        : styles.icon_texts
                }>피드</div>
            </div>
            <div className={styles.search_icon_container} onClick={handleChange_search}>
                <BiSearch size="30px"
                    className={
                        selected.search
                            ? styles.icons_selected
                            : styles.icons
                    }
                />
                <div className={
                    selected.search
                        ? styles.icon_texts_selected
                        : styles.icon_texts
                }>검색</div>
            </div>
            <div className={styles.notification_icon_container} onClick={handleChange_notification}>
                <RiNotification2Fill size="30px"
                    className={
                        selected.notification
                            ? styles.icons_selected
                            : styles.icons
                    }
                />
                <div className={
                    selected.notification
                        ? styles.icon_texts_selected
                        : styles.icon_texts
                }>알림</div>
            </div>
            <div className={styles.my_icon_container} onClick={handleChange_my}>
                <BsFillPersonFill size="30px"
                    className={
                        selected.my
                            ? styles.icons_selected
                            : styles.icons
                    }
                />
                <div className={
                    selected.my
                        ? styles.icon_texts_selected
                        : styles.icon_texts
                }
                >My</div>
            </div>
        </div>
    );
}