import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/ChatContext"
import { LogOut, ChevronDown, User, Settings, Menu, Home, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

const ChatHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { isConnected, currentConversation, conversations } = useChat()
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

  const getCurrentConversationTitle = () => {
    if (!currentConversation || !conversations) return null
    const conversation = conversations.find((c) => c.conversationId === currentConversation.conversationId)
    return conversation?.title || "New Chat"
  }

  const currentTitle = getCurrentConversationTitle()

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200/50 px-3 sm:px-6 py-2 sm:py-3 shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </motion.button>

          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <img
                src="/images/ustb-logo.png"
                alt="USTB Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                CS Assistant
              </h1>
              <div className="flex items-center gap-2">
                <motion.span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 2, repeat: isConnected ? Number.POSITIVE_INFINITY : 0 }}
                />
                <span className="text-xs text-gray-600 truncate">
                  {isConnected ? "Connected" : "Reconnecting..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Conversation Title - Mobile Only */}
        {/* {currentTitle && (
          <div className="flex-1 min-w-0 px-2 sm:hidden">
            <div className="text-center">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate block">
                {currentTitle}
              </span>
            </div>
          </div>
        )} */}

        {/* Right Section - User Menu */}
        <div className="relative flex items-center gap-1 sm:gap-3 flex-shrink-0" ref={menuRef}>
          {/* Desktop Buttons */}
          {(user?.role === "admin" || user?.role === "cr") && (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95"
              aria-label="Open Dashboard"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
          )}

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700 transition-all shadow-sm hover:shadow active:scale-95"
            aria-label="Go to Main Site"
          >
            <Home className="w-4 h-4" />
            <span className="hidden xs:inline">Home</span>
          </Link>

          {/* Mobile Icon Buttons */}
          {/* <div className="flex items-center gap-1 sm:hidden">
            {(user?.role === "admin" || user?.role === "cr") && (
              <Link
                to="/dashboard"
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                aria-label="Dashboard"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
            <Link
              to="/"
              className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div> */}

          {/* User Menu Button */}
          <motion.button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 sm:gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 sm:px-2.5 sm:py-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95 min-w-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white grid place-items-center text-xs font-semibold shadow flex-shrink-0">
              {initial}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {user?.name || "Student"}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user?.semester} • {user?.className}
              </p>
            </div>
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition flex-shrink-0 ${open ? "rotate-180" : ""}`} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                role="menu"
                className="absolute top-full right-0 mt-2 w-64 sm:w-52 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50"
              >
                <div className="p-2">
                  {/* User Info - Mobile Only */}
                  <div className="sm:hidden px-3 py-2 border-b border-gray-100 mb-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || "Student"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.semester} • {user?.className}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm sm:text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    Profile
                  </Link>

                  {user?.role === "student" && (
                    <Link
                      to="/studentdashboard"
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm sm:text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      Dashboard
                    </Link>
                  )}

                  {(user?.role === "admin" || user?.role === "cr") && (
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm sm:text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      Admin
                    </Link>
                  )}
                </div>

                <div className="h-px bg-gray-200" />

                <div className="p-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm sm:text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Current Conversation Title - Desktop */}
      {/* {currentTitle && (
        <div className="hidden sm:flex justify-center mt-2">
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full max-w-md truncate">
            {currentTitle}
          </span>
        </div>
      )} */}
    </div>
  )
}

export default ChatHeader

// import { useState, useEffect, useRef } from "react"
// import { useAuth } from "../../context/AuthContext"
// import { useChat } from "../../context/ChatContext"
// import { LogOut, ChevronDown, User, Settings, Menu, Home, Zap } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Link } from "react-router-dom"

// const ChatHeader = ({ onMenuClick }) => {
//   const { user, logout } = useAuth()
//   const { isConnected, currentConversation, conversations } = useChat()
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

//   const getCurrentConversationTitle = () => {
//     if (!currentConversation || !conversations) return null
//     const conversation = conversations.find((c) => c.conversationId === currentConversation.conversationId)
//     return conversation?.title || "New Chat"
//   }

//   const currentTitle = getCurrentConversationTitle()

//   return (
//     <div className="sticky top-0 z-30 bg-white border-b border-gray-200/50 px-4 sm:px-6 py-3 shadow-sm">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {/* Mobile Menu Button */}
//           <motion.button
//             onClick={onMenuClick}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             aria-label="Toggle sidebar"
//           >
//             <Menu className="w-5 h-5 text-gray-700" />
//           </motion.button>

//           {/* Logo and Title */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg  flex items-center justify-center shadow-md">
//               {/* <Zap className="w-5 h-5 text-white" /> */}
//                     <img
//       src="/images/ustb-logo.png"
//       alt="USTB Logo"
//       className="mx-auto w-24 h-24 object-contain mb-4"
//     />
//             </div>
//             <div>
//               <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//                 CS Assistant
//                 {currentTitle && (
//                   <span className="text-xs font-normal text-gray-500 hidden sm:inline bg-gray-100 px-2.5 py-1 rounded-full">
//                     {currentTitle}
//                   </span>
//                 )}
//               </h1>
//               <div className="flex items-center gap-2">
//                 <motion.span
//                   className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
//                   animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
//                   transition={{ duration: 2, repeat: isConnected ? Number.POSITIVE_INFINITY : 0 }}
//                 />
//                 <span className="text-xs text-gray-600">{isConnected ? "Connected" : "Reconnecting..."}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="relative flex items-center gap-2 sm:gap-3" ref={menuRef}>
//           {(user?.role === "admin" || user?.role === "cr") && (
//             <Link
//               to="/dashboard"
//               className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95"
//               aria-label="Open Dashboard"
//             >
//               <Settings className="w-4 h-4" />
//               Dashboard
//             </Link>
//           )}

//           <Link
//             to="/"
//             className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700 transition-all shadow-sm hover:shadow active:scale-95"
//             aria-label="Go to Main Site"
//           >
//             <Home className="w-4 h-4" />
//             Home
//           </Link>

//           <motion.button
//             onClick={() => setOpen((v) => !v)}
//             className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             aria-haspopup="menu"
//             aria-expanded={open}
//           >
//             <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white grid place-items-center text-xs font-semibold shadow">
//               {initial}
//             </div>
//             <div className="hidden sm:block text-left">
//               <p className="text-xs font-semibold text-gray-900">{user?.name || "Student"}</p>
//               <p className="text-[10px] text-gray-500">
//                 {user?.semester} • {user?.className}
//               </p>
//             </div>
//             <ChevronDown className={`w-4 h-4 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
//           </motion.button>

//           {/* Dropdown Menu */}
//           <AnimatePresence>
//             {open && (
//               <motion.div
//                 initial={{ opacity: 0, y: -6, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -6, scale: 0.98 }}
//                 transition={{ duration: 0.12 }}
//                 role="menu"
//                 className="absolute top-full right-0 mt-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50"
//               >
//                 <div className="p-2">
//                   <Link
//                     to="/profile"
//                     onClick={() => setOpen(false)}
//                     className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//                     role="menuitem"
//                   >
//                     <User className="w-4 h-4 text-gray-500" />
//                     Profile
//                   </Link>

//                   {user?.role === "student" && (
//                     <Link
//                       to="/studentdashboard"
//                       onClick={() => setOpen(false)}
//                       className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//                       role="menuitem"
//                     >
//                       <Settings className="w-4 h-4 text-gray-500" />
//                       Dashboard
//                     </Link>
//                   )}

//                   {(user?.role === "admin" || user?.role === "cr") && (
//                     <Link
//                       to="/dashboard"
//                       onClick={() => setOpen(false)}
//                       className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
//                       role="menuitem"
//                     >
//                       <Settings className="w-4 h-4 text-gray-500" />
//                       Admin
//                     </Link>
//                   )}
//                 </div>

//                 <div className="h-px bg-gray-200" />

//                 <div className="p-2">
//                   <button
//                     onClick={logout}
//                     className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
//                     role="menuitem"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     Logout
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatHeader
