// recent-trades.js
import { sampleTradeData } from '../data/trades.js';
import { formatCurrency } from '../data/metrics.js';

export function updateRecentTrades(start, end, account) {
    const trades = sampleTradeData[account] || [];
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const filteredTrades = trades
        .filter(trade => trade.date >= startStr && trade.date <= endStr)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

    const tbody = document.getElementById('recentTradesBody');
    tbody.innerHTML = '';

    filteredTrades.forEach(trade => {
        const row = document.createElement('tr');
        const profitClass = trade.profit > 0 ? 'profit' : trade.profit < 0 ? 'loss' : '';
        row.innerHTML = `
            <td>${formatDate(trade.date)}</td>
            <td>${trade.symbol}</td>
            <td class="${profitClass}">${formatCurrency(trade.profit)}</td>
        `;
        tbody.appendChild(row);
    });

    if (filteredTrades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-secondary);">No trades found for this period</td></tr>';
    }
}

export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}