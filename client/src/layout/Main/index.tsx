import React from "react";
import { useSelector } from "react-redux";
import MainHeader from "./Header";
import MainFooter from "./Footer";
import { RootState } from "@/store";
import { Navigate, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return token ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <div className="min-h-[100vh]">
      <MainHeader />
      {children}
      <MainFooter />
    </div>
  );
};

export default MainLayout;
