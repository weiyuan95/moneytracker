// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { App } from './App';
import { AppCurrencyProvider } from './AppCurrencyProvider';
import { AppPrivacyProvider } from './AppPrivacyProvider';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Moneytracker</title>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AppCurrencyProvider>
            <AppPrivacyProvider>
              <App>{children}</App>
            </AppPrivacyProvider>
            <Notifications position="top-right" limit={3} containerWidth={440} autoClose={5000} />
          </AppCurrencyProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
