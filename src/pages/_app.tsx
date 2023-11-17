import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import '@/styles/globals.css'
import "@fontsource/manrope";
import theme from './../theme/themeConfig';
import { store } from '@/store/store';
import { CookiesProvider } from 'react-cookie';

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <ConfigProvider theme={theme}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </ConfigProvider>
  </Provider>
);

export default App;
