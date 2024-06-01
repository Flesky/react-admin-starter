import { useQuery } from '@tanstack/react-query'
import { faker } from '@faker-js/faker'
import { Anchor, Avatar, Group, Text } from '@mantine/core'
import AppHeader from '../../../components/app/AppHeader.tsx'
import AppNewTable from '@/components/app/AppTable.tsx'
import useTableProvider from '@/hooks/useTableProvider.ts'

function createRandomUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    jobTitle: faker.person.jobTitle(),
    email: faker.internet.email({ firstName, lastName }),
    avatar: faker.image.avatar(),
  }
}
faker.seed(1)
const users = faker.helpers.multiple(createRandomUser, { count: 144 })

export default function Server() {
  const { tableProvider, setRowCount, sorting, pagination } = useTableProvider({
    serverPagination: true,
  })

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['page', pagination, sorting],
    queryFn: async () => {
      const { pageIndex, pageSize } = pagination
      setRowCount(users.length)

      // Await 10 seconds
      await new Promise(resolve => setTimeout(resolve, 1000))

      const sortedUsers = [...users].sort((a, b) => {
        if (sorting.length === 0)
          return 0

        const { id, desc } = sorting[0]
        const valueA = String(a[id])
        const valueB = String(b[id])

        return valueA.localeCompare(valueB) * (desc ? -1 : 1)
      })

      return {
        data: sortedUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        pagination: {
          total_items: users.length,
        },
      }
    },
  })

  return (
    <>
      <AppHeader title="Server table" />
      <AppNewTable
        data={data?.data}
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
            header: 'Job title',
            accessorKey: 'jobTitle',
          },
          {
            header: 'Email',
            accessorKey: 'email',
            cell: ({ cell }) => (
              <Anchor href={`mailto:${cell.getValue()}`} size="sm" c="blue">
                {cell.getValue()}
              </Anchor>
            ),
          },
        ]}
      />
    </>
  )
}
