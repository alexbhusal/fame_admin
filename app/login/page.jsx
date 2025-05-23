"use client";
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from "../../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Spin from '@/Components/Animation/Spin';
import LoginAnimation from '@/Components/Animation/LoginAni';


const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLog = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const token = await user.getIdToken();
        Cookies.set("token", token, { path: "/", expires: 30 });
         setDoc(doc(firestore, "log", user.uid), {
                email,
                LoggedAt: new Date().toISOString()
              });
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.warning("Please verify your email.");
        setTimeout(() => {
         
        }, 2000);
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        setError("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-3xl md:text-5xl font-bold m-5 md:m-10 text-black">Admin Login</h1>
      <div className="flex flex-col md:flex-row">
        <div className="h-full w-full md:w-11/12">
          <LoginAnimation />
        </div>
        <div className="border-l-4 border-black md:h-180 mx-2"></div>
        <div className="mt-10 md:mt-20 w-full md:w-1/2">
          <div className="login-container mx-4 sm:mx-12 md:mx-24">
            <ToastContainer />
            <form onSubmit={handleLog}>
              <div className="input-group py-4 ">
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className="text-lg sm:text-2xl focus:outline-none focus:ring-2  w-full sm:w-72 border-2 border-black p-3 rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  className="text-lg md:text-2xl focus:outline-none focus:ring-2  w-full md:w-72 border-2 border-black p-3 rounded-full"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="error-message">{error && <p>{error}</p>}</div>
              <div className="flex justify-center items-center mt-5">
                <button type="submit" className="font-bold py-1 bg-black text-white px-4 text-lg md:text-2xl rounded-3xl " disabled={loading}>
                  {loading ? <div className="w-20">
                    <Spin />
                  </div> : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
