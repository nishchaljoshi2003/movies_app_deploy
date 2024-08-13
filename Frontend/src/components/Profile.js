import React, { useEffect, useState } from 'react';
import './Profile.css';
import Navbar from './navbar';
import Cards from './cards'; // Assuming Cards component is exported as default
import { removeFromFavorites } from './apis/addfavmovie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const email=localStorage.getItem('email');
    const id=localStorage.getItem('userId');
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allMovies, setAllMovies] = useState([]); // New state to store all movies from TMDB

    useEffect(() => {
        fetchFavorites();
        fetchData(); // Fetch all movies from TMDB on component mount
    }, []);

    async function fetchFavorites() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const response = await fetch('https://movies-app-api.vercel.app/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }

            const data = await response.json();
            setFavorites(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setLoading(false);
            // Handle error state or display error message
        }
    }

    async function fetchData() {
        try {
            const Access_key = '3aee72be27e5780e795299b00f9c9ffb';
            const data = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${Access_key}&page=1`);
            const dataJ = await data.json();
            setAllMovies(dataJ.results);
        } catch (error) {
            console.error('Error fetching movies from TMDB:', error);
            // Handle error state or display error message
        }
    }

    const handleRemoveFavorite = async (movie) => {
        try {
            await removeFromFavorites(movie);
            setFavorites(prevFavorites => prevFavorites.filter(fav => fav.movie_id !== movie.id));
            toast.error(`${movie.original_title || movie.original_name} removed from favorites!`)
        } catch (error) {
            console.error('Error removing favorite:', error);
            // Handle error state or display error message
        }
    };

    // Filter allMovies to get only favorite movies
    const favoriteMovies = allMovies.filter(movie => favorites.some(fav => fav.movie_id === movie.id));
    console.log('favoriteMovies: ',favoriteMovies);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        toast.error(`Logged out successfully!`);
        setTimeout(()=>{
            navigate('/signin');
        },2000)
    };

    return (
        <div >
            <Navbar />
            <div className='profw'>
            <div className="profile-container">
                <h2>
                    User ID: <b> {id} </b>
                </h2>
                <h2>
                    Email: <b> {email} </b>
                </h2>
                {loading && <p>Loading...</p>}
                {!loading && favoriteMovies.length === 0 && <p>No favorites found.</p>}
                {!loading && favoriteMovies.length > 0 && (
                    <div className="favorite-cards">
                        {favoriteMovies.map((movie, index) => (
                            <div className='Card-wrapper' key={index}>
                                <div className='imgwrap'>
                                    <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} className='cardimage' alt='poster' />
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        className='fa-2xl addToFav favorite'
                                        onClick={() => handleRemoveFavorite(movie)}
                                    />
                                </div>
                                
                                <h3 className='cardtitle'>{movie.original_title ? movie.original_title : movie.original_name}</h3>
                                {/* <h5><FontAwesomeIcon icon={faStar} /></h5> */}
                                <h5>{(movie.overview).substring(0, 150)}...</h5>
                            </div>
                        ))}
                    </div>    
                )}
                <button className='btnbtn' onClick={handleLogout}>Log Out</button>
            </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;
