import { DeleteFilled } from '@ant-design/icons';
import { Button, Popconfirm, notification } from 'antd';
import React from 'react';
import { 
    deleteProductsAPI, 
    deleteInventoriesAPI, 
    getPurchaseOrderDetail, 
    deletePurchaseOrderDetailsAPI, 
    getPurchaseOrder, 
    deletePurchaseOrdersAPI, 
    getInventory
} from '../../services/apiService';

const ProductDelete = ({ selectedRowKeys, fetchData }) => {
    const handleDeleteCategory = async () => {
        if (!selectedRowKeys.length) {
            notification.warning({
                message: 'Xóa sản phẩm',
                description: 'Vui lòng chọn ít nhất một sản phẩm!',
            });
            return;
        }

        try {
            // Xóa sản phẩm
            const deleteProductRes = await deleteProductsAPI(selectedRowKeys);
            console.log("Kết quả xóa sản phẩm:", deleteProductRes);

            // Lấy thông tin tồn kho
            const inventoryData = await getInventory({ product_id: selectedRowKeys });
            if (inventoryData?.data?.length) {
                const inventoryIds = inventoryData.data.map((item) => item.inventory_id);
                await deleteInventoriesAPI(inventoryIds);
                console.log("Đã xóa tồn kho:", inventoryIds);
            }

            // Lấy thông tin chi tiết đơn hàng
            const detailData = await getPurchaseOrderDetail({ product_id: selectedRowKeys });
            if (detailData?.data?.length) {
                const detailIds = detailData.data.map((item) => item.purchaseOrderDetail_id);
                await deletePurchaseOrderDetailsAPI(detailIds);
                console.log("Đã xóa chi tiết đơn hàng:", detailIds);

                // Lấy thông tin đơn hàng liên quan
                const purchaseOrderIds = [...new Set(detailData.data.map((item) => item.purchaseOrder_id))];
                if (purchaseOrderIds.length) {
                    await deletePurchaseOrdersAPI(purchaseOrderIds);
                    console.log("Đã xóa đơn hàng:", purchaseOrderIds);
                }
            }

            notification.success({
                message: 'Xóa sản phẩm',
                description: 'Xóa thành công sản phẩm và tất cả dữ liệu liên quan!',
            });

            await fetchData(); // Làm mới dữ liệu
        } catch (error) {
            console.error('Error during delete:', error);
            notification.error({
                message: 'Lỗi khi xóa',
                description: 'Đã xảy ra lỗi khi xóa dữ liệu liên quan. Vui lòng thử lại.',
            });
        }
    };

    return (
        <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa các sản phẩm và tất cả dữ liệu liên quan đã chọn?"
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

export default ProductDelete;
