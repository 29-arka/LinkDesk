import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up"); // "Sign up" or "Login"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP handling
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const { login } = useContext(AuthContext);

  // Main form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      // Step 1: user fills basic signup info
      setIsDataSubmitted(true);
      return;
    }

    if (currState === "Sign up" && isDataSubmitted && !otpSent) {
      // Step 2: request OTP after submitting all signup details
      await login("signup", { fullName, email, password, bio });
      setOtpSent(true);
      return;
    }

    if (currState === "Sign up" && otpSent) {
      // Step 3: verify OTP
      await login("verify-otp", { email, otp });
      return;
    }

    if (currState === "Login") {
      // Normal login
      await login("login", { email, password });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {otpSent ? "Verify OTP" : currState}
          {(isDataSubmitted || otpSent) && (
            <img
              onClick={() => {
                setIsDataSubmitted(false);
                setOtpSent(false);
              }}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* Signup flow */}
        {currState === "Sign up" && !isDataSubmitted && (
          <>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full Name"
              required
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show Password</span>
            </div>
          </>
        )}

        {!isDataSubmitted && currState !== "Sign up" && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show Password</span>
            </div>
          </>
        )}

        {/* Signup extra details */}
        {currState === "Sign up" && isDataSubmitted && !otpSent && (
          <>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Bio..."
              required
            ></textarea>
          </>
        )}

        {/* OTP input */}
        {otpSent && (
          <input
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            type="text"
            placeholder="Enter OTP"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {otpSent
            ? "Verify OTP"
            : currState === "Sign up"
            ? "Create Account"
            : "Login Now"}
        </button>

        {/* Only show terms for non-OTP stage */}
        {!otpSent && (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" required />
              <p>Agree to the terms of use & privacy policy</p>
            </div>
            <div className="flex flex-col gap-2">
              {currState === "Sign up" ? (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setCurrState("Login");
                      setIsDataSubmitted(false);
                      setOtpSent(false);
                    }}
                    className="font-medium text-violet-500 cursor-pointer"
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Create an account{" "}
                  <span
                    onClick={() => {
                      setCurrState("Sign up");
                      setIsDataSubmitted(false);
                      setOtpSent(false);
                    }}
                    className="font-medium text-violet-500 cursor-pointer"
                  >
                    Click here
                  </span>
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
