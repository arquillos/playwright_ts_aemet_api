/**
 * This Global setup is used to get an API key from the AEMET service
 */
import { Page, BrowserContext, test as setup } from '@playwright/test';
import { MailDotComPage } from "../pages/mailcom/mailLoginPage";
import { MailInboxPage } from "../pages/mailcom/mailInboxPage";
import { ApiKeyPage } from "../pages/aemet/apiKeyPage";

setup('Getting an API Key', async ({ context }) => {

  // Check for an environment API KEY to skip the setup
  if (process.env.API_TOKEN) {
    console.log('Skipping the setup as the API key is already set');
    return;
  }

  // Increase the timeout for this setup as it may last more than the default 30 seconds
  // It depends on two external services: AEMET and the email service
  setup.setTimeout(100_000);

  const page = await context.newPage();

  // Registering the email to get the API key
  await registerUser(page);

  // Login into the email web service
  await loginIntoEmailService(page);

  // Getting the first email confirming the Token generation
  await requestTokenFromEmail(page, context);

  // Getting the second email and getting the API key
  // Storing the API key for the tests
  process.env.API_TOKEN = await getTokenFromEmail(page, context);

});

/**
 * Register the email to get the API key
 * - Browse to the AEMET API key registration page
 * - Register a new user
 */
export async function registerUser(page: Page): Promise<void> {

  const apiKeyPage = new ApiKeyPage(page);
  await apiKeyPage.navigate();
  await apiKeyPage.registerEmail();
}

/**
 * Login into the email web service
 * - Browse to the email service
 * - Login with the email address and password
 */
export async function loginIntoEmailService(page: Page): Promise<void> {

  const mailPage = new MailDotComPage(page);
  await mailPage.navigate();
  await mailPage.login();
}

/**
 * Getting the Email from AEMET to confirm the Token generation
 * - Wait for the email to arrive
 * - Open the email
 * - Confirm the API key generation
 */
export async function requestTokenFromEmail(page: Page, context: BrowserContext): Promise<void> {

  const mailInBoxPage = new MailInboxPage(page, context);
  await mailInBoxPage.waitForLoading();
  await mailInBoxPage.waitForEmailFromAEMET();
  await mailInBoxPage.openAemetConfirmEmail();
  await mailInBoxPage.confirmAPIKeyGeneration();
}

/**
 * Getting the second email and getting the API key
 */
export async function getTokenFromEmail(page: Page, context: BrowserContext): Promise<string> {

  const mailInBoxPage = new MailInboxPage(page, context);
  await mailInBoxPage.refreshInbox()
  await mailInBoxPage.waitForEmailFromAEMET();
  return await mailInBoxPage.openAemetTokenEmail();
}
