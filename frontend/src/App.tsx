import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './pages/ProtectedRoute';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    <div className="overflow-hidden w-[100vw] h-[100vh] flex flex-col p-4 bg-gray-100">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/board" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}


export default App;
