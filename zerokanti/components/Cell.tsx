interface CellProps{
    symbol:'O'|'X'
    onClick:()=>void
}
export default function Cell(props:CellProps) {
  return (
    <div className={`bg-black h-20 w-20 flex items-center justify-center
                 text-4xl md:text-5xl lg:text-6xl font-bold rounded-lg  ${props.symbol === 'X' ? 'text-red-500' : 'text-blue-400'}`}
                 onClick={props.onClick}
                 >
      {props.symbol && (
        <span className="animate-pop-in">
          {props.symbol}
        </span>
      )}
    </div>
  )
}
