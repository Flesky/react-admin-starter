import { useQuery } from '@tanstack/react-query'
import { Anchor, Avatar, Group, Text } from '@mantine/core'
import AppPageContainer from '../../../components/app/AppPageContainer.tsx'
import AppNewTable from '@/components/app/AppTable.tsx'
import useTableProvider from '@/hooks/useTableProvider.ts'
import { getDetailedUsers } from '@/utils/mock.ts'

export default function Advanced() {
  const { tableProvider, tableQuery, sorting, pagination, globalFilter, rowSelection } = useTableProvider({
    manual: {
      pagination: true,
      sorting: true,
      globalFilter: true,
    },
    rowSelection: 'multiple',
  })

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['table/advanced', tableQuery],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800 * Math.random()))

      const { pageIndex, pageSize } = pagination
      return getDetailedUsers({
        pageIndex,
        pageSize,
        sortColumn: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
        globalFilter,
      })
    },
  })

  return (
    <AppPageContainer title="Server table">
      <AppNewTable
        data={data?.data}
        rowCount={data?.total}
        provider={tableProvider}
        isLoading={isFetching && (!data || isPlaceholderData)}
        columns={[
          {
            header: 'Employee Profile',
            columns: [
              {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                  <Group wrap="nowrap">
                    <Avatar src={row.original.avatar} alt={`${row.original.name}'s avatar`} />
                    <Text size="sm">{row.original.name}</Text>
                  </Group>
                ),
              },
              {
                header: 'Birthdate',
                accessorKey: 'birthdate',
                cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
              },
              {
                header: 'Address',
                accessorKey: 'address',
              },
            ],
          },
          {
            header: 'Work Information',
            columns: [
              {
                header: 'Title',
                accessorKey: 'job.type',
              },
              {
                header: 'Email',
                accessorKey: 'job.email',
                cell: ({ cell }) => (
                  <Anchor
                    href={
                      `mailto:${cell.getValue()}`
                    }
                    size="sm"
                    c="blue"
                  >
                    {cell.getValue()}
                  </Anchor>
                ),
              },
            ],
          },
        ]}
      />
    </AppPageContainer>
  )
}
