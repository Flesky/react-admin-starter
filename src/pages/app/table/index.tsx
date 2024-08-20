import { useQuery } from '@tanstack/react-query'
import { Anchor, Avatar, Fieldset, Group, Select, Stack, Switch, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import AppTable from '@/components/app/AppTable.tsx'
import useTableFeatures from '@/hooks/useTableFeatures.ts'
import users from '@/assets/json/mockData.json'
import AppPageContainer from '@/components/app/AppPageContainer.tsx'
import { GET } from '@/utils/mockData'

export default function Table() {
  const form = useForm({
    initialValues: {
      data: true,
      manual: true,
      globalFilter: true,
      rowExpansion: true,
      selection: 'multiple',
    },
  })

  // @ts-expect-error tableQuery is dynamically toggled in this example
  const { tableProvider, tableQuery, sorting, pagination, globalFilter } = useTableFeatures({
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
      if (!form.getValues().data) {
        return { data: [], total: 0 }
      }
      if (!form.getValues().manual) {
        return { data: users, total: users.length }
      }

      return GET({ ...pagination, globalFilter, ...(sorting.length ? { sortColumn: sorting[0].id, sortIsAscending: !sorting[0].desc } : {}) })
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
              <Text size="sm">{profile.company.email}</Text>
              <Text size="sm">{profile.company.title}</Text>
            </Group>
          )
          : undefined}
        columns={[
          {
            header: 'Account Information',
            columns: [
              {
                header: 'ID',
                accessorKey: 'id',
              },
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
                header: 'Email',
                accessorKey: 'company.email',
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
              {
                header: 'Address',
                accessorKey: 'address',
              },
              {
                header: 'Status',
                accessorKey: 'account_status',
              },
            ],
          },
          {
            header: 'Job Profile',
            columns: [
              {
                header: 'Job title',
                accessorKey: 'company.title',
              },
              {
                header: 'Start date',
                accessorKey: 'company.start_date',
                cell: ({ row }) => new Date(row.original.company.start_date).toLocaleDateString(),
              },
            ],
          },
        ]}
      />
    </AppPageContainer>
  )
}
