import users from '@/assets/json/mockData.json'

export function GET({ pageIndex, pageSize, globalFilter, sortColumn, sortIsAscending }: {
  pageIndex: number
  pageSize: number
  globalFilter?: string
  sortColumn?: string
  sortIsAscending?: boolean
}) {
  let _users = [...users]

  if (globalFilter) {
    _users = _users.filter(user => Object.values(user).some(value => String(value).toLowerCase().includes(globalFilter.toLowerCase())))
  }

  if (sortColumn) {
    _users.sort((a, b) => {
      const valueA = String(a[sortColumn as keyof typeof users[0]])
      const valueB = String(b[sortColumn as keyof typeof users[0]])
      return valueA.localeCompare(valueB) * (sortIsAscending ? 1 : -1)
    })
  }

  return {
    data: _users.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    total: _users.length,
  }
}

export function POST({ data }: { data: any }) {
  users.push(data)
  return { data }
}

export function PUT({ id, data }: { id: number, data: any }) {
  users[id] = data
  return { data }
}
