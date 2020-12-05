import { createMuiTheme, darken, fade } from '@material-ui/core/styles';
import deepmerge from 'deepmerge';

const PRIMARY_COLOR = '#12B3B3';
const SECONDARY_COLOR = '#4d4d4d';

const theme = deepmerge(createMuiTheme(), {
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: fade(PRIMARY_COLOR, 0.1),
      dark: darken(PRIMARY_COLOR, 0.1),
      contrastText: '#fff',
      borderColor: '#D8D8D8',
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: fade(SECONDARY_COLOR, 0.1),
      dark: darken(SECONDARY_COLOR, 0.1),
      contrastText: '#fff',
    },
    colors: {
      green: PRIMARY_COLOR,
      lightGrey: '#F8F8F8',
      boulder: '#787878',
      scorpion: '#5C5C5C',
      emperor: '#4F4242',
      error: '#D20117',
    },
    background: {
      default: '#fff',
    },
  },
  custom: {
    drawerWidth: 240,
  },
  overrides: {
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiButton: {
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
        height: '50px',
        width: '250px',
      },
    },
    MuiCardActionArea: {
      root: {
        '&:hover $focusHighlight': {
          opacity: 0,
        },
      },
    },
  },
  typography: {
    h1: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1.625rem',
      lineHeight: '2rem',
    },
    h2: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1.25rem',
      lineHeight: '1.625rem',
    },
    h3: {
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
    },
    h4: {
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    button: {
      textTransform: 'none',
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
    },
    subtitle1: {
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
    body1: {
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.375rem',
    },
    caption: {
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: '1rem',
    },
    body2: {
      fontFamily: 'Fira Sans, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.6875rem',
      lineHeight: '0.8125rem',
    },
  },
});

export default theme;
