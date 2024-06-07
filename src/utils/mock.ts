import { faker } from '@faker-js/faker'

faker.seed(1)
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

const users = faker.helpers.multiple(createRandomUser, { count: 144 })

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

faker.seed(2)
const detailedUsers = faker.helpers.multiple(createRandomDetailedUser, { count: 1920 })

export function getUsers({ pageIndex, pageSize, sortColumn, sortDirection, globalFilter }: {
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

  return {
    data: queryResult.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    total: users.length,
  }
}

export function getDetailedUsers({ pageIndex, pageSize, sortColumn, sortDirection, globalFilter }: {
  pageIndex: number
  pageSize: number
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  globalFilter?: string
}) {
  let queryResult = [...detailedUsers]

  if (globalFilter) {
    queryResult = queryResult.filter((user) => {
      return Object.values(user).some(value => String(value).toLowerCase().includes(globalFilter.toLowerCase()))
    })
  }

  if (sortColumn) {
    queryResult.sort((a, b) => {
      if (sortColumn) {
        const valueA = String(a[sortColumn as keyof typeof detailedUsers[0]])
        const valueB = String(b[sortColumn as keyof typeof detailedUsers[0]])
        return valueA.localeCompare(valueB) * (sortDirection === 'desc' ? -1 : 1)
      }
      return 0
    })
  }

  return {
    data: queryResult.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    total: detailedUsers.length,
  }
}
