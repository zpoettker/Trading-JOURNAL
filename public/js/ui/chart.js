// chart.js
import { sampleTradeData } from '../data/trades.js';

let chartInstance = null;

export function updateChart(start, end, account) {
    const canvas = document.getElementById('pnlChart');
    if (!canvas) {
        console.error('Chart canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const trades = sampleTradeData[account] || {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysInRange = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const visibleDates = [];
    const dataPoints = [];
    let cumulativePL = 0;

    const dailyPL = {};
    trades.forEach(trade => {
        if (trade.date >= startDate.toISOString().slice(0, 10) && trade.date <= endDate.toISOString().slice(0, 10)) {
            dailyPL[trade.date] = (dailyPL[trade.date] || 0) + trade.profit;
        }
    });

    for (let i = 0; i < daysInRange; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().slice(0, 10);
        visibleDates.push(dateStr.slice(5));
        if (i === 0) dataPoints.push({ x: 0, y: 0 });
        else {
            if (dailyPL[dateStr]) cumulativePL += dailyPL[dateStr];
            dataPoints.push({ x: i, y: Math.round(cumulativePL) });
        }
    }

    const extendedData = [];
    for (let i = 0; i < dataPoints.length - 1; i++) {
        const point1 = dataPoints[i];
        const point2 = dataPoints[i + 1];
        extendedData.push(point1);
        const y1 = point1.y, y2 = point2.y;
        if ((y1 < 0 && y2 > 0) || (y1 > 0 && y2 < 0)) {
            const x1 = point1.x, x2 = point2.x;
            const fraction = Math.abs(y1) / (Math.abs(y1) + Math.abs(y2));
            const crossX = x1 + (x2 - x1) * fraction;
            extendedData.push({ x: crossX, y: 0 });
        }
    }
    extendedData.push(dataPoints[dataPoints.length - 1]);

    const maxLabels = 10;
    const stepSize = Math.max(1, Math.ceil(daysInRange / maxLabels));

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Net P&L',
                data: extendedData,
                borderWidth: 2,
                fill: { target: 'origin', above: 'rgba(0, 196, 140, 0.2)', below: 'rgba(255, 92, 92, 0.2)' },
                tension: 0,
                pointRadius: (context) => (context.raw.y === 0 ? 0 : 4),
                pointHoverRadius: (context) => (context.raw.y === 0 ? 0 : 6),
                segment: {
                    borderColor: (ctx) => {
                        const y1 = ctx.p1.parsed.y, y2 = ctx.p0.parsed.y;
                        if (y1 >= 0 && y2 >= 0) return '#00c48c';
                        if (y1 <= 0 && y2 <= 0) return '#ff5c5c';
                        return y1 > 0 ? '#00c48c' : '#ff5c5c';
                    }
                }
            }, {
                label: 'Zero Line',
                data: visibleDates.map((_, index) => ({ x: index, y: 0 })),
                borderColor: '#8a8d98',
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', min: 0, max: visibleDates.length - 1, grid: { color: 'rgba(255, 255, 255, 0.05)', drawOnChartArea: true, drawTicks: true, tickBorderDash: [5, 5] }, ticks: { color: '#8a8d98', stepSize, callback: (value) => value % stepSize === 0 && value <= visibleDates.length - 1 ? visibleDates[value] || '' : '', autoSkip: false } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8a8d98', callback: (value) => '$' + Math.round(value) } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1d26',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2a2e3a',
                    borderWidth: 1,
                    displayColors: false,
                    filter: (tooltipItem) => tooltipItem.raw.y !== 0,
                    callbacks: {
                        title: (tooltipItems) => visibleDates[Math.round(tooltipItems[0].parsed.x)] || '',
                        label: (context) => {
                            const index = context.dataIndex, currentValue = context.parsed.y;
                            let previousValue = 0;
                            for (let i = index - 1; i >= 0; i--) {
                                if (extendedData[i].y !== 0) { previousValue = extendedData[i].y; break; }
                            }
                            const relativeChange = currentValue - previousValue;
                            return (relativeChange >= 0 ? '+$' : '-$') + Math.abs(relativeChange);
                        }
                    }
                }
            }
        }
    });
}