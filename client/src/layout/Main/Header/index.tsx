import { LazyLoadImage } from "react-lazy-load-image-component";
import { IMAGES } from "@/constants";
import HeaderMenu from "@/components/HeaderMenu";

const MainHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
    <div className="flex justify-between items-center min-sm:py-4 py-2.5 bg-white min-sm:px-10 px-5">
      <a href="/">
        <LazyLoadImage
          alt="logo"
          src={IMAGES.LOGO_BIG}
          className="min-xl:h-[50px] min-lg:h-[50px] min-md:h-[50px] h-[35px]"
        />
      </a>
      <HeaderMenu />
    </div>
    </header>
  );
};

export default MainHeader;
