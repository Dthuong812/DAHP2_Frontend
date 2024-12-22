import React from 'react'
import "./BoxContent.css"
const BoxContent = ({ icon, text, number }) => {
  return (
    <div className='box_content'>
        <div className="content_top">
            <div className="icon">{icon}</div>
        </div>
        <div className="content_bottom">
            <p>{text}</p>
            <h2>{number}</h2>
        </div>
    </div>
  )
}

export default BoxContent