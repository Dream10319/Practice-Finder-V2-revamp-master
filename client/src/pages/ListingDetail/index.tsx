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

  // CORRECTION: Utility component for standard, one-line-on-mobile detail row.
  // The label and value are now grouped in a flex container on mobile to ensure one line.
  const DetailRow = ({ icon, label, value }: { icon: string, label: string, value: any }) => (
    // Mobile: Icon (20px) | Label and Value in a single flex column (1fr).
    // Desktop: Your original 4-column structure.
    <div className="grid grid-cols-[20px_1fr] md:grid-cols-[20px_12px_180px_1fr] items-center gap-1 border-b border-b-[#8F8F8F] py-2">
      <img src={icon} alt={label} className="w-5 h-5" />
      <div className="hidden md:block" />
      
      {/* Mobile view uses flex to keep key/value on one line */}
      <div className="flex justify-between w-full md:contents"> 
        <span className="whitespace-nowrap font-semibold md:col-span-1">
          {label}:
        </span>
        <span className="font-bold text-right md:text-left truncate md:col-span-1">
          {value}
        </span>
      </div>
    </div>
  );
  
  // Description field: Content wraps to a new line on mobile.
  const DescriptionRow = ({ icon, label, details, content }: { icon: string, label: string, details: any, content: any }) => (
    // Mobile: Icon (20px) | Label (1fr) in the first row. Content starts on a new line.
    <div className="grid grid-cols-[20px_1fr] md:grid-cols-[20px_12px_180px_1fr] gap-1 border-b border-b-[#8F8F8F] py-2">
      <img src={icon} alt={label} className="w-5 h-5 mt-1" />
      <div className="hidden md:block" />
      <span className="whitespace-nowrap mt-1 font-semibold col-span-1 md:col-span-1">
        {label}:
      </span>
      {/* This element is forced to span the full width on mobile (col-span-full) */}
      <div className="col-span-full md:col-span-1 md:text-left mt-1 md:mt-0">
        <div className="font-bold">{details}</div>
        {content ? (
          <ul className="list-disc pl-6 text-base mt-1">
            {content.map((con: any) => (
              <li key={con.key}>
                {con.key}: {con.value}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );

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
                  alt="Back Arrow"
                  className="w-20 h-full"
                  aria-hidden="true"
                />
              </button>
              <div className="rounded-xl border border-[#8F8F8F] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-10 px-3 py-3 bg-[#F5F5F5] text-lg md:text-xl">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-10">
                    <span className="whitespace-nowrap">ID {listing.id}</span>
                    <span className="font-bold">{listing.name}</span>
                  </div>
                  <div className="text-base md:text-xl">
                    {likeListings.some((l: any) => l._id === id) ? (
                      <img
                        src={IMAGES.THUMB_FILL}
                        alt="liked"
                        className="cursor-pointer w-[25px]"
                      />
                    ) : (
                      <div className="flex gap-2 items-center cursor-pointer" onClick={() => listing?._id && LikeListing(listing._id)}>
                        Like Listing
                        <img
                          src={IMAGES.THUMB}
                          alt="like"
                          className="w-[25px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white text-base md:text-lg">
                  <div className="px-5">
                    {/* State */}
                    <DetailRow
                      icon={IMAGES.STATE_ICON}
                      label="State"
                      value={listing.state}
                    />

                    {/* City */}
                    <DetailRow
                      icon={IMAGES.CITY_ICON}
                      label="City"
                      value={listing.city}
                    />

                    {/* Gross Collections */}
                    <DetailRow
                      icon={IMAGES.GROSS_ICON}
                      label="Gross Collections"
                      value={listing.annual_collections}
                    />

                    {/* Practice Type */}
                    <DetailRow
                      icon={IMAGES.TYPE_ICON}
                      label="Practice Type"
                      value={listing.type}
                    />

                    {/* Operatories */}
                    <DetailRow
                      icon={IMAGES.OP_ICON}
                      label="Operatories"
                      value={listing.operatory}
                    />

                    {/* Description - Content will wrap to a new line on mobile */}
                    <DescriptionRow
                      icon={IMAGES.TYPE_ICON}
                      label="Description"
                      details={listing.details}
                      content={listing.content}
                    />
                  </div>

                  {authUser && authUser.role === "ADMIN" ? (
                    <div className="border-b border-b-[#8F8F8F] px-5 py-2">
                      <div className="font-extrabold mb-2">Admin Content</div>
                      {listing.admin_content ? (
                        <>
                          <ul className="list-none px-5 text-base md:text-lg">
                            {listing.admin_content.map((con: any) => (
                              <li key={con.key} className="mb-1">
                                {con.key}: <strong>{con.value}</strong>
                              </li>
                            ))}
                          </ul>
                          <hr className="mx-0 md:mx-5 my-2" />
                        </>
                      ) : null}
                      <div className="flex flex-col md:flex-row gap-1 md:gap-5 px-0 md:px-5 mb-1 text-base md:text-lg">
                        Origin: <strong>{listing.origin}</strong>
                      </div>
                      <hr className="mx-0 md:mx-5 my-2" />
                      <div className="flex flex-col md:flex-row gap-1 md:gap-5 px-0 md:px-5 text-base md:text-lg">
                        Source Link: <strong className="break-words">{listing.source_link}</strong>
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
      )}
    </div >
  );
};

export default ListingDetailPage;