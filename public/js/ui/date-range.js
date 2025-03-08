// /public/js/ui/date-range.js
import { updateChart } from './chart.js';
import { updateRecentTrades } from './recent-trades.js';
import { calculateMetrics, updateDashboardMetrics } from '../data/metrics.js';
import { currentStartDate, currentEndDate, setCurrentStartDate, setCurrentEndDate } from '../data/trades.js'; // Updated import
import { getDaysInMonth, getFirstDayOfMonth } from './calendar.js';

export function initDateRange() {
    const dateRangeToggle = document.querySelector('.date-range-toggle');
    const dateRangeDropdown = document.querySelector('.date-range-dropdown');

    dateRangeToggle.addEventListener('click', () => {
        dateRangeDropdown.style.display = dateRangeDropdown.style.display === 'none' ? 'block' : 'none';
    });

    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const range = btn.dataset.range;
            const today = new Date('2025-03-03');
            let start, end;
            switch (range) {
                case 'last-week':
                    start = new Date(today); start.setDate(today.getDate() - today.getDay() - 7);
                    end = new Date(start); end.setDate(start.getDate() + 6); break;
                case 'this-week':
                    start = new Date(today); start.setDate(today.getDate() - today.getDay());
                    end = new Date(today); end.setDate(start.getDate() + 6); break;
                case 'last-month':
                    start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    end = new Date(today.getFullYear(), today.getMonth(), 0); break;
                case 'this-month':
                    start = new Date(today.getFullYear(), today.getMonth(), 1);
                    end = new Date(today.getFullYear(), today.getMonth() + 1, 0); break;
                case 'this-year':
                    start = new Date(today.getFullYear(), 0, 1);
                    end = new Date(today.getFullYear(), 11, 31); break;
                case 'ytd':
                    start = new Date(today.getFullYear(), 0, 1);
                    end = today; break;
            }
            const selectedAccount = document.querySelector('.account-toggle').childNodes[0].textContent;
            updateDateRange(start, end, selectedAccount);
            dateRangeDropdown.style.display = 'none';
        });
    });

    let currentMiniMonth = 1, currentMiniYear = 2025;
    const miniCalendar = document.querySelector('.mini-calendar');
    const prevMiniMonth = miniCalendar.querySelector('.prev-month');
    const nextMiniMonth = miniCalendar.querySelector('.next-month');
    const monthYearDisplay = miniCalendar.querySelector('.month-year');
    const daysContainer = miniCalendar.querySelector('.days');
    const selectedRangeDisplay = document.querySelector('.selected-range');
    const applyRangeBtn = document.querySelector('.apply-range');
    let startDate = null, endDate = null;

    function updateMiniCalendar(year, month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthYearDisplay.textContent = `${months[month]} ${year}`;
        daysContainer.innerHTML = '';
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day disabled';
            daysContainer.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.textContent = day;
            dayEl.addEventListener('click', () => selectDay(year, month, day));
            daysContainer.appendChild(dayEl);
        }
        updateSelectedRangeDisplay();
    }

    function selectDay(year, month, day) {
        const selectedDate = new Date(year, month, day);
        if (!startDate || (startDate && endDate)) {
            startDate = selectedDate; endDate = null;
        } else if (selectedDate < startDate) {
            endDate = startDate; startDate = selectedDate;
        } else {
            endDate = selectedDate;
        }
        updateMiniCalendarStyles();
        updateSelectedRangeDisplay();
    }

    function updateMiniCalendarStyles() {
        const days = daysContainer.querySelectorAll('.day');
        days.forEach(day => {
            const dayNum = parseInt(day.textContent);
            const date = new Date(currentMiniYear, currentMiniMonth, dayNum);
            day.classList.remove('selected', 'in-range');
            if (startDate && date.getTime() === startDate.getTime()) day.classList.add('selected');
            if (endDate && date.getTime() === endDate.getTime()) day.classList.add('selected');
            if (startDate && endDate && date > startDate && date < endDate) day.classList.add('in-range');
        });
    }

    function updateSelectedRangeDisplay() {
        if (startDate && endDate) {
            selectedRangeDisplay.textContent = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else if (startDate) {
            selectedRangeDisplay.textContent = `From ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else {
            selectedRangeDisplay.textContent = 'Select range';
        }
    }

    prevMiniMonth.addEventListener('click', () => {
        currentMiniMonth--;
        if (currentMiniMonth < 0) { currentMiniMonth = 11; currentMiniYear--; }
        updateMiniCalendar(currentMiniYear, currentMiniMonth);
    });

    nextMiniMonth.addEventListener('click', () => {
        currentMiniMonth++;
        if (currentMiniMonth > 11) { currentMiniMonth = 0; currentMiniYear++; }
        updateMiniCalendar(currentMiniYear, currentMiniMonth);
    });

    applyRangeBtn.addEventListener('click', () => {
        if (startDate && endDate) {
            const selectedAccount = document.querySelector('.account-toggle').childNodes[0].textContent;
            updateDateRange(startDate, endDate, selectedAccount);
            dateRangeDropdown.style.display = 'none';
        }
    });

    updateMiniCalendar(currentMiniYear, currentMiniMonth);

    const accountToggle = document.querySelector('.account-toggle');
    const accountDropdown = document.querySelector('.account-dropdown');
    const accountOptions = document.querySelectorAll('.account-option');
    const accountSelector = document.querySelector('.account-selector');

    accountToggle.addEventListener('click', () => {
        accountDropdown.style.display = accountDropdown.style.display === 'none' ? 'block' : 'none';
    });

    accountOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedAccount = option.dataset.account;
            accountToggle.childNodes[0].textContent = selectedAccount;
            accountDropdown.style.display = 'none';
            accountOptions.forEach(opt => opt.classList.toggle('selected', opt.dataset.account === selectedAccount));
            updateDateRange(currentStartDate(), currentEndDate(), selectedAccount); // Updated to call functions
        });
    });

    document.addEventListener('click', (event) => {
        if (!accountSelector.contains(event.target)) accountDropdown.style.display = 'none';
    });

    const defaultAccount = 'Apex';
    accountToggle.childNodes[0].textContent = defaultAccount;
    accountOptions.forEach(opt => opt.classList.toggle('selected', opt.dataset.account === defaultAccount));
}

export function updateDateRange(start, end, account) {
    setCurrentStartDate(start);
    setCurrentEndDate(end);

    const metrics = calculateMetrics(start, end, account);
    updateDashboardMetrics(metrics);
    updateChart(start, end, account);
    updateRecentTrades(start, end, account);
}