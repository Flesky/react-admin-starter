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
    <Stack>
      <Group justify="space-between">
        <Title order={1} size="h2">{title}</Title>
        <Group>{extra}</Group>
      </Group>
      {children}
    </Stack>
  )
}
