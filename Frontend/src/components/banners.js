import React, {useRef} from 'react';
import './Banners.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Prevarr from './prevarr';
import Nextarr from './nextarr';
import { useState } from 'react';
import { useEffect } from 'react';



const Banners = () => {
  let sliderRef = useRef(null);
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        autoplay:true,
        autoplaySpeed:7000,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        pauseOnHover: true,
        prevArrow: <Prevarr />,
        nextArrow: <Nextarr />,
    };
    const Access_key='3aee72be27e5780e795299b00f9c9ffb'

    const [data, setdata]=useState([]);
    async function fetchData(){
        try{
            const data=await fetch(`https://api.themoviedb.org/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=200&api_key=${Access_key}`)
            const dataJ= await data.json();
            setdata(dataJ.results);
            // console.log(dataJ);
        } catch(e){

        }
        
    };
    useEffect(()=>{
        fetchData();
    },[]);
    const data2=data.slice(0,5);
  return (
    <div className="banners-container">
      <div className="banners">
        <Slider {...settings} className='sliders'>
            {data2?.map((d)=>{
                return(
                    <div className='banner'>
                        <div className='bannerimg'>
                            <img src={`https://image.tmdb.org/t/p/w300/${d.poster_path}`} alt='' className='image'/>
                        </div>
                        <div className='bannertitle'>
                          <h1>{d.original_title ? d.original_title : d.original_name}</h1>
                          <h3>{d.overview}</h3>
                        </div>
                    </div>
                )
            })}
        </Slider>
      </div>
    </div>
  );
};

export default Banners;