import { FilterOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Popover } from 'antd';
import React, { useState } from 'react';

const FilterData = ({ setDataFilter }) => {
    const [minQuantity, setMinQuantity] = useState(""); 
    const [maxQuantity, setMaxQuantity] = useState(""); 
    const [minImportPrice, setMinImportPrice] = useState(""); 
    const [maxImportPrice, setMaxImportPrice] = useState("");
    const [minSalePrice, setMinSalePrice] = useState(""); 
    const [maxSalePrice, setMaxSalePrice] = useState("");
    const [status, setStatus] = useState([]);


    const handleMinQuantityChange = (e) => setMinQuantity(e.target.value); 
    const handleMaxQuantityChange = (e) => setMaxQuantity(e.target.value); 
    const handleMinImportPriceChange = (e) => setMinImportPrice(e.target.value); 
    const handleMaxImportPriceChange = (e) => setMaxImportPrice(e.target.value); 
    const handleMinSalePriceChange = (e) => setMinSalePrice(e.target.value); 
    const handleMaxSalePriceChange = (e) => setMaxSalePrice(e.target.value); 

    const onFilter = () => {
        const filterCriteria = {
            minQuantity: minQuantity ? parseInt(minQuantity) : "",
            maxQuantity: maxQuantity ? parseInt(maxQuantity) : "",
            minImportPrice: minImportPrice ? parseFloat(minImportPrice) : "",
            maxImportPrice: maxImportPrice ? parseFloat(maxImportPrice) : "",
            minSalePrice: minSalePrice ? parseFloat(minSalePrice) : "",
            maxSalePrice: maxSalePrice ? parseFloat(maxSalePrice) : "",
            status: status.length > 0 ? status : undefined, 
        };
        console.log("filterCriteria", filterCriteria);
        setDataFilter(filterCriteria);
    };

    const handleReset = () => {
        setMinQuantity("");
        setMaxQuantity("");
        setMinImportPrice("");
        setMaxImportPrice("");
        setMinSalePrice("");
        setMaxSalePrice("");
        setStatus([]); 
    };

    const filterContent = (
        <div style={{ width: "300px", padding: "16px 0px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Lọc</h3>
                <button
                    style={{
                        border: "none",
                        background: "none",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }} onClick={handleReset}>Trở lại</button>
            </div>
            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Trạng thái:</p>
                <Checkbox.Group
                    options={['Hết hàng', 'Còn hàng', 'Còn ít']}
                    value={status}
                    onChange={setStatus}
                />
            </div>
            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Số lượng:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input placeholder="Từ" type="number" value={minQuantity} onChange={handleMinQuantityChange} style={{ flex: 1 }} />
                    <Input placeholder="Đến" type="number" value={maxQuantity} onChange={handleMaxQuantityChange} style={{ flex: 1 }} />
                </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Giá nhập:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input placeholder="Từ" type="number" value={minImportPrice} onChange={handleMinImportPriceChange} style={{ flex: 1 }} />
                    <Input placeholder="Đến" type="number" value={maxImportPrice} onChange={handleMaxImportPriceChange} style={{ flex: 1 }} />
                </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Giá bán:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input placeholder="Từ" type="number" value={minSalePrice} onChange={handleMinSalePriceChange} style={{ flex: 1 }} />
                    <Input placeholder="Đến" type="number" value={maxSalePrice} onChange={handleMaxSalePriceChange} style={{ flex: 1 }} />
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

export default FilterData;
