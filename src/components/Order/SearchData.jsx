import { Input, notification } from 'antd';
import React from 'react';
import { getOrdersAPI, getCustomersAPI, getCustomerAPI, getOrderAPI } from '../../services/apiService';

const SearchData = (props) => {
    const { setSearchResults, fetchData } = props;

    const handleInputChange = async (e) => {
        const value = e.target.value.trim();
        if (!value) {
            fetchData();
            return;
        }

        try {
            const [orderData, customerData] = await Promise.allSettled([
                getOrdersAPI({ limit: 10, page: 1, name: value }),
                getCustomerAPI({ limit: 10, page: 1, name: value }),
            ]);
            const orders = orderData.status === "fulfilled" && orderData.value?.data?.length
                ? await Promise.all(
                      orderData.value.data.map(async (order) => {
                          try {
                              const customerData = await getCustomersAPI({
                                  customer_id: order.customer_id,
                              });
                              return {
                                  ...order,
                                  customerName: customerData.data[0]?.name || "Unknown",
                                  customerPhone: customerData.data[0]?.phone || "Unknown",
                                  key: order.order_id,
                                  created_at: order.createdAt,
                              };
                          } catch (err) {
                              console.error("Error fetching customer for order:", err);
                              return {
                                  ...order,
                                  customerName: "Unknown",
                                  customerPhone: "Unknown",
                              };
                          }
                      })
                  )
                : [];
                const customers = await Promise.all(
                    customerData.value.data.map(async (customer) => {
                        const orderData = await getOrderAPI({ customer_id: customer.customer_id });
                        const enrichedOrders = await Promise.all(
                            orderData.data.map(async (order) => {
                                try {
                                    const element = await getCustomersAPI({
                                        customer_id: order.customer_id,
                                    });
                                    return {
                                        ...order,
                                        customerName: element.data[0]?.name || "Unknown",
                                        customerPhone: element.data[0]?.phone || "Unknown",
                                        key: order.order_id,
                                        created_at: order.createdAt,
                                    };
                                } catch (err) {
                                    console.error("Error fetching customer data:", err);
                                    return {
                                        ...order,
                                        customerName: "Unknown",
                                        customerPhone: "Unknown",
                                        key: order.order_id,
                                    };
                                }
                            })
                        );
                        return enrichedOrders;
                    })
                );
                
                const allOrders = customers.flat(); 

                // console.log("allOrders",allOrders);
                const combinedResults = [...orders, ...allOrders];
                const uniqueData = Array.from(
                    new Map(combinedResults.map(item => [`${item.customer_id}-${item.order_id}`, item])).values()
                );
                
                console.log( uniqueData)
                setSearchResults(uniqueData)
              
            } catch (error) {
                console.error('Error during search:', error);
                notification.error({
                    message: "Lỗi khi tìm kiếm",
                    description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại.",
                });
            }
        };
    
        return (
            <Input
                placeholder="Tìm kiếm"
                onChange={handleInputChange}
            />
        );
    };
    
    export default SearchData;