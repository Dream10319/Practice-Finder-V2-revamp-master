import { useNavigate } from "react-router-dom";
import { IMAGES } from "@/constants";
import { FaRegUser } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AppHeadeProps {
  show: boolean;
  setShow: (value: boolean) => void;
}

const AppHeader: React.FC<AppHeadeProps> = ({ show, setShow }) => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-4 max-[480px]:p-3 flex justify-between items-center">
      <div className="hidden max-[480px]:block">
        <LuMenu
          className="text-xl hover:opacity-80 cursor-pointer"
          onClick={() => {
            setShow(!show);
          }}
        />
      </div>
      <a href="/dashboard">
        <img
          src={IMAGES.LOGO_BIG}
          alt="logo"
          className="h-[50px] max-[480px]:h-[35px]"
        />
      </a>
      <div className="flex items-center gap-2">
        <span className="max-[480px]:hidden">
          {authUser?.firstName} {authUser?.lastName}
        </span>
        <div
          className="shadow-2xl w-[40px] h-[40px] max-[480px]:w-[30px] max-[480px]:h-[30px] border border-[#5D686E] rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <FaRegUser className="text-2xl max-[480px]:text-xl" />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
