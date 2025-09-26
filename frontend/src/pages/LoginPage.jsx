import { useState } from "react";
import { useAuth } from "../AuthContext";
import InputWithIcon from "../components/InputWithIcon"; // import your component

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { login } = useAuth();

  const isFormValid = email && password && role;

  const handleLogin = () => {
    if (isFormValid) {
      login(role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100 rounded-2xl p-10 border border-base-300">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/Jharkhand_Rajakiya_Chihna.svg.png" alt="Government Emblem"/>
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Authenticity Validator
          </h1>
          <p className="text-base-content/70">Government of Jharkhand</p>
          <p className="text-sm text-base-content/50 mt-2">Secure Login Portal</p>
        </div>

        {/* Email Field */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base-content font-medium">Email Address</span>
          </label>
          <InputWithIcon
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base-content font-medium">Password</span>
          </label>
          <InputWithIcon
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            placeholder="Enter your password"
            isPassword={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Role Selector */}
        <div className="form-control mb-8">
          <label className="label">
            <span className="label-text text-base-content font-medium">Login As</span>
          </label>
          <select
            className="select select-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Institution">Institution</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Login Button */}
        <div className="form-control">
          <button
            className="btn btn-primary w-full rounded-lg text-lg font-medium py-3"
            disabled={!isFormValid}
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-base-content/50">
            Secure access for authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
