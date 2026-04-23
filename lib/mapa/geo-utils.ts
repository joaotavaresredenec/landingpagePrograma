// Bounding boxes aproximados das 27 unidades federativas — usados para
// zoom automático na busca e para flyToBounds ao clicar no ranking.
export const UF_BOUNDS: Record<string, [[number, number], [number, number]]> = {
  AC: [[-11.15, -73.99], [-7.11, -66.62]],
  AL: [[-10.51, -38.24], [-8.81, -35.15]],
  AM: [[-9.82, -73.82], [2.24, -56.10]],
  AP: [[-1.23, -54.88], [4.44, -49.88]],
  BA: [[-18.35, -46.62], [-8.53, -37.34]],
  CE: [[-7.86, -41.42], [-2.78, -37.25]],
  DF: [[-16.05, -48.28], [-15.50, -47.31]],
  ES: [[-21.30, -41.88], [-17.89, -39.69]],
  GO: [[-19.50, -53.25], [-12.39, -45.92]],
  MA: [[-10.28, -48.75], [-1.04, -41.79]],
  MT: [[-18.04, -61.63], [-7.34, -50.22]],
  MS: [[-24.07, -58.17], [-17.16, -50.92]],
  MG: [[-22.92, -51.05], [-14.23, -39.85]],
  PA: [[-9.84, -58.88], [2.59, -46.06]],
  PB: [[-8.31, -38.76], [-6.02, -34.79]],
  PR: [[-26.72, -54.62], [-22.51, -48.02]],
  PE: [[-9.48, -41.36], [-7.30, -32.40]],
  PI: [[-10.93, -45.99], [-2.74, -40.37]],
  RJ: [[-23.37, -44.89], [-20.76, -40.96]],
  RN: [[-6.98, -38.58], [-4.82, -34.96]],
  RS: [[-33.75, -57.65], [-27.08, -49.69]],
  RO: [[-13.69, -66.81], [-7.97, -59.77]],
  RR: [[-1.58, -64.82], [5.27, -58.89]],
  SC: [[-29.35, -53.83], [-25.95, -48.36]],
  SP: [[-25.31, -53.11], [-19.78, -44.16]],
  SE: [[-11.57, -38.24], [-9.51, -36.39]],
  TO: [[-13.46, -50.74], [-5.17, -45.69]],
}

export function obterBoundsEstado(uf: string): [[number, number], [number, number]] | null {
  return UF_BOUNDS[uf] ?? null
}

export function obterBoundsMunicipio(
  lat: number,
  lng: number,
): [[number, number], [number, number]] {
  const delta = 0.3
  return [
    [lat - delta, lng - delta],
    [lat + delta, lng + delta],
  ]
}
