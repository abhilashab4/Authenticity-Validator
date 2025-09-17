import { useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';

function App() {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn) {
    return role === 'Admin' ? <AdminPage /> : <UserPage />;
  } else {
    return <LoginPage />;
  }
}

export default App;
