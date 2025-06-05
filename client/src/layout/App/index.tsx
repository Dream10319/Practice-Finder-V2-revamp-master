import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Navigate, useLocation } from "react-router-dom";
import AppHeader from "./Header";
import AppSider from "./Sider";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [show, setShow] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return !token ? (
    <Navigate to="/" replace />
  ) : (
    <div className="min-h-[100vh] bg-[#BBB] flex">
      <AppSider show={show} setShow={setShow} />
      <div
        className={`${
          show ? "ml-[180px]" : "ml-[50px]"
        } w-full max-[480px]:ml-0`}
      >
        <div className="w-full py-2 px-5 max-[480px]:px-2">
          <AppHeader setShow={setShow} show={show} />
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
