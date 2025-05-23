"use client";
import { useEffect, useState } from 'react';
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';

const Home = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
      setUser(user);
      if (user) {
        router.push('/dashboard'); // Redirect to dashboard if logged in
      } else {
        router.push('/login'); // Redirect to login if not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

};

function MyApp({ Components, pageProps }) {
  const user = useAuth();

  if (!user) {
    return null; // Prevent rendering the page until user is authenticated
  }

  return <Components {...pageProps} />;
}

export default Home;