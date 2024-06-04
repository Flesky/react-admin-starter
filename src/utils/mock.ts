import { faker } from '@faker-js/faker'

function createRandomUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    jobTitle: faker.person.jobTitle(),
    email: faker.internet.email({ firstName, lastName }),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    address: faker.location.streetAddress(),
  }
}
faker.seed(1)

export const users = faker.helpers.multiple(createRandomUser, { count: 144 })

export function getServerTableData({ pageIndex, pageSize, sortColumn, sortDirection, globalFilter }: {
  pageIndex: number
  pageSize: number
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  globalFilter?: string
}) {
  let queryResult = [...users]

  if (globalFilter) {
    queryResult = queryResult.filter((user) => {
      return Object.values(user).some(value => String(value).toLowerCase().includes(globalFilter.toLowerCase()))
    })
  }

  if (sortColumn) {
    queryResult.sort((a, b) => {
      if (sortColumn) {
        const valueA = String(a[sortColumn as keyof typeof users[0]])
        const valueB = String(b[sortColumn as keyof typeof users[0]])
        return valueA.localeCompare(valueB) * (sortDirection === 'desc' ? -1 : 1)
      }
      return 0
    })
  }

  const start = pageIndex * pageSize
  const end = start + pageSize

  return {
    data: queryResult.slice(start, end),
    total: users.length,
  }
}
