import { useState } from "react";
import InputWithIcon from "../components/InputWithIcon"; // import your component

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const isFormValid = email && password && role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="card w-full max-w-md shadow-2xl bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Authenticity Validator
        </h1>
        <p className="text-center text-gray-500 mb-8">Login to continue</p>

        {/* Email Field */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-gray-700">Email</span>
          </label>
          <InputWithIcon
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.761 0 5.303.879 7.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
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
            <span className="label-text text-gray-700">Password</span>
          </label>
          <InputWithIcon
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3V7a3 3 0 10-6 0v1c0 1.657 1.343 3 3 3z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"/>
              </svg>
            }
            placeholder="Enter your password"
            isPassword={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Role Selector */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-gray-700">Login as</span>
          </label>
          <select
            className="select select-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Login Button */}
        <div className="form-control">
          <button
            className="btn btn-primary w-full rounded-md"
            disabled={!isFormValid}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
