const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ORIGINAL_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const keyInput = document.getElementById('pass-key-input');
const setKeyBtn = document.getElementById('set-key-btn');
const moviesContainer = document.getElementById('movies-container');
const genreFiltersContainer = document.getElementById('genre-filters');
const searchInput = document.getElementById('search-input');

// Modal Elements
const modal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body-content');
const closeModalBtn = document.querySelector('.close-modal');

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

// Search functionality
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            initializeDashboard(); // Reset to trending if empty
        }
    }
});

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
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
        setKeyBtn.textContent = 'Load';
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

async function searchMovies(query) {
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to search');
        const data = await res.json();

        // Hide genre filters during search to avoid confusion or filter logic complexity
        genreFiltersContainer.style.display = 'none';

        renderMovies(data.results);
    } catch (error) {
        console.error(error);
        alert('Search failed');
    }
}

function renderGenres() {
    const existingButtons = genreFiltersContainer.querySelectorAll('.filter-btn:not([data-id="all"])');
    existingButtons.forEach(btn => btn.remove());

    const availableGenreIds = new Set();
    allMovies.forEach(movie => {
        movie.genre_ids.forEach(id => availableGenreIds.add(id));
    });

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

    const allBtn = genreFiltersContainer.querySelector('[data-id="all"]');
    allBtn.onclick = () => filterMovies('all', allBtn);
}

function renderMovies(movies) {
    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const { id, title, poster_path, vote_average, release_date } = movie;
        const ratingClass = vote_average >= 8 ? 'rating-high' : vote_average >= 5 ? 'rating-mid' : 'rating-low';

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.addEventListener('click', () => getMovieDetails(id));

        card.innerHTML = `
            <div class="poster-container">
                <img src="${poster_path ? IMAGE_BASE_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${title}">
                <span class="rating-badge ${ratingClass}">${vote_average.toFixed(1)}</span>
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
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    if (genreId === 'all') {
        renderMovies(allMovies);
    } else {
        const filtered = allMovies.filter(movie => movie.genre_ids.includes(Number(genreId)));
        renderMovies(filtered);
    }
}

async function getMovieDetails(id) {
    try {
        // Fetch details + credits + videos in one go
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos`);
        if (!res.ok) throw new Error('Failed to get details');
        const data = await res.json();
        openModal(data);
    } catch (error) {
        console.error(error);
        alert('Could not load movie details');
    }
}

function openModal(movie) {
    const { title, poster_path, overview, vote_average, release_date, runtime, genres, credits, videos, tagline } = movie;

    // Find trailer
    const trailer = videos.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer') || videos.results[0];
    const cast = credits.cast.slice(0, 6); // Top 6 cast members

    const genreNames = genres.map(g => g.name).join(', ');
    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;

    modalBody.innerHTML = `
        <img class="modal-poster" src="${poster_path ? ORIGINAL_IMAGE_BASE_URL + poster_path : 'https://via.placeholder.com/500x750'}" alt="${title}">
        <div class="modal-info">
            <h2 class="modal-title">${title} <span style="font-size: 0.5em; opacity: 0.7;">(${new Date(release_date).getFullYear()})</span></h2>
            ${tagline ? `<p class="modal-tagline">"${tagline}"</p>` : ''}
            
            <div class="modal-meta">
                <span class="meta-item">⭐ ${vote_average.toFixed(1)}</span>
                <span class="meta-item">⏱ ${hours}h ${mins}m</span>
                <span class="meta-item">${genreNames}</span>
            </div>

            <div class="modal-section-title">Overview</div>
            <p class="modal-overview">${overview}</p>

            <div class="modal-section-title">Cast</div>
            <div class="cast-list">
                ${cast.map(actor => `
                    <div class="cast-item">
                        <img class="cast-img" src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://via.placeholder.com/100?text=User'}" alt="${actor.name}">
                        <div class="cast-name">${actor.name}</div>
                        <div class="cast-char">${actor.character}</div>
                    </div>
                `).join('')}
            </div>

            ${trailer ? `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" class="trailer-btn">▶ Play Trailer</a>` : ''}
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}
