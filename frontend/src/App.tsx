import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './pages/ProtectedRoute';
import BoardPage from './pages/BoardPage';
import { Toaster } from './components/ui/toaster';
import { useStoreActions } from './state/typedHooks';

function App() {
  const { setTasks, setSyncInfo } =
    useStoreActions((action) => action);
  const tasksParsed = JSON.parse(localStorage.getItem('tasks') || '[]');
  const syncInfoParsed = JSON.parse(localStorage.getItem('syncInfo') || '{}');
  if (tasksParsed.length > 0) {
    setTasks(tasksParsed);
    console.log('loaded tasks from local storage');
  }
  if (Object.keys(syncInfoParsed).length > 0) {
    setSyncInfo({ status: syncInfoParsed?.status ?? '', lastSuccessfulSyncAt: syncInfoParsed?.lastSuccessfulSyncAt ?? '' });
    console.log('loaded syncInfo from local storage');
  }

  return (
    <div className="overflow-x-hidden overflow-y-auto w-[100vw] h-[100vh] flex flex-col p-4 bg-gray-100">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
            <Route path="/board" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
    </div>
  );
}


export default App;
