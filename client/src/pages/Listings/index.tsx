import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import ResponsivePagination from "react-responsive-pagination";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { apis } from "@/apis";
import { IMAGES } from "@/constants";
import "react-responsive-pagination/themes/classic.css";

/** Fallback image pools - (Keep as is) */
const LISTING_IMAGES: Record<string, string[]> = {
  default: ["/listing_images/default/default.jpg", "/listing_images/default/default.jpg"],
};

/** hashString - (Keep as is) */
const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/** PropertyRow - (Keep as is) */
const PropertyRow = ({
  iconSrc,
  label,
  value,
}: {
  iconSrc: string;
  label: string;
  value?: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <span className="flex items-center gap-1 font-medium text-[#374151]">
      <img src={iconSrc} alt={label} className="w-4 h-4" aria-hidden="true" />
      <span className="whitespace-nowrap">{label}</span>
    </span>
    <span className="text-[#111827]">{value ?? "TBD"}</span>
  </div>
);

/** List - (Keep as is) */
const List = ({
  listing,
  onOpen,
}: {
  listing: any;
  onOpen: (id: string) => void;
}) => {
  const imgSrc = listing?.imgsrc ?? "";

  return (
    <div className="cursor-pointer group" onClick={() => onOpen(listing._id)}>
      <div className="flex items-center gap-10 max-[768px]:gap-5 rounded-t-xl border border-[#8F8F8F] px-3 py-1 bg-[#F5F5F5]">
        <span className="whitespace-nowrap">ID {listing.id}</span>
        <span className="font-bold">{listing.name}</span>
      </div>

      <div className="rounded-b-xl border border-[#8F8F8F] px-5 py-3 grid grid-cols-6 gap-4 max-[768px]:grid-cols-1 bg-white group-hover:bg-amber-200 transition-colors duration-200">
        <div className="col-span-1 max-[1280px]:hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={`${listing.city || "City"}, ${listing.state || "State"} practice`}
              className="w-full h-28 object-cover rounded-lg shadow-sm"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-28 rounded-lg bg-gray-100" />
          )}
        </div>

        <div className="col-span-5 max-[768px]:col-span-1 grid grid-cols-2 gap-x-6 gap-y-2 max-[768px]:grid-cols-1">
          <PropertyRow iconSrc={IMAGES.STATE_ICON} label="State:" value={listing.state || "TBD"} />
          <PropertyRow iconSrc={IMAGES.CITY_ICON} label="City:" value={listing.city || "TBD"} />
          <PropertyRow iconSrc={IMAGES.GROSS_ICON} label="Gross Collections:" value={listing.annual_collections || "TBD"} />
          <PropertyRow iconSrc={IMAGES.TYPE_ICON} label="Practice Type:" value={listing.type || "TBD"} />
          <PropertyRow iconSrc={IMAGES.OP_ICON} label="Operatories:" value={listing.operatory || "TBD"} />
        </div>
      </div>
    </div>
  );
};

const SCROLL_KEY = "listings:scrollState";

const ListingsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Get state from URL search params, and use it as initial value for our new state filter
  const stateQueryFromUrl = (searchParams.get("state") || "").trim();

  const saved = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
    } catch {
      return {};
    }
  })() as { y?: number; page?: number; limit?: number; search?: string; state?: string; operatory?: string; type?: string };

  // --- NEW FILTER STATES ---
  const [search, setSearch] = React.useState<string>(saved.search ?? "");
  const [stateFilter, setStateFilter] = React.useState<string>(saved.state ?? stateQueryFromUrl);
  const [operatoryFilter, setOperatoryFilter] = React.useState<string>(saved.operatory ?? "");
  const [typeFilter, setTypeFilter] = React.useState<string>(saved.type ?? "");
  // -------------------------

  const [listings, setListings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState<number>(saved.page ?? 1);
  const [limit, setLimit] = React.useState<number>(saved.limit ?? 25);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);

  const restoreYRef = React.useRef<number | null>(typeof saved.y === "number" ? saved.y : null);
  const didMountRef = React.useRef(false);

  /** chooseImageForListing - (Keep as is) */
  const chooseImageForListing = React.useCallback(
    (listing: any, imagesForState: string[] | undefined) => {
      const stateVal = (listing?.state || "").trim();
      const city = (listing?.city || "").trim();
      const idSeed = `${listing?._id ?? listing?.id ?? `${stateVal}-${city}`}`;

      const apiPool = imagesForState && imagesForState.length ? imagesForState : [];

      const fallbackPools: string[][] = [
        stateVal && city && LISTING_IMAGES[`${stateVal}|${city}`] ? LISTING_IMAGES[`${stateVal}|${city}`] : [],
        stateVal && LISTING_IMAGES[stateVal] ? LISTING_IMAGES[stateVal] : [],
        LISTING_IMAGES.default || [],
      ].filter((arr) => arr.length > 0);

      const flattened = (apiPool.length ? apiPool : fallbackPools.flat()).filter(Boolean);
      if (!flattened.length) return "";

      const idx = hashString(idSeed) % flattened.length;
      return flattened[idx];
    },
    []
  );

  // Helper to trigger the search
  const triggerSearch = (
    newPage: number = 1,
    newLimit: number = limit,
    newState: string = stateFilter,
    newSearch: string = search,
    newOperatory: string = operatoryFilter,
    newType: string = typeFilter
  ) => {
    // Always reset to page 1 for a new search/filter
    setPage(newPage);
    GetListings(newPage, newLimit, newState, newSearch, newOperatory, newType);
  }

  // --- UPDATED GetListings FUNCTION ---
  const GetListings = async (
    pageArg: number,
    limitArg: number,
    stateArg: string, // Use stateArg for the API call
    searchArg: string,
    operatoryArg: string, // New Argument
    typeArg: string // New Argument
  ) => {
    try {
      setLoading(true);

      // Construct API payload with all filters
      const payload: any = {
        page: pageArg,
        limit: limitArg,
        state: stateArg,
        search: searchArg,
      };

      if (operatoryArg) payload.operatory = operatoryArg;
      if (typeArg) payload.type = typeArg;

      const response: any = await apis.getPracticeList(payload);

      if (!response?.status) {
        setListings([]);
        setTotalCount(0);
        setTotalPages(0);
        return;
      }

      const fetchedListings: any[] = response.payload.data || [];

      // ... Image fetching logic remains the same ...
      const uniqueStates = Array.from(
        new Set(
          fetchedListings.map((l) => {
            const s = (l?.state || "").toString().trim();
            return s ? s : "default";
          })
        )
      );

      const imagesRequests = uniqueStates.map((st) =>
        apis
          .getListingImages(st)
          .then((res: any) => ({
            state: st,
            images: Array.isArray(res?.payload?.images) ? res.payload.images : [],
          }))
          .catch(() => ({ state: st, images: [] }))
      );

      const imagesResults = await Promise.all(imagesRequests);

      const imagesByState: Record<string, string[]> = {};
      imagesResults.forEach((r) => {
        imagesByState[r.state] = r.images || [];
      });

      const mapped = fetchedListings.map((l) => {
        const stateKey = (l?.state || "").toString().trim() || "default";
        const imgsrc = chooseImageForListing(l, imagesByState[stateKey]);
        return { ...l, imgsrc };
      });
      // ... End Image fetching logic ...

      setListings(mapped);
      setTotalCount(response.payload.totalCount);
      setTotalPages(response.payload.totalPages);
      setPage(response.payload.currentPage);
    } catch (err) {
      console.error("GetListings error:", err);
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------

  /** useEffect for scroll restoration - (Keep as is) */
  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  /** useEffect for initial load (uses new stateFilter) */
  React.useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    // Pass the initial state and filter values
    GetListings(page, limit, stateFilter, search, operatoryFilter, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** useEffect for pagination/limit change (uses new stateFilter) */
  React.useEffect(() => {
    if (!didMountRef.current) return;
    // When page or limit changes, call GetListings with current filter values
    GetListings(page, limit, stateFilter, search, operatoryFilter, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  /** useEffect for new filters (only run search on manual trigger) */
  // The logic for stateFilter, search, operatoryFilter, typeFilter will be
  // handled by an explicit search button or 'Enter' key press.

  /** useEffect for scroll restoration - (Keep as is) */
  React.useEffect(() => {
    if (!loading && listings.length && restoreYRef.current != null) {
      requestAnimationFrame(() => {
        window.scrollTo(0, restoreYRef.current as number);
        restoreYRef.current = null;
        sessionStorage.removeItem(SCROLL_KEY);
      });
    }
  }, [loading, listings]);

  /** openDetail - (Updated to save new filter states) */
  const openDetail = (id: string) => {
    sessionStorage.setItem(
      SCROLL_KEY,
      JSON.stringify({ y: window.scrollY, page, limit, search, state: stateFilter, operatory: operatoryFilter, type: typeFilter })
    );
    navigate(`/listings/${id}`);
  };

  // --- RENDERED COMPONENT (with new filter fields) ---
  return (
    <div>
      <div className="flex justify-between items-center max-[768px]:flex-col gap-1">
        <h1 className="text-2xl font-bold">Practices for Sale</h1>

        <div className="flex items-center gap-3">
          <div className="text-xl max-[768px]:text-lg whitespace-nowrap">
            Total: {totalCount}
          </div>

          <select
            className="border border-[#8F8F8F] bg-white px-1 py-1 rounded-xl w-[60px] text-xl"
            value={limit}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <hr className="my-2" />

      {/* NEW FILTER SECTION */}
      <div className="flex flex-wrap gap-4 items-end mb-4 p-3 border border-gray-300 rounded-xl bg-gray-50">
        <div className="flex flex-col gap-1 w-full max-w-[200px] max-[640px]:max-w-none">
          <label className="text-sm font-medium text-gray-700">State</label>
          <input
            className="block border border-gray-400 bg-white placeholder-gray-500 rounded-[10px] px-3 py-1 outline-none"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            placeholder="e.g., Texas, Arizona"
          />
        </div>

        <div className="flex flex-col gap-1 w-full max-w-[150px] max-[640px]:max-w-none">
          <label className="text-sm font-medium text-gray-700">Operatories</label>
          <select
            className="border border-gray-400 bg-white px-3 py-1 rounded-xl outline-none"
            value={operatoryFilter}
            onChange={(e) => setOperatoryFilter(e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full max-w-[200px] max-[640px]:max-w-none">
          <label className="text-sm font-medium text-gray-700">Practice Type</label>
          <select
            className="border border-gray-400 bg-white px-3 py-1 rounded-xl outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Any</option>
            <option value="General">General</option>
            <option value="Specialty">Specialty</option>
            <option value="Orthodontic">Orthodontic</option>
            {/* Add more options based on your data */}
          </select>
        </div>

        {/* Existing General Search Box, now part of the filter group */}
        <div className="flex flex-col gap-1 flex-grow">
          <label className="text-sm font-medium text-gray-700">Keyword Search</label>
          <div className="relative">
            <input
              className="w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-1 pr-9 max-md:text-sm outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") triggerSearch(1, limit, stateFilter, search, operatoryFilter, typeFilter);
              }}
              placeholder="Search by name, city, etc."
            />
            <MdSearch
              className="absolute top-1/2 mt-[-9px] right-3 text-[#8F8F8F] text-lg cursor-pointer hover:text-black"
              onClick={() => triggerSearch(1, limit, stateFilter, search, operatoryFilter, typeFilter)}
              title="Search"
            />
          </div>
        </div>

        {/* Explicit Search/Apply Filters Button */}
        <button
          className="bg-primary text-white font-bold px-4 py-1.5 rounded-xl transition-colors duration-150 hover:bg-primary-dark max-[640px]:w-full"
          onClick={() => triggerSearch(1, limit, stateFilter, search, operatoryFilter, typeFilter)}
          disabled={loading}
        >
          Apply Filters
        </button>

      </div>
      {/* END NEW FILTER SECTION */}

      <hr className="my-2" />

      <div className="flex justify-center mb-2 items-center">
        <div className="w-[500px]">
          <ResponsivePagination current={page} total={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {listings.map((listing: any, index: number) => (
            <List key={listing._id || listing.id || index} listing={listing} onOpen={openDetail} />
          ))}
          {!listings.length && <div className="text-center py-10 text-gray-600">No practices found matching your criteria.</div>}
        </div>
      )}

      <hr className="mt-5" />

      <div className="flex justify-center mb-15 items-center mt-2">
        <div className="w-[500px]">
          <ResponsivePagination current={page} total={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;