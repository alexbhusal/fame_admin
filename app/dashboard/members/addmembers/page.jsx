"use client";
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, firestore } from "../../../../utils/firebase";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { doc, setDoc } from "firebase/firestore";
import Spin from "@/Components/Animation/Spin";
import UploadImage from "@/Components/Main/UploadImage";
import RegAnimation from "@/Components/Animation/RegAni";

const Page = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [imgurl, setImageUrl] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const password = e.target.value;
    setPassword(password);

    // Check for uppercase letters
    setIsUpperCase(/[A-Z]/.test(password));

    // Check for lowercase letters
    setIsLowerCase(/[a-z]/.test(password));

    // Check for special characters
    setHasSpecialChar(/[!@#$%^&*]/.test(password));

    // Check for number include
    setHasNumber(/\d/.test(password));

    // Check for minimum length of 8
    setIsLongEnough(password.length >= 8);
  };
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);

    // Check if passwords match
    setIsPasswordsMatch(password === confirmPassword);
  };

  const validateFullName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleReg = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    if (!imgurl) {
      toast.error("Please upload an image");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    } else if (!validatePassword(password)) {
      toast.error("Password must meet all the requirements");
      setLoading(false);
      return;
    } else if (!validateFullName(fullName)) {
      toast.error("Full name must contain only letters and spaces");
      setLoading(false);
      return;
    } else if (!validateEmail(email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(firestore, "admin", user.uid), {
        fullName,
        email,
        imgurl,
        designation,
        createdAt: new Date(),
      });

      await sendEmailVerification(user);
      toast.warning(
        "Registration successful! Check your email for verification."
      );

      setTimeout(() => {
        router.push("/dashboard/members");
      }, 2000);
    } catch (e) {
      toast.error(e.message || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-3xl md:text-5xl m-2 md:m-5 text-black font-serif">
        Add Members
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full h-full md:w-3/5 ">
          <RegAnimation />
        </div>
        <div className="border-l-4 border-black"></div>
        <div className="mx-2 md:mx-12">
          <div>
            <ToastContainer />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <div className="flex justify-center items-center">
              <div className=" w-48 h-48  overflow-hidden rounded-full">
                <img
                  src={
                    imgurl ||
                    "https://imgs.search.brave.com/JAHeWxUYEwHB7KV6V1IbI9oL7wxJwIQ4Sbp8dHQL09A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAx/MzkxNTc2NC9waG90/by91c2VyLWljb24t/aW4tZmxhdC1zdHls/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9UEotMnZvUWZh/Q3hhZUNsdzZYYlVz/QkNaT3NTTjlIVWVC/SUg1Qk82VmRScz0"
                  }
                  className="w-full h-full object-cover object-center"
                  alt="Profile"
                />
              </div>
            </div>

            <div className="flex justify-center md:justify-center items-center ">
              <UploadImage setImageUrl={setImageUrl} />
            </div>
            <form onSubmit={handleReg}>
              <div className="mb-4">
                <input
                  type="text"
                  id="fullName"
                  placeholder="Full Name"
                  className=" focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72 border-2 border-indigo-500 p-3 rounded-full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="designation"
                  placeholder="Designation"
                  className=" focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72 border-2 border-indigo-500 p-3 rounded-full"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="Email"
                  type="email"
                  className=" focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72 border-2 border-indigo-500 p-3 rounded-full"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className=" focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72 border-2 border-indigo-500 p-3 rounded-full"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPassword"
                  className={`focus:outline-none focus:ring-2  w-full md:w-72 border-2 p-3 rounded-full ${
                    isPasswordsMatch
                      ? "border-indigo-500 focus:ring-indigo-500"
                      : "border-red-500 focus:ring-red-500"
                  }`} // Apply red border if passwords don't match
                  // className=" focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72 border-2 border-indigo-500 p-3 rounded-full"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {password && (
                <div className="flex text-base justify-center items-center gap-6 my-2">
                  <span
                    className={isUpperCase ? "text-green-500" : "text-red-500"}
                  >
                    A-Z
                  </span>
                  <span
                    className={isLowerCase ? "text-green-500" : "text-red-500"}
                  >
                    a-z
                  </span>
                  <span
                    className={
                      hasSpecialChar ? "text-green-500" : "text-red-500"
                    }
                  >
                    !@#$%^&
                  </span>
                  <span
                    className={hasNumber ? "text-green-500" : "text-red-500"}
                  >
                    0-9
                  </span>
                  <span
                    className={isLongEnough ? "text-green-500" : "text-red-500"}
                  >
                    min 8
                  </span>
                </div>
              )}

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className=" bg-indigo-500 px-3 py-2 text-white font-extrabold rounded-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-20">
                      <Spin />
                    </div>
                  ) : (
                    "ADD MEMBER"
                  )}
                </button>
              </div>
              <div className="mt-5"></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
