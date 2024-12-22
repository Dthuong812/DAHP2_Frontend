import { Input, notification } from "antd";
import React from "react";
import { getCustomerAPI, getOrderAPI } from "../../services/apiService";

const SearchData = (props) => {
    const { setSearchResults, fetchData } = props;

    const handleInputChange = async (e) => {
        const value = e.target.value.trim();
        if (!value) {
            fetchData(); 
            return;
        }

        try {
            const [customerData] = await Promise.allSettled([
                getCustomerAPI({ 
                    limit: 10, 
                    page: 1, 
                    name: value, 
                }),
            ]);

            if (customerData.status === "fulfilled" && customerData.value?.data) {
                console.log("customerData", customerData.value.data);

                const results = await Promise.all(
                    customerData.value.data.map(async (customer) => {

                        const orderData = await getOrderAPI({ customer_id: customer.customer_id });

                        const totalOrders = orderData.data.length;
                        const totalAmount = orderData.data.reduce((acc, order) => acc + (order.total_amount || 0), 0);

                        return {
                            key: customer.customer_id, 
                            customerName: customer.name, 
                            customerPhone: customer.phone, 
                            customerAddress: customer.address, 
                            totalOrders: totalOrders, 
                            totalAmount: totalAmount,
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
            placeholder="Tìm kiếm theo tên, số điện thoại hoặc địa chỉ"
            onChange={handleInputChange}
        />
    );
};

export default SearchData;
