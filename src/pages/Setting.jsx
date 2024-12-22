import React from 'react'
import Header from '../components/layout/Header';

const Setting = () => {
    return (
        <div className="menu_header">
            <Header>Cài đặt</Header>
            <div style={
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    marginRight: '30px'
                }
            }></div>

        </div>
    );
};

export default Setting
