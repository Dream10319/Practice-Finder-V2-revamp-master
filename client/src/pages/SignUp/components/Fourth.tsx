import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import GoogleAuth from "@/components/GoogleAuth";
import { IMAGES } from "@/constants";
import { apis } from "@/apis";
import { SetAuthUser, SignIn } from "@/store/slices/AuthSlice";

interface SignUpProps {
  onClick: any;
}

const SignUpFourth = ({ onClick }: SignUpProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event: any) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const password = formData.get("password");
      const response: any = await apis.signIn({ email, password });
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        navigate("/dashboard");
        dispatch(SignIn(response.payload.token));
        dispatch(SetAuthUser(response.payload.user));
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    }
  };

  return (
    <>
      <div className="max-w-[1150px] w-full shadow-md rounded-2xl py-10 px-15 mx-auto bg-white max-[900px]:px-8 max-[550px]:hidden">
        <h1 className="text-[#18D18E] text-5xl font-bold text-center max-[768px]:text-3xl">
          Contratulations!
        </h1>
        <h2 className="text-primary text-3xl font-bold text-center max-[768px]:text-xl">
          Sending You a Welcome Email Now!
        </h2>
        <div className="flex items-center justify-evenly mt-10 max-[900px]:justify-between">
          <form
            className="flex flex-col gap-5 items-center w-1/2 max-[900px]:w-3/5"
            onSubmit={submit}
          >
            <div className="flex flex-col gap-3 w-full">
              <Input type="email" placeholder="Email" required name="email" />
              <Input
                type="password"
                placeholder="Password"
                required
                name="password"
                isPassword={true}
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3 text-white bg-[#FF7575] text-xl rounded-3xl font-bold w-[90%] cursor-pointer hover:opacity-90 max-md:text-lg"
            >
              Login
            </button>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
            >
              <GoogleAuth onClick={onClick} isLogin={true} />
            </GoogleOAuthProvider>
          </form>
          <div>
            <img
              src={IMAGES.BADGE}
              alt="signup"
              className="w-[250px] max-[768px]:w-[180px] max-[700px]:w-[150px]"
            />
          </div>
        </div>
      </div>
      <div className="hidden max-[550px]:block">
        <div className="bg-white py-4 px-3 rounded-[15px] flex items-center justify-between">
          <div className="text-[#06202D]">
            <div className="text-xl font-extrabold text-[#18D18E]">
              Contratulations!
            </div>
            <div className="text-sm font-semibold">
              Sending You a Welcome Email Now!
            </div>
          </div>
          <div>
            <img src={IMAGES.BADGE} alt="signup" className="w-[80px]" />
          </div>
        </div>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
        >
          <GoogleAuth onClick={onClick} isMobile={true} isLogin={true} />
        </GoogleOAuthProvider>
        <form onSubmit={submit} className="flex flex-col justify-center">
          <div className="mt-4 text-sm">
            <div className="mt-2">
              <div>Email</div>
              <Input type="email" placeholder="Email" required />
            </div>
            <div className="mt-2">
              <div>Password</div>
              <Input type="password" placeholder="Password" isPassword={true} />
            </div>
          </div>
          <button
            className="mt-8 bg-[#FF7575] py-2 px-10 text-white mx-auto rounded-full text-base font-semibold w-[100%]"
            type="submit"
          >
            Log In
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUpFourth;
