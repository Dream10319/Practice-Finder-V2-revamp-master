import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import ResponsivePagination from "react-responsive-pagination";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { apis } from "@/apis";
import { IMAGES } from "@/constants";
import "react-responsive-pagination/themes/classic.css";

/**
 * 🔸 Image Pool (examples)
 */
const LISTING_IMAGES: Record<string, string[]> = {
  "CA|San Francisco": [
    "/images/ca/sf-1.jpg",
    "/images/ca/sf-2.jpg",
    "/images/ca/sf-3.jpg",
    "/images/ca/sf-4.jpg",
  ],
  "TX|Austin": [
    "/images/tx/austin-1.jpg",
    "/images/tx/austin-2.jpg",
    "/images/tx/austin-3.jpg",
    "/images/tx/austin-4.jpg",
  ],
  CA: ["/images/ca/ca-1.jpg", "/images/ca/ca-2.jpg", "/images/ca/ca-3.jpg"],
  TX: ["/images/tx/tx-1.jpg", "/images/tx/tx-2.jpg", "/images/tx/tx-3.jpg"],
  NY: ["/images/ny/ny-1.jpg", "/images/ny/ny-2.jpg", "/images/ny/ny-3.jpg"],
  default: ["/images/default/hero-1.jpg", "/images/default/hero-2.jpg"],
};

// Stable hash so each listing gets a consistent image
const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getListingImage = (listing: any) => {
  const state = (listing?.state || "").trim();
  const city = (listing?.city || "").trim();
  const idSeed = `${listing?._id ?? listing?.id ?? `${state}-${city}`}`;

  const byCityKey = state && city ? `${state}|${city}` : "";
  const pools: string[][] = [
    byCityKey && LISTING_IMAGES[byCityKey] ? LISTING_IMAGES[byCityKey] : [],
    state && LISTING_IMAGES[state] ? LISTING_IMAGES[state] : [],
    LISTING_IMAGES.default || [],
  ].filter((arr) => arr.length > 0);

  const flattened = pools.flat();
  if (!flattened.length) return "";
  const idx = hashString(idSeed) % flattened.length;
  return flattened[idx];
};

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

// 🔑 Parent controls navigation so it can save scroll
const List = ({ listing, onOpen }: { listing: any; onOpen: (id: string) => void }) => {
  const imgSrc = React.useMemo(() => getListingImage(listing), [listing]);

  return (
    <div className="cursor-pointer group" onClick={() => onOpen(listing._id)}>
      {/* Header */}
      <div className="flex items-center gap-10 max-[768px]:gap-5 rounded-t-xl border border-[#8F8F8F] px-3 py-1 bg-[#F5F5F5]">
        <span className="whitespace-nowrap">ID {listing.id}</span>
        <span className="font-bold">{listing.name}</span>
      </div>

      {/* Body */}
      <div className="rounded-b-xl border border-[#8F8F8F] px-5 py-3 grid grid-cols-6 gap-4 max-[768px]:grid-cols-1 bg-white group-hover:bg-amber-200 transition-colors duration-200">
        {/* Image (desktop only) */}
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

        {/* Details */}
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
  const state = searchParams.get("state") || "";

  // Hydrate initial values from sessionStorage (if present)
  const saved = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
    } catch {
      return {};
    }
  })() as { y?: number; page?: number; limit?: number; search?: string };

  const [search, setSearch] = React.useState<string>(saved.search ?? "");
  const [listings, setListings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState<number>(saved.page ?? 1);
  const [limit, setLimit] = React.useState<number>(saved.limit ?? 25);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);

  const restoreYRef = React.useRef<number | null>(typeof saved.y === "number" ? saved.y : null);
  const didMountRef = React.useRef(false);

  const GetListings = async (
    pageArg: number,
    limitArg: number,
    stateArg: string,
    searchArg: string
  ) => {
    try {
      setLoading(true);
      const response: any = await apis.getPracticeList({
        page: pageArg,
        limit: limitArg,
        state: stateArg,
        search: searchArg,
      });

      if (response?.status) {
        setListings(response.payload.data);
        setTotalCount(response.payload.totalCount);
        setTotalPages(response.payload.totalPages);
        setPage(response.payload.currentPage);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Prevent browser from doing its own auto-restoration (we control it)
  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Initial fetch
  React.useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    GetListings(page, limit, state, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when page/limit/state change (search triggered manually)
  React.useEffect(() => {
    if (!didMountRef.current) return;
    GetListings(page, limit, state, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, state]);

  // Restore scroll after data arrives
  React.useEffect(() => {
    if (!loading && listings.length && restoreYRef.current != null) {
      requestAnimationFrame(() => {
        window.scrollTo(0, restoreYRef.current as number);
        restoreYRef.current = null;
        sessionStorage.removeItem(SCROLL_KEY);
      });
    }
  }, [loading, listings]);

  // Open detail: save scroll + list state, then navigate
  const openDetail = (id: string) => {
    sessionStorage.setItem(
      SCROLL_KEY,
      JSON.stringify({ y: window.scrollY, page, limit, search })
    );
    navigate(`/listings/${id}`);
  };

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

          <div className="relative">
            <input
              className="w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-1 pr-9 max-md:text-sm outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") GetListings(1, limit, state, search);
              }}
              placeholder="Search..."
            />
            <MdSearch
              className="absolute top-1/2 mt-[-9px] right-3 text-[#8F8F8F] text-lg cursor-pointer hover:text-black"
              onClick={() => GetListings(1, limit, state, search)}
              title="Search"
            />
          </div>
        </div>
      </div>

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
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
