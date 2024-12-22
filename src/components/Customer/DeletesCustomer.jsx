import { DeleteFilled } from '@ant-design/icons';
import { Button, Popconfirm, notification } from 'antd';
import React from 'react';
import {
  deleteArrayOrderAPI,
  deleteCustomersAPI,
  deleteOrderDetailsAPI,
  getOrderAPI,
  getOrderDetailsByOrderIdAPI,
  getOrdersAPI,
} from '../../services/apiService';

const DeletesCustomer = ({ selectedRowKeys, fetchData }) => {
    const handleDeleteCustomer = async () => {
      if (!selectedRowKeys.length) {
        notification.warning({
          message: 'Xóa đơn hàng',
          description: 'Vui lòng chọn ít nhất một đơn hàng!',
        });
        return;
      }
      try {
        for (const customerId of selectedRowKeys) {
            console.log("customerId",customerId)
          const resOrders = await getOrderAPI({customer_id:customerId});
          console.log("resOrders",resOrders)
          for (const order of resOrders.data) {
            console.log("order",order)
            const resDetails = await getOrderDetailsByOrderIdAPI(order.order_id);
  
            const deleteDetailsPromises = resDetails.data.map((item) =>
              deleteOrderDetailsAPI(item.orderItem_id)
            );
            await Promise.allSettled(deleteDetailsPromises);
            await deleteArrayOrderAPI(order.order_id);
          }
          await deleteCustomersAPI(customerId);
        }
  
        notification.success({
          message: 'Xóa khách hàng',
          description: 'Xóa thành công khách hàng và tất cả dữ liệu liên quan!',
        });
  
        await fetchData();
      } catch (error) {
        notification.error({
          message: 'Lỗi xóa đơn hàng',
          description: error?.message || 'Có lỗi xảy ra trong quá trình xóa!',
        });
      }
    };
  
    return (
      <Popconfirm
        title="Xóa đơn hàng"
        description="Bạn có chắc chắn muốn xóa các đơn hàng đã chọn?"
        onConfirm={handleDeleteCustomer} 
        okText="Yes"
        cancelText="No"
        placement="left"
      >
        <Button
          icon={<DeleteFilled />}
          style={{
            background: '#CC5F5F',
            color: '#ffffff',
          }}
        >
          Xóa tất cả
        </Button>
      </Popconfirm>
    );
  };

export default DeletesCustomer