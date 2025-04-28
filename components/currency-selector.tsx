"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface Symbol {
  id: number
  symbol: string
  name: string
}

interface CurrencySelectorProps {
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
}

export default function CurrencySelector({ selectedSymbol, onSymbolChange }: CurrencySelectorProps) {
  const [symbols, setSymbols] = useState<Symbol[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch("https://nextjs-fastapi-henna.vercel.app/api/py/db")
        const data = await response.json()
        // Sort the symbols alphabetically by the symbol property
        const sortedData = [...data].sort((a, b) => a.symbol.localeCompare(b.symbol))
        setSymbols(sortedData)
      } catch (error) {
        console.error("Failed to fetch symbols:", error)
        // Fallback to some default symbols if the API fails
        setSymbols([
          { id: 1, symbol: "AUDUSD", name: "Australian Dollar/US Dollar" },
          { id: 2, symbol: "BTCUSD", name: "Bitcoin/US Dollar" },
          { id: 3, symbol: "ETHUSD", name: "Ethereum/US Dollar" },
          { id: 4, symbol: "EURUSD", name: "Euro/US Dollar" },
          { id: 5, symbol: "GBPUSD", name: "British Pound/US Dollar" },
          { id: 6, symbol: "NZDUSD", name: "New Zealand Dollar/US Dollar" },
          { id: 7, symbol: "USDCAD", name: "US Dollar/Canadian Dollar" },
          { id: 8, symbol: "USDCHF", name: "US Dollar/Swiss Franc" },
          { id: 9, symbol: "USDJPY", name: "US Dollar/Japanese Yen" },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSymbols()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <Button key={index} variant="outline" size="sm" className="h-9 px-2 text-xs opacity-50" disabled>
              ...
            </Button>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {symbols.map((symbol, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-2 text-xs",
            selectedSymbol === symbol.symbol &&
              "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
          )}
          onClick={() => onSymbolChange(symbol.symbol)}
          title={symbol.name}
        >
          {symbol.symbol}
        </Button>
      ))}
    </div>
  )
}
