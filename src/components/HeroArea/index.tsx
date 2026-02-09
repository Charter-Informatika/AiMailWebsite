"use client";

import FsLightbox from "fslightbox-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const HeroArea = () => {
  const [toggler, setToggler] = useState(false);

  return (
    <>
      <section id="home" className="pt-[165px] font-pixellari">
        <div className="container lg:max-w-[1305px] lg:px-10">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-6/12">
              <div
                className="wow fadeInUp mb-12 lg:mb-0 lg:max-w-[570px]"
                data-wow-delay=".3s"
              >
                <span className="mb-5 block text-lg leading-tight font-medium text-black sm:text-[22px] xl:text-[22px] dark:text-white">
                  Ai vezérelt, Automata levelezés
                </span>
                <h1 className="mb-6 text-3xl leading-tight font-bold text-black sm:text-[40px] md:text-[50px] lg:text-[42px] xl:text-[50px] dark:text-white">
                  <span className="bg-gradient-2 bg-clip-text text-transparent">
                  Okos Mail{" "}
                  </span>
                  - Az AI által vezérelt automata levelező rendszer
                </h1>
                <p className="text-body mb-10 max-w-[475px] text-base leading-relaxed">
                  Töltsd le most, és próbáld ki INGYEN a legújabb verziót!
                </p>

                <div className="flex flex-wrap items-center">
                  <Link
                    href="#pricing"
                    className="mr-6 mb-6 inline-flex h-[60px] items-center rounded-lg bg-black px-[30px] py-[14px] text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    <span>
                      Letöltés
                    </span>
                  </Link>

                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-6/12">
              <div
                className="wow fadeInUp relative z-10 mx-auto w-full max-w-[790px]"
                data-wow-delay=".3s"
              >
                <Image
                  width={990}
                  height={546}
                  src={"/images/hero/dashboard.png"}
                  alt="hero image"
                  className="block dark:hidden"
            
                />
                <Image
                  width={990}
                  height={546}
                  src={"/images/hero/dashboard.png"}
                  alt="hero image"
                  className="hidden dark:block"
                  style={{ width: "auto", height: "auto" }}
                />
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroArea;
