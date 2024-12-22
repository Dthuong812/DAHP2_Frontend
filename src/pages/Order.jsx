import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import BoxOverview from '../components/layout/BoxOverview';
import OrderNew from '../components/Order/OrderNew';
import OrderData from '../components/Order/OrderData';
import { getCustomersAPI, getOrderAPI } from '../services/apiService';
import DeletesOrder from '../components/Order/DeletesOrder';

const Order = () => {
  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [onlineOrders, setOnlineOrders] = useState(0);
  const [offlineOrders, setOfflineOrders] = useState(0);
  const [highestOrder, setHighestOrder] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersResponse, customersResponse] = await Promise.all([
        getOrderAPI(),
        getCustomersAPI(),
      ]);

      const orders = ordersResponse.data;
      const customers = customersResponse.data;

      const combinedData = orders.map((order) => {
        const customer =
          customers.find((c) => c.customer_id === order.customer_id) || {};
        return {
          key: order.order_id,
          customerName: customer.name,
          customerPhone: customer.phone,
          total_amount: order.total_amount,
          created_at: order.createdAt,
          status: order.status,
          paymentMethod: order.paymentMethod,
        };
      });

      let totalOnline = 0;
      let totalOffline = 0;
      let highestAmount = 0;
      let highestOrderData = null;

      combinedData.forEach((order) => {
        if (order.paymentMethod === "Online") {
          totalOnline += 1;
        } else if (order.paymentMethod === "Offline") {
          totalOffline += 1;
        }

        if (order.total_amount > highestAmount) {
          highestAmount = order.total_amount;
          highestOrderData = order;
        }
      });

      setDataOrder(combinedData);
      setTotalOrders(combinedData.length);
      setOnlineOrders(totalOnline);
      setOfflineOrders(totalOffline);
      setHighestOrder(highestOrderData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="menu_header">
      <Header>Đơn hàng</Header>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          marginRight: '30px',
        }}
      >
        <OrderNew fetchData={fetchData} />
        <DeletesOrder
          selectedRowKeys={selectedRowKeys}
          fetchData={fetchData}
        />
      </div>
      <div className="boxOverview">
       <div className="over">
       <BoxOverview
          icon={<i className="fas fa-chart-line"></i>}
          text="Tất cả"
          number={totalOrders}
          text1="Online"
          number1={onlineOrders}
          text2="Offline"
          number2={offlineOrders}
        />
       </div>
        <div className="customer">
        {highestOrder && (
          <BoxOverview
            icon={<i className="fa-solid fa-arrow-up-1-9"></i>}
            text="Mã đơn hàng"
            number={highestOrder.key}
            text1="Tổng tiền"
            number1={`${highestOrder.total_amount}`}
          />
        )}
        </div>
      </div>
      <OrderData
        dataOrder={dataOrder}
        rowSelection={rowSelection}
        loading={loading}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Order;
