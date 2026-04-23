'use client'

import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import type { Feature, FeatureCollection } from 'geojson'
import type { Layer, PathOptions } from 'leaflet'
import type { Adesao, MunicipioCoord, StatusGrupo } from '@/lib/mapa/tipos'
import type { EntidadeSelecionada } from './MapaInterativo'
import { calcularEstatisticasEstado } from '@/lib/mapa/estatisticas'

const CORES_POR_STATUS: Record<StatusGrupo, string> = {
  aderiu: '#1cff9e',
  iniciou_nao_concluiu: '#0086ff',
  nao_iniciado: '#888780',
}

function corPorPercentual(percentual: number): string {
  if (percentual >= 60) return '#1cff9e'
  if (percentual >= 40) return '#73e8b8'
  if (percentual >= 20) return '#b7f1d6'
  if (percentual > 0) return '#dff7ec'
  return '#eceae6'
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

  return (
    <div className="h-[560px] md:h-[640px] w-full rounded-xl overflow-hidden border border-gray-200">
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
            key={JSON.stringify({ total: todasAdesoes.length })}
            data={geoJsonData}
            style={estiloEstado}
            onEachFeature={onEachEstado}
          />
        )}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={50} showCoverageOnHover={false}>
          {municipiosParaMarcar.map(({ adesao, coord }) => (
            <CircleMarker
              key={adesao.codigoIbge}
              center={[coord.latitude, coord.longitude]}
              radius={coord.capital ? 7 : 5}
              pathOptions={{
                fillColor: CORES_POR_STATUS[adesao.statusGrupo],
                color: '#ffffff',
                weight: 1,
                fillOpacity: adesao.statusGrupo === 'nao_iniciado' ? 0.35 : 0.9,
              }}
              eventHandlers={{
                click: () => onSelecionar({ tipo: 'municipio', adesao, coord }),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                <strong>{coord.nome}</strong>
                {coord.capital && <span className="text-[10px]"> (capital)</span>}
              </Tooltip>
            </CircleMarker>
          ))}
        </MarkerClusterGroup>

        <BoundsFly boundsAlvo={boundsAlvo} />
      </MapContainer>
    </div>
  )
}
