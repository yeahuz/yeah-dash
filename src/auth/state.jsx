import { createContext } from "preact";
import { useState } from "preact/hooks";
import { getMe } from "../api/auth.js";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const isLoggedIn = !!user;
  const { isLoading } = useQuery({ queryKey: ["user"], queryFn: getMe, onSuccess: (user) =>  setUser(user), retry: false });

  if (isLoading) return <p>Loading...</p>;

  return <AuthContext.Provider value={{ user, isLoggedIn, isLoading, setUser }}>{children}</AuthContext.Provider>
}
