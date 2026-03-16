"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Price } from "@/types/priceItem";

import { pricingData } from "../../stripe/pricingData";
import { PricingItem } from "./PricingItem";
import toast from "react-hot-toast";

const Pricing = () => {
  const [planType, setPlanType] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <section id="pricing" className="relative z-10 pt-[110px] font-pixellari">
        <div className="container">
          <div
            className="wow fadeInUp mx-auto mb-10 max-w-[690px] text-center"
            data-wow-delay=".2s"
          >
            <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[44px] md:leading-tight">
              Válassz csomagot
            </h2>
            <p className="text-base text-body">
              Válaszd ki a számodra, vagy a vállalkozásod számára legmegfelelőbb
              csomagot! Bármikor válthatsz, nincs hűségidő!
            </p>
          </div>
        </div>

        <div className="container max-w-[1120px] overflow-hidden">
          <div
            className="wow fadeInUp mb-[60px] flex items-center justify-center"
            data-wow-delay=".25s"
          >
            <label htmlFor="togglePlan" className="inline-flex items-center">
              <input
                type="checkbox"
                name="togglePlan"
                id="togglePlan"
                className="sr-only"
                onClick={() => setPlanType(!planType)}
              />
              <span className="monthly text-sm font-medium text-black dark:text-white">
                Havi
              </span>
              <span className="mx-5 flex h-[34px] w-[60px] cursor-pointer items-center rounded-full bg-primary p-[3px]">
                <span
                  className={`${planType && "translate-x-[26px]"} block h-7 w-7 rounded-full bg-white duration-300`}
                ></span>
              </span>
              <span className="yearly text-sm font-medium text-black dark:text-white">
                  Éves
              </span>
            </label>
          </div>

          <div className="-mx-6 flex flex-wrap justify-center items-stretch">
            {/* Ingyenes csomag */}
            <PricingItem
              price={{
                id: pricingData[0].id,
                unit_amount: pricingData[0].unit_amount,
                nickname: pricingData[0].nickname,
                description: "Kezdő csomag, alap funkciókkal.",
                features: [
                  "100 db AI által generált üzenet",
                  "1 db email cím",
                  "90 napos próbaidőszak",
                  "Korlátozott adatbázis",
                  "Távsegítség"
                ]
              }}
              planType={planType}
              buttonLabel="Kipróbálom"
              buttonClass="bg-black px-[30px] py-[14px] text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              onButtonClick={async () => {
                if (session) {
                  if (session.user?.trialEnded === false || session.user?.trialEnded === undefined) {
                    // 1. Letöltés
                    const link = document.createElement('a');
                    link.href = '/api/download'; 
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // 2. Licence email küldése
                    try {
                      const res = await fetch('/api/send-licence', { method: 'POST' });
                      if (res.ok) {
                        toast.success('A licence kódot elküldtük az email címedre!');
                      } else {
                        toast.error('Nem sikerült elküldeni a licence kódot.');
                      }
                    } catch {
                      toast.error('Nem sikerült elküldeni a licence kódot.');
                    }
                  } else {
                    toast.error('A próbaidőszakod már lejárt.');
                  }
                } else {
                  signIn();
                }
              }}
            />
            {/* Korlátlan csomag */}
            <PricingItem
              price={{
                id: pricingData[1].id,
                unit_amount: pricingData[1].unit_amount,
                nickname: pricingData[1].nickname,
                description: "Korlátlan üzenet, extra funkciók.",
                features: [
                  "Korlátlan AI üzenet",
                  "Korlátlan email cím",
                  "Prioritásos távsegítség",
                  "Extra AI testreszabás"
                ]
              }}
              planType={planType}
              buttonLabel="Hamarosan jön"
              buttonClass="bg-primary hover:bg-primary/90 disabled:opacity-50"
              buttonDisabled={true}
              // Alapértelmezett Stripe fizetés (nincs onButtonClick)
            />
            {/* Üzleti csomag */}
            <PricingItem
              price={{
                id: pricingData[2].id,
                unit_amount: pricingData[2].unit_amount,
                nickname: pricingData[2].nickname,
                description: "Üzleti ügyfeleknek.",
                features: [
                  "Üzleti AI üzenet",
                  "Több felhasználó",
                  "Dedikált ügyfélszolgálat",
                  "Egyedi integrációk"
                ]
              }}
              planType={planType}
              buttonLabel="Hamarosan jön"
              buttonClass="bg-primary hover:bg-primary/90 disabled:opacity-50"
              buttonDisabled={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;