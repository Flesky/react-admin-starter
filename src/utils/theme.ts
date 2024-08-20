import { createTheme, virtualColor } from '@mantine/core'

const theme = createTheme({
  primaryShade: 7,
  cursorType: 'pointer',
  colors: {
    'light-dark': virtualColor({
      name: 'light-dark',
      light: 'gray',
      dark: 'dark',
    }),
  },
})

export default theme
