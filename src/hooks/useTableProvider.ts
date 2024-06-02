import type { PaginationState, RowSelectionState, SortingState, TableOptions } from '@tanstack/react-table'
import { useState } from 'react'

export type TableProvider = Omit<TableOptions<any>, 'columns' | 'data' | 'getCoreRowModel'>

interface TableProviderFeatures {
  serverPagination?: boolean
  rowSelection?: boolean
}

export interface TablePaginationFeatures {
  tableProvider: Partial<TableProvider>
  pagination: PaginationState
  sorting: SortingState
  setRowCount: (rowCount: number) => void
}

export interface TableRowSelectionFeatures {
  tableProvider: Partial<TableProvider>
  rowSelection: RowSelectionState
}

export type TableHook<F extends TableProviderFeatures | void> =
  (F extends { serverPagination: true } ? TablePaginationFeatures : object) &
  (F extends { rowSelection: true } ? TableRowSelectionFeatures : object)

export default function useTableProvider<F extends TableProviderFeatures>(features: F) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [rowCount, setRowCount] = useState(0)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  let tableProvider: TableProvider = {}

  if (features.serverPagination) {
    tableProvider = {
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      manualPagination: true,
      manualSorting: true,
      rowCount,
      state: {
        pagination,
        sorting,
      },
    }
  }

  if (features.rowSelection) {
    tableProvider = {
      ...tableProvider,
      onRowSelectionChange: setRowSelection,
      state: {
        ...tableProvider.state,
        rowSelection,
      },
    }
  }
  return {
    ...(Object.values(tableProvider).some(b => b) ? { tableProvider } : {}),
    ...(features.serverPagination ? { pagination, sorting, setRowCount } : {}),
    ...(features.rowSelection ? { rowSelection } : {}),
  } as TableHook<F>
}
