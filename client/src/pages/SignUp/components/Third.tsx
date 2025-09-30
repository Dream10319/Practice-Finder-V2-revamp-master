import React from "react";
import { useSnackbar } from "notistack";
import { IMAGES } from "@/constants";
import { apis } from "@/apis";
import Input from "@/components/Input";

interface SignUpProps {
  onClick: any;
  firstName: string;
  lastName: string;
  npi: string;
  email: string;
  uid: string;
  password: string;
}

const SignUpThird: React.FC<SignUpProps> = ({
  onClick,
  firstName,
  lastName,
  npi,
  email,
  uid,
  password,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isFinancing, setIsFinancing] = React.useState<any>("");

  const submit = async (event: any) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const phone = formData.get("phone") as string;
      const specialty = formData.get("specialty") as string;
      const needFinancing = formData.get("needFinancing") as string;

      const response: any = await apis.signUp({
        password,
        npi,
        email,
        firstName,
        lastName,
        uid: uid === "" ? null : uid,
        phone,
        specialty,
        needFinancing: needFinancing === "Yes",
      });

      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        onClick();
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
        <h1 className="text-primary text-5xl font-bold text-center max-[768px]:text-3xl">
          Save All Your Search Queries
        </h1>
        <h2 className="text-primary text-4xl font-bold text-center max-[768px]:text-xl">
          In One Convenient Dashboard!
        </h2>
        <div className="flex items-center justify-evenly mt-10 max-[900px]:justify-between">
          <form
            className="flex flex-col gap-5 items-center w-1/2 max-[900px]:w-3/5"
            onSubmit={submit}
          >
            <div className="max-w-[400px] flex w-full flex-col gap-2">
              <Input placeholder="Phone" type="text" required name="phone" />
              <Input
                placeholder="Specialty"
                type="text"
                required
                name="specialty"
              />
              <select
                className={`w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-2 max-md:text-sm outline-none h-[42px] ${
                  isFinancing === "" ? "text-[#465860]" : "text-black"
                }`}
                onChange={(event: any) => {
                  setIsFinancing(event.target.value);
                }}
                value={isFinancing}
                required
                name="needFinancing"
              >
                <option value={""} disabled>
                  Need Financing Options?
                </option>
                <option value={"Yes"}>Yes</option>
                <option value={"No"}>No</option>
              </select>
            </div>
            <div className="text-[#878787]">
              I opt in to all Practice Finder’s communications, and agree to the{" "}
              <span className="underline">terms and conditions.</span> I also
              agree NOT to share my login and account info with anyone else. If
              I do share my account I WILL BE removed from Practice Finder
              without notice.
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-[16px] h-[16px]" required />
              <div className="text-[#878787]">YES, I AGREE TO THE TERMS</div>
            </div>
            <button
              type="submit"
              className="px-7 py-3 text-white bg-[#FF7575] text-xl rounded-3xl font-bold w-[90%] cursor-pointer hover:opacity-90 max-md:text-lg"
            >
             Done
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
              src={IMAGES.QUERY}
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
              Save All Your Search Queries
            </div>
            <div className="text-sm font-semibold">
              In One Convenient Dashboard!
            </div>
          </div>
          <div>
            <img src={IMAGES.QUERY} alt="signup" className="w-[80px]" />
          </div>
        </div>
        <div className="px-5">
          <div className="text-[#06202D] mt-8 text-center bg-white rounded-2xl p-3">
            I opt in to all Practice Finder’s communications, and agree to the{" "}
            <span className="underline">terms and conditions.</span> I also
            agree NOT to share my login and account info with anyone else. If I
            do share my account I WILL BE removed from Practice Finder without
            notice.
          </div>
          <form onSubmit={submit} className="flex flex-col justify-center mt-3">
            <div className="max-w-[400px] flex w-full flex-col gap-2">
              <Input placeholder="Phone" type="text" required name="phone" />
              <Input
                placeholder="Specialty"
                type="text"
                required
                name="specialty"
              />
              <select
                className={`w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-2 max-md:text-sm outline-none h-[38px] ${
                  isFinancing === "" ? "text-[#465860]" : "text-black"
                }`}
                onChange={(event: any) => {
                  setIsFinancing(event.target.value);
                }}
                value={isFinancing}
                required
                name="needFinancing"
              >
                <option value={""} disabled>
                  Need Financing Options?
                </option>
                <option value={"Yes"}>Yes</option>
                <option value={"No"}>No</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-2 justify-center">
              <input type="checkbox" className="w-[16px] h-[16px]" required />
              <div className="text-[#06202D]">YES, I AGREE TO THE TERMS</div>
            </div>
            <button
              className="mt-8 bg-[#FF7575] py-2 px-10 text-white mx-auto rounded-full text-base font-semibold w-[100%]"
              type="submit"
            >
              Done
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpThird;
