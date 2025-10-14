import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { BookOpen, GraduationCap, Bot } from "lucide-react"
import { motion } from "framer-motion"

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center">
        <img
          src="/images/campus-admin.webp"
          alt="UST Bannu Administration Block"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-university-blue/50"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-white text-pretty text-4xl md:text-6xl font-extrabold leading-tight">
              University AI Assistant
            </h1>
            <p className="mt-4 text-blue-100 text-base md:text-xl leading-relaxed">
              Instant answers about classes, exams, events, and resources from the CS Department of University of
              Science &amp; Technology Bannu.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-md bg-white text-university-blue px-6 py-3 font-semibold hover:bg-[#4CB9F1] hover:text-white transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-md border-2 border-white text-white px-6 py-3 font-semibold hover:bg-[#4CB9F1] hover:border-[#4CB9F1] hover:text-white hover:border[#4CB9F1] transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link
                  to="/chat"
                  className="inline-flex items-center justify-center rounded-md bg-white text-university-blue px-6 py-3 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Chat
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <BookOpen className="h-10 w-10 text-university-blue mb-3" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900">Class Schedule</h3>
              <p className="text-gray-600 mt-1">
                Ask about today's classes, tomorrow's schedule, or search for a specific subject quickly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <GraduationCap className="h-10 w-10 text-university-blue mb-3" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900">Exam Information</h3>
              <p className="text-gray-600 mt-1">
                Get exam schedules, date sheets, and important deadlines for your semester.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Bot className="h-10 w-10 text-university-blue mb-3" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900">Smart Assistant</h3>
              <p className="text-gray-600 mt-1">AI-powered responses for all your university-related queries, 24/7.</p>
            </motion.div>
          </div>

          {/* Secondary banner */}
          <div id="about" className="mt-16 grid md:grid-cols-2 gap-6">
            <img
              src="/images/campus-ims.webp"
              alt="IMS Campus at UST Bannu"
              className="rounded-xl object-cover h-64 md:h-80 w-full"
            />
            <img
              src="/images/campus-library.webp"
              alt="Central Library at UST Bannu"
              className="rounded-xl object-cover h-64 md:h-80 w-full"
            />
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section id="contact" className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Ready to try the Assistant?</h2>
          <p className="text-gray-600 mt-2">Sign up for free and start chatting with UST Bannu AI.</p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-flex rounded-md bg-[#4CB9F1] text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors"
            >
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
