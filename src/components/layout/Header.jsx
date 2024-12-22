
import React, {useContext} from 'react';
import {UserContext} from '../../context/UserContext';
import "./header.css"
const Header = ({children}) => {
    const {user} = useContext(UserContext);

    return (
        <div className='header-top'>
            <div className="title">
               <h2>{children}</h2>
            </div>
            <div className='user_header'>
                <p>{
                    user.email ||" admin@gmail.com"
                }</p>
                <i class="fa-solid fa-user"></i>
            </div>

        </div>
    );
};

export default Header;
