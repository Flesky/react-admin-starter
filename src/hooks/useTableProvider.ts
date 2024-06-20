import type { PaginationState, RowSelectionState, SortingState, TableOptions } from '@tanstack/react-table'
import { useState } from 'react'

interface TableConfig {
  // If true, the table will assume that the data is managed (paginated, sorted, etc.) externally.
  manual?: boolean

  // Pagination, sorting, and filters must be opted out if the server source doesn't support them.
  pagination?: boolean
  sorting?: boolean
  globalFilter?: boolean

  rowSelection?: 'single' | 'multiple'

  initialState?: {
    pagination?: PaginationState
    sorting?: SortingState
    globalFilter?: string
    rowSelection?: RowSelectionState
  }
}

export type TableProvider = Partial<Omit<TableOptions<any>, 'columns' | 'data' | 'getCoreRowModel'>> & { features: TableConfig }

export type TableHook<F extends TableConfig> =
  (F extends { manual: true } ? { tableQuery: TableOptions<any>['state'] } : object) &
  (F extends { pagination: false } ? object : { pagination: PaginationState }) &
  (F extends { sorting: false } ? object : { sorting: SortingState }) &
  (F extends { globalFilter: false } ? object : { globalFilter: string }) &
  (F extends { rowSelection: 'single' | 'multiple' } ? { rowSelection: RowSelectionState } : object) &
  { tableProvider: TableProvider }

export default function useTableProvider<F extends TableConfig>(features: F) {
  const { initialState } = features

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<string>(initialState?.globalFilter ?? '')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  let tableProvider: TableProvider = { features }
  let tableQuery: TableOptions<any>['state']

  tableProvider = {
    ...tableProvider,
    enableSorting: features.sorting !== false,
    enableFilters: features.globalFilter !== false,
  }

  if ('manual' in features) {
    tableProvider = {
      ...tableProvider,
      state: {
        pagination,
        sorting,
        globalFilter,
      },
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,
    }
    tableQuery = {
      pagination,
      sorting,
      globalFilter,
    }
  }
  if (features.rowSelection) {
    tableProvider = {
      ...tableProvider,
      state: {
        ...tableProvider.state,
        rowSelection,
      },
      onRowSelectionChange: setRowSelection,
      enableMultiRowSelection: features.rowSelection === 'multiple',
    }
  }

  return {
    tableProvider,
    tableQuery,
    ...(features.pagination !== false ? { pagination } : {}),
    ...(features.sorting !== false ? { sorting } : {}),
    ...(features.globalFilter !== false ? { globalFilter } : {}),
    ...(features.rowSelection ? { rowSelection } : {}),
  } as TableHook<F>
}
