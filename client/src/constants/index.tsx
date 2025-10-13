import Logo from "@/assets/img/logo.png";
import LogoBig from "@/assets/img/logo-big.png";
import LogoBitWhite from "@/assets/img/logo-big-white.png";
import LogoWhite from "@/assets/img/logo-white.png";
import Map from "@/assets/img/map.png";
import Search from "@/assets/img/search.png";
import Location from "@/assets/img/location.png";
import Connect from "@/assets/img/connect.png";
import Chat from "@/assets/img/chat.png";
import AuthBg from "@/assets/img/auth-bg.png";
import Google from "@/assets/img/google.png";
import Check from "@/assets/img/checklist.png";
import Secure from "@/assets/img/secure.png";
import Badge from "@/assets/img/badge.png";
import Query from "@/assets/img/query.png";
import Location1 from "@/assets/img/location1.png";
import SmallMap from "@/assets/img/small-map.png";
import Thumb from "@/assets/img/thumb.svg";
import ThumbFill from "@/assets/img/thunb-filled.svg";
import StateIcon from "@/assets/img/state-icons.svg";
import CityIcon from "@/assets/img/city-icon.svg";
import GrossIcon from "@/assets/img/revenue_icon.svg";
import TypeIcon from "@/assets/img/practice_type.svg";
import OperatoryIcon from "@/assets/img/operatory-icon.svg";
// import descriptionIcon from "@/assets/img/description.svg";
import BackImg from "@/assets/img/back.svg";
import BackImgHover from "@/assets/img/back-hover.svg";
import Menu from "@/assets/img/menu_icon.svg"
import Dashboard from "@/assets/img/dashboard_icon.svg"
import Listings from "@/assets/img/listings_icon.svg"
import Logout from "@/assets/img/logout_icon.svg"
import ArrowDown from "@/assets/img/arrow-down.gif"
import Hero1 from "@/assets/img/hero1.jpg"
import Hero2 from "@/assets/img/hero2.jpg"

import { IMenuItem } from "@/types";

export const ACCESS_TOKEN = "practice-finder-access-token";

export const IMAGES = {
  LOGO: Logo,
  LOGO_BIG: LogoBig,
  LOGO_BIG_WHITE: LogoBitWhite,
  MAP: Map,
  SEARCH: Search,
  LOCATION: Location,
  LOCATION1: Location1,
  CHAT: Chat,
  AUTH_BG: AuthBg,
  LOGO_WHITE: LogoWhite,
  GOOGLE: Google,
  CHECK: Check,
  SECURE: Secure,
  BADGE: Badge,
  QUERY: Query,
  THUMB: Thumb,
  THUMB_FILL: ThumbFill,
  STATE_ICON: CityIcon,
  CITY_ICON: StateIcon,
  GROSS_ICON: GrossIcon,
  TYPE_ICON: TypeIcon,
  OP_ICON: OperatoryIcon,
  BACK: BackImg,
  BACK_HOVER: BackImgHover,
  MENU: Menu,
  DASHBOARD: Dashboard,
  LISTINGS: Listings,
  LOGOUT: Logout,
  CONNECT: Connect,
  SMALLMAP: SmallMap,
  ARROWDOWN: ArrowDown,
  HERO1: Hero1,
  HERO2: Hero2,
};

export const HOME_YOUTUBE_LINK = "https://youtu.be/G0hHc8rwgTw";

export const HEADER_MENU_ITEMS: Array<IMenuItem> = [
  {
    key: "",
    label: "Home",
  },
  {
    key: "practices-for-sale",
    label: "Practices for Sale",
  },
  {
    key: "how-to-buy",
    label: "How to Buy a Practice",
  },
  {
    key: "about-us",
    label: "About Us",
  },
  {
    key: "signin",
    label: "Sign In",
  },
];

export const FOOTER_MENU_ITEMS: Array<IMenuItem> = [
  {
    key: "",
    label: "Home",
  },
  {
    key: "contact-us",
    label: "Contact Us",
  },
  {
    key: "signup",
    label: "Sign Up",
  },
  {
    key: "practices-for-sale",
    label: "Practices for Sale",
  },
  {
    key: "about-us",
    label: "About Us",
  },
  {
    key: "signin",
    label: "Sign In",
  },
];

export const HOME_TAKE_CHARGES = [
  {
    title: "Easy Access",
    text: "You have access to the entire list.  All you have to do is search for the dental practices in the area you’re interested in.",
  },
  {
    title: "Up-to-Date",
    text: "The Practice Finder stays updated with every listing.  Weekly updates are made to ensure that the latest listing are added for deleted. ",
  },
  {
    title: "Keep Track",
    text: "More than just a listing. It’s a tool to track all the listings you are interested in. Review the listings you like again and again. Always all in one place. ",
  },
  {
    title: "Save Time",
    text: "Instead of scouring the internet, site after site, writing down site’s names or brokerage names. Just log in and start looking.",
  },
];

export const TARGET_NUMBER = {
  PRACTICE: 3000,
  DENTIST: 300,
  OWNER: 90,
};
