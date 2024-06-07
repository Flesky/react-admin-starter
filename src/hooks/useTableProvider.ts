import type { PaginationState, RowSelectionState, SortingState, TableOptions } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

interface TableFeatures {
  manual?: {
    pagination?: boolean
    sorting?: boolean
    globalFilter?: boolean
  }
  rowSelection?: 'single' | 'multiple'
}

export type TableProvider = Partial<Omit<TableOptions<any>, 'columns' | 'data' | 'getCoreRowModel'>> & { features: TableFeatures }

export type TableHook<F extends TableFeatures> =
  (F extends { manual: object } ? { tableQuery: TableOptions<any>['state'] } : object) &
  (F extends { manual: { pagination: true } } ? { pagination: PaginationState } : object) &
  (F extends { manual: { sorting: true } } ? { sorting: SortingState } : object) &
  (F extends { manual: { globalFilter: true } } ? { globalFilter: string } : object) &
  (F extends { rowSelection: string } ? { rowSelection: RowSelectionState } : object) &
  { tableProvider: TableProvider }

export default function useTableProvider<F extends TableFeatures>(features: F) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Debounce the global filter for server-side data except for removing the filter and on first type to increase perceived performance
  const [globalFilterRaw, setGlobalFilterRaw] = useState<string>('')
  const [globalFilter, setGlobalFilter] = useState<string>('')
  useEffect(() => {
    if (globalFilterRaw === '')
      return setGlobalFilter('')
    else if (globalFilter === '')
      return setGlobalFilter(globalFilterRaw)

    const timeout = setTimeout(() => {
      setGlobalFilter(globalFilterRaw)
    }, 300)
    return () => clearTimeout(timeout)
  }, [globalFilter, globalFilterRaw])

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
      onGlobalFilterChange: setGlobalFilterRaw,
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
