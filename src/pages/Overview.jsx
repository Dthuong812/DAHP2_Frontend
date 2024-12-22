import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import BoxContent from '../components/layout/BoxContent';
import Chart from '../components/layout/Chart';
import { getAllProductsAPI, getCustomersAPI, getOrderAPI } from '../services/apiService';


const Overview = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const customersResponse = await getCustomersAPI();
        setTotalCustomers(customersResponse.data.length);


        const productsResponse = await getAllProductsAPI();
        setTotalProducts(productsResponse.data.length);

        const ordersResponse = await getOrderAPI();
        const orders = ordersResponse.data;
        let revenue = 0;

        orders.forEach(order => {
          if (order.status === 'Đã hoàn thành') {
            revenue += order.total_amount; 
          }
        });
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="menu_header">
      <Header>Tổng quan</Header>
      <div className="boxContent">
        <div className="comboBox">
          <div className="revenue-box">
          <BoxContent
            icon={<i className="fas fa-chart-line"></i>}
            text="Tổng doanh thu"
            number={`${totalRevenue.toLocaleString()} VND`}
          />
          </div>
          <BoxContent
           icon={<i class="fa-solid fa-cart-shopping"></i>}
            text="Tổng số sản phẩm"
            number={totalProducts}
          />
           <BoxContent
            icon={<i class="fa-solid fa-users"></i>}
            text="Tổng khách hàng"
            number={totalCustomers}
          />
        </div>
        
      </div>
      
      <div className="grant">
      <Chart />
      </div>
    </div>
  );
};

export default Overview;
