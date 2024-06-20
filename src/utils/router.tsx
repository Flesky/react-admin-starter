import { type RouteObject, createBrowserRouter } from 'react-router-dom'
import type { TablerIcon } from '@tabler/icons-react'
import { IconDatabase } from '@tabler/icons-react'
import AppLayout from '@/pages/app/layout.tsx'
import Index from '@/pages/app'
import Client from '@/pages/app/table/client.tsx'
import Server from '@/pages/app/table/server.tsx'
import Advanced from '@/pages/app/table/advanced.tsx'

interface NavLinkParent {
  label: string
  icon: TablerIcon
  children: NavLinkChild[]
}

export interface NavLinkChild {
  label: string
  link: string
}

interface NavLinkRootItem {
  label: string
  icon: TablerIcon
  link: string
}

export type NavLinkItem = (NavLinkParent | NavLinkRootItem)
export const navbarLinks: NavLinkItem[] = [
  // {
  //   label: 'Home',
  //   icon: IconHome,
  //   link: '/',
  // },
  // {
  //   label: 'Charts',
  //   icon: IconChartPie,
  //   link: '/charts',
  // },
  // {
  //   label: 'Forms',
  //   icon: IconForms,
  //   children: [
  //     {
  //       label: 'Local validation only',
  //       link: '/forms/local',
  //     },
  //     {
  //       label: 'Server data source',
  //       link: '/forms/async',
  //     },
  //     {
  //       label: 'Server validated',
  //       link: '/forms/server',
  //     },
  //   ],
  // },
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
  // {
  //   label: 'Role based access control',
  //   icon: IconUserCheck,
  //   children: [
  //     {
  //       label: 'Everyone',
  //       link: '/rbac/everyone',
  //     },
  //     {
  //       label: 'Only admins',
  //       link: '/rbac/admins',
  //     },
  //     {
  //       label: 'Only admins can modify',
  //       link: '/rbac/selective',
  //     },
  //   ],
  // },
]

export const routes: RouteObject[] = [
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
          {
            path: 'advanced',
            element: <Advanced />,
          },
        ],
      },
      // {
      //   path: 'rbac',
      //   children: [
      //     {
      //       path: 'everyone',
      //       element: <Everyone />,
      //     },
      //   ],
      // },
    ],
  },
]

export const router = createBrowserRouter(routes)
