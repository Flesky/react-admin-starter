import { useQuery } from '@tanstack/react-query'
import { Anchor, Avatar, Group, Text } from '@mantine/core'
import AppPageContainer from '../../../components/app/AppPageContainer.tsx'
import AppTable from '@/components/app/AppTable.tsx'
import useProTable from '@/hooks/useProTable.ts'
import { getDetailedUsers } from '@/utils/mock.ts'

export default function Server() {
  const { tableProvider, tableQuery, sorting, pagination, globalFilter } = useProTable({
    manual: true,
    pagination: true,
    sorting: true,
    globalFilter: true,
  })

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['table/server', tableQuery],
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
      <AppTable
        data={data?.data}
        rowCount={data?.total}
        provider={tableProvider}
        isLoading={isFetching && (!data || isPlaceholderData)}
        columns={[
          {
            header: 'Person',
            accessorKey: 'name',
            cell: ({ row }) => (
              <Group wrap="nowrap">
                <Avatar src={row.original.avatar} alt={`${row.original.name}'s avatar`} />
                <Text size="sm">{row.original.name}</Text>
              </Group>
            ),
          },
          {
            header: 'Job type',
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
                {cell.getValue() as string}
              </Anchor>
            ),
          },
        ]}
      />
    </AppPageContainer>
  )
}
