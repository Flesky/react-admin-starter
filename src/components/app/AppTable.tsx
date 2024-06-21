import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  ActionIcon,
  Box,
  Card,
  Checkbox,
  CloseButton,
  Group,
  LoadingOverlay,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsUpDown,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDatabaseOff,
  IconSearch,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { Fragment, useMemo } from 'react'
import type { TableProvider } from '@/hooks/useProTable.ts'

type RowData = Record<string, any>

interface Props<T extends RowData> {
  data: T[] | undefined
  columns: ColumnDef<T>[]
  rowCount?: number
  isLoading?: boolean
  renderExpandedRow?: (row: T) => ReactNode

  provider?: TableProvider
}

export default function AppTable<T extends RowData>({ data, columns: _columns, rowCount, isLoading, renderExpandedRow, provider }: Props<T>) {
  const columns = useMemo(() => {
    const __columns: ColumnDef<T>[] = [..._columns]

    if (provider?._config.rowSelection === 'single') {
      __columns.unshift({
        id: 'selection',
        cell: ({ row }) => (
          <Radio
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      })
    }
    else if (provider?._config.rowSelection === 'multiple') {
      __columns.unshift({
        id: 'selection',
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      })

      if (renderExpandedRow) {
        __columns.unshift({
          id: 'expander',
          cell: ({ row }) => (
            <ActionIcon
              onClick={() => row.toggleExpanded()}
              color="dimmed"
              size="md"
              variant={row.getIsExpanded() ? 'light' : 'subtle'}
            >
              {row.getIsExpanded() ? <IconChevronDown size={16} /> : <IconChevronRight size={16} /> }
            </ActionIcon>
          ),
        })
      }
    }

    return __columns
  }, [_columns, provider?._config.rowSelection, renderExpandedRow])

  const table = useReactTable<T>({
    data: data || [],
    columns,
    getRowId: row => row.id,
    rowCount,

    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    enableExpanding: !!renderExpandedRow,

    ...provider,
  })

  return (
    <Stack h="100%">
      <Group justify="space-between" gap="xs">
        {table.options.enableGlobalFilter && (
          <TextInput
            value={table.getState().globalFilter}
            onChange={e => table.setGlobalFilter(e.target.value)}
            placeholder="Quick search"
            rightSectionPointerEvents="all"
            rightSection={table.getState().globalFilter
              ? (
                <CloseButton aria-label="Clear input" onClick={() => table.setGlobalFilter('')} />
                )
              : <IconSearch size={16} />}
          />
        )}
      </Group>

      {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
        <Card withBorder>
          <Group justify="space-between">
            <Text size="sm">
              {Object.keys(table.getState().rowSelection).length}
              {' '}
              selected
            </Text>
          </Group>
        </Card>
      )}

      <Card withBorder p={0}>
        <LoadingOverlay visible={isLoading} zIndex={20} />

        <ScrollArea styles={{ scrollbar: { zIndex: 50 } }}>
          <Table miw="1000px" className="overflow-x-auto" horizontalSpacing="md" verticalSpacing="xs" stickyHeader highlightOnHover>
            <Table.Thead className="shadow">
              {table.getHeaderGroups().map(headerGroup => (
                <Table.Tr className="border-0" key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Table.Th fw={500} key={header.id} colSpan={header.colSpan} h={50}>
                      {!header.isPlaceholder && (
                        <Group className="text-nowrap w-full flex-nowrap select-none">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort()
                          && (
                            <ActionIcon
                              onClick={header.column.getToggleSortingHandler()}
                              color="dimmed"
                              size="md"
                              variant={header.column.getIsSorted() ? 'light' : 'subtle'}
                            >
                              {{ asc: <IconArrowNarrowUp size={16} />, desc: <IconArrowNarrowDown size={16} /> }[header.column.getIsSorted() as string] || <IconArrowsUpDown size={16} />}
                            </ActionIcon>
                          )}
                        </Group>
                      )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>

            <Table.Tbody>
              {table.getRowModel().rows.map(row => (
                <Fragment key={row.id}>

                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <Table.Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  {row.getIsExpanded() && (
                    <Table.Tr>
                      <Table.Td colSpan={row.getVisibleCells().length}>
                        {renderExpandedRow!(row.original)}
                      </Table.Td>
                    </Table.Tr>
                  )}

                </Fragment>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {!table.getFilteredRowModel().rows.length
        && (
          <Stack gap="xs" m="lg" justify="center" align="center">
            <Box bg="gray.2" className="rounded-full" p="xs">
              <IconDatabaseOff color="var(--mantine-color-dimmed)" />
            </Box>
            <Text size="sm" c="dimmed">No records</Text>
          </Stack>
        )}
      </Card>

      {provider?._config.pagination !== false && (
        <Group
          justify="space-between"
        >
          <Group gap="xs">
            <Select
              w={120}
              value={String(table.getState().pagination?.pageSize)}
              onChange={pageSize => table.setPageSize(Number(pageSize))}
              data={[
                { value: '10', label: '10 / page' },
                { value: '25', label: '25 / page' },
                { value: '50', label: '50 / page' },
                { value: '100', label: '100 / page' },
              ]}
              allowDeselect={false}
            >
            </Select>
          </Group>

          <Text size="sm">
            {/* TODO: Do some magic with table.getRowCount(). Previously Math.min(x, table.getRowCount()) */}
            {/* eslint-disable-next-line style/jsx-one-expression-per-line */}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} — {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getPaginationRowModel().rows.length} of {table.getRowCount()} items

          </Text>

          <Group gap="xs">
            <Select
              data={Array.from({ length: table.getPageCount() }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
              value={String(table.getState().pagination.pageIndex + 1)}
              onChange={page => table.setPageIndex(Number(page) - 1)}
              w={80}
              searchable
              placeholder="Page"
            >
            </Select>
            <Text size="sm">
              {/* eslint-disable-next-line style/jsx-one-expression-per-line */}
              of {table.getPageCount()} page{table.getPageCount() === 1 ? '' : 's'}
            </Text>
            <Group gap={4}>
              <ActionIcon onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="default">
                <IconChevronLeft size={16} />
              </ActionIcon>
              <ActionIcon onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="default">
                <IconChevronRight size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      )}
    </Stack>
  )
}
