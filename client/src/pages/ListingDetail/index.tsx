import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { apis } from "@/apis";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { IMAGES } from "@/constants";

const ListingDetailPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const [listing, setListng] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [likeListings, setLikeListings] = React.useState<Array<any>>([]);
  const [backHover, setBackHover] = React.useState(false);

  const { authUser } = useSelector((state: RootState) => state.auth);

  const GetLikedListings = async () => {
    try {
      const response: any = await apis.getLikedListings();
      if (response.status) setLikeListings(response.payload.likes);
    } catch (err: any) {
      console.log(err);
    }
  };

  const GetListingById = async (id: string) => {
    try {
      setLoading(true);
      const response: any = await apis.getPracticeById(id);
      if (response.status) setListng(response.payload.practice);
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
        enqueueSnackbar({ variant: "success", message: response.message });
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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Practice Details</h1>
        </div>
      </div>

      <hr className="my-2 " />

      {!loading ? (
        <>
          {listing ? (
            <div>
              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                onMouseEnter={() => setBackHover(true)}
                onMouseLeave={() => setBackHover(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(-1);
                  }
                }}
                className="flex items-center gap-2 my-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                aria-label="Go back"
                title="Back"
              >
                <img
                  src={backHover ? IMAGES.BACK_HOVER : IMAGES.BACK}
                  alt=""
                  className="w-15 h-full"
                  aria-hidden="true"
                />
              </button>
              <div className="rounded-xl border border-[#8F8F8F] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between gap-10 px-3 py-3 bg-[#F5F5F5] text-xl">
                  <div className="flex gap-10">
                    <span className="whitespace-nowrap">ID {listing.id}</span>
                    <span className="font-bold">{listing.name}</span>
                  </div>
                  <div>
                    {likeListings.some((l: any) => l._id === id) ? (
                      <img
                        src={IMAGES.THUMB_FILL}
                        alt="liked"
                        className="cursor-pointer w-[25px]"
                      />
                    ) : (
                      <div className="flex gap-2 items-center">
                        Like Listing
                        <img
                          src={IMAGES.THUMB}
                          alt="like"
                          className="cursor-pointer w-[25px]"
                          onClick={() =>
                            listing?._id && LikeListing(listing._id)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white text-lg">
                  <div className="px-5">

                    {/* State */}
                    <div className="grid grid-cols-[20px_12px_180px_1fr] items-center gap-1 border-b border-b-[#8F8F8F] py-2">
                      <img src={IMAGES.STATE_ICON} alt="State" className="w-5 h-5" />
                      <div />
                      <span className="whitespace-nowrap">State:</span>
                      <span className="font-bold">{listing.state}</span>
                    </div>

                    {/* City */}
                    <div className="grid grid-cols-[20px_12px_180px_1fr] items-center gap-1 border-b border-b-[#8F8F8F] py-2">
                      <img src={IMAGES.CITY_ICON} alt="City" className="w-5 h-5" />
                      <div />
                      <span className="whitespace-nowrap">City:</span>
                      <span className="font-bold">{listing.city}</span>
                    </div>

                    {/* Gross Collections */}
                    <div className="grid grid-cols-[20px_12px_180px_1fr] items-center gap-1 border-b border-b-[#8F8F8F] py-2">
                      <img src={IMAGES.GROSS_ICON} alt="Gross Collections" className="w-5 h-5" />
                      <div />
                      <span className="whitespace-nowrap">Gross Collections:</span>
                      <span className="font-bold">{listing.annual_collections}</span>
                    </div>

                    {/* Practice Type */}
                    <div className="grid grid-cols-[20px_12px_180px_1fr] items-center gap-1 border-b border-b-[#8F8F8F] py-2">
                      <img src={IMAGES.TYPE_ICON} alt="Practice Type" className="w-5 h-5" />
                      <div />
                      <span className="whitespace-nowrap">Practice Type:</span>
                      <span className="font-bold">{listing.type}</span>
                    </div>

                    {/* Operatories */}
                    <div className="grid grid-cols-[20px_12px_180px_1fr] items-center gap-1 border-b border-b-[#8F8F8F] py-2">
                      <img src={IMAGES.OP_ICON} alt="Operatories" className="w-5 h-5" />
                      <div />
                      <span className="whitespace-nowrap">Operatories:</span>
                      <span className="font-bold">{listing.operatory}</span>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-[20px_12px_180px_1fr] gap-1 border-b border-b-[#8F8F8F] py-2">
                      <img src={""} alt="Description" className="w-5 h-5 mt-1" />
                      <div />
                      <span className="whitespace-nowrap mt-1">Description:</span>
                      <div>
                        <div className="font-bold">{listing.details}</div>
                        {listing.content ? (
                          <ul className="list-disc pl-6">
                            {listing.content.map((con: any) => (
                              <li key={con.key}>
                                {con.key}: {con.value}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
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
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      )
      }
    </div >
  );
};

export default ListingDetailPage;