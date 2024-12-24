import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { getOrderAPI } from "../../services/apiService";

const Chart = () => {
    const [data, setData] = useState([]);
    const [filterDays, setFilterDays] = useState(15);

    const processData = (orderData, days) => {
        if (!Array.isArray(orderData)) {
            console.error("Dữ liệu từ API không phải là mảng:", orderData);
            return [];
        }

        const groupedData = {};
        orderData.forEach((order) => {
            if (!order.createdAt || isNaN(new Date(order.createdAt))) {
                console.warn("Ngày tạo không hợp lệ:", order.createdAt);
                return;
            }

            const orderDate = new Date(order.createdAt).toLocaleDateString(); 
            const orderSales = order.total_amount || 0; 

            if (!groupedData[orderDate]) {
                groupedData[orderDate] = orderSales;
            } else {
                groupedData[orderDate] += orderSales;
            }
        });
        const processed = Object.entries(groupedData)
            .map(([date, totalSales]) => ({
                createAt: date,
                total_amount: totalSales,
            }))
            .sort((a, b) => new Date(a.createAt) - new Date(b.createAt));

        return processed.slice(-days);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getOrderAPI();
                const orderData = response?.data || [];
                const chartData = processData(orderData, filterDays);
                setData(chartData);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchData();
    }, [filterDays]);

    const config = {
        data,
        xField: "createAt",
        yField: "total_amount",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        color: "#5570f1",
        xAxis: {
            label: {
                autoRotate: false, 
            },
        },
        meta: {
            createAt: { alias: "Ngày" },
            total_amount: { alias: "Doanh thu" },
        },
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "0 30px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h4>Tổng quan doanh thu</h4>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <select
                        value={filterDays}
                        onChange={(e) => setFilterDays(Number(e.target.value))}
                        style={{
                            padding: "5px",
                            fontSize: "16px",
                            borderRadius: "6px",
                        }}
                    >
                        <option value={7}>7 ngày</option>
                        <option value={15}>15 ngày</option>
                        <option value={30}>30 ngày</option>
                    </select>
                </div>
            </div>
            <Column {...config} />
        </div>
    );
};

export default Chart;
