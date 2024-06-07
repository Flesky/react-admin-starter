import { useQuery } from '@tanstack/react-query'
import { faker } from '@faker-js/faker'
import AppPageContainer from '../../../components/app/AppPageContainer.tsx'
import AppNewTable from '@/components/app/AppTable.tsx'
import useTableProvider from '@/hooks/useTableProvider.ts'

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    vrm: faker.vehicle.vrm(),
    vehicle: faker.vehicle.vehicle(),
    type: faker.vehicle.type(),
  }
}
faker.seed(0)
const users = faker.helpers.multiple(createRandomUser, {
  count: 45,
})

export default function Client() {
  const { rowSelection, tableProvider } = useTableProvider({
    rowSelection: 'single',
  })

  const { data, isPending } = useQuery({
    queryKey: ['table'],
    queryFn: async () => {
      return {
        // Use pageNumber
        records: users,
      }
    },
  })

  return (
    <AppPageContainer title="Client table">
      <AppNewTable
        data={data?.records}
        provider={tableProvider}
        columns={[
          {
            header: 'ID',
            accessorKey: 'id',
          },
          {
            header: 'VRM',
            accessorKey: 'vrm',
          },
          {
            header: 'Vehicle',
            accessorKey: 'vehicle',
          },
          {
            header: 'Type',
            accessorKey: 'type',
          },
        ]}
        isLoading={isPending}
      />
    </AppPageContainer>
  )
}
