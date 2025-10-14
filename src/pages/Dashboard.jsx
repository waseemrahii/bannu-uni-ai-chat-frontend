import { MessageSquare, CalendarDays, GraduationCap, Bot, FileText } from "lucide-react"
export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Welcome to BU CS Assistant</h1>
          <p className="text-gray-600 mt-1">Quick access to chat, classes, exams and more.</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<Bot />}
          title="Ask the Assistant"
          desc="Chat with the AI for instant answers"
          action="Go to Chat"
          to="/chat"
        />
        <Card
          icon={<CalendarDays />}
          title="Class Schedule"
          desc="See today and tomorrow's classes"
          action="View"
          to="/"
        />
        <Card icon={<GraduationCap />} title="Exam Info" desc="Dates, halls and instructions" action="Check" to="/" />
        <Card
          icon={<MessageSquare />}
          title="Announcements"
          desc="Latest updates from the department"
          action="Open"
          to="/"
        />
        <Card icon={<FileText />} title="Results" desc="Search results by roll number" action="See Results" to="/" />
      </section>
    </main>
  )
}
function Card({ icon, title, desc, action, to }) {
  return (
    <a href={to} className="group rounded-xl bg-white border hover:shadow-md transition-shadow p-6 flex flex-col">
      <div className="inline-flex items-center justify-center rounded-lg bg-blue-50 text-university-blue h-10 w-10 group-hover:bg-blue-100">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 flex-1">{desc}</p>
      <span className="mt-4 text-sm font-medium text-university-blue group-hover:underline">{action} →</span>
    </a>
  )
}
