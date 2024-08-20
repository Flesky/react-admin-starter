import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core'
import { Outlet, NavLink as RouterNavLink, matchPath, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { clsx } from 'clsx'
import { IconBell, IconChevronRight, IconMoonFilled, IconSunFilled } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { AbilityContext } from '@/components/app/Can.tsx'
import defineAbilityFor from '@/utils/ability.ts'

import type { NavLinkChild, NavLinkItem } from '@/utils/router.tsx'
import { navbarLinks } from '@/utils/router.tsx'

function renderNavItem(item: NavLinkItem | NavLinkChild, pathname: string, isMobile = false, toggleMobile: () => void) {
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
          if (pathname !== item.link && isMobile)
            toggleMobile()
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
        active={!!item.children?.some(child => matchPath(child.link, pathname))}
        variant="subtle"
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
          renderNavItem(child, pathname, isMobile, toggleMobile)
        ))}
      </NavLink>
    )
  }
}

export default function AppLayout() {
  const [isOpenMobile, { toggle: toggleMobile }] = useDisclosure(false)
  const [isOpenDesktop, { toggle: toggleDesktop }] = useDisclosure(true)
  const { pathname } = useLocation()

  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const links = useMemo(() => navbarLinks.map(item => renderNavItem(item, pathname, isOpenMobile, toggleMobile)), [pathname, isOpenMobile, toggleMobile])

  return (
    <AbilityContext.Provider value={defineAbilityFor('employee')}>
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
          <AppShell.Section>
            <Box bg="blue.5" w="100%" p="md">
              <Text size="xl" fw={500} c="white">react-mantine-starter</Text>
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
            <UnstyledButton w="100%" p="md" className="hover:bg-[var(--mantine-color-default-hover)]">
              <Group>
                <Avatar
                  radius="xl"
                />

                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    Baron
                  </Text>

                  <Text c="dimmed" size="xs">
                    contact@brn.one
                  </Text>
                </div>

                <IconChevronRight size={16} />
              </Group>
            </UnstyledButton>
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Header>
          <Group h="100%" justify="space-between" px="md">
            <Group>
              <Burger hiddenFrom="md" onClick={toggleMobile} opened={isOpenMobile} size="sm" />
              <Burger onClick={toggleDesktop} opened={isOpenDesktop} size="sm" visibleFrom="md" />
            </Group>
            <Group gap={6}>
              <ActionIcon size="lg" variant="subtle" color="gray">
                <IconBell size={20} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" color="gray" onClick={() => toggleColorScheme()}>
                { colorScheme === 'light' ? <IconSunFilled size={20} /> : <IconMoonFilled size={20} /> }
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          { /* className="h-dvh" */ }
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </AbilityContext.Provider>
  )
}
