import React, {useEffect, useState} from 'react'
import Header from '../components/layout/Header'
import BoxOverview from '../components/layout/BoxOverview'
import ProductNew from '../components/WareHouse/ProductNew'
import DatawareHouse from '../components/WareHouse/DatawareHouse'
import {
    getAllProductsAPI,
    getCategory,
    getInventory,
    getOrderDetailsAPI,
    getPurchaseOrder,
    getPurchaseOrderDetail
} from '../services/apiService'
import ProductDelete from '../components/WareHouse/ProductDelete'

const Warehouse = () => {
    const [dataProduct, setDataProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productResponse, categoryResponse, inventoryResponse, purchaseOrderResponse, purchaseOrderDetailResponse, orderDetailResponse] = await Promise.all([
                getAllProductsAPI(),
                getCategory(),
                getInventory(),
                getPurchaseOrder(),
                getPurchaseOrderDetail(),
                getOrderDetailsAPI()
            ]);
            console.log("productResponse", productResponse)
            console.log("categoryResponse", categoryResponse)
            console.log("inventoryResponse", inventoryResponse)
            console.log("purchaseOrderResponse", purchaseOrderResponse)
            console.log("purchaseOrderDetailResponse", purchaseOrderDetailResponse)
            console.log("orderDetailResponse", orderDetailResponse)
            const products = productResponse.data || [];
            const categories = categoryResponse.data || [];
            const inventories = inventoryResponse.data || [];
            const purchaseOrderDetails = purchaseOrderDetailResponse.data || [];
            const orderDetails = orderDetailResponse.data || [];

            const combinedData = inventories.map((inventory) => {
                const product = products.find((p) => p.product_id === inventory.product_id) || {};
                const category = categories.find((c) => c.category_id === product.category_id) || {};

                const totalImported = purchaseOrderDetails.filter((detail) => detail.product_id === inventory.product_id).reduce((sum, detail) => sum + detail.quantity, 0);


                const totalOrdered = orderDetails.filter((order) => order.product_id === inventory.product_id).reduce((sum, order) => sum + order.quantity, 0);


                const remainingQuantity = inventory.remaining_stock - totalOrdered;


                let status;
                if (remainingQuantity <= 0) {
                    status = "Hết hàng";
                } else if (remainingQuantity >= 10) {
                    status = "Còn hàng";
                } else if (remainingQuantity < 10) {
                    status = "Còn ít";
                } else {
                    status = "Không xác định";
                }

                return {
                    key: product.product_id,
                    productName: product.name || "Không rõ",
                    image: product.image || "Không có hình",
                    category: category.name || "Không rõ danh mục",
                    pricePrev: purchaseOrderDetails.filter((detail) => detail.product_id === inventory.product_id).map((detail) => detail.unit_cost)[0] || 0,
                    priceNext: product.price || 0,
                    quality: remainingQuantity,
                    status: status
                };
            });
            console.log(combinedData)
            setDataProduct(combinedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const applyFilter = (filterCriteria) => {
        const {
            minQuantity,
            maxQuantity,
            minImportPrice,
            maxImportPrice,
            minSalePrice,
            maxSalePrice,
            status
        } = filterCriteria;

        let filtered = [...dataProduct];

        // Kiểm tra nếu không có bộ lọc nào được áp dụng
        if (!minQuantity && !maxQuantity && !minImportPrice && !maxImportPrice && !minSalePrice && !maxSalePrice && !status) {
            fetchData()
        }

        if (minQuantity) {
            filtered = filtered.filter((product) => product.quality >= parseInt(minQuantity));
        }

        if (maxQuantity) {
            filtered = filtered.filter((product) => product.quality <= parseInt(maxQuantity));
        }

        if (minImportPrice) {
            filtered = filtered.filter((product) => product.pricePrev >= parseFloat(minImportPrice));
        }

        if (maxImportPrice) {
            filtered = filtered.filter((product) => product.pricePrev <= parseFloat(maxImportPrice));
        }

        if (minSalePrice) {
            filtered = filtered.filter((product) => product.priceNext >= parseFloat(minSalePrice));
        }

        if (maxSalePrice) {
            filtered = filtered.filter((product) => product.priceNext <= parseFloat(maxSalePrice));
        }

        if (status && status.length > 0) {
            filtered = filtered.filter((product) => status.includes(product.status));
        }

        setDataProduct(filtered);
        console.log("filtered", filtered);
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
            <Header>Sản phẩm</Header>
            <div style={
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    marginRight: '30px'
                }
            }>
                <ProductNew fetchData={fetchData}/>
                <ProductDelete selectedRowKeys={selectedRowKeys}
                    fetchData={fetchData}/>
            </div>
            <DatawareHouse dataProduct={dataProduct}
                rowSelection={rowSelection}
                loading={loading}
                fetchData={fetchData}
                applyFilter={applyFilter}
            ></DatawareHouse>
        </div>
    )
}

export default Warehouse
