/**
 * POM model for the login bar
 */
import { Locator, Page } from "@playwright/test";
import { get_email_address, get_email_password } from "../../../utils/getVars";

export class LoginBox {
  readonly page: Page;

  // Selectors
  readonly emailAddress: Locator;
  readonly emailPassword: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Setting the selectors
    this.emailAddress = page.getByPlaceholder('Email address');
    this.emailPassword = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' })
  }


  /**
   * Login into the email server
   */
  async login(): Promise<void> {

    console.log('Setting the email address and password');

    await this.emailAddress.fill(get_email_address());
    await this.emailPassword.fill(get_email_password());
    await this.loginButton.click();
  }
}