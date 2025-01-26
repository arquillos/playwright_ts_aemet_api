/**
 * POM model for the API Key page in the AEMET service
 */
import { FrameLocator, Locator, Page } from "@playwright/test";
import { AEMET_API_KEY_ENDPOINT, FAST_TIMEOUT, REGULAR_TIMEOUT } from "../../utils/constants";
import { passCaptcha } from "../../utils/processCaptcha";
import { get_email_address } from "../../utils/getVars";

export class ApiKeyPage {
  readonly page: Page;
  // Selectors
  readonly emailInputBox: Locator;
  readonly captchaBox : Locator;
  readonly captchaframe : FrameLocator;
  readonly captchaWindow : FrameLocator;
  readonly enviarButton : Locator;
  readonly requestSentMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Setting the selectors
    this.emailInputBox = page.locator('#email');
    this.captchaBox = page.locator('.g-recaptcha');
    this.captchaframe = page.frameLocator('[title="reCAPTCHA"]');
    this.captchaWindow = page.frameLocator('[title="recaptcha challenge expires in two minutes"]');
    this.enviarButton = page.getByRole('button', { name: 'Enviar' });
    this.requestSentMessage = page.getByText('Su petición ha sido enviada, recibirá un correo de confirmación.');
  }

  /**
   * Navigate to the page
   */
  async navigate() {

    try {
      console.log(`Opening the page: ${AEMET_API_KEY_ENDPOINT}`);
      await this.page.goto(AEMET_API_KEY_ENDPOINT);
    } catch (error) {
      throw new Error('Failed to navigate to the page');
    }

    await this.waitForLoading();
  }

  /**
   * Wait for the page to load
   */
  private async waitForLoading() {

    // Note: This is an overload for this page, as it is pretty simple. The waiting time should be covered by the Playwright methods.
    // Company pages use to have many async calls, so the waiting time is necessary.
    console.log('Waiting for the page to load');
    await this.emailInputBox.waitFor({ state: 'visible', timeout: FAST_TIMEOUT });
    await this.captchaBox.waitFor({ state: 'attached', timeout: FAST_TIMEOUT });
    await this.enviarButton.waitFor({ state: 'visible', timeout: FAST_TIMEOUT });
  }

  /**
   * Register an email to get the API key
   */
  async registerEmail() {
    const email: string = get_email_address();

    console.log(`Registering the email: ${email}`);
    await this.emailInputBox.fill(email);

    await this.captchaframe.getByRole('checkbox', { name: 'I\'m not a robot' }).click();
    // There is a reCAPTCHA that appears sometimes after clicking the captcha button
    if (this.captchaWindow) {
      await passCaptcha(this.page);
    } else {
      console.log('No captcha is shown');
    }

    console.log('And sending the request');
    await this.enviarButton.click();

    console.log('Waiting for the request to be sent');
    await this.requestSentMessage.waitFor({ state: 'visible', timeout: REGULAR_TIMEOUT });
  }
}