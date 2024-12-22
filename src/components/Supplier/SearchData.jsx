import { Input, notification } from 'antd';
import React from 'react';
import { getPurchaseOrder, getPurchaseOrderDetail, getSearchSupplier } from '../../services/apiService';

const SearchData = (props) => {
    const { setSearchResults, fetchData } = props;

    const handleInputChange = async (e) => {
        const value = e.target.value.trim();
        if (!value) {
            fetchData(); // Nếu không có từ khóa, lấy toàn bộ dữ liệu
            return;
        }

        try {
            // Tìm kiếm nhà cung cấp
            const [supplierResponse] = await Promise.allSettled([
                getSearchSupplier({ 
                    limit: 10, 
                    page: 1, 
                    name: value 
                }),
            ]);

            if (supplierResponse.status === 'fulfilled' && supplierResponse.value?.data) {
                const suppliers = supplierResponse.value.data;

                // Duyệt từng nhà cung cấp để lấy thông tin `purchaseOrder` và `purchaseDetailOrder`
                const results = await Promise.all(
                    suppliers.map(async (supplier) => {
                        // Lấy danh sách đơn hàng của nhà cung cấp
                        const purchaseOrdersResponse = await getPurchaseOrder({ supplier_id: supplier.supplier_id });
                        const purchaseOrders = purchaseOrdersResponse.data;

                        // Tính tổng số lượng và tổng tiền từ các đơn hàng
                        let totalQuantity = 0;
                        let totalPrice = 0;

                        for (const order of purchaseOrders) {
                            const purchaseDetailsResponse = await getPurchaseOrderDetail({ purchaseOrder_id: order.id });
                            const purchaseDetails = purchaseDetailsResponse.data;

                       
                            totalQuantity += purchaseDetails.reduce((sum, detail) => sum + detail.quantity, 0);
                            totalPrice += purchaseDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
                        }

                        return {
                            key: supplier.supplier_id,
                            supplierName: supplier.name,
                            phone: supplier.phone,
                            location:supplier.location,
                            quality:totalQuantity,
                            totalPrice,
                        };
                    })
                );

                setSearchResults(results);
            } else {
                setSearchResults([]); 
            }
        } catch (error) {
            console.error("Error during search:", error);
            notification.error({
                message: "Lỗi khi tìm kiếm",
                description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại.",
            });
        }
    };

    return (
        <Input
            placeholder="Tìm kiếm nhà cung cấp"
            onChange={handleInputChange}
        />
    );
};

export default SearchData;
