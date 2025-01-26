/**
 * Common constants across the project
 */
// AEMET
// Base URL for the AEMET API
export const AEMET_BASE_URL = 'https://opendata.aemet.es'
// API Key page URL
export const AEMET_API_KEY_ENDPOINT = AEMET_BASE_URL + '/centrodedescargas/obtencionAPIKey'
// Number of polling to check for the API key email
export const MAX_POLLING = 100

// Waiting timeout for the objects to be visible in a page
export const VERY_FAST_TIMEOUT = 1000
export const FAST_TIMEOUT = 3000
export const REGULAR_TIMEOUT = 10000

