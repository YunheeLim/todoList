import React, { useContext, useState, useEffect } from 'react';
import { TodoStateContext, TodoNextIdContext, TodoDispatchContext, TodoDateContext } from '../TodoContext';
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import { AiFillPlusCircle } from 'react-icons/ai';
import styles from './TodoList.module.css';
import axios from "axios";

const TodoHead = ({cat_title}) => {
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
            <div className={styles.todoCreate}>{cat_title}
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

const TodoItemNew = ({ id, done, text }) => {

    let icon = null;

    if (done === true) {
        icon = <BsCheckCircleFill size="19px" ></BsCheckCircleFill>
    } else if (done === false) {
        icon = <BsCircle size="19px" color="#BDBDBD" ></BsCircle>
    }

    return (
        <div className={styles.todoItem_container}>
            <div className={styles.checkBox}>
                {icon}
            </div>
            <div className={styles.text}>
                {text}
            </div>
            <div className={styles.delete}>
                삭제
            </div>
        </div>
    );
}


export default function TodoList({_userId}) {
    const [categories, setCategories] = useState([]);
    const [info, setInfo] = useState([]);
    const [date, setDate] = useState({});

    const todos = useContext(TodoStateContext);
    // console.log(todos);
    const _date = useContext(TodoDateContext);

    useEffect(()=>{
        getCategories();
        getInfo();
        setDate(_date.current);
        console.log('date check: ', date);
    }, []);

    // console.log(info);

    async function getCategories(){
        await axios
            .get('/api/main/category')
            .then((response) => {
                setCategories(response.data);

            })
            .catch((error)=>{
                console.log(error);
            })
    }

    async function getInfo(){
        await axios
            // 미완성: userId 동적 정보로 변환
            .get('/api/main/todo?userId=aaaaa&year=2023&month=8')
            .then((response) => {
                setInfo(response.data);
            })
            .catch((error)=>{
                console.log(error);
            })     
    }

    const rendering_categories = () => {
        const result_categories = [];

        for(let i = 0; i < categories.length; i++){
            result_categories.push(<TodoHead
                key={categories[i].cat_id}
                cat_title={categories[i].cat_title}
                />);

            for(let j = 0; j < info.todo_count; j++){
                if(info.todo_list[0].categorys[j].cat_id === categories[i].cat_id){
                    for(let k = 0 ; k < info.todo_list[0].categorys[j].todos.length; k++){
                        result_categories.push(<TodoItemNew 
                            key={info.todo_list[0].categorys[j].todos[k].todo_id}
                            id={info.todo_list[0].categorys[j].todos[k].todo_id}
                            text={info.todo_list[0].categorys[j].todos[k].todo_cont}
                            done={false}
                        />);
                    }
                    
                }
            }
        }
        return result_categories;
    }

    
    return (
        <div>
            {rendering_categories()}
            {/* {categories && categories.map(category => (
                <TodoHead
                    key={category.cat_id}
                    cat_title={category.cat_title}
                />
            ))} */}
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