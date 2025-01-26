/**
 * POM model for the login page at mail.com
 */
import { FrameLocator, Locator, Page } from "@playwright/test";
import { FAST_TIMEOUT } from "../../utils/constants";
import { get_email_server_url } from "../../utils/getVars";
import { LoginBox } from "./components/loginBar";

export class MailDotComPage {
  readonly page: Page;
  // Selectors - "Privacy" window popup
  readonly privacySettingsWindow: Locator;
  readonly agreeAndContinueButton: Locator ;
  // Selectors - Email login page
  readonly loginButton: Locator;
  readonly loginBoxComponent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Setting the selectors
    // "Privacy" window popup
    const privacyWindow: FrameLocator = page.locator('iframe[title="Cookie settings required"]').contentFrame().locator('iframe[title="Cookie settings required"]').contentFrame();
    this.privacySettingsWindow = privacyWindow.getByRole('heading', { name: 'We Care About Your Privacy!' });
    this.agreeAndContinueButton = privacyWindow.getByRole('button', { name: 'Agree and continue' });

    // Main page - Login button
    this.loginButton = page.getByRole('link', { name: 'Log in' });
    this.loginBoxComponent = page.locator('.login-box');
  }

  /**
   * Navigate to the page
   */
  async navigate(): Promise<void> {

    let mailServerUrl = get_email_server_url();
    try {
      console.log(`Opening the page: ${mailServerUrl}`);
      await this.page.goto(mailServerUrl);
    } catch (error) {
      throw new Error('Failed to navigate to the email server page');
    }

    await this.waitForLoading();
  }

  /**
   * Wait for the page to load
   */
  private async waitForLoading(): Promise<void> {

    // A "privacy" popup window is shown. Getting rid of it
    if (this.privacySettingsWindow) {
      console.log('Dismissing the "privacy" popup window');
      await this.agreeAndContinueButton.click();

      await this.privacySettingsWindow.isHidden({ timeout: FAST_TIMEOUT });
    }

    await this.loginButton.waitFor({ state: 'visible', timeout: FAST_TIMEOUT });
  }

  /**
   * Login into the email server
   */
  async login(): Promise<void> {
    const loginBox = new LoginBox(this.page);

    console.log('Login into the email server');
    await this.loginButton.click();
    await this.loginBoxComponent.waitFor({ state: 'visible' });

    await loginBox.login();
    await this.loginBoxComponent.waitFor({ state: 'hidden' });
  }
}