'use client'

import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Feature, FeatureCollection } from 'geojson'
import type { Layer, PathOptions } from 'leaflet'
import { ArrowLeft } from 'lucide-react'
import type { Adesao, MunicipioCoord, StatusGrupo } from '@/lib/mapa/tipos'
import type { EntidadeSelecionada } from './MapaInterativo'
import { calcularEstatisticasEstado } from '@/lib/mapa/estatisticas'

const CORES_POR_STATUS: Record<StatusGrupo, { fill: string; stroke: string }> = {
  aderiu: { fill: '#1cff9e', stroke: '#0F6E56' },
  iniciou_nao_concluiu: { fill: '#0086ff', stroke: '#0C447C' },
  nao_iniciado: { fill: '#ff8b80', stroke: '#993C1D' },
}

function corPorPercentual(percentual: number): string {
  if (percentual >= 60) return '#1cff9e'
  if (percentual >= 40) return '#73e8b8'
  if (percentual >= 20) return '#b7f1d6'
  if (percentual > 0) return '#dff7ec'
  return '#eceae6'
}

// Centroides aproximados dos 27 estados — usados para posicionar o contador
const CENTROIDES_UF: Record<string, [number, number]> = {
  AC: [-9.11, -70.30], AL: [-9.61, -36.60], AM: [-3.80, -64.50], AP: [1.41, -51.77],
  BA: [-12.71, -41.71], CE: [-5.50, -39.50], DF: [-15.78, -47.79], ES: [-19.57, -40.63],
  GO: [-16.09, -49.52], MA: [-5.50, -45.50], MT: [-12.64, -55.42], MS: [-20.51, -54.54],
  MG: [-18.10, -44.38], PA: [-3.79, -53.34], PB: [-7.24, -36.58], PR: [-24.89, -51.55],
  PE: [-8.38, -37.86], PI: [-6.60, -42.28], RJ: [-22.25, -42.66], RN: [-5.81, -36.54],
  RS: [-30.17, -53.50], RO: [-10.83, -63.34], RR: [2.13, -61.40], SC: [-27.33, -50.44],
  SP: [-22.19, -48.79], SE: [-10.57, -37.45], TO: [-10.15, -48.33],
}

// Propriedades possíveis onde o código IBGE do município pode estar
function extrairCodigoIbge(props: any): string | null {
  const candidatos = [props?.id, props?.codigo, props?.CD_MUN, props?.IBGE, props?.CD_GEOCMU]
  for (const c of candidatos) {
    if (c !== undefined && c !== null) return String(c)
  }
  return null
}

type Props = {
  adesoes: Adesao[]
  todasAdesoes: Adesao[]
  municipiosCoord: Record<string, MunicipioCoord>
  onSelecionar: (entidade: EntidadeSelecionada) => void
  boundsAlvo: [[number, number], [number, number]] | null
  ufAtiva: string | null
  onMudarUf: (uf: string | null) => void
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

function ResetView({ ufAtiva }: { ufAtiva: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (ufAtiva === null) {
      map.flyTo([-14.235, -51.9253], 4, { duration: 1.0 })
    }
  }, [ufAtiva, map])
  return null
}

export default function MapaLeaflet({
  adesoes,
  todasAdesoes,
  municipiosCoord,
  onSelecionar,
  boundsAlvo,
  ufAtiva,
  onMudarUf,
}: Props) {
  const [geoJsonEstados, setGeoJsonEstados] = useState<FeatureCollection | null>(null)
  const [geoJsonMunicipios, setGeoJsonMunicipios] = useState<FeatureCollection | null>(null)
  const [carregandoUf, setCarregandoUf] = useState(false)

  useEffect(() => {
    fetch('/geodata/brasil-estados.geojson')
      .then((r) => r.json())
      .then((data: FeatureCollection) => setGeoJsonEstados(data))
      .catch((err) => console.error('Erro carregando estados:', err))
  }, [])

  useEffect(() => {
    if (!ufAtiva) {
      setGeoJsonMunicipios(null)
      return
    }
    setCarregandoUf(true)
    fetch(`/api/mapa/municipios/${ufAtiva}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`)
        return r.json()
      })
      .then((data: FeatureCollection) => {
        setGeoJsonMunicipios(data)
        setCarregandoUf(false)
      })
      .catch((err) => {
        console.error(`Erro carregando UF ${ufAtiva}:`, err)
        setCarregandoUf(false)
        setGeoJsonMunicipios(null)
      })
  }, [ufAtiva])

  const estiloEstado = useCallback(
    (feature?: Feature): PathOptions => {
      const uf = (feature?.properties as any)?.sigla ?? ''
      const stats = calcularEstatisticasEstado(todasAdesoes, uf)

      if (ufAtiva && ufAtiva !== uf) {
        return {
          fillColor: '#f5f5f5',
          weight: 0.5,
          color: '#cccccc',
          fillOpacity: 0.3,
        }
      }

      return {
        fillColor: corPorPercentual(stats.percentualAderido),
        weight: uf === ufAtiva ? 2 : 1,
        color: '#1b415e',
        fillOpacity: 0.65,
      }
    },
    [todasAdesoes, ufAtiva],
  )

  const onEachEstado = useCallback(
    (feature: Feature, layer: Layer) => {
      const uf = (feature.properties as any)?.sigla ?? ''
      const stats = calcularEstatisticasEstado(todasAdesoes, uf)

      layer.bindTooltip(
        `<strong>${stats.nome}</strong><br/>${stats.aderidos} de ${stats.totalMunicipios} aderiram (${stats.percentualAderido.toFixed(1)}%)`,
        { sticky: true, direction: 'top' },
      )

      layer.on({
        click: () => {
          onSelecionar({ tipo: 'estado', dados: stats })
          onMudarUf(uf)
        },
      })
    },
    [todasAdesoes, onSelecionar, onMudarUf],
  )

  const estiloMunicipio = useCallback(
    (feature?: Feature): PathOptions => {
      const codigo = extrairCodigoIbge(feature?.properties)
      const adesao = codigo
        ? adesoes.find((a) => a.tipo === 'municipio' && a.codigoIbge === codigo)
        : undefined

      if (!adesao) {
        return { fillColor: '#f5f5f5', weight: 0.5, color: '#cccccc', fillOpacity: 0.5 }
      }

      const cores = CORES_POR_STATUS[adesao.statusGrupo]
      return {
        fillColor: cores.fill,
        weight: 0.7,
        color: cores.stroke,
        fillOpacity: 0.7,
      }
    },
    [adesoes],
  )

  const onEachMunicipio = useCallback(
    (feature: Feature, layer: Layer) => {
      const codigo = extrairCodigoIbge(feature.properties)
      if (!codigo) return
      const adesao = adesoes.find((a) => a.tipo === 'municipio' && a.codigoIbge === codigo)
      if (!adesao) return
      const coord = municipiosCoord[codigo]

      const statusTexto: Record<StatusGrupo, string> = {
        aderiu: 'Aderiu',
        iniciou_nao_concluiu: 'Iniciou, não concluiu',
        nao_iniciado: 'Não iniciado',
      }

      layer.bindTooltip(
        `<strong>${adesao.nomeEnte}</strong><br/>${statusTexto[adesao.statusGrupo]}`,
        { sticky: true, direction: 'top' },
      )

      layer.on({
        click: () => {
          if (coord) {
            onSelecionar({ tipo: 'municipio', adesao, coord })
          }
        },
        mouseover: (e: any) => {
          e.target.setStyle({ weight: 1.4 })
        },
        mouseout: (e: any) => {
          e.target.setStyle({ weight: 0.7 })
        },
      })
    },
    [adesoes, municipiosCoord, onSelecionar],
  )

  return (
    <div className="relative h-[560px] md:h-[640px] w-full rounded-b-xl overflow-hidden border border-gray-200 border-t-0">
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={4}
        minZoom={4}
        maxZoom={14}
        maxBounds={[[-35, -76], [7, -30]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {geoJsonEstados && (
          <GeoJSON
            key={`estados-${ufAtiva ?? 'nacional'}-${todasAdesoes.length}`}
            data={geoJsonEstados}
            style={estiloEstado}
            onEachFeature={onEachEstado}
          />
        )}

        {/* Visão nacional: 1 contador por estado */}
        {!ufAtiva &&
          todasAdesoes
            .filter((a) => a.tipo === 'estado')
            .map((estadoAdesao) => {
              const stats = calcularEstatisticasEstado(todasAdesoes, estadoAdesao.uf)
              const centroide = CENTROIDES_UF[estadoAdesao.uf]
              if (!centroide) return null

              const icone = L.divIcon({
                html: `<div style="
                  background-color: #1b415e;
                  color: #ffffff;
                  width: 42px;
                  height: 42px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 700;
                  font-size: 13px;
                  border: 3px solid #1cff9e;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  cursor: pointer;
                ">${stats.aderidos}</div>`,
                className: 'contador-estado',
                iconSize: [42, 42],
                iconAnchor: [21, 21],
              })

              return (
                <Marker
                  key={estadoAdesao.uf}
                  position={centroide}
                  icon={icone}
                  eventHandlers={{
                    click: () => {
                      onSelecionar({ tipo: 'estado', dados: stats })
                      onMudarUf(estadoAdesao.uf)
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -20]}>
                    <strong>{stats.nome}</strong>
                    <br />
                    {stats.aderidos} municípios aderidos ({stats.percentualAderido.toFixed(1)}%)
                  </Tooltip>
                </Marker>
              )
            })}

        {/* Visão estadual: contornos dos municípios da UF ativa */}
        {ufAtiva && geoJsonMunicipios && (
          <GeoJSON
            key={`municipios-${ufAtiva}-${adesoes.length}`}
            data={geoJsonMunicipios}
            style={estiloMunicipio}
            onEachFeature={onEachMunicipio}
          />
        )}

        <BoundsFly boundsAlvo={boundsAlvo} />
        <ResetView ufAtiva={ufAtiva} />
      </MapContainer>

      {/* Botão voltar à visão nacional */}
      {ufAtiva && (
        <button
          type="button"
          onClick={() => onMudarUf(null)}
          className="absolute top-4 left-4 z-[500] bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm font-bold text-redenec-petroleo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde"
          aria-label="Voltar à visão nacional"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar à visão nacional
        </button>
      )}

      {/* Overlay de carregamento da UF */}
      {carregandoUf && (
        <div className="absolute inset-0 bg-white/70 z-[600] flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg border border-gray-200">
            <p className="text-sm text-gray-700">Carregando municípios…</p>
          </div>
        </div>
      )}
    </div>
  )
}
