import React from "react";
import { IMAGES } from "@/constants";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSnackbar } from "notistack";
import Input from "@/components/Input";
import GoogleAuth from "@/components/GoogleAuth";
import { apis } from "@/apis";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignIn, SetAuthUser } from "@/store/slices/AuthSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const submit = async (event: any) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page pt-10 max-md:pt-5 px-5"
      style={{
        backgroundImage: `url(${IMAGES.AUTH_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center min-md:hidden">
        <h1 className="text-primary text-2xl font-extrabold">
          Login to Practice Finder
        </h1>
        <div className="mt-1">
          <span className="text-sm font-semibold text-white">
            Not a Member Yet?{" "}
          </span>
          <a
            href="/signup"
            className="text-sm font-extrabold text-primary hover:opacity-90"
          >
            Sign Up
          </a>
        </div>
        <form
          className="w-full shadow-md rounded-3xl py-8 px-8 bg-white flex flex-col items-center gap-5 mt-5"
          onSubmit={submit}
        >
          <div className="flex flex-col gap-3 w-full max-w-[500px]">
            <Input type="email" placeholder="Email" required name="email" />
            <Input
              type="password"
              placeholder="Password"
              isPassword={true}
              required
              name="password"
            />
          </div>

          <button
            className="mt-5 bg-[#FF7575] py-2 px-10 w-fit text-white mx-auto rounded-full text-base font-semibold cursor-pointer"
            type="submit"
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <AiOutlineLoading3Quarters className="animate-spin" />
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
        >
          <GoogleAuth isLogin={true} isMobile={true} />
        </GoogleOAuthProvider>
      </div>

      <div className="flex justify-center max-md:hidden">
        <form
          className="max-w-[700px] w-full shadow-md rounded-2xl py-10 px-15 bg-white flex flex-col items-center gap-10"
          onSubmit={submit}
        >
          <h1 className="text-primary text-5xl font-extrabold max-md:text-2xl">
            Login to Practice Finder
          </h1>
          <div className="flex flex-col gap-3 w-full max-w-[500px]">
            <Input type="email" placeholder="Email" required name="email" />
            <Input
              type="password"
              placeholder="Password"
              isPassword={true}
              name="password"
              required
            />
          </div>
          <div className="flex items-center justify-evenly w-full">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
            >
              <GoogleAuth isLogin={true} />
            </GoogleOAuthProvider>
          </div>
          <button
            type="submit"
            className="bg-[#FF7575] py-2 px-10 w-fit text-white mx-auto rounded-full text-base font-semibold cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <AiOutlineLoading3Quarters className="animate-spin" />
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </button>
          <div>
            <span className="text-2xl">Not a Member Yet? </span>
            <a
              href="/signup"
              className="text-2xl font-extrabold text-[#8C83EF] hover:opacity-90"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
