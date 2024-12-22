import axios from "./Axioscustum";

const loginApi = (email, password) => {
    return axios.post("v1/user/login", { email, password });
};

const createOrderAPI = async (orderData) => {
    return axios.post("v1/order/api", orderData);
};
const getOrderAPI = async (params) => {
    return axios.get("v1/order/api", { params });
};
const getOrdersAPI = async (params) => {
    return axios.get("v1/order/api-search", { params });
};
const deleteOrderAPI = async (order_id) => {
        return await axios.delete(`v1/order/api`, {
            data: { order_id } 
        });
};
const deleteArrayOrderAPI = async (orderIds) => {
        return await axios.delete(`v1/order/api-many`, {
            data: { orderIds } 
        });
};
const updateOrderAPI = async (order_id, customer_id, total_amount,status,paymentMethod,createAt) => {
    return axios.put(`v1/order/api`, {
        order_id,
        customer_id,
        total_amount,
        status,
        paymentMethod,
        createAt
    });
};
const createCustomerAPI = async (customerData) => {
    return axios.post("v1/customer/api", customerData);
};
const getCustomersAPI = async (params) => {
    return axios.get("v1/customer/api", { params });
};
const getCustomerAPI = async (params) => {
    return axios.get("v1/customer/api-search", { params });
};
const updateCustomerAPI = async (updatedData) => {
    return axios.put(`/v1/customer/api/`, updatedData);
};
const deleteCustomerAPI =  async (customer_id) => {
    return axios.delete(`v1/customer/api/`, {
            data: {customer_id} 
        });
};
const deleteCustomersAPI =  async (customerIDs) => {
    return axios.delete(`v1/customer/api-many/`, {
            data: {customerIDs} 
        });
};

const getProductsAPI = async (params) => {
    return axios.get("v1/product/api-search", { params });
};
const getAllProductsAPI = async (params) => {
    return axios.get("v1/product/api", { params });
};

const createOrderDetailsAPI = async (orderData) => {
    return axios.post("v1/detailOrder/api", orderData);
};
const getOrderDetailsAPI = async (params) => {
    return axios.get(`v1/detailOrder/api`,{params});
};
const getOrderDetailsByOrderIdAPI = async (order_id) => {
    return axios.get(`v1/detailOrder/api?order_id=${order_id}`);
};
const deleteOrderDetailsAPI = async (orderItemIds) => {
    return axios.delete(`v1/detailOrder/api-many/`, {
            data: {orderItemIds} 
        });
};
const deleteOrderDetailAPI = async (orderItem_id) => {
    return axios.delete(`v1/detailOrder/api/`, {
            data: {orderItem_id} 
        });
};
const updateDetailOrderAPI = async (orderItem_id,order_id,product_id, quantity, unit_price) => {
    return axios.put(`v1/detailOrder/api`, {
        orderItem_id,
        order_id,
        product_id,
        quantity,
        unit_price
    });
};

const getCategory=(params)=>{
    const URL_BACKEND ="v1/category/api";
    return axios.get(URL_BACKEND,{params})
}
const getSearchCategory=(params)=>{
    const URL_BACKEND ="v1/category/api-search";
    return axios.get(URL_BACKEND,{params})
}
export const checkCustomerAPI = async (phone) => {
    return axios.get(`v1/customer/api-check?phone=${phone}`);
}

const getInventory =(params)=>{
    const URL_BACKEND ="v1/inventory/api";
    return axios.get(URL_BACKEND,{params})
}
const getPurchaseOrder =(params)=>{
    const URL_BACKEND ="v1/purchaseOrder/api";
    return axios.get(URL_BACKEND,{params})
}
const getPurchaseOrderDetail =(params)=>{
    const URL_BACKEND ="v1/purchaseOrderDetail/api";
    return axios.get(URL_BACKEND,{params})
}
const createCategoryAPI = async (categoryData) => {
    return axios.post("v1/category/api", categoryData);
};
const createSupplierAPI = async (supplierData) => {
    return axios.post("v1/supplier/api", supplierData);
};
const deleteSupplierAPI = async (supplier_id) => {
    return axios.delete("v1/supplier/api", {
        data: {supplier_id} 
    });
};

const getSupplier =(params)=>{
    const URL_BACKEND ="v1/supplier/api";
    return axios.get(URL_BACKEND,{params})
}
const updateSupplier =async (updatedData)=>{
    const URL_BACKEND ="v1/supplier/api";
    return axios.put(URL_BACKEND, updatedData)
}
const getSearchSupplier=(params)=>{
    const URL_BACKEND ="v1/supplier/api-search";
    return axios.get(URL_BACKEND,{params})
}

const deleteCategoryAPI =  async (category_id) => {
    return axios.delete(`v1/category/api/`, {
            data: {category_id} 
        });
};
const deleteCategoriesAPI =  async (categoryId) => {
    return axios.delete(`v1/category/api-many/`, {
            data: {categoryId} 
        });
};
const deleteArraySupplierAPI =  async (supplierIds) => {
    return axios.delete(`v1/supplier/api-many/`, {
            data: {supplierIds} 
        });
};
const updateCategoryAPI = async (updatedData) => {
    return axios.put(`v1/category/api`, updatedData);
};
const updateProductAPI = async (updatedProduct) => {
    return axios.put(`v1/product/api`, updatedProduct);
};
const updatePurchaseOrderAPI = async (updatedPurchaseOrder) => {
    return axios.put(`v1/purchaseOrder/api`, updatedPurchaseOrder);
};
const updatePurchaseOrderDetailAPI = async (updatedPurchaseOrderDetail) => {
    return axios.put(`v1/purchaseOrderDetail/api`, updatedPurchaseOrderDetail);
};
const updateInventoryAPI = async (updatedInventory) => {
    return axios.put(`v1/inventory/api`, updatedInventory);
};
const createPurchaseOrderAPI = async (purchaseOrderData) => {
    return axios.post("v1/purchaseOrder/api", purchaseOrderData);
};
const createPurchaseOrderDetailAPI = async (purchaseOrderDetailData) => {
    return axios.post("v1/purchaseOrderDetail/api", purchaseOrderDetailData);
};
const createProductAPI = async (productData) => {
    return axios.post("v1/product/api", productData);
};
const deleteProductAPI = async (product_id) => {
    return axios.delete("v1/product/api",{
        data: {product_id} 
    })
};
const deleteProductsAPI = async (productIds) => {
    return axios.delete("v1/product/api-many",{
        data: {productIds} 
    })
};
const createInventoryAPI = async (inventoryData) => {
    return axios.post("v1/inventory/api", inventoryData);
};
const deleteInventoriesAPI = async (inventoryIds) => {
    return axios.delete("v1/inventory/api-many",{
        data: {inventoryIds} 
    })
};
const deleteInventoryAPI = async (inventory_id) => {
    return axios.delete("v1/inventory/api",{
        data: {inventory_id} 
    })
};
const deletePurchaseOrderAPI = async (purchaseOrder_id) => {
    return axios.delete("v1/purchaseOrder/api",{
        data: {purchaseOrder_id} 
    })
};
const deletePurchaseOrderDetailAPI = async (purchaseOrderDetail_id) => {
    return axios.delete("v1/purchaseOrderDetail/api",{
        data: {purchaseOrderDetail_id} 
    })
};
const deletePurchaseOrdersAPI = async (purchaseOrderIds) => {
    return axios.delete("v1/purchaseOrder/api-many",{
        data: {purchaseOrderIds} 
    })
};
const deletePurchaseOrderDetailsAPI = async (purchaseOrderDetailIds) => {
    return axios.delete("v1/purchaseOrderDetail/api-many",{
        data: {purchaseOrderDetailIds} 
    })
};
export {
    loginApi,
    deletePurchaseOrderAPI,
    deletePurchaseOrdersAPI,
    deletePurchaseOrderDetailsAPI ,
    deleteInventoriesAPI,
    deleteProductsAPI,
    updatePurchaseOrderAPI,
    updatePurchaseOrderDetailAPI,
    updateInventoryAPI ,
    updateProductAPI,
    deletePurchaseOrderDetailAPI,
    createProductAPI,
    deleteProductAPI,
    deleteInventoryAPI ,
    createPurchaseOrderAPI,
    createPurchaseOrderDetailAPI,
    createOrderAPI,
    getCategory,
    createCustomerAPI,
    getProductsAPI,
    createOrderDetailsAPI,
    getCustomersAPI,
    getOrderAPI,
    deleteOrderAPI,
    deleteOrderDetailsAPI,
    getOrderDetailsByOrderIdAPI,
    updateCustomerAPI,
    updateOrderAPI,
    updateDetailOrderAPI ,
    getAllProductsAPI,
    deleteArrayOrderAPI,
    deleteOrderDetailAPI,
    getOrdersAPI ,
    getCustomerAPI,
    deleteCustomerAPI ,
    deleteCustomersAPI,
    getInventory,
    getPurchaseOrder,
    getPurchaseOrderDetail,
    getOrderDetailsAPI,
    getSearchCategory,
    createCategoryAPI ,
    createSupplierAPI,
    getSupplier,
    updateCategoryAPI,
    deleteCategoriesAPI,
    deleteCategoryAPI ,
    deleteSupplierAPI,
    updateSupplier,
    getSearchSupplier,
    deleteArraySupplierAPI ,
    createInventoryAPI
};
