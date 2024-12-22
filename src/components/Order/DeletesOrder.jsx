import { DeleteFilled } from '@ant-design/icons';
import { Button, Popconfirm, notification } from 'antd';
import React from 'react';
import {
  deleteArrayOrderAPI,
  deleteOrderDetailsAPI,
  getOrderDetailsByOrderIdAPI,
} from '../../services/apiService';

const DeletesOrder = ({ selectedRowKeys, fetchData }) => {
  const handleDeleteOrder = async () => {
    if (!selectedRowKeys.length) {
      notification.warning({
        message: 'Xóa đơn hàng',
        description: 'Vui lòng chọn ít nhất một đơn hàng!',
      });
      return;
    }

    try {
      for (const orderId of selectedRowKeys) {
       
        const resDetails = await getOrderDetailsByOrderIdAPI(orderId);

       
        const deleteDetailsPromises = resDetails.data.map((item) =>
          deleteOrderDetailsAPI(item.orderItem_id)
        );
        await Promise.allSettled(deleteDetailsPromises);

      
        await deleteArrayOrderAPI(orderId);
      }

      notification.success({
        message: 'Xóa đơn hàng',
        description: 'Xóa thành công các đơn hàng đã chọn!',
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
      onConfirm={handleDeleteOrder} 
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

export default DeletesOrder;
