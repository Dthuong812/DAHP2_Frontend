import React, { useState } from "react";
import {
    Button,
    DatePicker,
    Space,
    Popover,
    Input,
    Checkbox,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;

const FilterData = ({ setDataFilter }) => {
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [method, setMethod] = useState([]);
    const [status, setStatus] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const onDateRangeChange = (dates) => {
        setSelectedDateRange(dates);
    };

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value);
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value);
    };

    const onFilter = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/order/api');
            const data = response.data.data;

            // Tạo filterCriteria từ giá trị người dùng
            const filterCriteria = {
                startDate: selectedDateRange[0]?.toISOString() || null,
                endDate: selectedDateRange[1]?.toISOString() || null,
                method,
                status,
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            };

            // Lọc dữ liệu
            let filtered = data;

            // Lọc theo ngày
            if (filterCriteria.startDate && filterCriteria.endDate) {
                filtered = filtered.filter((order) => {
                    const orderDate = new Date(order.createdAt);
                    return (
                        orderDate >= new Date(filterCriteria.startDate) &&
                        orderDate <= new Date(filterCriteria.endDate)
                    );
                });
            }

            // Lọc theo phương thức thanh toán
            if (filterCriteria.method.length > 0) {
                filtered = filtered.filter((order) =>
                    filterCriteria.method.includes(order.paymentMethod)
                );
            }


            if (filterCriteria.status.length > 0) {
                filtered = filtered.filter((order) =>
                    filterCriteria.status.includes(order.status)
                );
            }


            if (filterCriteria.minPrice !== null && filterCriteria.maxPrice !== null) {
                filtered = filtered.filter((order) =>
                    order.total_amount >= filterCriteria.minPrice &&
                    order.total_amount <= filterCriteria.maxPrice
                );
            }

   

            setDataFilter(filtered);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };
    const handleReset = () => {
        setSelectedDateRange([]);
        setMethod([]);
        setStatus([]);
        setMinPrice("");
        setMaxPrice("");
    };
    const filterContent = (
        <div style={{ width: "300px", padding: "16px 0px" }}>
           <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom: "16px"}} >
           <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                Lọc
            </h3>
            <button style={{border:"none",background:"none",fontWeight: "bold",cursor:"pointer"}} onClick={handleReset}>Trở lại</button>
           </div>
            <div style={{ marginBottom: "16px" }}>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <RangePicker
                        style={{ width: "100%" }}
                        onChange={onDateRangeChange}
                    />
                </Space>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Phương thức:</p>
                <Checkbox.Group
                    options={['Online', 'Offline']}
                    value={method}
                    onChange={setMethod}
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Trạng thái:</p>
                <Checkbox.Group
                    options={['Đã hoàn thành', 'Đã hủy', 'Đang xử lý']}
                    value={status}
                    onChange={setStatus}
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>Tiền:</p>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Input
                        placeholder="Từ"
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        style={{ flex: 1 }}
                    />
                    <Input
                        placeholder="Đến"
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            <Button
                type="primary"
                style={{
                    width: "100%",
                    backgroundColor: "#5671ee",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                }}
                onClick={onFilter}
            >
                Lọc
            </Button>
        </div>
    );

    return (
        <Popover content={filterContent} trigger="click" placement="bottomLeft">
            <Button icon={<FilterOutlined />}>Lọc</Button>
        </Popover>
    );
};

export default FilterData;
