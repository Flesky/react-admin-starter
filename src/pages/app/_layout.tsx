import { AppShell, Burger, Group, NavLink, ScrollArea, Stack } from '@mantine/core'
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
  to: string
}

interface NavLinkRootItem {
  label: string
  icon: TablerIcon
  to: string
}

export type NavLinkItem = (NavLinkParent | NavLinkRootItem)

function renderNavItem(item: NavLinkItem | NavLinkChild, pathname: string) {
  if ('to' in item) {
    return (
      <NavLink
        key={item.label}
        component={RouterNavLink}
        active={!!matchPath(item.to, pathname)}
        to={item.to}
        label={item.label}
        leftSection={'icon' in item ? <item.icon size={24} /> : undefined}
        onClick={() => {
          if (pathname !== item.to && useNavbarStore.getState().isOpenMobile)
            useNavbarStore.getState().toggleMobile()
        }}
        classNames={{
          root: clsx('px-3 py-2.5 rounded', !('icon' in item) && '!border-l-1'),
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
        label={item.label}
        leftSection={item.icon ? <item.icon size={24} /> : undefined}
        childrenOffset={36}
        defaultOpened={
          !!item.children?.some(child => matchPath(child.to, pathname))
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

  const links = useMemo(() => navbarLinks.map(item => renderNavItem(item, pathname)), [navbarLinks, pathname])

  return (
    <AppShell
      navbar={{
        breakpoint: 'md',
        collapsed: { mobile: !isOpenMobile, desktop: !isOpenDesktop },
        width: 300,
      }}
      header={{
        height: 60,
      }}
      layout="alt"
    >
      <AppShell.Navbar>
        <Group p="md" justify="end" hiddenFrom="md">
          <Burger opened={true} onClick={toggleMobile} size="sm"></Burger>
        </Group>
        <ScrollArea>
          <Stack p="sm" gap={0}>
            {links}
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main bg="#f9f9f9" className="h-dvh">
        <Stack p="lg">
          <Outlet />
        </Stack>
      </AppShell.Main>
    </AppShell>
  )
}
