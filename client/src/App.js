import { Route, Routes } from "react-router-dom";
import First from './Pages/First';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Main from './Pages/Main';
import EmailConfirm from "./Pages/EmailConfirm";

function App() {

  return (
    <Routes>
      <Route path="/" element={<First/>}/>
      <Route path="/first" element={<First/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/emailconfirm" element={<EmailConfirm/>}/>
      <Route path="/main" element={<Main/>}/>

    </Routes>
  );
}

export default App;
