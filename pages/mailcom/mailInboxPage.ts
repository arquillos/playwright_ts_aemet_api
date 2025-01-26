/**
 * POM model for the mail.com page
 */
import { FrameLocator, Locator, Page, BrowserContext } from "@playwright/test";
import { FAST_TIMEOUT, MAX_POLLING } from "../../utils/constants";

export class MailInboxPage {
  readonly page: Page;
  readonly context: BrowserContext;

  // Selectors - side menu
  readonly unreadEmailsMenuOption: Locator;
  readonly unreadEmailNumber: Locator;
  // Selectors - Email list
  readonly aemetUnreadEmail: Locator;
  // Selectors - Email preview
  readonly previewMessageHeader: Locator;
  readonly emptyMessagePreview: Locator;
  readonly emailPreviewConfirmLink: Locator;
  readonly emailPreviewTokenEmailText: Locator


  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;

    // Setting the selectors
    const frameLocator: FrameLocator = page.locator('[data-test="third-party-frame_mail"]').contentFrame();
    this.unreadEmailsMenuOption = frameLocator.getByRole('link', { name: 'Unread E-mails' })
    this.unreadEmailNumber = frameLocator.locator('#vfol2');
    this.aemetUnreadEmail = frameLocator.locator('xpath=//table[@id="mail-list"]//tr[2]/td[2]/div[2]/ul/li');
    this.emptyMessagePreview = frameLocator.locator('#selectionCountMessage').getByRole('paragraph', { name: 'Please click an e-mail.' });
    this.previewMessageHeader = frameLocator.locator('xpath=//div[@id="mail-head"]');
    const emailPreviewFrame: FrameLocator = frameLocator.locator('iframe[name="mail-display-content"]').contentFrame();
    this.emailPreviewConfirmLink = emailPreviewFrame.getByRole('link', { name: 'Confirmar generación API Key' });
    this.emailPreviewTokenEmailText = emailPreviewFrame.locator('xpath=//div[1]');
  }

  /**
   * Wait for the page to load
   */
  async waitForLoading(): Promise<void> {

    console.log('Waiting for the email inbox page to load');
    await this.unreadEmailsMenuOption.waitFor({state: 'visible'});
  }

  /**
   * Get the number of unread emails
   */
  async getNumberOfUnreadEmails(): Promise<number> {

    return Number(await this.unreadEmailNumber.getAttribute('data-unread-total'));
  }

  /**
   * Wait for the email from AEMET to arrive
   * The email is expected to be sent by the AEMET service and received by the email server
   * As we do not control both services, we need to wait for the email to arrive up to a fixed timeout
   *
   * We wait up to MAX_POLLING * FAST_TIMEOUT for the email to arrive
   */
  async waitForEmailFromAEMET() {

    console.log('Waiting for the email from AEMET to arrive');
    const initialEmails: number = await this.getNumberOfUnreadEmails();
    console.log('Initial number of emails:', initialEmails);

    let retries: number = 0;
    while (retries < MAX_POLLING) {
      const currentEmails = await this.getNumberOfUnreadEmails();
      console.log(`Current number of emails:${currentEmails}`);
      if (currentEmails > initialEmails) {
        console.log('New email arrived');
        break;
      }

      console.log(`Waiting ${FAST_TIMEOUT}ms to check for the email (Retry ${retries + 1}/${MAX_POLLING})`);
      await this.page.waitForTimeout(FAST_TIMEOUT);

      // Reload the page
      try {
        await this.unreadEmailsMenuOption.click();
        await this.waitForLoading();
      } catch (error) {
        throw new Error(`Error reloading the page: ${error}`);
      }

      retries++;
    }

    if (retries === MAX_POLLING) {
      throw new Error('Max retries reached. Email from AEMET did not arrive.');
    }
  }

  /**
   * Refresh the inbox to check for new emails
   * The mail server page does not refresh the number of unread emails as expected.
   * We "force" the refresh by clicking the "Unread E-mails" link in a loop
   */
  async refreshInbox(): Promise<void> {

    console.log('Waiting for the unread number of emails to decrease');
    const initialEmails: number = await this.getNumberOfUnreadEmails();
    console.log('Initial number of emails:', initialEmails);

    let retries: number = 0;
    while (retries < MAX_POLLING) {
      const currentEmails = await this.getNumberOfUnreadEmails();
      console.log(`Current number of emails:${currentEmails}`);
      if (currentEmails < initialEmails) {
        console.log('New email arrived');
        break;
      }

      console.log(`Waiting ${FAST_TIMEOUT}ms to check for the email (Retry ${retries + 1}/${MAX_POLLING})`);
      await this.page.waitForTimeout(FAST_TIMEOUT);

      // Reload the page
      try {
        await this.unreadEmailsMenuOption.click();
        await this.waitForLoading();
      } catch (error) {
        throw new Error(`Error reloading the page: ${error}`);
      }

      retries++;
    }
  }

  /**
   * Click the AEMET email to open the preview
   * This should be as easy as calling the "click()" method, but it does not consistently work
   * Workaround: Click twice to ensure the email is opened
   * Clicking the email once does not always open the email!
   */
  async clickWorkaround(): Promise<void> {
    await this.aemetUnreadEmail.hover();
    await this.aemetUnreadEmail.click();
    // Repeat the click to ensure the email is opened
    while (await this.previewMessageHeader.isHidden()) {
      await this.page.waitForTimeout(1_000);
      await this.aemetUnreadEmail.click( { force: true });
    }

    console.log('Waiting for the email preview to load');
    await this.emptyMessagePreview.waitFor({ state: 'hidden' });
    //await this.emailPreviewTokenEmailText.waitFor({ state: 'visible' });
  }

  /**
   * Show the confirmation email in the preview panel
   * - Click the AEMET email to open the preview
   * - Confirm the email is displayed in the preview panel
   */
  async openAemetConfirmEmail(): Promise<void> {

    console.log('Displaying the AEMET confirmation email');
    await this.clickWorkaround();
  }

  /**
   * Confirm the API key generation by clicking the "Confirmar generación API Key" link in the email
   * - Click the AEMET email link for confirming the API key generation
   * - A new tab is opened with the confirmation message
   * - Close the new tab as it is not needed
   */
  async confirmAPIKeyGeneration(): Promise<void> {
    console.log('Confirming the API Key generation');

    // NOTE: Playwright handles tab in a "funny" way.
    // Start waiting for the first new page before clicking. Note: No await.
    const newTabPromise = this.context.waitForEvent('page');

    // Click the email link that will open a new tab
    await this.aemetUnreadEmail.hover();
    await this.emailPreviewConfirmLink.click();

    // Wait for the new tan to be fully loaded
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();

    // Wait the three seconds mail.com set before browsing to the new tab
    await this.page.waitForTimeout(5000);

    // Close the new tab, as we do not need it
    await newTab.close();
  }

  /**
   * Show the token email in the preview panel
   * - Click the AEMET email to open the preview
   * - Get the token text
   * @returns The token text
   */
  async openAemetTokenEmail(): Promise<string> {

    console.log('Displaying the AEMET token email');
    await this.clickWorkaround();

    const tokenText: string = await this.emailPreviewTokenEmailText.innerText();
    console.log(`Aemet Token: ${tokenText}`);

    return tokenText;
  }

}