import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { HEADER_MENU_ITEMS } from "@/constants";
import { IMenuItem } from "@/types";

const HeaderMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = React.useState<string>("home");
  const [open, setOpen] = React.useState<boolean>(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (location) {
      setActiveKey(location.pathname.slice(1));
    }
  }, [location]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  const handleNavClick = (key: string) => {
    setActiveKey(key);
    navigate("/" + key);
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-primary h-9 border-none rounded-3xl min-xl:gap-3 gap-1 max-[920px]:hidden">
        {HEADER_MENU_ITEMS.map((item: IMenuItem) => (
          <span
            key={item.key}
            className={`flex items-center rounded-3xl font-bold px-4 h-[100%] cursor-pointer min-xl:text-xl text-md hover:text-primary hover:bg-[#CCCCCC] transition-colors duration-500 ease-in-out ${
              activeKey === item.key
                ? "text-primary bg-[#D9D9D9]"
                : "text-white bg-primary"
            }`}
            onClick={() => handleNavClick(item.key)}
          >
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex items-center min-[920px]:hidden gap-3">
        <a
          className="text-primary bg-[#D9D9D9] rounded-2xl font-bold text-md px-4 py-0.5 hover:opacity-80 cursor-pointer"
          href="/signin"
        >
          Sign In
        </a>
        <div className="replative" ref={menuRef}>
          <FaBars
            className="hover:text-[#AAA] cursor-pointer"
            onClick={() => {
              setOpen(!open);
            }}
          />
          <div
            className={`${
              open ? "visible opacity-100" : ""
            } z-10 absolute bg-[#D9D9D9] invisible opacity-0 p-4 w-full left-0 mt-4 flex justify-end transition-all duration-200 ease-in-out`}
          >
            <ul className="font-bold text-xl text-right">
              <li className="text-primary hover:text-[#06202DA6] cursor-pointer">
                <a href="/">Home</a>
              </li>
              <li className="text-primary hover:text-[#06202DA6] cursor-pointer">
                <a href="/practices-for-sale">Practices for Sale</a>
              </li>
              <li className="text-primary hover:text-[#06202DA6] cursor-pointer">
                <a href="/how-to-buy">How to Buy a Practice</a>
              </li>
              <li className="text-primary hover:text-[#06202DA6] cursor-pointer">
                <a href="/signin">Sign In</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
