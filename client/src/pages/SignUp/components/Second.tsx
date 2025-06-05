import React from "react";
import { useSnackbar } from "notistack";
import { apis } from "@/apis";
import Input from "@/components/Input";
import { IMAGES } from "@/constants";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SignUpProps {
  onClick: any;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setNPI: (value: string) => void;
}

const SignUpSecond = ({
  onClick,
  setFirstName,
  setLastName,
  setNPI,
}: SignUpProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const submit = async (event: any) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.target);
      const first = formData.get("firstName") as string;
      const last = formData.get("lastName") as string;
      const npi = formData.get("npi") as string;

      const response: any = await apis.validateNPI({ npi });
      if (response.status) {
        if (response.payload.valid) {
          setFirstName(first);
          setLastName(last);
          setNPI(npi);
          onClick();
        } else {
          enqueueSnackbar({
            variant: "error",
            message: "NPI# is not valid!",
          });
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
          Keep Practice Finder Safe and Secure
        </h1>
        <h2 className="text-primary text-4xl font-bold text-center max-[768px]:text-xl">
          Verify you are a practicing dentist.
        </h2>
        <div className="flex items-center justify-evenly mt-10 max-[900px]:justify-between">
          <form
            onSubmit={submit}
            className="flex flex-col gap-5 items-center w-1/2 max-[900px]:w-3/5"
          >
            <h3 className="text-primary text-center text-2xl max-[768px]:text-lg">
              Verify below with your credentials
            </h3>
            <div className="flex flex-col gap-3 w-full">
              <Input
                type="text"
                placeholder="First Name"
                name="firstName"
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
              />
              <Input type="text" placeholder="NPI#" name="npi" required />
            </div>
            <button
              type="submit"
              className="px-7 max-md:px-5 py-1 max-md:py-0 text-white bg-[#FF7575] text-xl rounded-3xl font-bold w-[150px] mx-auto cursor-pointer hover:opacity-90 max-md:text-lg"
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
            <div>
              <span className="text-2xl font-semibold max-md:text-lg">
                Already a Member?{" "}
              </span>
              <a
                href="/signin"
                className="text-2xl font-bold text-[#8C83EF] hover:opacity-90 max-md:text-lg"
              >
                Sign In
              </a>
            </div>
          </form>
          <div>
            <img
              src={IMAGES.SECURE}
              alt="signup"
              className="w-[250px] max-[768px]:w-[180px] max-[700px]:w-[150px]"
            />
          </div>
        </div>
      </div>
      <div className="hidden max-[550px]:block">
        <div className="bg-white py-4 px-3 rounded-[15px] flex items-center justify-between">
          <div className="text-[#06202D]">
            <div className="text-xl font-extrabold">
              Keep Practice Finder Safe and Secure
            </div>
            <div className="text-sm font-semibold">
              Verify you are a practicing dentist.
            </div>
          </div>
          <div>
            <img src={IMAGES.SECURE} alt="signup" className="w-[80px]" />
          </div>
        </div>
        <form className="flex flex-col justify-center" onSubmit={submit}>
          <div className="mt-8 text-sm">
            <div className="mt-2">
              <div>First name</div>
              <Input
                type="text"
                placeholder="First Name"
                name="firstName"
                required
              />
            </div>
            <div className="mt-2">
              <div>Last Name</div>
              <Input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
              />
            </div>
            <div className="mt-2">
              <div>License #</div>
              <Input type="text" placeholder="License #" name="npi" required />
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 bg-[#FF7575] py-2 px-10 w-fit text-white mx-auto rounded-full text-base font-semibold cursor-pointer"
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

export default SignUpSecond;
