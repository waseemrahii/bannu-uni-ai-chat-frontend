
// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { Trash2 } from "lucide-react"
// import { useAuth } from "../../context/AuthContext"
// import { listUsers, deleteUser, registerCR } from "../../services/userService"

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
//       <div>
//         <h1 className="text-2xl font-bold">Users</h1>
//         <p className="text-gray-600">Add or remove CR users. All users listed below.</p>
//       </div>

//       <motion.form
//         onSubmit={onSubmit}
//         initial={{ opacity: 0, y: 6 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="rounded-lg border bg-white p-4 grid gap-3 md:grid-cols-2"
//       >
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Email"
//           type="email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           required
//         />
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Password"
//           type="password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           required
//         />
//         <select
//           className="rounded-md border px-3 py-2"
//           value={form.gender}
//           onChange={(e) => setForm({ ...form, gender: e.target.value })}
//         >
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//         <select
//           className="rounded-md border px-3 py-2"
//           value={form.className}
//           onChange={(e) => setForm({ ...form, className: e.target.value })}
//         >
//           <option>A</option>
//           <option>B</option>
//           <option>C</option>
//           <option>D</option>
//         </select>
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Department"
//           value={form.department}
//           onChange={(e) => setForm({ ...form, department: e.target.value })}
//         />
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Session (e.g. 2021-2025)"
//           value={form.session}
//           onChange={(e) => setForm({ ...form, session: e.target.value })}
//         />
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Semester"
//           value={form.semester}
//           onChange={(e) => setForm({ ...form, semester: e.target.value })}
//         />
//         <input
//           className="rounded-md border px-3 py-2"
//           placeholder="Roll No (optional)"
//           value={form.rollNo}
//           onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
//         />
//         <input
//           className="rounded-md border px-3 py-2 md:col-span-2"
//           placeholder="Phone"
//           value={form.phone}
//           onChange={(e) => setForm({ ...form, phone: e.target.value })}
//           required
//         />
//         <div className="md:col-span-2">
//           <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="submit">
//             Add CR
//           </button>
//         </div>
//       </motion.form>

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
//               <tr key={u._id} className="border-t">
//                 <td className="p-3">{u.name}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td className="p-3 capitalize">{u.role}</td>
//                 <td className="p-3">{u.semester || "—"}</td>
//                 <td className="p-3">
//                   <div className="flex justify-end">
//                     <button
//                       className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50"
//                       onClick={() => onDelete(u._id)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { listUsers, deleteUser, registerCR } from "../../services/userService"
import Modal  from "../../components/ui/Modal"

const initial = {
  name: "",
  email: "",
  password: "",
  role: "cr",
  className: "A",
  department: "CS",
  session: "",
  semester: "",
  rollNo: "",
  phone: "",
  gender: "male",
}

export default function Users() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const [form, setForm] = useState(initial)
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isAdmin) load()
  }, [isAdmin])

  const load = async () => {
    const data = await listUsers()
    setItems(data)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isAdmin) return
    await registerCR(form)
    setForm(initial)
    setOpen(false)
    await load()
  }

  const onDelete = async (id) => {
    if (!isAdmin) return
    await deleteUser(id)
    await load()
  }

  if (!isAdmin) {
    return <div className="rounded-lg border bg-white p-4">Only Admin can manage users.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-600">Add or remove CR users. All users listed below.</p>
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={() => setOpen(true)}>
          Add CR
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.semester || "—"}</td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <button
                      className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(u._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Class Representative">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="rounded-md border px-3 py-2"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            className="rounded-md border px-3 py-2"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Session (e.g. 2021-2025)"
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Semester"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Roll No (optional)"
            value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2 md:col-span-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <div className="md:col-span-2">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="submit">
              Add CR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
