import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { LuUsersRound } from "react-icons/lu";
import { SignOut } from "@/store/slices/AuthSlice";
import { RootState } from "@/store";
import { IMAGES } from "@/constants";

interface AppSiderProps {
  show: boolean;
  setShow: (value: boolean) => void;
}

const AppSider: React.FC<AppSiderProps> = ({ show, setShow }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper for close-on-mobile navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    // close the top bar on mobile after navigation
    setShow(false);
  };

  return (
    <div
      /* Desktop: left vertical sidebar (h-screen)
         Mobile (max-[480px]): fixed at top full width, slides down/up */
      className={`border border-[#B5B5B5] bg-white shadow-2xl transition-all duration-300 ease-in-out fixed py-7 transform
        /* desktop sizes */
        h-screen ${show ? "w-[180px] ml-0" : "w-[50px]"}
        /* MOBILE: become a top bar, full width, height auto, slide from top */
        max-[480px]:z-50 max-[480px]:left-0 max-[480px]:right-0 max-[480px]:top-0 max-[480px]:w-full max-[480px]:h-auto max-[480px]:py-2
        max-[480px]:transition-transform max-[480px]:duration-300
        ${show ? "max-[480px]:translate-y-0" : "max-[480px]:-translate-y-full"}
      `}
    >
      <div
        className="py-3 px-2 flex items-center gap-2 group cursor-pointer"
        onClick={() => {
          // toggle show
          setShow(!show);
        }}
      >
        <img
          src={IMAGES.MENU}
          alt="Menu"
          className="w-8 h-8 group-hover:opacity-50 max-[480px]:w-6 max-[480px]:h-6"
        />
        {show ? (
          <span className="text-xl group-hover:text-[#B5B5B5] max-[480px]:text-base">Menu</span>
        ) : null}
      </div>

      {/* divider - hide on mobile because the top bar will visually separate itself */}
      <div className="border border-[#B5B5B5] max-[480px]:hidden"></div>

      {/* Items:
          Desktop: vertical column
          Mobile: horizontal row with space-between */}
      <ul className="px-2 py-3 flex flex-col gap-3 max-[480px]:flex-row max-[480px]:items-center max-[480px]:justify-between max-[480px]:gap-2 max-[480px]:px-4">
        {authUser && authUser.role === "ADMIN" ? (
          <li
            className="flex gap-2 items-center group cursor-pointer"
            onClick={() => {
              handleNavigate("/users");
            }}
          >
            <LuUsersRound className="text-3xl group-hover:text-[#B5B5B5] max-[480px]:text-xl" />
            {show ? (
              <span className="text-xl group-hover:text-[#B5B5B5] max-[480px]:text-sm">Users</span>
            ) : null}
          </li>
        ) : null}

        <li
          className="flex gap-2 items-center group cursor-pointer"
          onClick={() => {
            handleNavigate("/dashboard");
          }}
        >
          <img
            src={IMAGES.DASHBOARD}
            alt="Dashboard"
            className="w-8 h-8 group-hover:opacity-50 max-[480px]:w-6 max-[480px]:h-6"
          />
          {show ? (
            <span className="text-xl group-hover:text-[#B5B5B5] max-[480px]:text-sm">Dashboard</span>
          ) : null}
        </li>

        <li
          className="flex gap-2 items-center group cursor-pointer"
          onClick={() => {
            handleNavigate("/listings");
          }}
        >
          <img
            src={IMAGES.LISTINGS}
            alt="Listings"
            className="w-8 h-8 group-hover:opacity-50 max-[480px]:w-6 max-[480px]:h-6"
          />
          {show ? (
            <span className="text-xl group-hover:text-[#B5B5B5] max-[480px]:text-sm">Listings</span>
          ) : null}
        </li>

        <li
          className="flex gap-2 items-center group cursor-pointer"
          onClick={() => {
            dispatch(SignOut());
            enqueueSnackbar({
              variant: "success",
              message: "Log out successfully.",
            });
            // send to root and close mobile bar
            navigate("/");
            setShow(false);
          }}
        >
          <img
            src={IMAGES.LOGOUT}
            alt="Log out"
            className="w-8 h-8 group-hover:opacity-50 max-[480px]:w-6 max-[480px]:h-6"
          />
          {show ? (
            <span className="text-xl group-hover:text-[#B5B5B5] max-[480px]:text-sm">Log out</span>
          ) : null}
        </li>
      </ul>
    </div>
  );
};

export default AppSider;
