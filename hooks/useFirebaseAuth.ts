import { useState, useEffect, useContext } from "react";
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  User,
} from "firebase/auth";
import { AuthContext } from "../contexts/authContext";

export default function useFirebaseAuth() {
  const { auth, user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    let unsub = () => {};
    if (auth) {
      unsub = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setEmailVerified(user?.emailVerified || false);
        setLoading(false);
      });
    }

    return unsub();
  }, [auth, setUser]);

  const clear = () => {
    setUser(null);
    // setLoading(true);
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then((res) => {
        setUser(res?.user);
      });
    } catch (error: any) {
      setUser(null);
      setAuthError(error?.message);
    }
  };

  const createUser = async (auth: Auth, email: string, password: string) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password); // @TODO how does user know to update on this one without calling setUser??
    setUser(res?.user);
    setLoading(false);
    return res;
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      clear();
      setLoading(false);
    } catch (error: any) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const verifyEmail = async (oobCode: string): Promise<User> => {
    setLoading(true);
    try {
      await applyActionCode(auth, oobCode);
      await auth.currentUser.reload(); // @TODO no longer necessary?
      setUser(auth.currentUser);
      setLoading(false);
      // @TODO setEmailVerified ??
    } catch (error: any) {
      setAuthError(error.message);
      setLoading(false);
    } finally {
      return auth.currentUser;
    }
  };

  return {
    auth,
    user,
    // loading,
    login,
    createUser,
    signOut,
    authError,
    emailVerified,
    verifyEmail,
    setAuthError,
    verifyPasswordResetCode,
    confirmPasswordReset,
    loading,
  };
}
