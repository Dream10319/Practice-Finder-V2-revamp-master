import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HowMuch = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const setArticleRef = (index: number) => (el: HTMLDivElement | null) => {
    articleRefs.current[index] = el;
  };

  // Ref to flag when a programmatic scroll is in progress.
  const isClickScrolling = useRef(false);

  // Effect to set up the Intersection Observer
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // If a click/navigation scroll is happening, ignore observer updates.
      if (isClickScrolling.current) {
        return;
      }
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setActiveIndex(index);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const refs = articleRefs.current;
    refs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      refs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, []);

  // Centralized function to handle scrolling and state updates
  const handleNavigation = (index: number) => {
    if (articleRefs.current[index]) {
      isClickScrolling.current = true;
      setActiveIndex(index);
      articleRefs.current[index]?.scrollIntoView({ behavior: "smooth" });

      // After 1 second, re-enable the observer.
      // This gives the smooth scroll animation time to finish.
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  // Effect to handle scrolling when navigating from another page
  useEffect(() => {
    const stateIndex = location.state?.index;
    if (typeof stateIndex === "number") {
      // Use a short delay to ensure the component has rendered
      setTimeout(() => handleNavigation(stateIndex), 110);
    }
  }, [location.state]);


  return (
    <div className="max-w-[1280px] mx-auto flex gap-10 mt-10 max-[1044px]:px-2.5">
      <div className="text-[#06202D] right-panel">
        <div className="text-[40px] font-extrabold max-[768px]:text-2xl text-center">
          HOW MUCH DO DENTAL OFFICES SELL FOR?
        </div>
        <img
          src="src/assets/img/hero1.jpg"
          alt="Dental office sale"
          className="w-full h-[300px] object-cover rounded-2xl mt-6"
        />
        <div className="mt-3">
          The sale of a dental practice is a significant financial event. When a
          dentist wants to retire and sell their practice, sometimes years of
          dedication to that patient base and community. Sometimes the practice
          just isn’t living up to expectations and the dentist just wants out!
          So what is a dental practice actually worth? The answer, while
          simplified into a nice round number, is a complex interplay of
          financial performance, market dynamics, and intangible assets.
        </div>
        <br />
        <div>
          The common industry understanding is dental practices sell for a
          percentage of their annual revenue. How you agree to a solid “annual
          revenue” number can remain somewhat debatable. This is due to the
          fact that valuations can delve deep, analyzing profitability along
          with a host of other factors in order to paint a complete picture of
          the practice's health and future potential. Working with a buyer
          representative can help docs ensure that they are getting the best
          price for what they are buying in a dental transition/acquisition.
        </div>
        <br />
        <div>
          A crucial element in the preparation and valuation of a dental office
          includes research and practical calculations reviewing the practice’s
          revenue history. To ensure a complete understanding of a practice try
          to secure a three-year period of revenue cycles in order to provide a
          more reliable measure of performance. There is a method to weigh the
          current year's performance more heavily in a valuation if there are
          upward trends.
        </div>
        <br />
        <div>
          A certified and trained buyer representative will use one of two
          methods for calculating earnings and expenses reported by the
          practice.
        </div>
        <div ref={setArticleRef(0)} data-index="0">
          <div className="mt-8 text-[#465860] text-[36px] leading-[36px] max-[768px]:text-2xl font-extrabold">
            Seller's Discretionary Earnings (SDE)
          </div>
          <div className="mt-6">
            SDE is a more nuanced approach, method focuses on the practice's
            true earning potential for a new owner-operator. It starts with
            the net profit and adds back the current owner's salary,
            benefits, and any discretionary expenses that a new owner would
            not necessarily incur. <br />
            These can include personal travel, vehicle expenses, or salaries
            for non-essential family members on the payroll.
          </div>
          <br />
          <div>
            The adjusted SDE is then multiplied by a specific multiple, which
            typically ranges from 2x to 3x. This multiple is influenced by
            factors such as the stability of the earnings, the size of the
            practice, and the perceived risk.
          </div>
        </div>
        <div ref={setArticleRef(1)} data-index="1">
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            Earnings Before Interest, Taxes, Depreciation, and Amortization
            (EBITDA)
          </div>
          <div className="mt-6">
            This method is more common for larger practices and those being
            considered for acquisition by Dental Service Organizations
            (DSOs). EBITDA provides a standardized measure of profitability by
            removing the effects of financing and accounting decisions.
          </div>
          <br />
          <div>
            Similar to the SDE method, a multiple is applied to the EBITDA to
            determine the practice's value. These multiples can vary widely,
            often ranging from 4x to 8x or even higher for large, highly
            efficient practices with significant growth potential. <br />
            The rise of DSOs has, in many markets, driven up EBITDA multiples
            as these larger entities can often leverage economies of scale and
            achieve greater profitability post-acquisition.
          </div>
        </div>
        <div ref={setArticleRef(2)} data-index="2">
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            TANGIBLE vs. INTANGIBLE ASSETS
          </div>
          <div className="mt-6">
            One of the elements influencing the value of a dental practice for
            sale is the contrast between tangible and intangible assets. While
            tangible assets are important, intangible assets actually play a
            more crucial role in determining the practice's value. When
            determining how much a dental office sells for, intangible assets
            include things like:
          </div>
          <br />
          <div>
            ▪ the practice's goodwill <br />
            ▪ patient list and patient loyalty <br />
            ▪ brand and reputation <br />
            ▪ online presence and reviews <br />
            ▪ referral network <br />
            ▪ experienced and loyal staff <br />
            ▪ propriety workflows and systems <br />
          </div>
          <br />
          <div>
            According to a study by Henry Schein, intangible assets account
            for 76% of a dental practice's value, while tangible assets only
            contribute to 24%. <br />
            Therefore, intangible aspects, such as patient relationships,
            client lists, and the practice's reputation, should be heavily
            considered when determining the market value.
          </div>
          <br />
          <div>
            Also considered are these key factors when assessing the value of
            a dental practice that is up for sale:
          </div>
          <br />
          <div>
            <strong>Patient Base</strong>
            <br />
            Active patient count, new patient flow, retention rates, and the
            payer mix are critical metrics. Is the practice growing? Are
            patients leaving? A loyal and stable patient base is a
            significant asset. This shows the goodwill is there! Also, a payer
            mix is also favorable. Practices with a high percentage of
            fee-for-service patients are generally more attractive than ones
            heavily reliant on lower-reimbursing insurance plans.
          </div>
          <br />
          <div>
            <strong>Staff & Operations</strong>
            <br />
            A well-trained, long-tenured staff and efficient operational
            systems can add value to include the cost of doing “business as
            usual.” This could also be a negative when looking at the number
            of patients and procedures per current staff salaries.
          </div>
          <br />
          <div>
            <strong>Equipment & Technology</strong>
            <br />A practice with modern, well-maintained equipment and digital
            technology, such as digital x-rays and intraoral scanners, will
            command a higher price than one with outdated facilities that will
            require immediate investment from the new owner.
          </div>
          <br />
          <div>
            <strong>Service Mix</strong>
            <br />A diverse range of services, especially high-margin
            procedures, boosts profitability and value. The range and type of
            services offered can impact value. Practices that offer a broad
            range of services, including high-margin procedures like implants
            or even cosmetic dentistry, are often more profitable and
            therefore more valuable.
          </div>
          <br />
          <div>
            <strong>Goodwill & Reputation</strong>
            <br />
            This is an intangible asset that represents the practice's
            standing in the community. It could be brand recognition, and
            loyalty from the patient base. Positive online reviews and a
            strong referral network are indicators of strong goodwill.
          </div>
          <br />
          <div>
            <strong>Location & Demographics</strong>
            <br />
            Practices in high-growth areas with favorable patient
            demographics command higher values. Visibility, accessibility, and
            parking are also important considerations.
          </div>
        </div>
        <div ref={setArticleRef(3)} data-index="3">
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            MARKET LOCATION
          </div>
          <div className="mt-6">
            The practice's location plays a significant factor. For example,
            the contrast in value between two identical practices in different
            locations is directly related to supply and demand.
          </div>
          <br />
          <div>
            The number of willing buyers in each geographic region determines
            the value. The saying goes, "It's worth what someone is willing to
            pay for it.” Rural areas and small towns tend to be less appealing
            to new business owners who want to purchase their first
            practices. Therefore, they are frequently valued less. Rural
            locations present several challenges for potential buyers:
            professional isolation, difficulty in recruiting staff, fewer
            social amenities, and limited career opportunities for a spouse.
          </div>
          <br />
          <div>
            Major metropolitan areas and their desirable suburbs attract a
            large number of dentists, especially recent graduates. They offer
            more social opportunities, better schools for their children,
            spousal job opportunities, and a larger patient pool. With dozens
            of potential buyers for every one practice that comes on the
            -           market, a bidding war can often ensue. This intense competition
            naturally drives the valuation multiples (whether SDE or EBITDA)
            and the final sale price higher. Sellers in these markets have
            significant negotiating leverage.
          </div>
        </div>
        <div ref={setArticleRef(4)} data-index="4">
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            PATIENT BASE
          </div>
          <div className="mt-6">
            When considering how much a dental office sells for, a significant
            intangible consideration is the overall patient base. The number
            of active patients that regularly visit the practice directly
            impacts the opportunity for a new buyer. The more patients the
            practice does equate to a greater potential for the dental
            practice’s growth – post transition. Practices with fewer than 600
            active patients are usually valued lower than those with greater
            than 1,000. A practice's effort to attract new patients is an
            important factor to consider; healthy growth is typically between
            20 to 30 new patients monthly. Patient retention is equally
            important, with the ratio of hygiene production to total practice
            production serving as a key indicator as well. Keep in mind a
            lower ratio of hygiene to total production may also present an
            opportunity to reactivate patients, boosting a practice's
            revenue. Increasing the frequency of patients coming into your
            practice will result in growing the practice. Talk to an
            experienced buyer's representative or consultants to help
            determine what clinical advantages or disadvantages give you an
            edge when negotiating an offer on respective practice listings.
          </div>
        </div>
        <div ref={setArticleRef(5)} data-index="5">
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            OVERHEAD AND EXPENSES
          </div>
          <div className="mt-6">
            Naturally, practices with lower overhead and higher profitability
            produce better cash flow. Determine whether or not a practice can
            support a dental practice loan along with the desired annual
            income and lifestyle for that location.
          </div>
          <br />
          <div>
            The team’s wages are a very crucial component in managing a
            practice's overhead. High staff expenses, indicative of
            experience, can negatively impact a dental office's value. On the
            other hand, practices with long-standing, experienced staff
            members often command higher salaries and benefits. While having an
            experienced staff can enhance patient care, practice efficiency,
            and help transfer goodwill, it also increases operational costs.
            High turnover rates also negatively impact overhead costs, as
            recruiting and training new staff can be costly, time-consuming,
            and slow production. Talk to an experienced buyer's representative
            to help with a cost-value analysis to determine a fair market
            value.
          </div>
          <br />
          <div>
            Some solutions that could be the answer to high overhead are
            efficient scheduling, patient management systems, and proficient
            staff training. Things like this can significantly enhance
            productivity and reduce unnecessary costs. It’s important to note
            that the buyer's efforts in “bettering” the office through their
            own blood sweat and tears should translate in the value of the
            practice they are punching. In other words, just because an office
            has a tremendous amount of “upside” does not mean they should over
            pay for a practice. Effectively managing staff costs and
            optimizing overhead is essential for maximizing how much a dental
            office sells for.
          </div>
        </div>
        <div ref={setArticleRef(6)} data-index="6">
          <div className="mt-8 text-[#465860] text-[36px] leading-[40px] max-[768px]:text-2xl font-extrabold">
            WORKING WITH A BUYERS REPRESENTATIVE
          </div>
          <div className="mt-6">
            Navigating the sale of a dental practice requires careful
            consideration and often the help and expertise of an industry
            professional who is knowledgeable and experienced makes a world of
            difference. By addressing these critical factors comprehensively
            and strategically, buyers can begin asking the right questions!
            Working with a professional makes the process smoother and more
            comfortable. You will attain the confidence and understanding you
            need to make smart decisions.
          </div>
          <br />
          <div>
            Working with a dental practice buyer representative has many
            advantages. They can value the practice fairly, they can help you
            negotiate points of contention specific to a practice you are
            interested in. A buyer's representative can ensure you are in
            control and completely informed before making rash decisions. Also
            a good dental consultant can help you develop a transition plan
            that will also greatly increase your chances of being successful
            within the practice you purchase.
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
      <div
        className="max-[768px]:hidden sticky top-[100px] w-[350px] bg-white p-1 rounded-2xl self-start"
        ref={tableRef}
      >
        <div className="text-center text-[#15BC58] text-[30px] font-normal">
          Table of Contents
        </div>
        <div
          className="rounded-[20px] p-4 text-[#465860] flex flex-col gap-4"
          style={{ backgroundColor: "rgba(143, 143, 143, 0.2)" }}
        >
          <h1 className="text-primary text-2xl font-extrabold">
            How Much Do Dental Offices Sell For
          </h1>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 0 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(0)}
          >
            ▪ Seller's Discretionary Earnings (SDE)
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 1 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(1)}
          >
            ▪ Earnings Before Interest, Taxes, Depreciation, and Amortization
            (EBITDA)
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 2 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(2)}
          >
            ▪ Tangible vs. Intangible Assets
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 3 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(3)}
          >
            ▪ Market Location
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 4 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(4)}
          >
            ▪ Patient Base
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 5 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(5)}
          >
            ▪ Overhead and Expenses
          </div>
          <div
            className="cursor-pointer"
            style={{ fontWeight: activeIndex === 6 ? "bolder" : "normal" }}
            onClick={() => handleNavigation(6)}
          >
            ▪ Working With a Buyers Representative
          </div>
        </div>
        <div className="mt-5">
          <div className="text-[#06202D] text-[30px] font-bold">
            Other articles:
          </div>
          <div
            className="text-[#32C46D] text-2xl font-extrabold cursor-pointer"
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
            className="text-[#32C46D] text-[20px] mt-3 cursor-pointer"
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