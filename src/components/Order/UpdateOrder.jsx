import React, { useEffect, useState } from "react";
import {
    Button,
    Input,
    Modal,
    List,
    notification,
    Select,
    Space
} from "antd";
import {
    updateDetailOrderAPI,
    updateCustomerAPI,
    updateOrderAPI,
    getProductsAPI,
    checkCustomerAPI,
    deleteOrderDetailsAPI,
    getOrderDetailsByOrderIdAPI,
    deleteOrderDetailAPI,
    createOrderDetailsAPI
} from "../../services/apiService";

const { Option } = Select;

const UpdateOrder = ({
    isModalUpdateOpen,
    setModalUpdateOpen,
    dataUpdate,
    setDataUpdate,
    fetchData
}) => {
    const [phone, setPhone] = useState("");
    const [customer, setCustomer] = useState({ name: "", address: "" });
    const [paymentMethod, setPaymentMethod] = useState("Offline");
    const [status, setStatus] = useState("Đang xử lý");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (dataUpdate) {
            setPhone(dataUpdate.customerPhone || "");
            setCustomer({
                name: dataUpdate.customerName || "",
                address: dataUpdate.address
            });
            setPaymentMethod(dataUpdate.paymentMethod || "Offline");
            setStatus(dataUpdate.status || "Đang xử lý");

            // Populate selected products
            const formattedProducts = dataUpdate.orderDetails.map(item => {
                const productDetail = dataUpdate.productDetails.find(
                    product => product.product_id === item.product_id
                );
    
                return {
                    product_id: item.product_id,
                    name: productDetail ? productDetail.name : "Không có tên sản phẩm",
                    quantity: item.quantity,
                    price: item.unit_price
                };
            });
    
            setSelectedProducts(formattedProducts);

            setTotalAmount(dataUpdate.total_amount || 0);
        }
    }, [dataUpdate]);

    useEffect(() => {
        const total = selectedProducts.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setTotalAmount(total);
    }, [selectedProducts]);

    const handleSearch = async value => {
        if (!value.trim()) {
            setProducts([]);
            return;
        }

        try {
            const res = await getProductsAPI({ limit: 10, page: 1, name: value });
            if (res?.data) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            notification.error({
                message: "Lỗi tải sản phẩm",
                description: "Không thể tải sản phẩm!"
            });
        }
    };

    const handleAddProduct = product => {
        setSelectedProducts(prev => {
            const existingProduct = prev.find(
                p => p.product_id === product.product_id
            );
            if (existingProduct) {
                return prev.map(p => 
                    p.product_id === product.product_id
                        ? { ...p, quantity: p.quantity + 1 }  
                        : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleQuantityChange = (product, action) => {
        setSelectedProducts((prev) => {
            return prev.map((p) => {
                if (p.product_id === product.product_id) {
                    if (action === "increase") {
                        return {
                            ...p,
                            quantity: p.quantity + 1
                        };
                    } else if (action === "decrease") {
                        return {
                            ...p,
                            quantity: p.quantity - 1
                        };
                    }
                }
                return p;
            }).filter((p) => p.quantity > 0);
        });
    };
    const handleSubmit = async () => {
        // console.log(totalAmount);
        const dataPhone = await checkCustomerAPI(dataUpdate.customerPhone);
    
        // Tạo danh sách sản phẩm cần cập nhật
        const order = selectedProducts.map((product) => {
            const orderDetail = dataUpdate.orderDetails.find(
                (item) => item.product_id === product.product_id
            );
    
            return {
                orderItem_id: String(orderDetail?.orderItem_id || ""),
                order_id: String(dataUpdate.key),
                product_id: String(product.product_id),
                quantity: product.quantity,
                unitPrice: product.price,
            };
        });
    
        // Tạo danh sách sản phẩm cần xóa (những sản phẩm không có trong selectedProducts)
        const productsToDelete = dataUpdate.orderDetails.filter((item) => {
            return !selectedProducts.some(
                (product) => product.product_id === item.product_id
            );
        });
    
        // Xóa các sản phẩm không còn trong giỏ hàng
        const deletePromises = productsToDelete.map((product) => {
            return deleteOrderDetailAPI(product.orderItem_id);
        });
    
        // Xử lý xóa sản phẩm
        await Promise.all(deletePromises)
            .then(() => {
                // console.log("Sản phẩm không còn trong đơn hàng đã được xóa.");
            })
            .catch((error) => {
                console.error("Lỗi khi xóa sản phẩm:", error);
            });
    
        // Thêm các sản phẩm mới vào cơ sở dữ liệu chỉ khi chưa có trong chi tiết đơn hàng
        const newProducts = selectedProducts.filter((product) => {
            return !dataUpdate.orderDetails.some(
                (item) => item.product_id === product.product_id
            );
        });
    
        const orderDetailsPromises = newProducts.map((product) => {
            const orderDetail = {
                order_id: dataUpdate.key,
                product_id: product.product_id,
                quantity: product.quantity,
                unit_price: product.price,
            };
    
            // console.log("Creating Order Detail:", orderDetail);
    
            return createOrderDetailsAPI(orderDetail);
        });
    
        // Chỉ tạo mới nếu có sản phẩm mới
        if (orderDetailsPromises.length > 0) {
            await Promise.all(orderDetailsPromises)
                .then(() => {
                    // console.log("Sản phẩm mới đã được thêm vào cơ sở dữ liệu.");
                })
                .catch((error) => {
                    console.error("Lỗi khi thêm sản phẩm mới:", error);
                });
        }
    
        // Cập nhật chi tiết hóa đơn mới cho các sản phẩm đã có
        const updatePromises = order.map(async (detail) => {
            try {
                if (detail.orderItem_id) {
                    return await updateDetailOrderAPI(
                        detail.orderItem_id,
                        detail.order_id,
                        detail.product_id,
                        detail.quantity,
                        detail.unitPrice
                    );
                } else {
                    console.warn("Missing orderItem_id, skipping update for:", detail);
                    return Promise.resolve();
                }
            } catch (error) {
                console.error(
                    `Error updating detail with orderItem_id: ${detail.orderItem_id}`,
                    error
                );
                return Promise.reject(error); // Báo lỗi để Promise.all có thể xử lý
            }
        });
    
        await Promise.all(updatePromises)
            .then(() => {
                // console.log("All order details updated successfully.");
            })
            .catch((error) => {
                console.error("Error updating one or more order details:", error);
            });
    
        const data = {
            order_id: dataUpdate.key,
            customer_id: String(dataPhone.data.customer.customer_id),
            total_amount: totalAmount,
            status,
            paymentMethod,
        };
        // console.log("123", data);
        await updateOrderAPI(
            data.order_id,
            data.customer_id,
            data.total_amount,
            data.status,
            data.paymentMethod
        );
    
        notification.success({
            message: "Cập nhật thành công",
            description: "Cập nhật đơn hàng thành công!",
        });
    
        setModalUpdateOpen(false);
        await fetchData();
    };
    
    

    const resetAndCloseModal = () => {
        setPhone("");
        setCustomer({ name: "", address: "" });
        setPaymentMethod("Offline");
        setStatus("Đang xử lý");
        setSelectedProducts([]);
        setModalUpdateOpen(false);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Cập nhật đơn hàng"
            open={isModalUpdateOpen}
            onOk={handleSubmit}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            width={800}
            footer={[
                <Button key="cancel" onClick={resetAndCloseModal}>
                    Hủy
                </Button>,
                <Button
                    key="update"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!selectedProducts.length}
                >
                    Cập nhật
                </Button>
            ]}
        >
            <Input
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ marginBottom: "10px" }}
                disabled
            />

            <Input
                placeholder="Tên khách hàng"
                value={customer.name}
                onChange={e =>
                    setCustomer({ ...customer, name: e.target.value })
                }
                style={{ marginBottom: "10px" }}
                disabled
            />

            <Input
                placeholder="Địa chỉ giao hàng"
                value={customer.address}
                onChange={e =>
                    setCustomer({ ...customer, address: e.target.value })
                }
                style={{ marginBottom: "10px" }}
                disabled
            />

            <Select
                showSearch
                placeholder="Tìm kiếm sản phẩm"
                onSearch={handleSearch}
                onSelect={productId => {
                    const product = products.find(
                        item => item.product_id === productId
                    );
                    if (product) handleAddProduct(product);
                }}
                filterOption={false}
                style={{ width: "100%", marginBottom: "10px" }}
            >
                {products.map(product => (
                    <Option key={product.product_id} value={product.product_id}>
                        {product.name} - Giá: {product.price.toLocaleString()} VND
                    </Option>
                ))}
            </Select>

            <h4>Sản phẩm đã chọn:</h4>
            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "10px"
                }}
            >
                <List
                    dataSource={selectedProducts}
                    renderItem={item => (
                        <List.Item>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%"
                                }}
                            >
                                <div>
                                    <b>{item.name}</b>
                                    <br />
                                    Giá: {item.price.toLocaleString()} VND
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px"
                                    }}
                                >
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            handleQuantityChange(item, "increase")
                                        }
                                        type="primary"
                                    >
                                        +
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            handleQuantityChange(item, "decrease")
                                        }
                                        type="primary"
                                        danger={item.quantity === 1}
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <span>Tổng tiền:</span>
                <h3>{totalAmount.toLocaleString()} VND</h3>
            </div>

            <Space wrap style={{ marginTop: "20px" }}>
                <Select
                    value={paymentMethod}
                    onChange={value => setPaymentMethod(value)}
                    options={[
                        { value: "Online", label: "Online" },
                        { value: "Offline", label: "Offline" }
                    ]}
                />
                <Select
                    value={status}
                    onChange={value => setStatus(value)}
                    options={[
                        { value: "Đang xử lý", label: "Đang xử lý" },
                        { value: "Đã hoàn thành", label: "Đã hoàn thành" },
                        { value: "Đã hủy", label: "Đã hủy" }
                    ]}
                />
            </Space>
    </Modal>
    );
};

export default UpdateOrder;
