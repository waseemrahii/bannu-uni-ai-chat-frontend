
// import { useState, useEffect, useRef } from "react"
// import { useAuth } from "../../context/AuthContext"
// import { useChat } from "../../context/ChatContext"
// import { LogOut, ChevronDown, User, Settings, Home } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Link } from "react-router-dom"

// const ChatHeader = () => {
//   const { user, logout } = useAuth()
//   const { isConnected } = useChat()
//   const [open, setOpen] = useState(false)
//   const menuRef = useRef(null)

//   useEffect(() => {
//     const onClickAway = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
//     }
//     const onEsc = (e) => e.key === "Escape" && setOpen(false)
//     document.addEventListener("mousedown", onClickAway)
//     document.addEventListener("keydown", onEsc)
//     return () => {
//       document.removeEventListener("mousedown", onClickAway)
//       document.removeEventListener("keydown", onEsc)
//     }
//   }, [])

//   const initial = (user?.name || user?.email || "U").toString().trim().charAt(0).toUpperCase()

//   return (
//     <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3">
//       <div className="max-w-5xl mx-auto flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <img src="/images/ustb-logo.png" alt="UST Bannu" className="w-9 h-9 object-contain" />
//           <div>
//             <h1 className="text-sm sm:text-base font-semibold text-gray-900">BU CS Assistant</h1>
//             <div className="flex items-center gap-2">
//               <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
//               <span className="text-xs text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
//             </div>
//           </div>
//         </div>

//         <div className="relative" ref={menuRef}>
//           <button
//             onClick={() => setOpen((v) => !v)}
//             className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-gray-50 transition"
//             aria-haspopup="menu"
//             aria-expanded={open}
//           >
//             <div className="w-8 h-8 rounded-full bg-university-blue/90 text-white grid place-items-center text-sm font-semibold">
//               {initial}
//             </div>
//             <div className="hidden sm:block text-left">
//               <p className="text-sm font-medium text-gray-900 leading-4">{user?.name || "Student"}</p>
//               <p className="text-[11px] text-gray-500 leading-3">
//                 {user?.semester} Semester • {user?.className} Class
//               </p>
//             </div>
//             <ChevronDown className={`w-4 h-4 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
//           </button>

//           <AnimatePresence>
//             {open && (
//               <motion.div
//                 initial={{ opacity: 0, y: -6, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 6, scale: 1 }}
//                 exit={{ opacity: 0, y: -6, scale: 0.98 }}
//                 transition={{ duration: 0.12 }}
//                 role="menu"
//                 className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
//               >
//                 <button
//                   onClick={() => (window.location.href = "/profile")}
//                   className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   role="menuitem"
//                 >
//                   <User className="w-4 h-4 text-gray-500" /> Profile
//                 </button>
//                 <button
//                   onClick={() => (window.location.href = "/settings")}
//                   className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   role="menuitem"
//                 >
//                   <Settings className="w-4 h-4 text-gray-500" /> Settings
//                 </button>
//               <Link to='/home' >
//                 <button
//                   className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   role="menuitem"
//                 >
//                   <Home className="w-4 h-4 text-gray-500" /> Home Page
//                 </button>
//                               </Link>

//                 <div className="h-px bg-gray-100" />
//                 <button
//                   onClick={logout}
//                   className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
//                   role="menuitem"
//                 >
//                   <LogOut className="w-4 h-4" /> Logout
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatHeader




import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/ChatContext"
import { LogOut, ChevronDown, User, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

const ChatHeader = () => {
  const { user, logout } = useAuth()
  const { isConnected } = useChat()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClickAway = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    const onEsc = (e) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onClickAway)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onClickAway)
      document.removeEventListener("keydown", onEsc)
    }
  }, [])

  const initial = (user?.name || user?.email || "U").toString().trim().charAt(0).toUpperCase()

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/ustb-logo.png" alt="UST Bannu" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-gray-900">BU CS Assistant</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-gray-50 transition"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <div className="w-8 h-8 rounded-full bg-university-blue/90 text-gray-700 grid place-items-center text-sm font-semibold">
              {initial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-4">{user?.name || "Student"}</p>
              <p className="text-[11px] text-gray-500 leading-3">
                {user?.semester} Semester • {user?.className} Class
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 6, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                role="menu"
                className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
              >
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  <User className="w-4 h-4 text-gray-500" /> Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  <Settings className="w-4 h-4 text-gray-500" /> Settings
                </Link>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
