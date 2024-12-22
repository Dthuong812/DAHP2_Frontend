import { FilterOutlined } from '@ant-design/icons';
import { Button, Input, Popover } from 'antd';
import React, { useState } from 'react';

const FilterCustomer = ({ setDataFilter }) => {
  
    const [minOrder, setMinOrder] = useState("");
    const [maxOrder, setMaxOrder] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
    const handleMinOrderChange = (e) => setMinOrder(e.target.value);
    const handleMaxOrderChange = (e) => setMaxOrder(e.target.value);

    const onFilter = () => {
        const filterCriteria = {
            minOrder: minOrder ? parseFloat(minOrder) : "",
            maxOrder: maxOrder ? parseFloat(maxOrder) : "",
            minPrice: minPrice ? parseFloat(minPrice) : "",
            maxPrice: maxPrice ? parseFloat(maxPrice) : ""
        };
        console.log("filterCriteria",filterCriteria)
        setDataFilter(filterCriteria);  
      
    };

    const handleReset = () => {
        setMinOrder("");
        setMaxOrder("");
        setMinPrice("");
        setMaxPrice("");
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
                <p style={{ marginBottom: "8px" }}>Đơn hàng:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input placeholder="Từ" type="number" value={minOrder} onChange={handleMinOrderChange} style={{ flex: 1 }} />
                    <Input placeholder="Đến" type="number" value={maxOrder} onChange={handleMaxOrderChange} style={{ flex: 1 }} />
                </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Giá:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input placeholder="Từ" type="number" value={minPrice} onChange={handleMinPriceChange} style={{ flex: 1 }} />
                    <Input placeholder="Đến" type="number" value={maxPrice} onChange={handleMaxPriceChange} style={{ flex: 1 }} />
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
    );
};

export default FilterCustomer;
