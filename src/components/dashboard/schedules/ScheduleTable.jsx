
// import React from 'react'
// import { Edit3, Trash2, BookOpen, Calendar, Clock, MapPin } from 'lucide-react'

// const ScheduleTable = ({ schedules, onEdit, onDelete, canEdit, getKindColor, getKindIcon }) => {
//   // Function to format date properly
//   const formatDate = (dateString) => {
//     if (!dateString) return ''
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-gray-900">Type</th>
//               <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-gray-900">Title & Subject</th>
//               <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-gray-900">Teacher</th>
//               <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-gray-900">Schedule</th>
//               <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-gray-900">Room</th>
//               {canEdit && <th className="px-3 py-3 md:px-6 md:py-4 text-right text-sm font-semibold text-gray-900">Actions</th>}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {schedules.map((schedule) => (
//               <tr key={schedule._id} className="hover:bg-gray-50 transition-colors">
//                 <td className="whitespace-nowrap px-3 py-3 md:px-6 md:py-4">
//                   <div className="flex items-center gap-2">
//                     <span className="text-lg">{getKindIcon(schedule.kind)}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getKindColor(schedule.kind)}`}>
//                       {schedule.kind}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-3 py-3 md:px-6 md:py-4">
//                   <div>
//                     <div className="font-medium text-gray-900 text-sm md:text-base">{schedule.title}</div>
//                     <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1 mt-1">
//                       <BookOpen size={14} />
//                       {schedule.subject}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-3 py-3 md:px-6 md:py-4">
//                   <div className="text-sm text-gray-900">{schedule.teacher || "—"}</div>
//                 </td>
//                 <td className="px-3 py-3 md:px-6 md:py-4">
//                   <div className="space-y-1">
//                     <div className="flex flex-col gap-1 text-sm text-gray-600">
//                       <div className="flex items-center gap-2">
//                         <Calendar size={14} />
//                         <span className="font-medium">{schedule.day}</span>
//                       </div>
//                       {schedule.date && (
//                         <div className="text-xs text-gray-500 pl-6">
//                           Date: {formatDate(schedule.date)}
//                         </div>
//                       )}
//                       {schedule.dueDate && (
//                         <div className="text-xs text-red-600 pl-6">
//                           Due: {formatDate(schedule.dueDate)}
//                         </div>
//                       )}
//                     </div>
//                     {(schedule.startTime || schedule.endTime) && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Clock size={14} />
//                         <span>{schedule.startTime} - {schedule.endTime}</span>
//                       </div>
//                     )}
//                     {(schedule.submissionStart || schedule.submissionEnd) && (
//                       <div className="flex items-center gap-2 text-xs text-green-600">
//                         <Clock size={12} />
//                         <span>Sub: {schedule.submissionStart} - {schedule.submissionEnd}</span>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="px-3 py-3 md:px-6 md:py-4">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <MapPin size={14} />
//                     <span>{schedule.room || "—"}</span>
//                   </div>
//                 </td>
//                 {canEdit && (
//                   <td className="whitespace-nowrap px-3 py-3 md:px-6 md:py-4 text-right">
//                     <div className="flex justify-end gap-1 md:gap-2">
//                       <button
//                         onClick={() => onEdit(schedule._id)}
//                         className="rounded-lg border border-gray-300 p-1 md:p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//                         title="Edit schedule"
//                       >
//                         <Edit3 size={14} className="md:size-[16px]" />
//                       </button>
//                       <button
//                         onClick={() => onDelete(schedule._id)}
//                         className="rounded-lg border border-gray-300 p-1 md:p-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
//                         title="Delete schedule"
//                       >
//                         <Trash2 size={14} className="md:size-[16px]" />
//                       </button>
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default ScheduleTable

import React, { memo } from 'react'
import { Edit3, Trash2, BookOpen, Calendar, Clock, MapPin, MoreVertical } from 'lucide-react'

const ScheduleTable = memo(({ schedules, onEdit, onDelete, canEdit, getKindColor, getKindIcon }) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="hidden xs:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              {canEdit && <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {schedules.map((schedule) => (
              <tr key={schedule._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getKindIcon(schedule.kind)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getKindColor(schedule.kind)} hidden xs:inline`}>
                      {schedule.kind}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm line-clamp-2">{schedule.title}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <BookOpen size={12} />
                      <span className="truncate">{schedule.subject}</span>
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 mt-1">
                      {schedule.teacher || "—"}
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-3 py-4">
                  <div className="text-sm text-gray-900 truncate">{schedule.teacher || "—"}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar size={12} />
                      <span className="font-medium truncate">{schedule.day}</span>
                    </div>
                    {schedule.date && (
                      <div className="text-xs text-gray-500">
                        {formatDate(schedule.date)}
                      </div>
                    )}
                    {schedule.dueDate && (
                      <div className="text-xs text-red-600 font-medium">
                        Due: {formatDate(schedule.dueDate)}
                      </div>
                    )}
                    {(schedule.startTime || schedule.endTime) && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock size={12} />
                        <span className="truncate">{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="hidden xs:table-cell px-3 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span className="truncate">{schedule.room || "—"}</span>
                  </div>
                </td>
                {canEdit && (
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(schedule._id)}
                        className="rounded-lg border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        title="Edit schedule"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(schedule._id)}
                        className="rounded-lg border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        title="Delete schedule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

ScheduleTable.displayName = 'ScheduleTable'

export default ScheduleTable