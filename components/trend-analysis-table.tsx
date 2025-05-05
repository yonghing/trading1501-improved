"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, BarChart3, Loader2, Clock } from "lucide-react"

interface TrendData {
  id: number
  symbol: string
  name: string
  H1: number
  D1: number
  W1: number
  updated?: string // Changed from update to updated
}

type SortField = "symbol" | "H1" | "D1" | "W1"
type SortDirection = "asc" | "desc"

interface TrendAnalysisTableProps {
  onViewChart: (symbol: string, timeframe: string) => void
}

export default function TrendAnalysisTable({ onViewChart }: TrendAnalysisTableProps) {
  const [data, setData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("symbol")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://nextjs-fastapi-henna.vercel.app/api/py/ma5time")

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const jsonData = await response.json()
        console.log("API Response:", jsonData)

        setData(jsonData)

        // Find the latest updated timestamp (changed from update to updated)
        let latestTimestamp: string | null = null

        jsonData.forEach((item) => {
          if (item.updated) {
            if (!latestTimestamp || new Date(item.updated) > new Date(latestTimestamp)) {
              latestTimestamp = item.updated
            }
          }
        })

        setLatestUpdate(latestTimestamp || new Date().toISOString())
        setError(null)
      } catch (err) {
        console.error("Error fetching trend data:", err)
        setError("Failed to load trend analysis data. Please try again later.")
        // Set some mock data for fallback
        setData([
          { id: 1, symbol: "EURUSD", name: "Euro/US Dollar", H1: 1, D1: -1, W1: 1 },
          { id: 2, symbol: "GBPUSD", name: "British Pound/US Dollar", H1: -1, D1: -1, W1: -1 },
          { id: 3, symbol: "USDJPY", name: "US Dollar/Japanese Yen", H1: 1, D1: 1, W1: -1 },
          { id: 4, symbol: "XAUUSD", name: "Gold/US Dollar", H1: 1, D1: 1, W1: 1 },
        ])

        // Set current time as fallback for timestamp
        setLatestUpdate(new Date().toISOString())
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (sortField === "symbol") {
      return sortDirection === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)
    } else {
      const aValue = a[sortField] || 0
      const bValue = b[sortField] || 0
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
  })

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    )
  }

  const handleViewChart = (symbol: string, timeframe: string) => {
    onViewChart(symbol, timeframe)
  }

  const renderTrendCell = (value: number, symbol: string, timeframe: string) => {
    const trendColor =
      value > 0 ? "text-green-600 dark:text-green-400" : value < 0 ? "text-red-600 dark:text-red-400" : "text-gray-500"

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`${trendColor} font-medium`}>{value}</span>
          <span className={`ml-2 text-xs ${trendColor}`}>
            {value > 0 ? "(Bullish)" : value < 0 ? "(Bearish)" : "(Neutral)"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => handleViewChart(symbol, timeframe)}
          title={`View ${symbol} ${timeframe} chart`}
        >
          <BarChart3 className={`h-4 w-4 ${trendColor}`} />
        </Button>
      </div>
    )
  }

  // Format the timestamp in a user-friendly way
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A"

    try {
      const date = new Date(timestamp)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date)
    } catch (e) {
      console.error("Error formatting timestamp:", e)
      return "Invalid date"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Loading trend analysis...</span>
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-48 text-red-600 dark:text-red-400">{error}</div>
  }

  return (
    <div className="space-y-2">
      {/* Latest Update Info - Displayed prominently above the table */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-500" />
          <span className="font-medium">Last Updated: {formatTimestamp(latestUpdate)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("symbol")}
                  className="font-semibold p-0 h-auto hover:bg-transparent hover:text-emerald-600"
                >
                  Symbol {renderSortIcon("symbol")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("H1")}
                  className="font-semibold p-0 h-auto hover:bg-transparent hover:text-emerald-600"
                >
                  H1 {renderSortIcon("H1")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("D1")}
                  className="font-semibold p-0 h-auto hover:bg-transparent hover:text-emerald-600"
                >
                  D1 {renderSortIcon("D1")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("W1")}
                  className="font-semibold p-0 h-auto hover:bg-transparent hover:text-emerald-600"
                >
                  W1 {renderSortIcon("W1")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <TableCell className="font-medium">{row.symbol}</TableCell>
                <TableCell>{renderTrendCell(row.H1, row.symbol, "H1")}</TableCell>
                <TableCell>{renderTrendCell(row.D1, row.symbol, "D1")}</TableCell>
                <TableCell>{renderTrendCell(row.W1, row.symbol, "W1")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
