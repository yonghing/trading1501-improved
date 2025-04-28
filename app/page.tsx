"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import TradingChart from "@/components/trading-chart"
import CurrencySelector from "@/components/currency-selector"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [timeframe, setTimeframe] = useState("H1")
  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol)
  }

  const handleTimeframeChange = (value) => {
    setTimeframe(value)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Trading1501 <span className="text-emerald-600 dark:text-emerald-500">Filter Analysis</span>
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Trading Chart Filter Analysis</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Timeframe</h3>
                  <Tabs defaultValue={timeframe} onValueChange={handleTimeframeChange}>
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="H1">H1</TabsTrigger>
                      <TabsTrigger value="D1">D1</TabsTrigger>
                      <TabsTrigger value="W1">W1</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Symbol</h3>
                  <CurrencySelector selectedSymbol={selectedSymbol} onSymbolChange={handleSymbolChange} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedSymbol} Analysis</CardTitle>
                    <CardDescription>
                      {timeframe} timeframe
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh chart">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TradingChart
                  key={`${selectedSymbol}-${timeframe}-${refreshKey}`}
                  symbol={selectedSymbol}
                  timeframe={timeframe}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Jobs Worldwide</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://www.linkedin.com/jobs/python-jobs-worldwide" className="text-emerald-600 dark:text-emerald-500 hover:underline flex items-center">
                        <span className="mr-2">→</span> Python Jobs in Worldwide
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/jobs/javascript-jobs-worldwide" className="text-emerald-600 dark:text-emerald-500 hover:underline flex items-center">
                        <span className="mr-2">→</span> JavaScript Jobs in Worldwide
                      </a>
                    </li>
                    <li>
                      <a href="https://survey.stackoverflow.co/2024/technology" className="text-emerald-600 dark:text-emerald-500 hover:underline flex items-center">
                        <span className="mr-2">→</span> Most popular technologies
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t pt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>Trading1501 Filter Analysis • Built with Next.js and Tailwind CSS</p>
          <p className="mt-2">© {new Date().getFullYear()} Trading1501. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
