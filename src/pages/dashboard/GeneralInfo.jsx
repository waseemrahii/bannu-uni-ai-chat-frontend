import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter, X, Edit3, Trash2, Users, Building, BookOpen, Megaphone, Globe, Eye } from "lucide-react"
import { createGeneralInfo, listGeneralInfo, updateGeneralInfo, deleteGeneralInfo } from "../../services/generalInfoService"
import { useAuth } from "../../context/AuthContext"
import Pagination, { usePagination } from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import toast from "react-hot-toast"

const initial = {
  title: "",
  content: "",
  audience: "department",
  department: "CS",
  semester: "",
}

const audienceTypes = [
  { value: "all", label: "All University", icon: "🏛️" },
  { value: "department", label: "Department", icon: "🏢" },
  { value: "semester", label: "Semester", icon: "📚" }
]

export default function GeneralInfo() {
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
      const data = await listGeneralInfo({})
      // Sort by creation date (newest first)
      const sortedItems = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setItems(sortedItems)
    } catch (error) {
      toast.error("Failed to load information")
      console.error("Error loading general info:", error)
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
        content: form.content,
        audience: form.audience,
        department: form.department,
        semester: form.semester || undefined,
      }

      if (editingId) {
        await updateGeneralInfo(editingId, payload)
        toast.success("Information updated successfully!")
      } else {
        await createGeneralInfo(payload)
        toast.success("Information posted successfully!")
      }

      setForm(initial)
      setEditingId(null)
      setOpen(false)
      await load()
    } catch (error) {
      const errorMessage = error.response?.data?.message || (editingId ? "Failed to update information" : "Failed to post information")
      toast.error(errorMessage)
      console.error("Error saving information:", error)
    }
  }

  const onEdit = async (item) => {
    try {
      setForm({
        title: item.title || "",
        content: item.content || "",
        audience: item.audience || "department",
        department: item.department || "CS",
        semester: item.semester || "",
      })
      setEditingId(item._id)
      setOpen(true)
    } catch (error) {
      toast.error("Failed to load information for editing")
      console.error("Error loading information:", error)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this information?")) return

    try {
      await deleteGeneralInfo(id)
      toast.success("Information deleted successfully!")
      await load()
    } catch (error) {
      toast.error("Failed to delete information")
      console.error("Error deleting information:", error)
    }
  }

  // Filter items based on search and audience
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchMatch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const audienceMatch = selectedAudience === "all" || item.audience === selectedAudience
      
      return searchMatch && audienceMatch
    })
  }, [items, searchQuery, selectedAudience])

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
    return icons[audience] || "📢"
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Use pagination
  const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
    filteredItems, 
    8, 
    `${selectedAudience}-${searchQuery}`
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

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">General Information</h1>
          <p className="text-sm sm:text-base text-gray-600">Post important announcements and informational notes for students and staff</p>
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
              <span className="hidden sm:inline">New Post</span>
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
          placeholder="Search by title, content, or department..."
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
          <Megaphone className="mx-auto text-gray-400 mb-3 md:mb-4" size={40} />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No information found" : "No information posted yet"}
          </h3>
          <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            {searchQuery 
              ? "No information matches your search criteria" 
              : selectedAudience !== "all" 
                ? `No ${selectedAudience} information found` 
                : "Create your first information post to get started"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pageItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{item.title}</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      title="Edit information"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      title="Delete information"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAudienceColor(item.audience)}`}>
                    {getAudienceIcon(item.audience)} {item.audience}
                  </span>
                </div>

                {item.department && (
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>{item.department} Department</span>
                  </div>
                )}

                {item.semester && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>Semester {item.semester}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <Eye size={16} />
                  <span className="text-xs text-gray-500">
                    Posted {formatDate(item.createdAt)}
                  </span>
                </div>

                {item.createdBy?.name && (
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="text-xs text-gray-500">
                      By {item.createdBy.name} ({item.createdBy.role})
                    </span>
                  </div>
                )}
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

      {/* Information Modal */}
      <InfoModal
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

// Enhanced Info Modal Component
const InfoModal = ({ isOpen, onClose, form, setForm, onSubmit, editingId, user }) => {
  const isCR = user?.role === "cr"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Update Information" : "Create New Information"}
      size="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Important Notice, Exam Schedule Update, Holiday Announcement..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Make the title clear and descriptive so users understand the content quickly
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
              placeholder="Provide detailed information, announcements, or instructions. You can use plain text or basic formatting..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Include all relevant details that users need to know. Line breaks will be preserved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audience */}
            <div>
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
            </div>

            {/* Department */}
            <div>
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
          </div>

          {/* Semester - Only show for semester audience */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update Information" : "Post Information"}
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