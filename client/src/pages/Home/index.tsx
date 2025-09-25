import React from "react";
import CountUp from "react-countup";
import { HOME_TAKE_CHARGES, IMAGES, TARGET_NUMBER } from "@/constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import VideoEmbed from "@/components/EmbedVideo";
import USMap from "@/components/Map";
import { apis } from "@/apis";

interface HomeElementProps {
  title: string;
  text: string;
}

const HomeElement: React.FC<HomeElementProps> = ({ title, text }) => (
  <div
    className="bg-primary text-white rounded-3xl p-6 md:p-8 flex flex-col gap-3 md:gap-4 w-full sm:w-[300px] md:w-[340px] lg:w-[360px] shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-[#20AC58]"
  >
    <h3 className="text-2xl md:text-3xl font-bold text-center">{title}</h3>
    <p className="text-sm md:text-base text-white/90 text-center">{text}</p>
  </div>
);

/** Typewriter rotating words with blinking caret */
const RotatingTypewriter: React.FC<{
  words: string[];
  className?: string;
  typingMs?: number; // per character
  deleteMs?: number; // per character
  holdMs?: number; // pause when a word is fully typed
}> = ({ words, className = "", typingMs = 90, deleteMs = 50, holdMs = 1000 }) => {
  const [i, setI] = React.useState(0); // which word index
  const [sub, setSub] = React.useState(0); // number of chars shown
  const [del, setDel] = React.useState(false); // deleting?

  // caret blink (pure CSS via Tailwind classes toggled by state)
  const [blink, setBlink] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  // reduce motion accessibility
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // typing / deleting loop
  React.useEffect(() => {
    if (prefersReduced) return; // show full word without animation

    const curr = words[i];
    if (!del && sub === curr.length) {
      const t = setTimeout(() => setDel(true), holdMs);
      return () => clearTimeout(t);
    }
    if (del && sub === 0) {
      setDel(false);
      setI((v) => (v + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => setSub((v) => v + (del ? -1 : 1)),
      del ? deleteMs : typingMs
    );
    return () => clearTimeout(t);
  }, [sub, del, i, words, typingMs, deleteMs, holdMs, prefersReduced]);

  const shown = prefersReduced ? words[i] : words[i].slice(0, sub);

  return (
    <span className={`inline-flex items-center ${className}`} aria-live="polite" aria-atomic="true">
      <span>{shown}</span>
      <span
        className={`ml-1 inline-block w-[2px] h-[1.2em] bg-current align-[-0.15em] ${blink ? "opacity-0" : "opacity-100"
          }`}
      />
    </span>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [statesCount, setStatesCount] = React.useState<Array<any>>([]);
  const [practiceCount, setPracticeCount] = React.useState<number | null>(null);
  const [userCount, setUserCount] = React.useState<number | null>(null);
  const [loadingCount, setLoadingCount] = React.useState(true);
  const [roundedPracticeCount, setRoundedPracticeCount] = React.useState<number | null>(null);

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
    let cancelled = false;

    const load = async () => {
      try {
        const pdata: any = await apis.getTotalPracticeCount();
        const udata: any = await apis.getUserCount();
        if (!cancelled && pdata?.status && typeof pdata?.payload?.totalCount === "number") {
          setPracticeCount(pdata.payload.totalCount);
          setRoundedPracticeCount(Math.floor(pdata.payload.totalCount / 100) * 100);
          setUserCount(udata?.payload?.totalCount ?? null);
        }
      } finally {
        if (!cancelled) setLoadingCount(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full">
      {/* HERO */}
      <section className="bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight">
                Find a Dental Practice For Sale with Practice MLS
              </h1>

              <RotatingTypewriter
                words={["Easily", "Quickly", "Confidently"]}
                className="font-bold text-3xl sm:text-4xl lg:text-6xl"
              />

              <p className="hidden md:block text-white/95 text-xl leading-8">
                Browse dental practice listings in your area.
                <br />
                We have <span className="font-bold">{practiceCount ?? TARGET_NUMBER.PRACTICE}</span> practices listed
                nationwide.
                <br />
                Sign up for <span className="font-bold text-[#FAC91A]">FREE</span> and find your next dental practice!
              </p>

              <div className="md:hidden">
                <VideoEmbed />
              </div>

              <div>
                <a href="/signup" className="inline-flex">
                  <span
                    className="inline-flex items-center justify-center gap-2 md:gap-3 
                 text-black bg-[#FAC91A] rounded-full 
                 hover:opacity-90 transition-opacity"
                    style={{
                      width: "517px",
                      height: "63px",
                      fontFamily: "'Almarai', sans-serif",
                      fontWeight: 800,
                      fontSize: "32px",
                      lineHeight: "37px",
                    }}
                  >
                    Get Started Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <VideoEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* BADGE / STATEMENT */}
      <section className="bg-[#D9D9D9] hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-center text-primary font-bold text-3xl lg:text-5xl max-w-5xl mx-auto">
            The #1 Site for Searching Dental Practices for Sale Online
          </h2>
        </div>
      </section>

      {/* MAP */}
      {statesCount.length > 0 ? (
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <USMap represented={true} listings={statesCount} />
        </div>
      </section>
      ): null}
      <div className="bg-[#F1F1F1] flex justify-center gap-10 py-15 max-md:hidden">
        <div className="w-[350px] bg-tertiary text-primary p-7 rounded-2xl flex flex-col gap-5">
          <h2 className="text-4xl text-center font-semibold">Number of Practices Listed</h2>
          <h1 className="text-5xl text-center font-bold">
            {loadingCount ? (
              // quick skeleton/fallback while loading
              <span>...</span>
            ) : (
              <CountUp
                end={roundedPracticeCount ?? TARGET_NUMBER.PRACTICE}
                start={0}
                duration={5}
                prefix="+"
                enableScrollSpy={true}
              />
            )}
          </h1>
        </div>

        <div className="w-[350px] bg-tertiary text-primary p-7 rounded-2xl flex flex-col gap-5">
          <h2 className="text-4xl text-center font-semibold">Number of Users & Growing</h2>
          <h1 className="text-5xl text-center font-bold">
            {loadingCount ? (
              // quick skeleton/fallback while loading
              <span>...</span>
            ) : (
              <CountUp end={userCount ?? TARGET_NUMBER.DENTIST} start={0} duration={5} enableScrollSpy={true} />
            )}
          </h1>
        </div>

        <div className="w-[350px] bg-tertiary text-primary p-7 rounded-2xl flex flex-col gap-5">
          <h2 className="text-4xl text-center font-semibold">Become an Owner in Days</h2>
          <h1 className="text-5xl text-center font-bold">
            <CountUp end={TARGET_NUMBER.OWNER} start={0} duration={5} enableScrollSpy={true} />
          </h1>
        </div>
      </div>

      {/* ACCESS SECTION */}
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-7 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-primary font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight">
                Access To Multiple Practice Listings on One Site
              </h2>
              <p className="hidden md:block text-primary text-xl leading-8 max-w-3xl">
                A showcase of diverse practices with descriptions and details like location, specialty, revenue, and
                operatories. Secure your dream location with existing infrastructure.
              </p>
            </div>
            <div className="lg:col-span-2">
              <LazyLoadImage src={IMAGES.MAP} alt="Map" className="rounded-xl w-full h-auto object-cover" />
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden mt-8 flex justify-center">
            <button
              className="text-white bg-[#FF7575] rounded-xl text-sm font-bold leading-8 px-4 py-2 hover:opacity-80"
              onClick={() => navigate("/signup")}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* TAKE CHARGE */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
            <div className="space-y-4">
              <h2 className="text-primary font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight">Take Charge.</h2>
              <h3 className="text-primary font-bold text-2xl md:text-3xl lg:text-4xl leading-snug">
                Find the best dental office for sale... For you!
              </h3>
              <p className="text-primary text-base md:text-lg lg:text-xl leading-7 md:leading-8">
                You need oversight and information. Stop relying on practice brokers to call you. Start getting the
                information you need in order to take action and find the practice you want.
              </p>

              {/* Mobile CTA duplicate for this section */}
              <div className="md:hidden pt-2">
                <button
                  className="text-white bg-[#FF7575] rounded-xl text-sm font-bold leading-8 px-4 py-2 hover:opacity-80"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Now
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {HOME_TAKE_CHARGES.map((charge: any, index: number) => (
                  <HomeElement key={index} title={charge.title} text={charge.text} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
