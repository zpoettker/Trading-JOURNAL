// /public/js/main.js
import { currentStartDate, currentEndDate } from './data/trades.js'; // Now functions
import { updateChart } from './ui/chart.js';
import { updateDateRange } from './ui/date-range.js';
import { initSidebarMenu } from './ui/sidebar.js';
import { initDateRange as initDateRangeUI } from './ui/date-range.js';
import { updateCalendar } from './ui/calendar.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initEventListeners();
    initSidebarMenu();
    initDateRangeUI();
    console.log('Event listeners initialized');
    initSampleData();

    const selectedAccount = 'Apex';
    updateChart(currentStartDate(), currentEndDate(), selectedAccount); // Call as functions
    updateDateRange(currentStartDate(), currentEndDate(), selectedAccount);

    let currentMonth = 1;
    let currentYear = 2025;
    updateCalendar(currentYear, currentMonth, selectedAccount);

    document.querySelector('.calendar-section .prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        const currentAccount = document.querySelector('.account-toggle').childNodes[0].textContent;
        updateCalendar(currentYear, currentMonth, currentAccount);
    });

    document.querySelector('.calendar-section .next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        const currentAccount = document.querySelector('.account-toggle').childNodes[0].textContent;
        updateCalendar(currentYear, currentMonth, currentAccount);
    });
});

function initEventListeners() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.container');

    console.log('Sidebar elements:', { sidebarToggle, sidebar, container }); // Add this
    sidebarToggle.addEventListener('click', () => {
        console.log('Sidebar toggle clicked'); // Add this
        sidebar.classList.toggle('collapsed');
        container.classList.toggle('sidebar-collapsed');
    });

    const addTradeBtn = document.querySelector('.add-trade-btn');
    addTradeBtn.addEventListener('click', showAddTradeModal);
}

function showAddTradeModal() {
    alert('Add Trade functionality would open a modal here');
}

function initSampleData() {
    console.log('Sample data initialized');
}