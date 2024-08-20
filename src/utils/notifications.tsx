import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import type { NotificationProps } from '@mantine/core'

const presets: Record<'loading' | 'success' | 'error', NotificationProps & { autoClose?: false | number, message: string }> = {
  loading: {
    autoClose: false,
    loading: true,
    message: 'Loading...',
  },
  success: {
    autoClose: 4000,
    loading: false,
    message: 'Operation completed successfully',
    color: 'green',
    icon: <IconCheck size="1.25rem" />,
  },
  error: {
    autoClose: 4000,
    loading: false,
    message: 'Operation failed',
    color: 'red',
    icon: <IconX size="1.25rem" />,
  },
}

export function notifyAsync({ title, message }: { title?: string, message?: string }) {
  const id = notifications.show({ ...presets.loading, title, message })

  return {
    success({ title, message }: { title?: string, message?: string }) {
      notifications.update({ id, ...presets.success, title, message })
    },
    failed({ title, message }: { title?: string, message?: string }) {
      notifications.update({ id, ...presets.error, title, message })
    },
    cancel() {
      notifications.hide(id)
    },
  }
}

export function notify({ title, message, type }: { title?: string, message?: string, type: keyof typeof presets }) {
  const id = notifications.show({ ...presets[type], title, message })

  return {
    update({ title, message }: { title?: string, message?: string }) {
      notifications.update({ id, title, message })
    },
    hide() {
      notifications.hide(id)
    },
  }
}
