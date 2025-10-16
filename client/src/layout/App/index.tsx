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
  const [show, setShow] = React.useState(true);
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Close the sider automatically on route change for mobile sizes
  React.useEffect(() => {
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      setShow(false);
    }
    // We only want to run this when location changes, so location is in deps
  }, [location]);

  // Handler invoked when user touches/clicks the main content area.
  // If on small screen and sider is open, close it.
  const handleContentPointerDown = React.useCallback(() => {
    const isMobile = window.innerWidth <= 480; // match your CSS breakpoint max-[480px]
    if (isMobile && show) {
      setShow(false);
    }
  }, [show]);

  return !token ? (
    <Navigate to="/" replace />
  ) : (
    <div className="min-h-[100vh] bg-[#BBB] flex">
      <div className="py-2">
        <AppSider show={show} setShow={setShow} />
      </div>

      <div
        className={`${show ? "ml-[180px]" : "ml-[50px]"} w-full max-[480px]:ml-0`}
        // listen for pointer/touch on the main content wrapper
        onPointerDown={handleContentPointerDown}
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
