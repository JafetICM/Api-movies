const API_URL = 'http://localhost:5000/films';

// Función para manejar solicitudes a la API
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in API request:', error);
        alert('An error occurred. Please try again.');
        throw error;
    }
}

// Función para obtener y mostrar películas
async function fetchMovies() {
    try {
        showLoading(true);
        const movies = await apiRequest(API_URL);
        const movieList = document.getElementById('movies');
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="movie-item">
                    <img src="${movie.poster}" alt="${movie.title} Poster" class="movie-poster" />
                    <div>
                        <strong>${movie.title}</strong> (${movie.year}) - Directed by ${movie.director}
                        <div class="movie-controls">
                            <button onclick="deleteMovie(${movie.id})">Delete</button>
                            <button onclick="editMovie(${movie.id})">Edit</button>
                        </div>
                    </div>
                </div>
            `;
            movieList.appendChild(li);
        });
    } finally {
        showLoading(false);
    }
}

// Mostrar/Ocultar indicador de carga
function showLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = show ? 'block' : 'none';
}

// Función para mostrar/ocultar la lista de películas
document.getElementById('show-movies-btn').addEventListener('click', () => {
    const movieListSection = document.getElementById('movie-list');
    const showMoviesBtn = document.getElementById('show-movies-btn');

    if (movieListSection.style.display === 'none') {
        movieListSection.style.display = 'block';
        showMoviesBtn.textContent = 'Hide Movies';
        fetchMovies();
    } else {
        movieListSection.style.display = 'none';
        showMoviesBtn.textContent = 'Show Movies';
    }
});

// Manejar el envío del formulario
document.getElementById('movie-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const genre = document.getElementById('genre').value;
    const score = document.getElementById('score').value;
    const rating = document.getElementById('rating').value;
    const year = document.getElementById('year').value;
    const poster = document.getElementById('poster').value;

    try {
        showLoading(true);
        await apiRequest(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, director, genre, score, rating, year, poster }),
        });
        alert('Movie added successfully!');
        fetchMovies();
    } catch (error) {
        alert('Failed to add movie.');
    } finally {
        showLoading(false);
    }
});

// Eliminar película
async function deleteMovie(id) {
    if (confirm('Are you sure you want to delete this movie?')) {
        try {
            showLoading(true);
            await apiRequest(`${API_URL}/${id}`, { method: 'DELETE' });
            alert('Movie deleted successfully!');
            fetchMovies();
        } catch (error) {
            alert('Failed to delete movie.');
        } finally {
            showLoading(false);
        }
    }
}

// Editar película
async function editMovie(id) {
    const title = prompt('Enter new title:');
    const director = prompt('Enter new director:');
    const genre = prompt('Enter new genre:');
    const score = prompt('Enter new score (1-10):');
    const rating = prompt('Enter new rating:');
    const year = prompt('Enter new year:');
    const poster = prompt('Enter new poster URL:');

    if (title && director && genre && score && rating && year && poster) {
        try {
            showLoading(true);
            await apiRequest(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, director, genre, score, rating, year, poster }),
            });
            alert('Movie updated successfully!');
            fetchMovies();
        } catch (error) {
            alert('Failed to update movie.');
        } finally {
            showLoading(false);
        }
    } else {
        alert('All fields are required to update the movie.');
    }
}

// Carga inicial de películas
fetchMovies();
