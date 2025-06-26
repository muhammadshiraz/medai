import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useRef, useState } from "react";

interface DataTableProps<T extends { id: number }> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  sortConfig?: SortConfig;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  onUpdate?: (
    id: number,
    updates: Record<string, string | number | Date>
  ) => Promise<void>;
}

const EditableCell = <T extends { id: number }>({
  value,
  row,
  column,
  onUpdate,
}: {
  value: string | number | Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: T;
  column: ColumnDef<T>;
  onUpdate?: (
    id: number,
    updates: Record<string, string | number | Date>
  ) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toDisplayValue = (val: string | number | Date): string => {
    if (column.inputType === "date") {
      let date: Date;
      if (val instanceof Date) {
        date = val;
      } else {
        date = new Date(val);
      }

      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
    return String(val);
  };

  useEffect(() => {
    setInputValue(toDisplayValue(value));
  }, [value, column.inputType]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (onUpdate) {
      const [year, month, day] = newValue.split("-");
      const utcDate = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
      );
      onUpdate(row.id, { [column.key as string]: utcDate.toISOString() });
    }
  };

  const handleSave = async () => {
    if (!onUpdate) return;

    try {
      await onUpdate(row.id, { [column.key as string]: inputValue });
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      setInputValue(toDisplayValue(value)); // Revert using safe conversion
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setInputValue(toDisplayValue(value)); // Revert using safe conversion
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
        onClick={() => setIsEditing(true)}
      >
        {column.cellRenderer ? column.cellRenderer(row) : toDisplayValue(value)}
      </div>
    );
  }

  const inputType =
    column.inputType || typeof value === "number" ? "number" : "text";

  if (column.inputType === "date") {
    // Get current date in local timezone (YYYY-MM-DD format)
    const today = new Date();
    const maxDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
      <input
        ref={inputRef}
        type="date"
        value={inputValue}
        onChange={handleDateChange}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className="w-full px-2 py-1 border rounded"
        max={maxDate}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type={inputType}
      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
    />
  );
};

export interface ColumnDef<T> {
  key: keyof T;
  header: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  cellRenderer?: (row: T) => ReactNode;
  minWidth?: number;
  editable?: boolean;
  inputType?: "text" | "number" | "date";
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export function DataTable<T extends { id: number }>({
  columns,
  data = [],
  totalCount,
  sortConfig,
  onSort,
  currentPage,
  itemsPerPage,
  onPageChange,
  className = "",
  onUpdate,
}: DataTableProps<T>) {
  const total = totalCount;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  const fromItem = totalCount === 0 ? 0 : startIndex + 1;
  const toItem = Math.min(endIndex, totalCount);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [totalPages, currentPage, onPageChange]);

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 dark:bg-gray-600 dark:text-white uppercase tracking-wider ${
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    if (column.sortable) {
                      const newDirection =
                        sortConfig?.key === column.key
                          ? sortConfig.direction === "asc"
                            ? "desc"
                            : "asc"
                          : "desc";
                      onSort?.(column.key as keyof T, newDirection);
                    }
                  }}
                >
                  <div
                    className={`flex ${
                      column.align === "right"
                        ? "justify-end"
                        : column.align === "center"
                        ? "justify-center"
                        : ""
                    }`}
                  >
                    {column.header}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="ml-2">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No results found
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.align === "right"
                          ? "text-right"
                          : column.align === "center"
                          ? "text-center"
                          : "text-gray-900 dark:text-gray-400"
                      }`}
                    >
                      {column.editable ? (
                        <EditableCell
                          value={row[column.key] as string | number | Date}
                          row={row}
                          column={column}
                          onUpdate={onUpdate}
                        />
                      ) : column.cellRenderer ? (
                        column.cellRenderer(row)
                      ) : (
                        (row[column.key] as ReactNode)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 border-t border-gray-200">
        <div className="text-sm text-gray-700 dark:text-white">
          {total === 0 ? (
            "No results found"
          ) : (
            <>
              Showing {fromItem} to {toItem} of {total} results
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`px-3 py-1.5 border dark:text-white rounded-md text-sm ${
              isFirstPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm dark:text-white">
            Page {Math.min(currentPage, totalPages)} of {totalPages}
          </span>
          <button
            disabled={isLastPage}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-3 py-1.5 border dark:text-white rounded-md text-sm ${
              isLastPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
