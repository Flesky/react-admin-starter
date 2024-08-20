import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider, keepPreviousData } from '@tanstack/react-query'
import { Notifications } from '@mantine/notifications'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalsProvider } from '@mantine/modals'
import { router } from '@/utils/router.tsx'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
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
        <ModalsProvider>
          <Notifications position="top-center" />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ModalsProvider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
)
