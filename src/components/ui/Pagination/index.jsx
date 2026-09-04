import { PaginationWrapper, PaginationControls, PageButton, PageInfo } from './styles'

/* eslint-disable react/prop-types */
export function Pagination({ currentPage, totalPages, totalItems, onPageChange, itemLabel = 'items' }) {
  if (totalPages <= 1) return null

  const getPageRange = () => {
    const delta = 2
    const range = []
    const left = Math.max(1, currentPage - delta)
    const right = Math.min(totalPages, currentPage + delta)

    if (left > 1) {
      range.push(1)
      if (left > 2) range.push('...')
    }

    for (let i = left; i <= right; i++) {
      range.push(i)
    }

    if (right < totalPages) {
      if (right < totalPages - 1) range.push('...')
      range.push(totalPages)
    }

    return range
  }

  return (
    <PaginationWrapper>
      <PageInfo>
        Page {currentPage} of {totalPages}
        {totalItems && ` • ${totalItems} ${itemLabel}`}
      </PageInfo>
      <PaginationControls>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          ← Prev
        </PageButton>

        {getPageRange().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} style={{ opacity: 0.5 }}>
                ...
              </span>
            )
          }
          return (
            <PageButton
              key={page}
              $active={page === currentPage}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          )
        })}

        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next →
        </PageButton>
      </PaginationControls>
    </PaginationWrapper>
  )
}
