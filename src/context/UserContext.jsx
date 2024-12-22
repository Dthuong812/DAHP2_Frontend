import React from "react";
// @function  UserContext
const UserContext = React.createContext({ email: '', auth: false });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({ email: '', auth: false });

  const loginContext = (email,token) => {
    localStorage.setItem("token", token);
    setUser((user) => ({
      email: email,
      auth: true,
    }));
  };

  const logout = () => {
    localStorage.removeItem("token")
    setUser((user) => ({
      email: '',
      auth: false,
    }));
  };
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ email: user.email, auth: true });  
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext , UserProvider};