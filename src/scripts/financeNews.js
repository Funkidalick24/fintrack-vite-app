const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL;
const NEWS_API_KEY = 'afbba5b9f4mshb703ccb8c024495p1b99e8jsn3b425c0a67e3';

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': NEWS_API_KEY,
    'x-rapidapi-host': 'insightsentry.p.rapidapi.com'
  }
};

async function fetchNews() {
  try {
    const response = await fetch(NEWS_API_URL, options);
    const data = await response.json();
    const articles = data?.data?.slice(0, 5) || [];
    renderNews(articles);
  } catch (error) {
    document.getElementById('news').innerHTML = '<p>Failed to load news.</p>';
    console.error(error);
  }
}

function renderNews(articles) {
  const newsDiv = document.getElementById('news');
  if (!articles.length) {
    newsDiv.innerHTML = '<p>No news available.</p>';
    return;
  }
  newsDiv.innerHTML = `
    <ul class="news-list">
     ${articles.map(article => `
    <li class="news-item">
      <a href="${article.link}" target="_blank" rel="noopener">
        <strong>${article.title}</strong>
      </a>
      <p>${article.summary || ''}</p>
    </li>
  `).join('')}
    </ul>
    <button id="show-more-news" class="cta-btn">Show More</button>
  `;

  document.getElementById('show-more-news').onclick = () => {
    window.location.href = 'news.html';
  };
}

fetchNews();