import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apis } from "@/apis";
import { FcGoogle } from "react-icons/fc";
import { IMAGES } from "@/constants";
import { SignIn, SetAuthUser } from "@/store/slices/AuthSlice";

interface GoogleAuthProps {
  isLogin?: boolean;
  isMobile?: boolean;
  setEmail?: (value: string) => void;
  setUID?: (value: string) => void;
  onClick?: any;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({
  isLogin,
  isMobile,
  setEmail,
  setUID,
  onClick,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse: any) => {
      try {
        const response: any = await apis.googleAuth({
          token: tokenResponse.access_token,
          isLogin,
        });
        if (response.status) {
          if (!isLogin && setEmail && setUID) {
            const { userInfo } = response.payload;
            setEmail(userInfo.email);
            setUID(userInfo.uid);
            onClick();
          } else {
            enqueueSnackbar({
              variant: "success",
              message: response.message,
            });
            navigate("/dashboard");
            dispatch(SignIn(response.payload.token));
            dispatch(SetAuthUser(response.payload.user));
          }
        }
      } catch (err: any) {
        enqueueSnackbar({
          variant: "error",
          message: err?.response?.data?.message || "Something went wrong!!!",
        });
      }
    },
    onError: (errorResponse: any) => console.warn(errorResponse),
  });

  return isMobile ? (
    <div
      className="bg-white flex items-center gap-3 m-auto px-5 py-2 rounded-[4px] w-fit mt-8 cursor-pointer"
      onClick={() => login()}
    >
      <FcGoogle size={24} />
      <div className="text-sm">Continue with Google</div>
    </div>
  ) : (
    <button
      type="button"
      className="bg-white shadow-md flex items-center gap-5 px-4 py-2 cursor-pointer hover:opacity-80 rounded-sm"
      onClick={() => login()}
    >
      <img src={IMAGES.GOOGLE} alt="Google" className="w-[20px]" />
      <span className="text-[#5D686E] text-base max-[768px]:text-sm">
        Continue With Google
      </span>
    </button>
  );
};

export default GoogleAuth;
