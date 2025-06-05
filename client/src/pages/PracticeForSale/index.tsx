import React from "react";
import { IMAGES } from "@/constants";
import { apis } from "@/apis";
import { useNavigate } from "react-router-dom";
import USMap from "@/components/Map";

const PracticeForSalePage = () => {
  const navigate = useNavigate();
  const [statesCount, setStatesCount] = React.useState<Array<any>>([]);

  const GetStatesCount = async () => {
    try {
      const response: any = await apis.getStatesListingsCount();
      if (response.status) {
        setStatesCount(response.payload.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    GetStatesCount();
  }, []);

  return (
    <div>
      <div
        className="py-15 max-md:py-8 px-5 max-[768px]:px-2"
        style={{
          backgroundImage: `url(${IMAGES.AUTH_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-white max-w-[1100px] w-full mx-auto shadow-2xl rounded-2xl p-10 max-[768px]:py-5 max-[768px]:px-2">
          <h1 className="text-primary text-5xl font-extrabold text-center max-[768px]:text-xl">
            Thousands of Dental Practices For Sale
          </h1>
          <h2 className="text-primary text-4xl font-extrabold text-center max-[768px]:text-lg">
            All in one convenient Dashboard.
          </h2>
          <div className="grid grid-cols-2 mt-10 px-10 max-[968px]:grid-cols-1 max-[768px]:mt-5 max-[768px]:px-5">
            <div className="flex flex-col gap-10 mx-auto max-[768px]:gap-5">
              <ul className="text-xl font-semibold flex flex-col gap-3 list-disc max-[768px]:text-sm max-[768px]:gap-1">
                <li>Create Your Own Customized Searches</li>
                <li>Over +3,000 Practices For Sale Nationwide</li>
                <li>Store Your Favorite Listings in One Place</li>
                <li>Quickly Find Key Aspects of Every Practice</li>
              </ul>
              <a
                className="bg-[#FF7575] py-2 px-10 w-fit text-white mx-auto rounded-full text-base font-semibold cursor-pointer hover:opacity-80"
                href="/signup"
              >
                Get Started Now
              </a>
              <div className="flex justify-center gap-2">
                <span className="text-xl font-semibold max-md:text-lg">
                  Already a Member?{" "}
                </span>
                <a
                  href="/signin"
                  className="text-xl font-bold hover:opacity-90 max-md:text-lg hover:underline"
                >
                  Sign In
                </a>
              </div>
            </div>
            <img
              src={IMAGES.LOCATION1}
              alt="Map"
              className="h-full max-h-[320px] mx-auto max-[968px]:hidden"
            />
          </div>
        </div>
      </div>
      {statesCount.length > 0 ? (
        <div className="bg-white py-10">
          <h1 className="text-5xl font-extrabold text-center text-primary max-[480px]:text-3xl">
            Search by State
          </h1>
          <p className="text-xl max-w-[1000px] px-5 py-5 mx-auto text-primary max-[480px]:text-sm">
            Practice Finder is working to expand the number of brokerages
            covered in each state. Currently only 5 States are fully represented
            with major brokerages including Washington, Oregon, California,
            Arizona, and Colorado. There are still listings in the rest of the
            50 states just not fully represented by every independent brokerage
            firm.{" "}
          </p>
          <div className="max-w-[1200px] mx-auto">
            <div className="w-[90%]">
              <USMap represented={true} listings={statesCount} />
            </div>
            <div className="flex justify-end gap-2 max-[480px]:justify-center mt-2">
              <div className="mt-1 bg-secondary w-[25px] h-[25px] max-[480px]:h-[20px] max-[480px]:w-[20px] rounded-lg border border-primary shadow-2xl"></div>
              <div className="max-w-[300px] max-[480px]:w-[250px]">
                <h1 className="font-bold text-2xl max-[480px]:text-lg">
                  State Fully Represented
                </h1>
                <p className="max-[480px]:text-sm">
                  These states are fully represented by all major licensed
                  brokerages in that state.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="bg-[#F1F1F1] w-full py-10">
        <div className="max-w-[1440px] w-full mx-auto px-10">
          <div className="grid min-[1000px]:grid-cols-5 min-[768px]:grid-cols-4 min-[550px]:grid-cols-3 grid-cols-2 gap-3">
            {statesCount.map((state: any) => (
              <div
                key={state.query}
                className="hover:underline cursor-pointer text-xl font-medium max-[480px]:text-lg"
                onClick={() => navigate(`/state/${state.query}`)}
              >
                {state.query}({state.count})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeForSalePage;
