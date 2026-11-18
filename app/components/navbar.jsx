"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

const NAV_LINKS = [
  { label: "ABOUT", href: "/#about" },
  { label: "EXPERIENCE", href: "/#experience" },
  { label: "SKILLS", href: "/#skills" },
  { label: "EDUCATION", href: "/#education" },
  { label: "PROJECTS", href: "/#projects" },
  { label: "CONTACT", href: "/#contact" },
];

const replaySplash = (event) => {
  event.preventDefault();
  window.dispatchEvent(new Event("portfolio:replay-splash"));
};

function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <nav className="bg-transparent relative">
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
          {/* Desktop nav links */}
          <ul className="hidden md:flex md:space-x-1" id="navbar-default">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href={link.href}>
                  <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">{link.label}</div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:text-pink-500 hover:border-pink-500/50 transition-all duration-300 flex items-center justify-center cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

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

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <ul className="absolute inset-x-0 top-full z-[60] bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                className="block px-6 py-3 no-underline outline-none hover:no-underline"
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                <div className="text-sm text-[var(--text-primary)] transition-colors duration-300 hover:text-pink-600">{link.label}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
