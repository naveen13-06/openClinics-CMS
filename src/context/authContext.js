import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"
export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login =  async(inputs) => {
    const t=await api.createSession(inputs);
    const res = await api.getAccount();
    console.log(res);
    setCurrentUser({name: res.name, email: res.email});
  };

  const logout = async (inputs) => {
    await api.deleteCurrentSession();
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
