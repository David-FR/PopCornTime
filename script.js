const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const keyInput = document.getElementById('pass-key-input');
const setKeyBtn = document.getElementById('set-key-btn');
const moviesContainer = document.getElementById('movies-container');
const genreFiltersContainer = document.getElementById('genre-filters');

let apiKey = '';
let allMovies = [];
let genresMap = {};

// Restore key from local storage if available
const savedKey = localStorage.getItem('tmdb_api_key');
if (savedKey) {
    keyInput.value = savedKey;
    apiKey = savedKey;
    initializeDashboard();
}

setKeyBtn.addEventListener('click', () => {
    const value = keyInput.value.trim();
    if (value) {
        apiKey = value;
        localStorage.setItem('tmdb_api_key', apiKey);
        initializeDashboard();
    } else {
        alert('Please enter a valid API Key');
    }
});

async function initializeDashboard() {
    setKeyBtn.textContent = 'Loading...';
    setKeyBtn.disabled = true;

    try {
        await Promise.all([fetchGenres(), fetchTrending()]);

        moviesContainer.innerHTML = ''; // Clear placeholder
        genreFiltersContainer.style.display = 'flex';
        renderGenres();
        renderMovies(allMovies);

        setKeyBtn.textContent = 'Loaded';
    } catch (error) {
        console.error(error);
        alert('Failed to load data. Please check your API Key.');
        setKeyBtn.textContent = 'Load Dashboard';
        setKeyBtn.disabled = false;
    }
}

async function fetchGenres() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`);
    if (!res.ok) throw new Error('Failed to fetch genres');
    const data = await res.json();
    data.genres.forEach(g => genresMap[g.id] = g.name);
    return data.genres;
}

async function fetchTrending() {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${apiKey}`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    const data = await res.json();
    allMovies = data.results;
    return allMovies;
}

function renderGenres() {
    const existingButtons = genreFiltersContainer.querySelectorAll('.filter-btn:not([data-id="all"])');
    existingButtons.forEach(btn => btn.remove());

    // Get unique genre IDs from the fetched movies to avoid empty filters
    const availableGenreIds = new Set();
    allMovies.forEach(movie => {
        movie.genre_ids.forEach(id => availableGenreIds.add(id));
    });

    // Create buttons only for available genres
    availableGenreIds.forEach(id => {
        if (genresMap[id]) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = genresMap[id];
            btn.dataset.id = id;
            btn.addEventListener('click', () => filterMovies(id, btn));
            genreFiltersContainer.appendChild(btn);
        }
    });

    // Re-attach listener to "All" button
    const allBtn = genreFiltersContainer.querySelector('[data-id="all"]');
    allBtn.onclick = () => filterMovies('all', allBtn);
}

function renderMovies(movies) {
    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No movies found for this category.</p>';
        return;
    }

    movies.forEach(movie => {
        const { title, poster_path, vote_average, release_date, overview } = movie;
        const ratingClass = vote_average >= 8 ? 'rating-high' : vote_average >= 5 ? 'rating-mid' : 'rating-low';

        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
            <div class="poster-container">
                <img src="${poster_path ? IMAGE_BASE_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${title}">
                <span class="rating-badge ${ratingClass}">${vote_average.toFixed(1)}</span>
                <div class="movie-overview-tooltip">
                    <p>${overview ? overview : 'No overview available.'}</p>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <p class="movie-date">${release_date || 'Unknown Date'}</p>
            </div>
        `;

        moviesContainer.appendChild(card);
    });
}

function filterMovies(genreId, clickedBtn) {
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    if (genreId === 'all') {
        renderMovies(allMovies);
    } else {
        const filtered = allMovies.filter(movie => movie.genre_ids.includes(Number(genreId)));
        renderMovies(filtered);
    }
}
