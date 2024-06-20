import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { ActionIcon, Box, Card, Checkbox, CloseButton, Group, LoadingOverlay, Radio, ScrollArea, Select, Stack, Table, Text, TextInput } from '@mantine/core'
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsUpDown, IconChevronLeft, IconChevronRight, IconFilterExclamation, IconSearch } from '@tabler/icons-react'
import type { TableProvider } from '@/hooks/useTableProvider.ts'

type RowData = Record<string, any>

interface Props<T extends RowData> {
  data: T[] | undefined
  columns: ColumnDef<T, any>[]
  rowCount?: number
  isLoading?: boolean

  provider?: TableProvider
}

export default function AppTable<T extends RowData>({ data, columns, rowCount, isLoading, provider }: Props<T>) {
  const table = useReactTable<T>({
    data: data || [],
    columns: provider?.onRowSelectionChange
      ? [
          {
            id: 'selection',
            header: ({ table }) => table.options.enableMultiRowSelection && (
              <Checkbox
                aria-label="Select row"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
              />
            ),
            cell: ({ table, row }) => table.options.enableMultiRowSelection
              ? (
                <Checkbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={row.getToggleSelectedHandler()}
                />
                )
              : (
                <Radio
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={row.getToggleSelectedHandler()}
                />
                ),
          },
          ...columns,
        ]
      : columns,
    getRowId: row => row.id,
    rowCount,

    globalFilterFn: 'includesString',
    enableGlobalFilter: true,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    ...provider,
    state: {
      ...provider?.state,
    },
  })

  return (
    <>
      <Stack
        h="100%"
      >
        <Group
          justify="space-between"
          gap="xs"
        >
          {
            (table.options.enableGlobalFilter) && (
              <TextInput
                value={table.getState().globalFilter}
                onChange={e => table.setGlobalFilter(e.target.value)}
                placeholder="Quick search"
                rightSectionPointerEvents="all"
                // TODO: Fix this
                rightSection={table.getState().globalFilter
                  ? (
                    <CloseButton
                      aria-label="Clear input"
                      onClick={(e) => {
                        e.preventDefault()
                        // Set value to ''
                        table.setGlobalFilter('')
                      }}
                    />
                    )
                  : <IconSearch size={16} />}
              />
            )
          }

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

          <ScrollArea
            styles={{
              scrollbar: {
                zIndex: 50,
              },
            }}
          >
            <Table
              miw="600px"
              style={{
                overflowX: 'auto',
              }}
              horizontalSpacing="md"
              verticalSpacing="xs"
              stickyHeader
              highlightOnHover
            >
              <Table.Thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      /* TODO: Don't use buttons for parent columns */
                      return (
                        <Table.Th
                          fw={500}
                          key={header.id}
                          colSpan={header.colSpan}
                          h={50}
                        >
                          {!header.isPlaceholder && (
                            <Group
                              w="full"
                              styles={{
                                root: {
                                  userSelect: 'none',
                                  wrap: 'nowrap',
                                },
                              }}
                              wrap="nowrap"
                              justify="between"
                            >
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
                      )
                    })}
                  </Table.Tr>
                ))}

              </Table.Thead>

              <Table.Tbody>
                {table.getRowModel().rows.map(row => (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <Table.Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          {/* TODO: Fix empty state for filtered text */}
          {
            !table.getFilteredRowModel().rows.length
            && (
              <Stack gap="xs" mih={150} m="lg" justify="center" align="center">
                <Box
                  bg="gray.2"
                  style={{
                    borderRadius: '100%',
                  }}
                  p="xs"
                >
                  <IconFilterExclamation color="var(--mantine-color-dimmed)" />
                </Box>
                <Text size="sm" c="dimmed">
                  No records
                </Text>
              </Stack>
            )
          }
        </Card>

        {
          (!provider?.features?.manual || !!provider.features.manual.pagination) && (
            <Group
              justify="space-between"
              styles={{
                root: {
                  userSelect: 'none',
                },
              }}
            >
              <Group gap="xs">
                <Select
                  w={116}
                  size="xs"
                  styles={{
                    input: {
                      fontSize: 'var(--mantine-font-size-sm)',
                    },
                    option: {
                      fontSize: 'var(--mantine-font-size-sm)',
                    },
                  }}
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
                  size="xs"
                  searchable
                  placeholder="Page"
                  styles={{
                    input: {
                      fontSize: 'var(--mantine-font-size-sm)',
                    },
                    option: {
                      fontSize: 'var(--mantine-font-size-sm)',
                    },
                  }}
                >
                </Select>
                <Text size="sm">
                  {/* eslint-disable-next-line style/jsx-one-expression-per-line */}
                  of {table.getPageCount()} page{table.getPageCount() === 1 ? '' : 's'}
                </Text>
                <Group gap={4}>
                  <ActionIcon
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    variant="default"
                  >
                    <IconChevronLeft size={16} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    variant="default"
                  >
                    <IconChevronRight size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Group>
          )
        }

      </Stack>
    </>
  )
}
