import type { PaginationState, RowSelectionState, SortingState, TableOptions } from '@tanstack/react-table'
import { useState } from 'react'

interface TableConfig {
  manual?: {
    pagination?: boolean
    sorting?: boolean
    globalFilter?: boolean
  }
  rowSelection?: 'single' | 'multiple'

  initialState?: {
    pagination?: {
      pageIndex: number
      pageSize: number
    }
    sorting?: SortingState
    globalFilter?: string
    rowSelection?: RowSelectionState
  }

}

export type TableProvider = Partial<Omit<TableOptions<any>, 'columns' | 'data' | 'getCoreRowModel'>> & { features: TableConfig }

export type TableHook<F extends TableConfig> =
  (F extends { manual: object } ? { tableQuery: TableOptions<any>['state'] } : object) &
  (F extends { manual: { pagination: true } } ? { pagination: PaginationState } : object) &
  (F extends { manual: { sorting: true } } ? { sorting: SortingState } : object) &
  (F extends { manual: { globalFilter: true } } ? { globalFilter: string } : object) &
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

      enableSorting: !!features.manual?.sorting,
      enableGlobalFilter: !!features.manual?.globalFilter,
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
    ...(features.manual?.pagination ? { pagination } : {}),
    ...(features.manual?.sorting ? { sorting } : {}),
    ...(features.manual?.globalFilter ? { globalFilter } : {}),
    ...(features.rowSelection ? { rowSelection } : {}),
  } as TableHook<F>
}
