import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMenu } from "react-icons/io";
import { useSnackbar } from "notistack";
import { RxDashboard } from "react-icons/rx";
import { IoList } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { SignOut } from "@/store/slices/AuthSlice";
import { RootState } from "@/store";

interface AppSiderProps {
  show: boolean;
  setShow: (value: boolean) => void;
}

const AppSider: React.FC<AppSiderProps> = ({ show, setShow }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      className={`h-screen border border-[#B5B5B5] bg-white shadow-2xl transition-all duration-300 ease-in-out fixed max-[480px]:z-20 py-7 ${
        show ? "w-[180px] ml-0" : "w-[50px] max-[480px]:w-[180px] max-[480px]:ml-[-180px]"
      }`}
    >
      <div
        className="py-3 px-2 flex items-center gap-2 group cursor-pointer"
        onClick={() => {
          setShow(!show);
        }}
      >
        <IoMdMenu className="text-3xl group-hover:text-[#B5B5B5]" />
        {show ? (
          <span className="text-xl group-hover:text-[#B5B5B5]">Menu</span>
        ) : null}
      </div>
      <div className="border border-[#B5B5B5]"></div>
      <ul className="px-2 py-3 flex flex-col gap-3">
        {authUser && authUser.role === "ADMIN" ? (
          <li
            className="flex gap-2 items-center group cursor-pointer"
            onClick={() => {
              navigate("/users");
              setShow(false);
            }}
          >
            <LuUsersRound className="text-3xl group-hover:text-[#B5B5B5]" />
            {show ? (
              <span className="text-xl group-hover:text-[#B5B5B5]">Users</span>
            ) : null}
          </li>
        ) : null}
        <li
          className="flex gap-2 items-center group cursor-pointer"
          onClick={() => {
            navigate("/dashboard");
            setShow(false);
          }}
        >
          <RxDashboard className="text-3xl group-hover:text-[#B5B5B5]" />
          {show ? (
            <span className="text-xl group-hover:text-[#B5B5B5]">
              Dashboard
            </span>
          ) : null}
        </li>
        <li
          className="flex gap-2 items-center group cursor-pointer"
          onClick={() => {
            navigate("/listings");
            setShow(false);
          }}
        >
          <IoList className="text-3xl group-hover:text-[#B5B5B5]" />
          {show ? (
            <span className="text-xl group-hover:text-[#B5B5B5]">Listings</span>
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
            navigate("/");
          }}
        >
          <FiLogOut className="text-3xl group-hover:text-[#B5B5B5]" />
          {show ? (
            <span className="text-xl group-hover:text-[#B5B5B5]">Log out</span>
          ) : null}
        </li>
      </ul>
    </div>
  );
};

export default AppSider;
