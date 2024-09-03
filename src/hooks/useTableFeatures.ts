import type { PaginationState, RowSelectionState, SortingState, TableOptions } from '@tanstack/react-table'
import { useState } from 'react'

interface TableConfig {
  // If true, the table will assume that the data is managed (paginated, sorted, etc.) externally.
  manual?: boolean

  // Pagination, sorting, and filters must be set to false if the server source doesn't support them.
  pagination?: boolean
  sorting?: boolean
  globalFilter?: boolean

  rowSelection?: 'single' | 'multiple' | false

  initialState?: {
    pagination?: PaginationState
    sorting?: SortingState
    globalFilter?: string
    rowSelection?: RowSelectionState
  }
}

export type TableProvider =
  Partial<Omit<TableOptions<any>, 'columns' | 'data' | 'getCoreRowModel'>> & { _config: TableConfig }

export type ProTable<F extends TableConfig> =
  (F extends { manual: true } ? { tableQuery: TableOptions<any>['state'] } : object) &
  (F extends { pagination: false } ? object : { pagination: PaginationState }) &
  (F extends { sorting: false } ? object : { sorting: SortingState }) &
  (F extends { globalFilter: false } ? object : { globalFilter: string }) &
  (F extends { rowSelection: 'single' | 'multiple' } ? { rowSelection: RowSelectionState } : object) &
  { tableProvider: TableProvider }

export default function useTableFeatures<F extends TableConfig>(config: F) {
  const { initialState } = config

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<string>(initialState?.globalFilter ?? '')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  let tableProvider: TableProvider = { _config: config }
  let tableQuery: TableOptions<any>['state']

  tableProvider = {
    ...tableProvider,
    enableSorting: config.sorting !== false,
    enableGlobalFilter: config.globalFilter !== false,
  }

  if (config.manual === true) {
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
  if (config.rowSelection) {
    tableProvider = {
      ...tableProvider,
      state: {
        ...tableProvider.state,
        rowSelection,
      },
      onRowSelectionChange: setRowSelection,
      enableMultiRowSelection: config.rowSelection === 'multiple',
    }
  }

  return {
    tableProvider,
    ...(config.manual === true ? { tableQuery } : {}),
    ...(config.pagination !== false ? { pagination } : {}),
    ...(config.sorting !== false ? { sorting } : {}),
    ...(config.globalFilter !== false ? { globalFilter } : {}),
    ...(config.rowSelection ? { rowSelection } : {}),
  } as ProTable<F>
}
