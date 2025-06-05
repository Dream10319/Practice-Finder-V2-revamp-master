import React from "react";
import { useSnackbar } from "notistack";
import Input from "@/components/Input";
import { apis } from "@/apis";
import { useDispatch, useSelector } from "react-redux";
import { SetAuthUser } from "@/store/slices/AuthSlice";
import { RootState } from "@/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [accountSaving, setAccountSaving] = React.useState(false);
  const [isFinancing, setIsFinancing] = React.useState<any>(
    authUser ? (authUser.needFinancing ? "Yes" : "No") : ""
  );

  const GetCurrentUser = async () => {
    try {
      const response: any = await apis.getCurrentUser();
      if (response.status) {
        dispatch(SetAuthUser(response.payload.user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async (event: any) => {
    try {
      event.preventDefault();
      setAccountSaving(true);
      const formData = new FormData(event.target);
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const email = formData.get("email");
      const npi = formData.get("npi");
      const phone = formData.get("phone") as string;
      const specialty = formData.get("specialty") as string;
      const needFinancing = formData.get("needFinancing") as string;

      const response: any = await apis.updateUserById(authUser?.id as string, {
        firstName: firstName === "" ? undefined : firstName,
        lastName: lastName === "" ? undefined : lastName,
        email: email === "" ? undefined : email,
        npi: npi === "" ? undefined : npi,
        phone,
        specialty,
        needFinancing: needFinancing === "Yes",
      });

      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        event.target.reset();
        GetCurrentUser();
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setAccountSaving(false);
    }
  };

  const changePassword = async (event: any) => {
    try {
      event.preventDefault();
      setPasswordSaving(true);
      const formData = new FormData(event.target);
      const oldPassword = formData.get("oldPassword");
      const newPassword = formData.get("newPassword");
      const confirmPassword = formData.get("confirmPassword");

      if (newPassword !== confirmPassword) {
        enqueueSnackbar({
          variant: "error",
          message: "Passwords don't match!",
        });
      } else {
        const response: any = await apis.changePassword({
          oldPassword: oldPassword === "" ? undefined : "",
          newPassword,
        });
        if (response.status) {
          enqueueSnackbar({
            variant: "success",
            message: response.message,
          });
          dispatch(SetAuthUser({ ...authUser, hasPassword: true }));
          event.target.reset();
        }
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="flex gap-5 max-[600px]:flex-col max-[600px]:items-center">
      <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 shadow-2xl w-[350px]">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <form className="flex flex-col mt-5 gap-3" onSubmit={updateUser}>
          <div className="flex flex-col gap-1">
            <span>First Name</span>
            <Input
              type="text"
              placeholder={authUser?.firstName}
              name="firstName"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>Last Name</span>
            <Input
              type="text"
              placeholder={authUser?.lastName}
              name="lastName"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>Email</span>
            <Input type="email" placeholder={authUser?.email} name="email" />
          </div>
          <div className="flex flex-col gap-1">
            <span>NPI#</span>
            <Input type="text" placeholder={authUser?.npi} name="npi" />
          </div>
          <div className="flex flex-col gap-1">
            <span>Phone</span>
            <Input placeholder={authUser?.phone} type="text" name="phone" />
          </div>
          <div className="flex flex-col gap-1">
            <span>Specialty</span>
            <Input
              placeholder={authUser?.specialty}
              type="text"
              name="specialty"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>Need Financing Options?</span>
            <select
              className={`w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-2 max-md:text-sm outline-none h-[42px] ${
                isFinancing === "" ? "text-[#465860]" : "text-black"
              }`}
              onChange={(event: any) => {
                setIsFinancing(event.target.value);
              }}
              value={isFinancing}
              name="needFinancing"
            >
              <option value={""} disabled>
                Need Financing Options?
              </option>
              <option value={"Yes"}>Yes</option>
              <option value={"No"}>No</option>
            </select>
          </div>
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              disabled={accountSaving}
              className="px-7 max-md:px-5 py-1 text-white bg-[#FF7575] text-xl rounded-3xl font-bold max-w-[180px] cursor-pointer hover:opacity-90 max-md:text-lg w-full disabled:bg-[#AAA] disabled:hover:opacity-100 disabled:cursor-not-allowed"
            >
              {accountSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 shadow-2xl w-[350px]">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <form className="flex flex-col mt-5 gap-3" onSubmit={changePassword}>
          {authUser && authUser.hasPassword ? (
            <div className="flex flex-col gap-1">
              <span>Old Password</span>
              <Input
                type="password"
                isPassword={true}
                placeholder="Old Password"
                name="oldPassword"
                required
              />
            </div>
          ) : (
            <h2 className="text-sm font-bold text-red-400 text-center">
              Currently, only Google login is available. Please set a new
              password to enable email/password login functionality.
            </h2>
          )}
          <div className="flex flex-col gap-1">
            <span>New Password</span>
            <Input
              type="password"
              isPassword={true}
              placeholder="New Password"
              name="newPassword"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>Confirm Password</span>
            <Input
              type="password"
              isPassword={true}
              placeholder="Confirm Password"
              name="confirmPassword"
              required
            />
          </div>
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              className="px-7 max-md:px-5 py-1 text-white bg-[#FF7575] text-xl rounded-3xl font-bold max-w-[180px] cursor-pointer hover:opacity-90 max-md:text-lg w-full disabled:bg-[#AAA] disabled:hover:opacity-100 disabled:cursor-not-allowed"
              disabled={passwordSaving}
            >
              {passwordSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
