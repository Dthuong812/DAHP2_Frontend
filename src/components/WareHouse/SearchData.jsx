import {Input, notification, Spin} from "antd";
import React, {useState, useRef} from "react";
import {
    getProductsAPI,
    getSearchCategory,
    getInventory,
    getPurchaseOrderDetail,
    getOrderDetailsAPI,
    getAllProductsAPI
} from "../../services/apiService";

const SearchData = (props) => {
    const {setSearchResults, fetchData} = props;
    const [loading, setLoading] = useState(false);
    const searchTimeoutRef = useRef(null);

    const handleSearch = async (value) => {
        if (!value.trim()) {
            fetchData(); 
            return;
        }

        setLoading(true);
        try { // Gọi API
            const [productResponse, categoryResponse, inventoryResponse, purchaseOrderDetailResponse, orderDetailResponse,] = await Promise.allSettled([
                getProductsAPI(
                    {limit: 10, page: 1, name: value}
                ),
                getSearchCategory(
                    {limit: 10, page: 1, name: value}
                ),
                getInventory(),
                getPurchaseOrderDetail(),
                getOrderDetailsAPI(),
            ]);


            const products = productResponse.status === "fulfilled" && productResponse.value ?. data ? productResponse.value.data : [];
            const categories = categoryResponse.status === "fulfilled" && categoryResponse.value ?. data ? categoryResponse.value.data : [];
            const inventories = inventoryResponse.status === "fulfilled" && inventoryResponse.value ?. data ? inventoryResponse.value.data : [];
            const purchaseOrderDetails = purchaseOrderDetailResponse.status === "fulfilled" && purchaseOrderDetailResponse.value ?. data ? purchaseOrderDetailResponse.value.data : [];
            const orderDetails = orderDetailResponse.status === "fulfilled" && orderDetailResponse.value ?. data ? orderDetailResponse.value.data : [];

            const lowerCaseValue = value.toLowerCase();


            const filteredByProduct = inventories.map((inventory) => {
                const product = products.find((p) => p.product_id === inventory.product_id) || {};
                const category = categories.find((c) => c.category_id === product.category_id) || {};

                if (product.product_id ?. toLowerCase().includes(lowerCaseValue) || product.name ?. toLowerCase().includes(lowerCaseValue)) {
                    return createResultObject(product, category, inventory, purchaseOrderDetails, orderDetails);
                }
                return null;
            }).filter((item) => item !== null);

    
            const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(lowerCaseValue));

            let categoryProducts = [];
            if (filteredCategories.length > 0) {
                const element = filteredCategories.map((item) => item.category_id);
                const categoryProductsResponse = await getAllProductsAPI({category_id: element});
                categoryProducts = categoryProductsResponse ?. data || [];
            }

            const filteredByCategory = categoryProducts.map((product) => {
                const inventory = inventories.find((inv) => inv.product_id === product.product_id) || {};
                const category = categories.find((c) => c.category_id === product.category_id) || {
                    name: "Không có danh mục"
                };

                return createResultObject(product, category, inventory, purchaseOrderDetails, orderDetails);
            });


            const results = [
                ... filteredByProduct,
                ... filteredByCategory
            ];
            const uniqueResults = results.filter((result, index, self) => index === self.findIndex((r) => r.key === result.key));

            setSearchResults(uniqueResults);
        } catch (error) {
            console.error("Error during search:", error);
            notification.error({message: "Lỗi khi tìm kiếm", description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại."});
        } finally {
            setLoading(false);
        }
    };

    const createResultObject = (product, category, inventory, purchaseOrderDetails, orderDetails) => {
        const totalImported = purchaseOrderDetails.filter((detail) => detail.product_id === inventory.product_id).reduce((sum, detail) => sum + detail.quantity, 0);

        const totalOrdered = orderDetails.filter((order) => order.product_id === inventory.product_id).reduce((sum, order) => sum + order.quantity, 0);

        const remainingQuantity = inventory.remaining_stock + totalImported - totalOrdered;

        let status;
        if (remainingQuantity <= 0) {
            status = "Hết hàng";
        } else if (remainingQuantity > 10) {
            status = "Còn hàng";
        } else if (remainingQuantity < 5) {
            status = "Còn ít";
        } else {
            status = "Không xác định";
        }

        return {
            key: inventory.product_id || product.product_id,
            productName: product.name || "Tên sản phẩm không xác định",
            image: product.image || "Đường dẫn ảnh không có",
            category: category ?. name || "Không có danh mục",
            pricePrev: purchaseOrderDetails.filter((detail) => detail.product_id === inventory.product_id).map((detail) => detail.unit_cost)[0] || "Không có giá",
            priceNext: product.price || "Không có giá",
            quality: remainingQuantity || 0,
            status: status || "Không xác định"
        };
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(value);
        }, 500);
    };

    return (<div>
        <Input placeholder="Tìm kiếm theo mã, tên sản phẩm hoặc danh mục"
            onChange={handleInputChange}
            allowClear/> {
        loading && (<div style={
            {
                marginTop: "10px",
                textAlign: "center"
            }
        }>
            <Spin tip="Đang tìm kiếm..."/>
        </div>)
    }
        {
        !loading && setSearchResults.length === 0 && (<div style={
            {
                marginTop: "10px",
                textAlign: "center",
                color: "gray"
            }
        }>
            Không tìm thấy kết quả phù hợp.
        </div>)
    } </div>);
};

export default SearchData;
