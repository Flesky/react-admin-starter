import { useQuery } from '@tanstack/react-query'
import { faker } from '@faker-js/faker'
import { Avatar } from '@mantine/core'
import { useState } from 'react'
import AppHeader from '../../components/app/AppHeader.tsx'
import AppNewTable from '@/components/app/AppTable.tsx'

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
  }
}
faker.seed(0)
const users = faker.helpers.multiple(createRandomUser, {
  count: 200,
})

export default function Table() {
  const [pagination, setPagination] = useState({
    current_page: 1,
    items_per_page: 10,
  })

  const { data, isFetching } = useQuery({
    queryKey: ['table', pagination],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        data: users.slice(
          (pagination.current_page - 1) * pagination.items_per_page,
          pagination.current_page * pagination.items_per_page,
        ),
        pagination: {
          total_items: users.length,
        },
      }
    },
  })

  return (
    <>
      <AppHeader title="Table view" />
      <AppNewTable
        data={data?.data}
        columns={[
          {
            header: 'ID',
            accessorKey: 'id',
          },
          {
            header: 'Username',
            accessorKey: 'username',
          },
          {
            header: 'Email',
            accessorKey: 'email',
          },
          {
            header: 'Avatar',
            accessorKey: 'avatar',
            cell: ({ row }) => (
              <Avatar src={row.original.avatar} alt={row.original.username} />
            ),
          },
          {
            header: 'Birthdate',
            accessorKey: 'birthdate',
          },
        ]}
        isLoading={isFetching}
      />
    </>
  )
}
