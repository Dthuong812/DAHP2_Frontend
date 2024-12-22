import { DeleteFilled } from '@ant-design/icons';
import { Button, Popconfirm, notification } from 'antd';
import React from 'react';
import { deleteCategoriesAPI } from '../../services/apiService';

const DeletesCategory = ({ selectedRowKeys, fetchData }) => {
  const handleDeleteCategory = async () => {
    if (!selectedRowKeys.length) {
      notification.warning({
        message: 'Xóa danh mục',
        description: 'Vui lòng chọn ít nhất một danh mục!',
      });
      return;
    }

    try {
        for (const categoryId of selectedRowKeys) {
            await deleteCategoriesAPI(categoryId);
            
        }

      notification.success({
        message: 'Xóa danh mục',
        description: 'Xóa thành công danh mục và tất cả dữ liệu liên quan!',
      });

      await fetchData(); 
    } catch (error) {
      console.error('Error during delete:', error);
      notification.error({
        message: 'Lỗi khi xóa',
        description: 'Đã xảy ra lỗi khi xóa danh mục. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Popconfirm
      title="Xóa danh mục"
      description="Bạn có chắc chắn muốn xóa các danh mục đã chọn?"
      onConfirm={handleDeleteCategory}
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

export default DeletesCategory;
