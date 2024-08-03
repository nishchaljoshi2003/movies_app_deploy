import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Cards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { addToFavorites, removeFromFavorites } from './apis/addfavmovie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cards() {
    const [favorites, setFavorites] = useState([]);
    const Access_key = '3aee72be27e5780e795299b00f9c9ffb';

    const [datao, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loader = useRef(null);

    const fetchData = async (pageNum) => {
        try {
            setLoading(true);
            const data = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${Access_key}&page=${pageNum}`);
            const dataJ = await data.json();
            setData(prevData => [...prevData, ...dataJ.results]);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage(prev => prev + 1);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [handleObserver]);

    useEffect(() => {
        fetchData(page);
        fetchFavorites();
    }, [page]);

    async function fetchFavorites() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const result = await response.json();
            setFavorites(result.map(fav => fav.movie_id));
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }

    const isFavorite = (movieId) => favorites.includes(movieId);

    const toggleFavorite = async (movie) => {
        try {
            if (!isFavorite(movie.id)) {
                await addToFavorites(movie);
                setFavorites(prevFavorites => [...prevFavorites, movie.id]);
                toast.success(`${movie.original_title || movie.original_name} added to favorites!`);
            } else {
                await removeFromFavorites(movie);
                setFavorites(prevFavorites => prevFavorites.filter(id => id !== movie.id));
                toast.error(`${movie.original_title || movie.original_name} removed from favorites!`);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Error toggling favorite. Please try again.');
        }
    };

    return (
        <div className='loader'>
            <div className='Cards'>
                {datao?.map((c, index) => (
                    <div className='Card-wrapper' key={index}>
                        <div className='imgwrap'>
                            <img src={`https://image.tmdb.org/t/p/w300/${c.poster_path}`} className='cardimage' alt='poster' />
                            <FontAwesomeIcon
                                icon={faStar}
                                className={`fa-2xl addToFav ${isFavorite(c.id) ? 'favorite' : ''}`}
                                onClick={() => toggleFavorite(c)}
                            />
                        </div>
                        
                        <h3 className='cardtitle'>{c.original_title ? c.original_title : c.original_name}</h3>
                        <h5>{c.vote_average}<FontAwesomeIcon icon={faStar} /></h5>
                        <h5>{(c.overview).substring(0, 150)}...</h5>
                    </div>
                ))}
                <div ref={loader} />
                {loading && <p>Loading...</p>}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Cards;
