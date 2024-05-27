import type { ReactNode } from 'react'
import { AppShell, Burger, Group, Text } from '@mantine/core'
import { useShallow } from 'zustand/react/shallow'
import useNavbarStore from '../../stores/navbar.ts'

export default function AppHeader({ children, title }: { children?: ReactNode, title: string }) {
  const [isOpenMobile, isOpenDesktop, toggleMobile, toggleDesktop] = useNavbarStore(useShallow(state => [state.isOpenMobile, state.isOpenDesktop, state.toggleMobile, state.toggleDesktop]))

  return (
    <AppShell.Header>
      <Group h="100%" justify="space-between" px="md">
        <Group>
          <Burger hiddenFrom="md" onClick={toggleMobile} opened={isOpenMobile} size="sm" />
          <Burger onClick={toggleDesktop} opened={isOpenDesktop} size="sm" visibleFrom="md" />
          <Text size="md">{title || 'Page'}</Text>
        </Group>
        <Group h="100%" gap={10}>
          {children}
        </Group>
      </Group>
    </AppShell.Header>
  )
}
