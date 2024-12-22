import React from 'react'
const BoxOverview = ({icon, text,number,text1,number1,text2,number2}) => {
    return (
        <div className='box_content'>
            <div className="content_top">
                <div className="icon">{icon}</div>
            </div>
           <div className="bottom">
           <div className="content_bottom">
                <p>{text}</p>
                <h2>{number}</h2>
            </div>
            <div className="content_bottom">
                <p>{text1}</p>
                <h2>{number1}</h2>
            </div>
            <div className="content_bottom">
                <p>{text2}</p>
                <h2>{number2}</h2>
            </div>
           </div>
        </div>
      )
}

export default BoxOverview