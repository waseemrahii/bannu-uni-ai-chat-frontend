// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { Search, Calendar, Grid, Table } from "lucide-react"
// import toast from "react-hot-toast"
// import {
//   listSchedules,
//   createSchedule,
//   updateSchedule,
//   deleteSchedule,
//   getScheduleById,
// } from "../../services/scheduleService"
// import { useAuth } from "../../context/AuthContext"
// import Pagination, { usePagination } from "../../components/ui/Pagination"
// import ScheduleTable from "../../components/dashboard/schedules/ScheduleTable"
// import ScheduleCards from "../../components/dashboard/schedules/ScheduleCards"
// import ScheduleModal from "../../components/dashboard/schedules/ScheduleModal"

// const initial = {
//   kind: "class",
//   title: "",
//   subject: "",
//   teacher: "",
//   className: "A",
//   semester: "",
//   session: "",
//   day: "",
//   date: "",
//   startTime: "09:00 AM",
//   endTime: "10:00 AM",
//   room: "",
//   dueDate: "",
//   submissionStart: "11:59 PM",
//   submissionEnd: "11:59 PM",
// }

// const daysOfWeek = [
//   "Monday", "Tuesday", "Wednesday", "Thursday", 
//   "Friday", "Saturday", "Sunday"
// ]

// const scheduleKinds = [
//   { value: "all", label: "All", icon: "📊" },
//   { value: "class", label: "Classes", icon: "📚" },
//   { value: "exam", label: "Exams", icon: "📝" },
//   { value: "assignment", label: "Assignments", icon: "📋" },
//   { value: "quiz", label: "Quizzes", icon: "❓" },
//   { value: "test", label: "Tests", icon: "✏️" }
// ]

// export default function Schedules() {
//   const { user } = useAuth()
//   const [allItems, setAllItems] = useState([]) // Store all items from API
//   const [filteredItems, setFilteredItems] = useState([]) // Store filtered items
//   const [form, setForm] = useState(initial)
//   const [editingId, setEditingId] = useState(null)
//   const [searchId, setSearchId] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [open, setOpen] = useState(false)
//   const [selectedDay, setSelectedDay] = useState("All")
//   const [selectedKind, setSelectedKind] = useState("all")
//   const [viewMode, setViewMode] = useState("table")
//   const canEdit = user && (user.role === "admin" || user.role === "cr")

//   const load = async () => {
//     setLoading(true)
//     try {
//       const res = await listSchedules({})
//       // Sort by creation date (newest first)
//       const sortedItems = res.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
//       setAllItems(sortedItems)
//     } catch (error) {
//       toast.error("Failed to load schedules")
//       console.error("Error loading schedules:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   // Apply filters whenever allItems, selectedKind, or selectedDay changes
//   useEffect(() => {
//     if (searchId) {
//       // If in search mode, don't apply other filters
//       return
//     }

//     const filtered = allItems.filter(item => {
//       const kindMatch = selectedKind === "all" || item.kind === selectedKind
//       const dayMatch = selectedDay === "All" || item.day === selectedDay
//       return kindMatch && dayMatch
//     })
    
//     setFilteredItems(filtered)
//   }, [allItems, selectedKind, selectedDay, searchId])

//   // const onSubmit = async (e) => {
//   //   e.preventDefault()
//   //   if (!canEdit) return

//   //   try {
//   //     // Prepare payload based on schedule type
//   //     let payload = {
//   //       kind: form.kind,
//   //       title: form.title,
//   //       subject: form.subject,
//   //       teacher: form.teacher || undefined,
//   //       className: user?.className || "A",
//   //       semester: user?.semester,
//   //       session: user?.session,
//   //       room: form.room || undefined,
//   //     }

//   //     // Add fields based on schedule type
//   //     if (form.kind === "class") {
//   //       payload.day = form.day
//   //       payload.startTime = form.startTime
//   //       payload.endTime = form.endTime
//   //     } else if (form.kind === "assignment") {
//   //       payload.dueDate = form.dueDate
//   //       payload.submissionStart = form.submissionStart
//   //       payload.submissionEnd = form.submissionEnd
//   //       // For assignments, we use date and auto-calculated day
//   //       payload.date = form.date
//   //       payload.day = form.day // This will be auto-calculated from date
//   //     } else {
//   //       // For exams, quizzes, tests
//   //       payload.date = form.date
//   //       payload.day = form.day // This will be auto-calculated from date
//   //       payload.startTime = form.startTime
//   //       payload.endTime = form.endTime
//   //     }

//   //     if (editingId) {
//   //       await updateSchedule(editingId, payload)
//   //       toast.success("Schedule updated successfully!")
//   //     } else {
//   //       await createSchedule(payload)
//   //       toast.success("Schedule created successfully!")
//   //     }

//   //     setForm(initial)
//   //     console.log("form data ", form)
//   //     setEditingId(null)
//   //     setOpen(false)
//   //     await load()
//   //   } catch (error) {
//   //     const errorMessage = error.response?.data?.message || (editingId ? "Failed to update schedule" : "Failed to create schedule")
//   //     toast.error(errorMessage)
//   //     console.error("Error saving schedule:", error)
//   //   }
//   // }

//   // In the onSubmit function, update the payload for classes:
// const onSubmit = async (e) => {
//   e.preventDefault()
//   if (!canEdit) return

//   try {
//     // Prepare payload based on schedule type
//     let payload = {
//       kind: form.kind,
//       title: form.title,
//       subject: form.subject,
//       teacher: form.teacher || undefined,
//       className: user?.className || "A",
//       semester: user?.semester,
//       session: user?.session,
//       room: form.room || undefined,
//     }

//     // Add fields based on schedule type
//     if (form.kind === "class") {
//       // For classes: include both date and day
//       payload.date = form.date
//       payload.day = form.day
//       payload.startTime = form.startTime
//       payload.endTime = form.endTime
//     } else if (form.kind === "assignment") {
//       payload.dueDate = form.dueDate
//       payload.submissionStart = form.submissionStart
//       payload.submissionEnd = form.submissionEnd
//       // For assignments, we use date and day
//       payload.date = form.date
//       payload.day = form.day
//     } else {
//       // For exams, quizzes, tests
//       payload.date = form.date
//       payload.day = form.day
//       payload.startTime = form.startTime
//       payload.endTime = form.endTime
//     }

//     if (editingId) {
//       await updateSchedule(editingId, payload)
//       toast.success("Schedule updated successfully!")
//     } else {
//       await createSchedule(payload)
//       toast.success("Schedule created successfully!")
//     }

//     setForm(initial)
//     setEditingId(null)
//     setOpen(false)
//     await load()
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || (editingId ? "Failed to update schedule" : "Failed to create schedule")
//     toast.error(errorMessage)
//     console.error("Error saving schedule:", error)
//   }
// }

//   const onEdit = async (id) => {
//     try {
//       const data = await getScheduleById(id)
//       setForm({
//         ...initial,
//         kind: data.kind || "class",
//         title: data.title || "",
//         subject: data.subject || "",
//         teacher: data.teacher || "",
//         day: data.day || "",
//         date: data.date ? data.date.substring(0, 10) : "",
//         startTime: data.startTime || "09:00 AM",
//         endTime: data.endTime || "10:00 AM",
//         room: data.room || "",
//         dueDate: data.dueDate ? data.dueDate.substring(0, 10) : "",
//         submissionStart: data.submissionStart || "11:59 PM",
//         submissionEnd: data.submissionEnd || "11:59 PM",
//       })
//       setEditingId(id)
//       setOpen(true)
//     } catch (error) {
//       toast.error("Failed to load schedule for editing")
//       console.error("Error loading schedule:", error)
//     }
//   }

//   const onDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this schedule?")) return

//     try {
//       await deleteSchedule(id)
//       toast.success("Schedule deleted successfully!")
//       await load()
//     } catch (error) {
//       toast.error("Failed to delete schedule")
//       console.error("Error deleting schedule:", error)
//     }
//   }

//   const onGetById = async (e) => {
//     e.preventDefault()
//     if (!searchId) {
//       toast.error("Please enter a schedule ID")
//       return
//     }

//     try {
//       const data = await getScheduleById(searchId)
//       setFilteredItems([data]) // Set filtered items to search result
//       toast.success("Schedule found!")
//     } catch (error) {
//       toast.error("Schedule not found")
//       setFilteredItems([]) // Clear results if not found
//       console.error("Error fetching schedule:", error)
//     }
//   }

//   // Use enhanced pagination with independent state per tab
//   const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
//     filteredItems, 
//     8, 
//     `${selectedKind}-${selectedDay}` // Unique key for each filter combination
//   )

//   const getKindColor = (kind) => {
//     const colors = {
//       class: "bg-blue-100 text-blue-800 border-blue-200",
//       exam: "bg-red-100 text-red-800 border-red-200",
//       assignment: "bg-green-100 text-green-800 border-green-200",
//       quiz: "bg-purple-100 text-purple-800 border-purple-200",
//       test: "bg-orange-100 text-orange-800 border-orange-200"
//     }
//     return colors[kind] || "bg-gray-100 text-gray-800 border-gray-200"
//   }

//   const getKindIcon = (kind) => {
//     const icons = {
//       class: "📚",
//       exam: "📝",
//       assignment: "📋",
//       quiz: "❓",
//       test: "✏️"
//     }
//     return icons[kind] || "📅"
//   }

//   // Reset search and show all schedules
//   const resetSearch = () => {
//     setSearchId("")
//     // Reset to show all items with current filters
//     const filtered = allItems.filter(item => {
//       const kindMatch = selectedKind === "all" || item.kind === selectedKind
//       const dayMatch = selectedDay === "All" || item.day === selectedDay
//       return kindMatch && dayMatch
//     })
//     setFilteredItems(filtered)
//   }

//   // Handle kind change - reset day filter when changing tabs
//   const handleKindChange = (kind) => {
//     setSelectedKind(kind)
//     setSelectedDay("All") // Reset day filter when changing tabs
//     setSearchId("") // Clear search when changing tabs
//   }

//   // Handle day change
//   const handleDayChange = (day) => {
//     setSelectedDay(day)
//     setSearchId("") // Clear search when changing day filter
//   }

//   // Get display items (either search results or paginated filtered items)
//   const displayItems = searchId ? filteredItems : pageItems

//   // Loading Skeleton
//   const LoadingSkeleton = () => (
//     <div className={viewMode === "cards" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : ""}>
//       {Array.from({ length: 8 }).map((_, index) => (
//         viewMode === "cards" ? (
//           <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//             <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
//             <div className="space-y-2">
//               <div className="h-3 bg-gray-200 rounded w-full"></div>
//               <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//               <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//             </div>
//           </div>
//         ) : (
//           <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//             <div className="space-y-3">
//               <div className="h-4 bg-gray-200 rounded w-full"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           </div>
//         )
//       ))}
//     </div>
//   )

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
//           <p className="text-gray-600">Manage your classes, exams, and assignments in one place</p>
//         </div>
//         <div className="flex items-center gap-3">
//           {/* View Mode Toggle */}
//           <div className="flex rounded-lg border  border-gray-300 bg-white p-1">
//             <button
//               onClick={() => setViewMode("cards")}
//               className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors ${
//                 viewMode === "cards" 
//                   ? "bg-university-blue text-white" 
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Grid size={16} />
//               Cards
//             </button>
//             <button
//               onClick={() => setViewMode("table")}
//               className={`flex items-center gap-2 px-3 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors ${
//                 viewMode === "table" 
//                   ? "bg-university-blue text-white" 
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Table size={16} />
//               Table
//             </button>
//           </div>

//           {canEdit && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="rounded-lg bg-blue-800 cursor-pointer px-6 py-3 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//               onClick={() => {
//                 setForm(initial)
//                 setEditingId(null)
//                 setOpen(true)
//               }}
//             >
//               <Calendar size={20} />
//               New Schedule
//             </motion.button>
//           )}
//         </div>
//       </div>

//       {/* Kind Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8 overflow-x-auto">
//           {scheduleKinds.map((kind) => (
//             <button
//               key={kind.value}
//               onClick={() => handleKindChange(kind.value)}
//               className={`whitespace-nowrap py-4 px-1 border-b-2 cursor-pointer font-medium text-sm flex items-center gap-2 ${
//                 selectedKind === kind.value
//                   ? "border-university-blue text-university-blue"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <span>{kind.icon}</span>
//               {kind.label}
//               {selectedKind === kind.value && filteredItems.length > 0 && (
//                 <span className="bg-university-blue text-white text-xs px-2 py-1 rounded-full">
//                   {filteredItems.length}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Search and Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <motion.form onSubmit={onGetById} className="flex items-center gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-transparent"
//               placeholder="Search by Schedule ID..."
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//             />
//           </div>
//           <button 
//             className="rounded-lg bg-gray-100 px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-200 transition-colors font-medium" 
//             type="submit"
//           >
//             Search
//           </button>
//           {searchId && (
//             <button 
//               type="button"
//               onClick={resetSearch}
//               className="rounded-lg bg-red-100 px-4 py-3 text-red-700 hover:bg-red-200 transition-colors font-medium"
//             >
//               Clear
//             </button>
//           )}
//         </motion.form>

//         {/* Day Filter */}
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700">Filter by Day:</span>
//             <select
//               value={selectedDay}
//               onChange={(e) => handleDayChange(e.target.value)}
//               className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-university-blue focus:border-transparent"
//             >
//               <option value="All">All Days</option>
//               {daysOfWeek.map(day => (
//                 <option key={day} value={day}>{day}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <LoadingSkeleton />
//       ) : displayItems.length === 0 ? (
//         <div className="col-span-full text-center py-12">
//           <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             {searchId ? "No schedule found" : "No schedules found"}
//           </h3>
//           <p className="text-gray-600">
//             {searchId 
//               ? "No schedule found with the given ID" 
//               : selectedKind !== "all" 
//                 ? `No ${selectedKind}s found` 
//                 : "Create your first schedule to get started"
//             }
//           </p>
//         </div>
//       ) : (
//         <>
//           {viewMode === "cards" ? (
//             <ScheduleCards
//               schedules={displayItems}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               canEdit={canEdit}
//               getKindColor={getKindColor}
//               getKindIcon={getKindIcon}
//             />
//           ) : (
//             <ScheduleTable
//               schedules={displayItems}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               canEdit={canEdit}
//               getKindColor={getKindColor}
//               getKindIcon={getKindIcon}
//             />
//           )}
//         </>
//       )}

//       {/* Pagination - Only show for non-search results and when there are multiple pages */}
//       {!searchId && filteredItems.length > 0 && totalPages > 1 && (
//         <div className="mt-6">
//           <Pagination 
//             page={page} 
//             setPage={setPage} 
//             total={filteredItems.length} 
//             totalPages={totalPages} 
//             start={start} 
//             end={end} 
//           />
//         </div>
//       )}

//       {/* Schedule Modal */}
//       <ScheduleModal
//         isOpen={open}
//         onClose={() => {
//           setOpen(false)
//           setEditingId(null)
//         }}
//         form={form}
//         setForm={setForm}
//         onSubmit={onSubmit}
//         editingId={editingId}
//         user={user}
//       />
//     </div>
//   )
// }

// import { useEffect, useState, useMemo, lazy, Suspense } from "react"
// import { motion } from "framer-motion"
// import { Search, Calendar, Grid, Table, Filter, X } from "lucide-react"
// import toast from "react-hot-toast"
// import {
//   listSchedules,
//   createSchedule,
//   updateSchedule,
//   deleteSchedule,
//   getScheduleById,
// } from "../../services/scheduleService"
// import { useAuth } from "../../context/AuthContext"
// import Pagination, { usePagination } from "../../components/ui/Pagination"
// import ScheduleModal from "../../components/dashboard/schedules/ScheduleModal"

// // Lazy load components
// const ScheduleTable = lazy(() => import("../../components/dashboard/schedules/ScheduleTable"))
// const ScheduleCards = lazy(() => import("../../components/dashboard/schedules/ScheduleCards"))

// const initial = {
//   kind: "class",
//   title: "",
//   subject: "",
//   teacher: "",
//   className: "A",
//   semester: "",
//   session: "",
//   day: "",
//   date: "",
//   startTime: "09:00 AM",
//   endTime: "10:00 AM",
//   room: "",
//   dueDate: "",
//   submissionStart: "11:59 PM",
//   submissionEnd: "11:59 PM",
// }

// const daysOfWeek = [
//   "Monday", "Tuesday", "Wednesday", "Thursday", 
//   "Friday", "Saturday", "Sunday"
// ]

// const scheduleKinds = [
//   { value: "all", label: "All", icon: "📊" },
//   { value: "class", label: "Classes", icon: "📚" },
//   { value: "exam", label: "Exams", icon: "📝" },
//   { value: "assignment", label: "Assignments", icon: "📋" },
//   { value: "quiz", label: "Quizzes", icon: "❓" },
//   { value: "test", label: "Tests", icon: "✏️" }
// ]

// // Memoized filter functions
// const filterSchedules = (items, selectedKind, selectedDay, searchQuery) => {
//   return items.filter(item => {
//     const kindMatch = selectedKind === "all" || item.kind === selectedKind
//     const dayMatch = selectedDay === "All" || item.day === selectedDay
//     const searchMatch = !searchQuery || 
//       item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.kind?.toLowerCase().includes(searchQuery.toLowerCase())
    
//     return kindMatch && dayMatch && searchMatch
//   })
// }

// // Loading Skeleton Component
// const LoadingSkeleton = ({ viewMode }) => (
//   <div className={viewMode === "cards" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : ""}>
//     {Array.from({ length: 8 }).map((_, index) => (
//       viewMode === "cards" ? (
//         <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 animate-pulse">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-gray-200 rounded"></div>
//               <div className="h-6 bg-gray-200 rounded w-16"></div>
//             </div>
//             <div className="flex gap-1">
//               <div className="w-6 h-6 bg-gray-200 rounded"></div>
//               <div className="w-6 h-6 bg-gray-200 rounded"></div>
//             </div>
//           </div>
//           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//           <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
//           <div className="space-y-2">
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//             <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//             <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//           </div>
//         </div>
//       ) : (
//         <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 animate-pulse">
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         </div>
//       )
//     ))}
//   </div>
// )

// export default function Schedules() {
//   const { user } = useAuth()
//   const [allItems, setAllItems] = useState([])
//   const [form, setForm] = useState(initial)
//   const [editingId, setEditingId] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [open, setOpen] = useState(false)
//   const [selectedDay, setSelectedDay] = useState("All")
//   const [selectedKind, setSelectedKind] = useState("all")
//   const [viewMode, setViewMode] = useState("table")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
//   const canEdit = user && (user.role === "admin" || user.role === "cr")

//   // Memoized filtered items
//   const filteredItems = useMemo(() => 
//     filterSchedules(allItems, selectedKind, selectedDay, searchQuery),
//     [allItems, selectedKind, selectedDay, searchQuery]
//   )

//   const load = async () => {
//     setLoading(true)
//     try {
//       const res = await listSchedules({})
//       const sortedItems = res.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
//       setAllItems(sortedItems)
//     } catch (error) {
//       toast.error("Failed to load schedules")
//       console.error("Error loading schedules:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   const onSubmit = async (e) => {
//     e.preventDefault()
//     if (!canEdit) return

//     try {
//       let payload = {
//         kind: form.kind,
//         title: form.title,
//         subject: form.subject,
//         teacher: form.teacher || undefined,
//         className: user?.className || "A",
//         semester: user?.semester,
//         session: user?.session,
//         room: form.room || undefined,
//       }

//       if (form.kind === "class") {
//         payload.date = form.date
//         payload.day = form.day
//         payload.startTime = form.startTime
//         payload.endTime = form.endTime
//       } else if (form.kind === "assignment") {
//         payload.dueDate = form.dueDate
//         payload.submissionStart = form.submissionStart
//         payload.submissionEnd = form.submissionEnd
//         payload.date = form.date
//         payload.day = form.day
//       } else {
//         payload.date = form.date
//         payload.day = form.day
//         payload.startTime = form.startTime
//         payload.endTime = form.endTime
//       }

//       if (editingId) {
//         await updateSchedule(editingId, payload)
//         toast.success("Schedule updated successfully!")
//       } else {
//         await createSchedule(payload)
//         toast.success("Schedule created successfully!")
//       }

//       setForm(initial)
//       setEditingId(null)
//       setOpen(false)
//       await load()
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || (editingId ? "Failed to update schedule" : "Failed to create schedule")
//       toast.error(errorMessage)
//       console.error("Error saving schedule:", error)
//     }
//   }

//   const onEdit = async (id) => {
//     try {
//       const data = await getScheduleById(id)
//       setForm({
//         ...initial,
//         kind: data.kind || "class",
//         title: data.title || "",
//         subject: data.subject || "",
//         teacher: data.teacher || "",
//         day: data.day || "",
//         date: data.date ? data.date.substring(0, 10) : "",
//         startTime: data.startTime || "09:00 AM",
//         endTime: data.endTime || "10:00 AM",
//         room: data.room || "",
//         dueDate: data.dueDate ? data.dueDate.substring(0, 10) : "",
//         submissionStart: data.submissionStart || "11:59 PM",
//         submissionEnd: data.submissionEnd || "11:59 PM",
//       })
//       setEditingId(id)
//       setOpen(true)
//     } catch (error) {
//       toast.error("Failed to load schedule for editing")
//       console.error("Error loading schedule:", error)
//     }
//   }

//   const onDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this schedule?")) return

//     try {
//       await deleteSchedule(id)
//       toast.success("Schedule deleted successfully!")
//       await load()
//     } catch (error) {
//       toast.error("Failed to delete schedule")
//       console.error("Error deleting schedule:", error)
//     }
//   }

//   const handleKindChange = (kind) => {
//     setSelectedKind(kind)
//     setSelectedDay("All")
//     setSearchQuery("")
//   }

//   const handleDayChange = (day) => {
//     setSelectedDay(day)
//     setSearchQuery("")
//   }

//   const resetSearch = () => {
//     setSearchQuery("")
//   }

//   // Use pagination
//   const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
//     filteredItems, 
//     8, 
//     `${selectedKind}-${selectedDay}-${searchQuery}`
//   )

//   const getKindColor = (kind) => {
//     const colors = {
//       class: "bg-blue-100 text-blue-800 border-blue-200",
//       exam: "bg-red-100 text-red-800 border-red-200",
//       assignment: "bg-green-100 text-green-800 border-green-200",
//       quiz: "bg-purple-100 text-purple-800 border-purple-200",
//       test: "bg-orange-100 text-orange-800 border-orange-200"
//     }
//     return colors[kind] || "bg-gray-100 text-gray-800 border-gray-200"
//   }

//   const getKindIcon = (kind) => {
//     const icons = {
//       class: "📚",
//       exam: "📝",
//       assignment: "📋",
//       quiz: "❓",
//       test: "✏️"
//     }
//     return icons[kind] || "📅"
//   }

//   return (
//     <div className="space-y-4 md:space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div className="flex-1 min-w-0">
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Class Schedule</h1>
//           <p className="text-sm sm:text-base text-gray-600">Manage your classes, exams, and assignments in one place</p>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
//           {/* View Mode Toggle */}
//           <div className="flex rounded-lg border border-gray-300 bg-white p-1">
//             <button
//               onClick={() => setViewMode("cards")}
//               className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 cursor-pointer rounded-md text-xs sm:text-sm font-medium transition-colors ${
//                 viewMode === "cards" 
//                   ? "bg-blue-600 text-white" 
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Grid size={14} className="sm:size-[16px]" />
//               <span className="hidden sm:inline">Cards</span>
//             </button>
//             <button
//               onClick={() => setViewMode("table")}
//               className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 cursor-pointer rounded-md text-xs sm:text-sm font-medium transition-colors ${
//                 viewMode === "table" 
//                   ? "bg-blue-600 text-white" 
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Table size={14} className="sm:size-[16px]" />
//               <span className="hidden sm:inline">Table</span>
//             </button>
//           </div>

//           {/* Mobile Filter Button */}
//           <button
//             onClick={() => setMobileFiltersOpen(true)}
//             className="md:hidden rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             <Filter size={18} />
//           </button>

//           {canEdit && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="rounded-lg bg-blue-600 cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
//               onClick={() => {
//                 setForm(initial)
//                 setEditingId(null)
//                 setOpen(true)
//               }}
//             >
//               <Calendar size={16} className="sm:size-[20px]" />
//               <span className="hidden sm:inline">New Schedule</span>
//               <span className="sm:hidden">New</span>
//             </motion.button>
//           )}
//         </div>
//       </div>

//       {/* Mobile Filters Overlay */}
//       {mobileFiltersOpen && (
//         <div className="fixed inset-0 z-50 md:hidden">
//           <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
//           <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h2 className="text-lg font-semibold">Filters</h2>
//               <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="p-4 space-y-6">
//               {/* Kind Tabs for Mobile */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900 mb-3">Type</h3>
//                 <div className="space-y-2">
//                   {scheduleKinds.map((kind) => (
//                     <button
//                       key={kind.value}
//                       onClick={() => {
//                         handleKindChange(kind.value)
//                         setMobileFiltersOpen(false)
//                       }}
//                       className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
//                         selectedKind === kind.value
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:bg-gray-50"
//                       }`}
//                     >
//                       <span className="text-lg">{kind.icon}</span>
//                       <span className="flex-1 font-medium">{kind.label}</span>
//                       {selectedKind === kind.value && (
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Day Filter for Mobile */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Day</h3>
//                 <select
//                   value={selectedDay}
//                   onChange={(e) => {
//                     handleDayChange(e.target.value)
//                     setMobileFiltersOpen(false)
//                   }}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="All">All Days</option>
//                   {daysOfWeek.map(day => (
//                     <option key={day} value={day}>{day}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Kind Tabs - Desktop */}
//       <div className="hidden md:block border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8 overflow-x-auto">
//           {scheduleKinds.map((kind) => (
//             <button
//               key={kind.value}
//               onClick={() => handleKindChange(kind.value)}
//               className={`whitespace-nowrap py-4 px-1 border-b-2 cursor-pointer font-medium text-sm flex items-center gap-2 ${
//                 selectedKind === kind.value
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <span>{kind.icon}</span>
//               {kind.label}
//               {selectedKind === kind.value && filteredItems.length > 0 && (
//                 <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
//                   {filteredItems.length}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Search and Filters */}
//       <div className="grid grid-cols-1 gap-4">
//         {/* Search Bar */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Search by title, subject, teacher, or type..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           {searchQuery && (
//             <button 
//               type="button"
//               onClick={resetSearch}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
//             >
//               Clear
//             </button>
//           )}
//         </div>

//         {/* Desktop Day Filter */}
//         <div className="hidden md:flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700">Filter by Day:</span>
//             <select
//               value={selectedDay}
//               onChange={(e) => handleDayChange(e.target.value)}
//               className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="All">All Days</option>
//               {daysOfWeek.map(day => (
//                 <option key={day} value={day}>{day}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Active Filters Bar */}
//       {(selectedKind !== "all" || selectedDay !== "All" || searchQuery) && (
//         <div className="flex flex-wrap gap-2">
//           {selectedKind !== "all" && (
//             <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
//               Type: {scheduleKinds.find(k => k.value === selectedKind)?.label}
//               <button onClick={() => setSelectedKind("all")} className="ml-1 hover:text-blue-900">
//                 <X size={14} />
//               </button>
//             </span>
//           )}
//           {selectedDay !== "All" && (
//             <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
//               Day: {selectedDay}
//               <button onClick={() => setSelectedDay("All")} className="ml-1 hover:text-green-900">
//                 <X size={14} />
//               </button>
//             </span>
//           )}
//           {searchQuery && (
//             <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
//               Search: {searchQuery}
//               <button onClick={resetSearch} className="ml-1 hover:text-purple-900">
//                 <X size={14} />
//               </button>
//             </span>
//           )}
//         </div>
//       )}

//       {/* Content */}
//       {loading ? (
//         <LoadingSkeleton viewMode={viewMode} />
//       ) : filteredItems.length === 0 ? (
//         <div className="col-span-full text-center py-8 md:py-12">
//           <Calendar className="mx-auto text-gray-400 mb-3 md:mb-4" size={40} />
//           <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
//             {searchQuery ? "No schedules found" : "No schedules found"}
//           </h3>
//           <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
//             {searchQuery 
//               ? "No schedules match your search criteria" 
//               : selectedKind !== "all" 
//                 ? `No ${selectedKind}s found for the selected filters` 
//                 : "Create your first schedule to get started"
//             }
//           </p>
//         </div>
//       ) : (
//         <Suspense fallback={<LoadingSkeleton viewMode={viewMode} />}>
//           {viewMode === "cards" ? (
//             <ScheduleCards
//               schedules={pageItems}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               canEdit={canEdit}
//               getKindColor={getKindColor}
//               getKindIcon={getKindIcon}
//             />
//           ) : (
//             <ScheduleTable
//               schedules={pageItems}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               canEdit={canEdit}
//               getKindColor={getKindColor}
//               getKindIcon={getKindIcon}
//             />
//           )}
//         </Suspense>
//       )}

//       {/* Pagination */}
//       {filteredItems.length > 0 && totalPages > 1 && (
//         <div className="mt-6">
//           <Pagination 
//             page={page} 
//             setPage={setPage} 
//             total={filteredItems.length} 
//             totalPages={totalPages} 
//             start={start} 
//             end={end} 
//           />
//         </div>
//       )}

//       {/* Schedule Modal */}
//       <ScheduleModal
//         isOpen={open}
//         onClose={() => {
//           setOpen(false)
//           setEditingId(null)
//         }}
//         form={form}
//         setForm={setForm}
//         onSubmit={onSubmit}
//         editingId={editingId}
//         user={user}
//       />
//     </div>
//   )
// }


import { useEffect, useState, useMemo, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Grid, Table, Filter, X } from "lucide-react"
import toast from "react-hot-toast"
import {
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleById,
} from "../../services/scheduleService"
import { useAuth } from "../../context/AuthContext"
import Pagination, { usePagination } from "../../components/ui/Pagination"
import ScheduleModal from "../../components/dashboard/schedules/ScheduleModal"

// Fix lazy loading with proper error handling
const ScheduleTable = lazy(() => 
  import("../../components/dashboard/schedules/ScheduleTable")
    .then(module => ({ default: module.default }))
    .catch(error => {
      console.error("Failed to load ScheduleTable:", error);
      return { default: () => <div>Failed to load table view</div> };
    })
);

const ScheduleCards = lazy(() => 
  import("../../components/dashboard/schedules/ScheduleCards")
    .then(module => ({ default: module.default }))
    .catch(error => {
      console.error("Failed to load ScheduleCards:", error);
      return { default: () => <div>Failed to load cards view</div> };
    })
);

const initial = {
  kind: "class",
  title: "",
  subject: "",
  teacher: "",
  className: "A",
  semester: "",
  session: "",
  day: "",
  date: "",
  startTime: "09:00 AM",
  endTime: "10:00 AM",
  room: "",
  dueDate: "",
  submissionStart: "11:59 PM",
  submissionEnd: "11:59 PM",
}

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", 
  "Friday", "Saturday", "Sunday"
]

const scheduleKinds = [
  { value: "all", label: "All", icon: "📊" },
  { value: "class", label: "Classes", icon: "📚" },
  { value: "exam", label: "Exams", icon: "📝" },
  { value: "assignment", label: "Assignments", icon: "📋" },
  { value: "quiz", label: "Quizzes", icon: "❓" },
  { value: "test", label: "Tests", icon: "✏️" }
]

// Memoized filter functions
const filterSchedules = (items, selectedKind, selectedDay, searchQuery) => {
  return items.filter(item => {
    const kindMatch = selectedKind === "all" || item.kind === selectedKind
    const dayMatch = selectedDay === "All" || item.day === selectedDay
    const searchMatch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kind?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return kindMatch && dayMatch && searchMatch
  })
}

// Loading Skeleton Component
const LoadingSkeleton = ({ viewMode }) => (
  <div className={viewMode === "cards" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : ""}>
    {Array.from({ length: 8 }).map((_, index) => (
      viewMode === "cards" ? (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ) : (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )
    ))}
  </div>
)

// Error boundary fallback component
const ComponentErrorFallback = ({ componentName }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <div className="text-red-600 font-medium mb-2">Failed to load {componentName}</div>
    <p className="text-red-500 text-sm">Please refresh the page or try again later.</p>
  </div>
)

export default function Schedules() {
  const { user } = useAuth()
  const [allItems, setAllItems] = useState([])
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState("All")
  const [selectedKind, setSelectedKind] = useState("all")
  const [viewMode, setViewMode] = useState("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const canEdit = user && (user.role === "admin" || user.role === "cr")

  // Memoized filtered items
  const filteredItems = useMemo(() => 
    filterSchedules(allItems, selectedKind, selectedDay, searchQuery),
    [allItems, selectedKind, selectedDay, searchQuery]
  )

  const load = async () => {
    setLoading(true)
    try {
      const res = await listSchedules({})
      const sortedItems = res.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
      setAllItems(sortedItems)
    } catch (error) {
      toast.error("Failed to load schedules")
      console.error("Error loading schedules:", error)
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
      let payload = {
        kind: form.kind,
        title: form.title,
        subject: form.subject,
        teacher: form.teacher || undefined,
        className: user?.className || "A",
        semester: user?.semester,
        session: user?.session,
        room: form.room || undefined,
      }

      if (form.kind === "class") {
        payload.date = form.date
        payload.day = form.day
        payload.startTime = form.startTime
        payload.endTime = form.endTime
      } else if (form.kind === "assignment") {
        payload.dueDate = form.dueDate
        payload.submissionStart = form.submissionStart
        payload.submissionEnd = form.submissionEnd
        payload.date = form.date
        payload.day = form.day
      } else {
        payload.date = form.date
        payload.day = form.day
        payload.startTime = form.startTime
        payload.endTime = form.endTime
      }

      if (editingId) {
        await updateSchedule(editingId, payload)
        toast.success("Schedule updated successfully!")
      } else {
        await createSchedule(payload)
        toast.success("Schedule created successfully!")
      }

      setForm(initial)
      setEditingId(null)
      setOpen(false)
      await load()
    } catch (error) {
      const errorMessage = error.response?.data?.message || (editingId ? "Failed to update schedule" : "Failed to create schedule")
      toast.error(errorMessage)
      console.error("Error saving schedule:", error)
    }
  }

  const onEdit = async (id) => {
    try {
      const data = await getScheduleById(id)
      setForm({
        ...initial,
        kind: data.kind || "class",
        title: data.title || "",
        subject: data.subject || "",
        teacher: data.teacher || "",
        day: data.day || "",
        date: data.date ? data.date.substring(0, 10) : "",
        startTime: data.startTime || "09:00 AM",
        endTime: data.endTime || "10:00 AM",
        room: data.room || "",
        dueDate: data.dueDate ? data.dueDate.substring(0, 10) : "",
        submissionStart: data.submissionStart || "11:59 PM",
        submissionEnd: data.submissionEnd || "11:59 PM",
      })
      setEditingId(id)
      setOpen(true)
    } catch (error) {
      toast.error("Failed to load schedule for editing")
      console.error("Error loading schedule:", error)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return

    try {
      await deleteSchedule(id)
      toast.success("Schedule deleted successfully!")
      await load()
    } catch (error) {
      toast.error("Failed to delete schedule")
      console.error("Error deleting schedule:", error)
    }
  }

  const handleKindChange = (kind) => {
    setSelectedKind(kind)
    setSelectedDay("All")
    setSearchQuery("")
  }

  const handleDayChange = (day) => {
    setSelectedDay(day)
    setSearchQuery("")
  }

  const resetSearch = () => {
    setSearchQuery("")
  }

  // Use pagination
  const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
    filteredItems, 
    8, 
    `${selectedKind}-${selectedDay}-${searchQuery}`
  )

  const getKindColor = (kind) => {
    const colors = {
      class: "bg-blue-100 text-blue-800 border-blue-200",
      exam: "bg-red-100 text-red-800 border-red-200",
      assignment: "bg-green-100 text-green-800 border-green-200",
      quiz: "bg-purple-100 text-purple-800 border-purple-200",
      test: "bg-orange-100 text-orange-800 border-orange-200"
    }
    return colors[kind] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getKindIcon = (kind) => {
    const icons = {
      class: "📚",
      exam: "📝",
      assignment: "📋",
      quiz: "❓",
      test: "✏️"
    }
    return icons[kind] || "📅"
  }

  // Render content based on view mode with proper error handling
  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton viewMode={viewMode} />
    }

    if (filteredItems.length === 0) {
      return (
        <div className="col-span-full text-center py-8 md:py-12">
          <Calendar className="mx-auto text-gray-400 mb-3 md:mb-4" size={40} />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No schedules found" : "No schedules found"}
          </h3>
          <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            {searchQuery 
              ? "No schedules match your search criteria" 
              : selectedKind !== "all" 
                ? `No ${selectedKind}s found for the selected filters` 
                : "Create your first schedule to get started"
            }
          </p>
        </div>
      )
    }

    try {
      return (
        <Suspense fallback={<LoadingSkeleton viewMode={viewMode} />}>
          {viewMode === "cards" ? (
            <ScheduleCards
              schedules={pageItems}
              onEdit={onEdit}
              onDelete={onDelete}
              canEdit={canEdit}
              getKindColor={getKindColor}
              getKindIcon={getKindIcon}
            />
          ) : (
            <ScheduleTable
              schedules={pageItems}
              onEdit={onEdit}
              onDelete={onDelete}
              canEdit={canEdit}
              getKindColor={getKindColor}
              getKindIcon={getKindIcon}
            />
          )}
        </Suspense>
      )
    } catch (error) {
      console.error("Error rendering schedule view:", error)
      return <ComponentErrorFallback componentName={viewMode === "cards" ? "cards view" : "table view"} />
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Class Schedule</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your classes, exams, and assignments in one place</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 cursor-pointer rounded-md text-xs sm:text-sm font-medium transition-colors ${
                viewMode === "cards" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid size={14} className="sm:size-[16px]" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 cursor-pointer rounded-md text-xs sm:text-sm font-medium transition-colors ${
                viewMode === "table" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Table size={14} className="sm:size-[16px]" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

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
                setForm(initial)
                setEditingId(null)
                setOpen(true)
              }}
            >
              <Calendar size={16} className="sm:size-[20px]" />
              <span className="hidden sm:inline">New Schedule</span>
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
              {/* Kind Tabs for Mobile */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Type</h3>
                <div className="space-y-2">
                  {scheduleKinds.map((kind) => (
                    <button
                      key={kind.value}
                      onClick={() => {
                        handleKindChange(kind.value)
                        setMobileFiltersOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
                        selectedKind === kind.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{kind.icon}</span>
                      <span className="flex-1 font-medium">{kind.label}</span>
                      {selectedKind === kind.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Filter for Mobile */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Day</h3>
                <select
                  value={selectedDay}
                  onChange={(e) => {
                    handleDayChange(e.target.value)
                    setMobileFiltersOpen(false)
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Days</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kind Tabs - Desktop */}
      <div className="hidden md:block border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {scheduleKinds.map((kind) => (
            <button
              key={kind.value}
              onClick={() => handleKindChange(kind.value)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 cursor-pointer font-medium text-sm flex items-center gap-2 ${
                selectedKind === kind.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{kind.icon}</span>
              {kind.label}
              {selectedKind === kind.value && filteredItems.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {filteredItems.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by title, subject, teacher, or type..."
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

        {/* Desktop Day Filter */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => handleDayChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Days</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {(selectedKind !== "all" || selectedDay !== "All" || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {selectedKind !== "all" && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              Type: {scheduleKinds.find(k => k.value === selectedKind)?.label}
              <button onClick={() => setSelectedKind("all")} className="ml-1 hover:text-blue-900">
                <X size={14} />
              </button>
            </span>
          )}
          {selectedDay !== "All" && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Day: {selectedDay}
              <button onClick={() => setSelectedDay("All")} className="ml-1 hover:text-green-900">
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
      {renderContent()}

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

      {/* Schedule Modal */}
      <ScheduleModal
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