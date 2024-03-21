import './App.css';
import Login from './Login/Login';
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/User/Home';
import ChangePassword from './Login/ChangePassword';

function App() {

  const token = localStorage.getItem('token')

  return (

    <div className="App">

      <HashRouter>

        <Routes>

            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/change-password' element={<ChangePassword />} />
      

        </Routes>

      </HashRouter >
      
    </div>
  );
}

export default App;
