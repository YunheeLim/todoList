import React, { useState, useContext, useEffect } from 'react';
import { DateStateContext, DateDispatchContext } from '../DateContext';
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse } from 'date-fns';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import styles from './Calendar.module.css';

// 헤더 생성 (년도, 월, 월 이동)
const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
        <div className={styles.header}>
            <div className={styles.year_month}>
                <span className={styles.year}>{format(currentMonth, 'yyyy')}년</span>
                {format(currentMonth, 'M')}월
            </div>
            <div className={styles.move_month}>
                <RiArrowLeftSLine size="25px" onClick={prevMonth} />
                <RiArrowRightSLine size="25px" onClick={nextMonth} />
            </div>
        </div>
    );
}

// 일~토 요일 생성
const RenderDays = () => {
    const days = [];
    const date = ['일', '월', '화', '수', '목', '금', '토'];

    for (let i = 0; i < 7; i++) {
        days.push(
            <div className={styles.col} key={i}>
                {date[i]}
            </div>,
        );
    }
    return (
        <div className={styles.days_container}>
            <div className={styles.days}>{days}</div>
        </div>
    );
}

// 한 달 날짜들 생성
const RenderCells = ({ currentMonth, selectedDate, onDateClick }) => {
    const monthStart = startOfMonth(currentMonth); // 월 실제 시작 날짜
    const monthEnd = endOfMonth(monthStart); // 월 실제 마지막 날짜
    const startDate = startOfWeek(monthStart); // 달력 첫 행, 첫 열 날짜
    const endDate = endOfWeek(monthEnd); // 달력  마지막 행, 마지막 열 날짜

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
            days.push(
                <div className={
                    // 해당 월의 날짜인지
                    !isSameMonth(day, monthStart)
                        ? styles.date_not_present
                        // 선택된 날짜 빨간색으로
                        : isSameDay(day, selectedDate)
                            ? styles.date_selected
                            : styles.date
                }
                    key={day}
                    onClick={() => {
                        // 해당 월의 날짜일 경우에만
                        if (format(currentMonth, 'M') === format(cloneDay, 'M')) {
                            onDateClick(cloneDay);
                        }
                    }}
                >
                    {formattedDate}
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className={styles.row} key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className={styles.body}>{rows}</div>
}


export default function Calendar() {
    const date = useContext(DateStateContext);
    const dispatch = useContext(DateDispatchContext);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(()=>{
        dispatch({
            type: 'SELECT',
            date: selectedDate
        });

    }, [selectedDate]);

    // useEffect(()=>{
    //     console.log('print date: ', date);

    // }, [date]);


    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    }
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    }
    const onDateClick = (day) => {
        setSelectedDate(day);
    }

    return (
        <div>
            <RenderHeader
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
            <RenderDays />
            <RenderCells
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateClick={onDateClick}
            />
        </div>
    );
}