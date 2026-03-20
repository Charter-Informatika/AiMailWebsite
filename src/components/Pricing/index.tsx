"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Price } from "@/types/priceItem";

import { pricingData } from "../../stripe/pricingData";
import { PricingItem } from "./PricingItem";
import toast from "react-hot-toast";

const Pricing = () => {
  const [planType, setPlanType] = useState(false);
  const [showTrialSuccessModal, setShowTrialSuccessModal] = useState(false);
  const { data: session } = useSession();
  const modalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openTrialSuccessModal = () => {
    setShowTrialSuccessModal(true);

    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }

    modalTimeoutRef.current = setTimeout(() => {
      setShowTrialSuccessModal(false);
    }, 12000);
  };

  const closeTrialSuccessModal = () => {
    setShowTrialSuccessModal(false);

    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

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
                        openTrialSuccessModal();
                        toast.success('A licenc kódot elküldtük az email címedre!', { duration: 6000 });
                      } else {
                        toast.error('Nem sikerült elküldeni a licenc kódot.', { duration: 5000 });
                      }
                    } catch {
                      toast.error('Nem sikerült elküldeni a licenc kódot.', { duration: 5000 });
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

      {showTrialSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Sikeres próbaindítás"
            className="w-full max-w-md rounded-xl border border-white/20 bg-white p-6 shadow-2xl"
          >
            <h3 className="mb-3 text-2xl font-bold text-black">Kész!</h3>
            <p className="mb-2 text-base text-black">
              A licenc kódot elküldtük az email címedre.
            </p>
            <p className="mb-5 text-base text-black">
              A program letöltése elindult. Ha nem indul el automatikusan, frissítsd az oldalt, majd próbáld újra.
            </p>

            <button
              type="button"
              onClick={closeTrialSuccessModal}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Rendben
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;