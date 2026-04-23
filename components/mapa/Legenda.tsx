export function Legenda() {
  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-6 px-4 py-3 bg-white rounded-t-xl border border-gray-200 border-b-0">
      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">
        Legenda:
      </span>
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: '#1cff9e', border: '1px solid #0F6E56' }}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-700">Aderiu</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: '#0086ff', border: '1px solid #0C447C' }}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-700">Iniciou, não concluiu</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: '#888780', border: '1px solid #444441' }}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-700">Não iniciado</span>
      </div>
    </div>
  )
}
