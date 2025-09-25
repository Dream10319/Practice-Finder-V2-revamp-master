import React from "react";
import { IMAGES } from "@/constants";
import { LazyLoadImage } from "react-lazy-load-image-component";

const AboutPage: React.FC = () => {
  return (
    <main className="w-full">
      {/* About Us Mission Section */}
      <section className="bg-primary text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* About Us */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight font-extrabold mb-4">
            About Us
          </h1>

          {/* Our Mission */}
          <p className="text-2xl sm:text-3xl md:text-4xl leading-tight font-normal mb-6">
            Our Mission: “Help dentists find a practice for sale.”
          </p>

          {/* Intro Paragraph */}
          <p
            className="text-white/95 text-lg sm:text-xl md:text-2xl leading-relaxed font-normal max-w-4xl mx-auto mb-12 sm:mb-14 md:mb-16"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            We are an <span className="capitalize">Independent</span> non-profit company with no obligations to any one
            brokerage, bank, cpa, or law office! We remain an independent source in order to maintain a complete and
            transparent database that has one goal,
          </p>

          {/* Emphasis Line */}
          <p className="text-2xl sm:text-3xl md:text-4xl leading-tight font-extrabold max-w-4xl mx-auto mb-10 sm:mb-12 md:mb-16">
            HELP DENTISTS FIND A PRACTICE FOR SALE.
          </p>

          {/* Small Map (centered & responsive) */}
          <LazyLoadImage
            src={IMAGES.SMALLMAP}
            alt="United States Map"
            className="mx-auto w-full max-w-[318px] md:max-w-[420px] h-auto"
          />
        </div>
      </section>

      {/* Search, Find, Connect Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Guidance sentence */}
          <h2 className="text-primary font-bold text-2xl sm:text-3xl md:text-[42px] leading-tight max-w-5xl mx-auto mb-8 sm:mb-10 md:mb-12">
            Once you find a dental practice you like! Connect with us by completing the form under each listing.
          </h2>

          {/* Supporting paragraph */}
          <p className="text-primary text-lg sm:text-xl md:text-2xl leading-relaxed font-normal mx-auto mb-10 sm:mb-12 md:mb-16">
            Align with key team members on your team when going into the buying process. <br className="hidden sm:block" />
            Choose to connect with a dental specific lawyer, a lending partner, and a buyer’s rep.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 py-2 sm:py-4">
            {/* Search */}
            <div className="flex flex-col items-center">
              <p className="text-primary font-bold text-xl sm:text-2xl md:text-3xl mb-2">Search</p>
              <LazyLoadImage
                src={IMAGES.SEARCH}
                alt="Search Icon"
                className="w-24 h-24 sm:w-50 sm:h-50 md:w-40 md:h-40 object-contain"
              />
            </div>

            {/* Find */}
            <div className="flex flex-col items-center">
              <p className="text-primary font-bold text-xl sm:text-2xl md:text-3xl mb-2">Find</p>
              <LazyLoadImage
                src={IMAGES.LOCATION}
                alt="Find Icon"
                className="w-24 h-24 sm:w-50 sm:h-50 md:w-40 md:h-40 object-contain"
              />
            </div>

            {/* Connect */}
            <div className="flex flex-col items-center">
              <p className="text-primary font-bold text-xl sm:text-2xl md:text-3xl mb-2">Connect</p>
              <LazyLoadImage
                src={IMAGES.CONNECT}
                alt="Connect Icon"
                className="w-24 h-24 sm:w-50 sm:h-50 md:w-40 md:h-40 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;