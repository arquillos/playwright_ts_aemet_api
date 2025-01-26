/**
 * This file contains provide access to all the environment variables.
 * It makes it easy to manage the variable values when running the tests in the pipeline or locally.
 */

/**
 * Get the URL for the Email server
 * @returns Email server URL
 */
export function get_email_server_url(): string {

  if (
      !process.env.EMAIL_SERVICE_URL
  ) {
    throw new Error(
        'Missing environment variable (EMAIL_SERVICE_URL)'
    );
  }

  return process.env.EMAIL_SERVICE_URL;
}

/**
 * Get the email address
 * @returns Email address
 */
export function get_email_address(): string {

  if (
      !process.env.EMAIL_SERVICE_ADDRESS
  ) {
    throw new Error(
        'Missing environment variable (EMAIL_SERVICE_ADDRESS)'
    );
  }

  return process.env.EMAIL_SERVICE_ADDRESS;
}

/**
 * Get the user password
 * @returns Password
 */
export function get_email_password(): string {

  if (
      !process.env.EMAIL_SERVICE_PASSWORD
  ) {
    throw new Error(
        'Missing environment variable (EMAIL_SERVICE_PASSWORD)'
    );
  }

  return process.env.EMAIL_SERVICE_PASSWORD;
}

/**
 * Print the environment variables. Debugging purposes
 */
export function printVars(): void {
  let email_server_url = get_email_server_url();
  let email_username = get_email_address();
  let email_password = get_email_password();

  console.log('Environment settings:');
  console.log('\tEmail service URL', email_server_url);
  console.log('\tEmail service Username:', email_username);
  console.log('\tEmail service Password:', email_password.substring(0, 5), '*****');
}
