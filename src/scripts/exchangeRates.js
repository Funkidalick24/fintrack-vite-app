const EXCHANGE_API_URL = import.meta.env.VITE_EXCHANGE_API_URL;

async function loadCurrencies() {
    const res = await fetch('/json/currencies.json');
    return res.json();
}

async function fetchExchangeRates(base = 'USD', target = 'EUR') {
    const ratesContainer = document.getElementById('rates');
    if (!ratesContainer) return;
    try {
        const response = await fetch(EXCHANGE_API_URL.replace('USD', base));
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        const data = await response.json();
        const rates = data.conversion_rates;
        ratesContainer.innerHTML = `
            <p>1 ${base} = ${rates[target]} ${target}</p>
        `;
    } catch (error) {
        ratesContainer.innerHTML = '<p>Error loading exchange rates.</p>';
        console.error(error);
    }
}

async function setupCurrencyDropdown() {
    const select = document.getElementById('currency-select');
    if (!select) return;
    const currencies = await loadCurrencies();
    select.innerHTML = Object.entries(currencies)
        .map(([code, info]) => `<option value="${code}">${code} - ${info.name}</option>`)
        .join('');
    select.value = 'EUR'; // Default selection
    select.addEventListener('change', () => {
        fetchExchangeRates('USD', select.value);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await setupCurrencyDropdown();
    const select = document.getElementById('currency-select');
    fetchExchangeRates('USD', select.value);
});