import type { ReactNode } from 'react'

// https://procomponents.ant.design/en-US/components/page-container

interface AppPageContainerProps {
  children?: ReactNode
  title: string
}

export default function AppPageContainer(props: AppPageContainerProps) {
  return props.children
}
