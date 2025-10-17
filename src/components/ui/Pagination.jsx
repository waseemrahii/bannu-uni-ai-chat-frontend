
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Enhanced pagination hook with independent state per filter combination
export function usePagination(items = [], pageSize = 10, filterKey = "all") {
  const [pageState, setPageState] = useState({})
  
  // Create a unique key based on the current filter combination
  const pageKey = filterKey
  
  // Get current page for the active filter
  const page = pageState[pageKey] || 1
  
  // Set page for specific filter
  const setPage = (newPage) => {
    setPageState(prev => ({
      ...prev,
      [pageKey]: newPage
    }))
  }

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const clamped = Math.min(page, totalPages)
  const start = (clamped - 1) * pageSize
  const end = Math.min(total, clamped * pageSize)
  const pageItems = items.slice(start, end)
  
  // Reset to page 1 when filter changes
  useEffect(() => {
    if (items.length > 0 && page > 1 && page > totalPages) {
      setPage(1)
    }
  }, [items.length, page, totalPages, pageKey])

  return { 
    page: clamped, 
    setPage, 
    total, 
    totalPages, 
    start: start + 1, 
    end, 
    pageItems 
  }
}

import React from "react"
export default function Pagination({ page, setPage, total, totalPages, start, end }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-4 border-t bg-gray-50 px-3 py-2 text-sm">
      <div className="text-gray-600">
        Showing {total === 0 ? 0 : start}-{end} of {total}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <div className="rounded-md border bg-white px-2 py-1 min-w-[60px] text-center">
          {page} / {totalPages}
        </div>
        <button
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}