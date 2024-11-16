# todoWeb

## Description
A website for todo-list.<br/>
You can manage things(todo-lists) you should do through many different kinds of functions.<br/>
You can also journal simply and even communicate simply with your following/followers.
![image](https://github.com/YunheeLim/todo_mate/assets/92131041/d4d74090-ab2c-408f-9f71-ab44e5300f05)

## Skills
![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![image](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

## Prerequisite
```shell
npm --version
8.1.0
```
## Usage
Open your terminal and start this project like below.
```shell
cd client
npm install
cd ../server
npm install
cd ..
npm install
npm start
```
You should enter your mySQL information for the database and your Gmail information for the email authenticaiton
### server/config/secret.js 
```javascript
const secret ={}

secret.db={
    DB_USER:"*** YOUR USER ID ***",
    DB_PASSWORD:"*** YOUR PASSWORD ***",
    DB_DATABASE:"*** YOUR DB NAME ***",

}

secret.eAuth={
    user: '*** YOUR GMAIL ID ***',
    pass: '*** YOUR GMAIL PW ***', 
}


module.exports=secret;
```
## Roles
|Front-end|Back-end|
|---|---|
|임윤희|김은진|

