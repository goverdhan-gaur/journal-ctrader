// import { Position, Trade } from './groupedTrades';

// export interface TradeAnalysis {
//     totalProfit: number;
//     totalLoss: number;
//     avgProfitPerTrade: number;
//     avgLossPerTrade: number;
//     riskRewardRatio: number;
//     totalPips: number;
//     winRate: number;
//     maxDrawdown: number;
//     maxConsecutiveWins: number;
//     maxConsecutiveLosses: number;
//     profitFactor: number;
//     totalTrades: number;
//     profitableTrades: number;
//     lossTrades: number;
//     largestWin: number;
//     largestLoss: number;
//     averageWinningTrade: number;
//     averageLosingTrade: number;
//     averageTradeDuration: string;
// }

// export function analyzeTradePerformance(positions: Position[]): TradeAnalysis {
//     let totalProfit = 0;
//     let totalLoss = 0;
//     let totalPips = 0;
//     let winningTrades = 0;
//     let losingTrades = 0;
//     let consecutiveWins = 0;
//     let consecutiveLosses = 0;
//     let maxConsecutiveWins = 0;
//     let maxConsecutiveLosses = 0;
//     let currentDrawdown = 0;
//     let maxDrawdown = 0;
//     let peakBalance = 0;
//     let currentBalance = 0;
//     let totalWinAmount = 0;
//     let totalLossAmount = 0;
//     let largestWin = 0;
//     let largestLoss = 0;
//     let totalDurationMs = 0;

//     // Process each position
//     positions.forEach((position) => {
//         const totalPL = position.totalPL;
//         currentBalance += totalPL;
        
//         // Update peak balance and drawdown
//         if (currentBalance > peakBalance) {
//             peakBalance = currentBalance;
//             currentDrawdown = 0;
//         } else {
//             currentDrawdown = peakBalance - currentBalance;
//             maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
//         }

//         // Calculate pips for the position
//         let positionPips = 0;
//         position.trades.forEach(trade => {
//             const pipDiff = (trade.openingDir === 'Buy') 
//                 ? (trade.exit - trade.entry) * 10000 
//                 : (trade.entry - trade.exit) * 10000;
//             positionPips += pipDiff;
//         });
//         totalPips += positionPips;

//         // Update profit/loss statistics
//         if (totalPL > 0) {
//             totalProfit += totalPL;
//             winningTrades++;
//             totalWinAmount += totalPL;
//             largestWin = Math.max(largestWin, totalPL);
//             consecutiveWins++;
//             consecutiveLosses = 0;
//             maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
//         } else if (totalPL < 0) {
//             totalLoss += Math.abs(totalPL);
//             losingTrades++;
//             totalLossAmount += Math.abs(totalPL);
//             largestLoss = Math.min(largestLoss, totalPL);
//             consecutiveLosses++;
//             consecutiveWins = 0;
//             maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
//         }

//         // Calculate trade duration
//         const openTime = new Date(position.openingTime).getTime();
//         const closeTime = new Date(position.trades[position.trades.length - 1].closingTime).getTime();
//         totalDurationMs += closeTime - openTime;
//     });

//     const totalTrades = positions.length;
//     const avgDurationMs = totalDurationMs / totalTrades;
//     const avgDurationHours = avgDurationMs / (1000 * 60 * 60);
    
//     const analysis: TradeAnalysis = {
//         totalProfit,
//         totalLoss,
//         avgProfitPerTrade: winningTrades > 0 ? totalWinAmount / winningTrades : 0,
//         avgLossPerTrade: losingTrades > 0 ? totalLossAmount / losingTrades : 0,
//         riskRewardRatio: totalLoss > 0 ? totalProfit / totalLoss : 0,
//         totalPips,
//         winRate: (winningTrades / totalTrades) * 100,
//         maxDrawdown,
//         maxConsecutiveWins,
//         maxConsecutiveLosses,
//         profitFactor: totalLoss > 0 ? totalProfit / totalLoss : 0,
//         totalTrades,
//         profitableTrades: winningTrades,
//         lossTrades: losingTrades,
//         largestWin,
//         largestLoss,
//         averageWinningTrade: winningTrades > 0 ? totalWinAmount / winningTrades : 0,
//         averageLosingTrade: losingTrades > 0 ? totalLossAmount / losingTrades : 0,
//         averageTradeDuration: `${avgDurationHours.toFixed(2)} hours`
//     };

//     return analysis;
// }

// export function generateTradeReport(analysis: TradeAnalysis): string {
//     return `
// Trade Performance Analysis
// -------------------------
// Total Trades: ${analysis.totalTrades}
// Win Rate: ${analysis.winRate.toFixed(2)}%
// Profit Factor: ${analysis.profitFactor.toFixed(2)}

// Profitability Metrics
// --------------------
// Total Profit: $${analysis.totalProfit.toFixed(2)}
// Total Loss: $${analysis.totalLoss.toFixed(2)}
// Net P/L: $${(analysis.totalProfit - analysis.totalLoss).toFixed(2)}
// Total Pips: ${analysis.totalPips.toFixed(1)}

// Average Trade Metrics
// -------------------
// Avg Profit per Trade: $${analysis.avgProfitPerTrade.toFixed(2)}
// Avg Loss per Trade: $${analysis.avgLossPerTrade.toFixed(2)}
// Risk/Reward Ratio: ${analysis.riskRewardRatio.toFixed(2)}
// Average Trade Duration: ${analysis.averageTradeDuration}

// Risk Metrics
// -----------
// Max Drawdown: $${analysis.maxDrawdown.toFixed(2)}
// Largest Win: $${analysis.largestWin.toFixed(2)}
// Largest Loss: $${analysis.largestLoss.toFixed(2)}

// Streak Analysis
// --------------
// Max Consecutive Wins: ${analysis.maxConsecutiveWins}
// Max Consecutive Losses: ${analysis.maxConsecutiveLosses}
// `;
// }
