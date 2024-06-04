import { createBrowserRouter } from 'react-router-dom'
import { IconChartPie, IconDatabase, IconForms, IconHome, IconUserCheck } from '@tabler/icons-react'
import Index from '../pages/app'
import AppLayout from '../pages/app/_layout.tsx'
import type { NavLinkItem } from '../pages/app/_layout.tsx'
import Server from '@/pages/app/table/server.tsx'
import Client from '@/pages/app/table/client.tsx'

const navbarLinks: NavLinkItem[] = [
  {
    label: 'Home',
    icon: IconHome,
    link: '/',
  },
  {
    label: 'Charts',
    icon: IconChartPie,
    link: '/charts',
  },
  {
    label: 'Forms',
    icon: IconForms,
    children: [
      {
        label: 'Local validation only',
        link: '/forms/local',
      },
      {
        label: 'With server validation',
        link: '/forms/server',
      },
    ],
  },
  {
    label: 'Table',
    icon: IconDatabase,
    children: [
      {
        label: 'Client data',
        link: '/table/client',
      },
      {
        label: 'Server data',
        link: '/table/server',
      },
      {
        label: 'Advanced usage',
        link: '/table/advanced',
      },
    ],
  },
  {
    label: 'Role based access control',
    icon: IconUserCheck,
    children: [
      {
        label: 'Everyone',
        link: '/rbac/admin',
      },
      {
        label: 'Only admins',
        link: '/rbac/everyone',
      },
      {
        label: 'Only admins can modify',
        link: '/rbac/selective',
      },
    ],
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: 'table',
        children: [
          {
            path: 'client',
            element: <Client />,
          },
          {
            path: 'server',
            element: <Server />,
          },
        ],
      },
    ],
  },
])

export { navbarLinks, router }
