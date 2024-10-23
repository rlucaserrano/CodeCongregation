import { createTheme } from '@mui/material/styles';
import { grey, blueGrey, lightBlue } from '@mui/material/colors';

// create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', //  softer blue color
      light: 'rgba(85, 108, 214, 0.7)', // translucent light blue for hover effects
      dark: '#4051b5', // darker shade for active states
    },
    secondary: {
      main: blueGrey[500], // gray-blue for secondary elements
      light: blueGrey[300],
      dark: blueGrey[700],
    },
    error: {
      main: '#ff3b30', // iOS red for errors
    },
    background: {
      default: '#f7f7f8', // light gray bg for a clean look
      paper: '#ffffff', // white paper bg for cards
    },
    text: {
      primary: '#1c1c1e', // dark gray for primary text
      secondary: '#3a3a3c', // slightly lighter for secondary text
    },
  },
  typography: {
    fontFamily: 'San Francisco, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.125rem', // ios header inspo
      fontWeight: 600, // bold for wow factor
    },
    body1: {
      fontSize: '1rem', // base font size
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // pretty button
      fontWeight: 500, // make buttons more readable
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // rounded corners 
          backgroundColor: '#556cd6', // default button color
          color: '#ffffff', // white text color for buttons
          '&:hover': {
            backgroundColor: 'rgba(85, 108, 214, 0.7)', // translucent blue hover
          },
          '&:active': {
            backgroundColor: '#4051b5', // darker blue when active
          },
        },
      },
    },
  },
});

export default theme;
