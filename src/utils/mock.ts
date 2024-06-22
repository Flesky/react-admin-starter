import { faker } from '@faker-js/faker'

faker.seed(1)
function createRandomDetailedUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName({ firstName, lastName }),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    address: faker.location.streetAddress(),
    job: {
      type: faker.person.jobType(),
      vehicle: faker.vehicle.vehicle(),
      email: faker.internet.email({ firstName, lastName, provider: 'example.com' }),
    },
  }
}

export const users = faker.helpers.multiple(createRandomDetailedUser, { count: 1920 })

export function getUsers({ pageIndex, pageSize, globalFilter, sortColumn, sortDirection }: {
  pageIndex: number
  pageSize: number
  globalFilter?: string
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
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

  return {
    data: queryResult.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    total: queryResult.length,
  }
}
