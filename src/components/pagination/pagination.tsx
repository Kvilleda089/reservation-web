
interface PaginationProps {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="text-sm text-gray-600">
        Página {page} de {totalPage}
      </span>

      <button
        type="button"
        disabled={page === totalPage}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}