'use client';
import { useState } from 'react';
import ReadXL from '@/components/ReadXL';
import { Position } from '@/utils/groupedTrades';
import { CleanedTradeData } from '@/utils/cleanData';
import { TradeAnalysis, analyzeTradePerformance } from '@/utils/tradeAnalysis';
import { getUniqueTradesCount } from '@/utils/groupedTrades';

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', dateStr, error);
        return '';
    }
};

export default function Home() {
    const [positions, setPositions] = useState<Position[]>([]);
    const [tradeStats, setTradeStats] = useState<{ total: number; unique: number }>({ total: 0, unique: 0 });
    const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
    const [rawTrades, setRawTrades] = useState<CleanedTradeData[]>([]);

    const handleTradesUpdate = (newPositions: Position[], rawTrades: CleanedTradeData[]) => {
        if (Array.isArray(newPositions) && Array.isArray(rawTrades)) {
            const formattedPositions = newPositions.map(position => {
                if (!position) return position;
                return {
                    ...position,
                    openingTime: formatDate(position.openingTime),
                    closingTime: formatDate(position.closingTime)
                };
            }).filter(Boolean);
            
            setPositions(formattedPositions);
            setRawTrades(rawTrades);
            setTradeStats({
                total: rawTrades.length,
                unique: getUniqueTradesCount(rawTrades).count
            });
            setAnalysis(analyzeTradePerformance(formattedPositions));
        }
    };

    const groupedBySymbol = positions.reduce<Record<string, Position[]>>((acc, position) => {
        if (position?.symbol) {
            if (!acc[position.symbol]) acc[position.symbol] = [];
            acc[position.symbol].push(position);
        }
        return acc;
    }, {});

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trading Journal</h1>
                        <ReadXL onTradesUpdate={handleTradesUpdate} />
                    </div>

                    {analysis && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Key Metrics Cards */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Net Profit/Loss</h3>
                                <p className={`text-3xl font-bold ${(analysis.totalProfit - analysis.totalLoss) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    ${(analysis.totalProfit - analysis.totalLoss).toFixed(2)}
                                </p>
                                <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Profit: ${analysis.totalProfit.toFixed(2)}</span>
                                    <span>Loss: ${Math.abs(analysis.totalLoss).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Performance</h3>
                                <p className="text-3xl font-bold text-indigo-600">{analysis.winRate.toFixed(1)}%</p>
                                <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Win Rate</span>
                                    <span>Profit Factor: {analysis.profitFactor.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Risk Metrics</h3>
                                <p className="text-3xl font-bold text-violet-600">{analysis.riskRewardRatio.toFixed(2)}</p>
                                <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Risk/Reward</span>
                                    <span>Max DD: ${Math.abs(analysis.maxDrawdown).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Trade Count</h3>
                                <p className="text-3xl font-bold text-blue-600">{tradeStats.unique}</p>
                                <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Total Trades</span>
                                    <span>Avg Duration: {analysis.averageTradeDuration}h</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Symbol Groups */}
                    {positions.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            {Object.entries(groupedBySymbol).map(([symbol, symbolPositions]) => (
                                <div key={symbol} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h2>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                symbolPositions.reduce((sum, pos) => sum + pos.totalPL, 0) >= 0 
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                ${symbolPositions.reduce((sum, pos) => sum + pos.totalPL, 0).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {symbolPositions.map((position, index) => (
                                                <div key={`${position.symbol}-${position.openingTime}-${index}`} 
                                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                position.openingDir.toLowerCase() === 'buy' 
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                            }`}>
                                                                {position.openingDir}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                {position.openingTime}
                                                            </span>
                                                        </div>
                                                        <span className={`text-lg font-bold ${
                                                            position.totalPL >= 0 
                                                                ? 'text-emerald-600 dark:text-emerald-400' 
                                                                : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                            {position.totalPL >= 0 ? '+' : ''}{position.totalPL.toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 dark:text-gray-400">Entry</span>
                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                {typeof position.entry === 'number' ? position.entry.toFixed(5) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 dark:text-gray-400">Exit</span>
                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                {typeof position.exit === 'number' ? position.exit.toFixed(5) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 dark:text-gray-400">Volume</span>
                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                {position.initialVolume || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 dark:text-gray-400">Pips</span>
                                                            <span className={`font-semibold ${
                                                                position.pips >= 0 
                                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                                    : 'text-red-600 dark:text-red-400'
                                                            }`}>
                                                                {position.pips?.toFixed(1) || '0.0'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Raw Trades Table */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trade History</h2>
                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Direction</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Entry Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">P/L</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pips</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {rawTrades.map((trade, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trade.orderId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trade.symbol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    trade.openDirection === 'Buy' 
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                }`}>
                                                    {trade.openDirection}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trade.entryPrice?.toFixed(5)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trade.closePrice?.toFixed(5)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{trade.quantity?.toFixed(2)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                                (trade.netPnL || 0) >= 0 
                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {trade.netPnL?.toFixed(2)}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                                (trade.pips || 0) >= 0 
                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {trade.pips?.toFixed(1)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}