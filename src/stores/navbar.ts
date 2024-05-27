import { create } from 'zustand'

interface NavbarState {
  isOpenDesktop: boolean
  isOpenMobile: boolean
  toggleDesktop: () => void
  toggleMobile: () => void
}

const useNavbarStore = create<NavbarState>()(set => ({
  isOpenDesktop: true,
  isOpenMobile: false,
  toggleDesktop: () => set(state => ({ isOpenDesktop: !state.isOpenDesktop })),
  toggleMobile: () => set(state => ({ isOpenMobile: !state.isOpenMobile })),
}))

export default useNavbarStore
