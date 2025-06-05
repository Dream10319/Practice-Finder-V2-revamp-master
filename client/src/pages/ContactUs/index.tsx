import React from "react";
import { useSnackbar } from "notistack";
import { apis } from "@/apis";
import Input from "@/components/Input";
import { IMAGES } from "@/constants";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ContactUsPage = () => {
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const contactUS = async (event: any) => {
    try {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const name = formData.get("name");
      const message = formData.get("message");
      const response: any = await apis.contactUs({ email, name, message });
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        event.target.reset();
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-primary px-5 min-md:py-10 py-5 text-center">
        <h1 className="min-md:text-5xl text-4xl font-bold text-white">
          Contact Us!
        </h1>
        <h2 className="min-md:text-4xl text-2xl font-semibold text-white mt-2">
          Feel free to reach out if you have any questions.
        </h2>
        <form
          className="flex flex-col max-w-[500px] mx-auto gap-8 mt-15 min-h-[350px] max-md:min-h-[260px] max-md:gap-4 max-md:mt-7"
          onSubmit={contactUS}
        >
          <Input type="text" placeholder="Name" name="name" required />
          <Input type="email" placeholder="Email" name="email" required />
          <textarea
            placeholder="Message"
            required
            name="message"
            className="border border-primary bg-white text-primary placeholder-[#465860] text-xl rounded-lg px-2 py-1 h-[100px] max-md:h-[80px] max-md:text-sm outline-none"
          />
          <button
            type="submit"
            className="px-7 max-md:px-5 py-1 text-white bg-[#FF7575] text-xl rounded-3xl font-bold max-w-[180px] mx-auto cursor-pointer hover:opacity-90 max-md:text-lg w-full disabled:bg-[#AAA] disabled:hover:opacity-100 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <AiOutlineLoading3Quarters className="animate-spin" />
                Loading...
              </div>
            ) : (
              "Contact Us"
            )}
          </button>
        </form>
      </div>
      <div className="text-center px-5 min-md:py-10 py-5 max-w-[1280px] mx-auto">
        <h2 className="text-4xl max-md:text-2xl font-bold min-md:leading-12 text-primary">
          You can chat with a Licenced Buyer Representative once you have found
          the ideal practice for sale.
        </h2>
        <p className="text-3xl max-md:text-lg text-primary min-md:leading-10 mt-5">
          You can connect with a buyers rep to help answer questions get
          feedback and insight. Have an advocate on your side when going into
          the buying process. Sometimes brokers are not available or do not
          provide you with the best advise.
        </p>
        <div className="flex justify-around mt-15 max-md:hidden">
          <div className="flex flex-col gap-5">
            <h1 className="text-5xl font-bold text-primary">Search</h1>
            <img src={IMAGES.SEARCH} alt="search" width={250} />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-5xl font-bold text-primary">Find</h1>
            <img src={IMAGES.LOCATION} alt="search" width={250} />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-5xl font-bold text-primary">Chat</h1>
            <img src={IMAGES.CHAT} alt="search" width={250} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
