import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const HeaderR = () => {
  const menuData = [
    {
      title: "HOME",
      path: "/",
    },
    {
      title: "LEARN",
      path: "/child",
    },
    {
      title: "RECOGNITION",
      path: "/recognition",
    },
  ];

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
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
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  //paths
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div
          className={`container text-white ${
            sticky ? "bg-black" : "text-white"
          } `}
        >
          <div className="relative -mx-4 flex items-center justify-between">
            {/* logo */}
            <div className="w-auto max-w-full px-4 xl:mr-12 ">
              <Link
                to="/"
                className={`header-logo items-center w-full flex ${
                  sticky ? "py-4 lg:py-2" : "py-4"
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10 text-white p-2  bg-blueSecondary rounded-full"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <p className="text-lg font-semibold ml-2">ABCity</p>
                <img
                  src="/vite.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                {/* hamburger button */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg  px-3 py-[6px] ring-primary focus:ring-2 md:hidden "
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px]  bg-white transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-white transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-white transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                {/* navbar */}
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-full rounded shadow shadow-gray-600 bg-black px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark md:visible md:static md:w-auto md:border-none md:shadow-none md:!bg-transparent md:p-0 md:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block md:flex md:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li
                        key={index}
                        className="group relative"
                        onClick={navbarOpen ? navbarToggleHandler : () => {}}
                      >
                        <Link
                          to={menuItem.path}
                          className={`flex justify-center py-2 text-base  md:mr-0 md:inline-flex md:px-0 md:py-6 ${
                            currentPath === menuItem.path
                              ? "text-sky-600 dark:text-white"
                              : "text-dark hover:text-waves dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderR;
