import React from "react";
import { useSnackbar } from "notistack";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Input from "@/components/Input";
import GoogleAuth from "@/components/GoogleAuth";
import { IMAGES } from "@/constants";
import { apis } from "@/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SignUpProps {
  onClick: any;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setUID: (value: string) => void;
}

const SignUpFirst = ({
  onClick,
  setPassword,
  setEmail,
  setUID,
}: SignUpProps) => {
  const [roundedPracticeCount, setRoundedPracticeCount] = React.useState<number | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const pdata: any = await apis.getTotalPracticeCount();
        if (!cancelled && pdata?.status && typeof pdata?.payload?.totalCount === "number") {
          setRoundedPracticeCount(Math.floor(pdata.payload.totalCount / 100) * 100);
        }
      } finally {
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (event: any) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword");

      const response: any = await apis.checkEmail({ email: email });
      if (response.status) {
        if (response.payload.taken) {
          enqueueSnackbar({
            variant: "error",
            message: "Email is already taken!",
          });
        } else {
          if (confirmPassword !== password) {
            enqueueSnackbar({
              variant: "error",
              message: "Passwords don't match!",
            });
          } else {
            setEmail(email);
            setPassword(password);
            onClick();
          }
        }
      }
    } catch (err: any) {
      setLoading(false);
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    }
  };

  return (
    <>
      <div className="max-w-[1150px] w-full shadow-md rounded-2xl py-10 px-15 mx-auto bg-white max-[900px]:px-8 max-[550px]:hidden">
        <h1 className="text-primary text-5xl font-bold text-center max-[768px]:text-3xl">
          Thousands of Dental Practices For Sale
        </h1>
        <h2 className="text-primary text-4xl text-center max-[768px]:text-xl">
          Over {roundedPracticeCount}+ listings available.
        </h2>
        <div className="flex items-center justify-evenly mt-10 max-[900px]:justify-between">
          <form
            className="flex flex-col gap-5 items-center w-1/2 max-[900px]:w-3/5"
            onSubmit={submit}
          >
            <h3 className="text-primary text-center text-2xl max-[768px]:text-lg font-bold">
              FREE Sign Up via email or Google!
            </h3>
            <div className="flex flex-col gap-3 w-full">
              <Input type="email" placeholder="Email" name="email" required />
              <Input
                type="password"
                placeholder="Password"
                isPassword={true}
                name="password"
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                isPassword={true}
                name="confirmPassword"
                required
              />
            </div>
            <div className="flex items-center justify-evenly w-full gap-3">
              <span className="text-gray-600">Sign up via Google</span>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
              >
                <GoogleAuth
                  setEmail={setEmail}
                  setUID={setUID}
                  onClick={onClick}
                />
              </GoogleOAuthProvider>
            </div>

            <button
              type="submit"
              className="px-7 py-3 text-white bg-[#FF7575] text-xl rounded-3xl font-bold w-[90%] cursor-pointer hover:opacity-90 max-md:text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Checking...
                </div>
              ) : (
                "Next"
              )}
            </button>
            <div className="gap-2 flex items-center">
              <span className="text-2xl max-md:text-lg">
                Already a Member?{" "}
              </span>
              <a
                href="/signin"
                className="text-2xl font-bold underline text-[#8C83EF] hover:opacity-90 max-md:text-lg"
              >
                Login
              </a>
              <span className="text-2xl font-bold max-md:text-lg">→</span>
            </div>
          </form>
          <div>
            <img
              src={IMAGES.CHECK}
              alt="signup"
              className="max-[768px]:w-[180px] max-[700px]:w-[150px]"
            />
          </div>
        </div>
      </div>
      <div className="hidden max-[550px]:block">
        <div className="bg-white py-4 px-3 rounded-[15px] flex items-center justify-between">
          <div className="text-[#06202D]">
            <div className="text-xl font-extrabold">
              Thousands of Dental Practices For Sale
            </div>
            <div className="text-sm font-semibold">
              Multiple Practice listings all in one place.
            </div>
          </div>
          <div>
            <img src={IMAGES.CHECK} alt="signup" className="w-[80px]" />
          </div>
        </div>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
        >
          <GoogleAuth
            isMobile={true}
            setEmail={setEmail}
            setUID={setUID}
            onClick={onClick}
          />
        </GoogleOAuthProvider>
        <form onSubmit={submit} className="flex flex-col justify-center mt-4">
          <div className="text-sm">
            <div className="mt-2">
              <div>Email</div>
              <Input type="email" placeholder="Email" name="email" required />
            </div>
            <div className="mt-2">
              <div>Password</div>
              <Input
                type="password"
                placeholder="Password"
                isPassword={true}
                name="password"
                required
              />
            </div>
            <div className="mt-2">
              <div>Confirm Password</div>
              <Input
                type="password"
                placeholder="Confirm Password"
                isPassword={true}
                name="confirmPassword"
                required
              />
            </div>
          </div>
          <button
            className="mt-8 bg-[#FF7575] py-2 px-10 w-[100%] text-white mx-auto rounded-full text-base font-semibold cursor-pointer"
            type="submit"
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <AiOutlineLoading3Quarters className="animate-spin" />
                Checking...
              </div>
            ) : (
              "Next"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUpFirst;
