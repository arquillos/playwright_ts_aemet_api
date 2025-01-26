/**
 * This file contains the function to solve the captcha automatically
 */
import { Locator, Page } from "@playwright/test";
import { VERY_FAST_TIMEOUT } from "./constants";

/**
 * Manually solving the captcha (Waiting for the user to solve the captcha)
 */
export async function passCaptcha(page: Page) {
  // Selector
  const catchUpFrame: Locator = page.locator('xpath=//div[@id="rc-imageselect"]');

  console.log('Solving the captcha');

  // Workaround: Wait for the captcha to be solved manually
  console.log('The user should solve the captcha manually');

  // Loop checking for the captcha to be solved
  let reCaptchaVisible = true;
  while (reCaptchaVisible) {
    reCaptchaVisible = await catchUpFrame.isVisible();

    console.log(`Waiting for the captcha to be solved (${VERY_FAST_TIMEOUT}ms)`);
    await page.waitForTimeout(VERY_FAST_TIMEOUT);
  }

  console.log('Captcha solved, continuing with the registration');
}
