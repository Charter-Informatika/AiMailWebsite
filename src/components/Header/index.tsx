"use client";

import GlobalSearchModal from "@/components/GlobalSearch";
import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";
import { Menu } from "@/types/menu";
import { onScroll } from "@/utils/scrollActive";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuData: Menu[] = [
  {
    label: "Funkciók",
    route: "/#features",
  },
  {
    label: "Útmutató",
    route: "/#work-process",
  },
  {
    label: "Letöltés",
    route: "/#pricing",
  },
  {
    label: "Képek",
    route: "/#screens",
  }
];

const Header = () => {
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { data: session } = useSession();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const [sticky, setSticky] = useState(false);

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);

  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const closeMenu = () => {
    setNavbarOpen(false);
  };

  return (
    <>
      <header
        className={`navbar border-stroke dark:border-stroke-dark top-0 left-0 z-50 w-full ${
          sticky
            ? "fixed border-b bg-white/95 backdrop-blur-xs dark:bg-black/95"
            : "absolute"
  } font-pixellari`}
      >
        <div className="relative container max-w-[1400px] font">
          <div className="flex items-center justify-between">
            <div className="block py-4 lg:py-0">
              <Link href="/">
                <Image
                  width={216}
                  height={43}
                  src={"/images/logo/Headerlogo_light.png"}
                  alt="Logo"
                  priority
                  className="block dark:hidden"
              
                />
                <Image
                  width={216}
                  height={43}
                  src={"/images/logo/Headerlogo.png"}
                  alt="Logo"
                  priority
                  className="hidden dark:block"
                 
                />
              </Link>
            </div>

            <button
              onClick={navbarToggleHandler}
              className="navbarOpen absolute top-1/2 right-4 z-50 flex h-10 w-10 -translate-y-1/2 flex-col items-center justify-center space-y-[6px] font-bold lg:hidden"
              aria-label="navbarOpen"
              name="navbarOpen"
            >
              <span className="block h-[2px] w-7 bg-black dark:bg-white"></span>
              <span className="block h-[2px] w-7 bg-black dark:bg-white"></span>
              <span className="block h-[2px] w-7 bg-black dark:bg-white"></span>
            </button>

            <div
              className={`${navbarOpen ? "" : "hidden"} menu-wrapper relative justify-between lg:flex`}
            >
              <button
                onClick={() => setNavbarOpen(false)}
                className="navbarClose fixed top-10 right-10 z-9999 flex h-10 w-10 flex-col items-center justify-center font-bold lg:hidden"
                name="navbarClose"
                aria-label="navbarClose"
              >
                <span className="block h-[2px] w-7 rotate-45 bg-black dark:bg-white"></span>
                <span className="-mt-[2px] block h-[2px] w-7 -rotate-45 bg-black dark:bg-white"></span>
              </button>

              <nav className="lg:backdrop-blur-0 fixed top-0 left-0 z-999 flex h-screen w-full items-center justify-center bg-white/95 text-center backdrop-blur-xs lg:static lg:h-auto lg:w-max lg:bg-transparent lg:backdrop-blur-none dark:bg-black/95 lg:dark:bg-transparent">
                <ul className="items-center space-y-3 lg:flex lg:space-y-0 lg:space-x-8 xl:space-x-10">
                  {menuData.map((item, index) =>
                    item.children ? (
                      <li
                        key={index}
                        className="submenu-item menu-item group relative"
                      >
                        <Link
                          onClick={() => handleSubmenu(index)}
                          href={item.route}
                          className={`${sticky ? "lg:py-[21px]" : "lg:py-7"} submenu-taggler hover:text-primary group-hover:text-primary dark:hover:text-primary inline-flex items-center text-base font-medium text-black dark:text-white`}
                        >
                          {item.label}
                          <span className="pl-3">
                            <svg
                              width="14"
                              height="8"
                              viewBox="0 0 14 8"
                              className={`fill-current ${openIndex === index ? "rotate-180 lg:rotate-0" : ""}`}
                            >
                              <path d="M6.54564 5.09128L11.6369 0L13.0913 1.45436L6.54564 8L0 1.45436L1.45436 0L6.54564 5.09128Z" />
                            </svg>
                          </span>
                        </Link>

                        <ul
                          className={`${openIndex === index ? "" : "hidden"} submenu lg:shadow-card lg:dark:shadow-card-dark space-y-5 pt-5 duration-300 lg:invisible lg:absolute lg:top-[120%] lg:block lg:w-[250px] lg:rounded-lg lg:bg-white lg:px-8 lg:pb-5 lg:text-left lg:opacity-0 lg:group-hover:visible lg:group-hover:top-full lg:group-hover:opacity-100 dark:lg:border-transparent dark:lg:bg-[#15182A]`}
                        >
                          {item.children.map((childItem, childIndex) => (
                            <li key={childIndex}>
                              <Link
                                href={childItem.route}
                                onClick={closeMenu}
                                className="font-heading hover:text-primary dark:hover:text-primary inline-flex items-center justify-center text-center text-base text-black dark:text-white"
                              >
                                {childItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={index} className="menu-item">
                        <Link
                          href={item.route}
                          onClick={closeMenu}
                          className={`${sticky ? "lg:py-[21px]" : "lg:py-7"} ud-menu-scroll hover:text-primary dark:hover:text-primary inline-flex items-center text-base font-medium text-black dark:text-white`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>

            <div className="mr-[60px] flex items-center justify-end lg:mr-0">
              {/*<button
                onClick={() => setSearchModalOpen(true)}
                className="mr-4 hidden h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-black sm:flex dark:bg-black dark:text-white"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 18 18"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_369_1884)">
                    <path
                      d="M16.9347 15.3963L12.4816 11.7799C14.3168 9.26991 14.1279 5.68042 11.8338 3.41337C10.6194 2.19889 9.00003 1.52417 7.27276 1.52417C5.54549 1.52417 3.92617 2.19889 2.71168 3.41337C0.201738 5.92332 0.201738 10.0256 2.71168 12.5355C3.92617 13.75 5.54549 14.4247 7.27276 14.4247C8.91907 14.4247 10.4574 13.804 11.6719 12.6975L16.179 16.3409C16.287 16.4219 16.4219 16.4759 16.5569 16.4759C16.7458 16.4759 16.9077 16.3949 17.0157 16.26C17.2316 15.9901 17.2046 15.6122 16.9347 15.3963ZM7.27276 13.2102C5.86935 13.2102 4.5739 12.6705 3.57532 11.6719C1.52418 9.62076 1.52418 6.30116 3.57532 4.27701C4.5739 3.27843 5.86935 2.73866 7.27276 2.73866C8.67617 2.73866 9.97162 3.27843 10.9702 4.27701C13.0213 6.32815 13.0213 9.64775 10.9702 11.6719C9.99861 12.6705 8.67617 13.2102 7.27276 13.2102Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_369_1884">
                      <rect
                        width="17.2727"
                        height="17.2727"
                        fill="white"
                        transform="translate(0.363647 0.363647)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>*/}

              <DarkModeSwitcher />

              {session ? (
                <div className="hidden items-center sm:flex">
                  <p className="mx-3 text-black dark:text-white">
                    {session?.user?.name}
                  </p>

                  <button
                    onClick={() => signOut()}
                    className="bg-primary hover:bg-primary/90 rounded-md px-[30px] py-[10px] text-base font-medium text-white"
                  >
                    Kijelentkezés
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="hover:text-primary dark:hover:text-primary hidden px-6 py-[10px] text-base font-medium text-black sm:inline-block dark:text-white"
                  >
                    Bejelentkezés
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 hidden rounded-md px-[30px] py-[10px] text-base font-medium text-white sm:inline-block"
                  >
                    Regisztráció
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <GlobalSearchModal
        searchModalOpen={searchModalOpen}
        setSearchModalOpen={setSearchModalOpen}
      />
    </>
  );
};

export default Header;
