// metrics.js
import { sampleTradeData } from './trades.js';

export function calculateMetrics(start, end, account) {
    const trades = sampleTradeData[account] || [];
    let netPL = 0, totalTrades = 0, totalWins = 0, totalLosses = 0;
    let winningDays = 0, losingDays = 0, tradingDays = new Set();
    let avgWin = 0, avgLoss = 0, winCount = 0, lossCount = 0;

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const filteredTrades = trades.filter(trade => trade.date >= startStr && trade.date <= endStr);

    const dailyProfits = {};
    filteredTrades.forEach(trade => {
        netPL += trade.profit;
        totalTrades += 1;
        if (trade.profit > 0) {
            totalWins += 1; avgWin += trade.profit; winCount += 1;
        } else if (trade.profit < 0) {
            totalLosses += 1; avgLoss += Math.abs(trade.profit); lossCount += 1;
        }
        tradingDays.add(trade.date);
        dailyProfits[trade.date] = (dailyProfits[trade.date] || 0) + trade.profit;
    });

    for (const date in dailyProfits) {
        if (dailyProfits[date] > 0) winningDays++;
        else if (dailyProfits[date] < 0) losingDays++;
    }

    const tradeWinPercent = totalTrades > 0 ? (totalWins / totalTrades * 100).toFixed(2) : 0;
    const dayWinPercent = tradingDays.size > 0 ? (winningDays / tradingDays.size * 100).toFixed(2) : 0;
    const winLossRatio = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : avgWin > 0 ? '∞' : 0;

    return {
        netPL: Math.round(netPL),
        tradeWinPercent,
        dayWinPercent,
        winLossRatio,
        totalWins,
        totalLosses,
        totalNeutral: totalTrades - totalWins - totalLosses,
        winningDays,
        losingDays,
        neutralDays: tradingDays.size - winningDays - losingDays,
        avgWin: formatCurrency(Math.round(avgWin / (winCount || 1))),
        avgLoss: formatCurrency(Math.round(-avgLoss / (lossCount || 1)))
    };
}

export function updateDashboardMetrics(metrics) {
    const netPLValue = document.querySelector('.card:nth-child(1) .card-value');
    netPLValue.textContent = formatCurrency(metrics.netPL);
    netPLValue.classList.remove('profit', 'loss', 'zero');
    if (metrics.netPL > 0) netPLValue.classList.add('profit');
    else if (metrics.netPL < 0) netPLValue.classList.add('loss');
    else netPLValue.classList.add('zero');

    document.querySelector('.card:nth-child(2) .card-value').textContent = `${metrics.tradeWinPercent}%`;
    document.querySelector('.card:nth-child(2) .indicator.win').textContent = metrics.totalWins;
    document.querySelector('.card:nth-child(2) .indicator.neutral').textContent = metrics.totalNeutral;
    document.querySelector('.card:nth-child(2) .indicator.loss').textContent = metrics.totalLosses;
    document.querySelector('.card:nth-child(3) .card-value').textContent = `${metrics.dayWinPercent}%`;
    document.querySelector('.card:nth-child(3) .indicator.win').textContent = metrics.winningDays;
    document.querySelector('.card:nth-child(3) .indicator.neutral').textContent = metrics.neutralDays;
    document.querySelector('.card:nth-child(3) .indicator.loss').textContent = metrics.losingDays;
    document.querySelector('.card:nth-child(4) .card-value').textContent = metrics.winLossRatio;
    document.querySelector('.card:nth-child(4) .win-value').textContent = metrics.avgWin;
    document.querySelector('.card:nth-child(4) .loss-value').textContent = metrics.avgLoss;
}

export function formatCurrency(value) {
    return (value >= 0 ? '$' : '-$') + Math.abs(value).toFixed(0);
}