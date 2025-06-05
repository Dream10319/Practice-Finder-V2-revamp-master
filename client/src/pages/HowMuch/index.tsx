import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HowMuch = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const articleRefs: any = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef = useRef<any>(null);
  const location = useLocation();
  const { index } = location.state || {};

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 3; // Adjust for middle of viewport

    // Check each article's position
    articleRefs.current.forEach((ref: any, index: number) => {
      if (ref) {
        const { top, bottom } = ref.getBoundingClientRect();
        if (top <= scrollPosition && bottom >= scrollPosition) {
          setActiveIndex(index);
        }
      }
    });

    if (tableRef.current) {
      tableRef.current.style.top = `${
        window.scrollY < 150 ? 150 - window.scrollY : 0
      }px`; // Update the top style
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    if (index) {
      navigateToArticle(index);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigateToArticle = (index: number) => {
    if (articleRefs.current[index]) {
      articleRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto flex gap-10 mt-10 max-[1044px]:px-2.5">
      <div className="text-[#06202D] right-panel">
        <div className="text-[40px] font-extrabold max-[768px]:text-2xl">
          HOW MUCH DO DENTAL OFFICES SELL FOR?
        </div>
        <div className="mt-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
          leo vel eros laoreet vehicula. Nam tincidunt nec mauris ac viverra.
          Integer sit amet nibh dapibus, semper orci cursus, rutrum eros. Nulla
          tincidunt ornare mi, nec dictum dolor interdum in. Duis ullamcorper
          imperdiet augue at dictum. Sed molestie libero convallis, pretium erat
          vitae, mollis eros. Cras vel massa vel neque dignissim pellentesque.
          In quis lectus sed elit cursus rutrum. Nulla scelerisque sit amet dui
          quis molestie. Integer lobortis, lacus sed faucibus tincidunt, felis
          nulla ornare arcu, ac maximus tortor sapien eu risus. Fusce hendrerit
          nulla lectus, at vehicula augue scelerisque eget. Sed condimentum,
          orci ut venenatis auctor, ante sem tincidunt turpis, sed molestie urna
          massa id tellus. Phasellus ac suscipit urna, sed viverra tellus. Nam
          sed turpis maximus, maximus lectus sed, maximus urna. <br />
          Integer enim orci, aliquam eu elit non, blandit blandit tortor. In
          consectetur viverra erat, et ultrices nisi vulputate ac. Integer sit
          amet efficitur massa. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Phasellus vehicula
          rhoncus felis, eu malesuada eros vestibulum in. Praesent posuere massa
          tellus, eu tincidunt nunc maximus placerat. Maecenas tincidunt sem
          eget ultrices vulputate. Suspendisse a ornare dolor. Vestibulum
          malesuada risus quis eros tincidunt imperdiet. Integer sit amet est
          vestibulum, elementum magna quis, rhoncus mi. Nunc euismod, metus vel
          accumsan dictum, velit purus feugiat diam, id vulputate mi nisi at
          nisl. Nullam eu odio eros. <br />
          Phasellus vitae nunc lobortis, fermentum leo nec, faucibus dui.
          Praesent felis libero, maximus ut nisl semper, consectetur rhoncus
          ipsum. Vivamus ut purus purus. Phasellus sit amet dictum ex, id
          faucibus dolor. Suspendisse ullamcorper mauris ac bibendum semper.
          Nulla facilisi. Etiam vel aliquet sapien. Quisque blandit sit amet
          ligula in porttitor. Quisque turpis erat, mattis at orci sit amet.
        </div>
        <div
          ref={(el) => {
            if (el) articleRefs.current[0] = el;
          }}
        >
          <div className="mt-8 text-[#465860] text-[36px] leading-[36px] max-[768px]:text-2xl font-extrabold">
            Getting Financed to Buy a Dental Practice
          </div>
          <div className="mt-6">
            When financing a dental practice purchase, prospective buyers should
            first assess their financial health. First start by understanding
            your credit score, cash flow, and existing debts and how this may
            affect the banks decision in lending you money. Before applying for
            a loan, it's essential to prepare a detailed business plan. By
            planning and displaying a solid track record in dental practice
            production or experience. When seeking out a banker, find one with
            experience in healthcare financing and a proven track record working
            with dental practices. Look for transparent terms, competitive
            rates, and a commitment to understanding your unique needs. Network
            with colleagues and read reviews to help identify someone you feel
            comfortable dealing with who’s giving you good counsel. Consulting
            with financial advisors or industry-specific consultants can also
            provide valuable insights into selecting the right financial partner
            for your dental practice acquisition.
          </div>
          <br />
          <div>
            To prepare for taking on such a large loan, buyers should begin by
            thoroughly reviewing their personal as well as the future business’
            finances. This includes gathering financial statements, tax returns,
            and a comprehensive business plan highlighting projected income,
            expenses, and growth strategies for the practice. It's crucial to
            have a clear understanding of the practice's valuation and to
            perform due diligence by analyzing the practice's financial history,
            patient demographics, and market position. Build a strong credit
            profile and reduce existing debts. This will enhance loan approval
            options much more favorable to your advantage. Consulting with a
            dental practice consultant or buyer’s representative specializing in
            dental practice acquisitions can provide guidance on structuring the
            loan. They can also help you prepare that detailed plan showcasing
            your ability to manage and grow the practice and will instill
            confidence in potential lenders.
          </div>
        </div>
        <div
          ref={(el) => {
            if (el) articleRefs.current[1] = el;
          }}
        >
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            Buying a Practice For Sale By Owner (FSBO)
          </div>
          <div className="mt-6">
            When you look for a practice to buy, you will often come across one
            where the owner wants to sell their practice independently from a
            practice brokerage. This is usually because the seller is trying to
            avoid paying the broker fees or wants more control over the sale.
            There are some advantages to this as a buyer and some disadvantages
            as well.
          </div>
          <br />
          <div>
            As a buyer you can directly talk and discuss with the seller
            “negotiating” one-to-one, without any 3rd party intermediary. This
            allows for a more personal relationship. But don’t get too excited
            about that, because in doing so you might need to approach the
            seller with a more delicate touch. With the owner being directly
            involved they will want to make sure that certain things are in the
            agreements, that may otherwise not be industry standard. Also, the
            owner is probably going to rely heavily on their lawyer in the
            negotiating process. The seller’s lawyer may or may not be privy to
            all aspects of selling or running a dental practice. If either party
            lacks the ability to understand the nuances and challenges that come
            with a dental practice transition, misunderstandings and poor
            negotiations can cause this kind of deal to erupt. The buyer will be
            assuming a large amount of debt along with all the risks or
            liabilities currently associate with the practice. Many times the
            seller may not want to be forthright and acknowledge those issues.
          </div>
          <br />
          <div>
            Even when you have your own legal representation, as we mentioned
            earlier, having a lawyer that’s not familiar with dentistry as a
            business will usually cause problems or confusion in a deal. If
            you’re considering purchasing a dental practice for sale by owner
            (FSBO), it's wise to hire a lawyer with experience in practice
            transitions to assist with negotiations. Or as mentioned before a
            good buyer’s representative will understand all the risks and value
            of a dental practice for sale.
          </div>
        </div>
        <div className="my-8 text-[40px] leading-[40px] font-extrabold max-[768px]:text-2xl">
          Next article: <br />
          <span
            className="text-[#32C46D] cursor-pointer"
            onClick={() => {
              navigate("/how-to-buy");
            }}
          >
            HOW TO BUY A DENTAL PRACTICE
          </span>
        </div>
      </div>
      <div className="max-[768px]:hidden fixed top-[150px] right-0 w-[350px] bg-white p-1 rounded-2xl mr-2" ref={tableRef}>
        <div className="text-center text-[#15BC58] text-[30px] font-normal">
          Table of Contents
        </div>
        <div
          className="rounded-[20px] p-4 text-[#465860] flex flex-col gap-4"
          style={{ backgroundColor: "rgba(143, 143, 143, 0.2)" }}
        >
          <h1 className="text-primary text-2xl font-extrabold">How Much Do Dental Offices Sell For</h1>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 0 ? "bolder" : "normal" }}
            onClick={() => navigateToArticle(0)}
          >
            ▪ Getting Financed to Buy a Dental Practice
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 1 ? "bolder" : "normal" }}
            onClick={() => navigateToArticle(1)}
          >
            ▪ Buying a Practice For Sale By Owner (FSBO)
          </div>
        </div>
        <div className="mt-8">
          <div className="text-[#06202D] text-[30px] font-bold">
            Other articles:
          </div>
          <div
            className="text-[#32C46D] text-[30px] font-semibold cursor-pointer"
            onClick={() => navigate("/how-to-buy")}
          >
            HOW TO BUY A DENTAL PRACTICE
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-to-buy", { state: { index: 0 } })}
          >
            Finding the Right Dental Office For Sale
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-to-buy", { state: { index: 1 } })}
          >
            The Dental Practice Valuation
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 leading-[20px] cursor-pointer"
            onClick={() => navigate("/how-to-buy", { state: { index: 2 } })}
          >
            Build a Team of Trusted Advisors When Buying a Dental Practice
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-to-buy", { state: { index: 3 } })}
          >
            Hiring a Buyer’s Representative
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowMuch;
