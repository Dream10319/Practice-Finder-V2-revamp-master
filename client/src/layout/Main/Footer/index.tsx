import { LazyLoadImage } from "react-lazy-load-image-component";
import { IMAGES, FOOTER_MENU_ITEMS } from "@/constants";
import { IMenuItem } from "@/types";

const MainFooter = () => {
  return (
    <div className="bg-primary min-md:px-25 px-3 min-md:py-10 py-4">
      <div className="flex max-md:flex-col min-md:justify-between items-center max-md:gap-4 gap-8">
        <a href="/">
          <LazyLoadImage
            alt="logo"
            className="min-lg:h-[50px] min-md:h-[50px] h-[40px]"
            src={IMAGES.LOGO_BIG_WHITE}
          />
        </a>

        {/* ✅ Improved spacing & wrapping on mobile */}
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 sm:gap-5 md:gap-7 mt-2 md:mt-0">
          {FOOTER_MENU_ITEMS.map((item: IMenuItem) => (
            <a
              href={`/${item.key}`}
              key={item.key}
              className="min-lg:text-2xl min-md:text-xl text-sm leading-9 text-white hover:text-[#CCC] hover:underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex min-sm:justify-end justify-center min-sm:text-2xl text-sm text-[#465860] min-md:mt-5 mt-3 text-center">
        All rights reserved &#169; Practice MLS {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default MainFooter;