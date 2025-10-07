import React from "react";
import { IMAGES } from "@/constants";
import { apis } from "@/apis";
import { useNavigate } from "react-router-dom";
import USMap from "@/components/Map";

/** Detect column count to match Tailwind breakpoints:
 *  >= 1000px -> 5 cols
 *  >= 768px  -> 4 cols
 *  >= 550px  -> 3 cols
 *  else      -> 2 cols
 */
function useResponsiveColumnCount() {
  const getCols = React.useCallback(() => {
    if (typeof window === "undefined") return 2;
    const w = window.innerWidth;
    if (w >= 1000) return 5;
    if (w >= 768) return 4;
    if (w >= 550) return 3;
    return 2;
  }, []);

  const [cols, setCols] = React.useState<number>(getCols);

  React.useEffect(() => {
    const onResize = () => setCols(getCols());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getCols]);

  return cols;
}

/** Split an array into N columns, filling top->bottom in each column,
 *  then moving left->right. This preserves your existing sort order but
 *  changes the visual reading order to column-first.
 */
function chunkIntoColumns<T>(arr: T[], cols: number): T[][] {
  if (cols <= 1) return [arr];
  const perCol = Math.ceil(arr.length / cols);
  return Array.from({ length: cols }, (_, i) =>
    arr.slice(i * perCol, i * perCol + perCol)
  );
}

const PracticeForSalePage = () => {
  const navigate = useNavigate();
  const [statesCount, setStatesCount] = React.useState<Array<any>>([]);
  const [roundedPracticeCount, setRoundedPracticeCount] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);

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
    GetStatesCount();
    return () => { cancelled = true; };
  }, []);

  const expandRef = React.useRef<HTMLDivElement | null>(null);
  const handleExpand = () => {
    setExpanded(true);
    requestAnimationFrame(() => {
      expandRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Determine how many columns to render to match Tailwind grid breakpoints
  const columnCount = useResponsiveColumnCount();

  // Make column chunks based on current column count and statesCount
  const stateColumns = React.useMemo(
    () => chunkIntoColumns(statesCount, columnCount),
    [statesCount, columnCount]
  );

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
          <h2 className="text-primary text-4xl text-center max-[768px]:text-lg">
            All in one convenient Dashboard.
          </h2>
          <div className="grid grid-cols-2 mt-10 px-10 max-[968px]:grid-cols-1 max-[768px]:mt-5 max-[768px]:px-5">
            <div className="flex flex-col gap-10 mx-auto max-[768px]:gap-5">
              <ul className="text-xl font-semibold flex flex-col gap-3 list-disc max-[768px]:text-sm max-[768px]:gap-1">
                <li>Create Your Own Customized Searches</li>
                <li>Over +{roundedPracticeCount} Currently Practices For Sale Nationwide</li>
                <li>Store Your Favorite Listings in One Place</li>
                <li>Quickly Find Key Aspects of Every Practice</li>
              </ul>
              <a
                className="bg-[#FF7575] py-2 px-10 text-white mx-auto rounded-full text-base font-semibold cursor-pointer hover:opacity-80 w-[90%] text-center"
                href="/signup"
              >
                Get Started Now
              </a>
              <div className="flex justify-center gap-2">
                <span className="text-2xl max-md:text-lg">Already a Member? </span>
                <a
                  href="/signin"
                  className="text-2xl font-bold underline text-[#8C83EF] hover:opacity-90 max-md:text-lg"
                >
                  Login
                </a>
                <span className="text-2xl font-bold max-md:text-lg">→</span>
              </div>
            </div>
            <img
              src={IMAGES.LOCATION1}
              alt="Map"
              className="h-full max-h-[320px] mx-auto max-[968px]:hidden"
            />
          </div>
        </div>

        {!expanded && (
          <div className="flex flex-col items-center mt-6 gap-2">
            <button
              type="button"
              onClick={handleExpand}
              aria-expanded={expanded}
              aria-controls="expand-sections"
              className="group inline-flex items-center justify-center rounded-full border border-white/60 bg-white/80 backdrop-blur p-3 shadow hover:shadow-lg hover:bg-white transition-all"
              title="Show more"
            >
              <span className="sr-only">Show more</span>
              <img
                src={IMAGES.ARROWDOWN}
                alt="Expand"
                className="h-12 w-12 object-contain group-hover:translate-y-1 transition-transform"
              />
            </button>
            <p className="text-primary text-lg font-semibold text-center max-md:text-base">
              View a Snapshot of Available Listings and Location
            </p>
          </div>
        )}
      </div>

      <div
        id="expand-sections"
        ref={expandRef}
        className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden
          ${expanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {statesCount.length > 0 ? (
          <div className="bg-white py-10">
            <h1 className="text-5xl font-extrabold text-center text-primary max-[480px]:text-3xl">
              Search by State
            </h1>
            <p className="text-xl max-w-[1000px] px-5 py-5 mx-auto text-primary max-[480px]:text-sm">
              Practice MLS is expanding nationwide, with 90% coverage in Washington, Oregon, California, Arizona, and Colorado. Other states may not include every brokerage firm
            </p>
            <div className="max-w-[1200px] mx-auto">
              <div className="w-[90%]">
                <USMap represented={true} listings={statesCount} />
              </div>
              <div className="flex justify-end gap-2 max-[480px]:justify-center mt-2">
                <div className="mt-1 bg-secondary w-[25px] h-[25px] max-[480px]:h-[20px] max-[480px]:w-[20px] rounded-lg border border-primary shadow-2xl"></div>
                <div className="max-w-[300px] max-[480px]:w-[250px]">
                  <p className="max-[480px]:text-sm">
                  These states are 90% covered by major brokerages in that state
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-[#F1F1F1] w-full py-10">
          <div className="max-w-[1440px] w-full mx-auto px-10">
            <div className="grid min-[1000px]:grid-cols-5 min-[768px]:grid-cols-4 min-[550px]:grid-cols-3 grid-cols-2 gap-3">
              {stateColumns.map((col, colIdx) => (
                <div key={`col-${colIdx}`} className="flex flex-col space-y-2">
                  {col.map((state: any) => (
                    <div
                      key={state.query}
                      className="hover:underline cursor-pointer text-xl font-medium max-[480px]:text-lg"
                      onClick={() => navigate(`/state/${state.query}`)}
                    >
                      {state.query}({state.count})
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeForSalePage;
