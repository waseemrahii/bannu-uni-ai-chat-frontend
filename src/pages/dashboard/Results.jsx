
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter, X, Edit3, Trash2, User, BookOpen, Hash, Award } from "lucide-react"
import { createResult, getResultByRoll, getAllResults, updateResult, deleteResult } from "../../services/resultService"
import { listSchedules } from "../../services/scheduleService"
import { useAuth } from "../../context/AuthContext"
import Pagination, { usePagination } from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import toast from "react-hot-toast"
import { getAllUsers } from "../../services/userService"

const initial = {
  rollNo: "",
  studentName: "",
  semester: "",
  className: "",
  session: "",
  items: [{ subject: "", marks: "", grade: "" }],
}

export default function Results() {
  const { user } = useAuth()
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)
  const [lookupRoll, setLookupRoll] = useState("")
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const canEdit = user && (user.role === "admin" || user.role === "cr")

  // Auto-set semester, class, and session for CR users
  useEffect(() => {
    if (user && user.role === "cr") {
      setForm(prev => ({
        ...prev,
        semester: user.semester || "",
        className: user.className || "A",
        session: user.session || ""
      }))
    }
  }, [user])

  // Load students, subjects, and results
  const loadData = async () => {
    setLoading(true)
    try {
      // Load results
      const res = await getAllResults()
      setResults(res || [])

      // Load students (only for CR's class/semester if CR)
      const studentParams = { role: 'student' }
      if (user?.role === 'cr') {
        studentParams.className = user.className
        studentParams.semester = user.semester
        studentParams.session = user.session
      }
      const studentsRes = await getAllUsers(studentParams)
      setStudents(studentsRes || [])

      // Load subjects from schedules
      const scheduleParams = { kind: 'class' }
      if (user?.role === 'cr') {
        scheduleParams.className = user.className
        scheduleParams.semester = user.semester
        scheduleParams.session = user.session
      }
      const schedulesRes = await listSchedules(scheduleParams)
      const uniqueSubjects = [...new Set(schedulesRes.map(s => s.subject))].sort()
      setSubjects(uniqueSubjects)

    } catch (error) {
      toast.error("Failed to load data")
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter results based on search and class
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const searchMatch = !searchQuery || 
        result.rollNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.items?.some(item => item.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const classMatch = selectedClass === "all" || result.className === selectedClass
      
      return searchMatch && classMatch
    })
  }, [results, searchQuery, selectedClass])

  const setItem = (idx, key, val) => {
    const next = [...form.items]
    next[idx] = { ...next[idx], [key]: val }
    setForm({ ...form, items: next })
  }

  const addItem = () => setForm({ ...form, items: [...form.items, { subject: "", marks: "", grade: "" }] })
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canEdit) return

    try {
      const payload = {
        rollNo: form.rollNo,
        studentName: form.studentName,
        semester: form.semester,
        className: form.className,
        items: form.items.map((it) => ({
          subject: it.subject,
          marks: it.marks === "" ? undefined : Number(it.marks),
          grade: it.grade || undefined,
        })),
      }

      if (editingId) {
        await updateResult(editingId, payload)
        toast.success("Result updated successfully!")
      } else {
        await createResult(payload)
        toast.success("Result published successfully!")
      }

      setForm(initial)
      setEditingId(null)
      setOpen(false)
      await loadData()
    } catch (error) {
      const errorMessage = error.response?.data?.message || (editingId ? "Failed to update result" : "Failed to publish result")
      toast.error(errorMessage)
      console.error("Error saving result:", error)
    }
  }

  const onEdit = async (result) => {
    try {
      setForm({
        rollNo: result.rollNo || "",
        studentName: result.studentName || "",
        semester: result.semester || user?.semester || "",
        className: result.className || user?.className || "A",
        session: result.session || user?.session || "",
        items: result.items?.map(item => ({
          subject: item.subject || "",
          marks: item.marks?.toString() || "",
          grade: item.grade || ""
        })) || [{ subject: "", marks: "", grade: "" }]
      })
      setEditingId(result._id)
      setOpen(true)
    } catch (error) {
      toast.error("Failed to load result for editing")
      console.error("Error loading result:", error)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return

    try {
      await deleteResult(id)
      toast.success("Result deleted successfully!")
      await loadData()
    } catch (error) {
      toast.error("Failed to delete result")
      console.error("Error deleting result:", error)
    }
  }

  const onLookup = async (e) => {
    e.preventDefault()
    if (!lookupRoll) {
      toast.error("Please enter a roll number")
      return
    }

    try {
      const res = await getResultByRoll(lookupRoll)
      setResults(Array.isArray(res) ? res : [res])
      toast.success("Results found!")
    } catch (error) {
      toast.error("No results found for this roll number")
      setResults([])
      console.error("Error fetching results:", error)
    }
  }

  // Handle student selection
  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s._id === studentId)
    if (student) {
      setForm(prev => ({
        ...prev,
        rollNo: student.rollNo || "",
        studentName: student.name || "",
        semester: student.semester || prev.semester,
        className: student.className || prev.className,
        session: student.session || prev.session
      }))
    }
  }

  // Reset search
  const resetSearch = () => {
    setSearchQuery("")
    setLookupRoll("")
    loadData() // Reload all results
  }

  // Use pagination
  const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
    filteredResults, 
    8, 
    `${selectedClass}-${searchQuery}`
  )

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const classes = ["A", "B", "C", "D"]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Student Results</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and publish student results and grades</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
          </button>

          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-blue-600 cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              onClick={() => {
                // Reset form with user's data for CR
                const baseForm = {
                  ...initial,
                  semester: user?.semester || "",
                  className: user?.className || "A",
                  session: user?.session || ""
                }
                setForm(baseForm)
                setEditingId(null)
                setOpen(true)
              }}
            >
              <Plus size={16} className="sm:size-[20px]" />
              <span className="hidden sm:inline">Publish Result</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            {/* <div className="p-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Class</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedClass("all")
                      setMobileFiltersOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
                      selectedClass === "all"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex-1 font-medium">All Classes</span>
                    {selectedClass === "all" && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                  {classes.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        setSelectedClass(cls)
                        setMobileFiltersOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
                        selectedClass === cls
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex-1 font-medium">Class {cls}</span>
                      {selectedClass === cls && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by roll number, student name, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={resetSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Roll Number Lookup */}
        <motion.form onSubmit={onLookup} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lookup by Roll Number..."
              value={lookupRoll}
              onChange={(e) => setLookupRoll(e.target.value)}
            />
          </div>
          <button 
            className="rounded-lg bg-gray-100 px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-200 transition-colors font-medium" 
            type="submit"
          >
            Search
          </button>
        </motion.form>

        {/* Desktop Class Filter */}
        {/* <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
        </div> */}
      </div>

      {/* Active Filters Bar */}
      {(selectedClass !== "all" || searchQuery || lookupRoll) && (
        <div className="flex flex-wrap gap-2">
          {selectedClass !== "all" && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              Class: {selectedClass}
              <button onClick={() => setSelectedClass("all")} className="ml-1 hover:text-blue-900">
                <X size={14} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-purple-900">
                <X size={14} />
              </button>
            </span>
          )}
          {lookupRoll && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Roll: {lookupRoll}
              <button onClick={() => setLookupRoll("")} className="ml-1 hover:text-green-900">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredResults.length === 0 ? (
        <div className="col-span-full text-center py-8 md:py-12">
          <Award className="mx-auto text-gray-400 mb-3 md:mb-4" size={40} />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            {searchQuery || lookupRoll ? "No results found" : "No results found"}
          </h3>
          <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            {searchQuery || lookupRoll 
              ? "No results match your search criteria" 
              : selectedClass !== "all" 
                ? `No results found for Class ${selectedClass}` 
                : "Publish your first result to get started"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pageItems.map((result) => (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{result.studentName}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Roll: {result.rollNo}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>Semester {result.semester}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Class {result.className}</span>
                    </div>
                    {result.session && (
                      <div className="flex items-center gap-2">
                        <span>Session: {result.session}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(result)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      title="Edit result"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(result._id)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      title="Delete result"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Subjects and Grades */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.items?.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 text-sm">{item.subject}</span>
                      {item.grade && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {item.grade}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Marks: {item.marks ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredResults.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <Pagination 
            page={page} 
            setPage={setPage} 
            total={filteredResults.length} 
            totalPages={totalPages} 
            start={start} 
            end={end} 
          />
        </div>
      )}

      {/* Result Modal */}
      <ResultModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
          setEditingId(null)
        }}
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        editingId={editingId}
        user={user}
        students={students}
        subjects={subjects}
        onStudentSelect={handleStudentSelect}
        setItem={setItem}
        addItem={addItem}
        removeItem={removeItem}
      />
    </div>
  )
}

// Enhanced Result Modal Component
const ResultModal = ({ 
  isOpen, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  editingId, 
  user, 
  students, 
  subjects,
  onStudentSelect,
  setItem,
  addItem,
  removeItem
}) => {
  const isCR = user?.role === "cr"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Update Result" : "Publish New Result"}
      size="max-w-4xl"
    >
      <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-1">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={students.find(s => s.rollNo === form.rollNo)?._id || ""}
              onChange={(e) => onStudentSelect(e.target.value)}
              required
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.rollNo} (Class {student.className}, Sem {student.semester})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecting a student will automatically fill roll number, name, class, and semester
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Roll Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Roll number will auto-fill when student is selected"
                value={form.rollNo}
                onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                required
                readOnly={!!form.rollNo}
              />
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Name will auto-fill when student is selected"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                required
                readOnly={!!form.studentName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                required
                readOnly={isCR}
              />
              {isCR && (
                <p className="text-xs text-blue-600 mt-1">
                  Semester is automatically set to your semester
                </p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                required
                disabled={isCR}
              >
                <option value="A">Class A</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
                <option value="D">Class D</option>
              </select>
              {isCR && (
                <p className="text-xs text-blue-600 mt-1">
                  Class is automatically set to your class
                </p>
              )}
            </div>

            {/* Session */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
                readOnly={isCR}
              />
              {isCR && (
                <p className="text-xs text-blue-600 mt-1">
                  Session is automatically set to your session
                </p>
              )}
            </div>
          </div>

          {/* Subjects and Grades */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Subjects & Grades <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addItem}
                className="rounded-lg bg-green-600 px-3 py-2 text-white text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Subject
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map((it, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  {/* Subject - 5 columns */}
                  <div className="md:col-span-5">
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={it.subject}
                      onChange={(e) => setItem(i, "subject", e.target.value)}
                      required
                    >
                      <option value="">Select subject...</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  {/* Marks - 3 columns */}
                  <div className="md:col-span-3">
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Marks"
                      type="number"
                      min="0"
                      max="100"
                      value={it.marks}
                      onChange={(e) => setItem(i, "marks", e.target.value)}
                    />
                  </div>

                  {/* Grade - 2 columns */}
                  <div className="md:col-span-2">
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Grade"
                      value={it.grade}
                      onChange={(e) => setItem(i, "grade", e.target.value)}
                    />
                  </div>

                  {/* Remove Button - 2 columns */}
                  <div className="md:col-span-2">
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        className="w-full rounded-lg border border-red-300 px-3 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                        onClick={() => removeItem(i)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update Result" : "Publish Result"}
            </button>
            <button
              type="button"
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}