

const addToFavorites = async (movie) => {
    console.log(movie)
    const token = localStorage.getItem('token');
    const userId=localStorage.getItem('userId')

    try {
        const response = await fetch('https://movies-app-api.vercel.app/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                movie_id: movie.id,
                movie_title: movie.original_title || movie.original_name,
                movie_poster: movie.poster_path,
                movie_desc: movie.overview
            })
        });

        const result = await response.json();
        console.log('Favorite added:', result);
    } catch (error) {
        console.error('Error adding favorite:', error);
    }
};
function login(){
    fetch('https://movies-app-api.vercel.app/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'test@example.com', password: 'securepassword' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store the token (e.g., in local storage)
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('email', data.email);
        }
    });
}



const removeFromFavorites = async (movie) => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://movies-app-api.vercel.app/api/favorites', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                movie_id: movie.id
            })
        });

        const result = await response.json();
        console.log('Favorite removed:', result);
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
};


export {addToFavorites, removeFromFavorites}
