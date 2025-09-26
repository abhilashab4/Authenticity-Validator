import { useAuth } from './AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import InstitutionPage from './pages/InstitutionPage';
import UserPage from './pages/UserPage';

function App() {
  const { isLoggedIn, role } = useAuth();

  return (
    <div className="min-h-screen bg-base-200">
      {isLoggedIn && <Header />}
      <main className={isLoggedIn ? "container mx-auto px-4 py-8" : ""}>
        {isLoggedIn ? (
          role === 'Institution' ? <InstitutionPage /> : <UserPage />
        ) : (
          <LoginPage />
        )}
      </main>
    </div>
  );
}

export default App;
