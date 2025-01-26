# Installation

## Initialize the project

```bash
    npm init -y
```

## Install dependencies

- ESLint
- Prettier
- Playwright (Testing framework)
- Allure (Reports)
- dotenv (Loads environment variables from a .env file into process.env)
- cross-env (Run scripts that set and use environment variables across platforms)
- Axios (Promise based HTTP client for the browser and node.js)

```bash
    npm install @playwright/test allure-playwright typescript eslint prettier eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-playwright cross-env dotenv axios @types/node --save-dev
```

## Install playwright browsers

```bash
    npx playwright install
    npx playwright install-deps
```

## Configure the Portal URL and Credentials

Edit and configure the `.env.local` file with the correct values

```bash
    vi .env.local
```

Example template:

```
# Email service creds
# Service URL
EMAI_SERVICE_URL=https://
# Service username
EMAIL_SERVICE_USERNAME=UserGQA-CA
# Service password
EMAIL_SERVICE_PASSWORD=GQA-2021
```

## Environment variables

| Variable                 | Description                                           |
| ------------------------ |-------------------------------------------------------|
| EMAI_SERVICE_URL          | URL for the email service where the API token is sent |
| EMAIL_SERVICE_ADDRESS            | Email address for the email service                   |
| EMAIL_SERVICE_PASSWORD            | Password email service                                |
| API_TOKEN | [Optional] AEMET valid token (Skip registering into the AEMET service |
