import { useState, useEffect, ReactNode } from "react";
import { auth } from "../FirebaseConnection";
import { onAuthStateChanged, User } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

export default function Private({ children }: PrivateProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const unsub = onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
          };

          localStorage.setItem("@detailUser", JSON.stringify(userData));

          setLoading(false);
          setSigned(true);
        } else {
          // don't have user logged
          setLoading(false);
          setSigned(false);
        }
      });

      return () => unsub();
    }

    checkLogin();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!signed) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}