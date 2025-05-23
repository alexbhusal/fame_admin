"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { auth, firestore } from '../../utils/firebase';
import { GrUserAdmin } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";


const navItems = [
  { href: '/dashboard', label: <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IoHome /> Home</span> },
  { href: '/dashboard/members', label: <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GrUserAdmin /> Members</span> },
  { href: '/dashboard/students', label: <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><PiStudent /> Students</span> },
];

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("Loading...");
  const [userImageurl, setUserImageurl] = useState("https://via.placeholder.com/150");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(firestore, 'admin', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          console.log( currentUser.uid);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserName(userData.fullName || "No name provided");
            setUserImageurl(userData.imgurl || "https://via.placeholder.com/150");
            setUserEmail(userData.email || "No email provided");
          } else {
            console.log("No such user document!");
            // Fallback to auth user data if document doesn't exist
            setUserName(currentUser.fullName || "No name provided");
            setUserEmail(currentUser.email || "No email provided");
            setUserImageurl(currentUser.imgurl || "https://via.placeholder.com/150");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error loading user data");
          // Fallback to auth user data on error
          setUserName(currentUser.displayName || "No name provided");
          setUserEmail(currentUser.email || "No email provided");
          setUserImageurl(currentUser.photoURL || "https://via.placeholder.com/150");
        }
      } else {
        // No user is signed in
        setUser(null);
        setUserName(null);
        setUserEmail(null);
        setUserImageurl("https://via.placeholder.com/150");
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast.warning("You are logged out");
      Cookies.remove("token");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (e) {
      console.log("Logout Error:", e);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full md:flex-row min-h-screen">
      <aside className="w-full md:w-40 p-2 md:border-r-4 border-black m-0 md:m-10">
        <ul className="flex flex-row md:flex-col space-y-0 md:space-y-2 mt-5 md:mt-10">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="text-xs md:text-2xl font-semibold">
                <span className="block p-2 hover:text-red-500 rounded cursor-pointer">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="absolute  md:bottom-10 text-center">
          <img
            src={userImageurl}
            alt="Profile"
            className="w-auto h-12 md:h-32 rounded-full mx-auto"
          />
          <h1 className="mt-2 font-bold text-sm md:text-lg">{userName}</h1>
          <h1 className="text-xs text-gray-500">{userEmail}</h1>
            <button
              onClick={handleLogOut}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
        </div>
      </aside>
      <section className="flex-1 p-4 md:p-8">{children}</section>
    </div>
  );
};

export default DashboardLayout;