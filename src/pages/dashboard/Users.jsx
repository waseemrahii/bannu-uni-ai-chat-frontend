
// import { useEffect, useState } from "react"
// import { useAuth } from "../../context/AuthContext"
// import { listUsers, deleteUser, registerCR } from "../../services/userService"
// import Modal  from "../../components/ui/Modal"

// const initial = {
//   name: "",
//   email: "",
//   password: "",
//   role: "cr",
//   className: "A",
//   department: "CS",
//   session: "",
//   semester: "",
//   rollNo: "",
//   phone: "",
//   gender: "male",
// }

// export default function Users() {
//   const { user } = useAuth()
//   const isAdmin = user?.role === "admin"
//   const [form, setForm] = useState(initial)
//   const [items, setItems] = useState([])
//   const [open, setOpen] = useState(false)

//   useEffect(() => {
//     if (isAdmin) load()
//   }, [isAdmin])

//   const load = async () => {
//     const data = await listUsers()
//     setItems(data)
//   }

//   const onSubmit = async (e) => {
//     e.preventDefault()
//     if (!isAdmin) return
//     await registerCR(form)
//     setForm(initial)
//     setOpen(false)
//     await load()
//   }

//   const onDelete = async (id) => {
//     if (!isAdmin) return
//     await deleteUser(id)
//     await load()
//   }

//   if (!isAdmin) {
//     return <div className="rounded-lg border bg-white p-4">Only Admin can manage users.</div>
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold">Users</h1>
//           <p className="text-gray-600">Add or remove CR users. All users listed below.</p>
//         </div>
//         <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={() => setOpen(true)}>
//           Add CR
//         </button>
//       </div>

//       <div className="overflow-x-auto rounded-lg border bg-white">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Role</th>
//               <th className="p-3 text-left">Semester</th>
//               <th className="p-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((u) => (
//               <tr key={u._id} className="border-t hover:bg-gray-50">
//                 <td className="p-3 font-medium">{u.name}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td className="p-3 capitalize">{u.role}</td>
//                 <td className="p-3">{u.semester || "—"}</td>
//                 <td className="p-3">
//                   <div className="flex justify-end">
//                     <button
//                       className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50"
//                       onClick={() => onDelete(u._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Class Representative">
//         <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             required
//           />
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Email"
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             required
//           />
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Password"
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             required
//           />
//           <select
//             className="rounded-md border px-3 py-2"
//             value={form.gender}
//             onChange={(e) => setForm({ ...form, gender: e.target.value })}
//           >
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//           <select
//             className="rounded-md border px-3 py-2"
//             value={form.className}
//             onChange={(e) => setForm({ ...form, className: e.target.value })}
//           >
//             <option>A</option>
//             <option>B</option>
//             <option>C</option>
//             <option>D</option>
//           </select>
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Department"
//             value={form.department}
//             onChange={(e) => setForm({ ...form, department: e.target.value })}
//           />
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Session (e.g. 2021-2025)"
//             value={form.session}
//             onChange={(e) => setForm({ ...form, session: e.target.value })}
//           />
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Semester"
//             value={form.semester}
//             onChange={(e) => setForm({ ...form, semester: e.target.value })}
//           />
//           <input
//             className="rounded-md border px-3 py-2"
//             placeholder="Roll No (optional)"
//             value={form.rollNo}
//             onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
//           />
//           <input
//             className="rounded-md border px-3 py-2 md:col-span-2"
//             placeholder="Phone"
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             required
//           />
//           <div className="md:col-span-2">
//             <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="submit">
//               Add CR
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }



import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter, X, Edit3, Trash2, User, Mail, Phone, GraduationCap, Shield, UserCheck, Hash } from "lucide-react"
import { listUsers, deleteUser, registerCR, getAllUsers } from "../../services/userService"
import { useAuth } from "../../context/AuthContext"
import Pagination, { usePagination } from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import toast from "react-hot-toast"

const initial = {
  name: "",
  email: "",
  password: "",
  role: "student",
  className: "A",
  department: "CS",
  session: "",
  semester: "",
  rollNo: "",
  phone: "",
  gender: "male",
}

const roles = [
  { value: "student", label: "Student", icon: "👨‍🎓", color: "bg-blue-100 text-blue-800" },
  { value: "cr", label: "Class Representative", icon: "👨‍💼", color: "bg-green-100 text-green-800" },
  { value: "admin", label: "Admin", icon: "🛡️", color: "bg-purple-100 text-purple-800" },
]

const classes = ["A", "B", "C", "D"]
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default function Users() {
  const { user } = useAuth()
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const isAdmin = user && user.role === "admin"

  // Load users
  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await getAllUsers()
      setUsers(res || [])
    } catch (error) {
      toast.error("Failed to load users")
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = !searchQuery || 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.rollNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const roleMatch = selectedRole === "all" || user.role === selectedRole
      const classMatch = selectedClass === "all" || user.className === selectedClass
      
      return searchMatch && roleMatch && classMatch
    })
  }, [users, searchQuery, selectedRole, selectedClass])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isAdmin) return

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        className: form.className,
        department: form.department,
        session: form.session,
        semester: form.semester,
        rollNo: form.rollNo,
        phone: form.phone,
        gender: form.gender,
      }

      if (editingId) {
        // For update, we might need a separate updateUser function
        // For now, we'll use the same register endpoint but you should create updateUser
        toast.error("Update functionality coming soon")
        return
      } else {
        await registerCR(payload)
        toast.success("User created successfully!")
      }

      setForm(initial)
      setEditingId(null)
      setOpen(false)
      await loadUsers()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create user"
      toast.error(errorMessage)
      console.error("Error saving user:", error)
    }
  }

  const onEdit = (user) => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "", // Don't fill password for security
      role: user.role || "student",
      className: user.className || "A",
      department: user.department || "CS",
      session: user.session || "",
      semester: user.semester || "",
      rollNo: user.rollNo || "",
      phone: user.phone || "",
      gender: user.gender || "male",
    })
    setEditingId(user._id)
    setOpen(true)
  }

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      await deleteUser(id)
      toast.success("User deleted successfully!")
      await loadUsers()
    } catch (error) {
      toast.error("Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  // Reset search
  const resetSearch = () => {
    setSearchQuery("")
  }

  // Use pagination
  const { page, setPage, total, totalPages, start, end, pageItems } = usePagination(
    filteredUsers, 
    8, 
    `${selectedRole}-${selectedClass}-${searchQuery}`
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

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage users, class representatives, and administrators</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
          </button>

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
            <Plus size={16} className="sm:size-[20px]" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">New</span>
          </motion.button>
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
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Role</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedRole("all")
                      setMobileFiltersOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
                      selectedRole === "all"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex-1 font-medium">All Roles</span>
                    {selectedRole === "all" && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => {
                        setSelectedRole(role.value)
                        setMobileFiltersOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left ${
                        selectedRole === role.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{role.icon}</span>
                      <span className="flex-1 font-medium">{role.label}</span>
                      {selectedRole === role.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

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
            </div>
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
            placeholder="Search by name, email, roll number, or phone..."
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

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

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
        </div>
      </div>

      {/* Active Filters Bar */}
      {(selectedRole !== "all" || selectedClass !== "all" || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {selectedRole !== "all" && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              Role: {roles.find(r => r.value === selectedRole)?.label}
              <button onClick={() => setSelectedRole("all")} className="ml-1 hover:text-blue-900">
                <X size={14} />
              </button>
            </span>
          )}
          {selectedClass !== "all" && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Class: {selectedClass}
              <button onClick={() => setSelectedClass("all")} className="ml-1 hover:text-green-900">
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
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredUsers.length === 0 ? (
        <div className="col-span-full text-center py-8 md:py-12">
          <UserCheck className="mx-auto text-gray-400 mb-3 md:mb-4" size={40} />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No users found" : "No users found"}
          </h3>
          <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            {searchQuery 
              ? "No users match your search criteria" 
              : "Add your first user to get started"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pageItems.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      roles.find(r => r.value === user.role)?.color || "bg-gray-100 text-gray-800"
                    }`}>
                      {roles.find(r => r.value === user.role)?.icon} {roles.find(r => r.value === user.role)?.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.rollNo && (
                      <div className="flex items-center gap-2">
                        <Hash size={16} />
                        <span>Roll: {user.rollNo}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {user.className && (
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        <span>Class {user.className}</span>
                      </div>
                    )}
                    {user.semester && (
                      <div className="flex items-center gap-2">
                        <span>Semester {user.semester}</span>
                      </div>
                    )}
                    {user.session && (
                      <div className="flex items-center gap-2">
                        <span>Session: {user.session}</span>
                      </div>
                    )}
                    {user.gender && (
                      <div className="flex items-center gap-2">
                        <span>Gender: {user.gender}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    title="Edit user"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                    title="Delete user"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <Pagination 
            page={page} 
            setPage={setPage} 
            total={filteredUsers.length} 
            totalPages={totalPages} 
            start={start} 
            end={end} 
          />
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
          setEditingId(null)
        }}
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        editingId={editingId}
      />
    </div>
  )
}

// User Modal Component
const UserModal = ({ 
  isOpen, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  editingId 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Update User" : "Add New User"}
      size="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password - Only show for new users */}
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingId}
                />
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter roll number"
                value={form.rollNo}
                onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>

            {/* Session */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2021-2025"
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update User" : "Create User"}
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