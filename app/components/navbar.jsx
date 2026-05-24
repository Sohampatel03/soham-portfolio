"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const replaySplash = (event) => {
  event.preventDefault();
  window.dispatchEvent(new Event("portfolio:replay-splash"));
};

function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = sessionStorage.getItem("portfolio-theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    window.dispatchEvent(new Event("portfolio:replay-splash"));
    
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    sessionStorage.setItem("portfolio-theme", newTheme);

    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <nav className="bg-transparent">
      <div className="flex items-center justify-between py-5">
        <div className="flex flex-shrink-0 items-center">
          <Link
            href="/"
            onClick={replaySplash}
            className="text-[var(--logo-text)] text-3xl font-bold transition-colors duration-300">
            Soham Patel
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ul className="mt-4 flex h-screen max-h-0 w-full flex-col items-start text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:w-auto md:flex-row md:space-x-1 md:border-0 md:opacity-100" id="navbar-default">
            <li>
              <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#about">
                <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">ABOUT</div>
              </Link>
            </li>
            <li>
              <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#experience">
                <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">EXPERIENCE</div>
              </Link>
            </li>
            <li>
              <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#skills">
                <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">SKILLS</div>
              </Link>
            </li>
            <li>
              <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#education">
                <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">EDUCATION</div>
              </Link>
            </li>
            <li>
              <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#projects">
                <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">PROJECTS</div>
              </Link>
            </li>
          </ul>

          {mounted ? (
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:text-pink-500 hover:border-pink-500/50 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:scale-110 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <FiSun size={18} className="animate-[spin_6s_linear_infinite]" />
              ) : (
                <FiMoon size={18} className="animate-[pulse_2s_infinite]" />
              )}
            </button>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800/10 dark:bg-slate-100/10 animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
