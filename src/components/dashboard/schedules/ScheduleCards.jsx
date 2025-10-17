import React from 'react'
import { motion } from 'framer-motion'
import { Edit3, Trash2, BookOpen, Calendar, Clock, MapPin } from 'lucide-react'

const ScheduleCards = ({ schedules, onEdit, onDelete, canEdit, getKindColor, getKindIcon }) => {
  // Function to format date properly
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {schedules.map((schedule) => (
        <motion.div
          key={schedule._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">{getKindIcon(schedule.kind)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getKindColor(schedule.kind)}`}>
                {schedule.kind}
              </span>
            </div>
            {canEdit && (
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(schedule._id)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit schedule"
                >
                  <Edit3 size={14} className="md:size-[16px]" />
                </button>
                <button
                  onClick={() => onDelete(schedule._id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete schedule"
                >
                  <Trash2 size={14} className="md:size-[16px]" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 line-clamp-2">{schedule.title}</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-1 flex items-center gap-2">
            <BookOpen size={14} className="md:size-[16px]" />
            {schedule.subject}
          </p>
          
          {schedule.teacher && (
            <p className="text-xs md:text-sm text-gray-600 mb-1">By {schedule.teacher}</p>
          )}

          {/* Schedule Details */}
          <div className="mt-3 md:mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <Calendar size={14} className="md:size-[16px]" />
              <span className="font-medium">{schedule.day}</span>
            </div>
            
            {schedule.date && (
              <div className="text-xs text-gray-500 pl-6">
                {formatDate(schedule.date)}
              </div>
            )}
            
            {(schedule.startTime || schedule.endTime) && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Clock size={14} className="md:size-[16px]" />
                <span>
                  {schedule.startTime} - {schedule.endTime}
                </span>
              </div>
            )}

            {(schedule.submissionStart || schedule.submissionEnd) && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Clock size={12} />
                <span>Sub: {schedule.submissionStart} - {schedule.submissionEnd}</span>
              </div>
            )}

            {schedule.room && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <MapPin size={14} className="md:size-[16px]" />
                <span>Room {schedule.room}</span>
              </div>
            )}
          </div>

          {/* Assignment Specific */}
          {schedule.kind === "assignment" && schedule.dueDate && (
            <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800 font-medium">
                Due: {formatDate(schedule.dueDate)}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default ScheduleCards