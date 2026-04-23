export function Legenda() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200 z-[500]">
      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Legenda</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-redenec-verde shrink-0" />
          <span className="text-gray-700">Aderiu</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-redenec-azul shrink-0" />
          <span className="text-gray-700">Iniciou, não concluiu</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0 opacity-50" />
          <span className="text-gray-700">Não iniciado</span>
        </div>
      </div>
    </div>
  )
}
