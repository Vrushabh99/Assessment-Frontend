import { useState } from 'react'
import { PaginationWrapper, PaginationInfo, PaginationControls, PageButton, PageInputWrapper, PageInput, PageSeparator } from './styles'

/* eslint-disable react/prop-types */
export function Pagination({ currentPage, totalPages, totalItems, onPageChange, itemLabel = 'items' }) {
  const [inputValue, setInputValue] = useState(String(currentPage))

  if (totalPages <= 1) return null

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleInputSubmit = () => {
    const pageNum = parseInt(inputValue, 10)
    if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum)
      setInputValue(String(pageNum))
    } else {
      setInputValue(String(currentPage))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit()
    } else if (e.key === 'Escape') {
      setInputValue(String(currentPage))
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      setInputValue(String(currentPage - 1))
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      setInputValue(String(currentPage + 1))
    }
  }

  return (
    <PaginationWrapper>
      <PaginationInfo>
        {totalItems && `${totalItems} ${itemLabel}`}
      </PaginationInfo>
      <PaginationControls>
        <PageButton
          disabled={currentPage === 1}
          onClick={handlePrevious}
          aria-label="Previous page"
        >
          ← Prev
        </PageButton>

        <PageInputWrapper>
          <PageInput
            type="number"
            min="1"
            max={totalPages}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputSubmit}
            onKeyDown={handleKeyDown}
            aria-label="Go to page"
          />
          <PageSeparator>/</PageSeparator>
          <span>{totalPages}</span>
        </PageInputWrapper>

        <PageButton
          disabled={currentPage === totalPages}
          onClick={handleNext}
          aria-label="Next page"
        >
          Next →
        </PageButton>
      </PaginationControls>
    </PaginationWrapper>
  )
}
