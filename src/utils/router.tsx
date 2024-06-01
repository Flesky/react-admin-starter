import { createBrowserRouter } from 'react-router-dom'
import { IconDatabase, IconHome } from '@tabler/icons-react'
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
