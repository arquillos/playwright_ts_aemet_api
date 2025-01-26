/**
 * Antartida REST endpoint tests
 * @link https://opendata.aemet.es/dist/index.html?#/antartida
 * GET /api/antartida/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/estacion/{identificacion}
 * - fechaIniStr: AAAA-MM-DDTHH:MM:SSUTC
 * - fechaFinStr: AAAA-MM-DDTHH:MM:SSUTC
 * - identificacion
 *   - 89064 - Estación Meteorológica Juan Carlos I
 *   - 89064R - Estación Radiométrica Juan Carlos I
 *   - 89064RA - Estación Radiométrica Juan Carlos I (hasta 08/03/2007))
 *   - 89070 - Estación Meteorológica Gabriel de Castilla
*/
import { test, expect } from '@playwright/test';
import axios, { AxiosResponse } from "axios";
import { camposToDict } from '../utils/metadata';
import { assertField } from "../utils/fieldsAssertion";
import { aemetSingleData } from "../types/types";
import { AEMET_BASE_URL } from "../utils/constants";

// Parameterized test
[
  {
    iniDate: '2024-01-20T15:00:00UTC',
    endDate: '2024-01-21T15:00:00UTC',
    stationId: '89064', // Estación Meteorológica Juan Carlos I
  },
  {
    iniDate: '2024-01-20T15:00:00UTC',
    endDate: '2024-01-21T15:00:00UTC',
    stationId: '89070', // Estación Meteorológica Gabriel de Castilla
  },
].forEach(({ iniDate, endDate, stationId }) => {
  test(`The antartida endpoint returns valid data for station: ${stationId}`, async () => {

    // Setup
    const endpointUrl = AEMET_BASE_URL + `/opendata/api/antartida/datos/fechaini/${iniDate}/fechafin/${endDate}/estacion/${stationId}`;
    console.log(`Checking the data from station:${stationId} (from ${iniDate}, to ${endDate}`);

    // Act
    // 1. Get the data and metadata
    const response = await fecthAemetInfo(endpointUrl);
    //console.log('Data URL:', JSON.stringify(response.data.datos));
    //console.log('Metadata URL:', JSON.stringify(response.data.metadatos));
    const dataRes = await  fecthAemetData(response.data.datos);
    const metadataRes = await fecthAemetData(response.data.metadatos);
    //console.log('Data:', JSON.stringify(dataRes));
    //console.log('Metadata:', JSON.stringify(metadataRes));
    // 2. Convert the metadata to a dictionary
    const fieldTypes: { [id: string]: string } = camposToDict(metadataRes.campos);

    // Assert
    // 1. AEMET response status
    expect(response.status).toBe(200);
    // 2. Check the data types
    let numElement = 1;
    dataRes.forEach((element: aemetSingleData) => {
      console.log(`Checking Element: ${numElement} - ${JSON.stringify(element)}`);
      for (const [key, value] of Object.entries(element)) {
        //console.log(`   - Element: ${key}, ${value}, expected type: ${fieldTypes[key]}`);
        expect(assertField(key, value)).toBe(true);
      }
      numElement++;
    });
  })
});

/**
 * Function to fetch data from the AEMET API
 */
async function fecthAemetInfo(endpoint: string): Promise<AxiosResponse<any, any>> {
  console.log('Fetching data from:', endpoint);
  let response: AxiosResponse<any, any>;
  try {
    response = await axios.get(endpoint, {
      headers: {
        'api_key': process.env.API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    return response
  } catch (error) {
    console.error('Error fetching Aemet information:', error);
    throw error;
  }
}

/**
 * Function to fetch response data from the AEMET API
 */
async function fecthAemetData(endpoint: string) {
  console.log('Fetching data from:', endpoint);
  let response: AxiosResponse<any, any>;
  try {
    response = await axios.get(endpoint);
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}