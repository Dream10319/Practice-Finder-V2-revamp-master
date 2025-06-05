import { LazyLoadImage } from "react-lazy-load-image-component";
import { IMAGES } from "@/constants";
import HeaderMenu from "@/components/HeaderMenu";

const MainHeader = () => {
  return (
    <div className="flex justify-between items-center min-sm:py-4 py-2.5 bg-white min-sm:px-10 px-5">
      <a href="/">
        <LazyLoadImage
          alt="logo"
          src={IMAGES.LOGO_BIG}
          className="min-xl:h-[90px] min-lg:h-[70px] min-md:h-[50px] h-[35px]"
        />
      </a>
      <HeaderMenu />
    </div>
  );
};

export default MainHeader;
