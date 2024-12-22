import React, {useEffect, useState} from 'react'
import Header from '../components/layout/Header'
import BoxOverview from '../components/layout/BoxOverview'
import {
    getCustomersAPI,
    getOrderAPI,
    getPurchaseOrder,
    getPurchaseOrderDetail,
    getSupplier
} from '../services/apiService'
import DeletesCustomer from '../components/Customer/DeletesCustomer'
import DataSupplier from '../components/Supplier/DataSupplier'
import CreateSupplier from '../components/Supplier/CreateSupplier'
import DeletesSupplier from '../components/Supplier/DeletesSupplier'

const Supplier = () => {
    const [dataSupplier, setDataSupplier] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [purchaseOrdersResponse, purchaseOrderDetailsResponse, suppliersResponse] = await Promise.all([getPurchaseOrder(), getPurchaseOrderDetail(), getSupplier()]);
            const purchaseOrders = purchaseOrdersResponse.data;
            const purchaseOrderDetails = purchaseOrderDetailsResponse.data;
            const suppliers = suppliersResponse.data;
            console.log("suppliers", suppliers)
            console.log("purchaseOrderDetails", purchaseOrderDetails)
            console.log("purchaseOrders", purchaseOrders)
            const combinedData = suppliers.map((supplier) => {
                const relatedOrders = purchaseOrders.filter(order => order.supplier_id === supplier.supplier_id);
                const relatedDetails = purchaseOrderDetails.filter(detail => relatedOrders.some(order => order.purchaseOrder_id === detail.purchaseOrder_id));

                const quality = relatedDetails.reduce((sum, detail) => sum + detail.quantity, 0);
                const totalPrice = relatedDetails.reduce((sum, detail) => sum + detail.unit_cost * detail.quantity, 0);

                return {
                    key: supplier.supplier_id,
                    supplierName: supplier.name,
                    phone: supplier.phone,
                    location: supplier.location,
                    quality,
                    totalPrice
                };
            });
            setDataSupplier(combinedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (filterCriteria) => {
        const {minQuality, maxQuality, minPrice, maxPrice} = filterCriteria;

        let filtered = [...dataSupplier];

        if (!minQuality && !maxQuality && !minPrice && !maxPrice) {
            fetchData()
        } else {
            if (minPrice) {
                filtered = filtered.filter((supplier) => supplier.totalPrice >= parseFloat(minPrice));
            }

            if (maxPrice) {
                filtered = filtered.filter((supplier) => supplier.totalPrice <= parseFloat(maxPrice));
            }

            if (minQuality) {
                filtered = filtered.filter((supplier) => supplier.quality >= parseFloat(minQuality));
            }

            if (maxQuality) {
                filtered = filtered.filter((supplier) => supplier.quality <= parseFloat(maxQuality));
            }

        }
        setDataSupplier(filtered);
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
            <Header>Nhà cung cấp</Header>
            <div style={
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    marginRight: '30px'
                }
            }>
                <CreateSupplier fetchData={fetchData}/>
                <DeletesSupplier selectedRowKeys={selectedRowKeys}
                    fetchData={fetchData}/>
            </div>
            
            <DataSupplier dataSupplier={dataSupplier}
                rowSelection={rowSelection}
                loading={loading}
                fetchData={fetchData}
                applyFilter={applyFilter}></DataSupplier>
        </div>
    )
}

export default Supplier
