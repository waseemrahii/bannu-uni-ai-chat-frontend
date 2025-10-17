

// import { useLocation } from "react-router-dom"
// import Navbar from "./Navbar"
// import Footer from "./Footer"

// export default function Layout({ children }) {
//   const location = useLocation()
//   const isChat = location.pathname.startsWith("/chat")

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {!isChat && <Navbar />}
//       <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-safe">{children}</main>
//       {!isChat && <Footer />}
//     </div>
//   )
// }


import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }) {
  const location = useLocation()
  const isChat = location.pathname.startsWith("/chat")
  const isDashboard = location.pathname.startsWith("/dashboard")

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isChat && !isDashboard && <Navbar />}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-safe">{children}</main>
      {!isChat && !isDashboard && <Footer />}
    </div>
  )
}
