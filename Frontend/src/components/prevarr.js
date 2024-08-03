import React from 'react'
import './prevarr.css'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Prevarr(props) {
    const { className, style, onClick } = props;
  return (
    <div className='prev' onClick={onClick}>
        <FontAwesomeIcon icon={faArrowLeft} className='prevarr fa-2xl'/>
    </div>
  )
}

export default Prevarr