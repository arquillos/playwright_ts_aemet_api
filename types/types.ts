/**
 * Schema of the metadata response returned by the AEMET API
 */
export interface aemetMetadataResponse {
  unidad_generadora: string
  periodicidad: string
  formato: string
  copyright: string
  notaLegal: string
  campos: campos[]
}

/**
 * Schema of the metadata response returned by the AEMET API
 */
export interface campos {
  id: string
  descripcion: string
  tipo_datos: string
  reuerido: boolean
}

/**
 * Schema of an element of "tipo_datos" returned by the AEMET API
 */
export interface aemetSingleData {
  identificacion: string // e.g: "89064"
  nombre: string // e.g: "JCI Estacion meteorologica"
  latitud: number // e.g: -62.66325
  longitud: number // e.g: -60.38959
  altitud: number // e.g: 12.0
  srs: string // e.g: WGS84"
  alt_nieve: string // e.g: "NaN"
  ddd: number // e.g: 12
  dddstd: number // e.g: 5
  dddx: number // e.g: 14
  fhora: string // e.g: "2024-01-20T15:00:00+0000"
  hr: number // e.g: 89
  ins: number // e.g: 0.0
  lluv: number // e.g: 0.0
  pres: number // e.g: 979.7
  rad_kj_m2: string // e.g: "NaN"
  rad_w_m2: number // e.g: 366.6
  rec: string // e.g: NaN"
  temp: number // e.g: 2.5
  tmn: number // e.g: 2.4
  tmx: number // e.g: 2.6
  ts: number // e.g: 5.9
  tsb: string // e.g: NaN"
  tsmn: string // e.g: NaN"
  tsmx: string // e.g: NaN"
  vel: number // e.g: 3.3
  velx: number // e.g: 4.2
  albedo: number // e.g: 0.0
  difusa: number // e.g: 0.0
  directa: number // e.g: 0.0
  global: number // e.g: 0.0
  ir_solar: number // e.g: 0.0
  neta: number // e.g: 0.0
  par: number // e.g: 0.0
  tcielo: number // e.g: 0.0
  ttierra: number // e.g: 0.0
  uvab: number // e.g: 0.0
  uvb: number // e.g: 0.0
  uvi: number // e.g: 0.0
  qdato: number // e.g: 0
}