import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Exécuter les tests en parallèle */
  fullyParallel: true,
  /* Échouer la build sur CI si vous avez accidentellement laissé test.only dans le code source */
  forbidOnly: !!process.env.CI,
  /* Retry une fois sur CI */
  retries: process.env.CI ? 2 : 0,
  /* Optez pour le parallélisme sur CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter à utiliser. Voir https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Configuration partagée pour tous les projets ci-dessous. Voir https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* URL de base à utiliser dans les actions comme \`await page.goto('/')\` */
    baseURL: 'http://localhost:3000',

    /* Collecter les traces lors des reprises de tests échoués. Voir https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configurer les projets pour les navigateurs principaux */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Tester sur les navigateurs mobiles */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Tester sur les navigateurs de marque */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Démarrer le serveur de dev avant de commencer les tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
