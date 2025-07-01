import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HowToBuy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const articleRefs: any = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef = useRef<any>(null);

  const navigateToArticle = (index: number) => {
    if (articleRefs.current[index]) {
      articleRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const stateIndex = location.state?.index;
    if (typeof stateIndex === "number" && articleRefs.current[stateIndex]) {
      // Allow a brief delay to ensure refs are populated
      setTimeout(() => {
        articleRefs.current[stateIndex]?.scrollIntoView({ behavior: "smooth" });
        setActiveIndex(stateIndex);
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="max-w-[1024px] mx-auto flex gap-10 mt-10 max-[1044px]:px-2.5">
      <div className="text-[#06202D] right-panel">
        <div className="text-[40px] font-extrabold max-[768px]:text-2xl">
          HOW TO BUY A DENTAL PRACTICE
        </div>
        <div className="mt-3">
          Purchasing a dental practice is no small feat. Many industry experts
          will tell you it’s not that complicated. Simply follow their lead,
          they’ve done this a million times. This is probably true, there are a
          lot of experts available willing to help dentists through practice
          transitions. The list of professionals includes dental practice
          brokers, attorneys, real estate brokers, CPA’s, buyer’s advocate/
          buyer’s representative, bankers, and consultants.
        </div>
        <br />
        <div>
          It is a transaction that takes place all over the country and on a
          daily basis, but there are some major key factors to consider in order
          to be prepared before jumping in and fully trusting a professional
          without asking questions. This article will help prepare you as you
          begin to have meetings and discuss your career goals with your team of
          partners. Buying a dental practice is probably one of the biggest
          decisions you will make beyond deciding to go to dental school, so get
          informed with this article. Get the guidance and confidence you need
          to move through this process of buying a dental practice!
        </div>
        <div
          ref={(el) => {
            if (el) articleRefs.current[0] = el;
          }}
        >
          <div className="mt-8 text-[#465860] text-[36px] font-extrabold max-[768px]:text-2xl">
            Finding the Right Dental Office For Sale
          </div>
          <div className="mt-6">
            First off, how can you tell the difference between a good practice
            and a bad one? The information given to you by a practice broker
            only summarizes and doesn’t give you the full picture of data that
            you need to make a sound decision. Many factors need to be taken
            into consideration to know if a practice is worth pursuing and
            putting your time and energy into going through this process. This
            guide will give you some perspective on conducting a{" "}
            <span className="text-[#32C46D] underline">
              financial valuation of a dental practice for sale.
            </span>
          </div>
          <br />
          <div>
            But before doing a valuation, it is important to understand the
            surrounding market in which the practice is located. Look at the
            competition in the area, the type of community it’s serving, how
            easy is it to get around in this location from various neighborhoods
            in the area, travel times, and the population density. By working
            with an experienced buyer's representative or practice broker , they
            should be guiding you using a{" "}
            <span className="text-[#32C46D] underline">
              demographics analysis.
            </span>{" "}
            These studies provide valuable insights into the areas you are
            looking to purchase a dental practice.
          </div>
        </div>
        <div
          ref={(el) => {
            if (el) articleRefs.current[1] = el;
          }}
        >
          <div className="mt-8 text-[#465860] text-[36px] font-extrabold max-[768px]:text-2xl">
            The Dental Practice Valuation
          </div>
          <div className="mt-6">
            Before submitting an LOI (letter of intent) or your official request
            to purchase the practice to a practice broker, you need to gather as
            much information from the broker as possible. This generally
            involves signing a confidentiality agreement. Dental practice
            brokers can't possibly publish all the data and information on a
            website for everyone to read. So you must request that information
            in order to evaluate the dental practice for sale.
          </div>
          <br />
          <div>
            Your first step really is to objectively determine what kind of
            clinical dentistry is being practiced and does it align with your
            goals, vision, or type of dentistry you see yourself doing in this
            location. For example, the current practice owner may not be doing
            periodontal treatment or endodontic procedures, yet you might
            specialize in this area or be developing your skills in order to
            offer these treatments. Consider the pro's and con's of buying this
            practice with all the data available to you.
          </div>
          <br />
          <div>
            Ultimately, when{" "}
            <span className="text-[#32C46D] underline">
              valuing a practice for sale,
            </span>{" "}
            you want a clear picture of value by carefully looking at the cash
            flow and liabilities. You need to observe production and
            collections, with ideally three years of data. If you are unfamiliar
            with what good numbers should look like, talk to someone who has
            seen what successful practices look like or who has evaluated more
            than one. A buyer representative or consultant can give you a very
            clear, understanding of what is good or not so good. You can
            leverage the expertise of a buyer's representative or CPA who has
            seen many practices' financials. A professional with experience will
            help you better understand these critical financial figures.
            Ultimately, you need to find a practice with good cash flow and low
            liabilities in order to support you and the business moving forward.
            Also to secure financing and get favorable conditions on a loan.
            These two things are the biggest factor determining{" "}
            <span className="text-[#32C46D] underline">
              how much it costs to buy a dental practice.
            </span>
          </div>
        </div>
        <div
          ref={(el) => {
            if (el) articleRefs.current[2] = el;
          }}
        >
          <div className="mt-8 text-[#465860] text-[36px] font-extrabold max-[768px]:text-2xl">
            Build a Team of Trusted Advisors When Buying a Dental Practice
          </div>
          <div className="mt-6">
            It’s wise to have outside counsel when making big decisions in your
            life. You also should have people you can trust who are
            knowledgeable giving you the most valuable and accurate information.
            Buying a dental practice is one of the biggest decisions you will
            make in your career. So, having a trusted individuals helping you
            make big decisions is critical to being successful during or after
            the acquisition and transition. Your team may consist of a buyer’s
            representative, a CPA, a lawyer, a banker, and of course a practice
            broker.
          </div>
          <br />
          <div>
            Often, a dentist will begin{" "}
            <span className="text-[#32C46D] underline">
              working with a practice broker
            </span>{" "}
            only to find out that the brokers ultimately are hired by the seller
            who wants to make the most they can on the sale. Your interests (as
            a buyer) might not be fully aligned although they do want the deal
            to go through and be referred down the road for other sales. It’s
            also wise to consider that practice brokers many times are managing
            multiple deals at once. They do not have a lot of time to hold the
            buyers hand through the process. If you aren’t serious about buying
            they probably aren’t going to advise you.
          </div>
          <br />
          <div>
            That being said, work with a reputable buyer's representative to
            advise you and get the support you need. The brokers do not have
            time or the privileges to help you with all these important factors
            leading up to the sale. A buyer’s representative will help negotiate
            the LOI if needed, they will at least know what looks kosher and
            what looks off. The buyer’s rep will also be able to handle the
            valuation and walk you through the analysis of the practice for
            sale. They can point out red flags, and also determine how
            profitable this practice can be for you personally. They will also
            advise you on any demographics studies that you purchase as well.
          </div>
          <br />
          <div>
            A buyers representative can handle a lot of the heavy lifting that
            might require many other professionals individually. For example you
            could hire a dental specific CPA to hep with the valuation and you
            could also hire an attorney to do the LOI review. But all these
            things need done before you can talk to the banker about{" "}
            <span className="text-[#32C46D] underline">
              getting a loan to buy a dental practice.
            </span>{" "}
            Because the banks want to look at the practice’s financial history
            and production as well. Once you are sure you want to move forward
            you submit the LOI. Now you can perform what’s called a due
            diligence process, where you get to look inside the financials more
            closely as well as the practices production and treatment schedules
            inside the actual physical practice itself.
          </div>
        </div>
        <div
          ref={(el) => {
            if (el) articleRefs.current[3] = el;
          }}
        >
          <div
            className="mt-8 text-[#465860] text-[36px] font-extrabold max-[768px]:text-2xl"
            ref={(el) => {
              if (el) articleRefs.current[3] = el;
            }}
          >
            Hiring a Buyer’s Representative
          </div>
          <div>
            What is a buyer's representative? By hiring one you can save you
            quite a lot of time and money when buying a dental practice. A good
            one will be very familiar with entire process of purchasing a dental
            practice. They will have worked through this process many times and
            experience seeing all kinds of deals.
          </div>
          <br />
          <div>
            Not only does a buyer's representatives help consult you getting the
            right practice valuation, but they can often help review and
            negotiate terms on the LOI as well. Buyers representatives are your
            own personal guide and coach in the complex process of a buying a
            dental practice. They have experience from working on hundreds of
            dental practice acquisitions. They can help you avoid common
            pitfalls and challenges that you may not be privy until after the
            purchase, which is too late. They give expert advice that you can
            use to make the best business decisions possible. They are your
            outside source of reason and guidance without any emotional
            attachment to the location, situation, or the transaction. They are
            simply looking out for your best interest as a practice owner.
          </div>
        </div>
        <div className="my-8 text-[40px] leading-[40px] font-extrabold max-[768px]:text-2xl">
          Next article: <br />
          <span
            className="text-[#32C46D] cursor-pointer"
            onClick={() => navigate("/how-much")}
          >
            HOW MUCH DO DENTAL OFFICES SELL FOR?
          </span>
        </div>
      </div>
      <div
        className="max-[768px]:hidden fixed top-[100px] right-0 w-[350px] bg-white p-1 rounded-2xl mr-2"
        ref={tableRef}
      >
        <div className="text-center text-[#15BC58] text-[30px] font-normal">
          Table of Contents
        </div>
        <div
          className="rounded-[20px] p-4 text-[#465860] flex flex-col gap-4"
          style={{ backgroundColor: "rgba(143, 143, 143, 0.2)" }}
        >
          <h1 className="text-primary text-2xl font-extrabold">How To Buy a Practice</h1>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 0 ? "bolder" : "normal" }}
            onClick={() => navigateToArticle(0)}
          >
            ▪ Finding the Right Dental Office
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 1 ? "bolder" : "normal" }}
            onClick={() => navigateToArticle(1)}
          >
            ▪ The Dental Practice Valuation
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 2 ? "bolder" : "normal" }}
            onClick={() => navigateToArticle(2)}
          >
            ▪ Build a Team of Trusted Advisors
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 3 ? "bolder" : "normal" }}
            onClick={() => navigateToArticle(3)}
          >
            ▪ Hiring a Buyer’s Representative
          </div>
        </div>
        <div className="mt-5">
          <div className="text-[#06202D] text-[30px] font-bold">
            Other articles:
          </div>
          <div
            className="text-[#32C46D] text-2xl font-extrabold cursor-pointer"
            onClick={() => navigate("/how-much")}
          >
            HOW MUCH DO DENTAL OFFICES SEEL FOR
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 0 } })}
          >
            Seller's Discretionary Earnings (SDE)
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 1 } })}
          >
            Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA)
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 2 } })}
          >
            Tangible vs. Intangible Assets
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 3 } })}
          >
            Market Location
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 4 } })}
          >
            Patient Base
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 5 } })}
          >
            Overhead and Expenses
          </div>
          <div
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
            onClick={() => navigate("/how-much", { state: { index: 6 } })}
          >
            Working With a Buyers Representative
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBuy;
