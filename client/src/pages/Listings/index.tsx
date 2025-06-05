import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import ResponsivePagination from "react-responsive-pagination";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { apis } from "@/apis";
import "react-responsive-pagination/themes/classic.css";

const List = ({ listing }: any) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer group"
      onClick={() => navigate(`/listings/${listing._id}`)}
    >
      <div className="flex items-center gap-10 max-[768px]:gap-5 rounded-t-xl border border-[#8F8F8F] px-3 py-1 bg-[#F5F5F5]">
        <span className="whitespace-nowrap">ID {listing.id}</span>
        <span className="font-bold">{listing.name}</span>
      </div>
      <div className="rounded-b-xl border border-[#8F8F8F] px-5 py-3 grid grid-cols-5 max-[768px]:grid-cols-1 bg-white group-hover:bg-amber-200 transition-colors duration-200">
        <div>State: {listing.state}</div>
        <div>City: {listing.city}</div>
        <div>Gross Collections: {listing.annual_collections || "TBD"}</div>
        <div>Practice Type: {listing.type}</div>
        <div>Operatories: {listing.operatory || "TBD"}</div>
      </div>
    </div>
  );
};

const ListingsPage = () => {
  const [searchParams] = useSearchParams();
  const state = searchParams.get("state") || "";
  const [search, setSearch] = React.useState("");
  const [listings, setListings] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState<number>(25);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);

  const GetListings = async (
    page: number,
    limit: number,
    state: string,
    search: string
  ) => {
    try {
      setLoading(true);
      const response: any = await apis.getPracticeList({
        page: page,
        limit: limit,
        state: state,
        search: search,
      });

      if (response.status) {
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

  React.useEffect(() => {
    GetListings(page, limit, state, search);
  }, [page, limit, state]);

  return (
    <div>
      <div className="flex justify-between items-center max-[768px]:flex-col gap-1">
        <h1 className="text-2xl font-bold">Practices for Sale</h1>
        <div className="flex items-center gap-3">
          <div className="text-xl max-[768px]:text-lg whitespace-nowrap">Total: {totalCount}</div>
          <select
            className="border border-[#8F8F8F] bg-white px-1 py-1 rounded-xl w-[60px] text-xl"
            onChange={(event: any) => {
              setLimit(Number(event.target.value));
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="relative">
            <input
              className="w-full block border border-primary bg-white placeholder-[#465860] rounded-[10px] px-3 py-1 max-md:text-sm outline-none"
              value={search}
              onChange={(event: any) => setSearch(event.target.value)}
              placeholder="Search..."
            />
            <MdSearch
              className="absolute top-1/2 mt-[-9px] right-4 text-[#8F8F8F] text-lg cursor-pointer hover:text-black"
              onClick={() => GetListings(page, limit, state, search)}
            />
          </div>
        </div>
      </div>
      <hr className="my-2" />
      <div className="flex justify-center mb-2 items-center">
        <div className="w-[500px]">
          <ResponsivePagination
            current={page}
            total={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {listings.map((listing: any, index: number) => (
            <List listing={listing} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
