import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { apis } from "@/apis";
import { BsHandThumbsUp } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import USMap from "@/components/Map";

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
      <div className="rounded-b-xl border border-[#8F8F8F] px-5 py-3 bg-white group-hover:bg-amber-200 transition-colors duration-200">
        <div>State: {listing.state}</div>
        <div>Gross Collections: {listing.annual_collections}</div>
        <div>Practice Type: {listing.type}</div>
        <div>Operatories: {listing.operatory}</div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [likeLoading, setLikeLoading] = React.useState(false);
  const [statesCount, setStatesCount] = React.useState<Array<any>>([]);
  const [likeListings, setLikeListings] = React.useState<Array<any>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const GetStatesCount = async () => {
    try {
      setSearchLoading(true);
      const response: any = await apis.getStatesListingsCount();
      if (response.status) {
        setStatesCount(response.payload.data);
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const GetLikedListings = async () => {
    try {
      setLikeLoading(true);
      const response: any = await apis.getLikedListings();
      if (response.status) {
        setLikeListings(response.payload.likes);
        setTotalPages(Math.ceil(response.payload.likes.length / 4));
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setLikeLoading(false);
    }
  };

  React.useEffect(() => {
    GetStatesCount();
    GetLikedListings();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-10 max-[1024px]:gap-5">
      <div className="col-span-2 max-[1024px]:col-span-5 rounded-2xl bg-white border border-[#B5B5B5] p-5 shadow-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Listings</h1>
          <BsHandThumbsUp className="text-2xl" />
        </div>
        <hr className="my-2" />
        <div>
          {likeLoading ? (
            <div className="flex justify-center">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
            </div>
          ) : (
            <>
              {likeListings.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {likeListings
                    .slice((page - 1) * 4, 4 * page)
                    .map((listing: any, index: number) => (
                      <List listing={listing} key={index} />
                    ))}
                </div>
              ) : (
                <div className="text-center text-xl"> No data available</div>
              )}
            </>
          )}
          <div className="flex justify-center mt-2 items-center">
            <div className="w-[500px]">
              <ResponsivePagination
                current={page}
                total={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 max-[1024px]:col-span-5 rounded-2xl bg-white border border-[#B5B5B5] p-5 shadow-2xl">
        <h1 className="text-2xl font-bold">Location Search</h1>
        <hr className="my-2" />
        <div className="w-[90%] mb-5">
          <USMap />
        </div>
        <div>
          {searchLoading ? (
            <div className="flex justify-center">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1 max-[1024px]:grid-cols-4 max-[768px]:grid-cols-3 max-[480px]:grid-cols-2">
              {statesCount.map((state: any) => (
                <div
                  key={state.query}
                  className="hover:underline cursor-pointer max-[480px]:text-[15px]"
                  onClick={() => navigate(`/listings?state=${state.query}`)}
                >
                  {state.query}({state.count})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
