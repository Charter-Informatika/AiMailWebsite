"use client";
import { integrations, messages } from "@integrations-config";
import axios from "axios";
import toast from "react-hot-toast";

export const PricingItem = ({ price, planType, buttonLabel = "Előfizetek", buttonClass = "", onButtonClick, buttonDisabled = false }: any) => {
  // POST request
  const handleSubscription = async (e: any) => {
    e.preventDefault();
    if (typeof onButtonClick === 'function') {
      onButtonClick(e, price, planType);
      return;
    }
    if (integrations?.isStripeEnabled) {
      const { data } = await axios.post(
        "/api/payment",
        {
          priceId: price.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      window.location.assign(data);
    } else {
      toast.error(messages.stripe);
    }
  };

  return (
    <div className="w-full px-6 md:w-1/2 lg:w-1/3 flex">
      <div className="wow fadeInUp shadow-card dark:bg-dark dark:shadow-card-dark relative mb-10 rounded-xl bg-white px-9 py-10 lg:mb-4 lg:px-7 xl:px-9 flex flex-col h-full min-h-[520px]">
        {price.nickname === "Korlátlan" && (
          <span className="text-primary absolute top-5 right-5 text-sm font-medium underline">
              Legnépszerűbb
          </span>
        )}

        <h3 className="mb-2 text-[22px] leading-tight font-semibold text-black dark:text-white">
          {price.nickname}
        </h3>
        <p className="text-body mb-7 text-base">
          {price.description ? price.description : "Rövid csomagleírás ide jöhet"}
        </p>

        <p className="border-stroke dark:border-stroke-dark border-b pb-5 text-gray-900 dark:text-white">
          <span className="text-[40px] leading-none">
            <sup className="text-[22px] font-medium"> Ft </sup>

            {planType
              ? ((price.unit_amount / 100) * 12).toLocaleString("en-US", {
                  currency: "USD",
                })
              : (price.unit_amount / 100).toLocaleString("en-US", {
                  currency: "USD",
                })}
          </span>
          <span className="text-body text-base">
            {" "}
            / {planType ? "év" : "hó"}{" "}
          </span>
        </p>

        <div className="space-y-4 pt-[30px] pb-10">
          {Array.isArray(price.features)
            ? price.features.map((feature: string, idx: number) => (
                <p className="dark:text-body flex text-base text-black" key={idx}>
                  <span className="mt-1 mr-[10px]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_44_7)">
                        <path
                          d="M6.66674 10.1147L12.7947 3.98599L13.7381 4.92866L6.66674 12L2.42407 7.75733L3.36674 6.81466L6.66674 10.1147Z"
                          fill="#00BE6C"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_44_7">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  {feature}
                </p>
              ))
            : null}
        </div>

        <button
          aria-label="purchase this plan"
          onClick={handleSubscription}
          className={`block w-full rounded-md px-8 py-[10px] text-center text-base font-medium text-white ${buttonClass || (price.nickname === "Unlimited" ? "bg-primary hover:bg-primary/90" : "hover:bg-primary dark:hover:bg-primary bg-black dark:bg-[#2A2E44]")}`}
            disabled={buttonDisabled}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};
