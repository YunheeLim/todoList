import { Route, Routes } from "react-router-dom";
import First from './Pages/First';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Main from './Pages/Main';
import SignUpAuth from './Pages/SignUpAuth';
import SignUpResult from './Pages/SignUpResult';

function App() {

  return (
    <Routes>
      <Route path="/" element={<First/>}/>
      <Route path="/first" element={<First/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signupAuth" element={<SignUpAuth/>}/>
      <Route path="/signupResult" element={<SignUpResult/>}/>
      <Route path="/main" element={<Main/>}/>

    </Routes>
  );
}

export default App;
