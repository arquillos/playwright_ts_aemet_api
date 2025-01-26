/**
 * This file contains the function to assert the type of the fields in the data
 *
 * IMPORTANT: Then field checks are WIP and need to be improved
 */

export function assertField(key: string, value: any): boolean {

  /**
   * This function is used to check the temperature field meets a realistic threshold
   * - Checks if the value is a number and the value is between -50 and 50
   * - If the value is 'NaN' it is also considered valid
   * @param value The value to check
   */
  function assertTemperature(value: unknown) {
    const MAX_TEMP = 50;
    const MIN_TEMP = -50;
    return ((assertNumber(value) && (Number(value) > MIN_TEMP && Number(value) < MAX_TEMP))  || value === 'NaN');
  }

  /**
   * This function is used to check the temperature field meets a realistic threshold
   * - Checks if the value is a number and the value is between -50 and 50
   * - If the value is 'NaN' it is also considered valid
   * @param value The value to check
   */
  function assertPressure(value: unknown) {
    const MAX_HPA = 1000;
    const MIN_HPA = 900;
    return ((assertNumber(value) && (Number(value) > MIN_HPA && Number(value) < MAX_HPA))  || value === 'NaN');
  }

  function assertNumber(value: any): boolean {
    //console.log(`Checking number type: ${value}`);
    return !isNaN(value);
  }

  function assertString(value: unknown): boolean {
    //console.log(`Checking string type: ${value}`);
    return (typeof value === 'string' || value instanceof String);
  }

  function assertFloat(value: any): boolean {
    //console.log(`Checking float type: ${value}`);
    return (!isNaN(value) || value.toString().indexOf('.') != -1);
  }

  function assertDecimal(value: any): boolean {
    //console.log(`Checking decimal type: ${value}`);
    return (assertNumber(value) || value === 'NaN' || value === '0');
  }

  function assertInteger(value: string): boolean {
    //console.log(`Checking integer type: ${value}`);
    return (assertNumber(value) || value === 'NaN');
  }

  function assertBinary(value: any): boolean {
    //console.log(`Checking binary type: ${value}`);
    // Regular expression pattern to match
    // only 0s and 1s
    const binaryPattern = /^[01]+$/;

    // Test if the string matches the pattern
    return binaryPattern.test(value);}

  switch (key) {
    case 'temp':
    case 'tmn':
    case 'tmx':
    case 'ts':
    case 'tsb':
    case 'tsmn':
    case 'tsmx':
    case 'tcielo':
    case 'ttierra':
      return assertTemperature(value);
    case 'identificacion':
    case 'nombre':
    case 'srs':
    case 'fhora':
      return assertString(value);
    case 'latitud':
    case 'longitud':
    case 'altitud':
      return assertFloat(value);
    case 'pres':
      return assertPressure(value);
    case 'alt_nieve':
    case 'ins':
    case 'lluv':
    case 'vel':
    case 'velx':
    case 'albedo':
    case 'difusa':
    case 'directa':
    case 'global':
    case 'ir_solar':
    case 'neta':
    case 'par':
    case 'uvab':
    case 'uvb':
    case 'uvi':
      return assertDecimal(value);
    case 'ddd':
    case 'dddstd':
    case 'dddx':
    case 'hr':
    case 'rad_kj_m2':
    case 'rad_w_m2':
    case 'rec':
      return assertInteger(value);
    case 'qdato':
      return assertBinary(value);
    default:
      console.error(`Unknown type: ${key} (Key: ${key}, Value: ${value})`);
      return false;
  }
}
