import { useQuery } from '@tanstack/react-query'
import { Anchor, Avatar, Fieldset, Group, Switch, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import AppTable from '@/components/app/AppTable.tsx'
import useProTable from '@/hooks/useProTable.ts'
import { getDetailedUsers } from '@/utils/mock.ts'
import AppPageContainer from '@/components/app/AppPageContainer.tsx'

export default function KitchenSink() {
  const { tableProvider, tableQuery, sorting, pagination, globalFilter } = useProTable({
    manual: true,
    pagination: true,
    sorting: true,
    globalFilter: true,
    rowSelection: 'multiple',

    initialState: {
      globalFilter: 'xy',
    },
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

  const form = useForm({
    initialValues: {
      data: true,
      isLoading: false,
      rowExpansion: false,
    },
  })

  return (
    <AppPageContainer title="Kitchen sink">
      <Fieldset legend="Table options">
        <Group>
          <Switch label="Data" {...form.getInputProps('data', { type: 'checkbox' })} />
          <Switch label="Loading" {...form.getInputProps('isLoading', { type: 'checkbox' })} />
          <Switch label="Row expansion" {...form.getInputProps('rowExpansion', { type: 'checkbox' })} />
        </Group>
      </Fieldset>

      <AppTable
        data={form.getValues().data ? data?.data : []}
        rowCount={data?.total}
        provider={tableProvider}
        isLoading={(isFetching && (!data || isPlaceholderData)) || form.getValues().isLoading}
        renderExpandedRow={form.getValues().rowExpansion
          ? profile => (
            <Group>
              <Text size="sm">{profile.job.email}</Text>
              <Text size="sm">{profile.job.type}</Text>
            </Group>
          )
          : undefined}
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
