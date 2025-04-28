"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface TradingChartProps {
  symbol: string
  timeframe: string
}

export default function TradingChart({ symbol, timeframe }: TradingChartProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    // Reset states when symbol or timeframe changes
    setIsLoading(true)
    setError(false)

    // Construct the image URL with timestamp to prevent caching
    const timestamp = new Date().getTime()
    const filename = `${symbol}${timeframe}.png`
    const url = `https://server1501.cloud/charts/${filename}?t=${timestamp}`

    setImageUrl(url)

    // Create an image object to check if the image loads successfully
    const img = new Image()
    img.onload = () => {
      setIsLoading(false)
    }
    img.onerror = () => {
      setIsLoading(false)
      setError(true)
    }
    img.src = url
  }, [symbol, timeframe])

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-md">
        <p className="text-slate-600 dark:text-slate-400">
          Unable to load chart for {symbol} ({timeframe})
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          The chart image could not be loaded from the server.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] relative">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={`${symbol} ${timeframe} Chart`}
        className="w-full h-full object-contain rounded-md"
      />
      <div className="absolute top-2 left-2 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded text-sm font-medium">
        {symbol} • {timeframe}
      </div>
    </div>
  )
}
