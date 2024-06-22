import { useQuery } from '@tanstack/react-query'
import { Anchor, Avatar, Fieldset, Group, Select, Stack, Switch, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import AppTable from '@/components/app/AppTable.tsx'
import useProTable from '@/hooks/useProTable.ts'
import { getUsers, users } from '@/utils/mock.ts'
import AppPageContainer from '@/components/app/AppPageContainer.tsx'

export default function KitchenSink() {
  const form = useForm({
    initialValues: {
      data: true,
      manual: true,
      globalFilter: true,
      rowExpansion: true,
      selection: 'multiple',
    },
  })

  // @ts-expect-error tableQuery is dynamically toggled
  const { tableProvider, tableQuery, sorting, pagination, globalFilter } = useProTable({
    manual: form.getValues().manual,
    pagination: true,
    sorting: true,
    globalFilter: form.getValues().globalFilter,
    rowSelection: form.getValues().selection === 'disabled' ? false : form.getValues().selection as 'single' | 'multiple',
  })

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['table/advanced', form.getValues().data, form.getValues().manual, tableQuery],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800 * Math.random()))
      const { pageIndex, pageSize } = pagination

      if (!form.getValues().data) {
        return {
          data: [],
          total: 0,
        }
      }

      if (form.getValues().manual) {
        return getUsers({
          pageIndex,
          pageSize,
          sortColumn: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
          globalFilter,
        })
      }
      else {
        return getUsers({
          pageIndex: 0,
          pageSize: users.length,
        })
      }
    },
  })

  return (
    <AppPageContainer title="Pro table">
      <Fieldset legend="Table options">
        <Stack>
          <Group>
            <Switch label="Simulate server-side pagination" {...form.getInputProps('manual', { type: 'checkbox' })} />
            <Switch label="Data" {...form.getInputProps('data', { type: 'checkbox' })} />
            <Switch label="Global filter" {...form.getInputProps('globalFilter', { type: 'checkbox' })} />
            <Switch label="Row expansion" {...form.getInputProps('rowExpansion', { type: 'checkbox' })} />
          </Group>
          <Group>
            <Select
              label="Selection"
              allowDeselect={false}
              data={[
                { value: 'single', label: 'Single' },
                { value: 'multiple', label: 'Multiple' },
                { value: 'disabled', label: 'Disabled' },
              ]}
              {...form.getInputProps('selection')}
            >
            </Select>
          </Group>
        </Stack>
      </Fieldset>

      <AppTable
        key={Number(form.getValues().manual)}
        data={form.getValues().data ? data?.data : []}
        rowCount={data?.total}
        provider={tableProvider}
        isLoading={(isFetching && (!data || isPlaceholderData))}
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
