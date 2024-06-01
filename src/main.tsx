import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider, keepPreviousData } from '@tanstack/react-query'
import { Notifications } from '@mantine/notifications'
import { router } from '@/utils/router.tsx'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './main.css'
import theme from '@/utils/theme.ts'

const queryClient = new QueryClient()

queryClient.setDefaultOptions({
  queries: {
    placeholderData: keepPreviousData,
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
)
