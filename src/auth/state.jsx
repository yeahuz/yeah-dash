import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getMe } from "../api/auth.js";
import { useApi } from "../core/useApi.js";
import { option } from "../utils/option.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const isLoggedIn = !!user;
  const { isLoading, run } = useApi(true);

  const fetchUser = async () => {
    const [result, err] = await option(run(getMe()));
    if (!err) {
      setUser(result);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])

  if (isLoading) return <p>Loading...</p>;

  return <AuthContext.Provider value={{ user, isLoggedIn, isLoading, setUser }}>{children}</AuthContext.Provider>
}
