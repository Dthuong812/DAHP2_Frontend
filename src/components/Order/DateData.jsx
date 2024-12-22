import React, { useState } from "react";
import { Button, DatePicker, Space, Popover } from "antd";
import { ScheduleOutlined } from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;

const DateData = (props) => {
  const {setDateRange } = props;
  const [selectedDateRange, setSelectedDateRange] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 

  const onDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const onFilter = async () => {
    if (selectedDateRange && selectedDateRange.length === 2) {
      const [startDate, endDate] = selectedDateRange;
      const formattedStartDate = startDate.format("DD-MM-YYYY");
      const formattedEndDate = endDate.format("DD-MM-YYYY");

      try {
        // console.log("Fetching orders for range:", formattedStartDate, formattedEndDate);
        const response = await axios.get('http://localhost:8080/v1/order/api');
        
        const allOrders = response.data.data;  

       
        const filtered = allOrders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          const start = new Date(formattedStartDate);
          const end = new Date(formattedEndDate);

          return orderDate >= start && orderDate <= end;
        });

        console.log("Filtered Orders:", filtered); 
        setFilteredOrders(filtered);
        setDateRange(selectedDateRange);  
      } catch (error) {
        // console.error("Failed to fetch orders:", error);
      }
    } else {
    //   console.log("Please select a valid date range.");
    }
  };

  const filterContent = (
    <div style={{ width: "300px", padding: "16px 0px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Ngày đặt
      </h3>

      <div style={{ marginBottom: "16px" }}>
        <Space
          direction="vertical"
          size={12}
          style={{ marginTop: "8px", width: "100%" }}
        >
          <RangePicker
            style={{ width: "100%" }}
            onChange={onDateRangeChange}
          />
        </Space>
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
        Lọc Ngày
      </Button>
    </div>
  );

  return (
    <Popover content={filterContent} trigger="click" placement="bottomLeft">
      <Button icon={<ScheduleOutlined />}>
        Date
      </Button>
    </Popover>
  );
};

export default DateData;
