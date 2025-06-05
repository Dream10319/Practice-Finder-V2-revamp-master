import React from "react";
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({ isPassword, ...props }) => {
  const [pwdInputType, setPwdInputType] = React.useState("password");
  const [inputType, setInputType] = React.useState(props.type);

  const handlePwdInputType = () => {
    const type = pwdInputType === "password" ? "text" : "password";
    setPwdInputType(type);
    setInputType(type);
  };

  return (
    <div className="relative">
      <input
        className="w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-2 max-md:text-sm outline-none"
        {...props}
        type={inputType}
      />
      {pwdInputType === "password" && isPassword ? (
        <BsEyeFill
          className="absolute top-1/2 mt-[-9px] right-4 text-[#8F8F8F] text-lg cursor-pointer"
          onClick={handlePwdInputType}
        />
      ) : null}
      {pwdInputType === "text" && isPassword ? (
        <BsEyeSlashFill
          className="absolute top-1/2 mt-[-9px] right-4 text-[#8F8F8F] text-lg cursor-pointer"
          onClick={handlePwdInputType}
        />
      ) : null}
    </div>
  );
};

export default Input;
