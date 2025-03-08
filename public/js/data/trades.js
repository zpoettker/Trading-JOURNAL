// /public/js/data/trades.js
let _currentStartDate = new Date('2025-02-01');
let _currentEndDate = new Date('2025-02-28');

export const currentStartDate = () => _currentStartDate;
export const currentEndDate = () => _currentEndDate;
export const setCurrentStartDate = (date) => _currentStartDate = new Date(date);
export const setCurrentEndDate = (date) => _currentEndDate = new Date(date);

export const sampleTradeData = {
    Apex: [
        { date: '2025-02-04', symbol: 'NQ', profit: 100, type: 'Long', quantity: 1 },
        { date: '2025-02-04', symbol: 'MNQ', profit: 118, type: 'Short', quantity: 2 },
        { date: '2025-02-06', symbol: 'NQ', profit: -50, type: 'Long', quantity: 1 },
        { date: '2025-02-06', symbol: 'NQ', profit: 200, type: 'Short', quantity: 1 },
        { date: '2025-02-06', symbol: 'MNQ', profit: 135, type: 'Long', quantity: 3 },
        { date: '2025-02-11', symbol: 'NQ', profit: -30, type: 'Long', quantity: 1 },
        { date: '2025-02-12', symbol: 'MNQ', profit: -80, type: 'Short', quantity: 2 },
        { date: '2025-02-12', symbol: 'NQ', profit: -81, type: 'Long', quantity: 1 },
        { date: '2025-02-13', symbol: 'NQ', profit: 150, type: 'Long', quantity: 1 },
        { date: '2025-02-13', symbol: 'MNQ', profit: 173, type: 'Short', quantity: 2 },
        { date: '2025-02-14', symbol: 'NQ', profit: 300, type: 'Long', quantity: 1 },
        { date: '2025-02-14', symbol: 'MNQ', profit: 241, type: 'Short', quantity: 3 },
        { date: '2025-02-17', symbol: 'NQ', profit: -500, type: 'Long', quantity: 2 },
        { date: '2025-02-17', symbol: 'MNQ', profit: -840, type: 'Short', quantity: 4 },
        { date: '2025-02-19', symbol: 'NQ', profit: 100, type: 'Long', quantity: 1 },
        { date: '2025-02-19', symbol: 'MNQ', profit: 114, type: 'Short', quantity: 2 },
        { date: '2025-02-20', symbol: 'NQ', profit: -215, type: 'Long', quantity: 1 },
        { date: '2025-02-25', symbol: 'MNQ', profit: -268, type: 'Short', quantity: 2 },
        { date: '2025-02-26', symbol: 'NQ', profit: 300, type: 'Long', quantity: 1 },
        { date: '2025-02-26', symbol: 'MNQ', profit: 323, type: 'Short', quantity: 2 },
        { date: '2025-02-27', symbol: 'NQ', profit: 150, type: 'Long', quantity: 1 },
        { date: '2025-02-27', symbol: 'MNQ', profit: 195, type: 'Short', quantity: 2 },
        { date: '2025-02-28', symbol: 'NQ', profit: 250, type: 'Long', quantity: 1 },
        { date: '2025-02-28', symbol: 'MNQ', profit: 239, type: 'Short', quantity: 3 }
    ],
    Topstep: [
        { date: '2025-02-05', symbol: 'ES', profit: 75, type: 'Long', quantity: 1 },
        { date: '2025-02-05', symbol: 'MES', profit: 25, type: 'Short', quantity: 2 },
        { date: '2025-02-05', symbol: 'ES', profit: 50, type: 'Long', quantity: 1 },
        { date: '2025-02-10', symbol: 'ES', profit: -30, type: 'Long', quantity: 1 },
        { date: '2025-02-10', symbol: 'MES', profit: -20, type: 'Short', quantity: 2 },
        { date: '2025-02-15', symbol: 'ES', profit: 100, type: 'Long', quantity: 1 },
        { date: '2025-02-15', symbol: 'MES', profit: 200, type: 'Short', quantity: 2 }
    ],
    MFFU: [
        { date: '2025-02-07', symbol: 'CL', profit: -100, type: 'Long', quantity: 1 },
        { date: '2025-02-20', symbol: 'CL', profit: 50, type: 'Short', quantity: 2 },
        { date: '2025-02-20', symbol: 'MCL', profit: 150, type: 'Long', quantity: 3 },
        { date: '2025-02-25', symbol: 'CL', profit: 200, type: 'Long', quantity: 1 },
        { date: '2025-02-25', symbol: 'MCL', profit: 250, type: 'Short', quantity: 2 }
    ]
};