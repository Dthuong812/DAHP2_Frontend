import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext); 
  if (!user.auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
