import React from 'react'
import Header from '../components/layout/Header'
import ExportFile from '../components/Revenue/ExportFile'
import DataRevenue from '../components/Revenue/DataRevenue'

const Revenue = () => {
  return (
    <div className='menu_header'>
    <Header>Doanh thu</Header>
    <ExportFile></ExportFile>
    <DataRevenue></DataRevenue>
</div>
  )
}

export default Revenue