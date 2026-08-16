import React from 'react'

function Card(props) {
  return (
    <div 
      style={{ backgroundColor: props.bgColor }} 
      className="w-70 bg-[#CBCBCB] p-4 rounded-3xl border-2 border-[#727272] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 font-sans box-border"
    >
      <div className="relative bg-[#f4f4f4] rounded-2xl border-2 border-black p-3 flex justify-center items-center">
        <button className="absolute top-2 right-2 text-xl bg-transparent border-none cursor-pointer">
          ♡
        </button>
        <img 
          src={props.image} 
          alt={props.title} 
          style={{ height: '180px' }}
          className="w-full object-contain" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold m-0 text-black">
          {props.title}
        </h3>
        <p className="text-sm font-bold m-0 text-black">
          {props.price}
        </p>
        <p className="text-xs text-gray-800 m-0 mt-1 leading-snug">
          {props.description}
        </p>
      </div>

      <button 
        style={{ backgroundColor: props.btnBgColor }}
        className="w-full py-3 px-4 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 font-medium cursor-pointer mt-auto hover:opacity-90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
      >
        <span>🛒</span>
        <span>Add to cart</span>
      </button>
    </div>
  )
}

export default Card