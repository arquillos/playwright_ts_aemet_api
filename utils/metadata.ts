/**
 * This file contains methods to help with the metadata response from the API.
 */
import { campos } from '../types/types';
/**
 * Convert the field "campos" from the metadata response field to a dictionary
 * We are interested in the "id" and "tipo_datos" fields.
 *
 * e.g.: "campos": [
 *   {
 *     "id": "nombre",
 *     "descripcion": "Nombre de la estaciÃ³n",
 *     "tipo_datos": "string",
 *     "requerido": true
 *   },
 *   {
 *     "id": "identificacion",
 *     "descripcion": "Identificacivo de la estaciÃ³n",
 *     "tipo_datos": "string",
 *     "requerido": true
 *   },
 * ...
 * ]
 */
export function camposToDict(campos: campos[]): { [id: string] : string } {
  // console.log(`Metadata campos: ${JSON.stringify(campos)}`);

  let camposDictionary: { [id: string] : string } = {};
  campos.forEach((item: campos) => {
    camposDictionary[item.id] = item.tipo_datos;
  });

  // console.log(`Campos Dictionary: ${JSON.stringify(camposDictionary)}`);
  return camposDictionary;
}