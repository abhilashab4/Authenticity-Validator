import { useAuth } from '../AuthContext';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-content shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Placeholder for Government Emblem */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            AVFA
          </div>
          <div>
            <h1 className="text-xl font-bold">Authenticity Validator for Academia</h1>
            <p className="text-sm opacity-90">Authenticity Validator</p>
          </div>
        </div>
        {isLoggedIn && (
          <button className="btn btn-outline btn-primary-content" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}