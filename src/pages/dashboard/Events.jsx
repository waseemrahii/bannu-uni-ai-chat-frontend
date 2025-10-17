
import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Plus, Filter, X, Edit3, Trash2, Users, Building, BookOpen } from "lucide-react"
import { listEvents, createEvent, updateEvent, deleteEvent, getEventById } from "../../services/eventService"
import { useAuth } from "../../context/AuthContext"
import Pagination, { usePagination } from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import toast from "react-hot-toast"

const initial = {
  title: "",
  description: "",
  date: "",
  audience: "department",
  department: "CS",
  semester: "",
}

const audienceTypes = [
  { value: "all", label: "All University", icon: "🏛️" },
  { value: "department", label: "Department", icon: "🏢" },
  { value: "semester", label: "Semester", icon: "📚" }
]

export default function Events() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("all")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const canEdit = user && (user.role === "admin" || user.role === "cr")

  // Auto-set department and semester for CR users
  useEffect(() => {
    if (user && user.role === "cr") {
      setForm(prev => ({
        ...prev,
        department: user.department || "CS",
        semester: user.semester || ""
      }))
    }
  }, [user])

  const load = async () => {
    setLoading(true)
    try {
      const res = await listEvents({})
      const events = res.data || res
      // Sort by date (newest first)
      const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date))
      setItems(sortedEvents)
    } catch (error) {
      toast.error("Failed to load events")
      console.error("Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canEdit) return

    try {
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        audience: form.audience,
        department: form.department,
        semester: form.semester || undefined,
      }

      if (editingId) {
        await updateEvent(editingId, payload)
        toast.success("Event updated successfully!")
      } else {
        await createEvent(payload)
        toast.success("Event created successfully!")
      }

      setForm(initial)
      setEditingId(null)
      setOpen(false)
      await load()
    } catch (error) {
      const errorMessage = error.response?.data?.message || (editingId ? "Failed to update event" : "Failed to create event")
      toast.error(errorMessage)
      console.error("Error saving event:", error)
    }
  }

  const onEdit = async (id) => {
    try {
      const res = await getEventById(id)
      const data = res.data?.data || res
      setForm({
        title: data.title || "",
        description: data.description || "",
        date: data.date ? data.date.substring(0, 10) : "",
        audience: data.audience || "department",
        department: data.department || "CS",
        semester: data.semester || "",
      })
      setEditingId(id)
      setOpen(true)
    } catch (error) {
      toast.error("Failed to load event for editing")
      console.error("Error loading event:", error)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      await deleteEvent(id)
      toast.success("Event deleted successfully!")
      await load()
    } catch (error) {
      toast.error("Failed to delete event")
      console.error("Error deleting event:", error)
    }
  }

  // Filter events based on search and audience
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchMatch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const audienceMatch = selectedAudience === "all" || item.audience === selectedAudience
      
      return searchMatch && audienceMatch
    })
  }, [items, searchQuery, selectedAudience])

  // Use pagination
  const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
    filteredItems, 
    8, 
    `${selectedAudience}-${searchQuery}`
  )

  // Reset search
  const resetSearch = () => {
    setSearchQuery("")
  }

  // Handle audience change
  const handleAudienceChange = (audience) => {
    setSelectedAudience(audience)
    setSearchQuery("")
  }

  // Get audience color
  const getAudienceColor = (audience) => {
    const colors = {
      all: "bg-purple-100 text-purple-800 border-purple-200",
      department: "bg-blue-100 text-blue-800 border-blue-200",
      semester: "bg-green-100 text-green-800 border-green-200"
    }
    return colors[audience] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  // Get audience icon
  const getAudienceIcon = (audience) => {
    const icons = {
      all: "🏛️",
      department: "🏢",
      semester: "📚"
    }
    return icons[audience] || "📅"
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">University Events</h1>
          <p className="text-sm sm:text-base text-gray-600">Create, update, search, and manage university events and announcements</p>
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
                // Reset form with user's department and semester for CR
                const baseForm = {
                  ...initial,
                  department: user?.department || "CS",
                  semester: user?.semester || ""
                }
                setForm(baseForm)
                setEditingId(null)
                setOpen(true)
              }}
            >
              <Plus size={16} className="sm:size-[20px]" />
              <span className="hidden sm:inline">New Event</span>
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
            <div className="p-4 space-y-6">
              {/* Audience Tabs for Mobile */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Audience Type</h3>
                <div className="space-y-2">
                  {audienceTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        handleAudienceChange(type.value)
                        setMobileFiltersOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
                        selectedAudience === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{type.icon}</span>
                      <span className="flex-1 font-medium">{type.label}</span>
                      {selectedAudience === type.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audience Tabs - Desktop */}
      <div className="hidden md:block border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {audienceTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleAudienceChange(type.value)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 cursor-pointer font-medium text-sm flex items-center gap-2 ${
                selectedAudience === type.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{type.icon}</span>
              {type.label}
              {selectedAudience === type.value && filteredItems.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {filteredItems.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search by title, description, or department..."
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

      {/* Active Filters Bar */}
      {(selectedAudience !== "all" || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {selectedAudience !== "all" && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              Audience: {audienceTypes.find(t => t.value === selectedAudience)?.label}
              <button onClick={() => setSelectedAudience("all")} className="ml-1 hover:text-blue-900">
                <X size={14} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              Search: {searchQuery}
              <button onClick={resetSearch} className="ml-1 hover:text-purple-900">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredItems.length === 0 ? (
        <div className="col-span-full text-center py-8 md:py-12">
          <Calendar className="mx-auto text-gray-400 mb-3 md:mb-4" size={40} />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No events found" : "No events found"}
          </h3>
          <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            {searchQuery 
              ? "No events match your search criteria" 
              : selectedAudience !== "all" 
                ? `No ${selectedAudience} events found` 
                : "Create your first event to get started"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pageItems.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{event.description}</p>
                </div>
                
                {canEdit && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(event._id)}
                      className="rounded-lg border border-gray-300 p-2 cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      title="Edit event"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(event._id)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAudienceColor(event.audience)}`}>
                    {getAudienceIcon(event.audience)} {event.audience}
                  </span>
                </div>

                {event.department && (
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>{event.department} Department</span>
                  </div>
                )}

                {event.semester && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>Semester {event.semester}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <Users size={16} />
                  <span className="text-xs text-gray-500">
                    Created {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <Pagination 
            page={page} 
            setPage={setPage} 
            total={filteredItems.length} 
            totalPages={totalPages} 
            start={start} 
            end={end} 
          />
        </div>
      )}

      {/* Event Modal */}
      <EventModal
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
      />
    </div>
  )
}

// Enhanced Event Modal Component
const EventModal = ({ isOpen, onClose, form, setForm, onSubmit, editingId, user }) => {
  const isCR = user?.role === "cr"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Update Event" : "Create New Event"}
      size="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Database Class Canceled, University Holiday, Important Meeting..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Make the title clear and descriptive so users understand the event quickly
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
              placeholder="Provide detailed information about the event, including reasons, instructions, or additional context..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Include all relevant details that users need to know about this event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

{/* Audience */}
<div>
  {user?.role === 'admin' && (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Audience <span className="text-red-500">*</span>
      </label>

      <select
        className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={form.audience}
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
        required
      >
        <option value="all">All University</option>
        <option value="department">Department Only</option>
        <option value="semester">Semester Only</option>
      </select>
    </>
  )}

  {user?.role === 'cr' && (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Audience <span className="text-red-500">*</span>
      </label>

      <select
        className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={form.audience}
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
        required
      >
        <option value="semester">Semester Only</option>
      </select>
    </>
  )}
</div>


       </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {/* Department */}
            <div className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                disabled={isCR} // Disable for CR users
                required
              >
                <option value="CS">Computer Science</option>
                <option value="SE">Software Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="EE">Electrical Engineering</option>
                <option value="ME">Mechanical Engineering</option>
              </select>
              {isCR && (
                <p className="text-xs text-blue-600 mt-1">
                  Department is automatically set to your department
                </p>
              )}
            </div>

            {form.audience === "semester" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  disabled={isCR} // Disable for CR users
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
                {isCR && (
                  <p className="text-xs text-blue-600 mt-1">
                    Semester is automatically set to your semester
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 cursor-pointer text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update Event" : "Create Event"}
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