export const SVG_WIDTH = 412;
export const SVG_HEIGHT = 268;

export const LON_MIN = 56.0;
export const LON_MAX = 73.0;
export const LAT_MIN = 37.0;
export const LAT_MAX = 45.0;


export function lonToX(lon: number): number {
  return ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * SVG_WIDTH;
}


export function latToY(lat: number): number {
  return ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * SVG_HEIGHT;
}




// src/lib/regionCoordinates.ts

/** 
 * Эти X/Y взяты «на глаз» по вашему SVG.
 * Подстройте под свой viewBox и контур.
 */
export const REGION_COORDINATES: Record<number, { x: number; y: number }> = {
  1: { x: 120, y: 130 },    // Xorazm
  2: { x: 265, y: 250 },    // Surxondaryo
  3: { x: 370, y: 150 },    // Namangan
  4: { x: 355, y: 175 },    // Farg'ona
  5: { x: 319, y: 140 },    // Toshkent
  6: { x: 180, y: 180 },    // Buxoro
  7: { x: 60,  y:  60 },    // Qoraqalpog'iston
  8: { x: 270, y: 160 },    // Jizzax
  9: { x: 390, y: 165 },    // Andijon
  10:{ x: 310, y: 170 },    // Sirdaryo
  11:{ x: 230, y: 140 },    // Navoiy
  12:{ x: 250, y: 190 },    // Samarqand
  13:{ x: 250, y: 220 },    // Qashqadaryo
  14:{ x: 340, y: 120 },    // Toshkent viloyati
};
