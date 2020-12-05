import React from 'react';
import {
  StylesProvider,
  jssPreset,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/styles';

import { create } from 'jss';
import extend from 'jss-plugin-extend';
import theme from '../utils/theme';

const jss = create({
  plugins: [extend(), ...jssPreset().plugins],
});

const ThemeProvider = ({ children }) => {
  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProvider;
