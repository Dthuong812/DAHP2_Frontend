import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

const ExportFile = () => {
  return (
    <div className="user-form" style={{ margin: "20px 0px" }}>
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 30px 10px 30px",
        }}
    >
        <h3>Doanh thu</h3>
        <Button
            style={{
                background: "#5570F1",
                color: "#ffffff",
            }}
            onClick={() => setModalOpen(true)}
        >
            <DownloadOutlined />
            Xuất file
        </Button>
    </div>
</div>
  )
}

export default ExportFile