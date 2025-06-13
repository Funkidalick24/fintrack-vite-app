const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL;
const NEWS_API_KEY = 'afbba5b9f4mshb703ccb8c024495p1b99e8jsn3b425c0a67e3';

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': NEWS_API_KEY,
    'x-rapidapi-host': 'insightsentry.p.rapidapi.com'
  }
};

const ARTICLES_PER_PAGE = 25;
let currentPage = 1;
let allArticles = [];

async function fetchAllNews() {
  try {
    const response = await fetch(NEWS_API_URL, options);
    const data = await response.json();
    allArticles = data?.data || [];
    renderAllNews();
    renderPagination();
  } catch (error) {
    document.getElementById('news-list').innerHTML = '<p>Failed to load news.</p>';
    console.error(error);
  }
}

function renderAllNews() {
  const newsDiv = document.getElementById('news-list');
  if (!allArticles.length) {
    newsDiv.innerHTML = '<p>No news available.</p>';
    return;
  }
  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const articlesToShow = allArticles.slice(start, end);

  newsDiv.innerHTML = `
    <ul class="news-list">
      ${articlesToShow.map(article => `
        <li class="news-item">
          <a href="${article.link}" target="_blank" rel="noopener">
            <strong>${article.title}</strong>
          </a>
          <p>${article.summary || ''}</p>
        </li>
      `).join('')}
    </ul>
    <div id="news-pagination"></div>
  `;
}

function renderPagination() {
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const paginationDiv = document.getElementById('news-pagination');
  if (totalPages <= 1) {
    paginationDiv.innerHTML = '';
    return;
  }

  let buttons = '';

  // Previous arrow
  buttons += `<button class="news-page-arrow" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&#8592;</button>`;

  // Page numbers (show up to 5 pages around current)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  if (currentPage <= 3) endPage = Math.min(5, totalPages);
  if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

  for (let i = startPage; i <= endPage; i++) {
    buttons += `<button class="news-page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }

  // Next arrow
  buttons += `<button class="news-page-arrow" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">&#8594;</button>`;

  // Page jump input
  buttons += `
    <span class="news-page-jump">
      <input type="number" min="1" max="${totalPages}" value="${currentPage}" id="news-page-input" style="width: 3rem;">
      <button id="news-page-go">Go</button>
      <span> / ${totalPages}</span>
    </span>
  `;

  paginationDiv.innerHTML = buttons;

  // Page number buttons
  document.querySelectorAll('.news-page-btn').forEach(btn => {
    btn.onclick = (e) => {
      currentPage = Number(e.target.getAttribute('data-page'));
      renderAllNews();
      renderPagination();
    };
  });

  // Arrow buttons
  document.querySelectorAll('.news-page-arrow').forEach(btn => {
    btn.onclick = (e) => {
      const page = Number(e.target.getAttribute('data-page'));
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderAllNews();
        renderPagination();
      }
    };
  });

  // Page jump input
  document.getElementById('news-page-go').onclick = () => {
    const input = document.getElementById('news-page-input');
    let page = Number(input.value);
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      renderAllNews();
      renderPagination();
    } else {
      input.value = currentPage;
    }
  };
}

fetchAllNews();