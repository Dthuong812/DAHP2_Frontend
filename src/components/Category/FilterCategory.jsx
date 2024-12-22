import { FilterOutlined } from '@ant-design/icons'
import { Button, Input, Popover } from 'antd'
import React, { useState } from 'react'

const FilterCategory = ({ setDataFilter }) => {
    const [minQuality, setMinQuality] = useState("");
    const [maxQuality, setMaxQuality] = useState("");
    const handleMinQualityChange = (e) => setMinQuality(e.target.value);
    const handleMaxQualityChange = (e) => setMaxQuality(e.target.value);
    const onFilter = () => {
        const filterCriteria = {
            minQuality: minQuality ? parseFloat(minQuality) : "",
            maxQuality: maxQuality ? parseFloat(maxQuality) : "",
        };
        console.log("filterCriteria",filterCriteria)
        setDataFilter(filterCriteria);  
      
    };

    const handleReset = () => {
        setMinQuality("");
        setMaxQuality("");
    };

    const filterContent = (
        <div style={{ width: "300px", padding: "16px 0px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Lọc</h3>
                <button style={{
                    border: "none",
                    background: "none",
                    fontWeight: "bold",
                    cursor: "pointer"
                }} onClick={handleReset}>Trở lại</button>
            </div>
            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Danh mục:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input placeholder="Từ" type="number" value={minQuality} onChange={handleMinQualityChange} style={{ flex: 1 }} />
                    <Input placeholder="Đến" type="number" value={maxQuality} onChange={handleMaxQualityChange} style={{ flex: 1 }} />
                </div>
            </div>
            <Button type="primary" style={{
                width: "100%",
                backgroundColor: "#5671ee",
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center"
            }} onClick={onFilter}>Lọc</Button>
        </div>
    );
  return (
    <Popover content={filterContent} trigger="click" placement="bottomLeft">
    <Button icon={<FilterOutlined />}>Lọc</Button>
</Popover>
  )
}

export default FilterCategory