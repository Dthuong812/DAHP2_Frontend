import React, {useEffect, useState} from 'react'
import Header from '../components/layout/Header'
import BoxOverview from '../components/layout/BoxOverview'
import Datacustomer from '../components/Customer/Datacustomer'
import {getCustomersAPI, getOrderAPI} from '../services/apiService'
import DeletesCustomer from '../components/Customer/DeletesCustomer'

const Customer = () => {
    const [dataCustomer, setDataCustomer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersResponse, customersResponse] = await Promise.all([getOrderAPI(), getCustomersAPI(),]);

            const orders = ordersResponse.data;
            const customers = customersResponse.data;
            console.log("orders", orders)
            console.log("customers", customers)

            const customerTotals = orders.reduce((acc, order) => {
                const customerId = order.customer_id;
                if (!acc[customerId]) {
                    acc[customerId] = {
                        totalOrders: 0,
                        totalAmount: 0
                    };
                }
                acc[customerId].totalOrders += 1;
                acc[customerId].totalAmount += order.total_amount;
                return acc;
            }, {});

            const combinedData = customers.map((customer) => {
                const totals = customerTotals[customer.customer_id] || {
                    totalOrders: 0,
                    totalAmount: 0
                };
                return {
                    key: customer.customer_id,
                    customerName: customer.name,
                    customerPhone: customer.phone,
                    customerAddress: customer.address,
                    totalOrders: totals.totalOrders,
                    totalAmount: totals.totalAmount
                };
            });

            setDataCustomer(combinedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const applyFilter = (filterCriteria) => {
        const {minOrder, maxOrder, minPrice, maxPrice} = filterCriteria;

        let filtered = [...dataCustomer];

        if (!minOrder && !maxOrder && !minPrice && !maxPrice) {
            fetchData()
        } else {
            if (minOrder) {
                filtered = filtered.filter((customer) => customer.totalOrders >= parseFloat(minOrder));
            }

            if (maxOrder) {
                filtered = filtered.filter((customer) => customer.totalOrders <= parseFloat(maxOrder));
            }

            if (minPrice) {
                filtered = filtered.filter((customer) => customer.totalAmount >= parseFloat(minPrice));
            }

            if (maxPrice) {
                filtered = filtered.filter((customer) => customer.totalAmount <= parseFloat(maxPrice));
            }

        }
        setDataCustomer(filtered);
        console.log("filtered", filtered)
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    return (
        <div className='menu_header'>
            <Header>Khách hàng</Header>
            <div style={
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    margin: '20px 30px'
                }
            }>
                <DeletesCustomer selectedRowKeys={selectedRowKeys}
                    fetchData={fetchData}/>
            </div>
            <Datacustomer dataCustomer={dataCustomer}
                rowSelection={rowSelection}
                loading={loading}
                fetchData={fetchData}
                applyFilter={applyFilter}></Datacustomer>
        </div>
    )
}

export default Customer
