
import React from 'react'
import Modal from '../../ui/Modal'

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  editingId,
  user 
}) => {
  
  const getDayFromDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }

  const handleDateChange = (e) => {
    const dateValue = e.target.value
    const dayName = getDayFromDate(dateValue)
    
    setForm({
      ...form,
      date: dateValue,
      day: dayName
    })
  }

  const handleKindChange = (e) => {
    const newKind = e.target.value
    const resetForm = {
      ...initial,
      kind: newKind,
      title: form.title,
      subject: form.subject,
      teacher: form.teacher,
      room: form.room
    }
    
    setForm(resetForm)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Update Schedule" : "Create New Schedule"}
      size="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-1">
          {/* Schedule Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.kind}
              onChange={handleKindChange}
            >
              <option value="class">Class</option>
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="test">Test</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter schedule title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Subject name"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teacher's name"
                  value={form.teacher}
                  onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {form.kind === "assignment" ? "Assignment Date" : "Date"}
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.date}
                  onChange={handleDateChange}
                  required
                />
                {form.day && (
                  <p className="text-sm text-gray-600 mt-1">
                    Day: <span className="font-medium">{form.day}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  required
                >
                  <option value="">Select a day</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Selection */}
            {form.kind !== "assignment" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room/Location</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Room number or location"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
              />
            </div>

            {/* Assignment Specific Fields */}
            {form.kind === "assignment" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Start</label>
                    <input
                      type="time"
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.submissionStart}
                      onChange={(e) => setForm({ ...form, submissionStart: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub End</label>
                    <input
                      type="time"
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.submissionEnd}
                      onChange={(e) => setForm({ ...form, submissionEnd: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update Schedule" : "Create Schedule"}
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

export default ScheduleModal