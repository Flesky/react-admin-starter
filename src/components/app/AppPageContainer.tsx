import type { ReactNode } from 'react'
import { Group, Stack, Title } from '@mantine/core'

// https://procomponents.ant.design/en-US/components/page-container

interface AppPageContainerProps {
  title: string
  extra?: ReactNode
  children?: ReactNode
}

export default function AppPageContainer({ title, extra, children }: AppPageContainerProps) {
  return (
    <Stack h="100%">
      <Group justify="space-between">
        <Title order={1} size="h2">{title}</Title>
        <Group>{extra}</Group>
      </Group>
      <Stack className="overflow-y-auto">
        {children}
      </Stack>
    </Stack>
  )
}
