import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center p-4">
      {isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
}

export default App;