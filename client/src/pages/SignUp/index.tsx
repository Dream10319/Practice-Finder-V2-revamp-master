import React from "react";
import { IMAGES } from "@/constants";
import SignUpFirst from "./components/First";
import SignUpSecond from "./components/Second";
import SignUpThird from "./components/Third";
import SignUpFourth from "./components/Fourth";

const SignUpPage = () => {
  const [stage, setStage] = React.useState("first");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [npi, setNPI] = React.useState("");
  const [uid, setUID] = React.useState("");

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
      {stage === "first" && (
        <SignUpFirst
          onClick={() => setStage("second")}
          setEmail={setEmail}
          setPassword={setPassword}
          setUID={setUID}
        />
      )}
      {stage === "second" && (
        <SignUpSecond
          onClick={() => setStage("third")}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setNPI={setNPI}
        />
      )}
      {stage === "third" && (
        <SignUpThird
          onClick={() => {
            setEmail("");
            setPassword("");
            setUID("");
            setStage("fourth");
          }}
          firstName={firstName}
          lastName={lastName}
          uid={uid}
          npi={npi}
          email={email}
          password={password}
        />
      )}
      {stage === "fourth" && <SignUpFourth onClick={() => setStage("first")} />}
    </div>
  );
};

export default SignUpPage;
