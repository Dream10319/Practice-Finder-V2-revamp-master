import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { apis } from "@/apis"; // <-- This is where 'requestInterest' lives now
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

  const [interestOptions, setInterestOptions] = React.useState({
    lending: false,
    valuation: false,
    broker: false,
    lawyer: false,
  });

  type InterestOptions = {
    lending: boolean;
    valuation: boolean;
    broker: boolean;
    lawyer: boolean;
  };

  const buildChoicesText = (opts: InterestOptions): string[] => {
    const lines: string[] = [];
    if (opts.lending) lines.push("Yes, I want to be connected to Dental Practice Lending options");
    if (opts.valuation) lines.push("Yes, I want to be connected to a Buyer’s Rep for a 3rd Party valuation");
    if (opts.broker) lines.push("Yes, I want to be connected to the Practice Broker holding this listing");
    if (opts.lawyer) lines.push("Yes, I want to be connected to a Dental Lawyer for legal assistance");
    return lines;
  };

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

  const handleInterestChange = (field: keyof typeof interestOptions) => {
    setInterestOptions((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRequest = async () => {
    const chosen = buildChoicesText(interestOptions);
    if (!chosen.length) {
      enqueueSnackbar({ variant: "error", message: "Please select at least one option." });
      return;
    }

    // Compose user info from authUser; fallback to empty strings
    const user = {
      firstName: authUser?.firstName ?? "",
      lastName: authUser?.lastName ?? "",
      email: authUser?.email ?? "",
      phone: authUser?.phone ?? "",
    };

    // Practice info (id is mandatory via useParams, name and url from fetched listing)
    const practice = {
      id: listing?.id ?? id,
      name: listing?.name ?? "Practice",
      // Using window.location.origin for robustness in frontend URL creation
      url: listing?.source_link ?? `${window.location.origin}/listings/${id}`,
    };

    const payload = {
      user,
      practice,
      choices: chosen,
      // optionally include authUser id if available
      userId: authUser?.id ?? null,
    };

    try {
      setLoading(true);
      
      // ----------------------------------------------------------------------
      // NEW: Use the registered apis.requestInterest instead of raw fetch
      // This ensures the Bearer token and base URL are handled correctly.
      const response: any = await apis.requestInterest(payload);

      if (response.status) {
        enqueueSnackbar({ variant: "success", message: "Request submitted — we'll contact you shortly." });
        // Clear the checkboxes on success
        setInterestOptions({ lending: false, valuation: false, broker: false, lawyer: false });
      } else {
        // Since apis.requestInterest is using axios, non-200 status errors
        // should be caught in the catch block (if you follow standard axios practice)
        // but we keep this check for safety against 200/false responses.
        enqueueSnackbar({ variant: "error", message: response?.message ?? "Server error while submitting request." });
      }
      // ----------------------------------------------------------------------
    } catch (err: any) {
      console.error("handleRequest error:", err);
      // Axios error handling: err.response.data.message comes from the interceptor
      enqueueSnackbar({ 
        variant: "error", 
        message: err?.response?.data?.message ?? err.message ?? "Network error" 
      });
    } finally {
      setLoading(false);
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

                  <div className="mt-8 rounded-md py-12 px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Interested in this practice?</h2>
                    <p className="text-2xl text-green-600 font-semibold mb-6">Here is how we can help:</p>

                    <div className="max-w-3xl mx-auto text-left space-y-6">
                      <label className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={interestOptions.lending}
                          onChange={() => handleInterestChange("lending")}
                          className="mt-1"
                          aria-label="Connect to Dental Practice Lending options"
                        />
                        <span className="text-lg md:text-xl">Yes, I want to be connected to **Dental Practice Lending options**</span>
                      </label>

                      <label className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={interestOptions.valuation}
                          onChange={() => handleInterestChange("valuation")}
                          className="mt-1"
                          aria-label="Connect to a Buyer's Rep for valuation"
                        />
                        <span className="text-lg md:text-xl">Yes, I want to be connected to a **Buyer's Rep for a 3rd party valuation**</span>
                      </label>

                      <label className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={interestOptions.broker}
                          onChange={() => handleInterestChange("broker")}
                          className="mt-1"
                          aria-label="Connect to the Practice Broker holding this listing"
                        />
                        <span className="text-lg md:text-xl">Yes, I want to be connected to the **Practice Broker holding this listing**</span>
                      </label>

                      <label className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={interestOptions.lawyer}
                          onChange={() => handleInterestChange("lawyer")}
                          className="mt-1"
                          aria-label="Connect to a Dental Lawyer for legal assistance"
                        />
                        <span className="text-lg md:text-xl">Yes, I want to be connected to a **Dental Lawyer for legal assistance**</span>
                      </label>

                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleRequest}
                          disabled={loading} // Disable button while loading/request is in progress
                          className="px-8 py-3 rounded-full bg-green-500 text-white font-bold shadow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-60 disabled:cursor-not-allowed"
                          aria-label="Request"
                        >
                          {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin text-xl mx-auto" />
                          ) : (
                            "REQUEST"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
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