import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/images/ustb-logo.png" alt="UST Bannu logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold text-gray-900">University AI Assistant</span>
                <span className="text-[11px] text-gray-500">UST Bannu — CS Department</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-sm">
              Get instant answers about classes, exams, events, and university information — built for students of the
              University of Science & Technology Bannu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Account</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Go to Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Contact</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 text-university-blue" />
                UST Bannu, Khyber Pakhtunkhwa, Pakistan
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-university-blue" />
                +92 (0) 928 — 633823
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-university-blue" />
                info@ustb.edu.pk
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-university-blue" />
                <a
                  href="https://www.ustb.edu.pk/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ustb.edu.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} UST Bannu — University AI Assistant. All rights reserved.
          </p>
          <div className="text-xs text-gray-500">Built with React, Vite, Tailwind CSS.</div>
        </div>
      </div>
    </footer>
  )
}
