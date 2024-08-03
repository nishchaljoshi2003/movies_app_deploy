import React from 'react'
import './nextarr.css'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function Nextarr(props) {
    const { className, style, onClick } = props;
  return (
    <div>
        <div className='next' onClick={onClick}>
            <FontAwesomeIcon icon={faArrowRight} className='nextarr fa-2xl'/>
        </div>
    </div>
  )
}

export default Nextarr