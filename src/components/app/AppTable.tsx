import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  ColumnDef,
} from '@tanstack/react-table'

import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Group,
  LoadingOverlay,
  Modal,
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
  IconChevronLeft,
  IconChevronRight,
  IconFilter,
  IconFilterExclamation,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useDisclosure, useListState } from '@mantine/hooks'
import type { TableProvider } from '@/hooks/useTableProvider.ts'

type RowData = Record<string, any>

interface Props<T extends RowData> {
  data: T[] | undefined
  columns: ColumnDef<T, any>[]
  rowCount?: number
  isLoading?: boolean

  provider?: TableProvider
}

interface ColumnFilter {
  key: string
  mode: string
  value: string
}

export default function AppNewTable<T extends RowData>(props: Props<T>) {
  const { data, columns, isLoading, rowCount, provider } = props

  const [filtersOpened, { open: openFilters, close: closeFilters }] = useDisclosure()
  const [settingsOpened, { close: closeSettings }] = useDisclosure()

  const [filters, { append, remove, setItemProp, setState: setFilters }] = useListState<ColumnFilter>([])

  const [appliedFilters, setAppliedFilters] = useState<ColumnFilter[]>([])

  const table = useReactTable<T>({
    data: data || [],
    columns: provider?.onRowSelectionChange
      ? [
          {
            id: 'selection',
            header: ({ table }) => (
              <Checkbox
                aria-label="Select row"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            ),
            cell: ({ row }) => (
              <Checkbox
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
      <Modal size="lg" opened={filtersOpened} onClose={closeFilters} title="Filters">
        <form>
          <Stack gap="sm">
            {
              filters.map((filter, index) => (
                <Group wrap="nowrap" key={index} gap="xs">
                  <Select
                    value={filter.key}
                    onChange={key => setItemProp(index, 'key', String(key))}
                    data={table.getAllColumns().map(column => ({
                      value: column.id,
                      label: String(column.columnDef.header),
                    }))}
                    placeholder="Column"
                  />

                  <Select
                    value={filter.mode}
                    onChange={mode => setItemProp(index, 'mode', String(mode))}
                    data={[{
                      value: 'contains',
                      label: 'contains',
                    },
                    ]}
                    placeholder="Mode"
                  />

                  <TextInput
                    value={filter.value}
                    onChange={e => setItemProp(index, 'value', e.target.value)}
                    placeholder="Value"
                  />

                  <CloseButton
                    aria-label="Remove filter"
                    onClick={() => remove(index)}
                  />
                </Group>
              ))
            }

            <Button
              leftSection={<IconPlus size={16} />}
              variant="default"
              onClick={() => append({
                key: '',
                mode: '',
                value: '',
              })}
            >
              Add filter
            </Button>

            <Group mt="md" justify="space-between">
              <Button
                variant="default"
                onClick={() => {
                  setAppliedFilters([])
                  setFilters([])
                  closeFilters()
                }}
              >
                Reset filters
              </Button>
              <Button onClick={
                () => {
                  setAppliedFilters(filters)
                  closeFilters()
                }
              }
              >
                Apply filters
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={settingsOpened} onClose={closeSettings} title="Settings">
      </Modal>

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
                onChange={e => table.setGlobalFilter(e.target.value)}
                placeholder="Quick search"
                rightSectionPointerEvents="all"
                // TODO: Fix this
                rightSection={table.getState().globalFilter
                  ? (
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => table.resetGlobalFilter()}
                    />
                    )
                  : <IconSearch size={16} />}
              />
            )
          }

          <Group>
            <Button
              onClick={openFilters}
              variant="default"
              leftSection={<IconFilter size={16} />}
            >
              {appliedFilters?.length
                ? appliedFilters.length === 1 ? '1 filter' : `${appliedFilters.length} filters`
                : 'Filters'}
            </Button>
          </Group>
        </Group>

        <Card
          withBorder
          p={0}
        >
          <LoadingOverlay visible={isLoading} zIndex={20} />
          {/* {!!table.getSelectedRowModel().rows.length && ( */}
          {/*  <Card className="rounded-b-none border-b"> */}
          {/*    <Group justify="space-between"> */}
          {/*      <Text size="sm"> */}
          {/*        {table.getSelectedRowModel().rows.length} */}
          {/*      </Text> */}
          {/*    </Group> */}
          {/*  </Card> */}
          {/* )} */}

          <ScrollArea
            styles={{
              scrollbar: {
                zIndex: 10,
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
                      return header.isPlaceholder
                        ? <Table.Th key={header.id} colSpan={header.colSpan} />
                        : (
                          <Table.Th
                            fw={500}
                            key={header.id}
                          >
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
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                          </Table.Th>
                          // <UnstyledButton
                          //   key={header.id}
                          //   component={Table.Th}
                          //   bg={(highlightedColumn === header.id || header.column.getIsSorted()) ? 'gray.2' : undefined}
                          //   onMouseOver={() => setHighlightedColumn(header.id)}
                          //   onClick={isDataColumn ? header.column.getToggleSortingHandler() : undefined}
                          //   colSpan={header.colSpan}
                          //   tabIndex={0}
                          // >
                          //   <Stack>
                          //     <Group justify="space-between" wrap="nowrap">
                          //       <Text size="sm" fw={500} className="select-none text-nowrap" c="dark.3">
                          //         {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          //       </Text>
                          //       {
                          //         isDataColumn && (
                          //           <Group wrap="nowrap" gap={0}>
                          //             {/* <ActionIcon */}
                          //             {/*  className={highlightedColumn === header.id ? 'visible' : 'invisible'} */}
                          //             {/*  variant="subtle" */}
                          //             {/*  size="sm" */}
                          //             {/*  color="dark.5" */}
                          //             {/*  onClick={() => {}} */}
                          //             {/* > */}
                          //             {/*  <IconFilter size={16} /> */}
                          //             {/* </ActionIcon> */}
                          //             <ActionIcon
                          //               className={highlightedColumn === header.id || header.column.getIsSorted() ? 'visible' : 'invisible'}
                          //               variant="subtle"
                          //               size="sm"
                          //               color="dark.5"
                          //             >
                          //               {{
                          //                 asc: <IconArrowNarrowUp size={16} />,
                          //                 desc: <IconArrowNarrowDown size={16} />,
                          //               }[header.column.getIsSorted() as string] || <IconArrowsVertical size={16} />}
                          //             </ActionIcon>
                          //           </Group>
                          //         )
                          //       }
                          //     </Group>
                          //   </Stack>
                          // </UnstyledButton>
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
