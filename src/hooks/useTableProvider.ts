import type { OnChangeFn, PaginationState, RowSelectionState, SortingState } from '@tanstack/react-table'
import { useState } from 'react'

interface TableProviderFeatures {
  serverPagination?: boolean
  rowSelection?: boolean
}

interface TablePaginationProvider {
  pagination: PaginationState
  setPagination: OnChangeFn<PaginationState>
  sorting: SortingState
  setSorting: OnChangeFn<SortingState>
  rowCount: number
}

export interface TablePaginationFeatures {
  tableProvider: TablePaginationProvider
  pagination: PaginationState
  sorting: SortingState
  setRowCount: OnChangeFn<number>
}

interface TableRowSelectionProvider {
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
}

export interface TableRowSelectionFeatures {
  tableProvider: TableRowSelectionProvider
  rowSelection: RowSelectionState
}

export type TableProvider = Partial<TablePaginationProvider & TableRowSelectionProvider>

export type TableFeatures<F extends TableProviderFeatures | void> =
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

  let tableProvider = {}
  const state = {}

  // if (features.serverPagination) {
  //   tableProvider = {
  //     onPaginationChange: setPagination,
  //     onSortingChange: setSorting,
  //     rowCount,
  //   }
  //   state = {
  //     pagination,
  //     sorting,
  //   }
  // }
  //
  // if (features.rowSelection) {
  //   tableProvider = {
  //     ...tableProvider,
  //     onRowSelectionChange: setRowSelection,
  //   }
  //   state = {
  //     ...state,
  //     rowSelection,
  //   }
  // }

  if (features.serverPagination) {
    tableProvider = {
      pagination,
      setPagination,
      sorting,
      setSorting,
      rowCount,
    }
  }
  if (features.rowSelection) {
    tableProvider = {
      ...tableProvider,
      rowSelection,
      setRowSelection,
    }
  }

  return {
    ...(Object.values(tableProvider).some(b => b) ? { tableProvider } : {}),
    ...(features.serverPagination ? { pagination, sorting, setRowCount } : {}),
    ...(features.rowSelection ? { rowSelection } : {}),
  } as TableFeatures<F>
}
