import { useState } from 'react'
import SideBar from './components/layout/SideBar'
import { Outlet } from 'react-router-dom'
import "../src/styles/main.css"


function App() {
  return (
    <>
      <SideBar/>
    <div className="right">
    <Outlet></Outlet>
    </div>
    </>
  )
}

export default App
