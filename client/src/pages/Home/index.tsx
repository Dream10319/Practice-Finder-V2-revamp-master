import React from "react";
import ReactPlayer from "react-player";
import CountUp from "react-countup";
import { HOME_TAKE_CHARGES, IMAGES, TARGET_NUMBER } from "@/constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { HOME_YOUTUBE_LINK } from "@/constants";
import { useNavigate } from "react-router-dom";
import VideoEmbed from "@/components/EmbedVideo";

interface HomeElementProps {
  title: string;
  text: string;
}

const HomeElement: React.FC<HomeElementProps> = ({ title, text }) => (
  <div
    className={`bg-primary text-white rounded-4xl min-md:p-10 p-5 flex flex-col min-md:gap-5 gap-3 min-md:w-[350px] w-[320px] min-md:m-3 m-1 cursor-pointer hover:bg-secondary`}
  >
    <h2 className={`min-md:text-5xl text-4xl font-bold text-center`}>
      {title}
    </h2>
    <p>{text}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* First Section */}
      <div className="bg-primary min-md:px-25 px-5 min-md:py-16 py-5 min-md:grid min-md:grid-cols-2 min-md:gap-5">
        <div>
          <h1 className="text-white font-extrabold min-md:text-6xl text-2xl min-mdleading-16">
            Find a Dental Practice For Sale with Practice MLS
          </h1>
          <p className="text-white py-11 font-normal leading-8 text-2xl max-md:hidden">
            Stop searching and start finding dental practices for sale. Search
            thousands of dental practice listings all in one place.
          </p>
          <div className="min-md:hidden max-md:my-5">
            <ReactPlayer width={"100%"} url={HOME_YOUTUBE_LINK} />
          </div>
          <div className="text-white font-bold min-md:text-4xl text-2xl">
            <a href="/signup" className="hover:opacity-90 cursor-pointer">
              <span className="underline underline-offset-10 decoration-tertiary">
                SIGN UP NOW
              </span>
            </a>
            <span>
              {" "}
              FOR <span className="text-tertiary">FREE</span>
            </span>
          </div>
        </div>
        <div className="max-md:hidden">
          <VideoEmbed/>
        </div>
      </div>

      {/* Second section */}
      <div className="px-5 min-md:my-15 my-5 min-md:grid min-md:grid-cols-3 min-md:gap-10 mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-center min-md:gap-5 gap-2">
          <h1 className="min-md:text-6xl text-3xl min-md:leading-16 text-primary font-extrabold">
            Take Charge.
          </h1>
          <h3 className="text-primary font-bold min-md:text-4xl text-2xl min-md:leading-12">
            Find the best dental office for sale... For you!
          </h3>
          <p className="min-md:text-3xl text-sm min-md:leading-10 text-primary">
            You need oversight and information. Stop relying on practice brokers
            to call you. Start getting the information you need in order to take
            action and find the practice you want.
          </p>
        </div>

        <div className="my-6 flex justify-center min-md:hidden">
          <button
            className="text-white bg-[#FF7575] rounded-2xl text-md font-bold leading-8 px-3 cursor-pointer hover:opacity-75"
            onClick={() => navigate("/signup")}
          >
            Get Start Now
          </button>
        </div>

        <div className="min-md:col-span-2">
          <div className="flex justify-center items-center flex-wrap max-md:mt-2">
            {HOME_TAKE_CHARGES.map((charge: any, index: number) => (
              <HomeElement
                key={index}
                title={charge.title}
                text={charge.text}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Third section */}
      <div className="px-5 min-md:my-15 my-8 min-md:grid min-md:grid-cols-7 min-md:gap-10 mx-auto max-w-[1440px]">
        <div className="min-md:col-span-5 flex flex-col min-md:gap-10">
          <h1 className="min-md:text-6xl min-md:leading-18 text-3xl text-primary font-extrabold">
            Access To Multiple Practice Listings on One Site
          </h1>
          <p className="text-2xl leading-10 text-primary max-md:hidden">
            A showcase of diverse practices with descriptions and details like
            location, specialty, revenue, and opperatories. Secure your dream
            location with existing infrastructure.
          </p>
        </div>
        <div className="min-md:col-span-2">
          <LazyLoadImage src={IMAGES.MAP} alt="map" className="" />
        </div>
      </div>

      <div className="my-6 flex justify-center min-md:hidden">
        <button
          className="text-white bg-[#FF7575] rounded-2xl text-md font-bold leading-8 px-3 cursor-pointer hover:opacity-75"
          onClick={() => navigate("/signup")}
        >
          Get Start Now
        </button>
      </div>

      {/* Fourth section */}
      <div className="bg-[#D9D9D9] p-10 max-md:hidden">
        <h1 className="max-w-[1280px] w-[100%] text-center text-6xl font-bold mx-auto text-primary">
          The #1 Site for Searching Dental Practices for Sale Online
        </h1>
      </div>
      <div className="bg-[#F1F1F1] flex justify-center gap-10 py-15 max-md:hidden">
        <div className="w-[350px] bg-tertiary text-primary p-7 rounded-2xl flex flex-col gap-5">
          <h2 className="text-4xl text-center font-semibold">
            Number of Practices Listed
          </h2>
          <h1 className="text-5xl text-center font-bold">
            <CountUp
              end={TARGET_NUMBER.PRACTICE}
              start={0}
              duration={5}
              prefix="+"
              enableScrollSpy={true}
            />
          </h1>
        </div>
        <div className="w-[350px] bg-tertiary text-primary p-7 rounded-2xl flex flex-col gap-5">
          <h2 className="text-4xl text-center font-semibold">
            Number of Dentists Served
          </h2>
          <h1 className="text-5xl text-center font-bold">
            <CountUp
              end={TARGET_NUMBER.DENTIST}
              start={0}
              duration={5}
              enableScrollSpy={true}
            />
          </h1>
        </div>
        <div className="w-[350px] bg-tertiary text-primary p-7 rounded-2xl flex flex-col gap-5">
          <h2 className="text-4xl text-center font-semibold">
            Become an Owner in Days
          </h2>
          <h1 className="text-5xl text-center font-bold">
            <CountUp
              end={TARGET_NUMBER.OWNER}
              start={0}
              duration={5}
              enableScrollSpy={true}
            />
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
