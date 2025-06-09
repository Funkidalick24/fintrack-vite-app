const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL;

const newsContainer = document.getElementById('news-container');
if (!newsContainer) {
    console.error('News container not found');
}

async function fetchFinanceNews() {
    try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching finance news:', error);
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
    }
}