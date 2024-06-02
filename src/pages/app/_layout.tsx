import { AppShell, Box, Burger, Group, NavLink, ScrollArea, Stack, Text } from '@mantine/core'
import { Outlet, NavLink as RouterNavLink, matchPath, useLocation } from 'react-router-dom'
import type { TablerIcon } from '@tabler/icons-react'
import { useMemo } from 'react'
import { clsx } from 'clsx'
import { navbarLinks } from '@/utils/router.tsx'
import useNavbarStore from '@/stores/navbar.ts'

interface NavLinkParent {
  label: string
  icon: TablerIcon
  children: NavLinkChild[]
}

interface NavLinkChild {
  label: string
  link: string
}

interface NavLinkRootItem {
  label: string
  icon: TablerIcon
  link: string
}

export type NavLinkItem = (NavLinkParent | NavLinkRootItem)

function renderNavItem(item: NavLinkItem | NavLinkChild, pathname: string) {
  if ('link' in item) {
    return (
      <NavLink
        key={item.label}
        component={RouterNavLink}
        active={!!matchPath(item.link, pathname)}
        to={item.link}
        label={item.label}
        leftSection={'icon' in item ? <item.icon size={24} /> : undefined}
        onClick={() => {
          if (pathname !== item.link && useNavbarStore.getState().isOpenMobile)
            useNavbarStore.getState().toggleMobile()
        }}
        classNames={{
          root: 'px-3 py-2.5 rounded',
          children: clsx(!('icon' in item) && '!bg-black'),
          label: 'font-medium',
        }}
      >
      </NavLink>
    )
  }
  else {
    return (
      <NavLink
        key={item.label}
        href="#"
        label={item.label}
        leftSection={item.icon ? <item.icon size={24} /> : undefined}
        childrenOffset={36}
        defaultOpened={
          !!item.children?.some(child => matchPath(child.link, pathname))
        }
        classNames={{
          root: 'px-3 py-2.5 rounded',
          label: 'font-medium',
        }}
      >
        {item.children?.map(child => (
          renderNavItem(child, pathname)
        ))}
      </NavLink>
    )
  }
}

export default function AppLayout() {
  const [isOpenMobile, isOpenDesktop, toggleMobile] = useNavbarStore(state => [state.isOpenMobile, state.isOpenDesktop, state.toggleMobile])
  const { pathname } = useLocation()

  const links = useMemo(() => navbarLinks.map(item => renderNavItem(item, pathname)), [pathname])

  return (
    <AppShell
      navbar={{
        breakpoint: 'md',
        collapsed: { mobile: !isOpenMobile, desktop: !isOpenDesktop },
        width: 300,

      }}
      withBorder={false}
      header={{
        height: 60,
      }}
      layout="alt"
      padding="lg"
    >
      <AppShell.Navbar withBorder>
        <AppShell.Section>
          <Box bg="orange.4" w="100%" p="md">
            <Text size="xl" fw={500}>react-mantine-starter</Text>
          </Box>
          <Group p="md" justify="end" hiddenFrom="md">
            <Burger opened onClick={toggleMobile} size="sm"></Burger>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          <Stack p="sm" gap={0}>
            {links}
          </Stack>
        </AppShell.Section>
        <AppShell.Section>
          Footer here
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main className="h-dvh">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
