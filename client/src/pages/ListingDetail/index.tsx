import React from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { apis } from "@/apis";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { IMAGES } from "@/constants";

const ListingDetailPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [listing, setListng] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [likeListings, setLikeListings] = React.useState<Array<any>>([]);
  const { authUser } = useSelector((state: RootState) => state.auth);

  const GetLikedListings = async () => {
    try {
      const response: any = await apis.getLikedListings();
      if (response.status) {
        setLikeListings(response.payload.likes);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const GetListingById = async (id: string) => {
    try {
      setLoading(true);
      const response: any = await apis.getPracticeById(id);
      if (response.status) {
        setListng(response.payload.practice);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const LikeListing = async (id: string) => {
    try {
      const response: any = await apis.LikePractice(id);
      if (response.status) {
        GetLikedListings();
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    }
  };

  React.useEffect(() => {
    if (id) {
      GetLikedListings();
      GetListingById(id);
    }
  }, [id]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Practice Details</h1>
        <div>
          {likeListings.filter((listing: any) => listing._id === id).length >
          0 ? (
            <img
              src={IMAGES.THUMB_FILL}
              alt="liked"
              className="cursor-pointer w-[35px]"
            />
          ) : (
            <div className="flex gap-2 items-center">
              Like Listing
              <img
                src={IMAGES.THUMB}
                alt="like"
                className="cursor-pointer w-[35px]"
                onClick={() => LikeListing(listing?._id)}
              />
            </div>
          )}
        </div>
      </div>
      <hr className="my-2 " />
      {!loading ? (
        <>
          {listing ? (
            <div>
              <div className="flex items-center gap-10 rounded-t-xl border border-[#8F8F8F] px-3 py-3 bg-[#F5F5F5] text-xl">
                <span className="whitespace-nowrap">ID {listing.id}</span>
                <span className="font-bold">{listing.name}</span>
              </div>
              <div className="rounded-b-xl border border-[#8F8F8F] bg-white text-lg">
                <div className="border-b border-b-[#8F8F8F] px-5 py-2 flex gap-4">
                  State: <span className="font-bold">{listing.state}</span>
                </div>
                <div className="border-b border-b-[#8F8F8F] px-5 py-2 flex gap-4">
                  City: <span className="font-bold">{listing.city}</span>
                </div>
                <div className="border-b border-b-[#8F8F8F] px-5 py-2 flex gap-4">
                  Gross Collections:{" "}
                  <span className="font-bold">
                    {listing.annual_collections}
                  </span>
                </div>
                <div className="border-b border-b-[#8F8F8F] px-5 py-2 flex gap-4">
                  Practice Type:{" "}
                  <span className="font-bold">{listing.type}</span>
                </div>
                <div className="border-b border-b-[#8F8F8F] px-5 py-2 flex gap-4">
                  Operatories:{" "}
                  <span className="font-bold">{listing.operatory}</span>
                </div>
                <div className="border-b border-b-[#8F8F8F] px-5 py-2 flex gap-4">
                  Description:{" "}
                  <div>
                    <div className="font-bold">{listing.details}</div>
                    {listing.content ? (
                      <>
                        {listing.content.map((con: any) => (
                          <li key={con.key}>
                            {con.key}: {con.value}
                          </li>
                        ))}
                      </>
                    ) : null}
                  </div>
                </div>
                {authUser && authUser.role === "ADMIN" ? (
                  <div className="border-b border-b-[#8F8F8F] px-5 py-2">
                    <div className="font-extrabold">Admin Content</div>
                    {listing.admin_content ? (
                      <>
                        <ul className="list-none px-5">
                          {listing.admin_content.map((con: any) => (
                            <li key={con.key}>
                              {con.key}: <strong>{con.value}</strong>
                            </li>
                          ))}
                        </ul>
                        <hr className="mx-5" />
                      </>
                    ) : null}
                    <div className="flex gap-5 px-5">
                      Origin: <strong>{listing.origin}</strong>
                    </div>
                    <hr className="mx-5" />
                    <div className="flex gap-5 px-5">
                      Source Link: <strong>{listing.source_link}</strong>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
