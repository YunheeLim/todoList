import React, { useContext, useState, useEffect } from 'react';
import { TodoStateContext, TodoNextIdContext, TodoDispatchContext } from '../TodoContext';
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import { AiFillPlusCircle } from 'react-icons/ai';
import styles from './TodoList.module.css';

const TodoHead = () => {
    const todos = useContext(TodoStateContext);
    const dispatch = useContext(TodoDispatchContext);
    const nextId = useContext(TodoNextIdContext);
    const undoneTasks = todos.filter(todo => !todo.done);
    const [input_text, SetInput_text] = useState('');
    const [isFormed, SetIsFormed] = useState(false);

    
    const TodoCreate = (e) => {
        e.preventDefault();

        dispatch({
            type: 'CREATE',
            todo: {
                id: nextId.current,
                text: input_text,
                done: false
            }
        });
        nextId.current += 1;
        SetInput_text('');
        SetIsFormed(false)
    }

    const handleChange = (e) => {
        SetInput_text(e.target.value);
    }

    let form = null;
    if (isFormed === true) {
        form = <div className={styles.input_container}>
                    <BsCircle size="19px" color="#BDBDBD" ></BsCircle>
                    <form onSubmit={TodoCreate}>
                        <input type="text" autoFocus value={input_text} placeholder='입력 후 Enter' onChange={handleChange} className={styles.input_text}/>
                    </form>
                </div>
    } 

    const makeForm = () => {
        SetIsFormed(true);
    }

    return (
        <div>
            <div className={styles.todoCreate}>할 일 {undoneTasks.length}개 남음
                <div className={styles.create_icon} onClick={makeForm}>
                    <AiFillPlusCircle size="22px"></AiFillPlusCircle>
                </div>
            </div>
            {form}
        </div>
    );
}

const TodoItem = ({ id, done, text }) => {
    const todos = useContext(TodoStateContext);
    const dispatch = useContext(TodoDispatchContext);
    const nextId = useContext(TodoNextIdContext);

    const onToggle = () => dispatch({ type: 'TOGGLE', id });
    const onRemove = () => {
        dispatch({ type: 'REMOVE', id });
        // todo: 삭제 후 뒷 아이템들 id 하나씩 당기기
        // console.log(todos);
        nextId.current -= 1;
    }

    let icon = null;

    if (done === true) {
        icon = <BsCheckCircleFill size="19px" onClick={onToggle}></BsCheckCircleFill>
    } else if (done === false) {
        icon = <BsCircle size="19px" color="#BDBDBD" onClick={onToggle}></BsCircle>
    }

    return (
        <div className={styles.todoItem_container}>
            <div className={styles.checkBox}>
                {icon}
            </div>
            <div className={styles.text}>
                {text}
            </div>
            <div className={styles.delete} onClick={onRemove}>
                삭제
            </div>
        </div>
    );
}

export default function TodoList() {
    const todos = useContext(TodoStateContext);

    console.log(todos);
    return (
        <div>
            <TodoHead></TodoHead>
            {todos && todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    done={todo.done}
                />
            ))}
        </div>
    );
}