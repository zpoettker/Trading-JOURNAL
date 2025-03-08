// calendar.js
import { sampleTradeData } from '../data/trades.js';
import { formatCurrency } from '../data/metrics.js';

export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export function updateCalendar(year, month, account) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthDisplay = document.querySelector('.calendar-nav h3');
    monthDisplay.textContent = `${months[month]} ${year}`;

    const calendarGrid = document.querySelector('.calendar-grid');
    calendarGrid.innerHTML = '';

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const trades = sampleTradeData[account] || [];

    const dailyData = {};
    trades.forEach(trade => {
        const [tradeYear, tradeMonth] = trade.date.split('-').map(Number);
        if (tradeYear === year && tradeMonth - 1 === month) {
            dailyData[trade.date] = dailyData[trade.date] || { profit: 0, trades: 0, wins: 0 };
            dailyData[trade.date].profit += trade.profit;
            dailyData[trade.date].trades += 1;
            if (trade.profit > 0) dailyData[trade.date].wins += 1;
        }
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (dailyData[dateKey]) {
            const { profit, trades: tradeCount, wins } = dailyData[dateKey];
            dayDiv.className += profit >= 0 ? ' profit' : ' loss';

            const profitDiv = document.createElement('div');
            profitDiv.className = 'day-profit';
            profitDiv.textContent = formatCurrency(Math.round(profit));

            const tradesDiv = document.createElement('div');
            tradesDiv.className = 'day-trades';
            tradesDiv.textContent = `${tradeCount} trade${tradeCount === 1 ? '' : 's'}`;

            const percentageDiv = document.createElement('div');
            percentageDiv.className = 'day-percentage';
            percentageDiv.textContent = `${(wins / tradeCount * 100).toFixed(2)}%`;

            dayDiv.appendChild(profitDiv);
            dayDiv.appendChild(tradesDiv);
            dayDiv.appendChild(percentageDiv);
        }

        calendarGrid.appendChild(dayDiv);
    }
}