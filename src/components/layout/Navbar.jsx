
// import { Link, NavLink, useLocation } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"
// import { GraduationCap } from "lucide-react"

// export default function Navbar() {
//   const { isAuthenticated, logout, user } = useAuth()
//   const { pathname } = useLocation()

//   const linkBase = "text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md"
//   const activeLink = "bg-gray-100 text-gray-900"
//   const isActive = (to) => (pathname === to ? `${linkBase} ${activeLink}` : linkBase)

//   return (
//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//         {/* Brand */}
//         <Link to="/" className="flex items-center gap-3">
//           <img src="/images/ustb-logo.png" alt="UST Bannu logo" className="h-9 w-9 object-contain" />
//           <div className="flex flex-col leading-none">
//             <span className="text-base font-semibold text-gray-900">University AI Assistant</span>
//             <span className="text-[11px] text-gray-500">UST Bannu - CS Department</span>
//           </div>
//         </Link>

//         {/* Links */}
//         <div className="hidden md:flex items-center gap-1">
//           <NavLink to="/" className={isActive("/")}>
//             Home
//           </NavLink>
//           <a href="#features" className={linkBase}>
//             Features
//           </a>
//           <a href="#about" className={linkBase}>
//             About
//           </a>
//           <a href="#contact" className={linkBase}>
//             Contact
//           </a>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           {isAuthenticated ? (
//             <>
//               <Link
//                 to="/chat"
//                 className="inline-flex items-center gap-2 rounded-md border border-university-blue text-university-blue px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-colors"
//               >
//                 <GraduationCap className="h-4 w-4" />
//                 Go to Chat
//               </Link>
//               <button
//                 type="button"
//                 onClick={logout}
//                 className="inline-flex rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black transition-colors"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="inline-flex rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex rounded-md bg-university-blue text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   )
// }



// import { Link, NavLink, useLocation } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"
// import { GraduationCap, Menu, X } from "lucide-react"
// import { useState } from "react"

// export default function Navbar() {
//   const { isAuthenticated, logout } = useAuth()
//   const { pathname } = useLocation()
//   const [open, setOpen] = useState(false) // mobile menu state

//   const linkBase = "text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md"
//   const activeLink = "bg-gray-100 text-gray-900"
//   const isActive = (to) => (pathname === to ? `${linkBase} ${activeLink}` : linkBase)

//   return (
//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//         {/* Brand */}
//         <Link to="/" className="flex items-center gap-3">
//           <img src="/images/ustb-logo.png" alt="UST Bannu crest" className="h-9 w-9 object-contain" />
//           <div className="flex flex-col leading-none">
//             <span className="text-base font-semibold text-gray-900">University AI Assistant</span>
//             <span className="text-[11px] text-gray-500">UST Bannu • CS Department</span>
//           </div>
//         </Link>

//         {/* Desktop links */}
//         <div className="hidden md:flex items-center gap-1">
//           <NavLink to="/" className={isActive("/")}>
//             Home
//           </NavLink>
//           {/* <a href="#features" className={linkBase}>
//             Features
//           </a>
//           <a href="#about" className={linkBase}>
//             About
//           </a> */}
//           <a href="#contact" className={linkBase}>
//             Contact
//           </a>
//         </div>

//         {/* Actions (desktop) */}
//         <div className="hidden md:flex items-center gap-2">
//           {isAuthenticated ? (
//             <>
//               <Link
//                 to="/chat"
//                 className="inline-flex items-center gap-2 rounded-md border border-university-blue text-university-blue px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-colors"
//               >
//                 <GraduationCap className="h-4 w-4" />
//                 Go to Chat
//               </Link>
//               <button
//                 type="button"
//                 onClick={logout}
//                 className="inline-flex rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black transition-colors"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="inline-flex rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex rounded-md rounded-md border-2 border:[#4CB9F1] bg-[#4CB9F1] hover:bg-white hover:text-blue-600 hover:border-blue-600 text-white px-4 py-2 text-sm font-semibold transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>

//         <button
//           className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
//           aria-label="Toggle navigation"
//           aria-expanded={open}
//           onClick={() => setOpen((v) => !v)}
//         >
//           {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </button>
//       </nav>

//       {open && (
//         <div className="md:hidden border-t  bg-white/90 backdrop-blur">
//           <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
//             <NavLink to="/" className={isActive("/")} onClick={() => setOpen(false)}>
//               Home
//             </NavLink>
//             {/* <a href="#features" className={linkBase} onClick={() => setOpen(false)}>
//               Features
//             </a>
//             <a href="#about" className={linkBase} onClick={() => setOpen(false)}>
//               About
//             </a> */}
//             <a href="#contact" className={linkBase} onClick={() => setOpen(false)}>
//               Contact
//             </a>
//             <div className="pt-2 border-t flex gap-2">
//               {isAuthenticated ? (
//                 <>
//                   <Link
//                     to="/chat"
//                     onClick={() => setOpen(false)}
//                     className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-university-blue text-university-blue px-4 py-2 text-sm font-semibold hover:bg-blue-50"
//                   >
//                     <GraduationCap className="h-4 w-4" /> Chat
//                   </Link>
//                   <button
//                     onClick={logout}
//                     className="flex-1 inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     onClick={() => setOpen(false)}
//                     className="flex-1 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     onClick={() => setOpen(false)}
//                     className="flex-1 inline-flex items-center justify-center rounded-md bg-university-blue text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700"
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }

import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const linkBase =
    "block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md";
  const activeLink = "bg-blue-100 text-blue-700 font-semibold";
  const isActive = (to) => (pathname === to ? `${linkBase} ${activeLink}` : linkBase);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 🌐 Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img
            src="/images/ustb-logo.png"
            alt="UST Bannu crest"
            className="h-9 w-9 object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="text-base font-semibold text-gray-900">
              University AI Assistant
            </span>
            <span className="text-[11px] text-gray-500">
              UST Bannu • CS Department
            </span>
          </div>
        </Link>

        {/* 🖥️ Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={isActive("/")}>
            Home
          </NavLink>
          <a href="#contact" className={linkBase}>
            Contact
          </a>
        </div>

        {/* 🔘 Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-md border border-blue-600 text-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-all"
              >
                <GraduationCap className="h-4 w-4" />
                Go to Chat
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex rounded-md border-2 border-blue-600 bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-4 py-2 text-sm font-semibold transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* 🍔 Mobile Toggle Button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-all"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* 📱 Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur-xl shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              <NavLink
                to="/"
                className={isActive("/")}
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <a
                href="#contact"
                className={linkBase}
                onClick={() => setOpen(false)}
              >
                Contact
              </a>

              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/chat"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md border border-blue-600 text-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition-all"
                    >
                      <GraduationCap className="h-4 w-4" /> Chat
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
