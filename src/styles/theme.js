import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  colors: {
    text: '#172033',
    background: '#f5f7fb',
    surface: '#ffffff',
    border: '#e3e8f0',
    inputBorder: '#d0d5dd',
    muted: '#667085',
    primary: '#536dfe',
    primarySoft: '#eef1ff',
    primaryText: '#4055c7',
    danger: '#b42318',
    successBackground: '#e7f6ec',
    successText: '#18713b',
    shadow: 'rgb(23 32 51 / 6%)',
    overlay: 'rgb(23 32 51 / 45%)',
  },
  palette: {
    primary: { main: '#536dfe' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
    text: { primary: '#172033', secondary: '#667085' },
    divider: '#e3e8f0',
    error: { main: '#b42318' },
    success: { main: '#18713b' },
    AppBar: {
      defaultBg: '#ffffff',
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent'
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          boxShadow: 'none',
          borderBottom: `1px solid ${t.colors.border}`,
        }),
        // AppBar's root rule is literally:
        //   background-color: var(--AppBar-background);
        //   color: var(--AppBar-color);
        // and color="primary" (the default) sets those two variables via
        // .MuiAppBar-colorPrimary. Overriding backgroundColor/color directly
        // does nothing — you have to override the variables themselves.
        colorPrimary: ({ theme: t }) => ({
          '--AppBar-background': t.colors.surface,
          '--AppBar-color': t.colors.text,
        }),
      },
    },
  }
})
