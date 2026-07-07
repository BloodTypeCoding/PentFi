import { createContext, useContext } from "react";

const UserContext = createContext(null);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

export default UserContext;
