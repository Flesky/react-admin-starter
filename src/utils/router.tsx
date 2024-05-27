import { createBrowserRouter } from 'react-router-dom'
import { IconSettings } from '@tabler/icons-react'
import Index from '../pages/app'
import AppLayout from '../pages/app/_layout.tsx'
import type { NavLinkItem } from '../pages/app/_layout.tsx'
import Table from '@/pages/app/table.tsx'

const navbarLinks: NavLinkItem[] = [
  {
    label: 'Home',
    icon: IconSettings,
    to: '/',
  },
  {
    label: 'Table',
    icon: IconSettings,
    to: '/table',
  },
  {
    label: 'Sample item',
    icon: IconSettings,
    children: [
      {
        label: 'Sub item',
        to: '/sub-item',
      },
      {
        label: 'Sub item 2',
        to: '/sub-item-2',
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
        element: <Table />,
      },
    ],
  },
])

export { navbarLinks, router }
