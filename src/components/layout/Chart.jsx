import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { getOrderAPI } from "../../services/apiService";

const Chart = () => {
    const [data, setData] = useState([]);
    const [filterDays, setFilterDays] = useState(15); // Mặc định hiển thị 15 ngày gần nhất

    const processData = (orderData, days) => {
        if (!Array.isArray(orderData)) {
            console.error("Dữ liệu từ API không phải là mảng:", orderData);
            return [];
        }

        const sortedData = orderData
            .map((order) => ({
                ...order,
                orderDate: new Date(order.createdAt),
            }))
            .sort((a, b) => b.orderDate - a.orderDate);

        const latestDaysData = sortedData.slice(0, days); // Lọc dữ liệu theo số ngày được chọn

        const groupedData = {};
        latestDaysData.forEach((order) => {
            const orderDate = order.orderDate.toLocaleDateString();
            const orderSales = order.total_amount;

            if (!groupedData[orderDate]) {
                groupedData[orderDate] = orderSales;
            } else {
                groupedData[orderDate] += orderSales;
            }
        });

        const processed = Object.entries(groupedData).map(([date, totalSales]) => ({
            createAt: date,
            total_amount: totalSales,
        }));

        return processed;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getOrderAPI();
                const orderData = response?.data;
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
