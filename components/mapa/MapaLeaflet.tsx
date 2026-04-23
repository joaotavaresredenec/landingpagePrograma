'use client'

import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Feature, FeatureCollection } from 'geojson'
import type { Layer, PathOptions } from 'leaflet'
import type { Adesao, MunicipioCoord, StatusGrupo } from '@/lib/mapa/tipos'
import type { EntidadeSelecionada } from './MapaInterativo'
import { calcularEstatisticasEstado } from '@/lib/mapa/estatisticas'

const CORES_POR_STATUS: Record<StatusGrupo, { fill: string; stroke: string; textoCluster: string }> = {
  aderiu: { fill: '#1cff9e', stroke: '#0F6E56', textoCluster: '#0F6E56' },
  iniciou_nao_concluiu: { fill: '#0086ff', stroke: '#0C447C', textoCluster: '#ffffff' },
  nao_iniciado: { fill: '#888780', stroke: '#444441', textoCluster: '#ffffff' },
}

function corPorPercentual(percentual: number): string {
  if (percentual >= 60) return '#1cff9e'
  if (percentual >= 40) return '#73e8b8'
  if (percentual >= 20) return '#b7f1d6'
  if (percentual > 0) return '#dff7ec'
  return '#eceae6'
}

function criarIconeCluster(cluster: any) {
  const markers = cluster.getAllChildMarkers()
  const statusCount: Record<StatusGrupo, number> = {
    aderiu: 0,
    iniciou_nao_concluiu: 0,
    nao_iniciado: 0,
  }

  markers.forEach((m: any) => {
    const status = (m.options?.statusGrupo ?? m.statusGrupo) as StatusGrupo | undefined
    if (status && status in statusCount) statusCount[status]++
  })

  const total = markers.length
  const entries = Object.entries(statusCount) as [StatusGrupo, number][]
  const dominante = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0]
  const cores = CORES_POR_STATUS[dominante]

  const tamanho = total > 100 ? 50 : total > 20 ? 42 : 36

  return L.divIcon({
    html: `<div style="
      background-color: ${cores.fill};
      color: ${cores.textoCluster};
      width: ${tamanho}px;
      height: ${tamanho}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${total}</div>`,
    className: 'redenec-cluster-icon',
    iconSize: [tamanho, tamanho],
  })
}

type Props = {
  adesoes: Adesao[]
  todasAdesoes: Adesao[]
  municipiosCoord: Record<string, MunicipioCoord>
  onSelecionar: (entidade: EntidadeSelecionada) => void
  boundsAlvo: [[number, number], [number, number]] | null
}

function BoundsFly({ boundsAlvo }: { boundsAlvo: Props['boundsAlvo'] }) {
  const map = useMap()
  useEffect(() => {
    if (boundsAlvo) {
      map.flyToBounds(boundsAlvo, { duration: 1.2, padding: [40, 40] })
    }
  }, [boundsAlvo, map])
  return null
}

export default function MapaLeaflet({
  adesoes,
  todasAdesoes,
  municipiosCoord,
  onSelecionar,
  boundsAlvo,
}: Props) {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    fetch('/geodata/brasil-estados.geojson')
      .then((r) => r.json())
      .then((data: FeatureCollection) => setGeoJsonData(data))
      .catch((err) => console.error('Falha ao carregar GeoJSON:', err))
  }, [])

  const municipiosParaMarcar = useMemo(() => {
    return adesoes
      .filter((a) => a.tipo === 'municipio')
      .map((a) => {
        const coord = municipiosCoord[a.codigoIbge]
        if (!coord) return null
        return { adesao: a, coord }
      })
      .filter((x): x is { adesao: Adesao; coord: MunicipioCoord } => x !== null)
  }, [adesoes, municipiosCoord])

  const estiloEstado = (feature?: Feature): PathOptions => {
    const uf = (feature?.properties as any)?.sigla ?? ''
    const stats = calcularEstatisticasEstado(todasAdesoes, uf)
    return {
      fillColor: corPorPercentual(stats.percentualAderido),
      weight: 1,
      color: '#1b415e',
      fillOpacity: 0.65,
    }
  }

  const onEachEstado = (feature: Feature, layer: Layer) => {
    const uf = (feature.properties as any)?.sigla ?? ''
    const stats = calcularEstatisticasEstado(todasAdesoes, uf)

    layer.bindTooltip(
      `<strong>${stats.nome}</strong><br/>${stats.aderidos} de ${stats.totalMunicipios} aderiram (${stats.percentualAderido.toFixed(1)}%)`,
      { sticky: true, direction: 'top' },
    )

    layer.on({
      click: () => onSelecionar({ tipo: 'estado', dados: stats }),
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 2, fillOpacity: 0.85 })
      },
      mouseout: (e: any) => {
        e.target.setStyle({ weight: 1, fillOpacity: 0.65 })
      },
    })
  }

  // Key muda quando os filtros mudam, forçando re-render do cluster group
  const clusterKey = useMemo(
    () => `${municipiosParaMarcar.length}-${adesoes.length}`,
    [municipiosParaMarcar.length, adesoes.length],
  )

  return (
    <div className="h-[560px] md:h-[640px] w-full rounded-b-xl overflow-hidden border border-gray-200 border-t-0">
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={4}
        minZoom={3}
        maxZoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {geoJsonData && (
          <GeoJSON
            key={`geojson-${todasAdesoes.length}`}
            data={geoJsonData}
            style={estiloEstado}
            onEachFeature={onEachEstado}
          />
        )}

        <MarkerClusterGroup
          key={clusterKey}
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
          iconCreateFunction={criarIconeCluster}
        >
          {municipiosParaMarcar.map(({ adesao, coord }) => {
            const cores = CORES_POR_STATUS[adesao.statusGrupo]
            return (
              <CircleMarker
                key={adesao.codigoIbge}
                center={[coord.latitude, coord.longitude]}
                radius={coord.capital ? 7 : 5}
                pathOptions={{
                  fillColor: cores.fill,
                  color: cores.stroke,
                  weight: 1,
                  fillOpacity: adesao.statusGrupo === 'nao_iniciado' ? 0.35 : 0.9,
                }}
                eventHandlers={{
                  add: (e: any) => {
                    // Injeta o statusGrupo nas options do layer para que o
                    // iconCreateFunction do cluster saiba compor a cor dominante.
                    if (e.target?.options) {
                      ;(e.target.options as any).statusGrupo = adesao.statusGrupo
                    }
                  },
                  click: () => onSelecionar({ tipo: 'municipio', adesao, coord }),
                }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                  <strong>{coord.nome}</strong>
                  {coord.capital && <span className="text-[10px]"> (capital)</span>}
                </Tooltip>
              </CircleMarker>
            )
          })}
        </MarkerClusterGroup>

        <BoundsFly boundsAlvo={boundsAlvo} />
      </MapContainer>
    </div>
  )
}
