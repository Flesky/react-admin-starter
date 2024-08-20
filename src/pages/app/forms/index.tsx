import type { z } from 'zod'
import { date, number, object, string } from 'zod'
import { useForm, zodResolver } from '@mantine/form'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { DateInput } from '@mantine/dates'
import AppTable from '@/components/app/AppTable.tsx'
import AppPageContainer from '@/components/app/AppPageContainer.tsx'
import { notifyAsync } from '@/utils/notifications.tsx'
import { GET } from '@/utils/mockData'

// z.setErrorMap(customErrorMap)

const schema = object({
  id: number().nullable(),
  name: string().min(2),
  birthdate: date(),
  company: object({
    email: string().email(),
  }),
})

const users = GET({ pageIndex: 0, pageSize: 100 }).data

export default function Forms() {
  const form = useForm<z.infer<typeof schema>>({
    mode: 'uncontrolled',
    initialValues: {
      id: null,
      name: '',
      birthdate: new Date(),
      company: { email: '' },
    },
    transformValues: values => ({
      ...values,
      x: 'a',
    }),
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  })

  const [opened, { open, close }] = useDisclosure(false)

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      console.log(values)
      return await new Promise(resolve => setTimeout(resolve, 1000))
    },
    onMutate: () => notifyAsync({ message: 'Creating user...' }),
    onSuccess: (_, __, { success }) => {
      success({ message: 'User created successfully' })
      close()
    },
  })

  return (
    <>
      <Modal opened={opened} onClose={close} title={form.getValues().id}>
        <form onSubmit={form.onSubmit(values => mutate(values))}>
          <Stack>
            <TextInput
              label="Name"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              required
              {...form.getInputProps('company.email')}
            />
            <DateInput
              label="Birthdate"
              required
              {...form.getInputProps('birthdate')}
            />

            <Group justify="end">
              <Button loading={isPending} type="submit">Submit</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <AppPageContainer
        title="Forms"
        extra={(
          <Button
            onClick={() => {
              form.reset()
              open()
            }}
            variant="default"
          >
            Create user
          </Button>
        )}
      >
        <AppTable
          data={users}
          columns={[
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'company.email', header: 'Email' },
            {
              header: 'Actions',
              cell: ({ row }) => (
                <Button
                  onClick={() => {
                    form.setValues({ ...row.original, birthdate: new Date(row.original.birthdate) })
                    open()
                  }}
                  variant="default"
                >
                  Edit
                </Button>
              )
              ,
            },
          ]}
        />
      </AppPageContainer>
    </>
  )
}
