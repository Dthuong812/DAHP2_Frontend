import React, {useState} from "react";
import {
    Button,
    Input,
    Modal,
    List,
    notification,
    Select,
    Space
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {
    createOrderAPI,
    createCustomerAPI,
    createOrderDetailsAPI,
    getProductsAPI,
    checkCustomerAPI,
    getAllProductsAPI,
    updateProductAPI,
    updateInventoryAPI,
    getInventory
} from "../../services/apiService";

const {Option} = Select;
const OrderNew = (props) => {
    const {fetchData} = props
    const [isModalOpen, setModalOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [customer, setCustomer] = useState({name: "", address: ""});
    const [paymentMethod, setPaymentMethod] = useState("Offline");
    const [status, setStatus] = useState("Đã hoàn thành");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);


    const handleSearch = async (value) => {
        if (!value.trim()) {
            setProducts([]);
            return;
        }

        try {
            const res = await getProductsAPI({limit: 10, page: 1, name: value});
            if (res ?. data) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            notification.error({message: "Lỗi tải sản phẩm", description: "Không thể tải sản phẩm!"});
        }
    };

    const handleSelectProduct = (productId) => {
        const product = products.find((item) => item.product_id === productId);
        if (product) {
            handleAddProduct(product);
        }
    };

    const handlePhoneChange = async (e) => {
        const inputPhone = e.target.value;
        setPhone(inputPhone);

        if (inputPhone.length === 10) {
            try {
                const res = await checkCustomerAPI(inputPhone);
                if (res ?. data ?. exists) {
                    setIsNewCustomer(false);
                    setCustomer({name: res.data.customer.name, address: res.data.customer.address, customer_id: res.data.customer.customer_id});
                    notification.success({message: "Khách hàng đã tồn tại", description: "Thông tin khách hàng đã được tải."});
                } else {
                    setIsNewCustomer(true);
                    setCustomer({name: "", address: "", customer_id: ""});
                }
            } catch (error) {
                console.error("Error checking customer:", error);
                notification.error({message: "Lỗi kiểm tra khách hàng", description: "Không thể kiểm tra khách hàng."});
            }
        } else {
            setIsNewCustomer(false);
            setCustomer({name: "", address: "", customer_id: ""});
        }
    };

    const handleAddProduct = (product) => {
        if (product.stock_quantity <= 0) {
            notification.error({
                message: "Hết hàng",
                description: `Sản phẩm ${product.name} hiện tại không còn hàng trong kho!`,
            });
            return; 
        }
    
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.product_id === product.product_id);
    
            if (existingProduct) {
                if (existingProduct.quantity >= product.stock_quantity) {
                    notification.error({
                        message: "Số lượng không đủ",
                        description: `Không thể thêm số lượng lớn hơn số hàng có sẵn (Tối đa ${product.stock_quantity})`,
                    });
                    return prev; 
                }
                return prev.map(p =>
                    p.product_id === product.product_id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }
    
            return [
                ...prev, 
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const handleQuantityChange = async (product, action) => {
        try {
            // Get product data to check stock quantity
            const res = await getAllProductsAPI({product_id:product.product_id});
            console.log("res",res)
            if (res?.data) {
                const availableQuantity = res.data[0].stock_quantity;
                console.log("availableQuantity",availableQuantity)
    
                setSelectedProducts((prev) => {
                    return prev.map((p) => {
                        if (p.product_id === product.product_id) {
                            if (action === "increase") {
                            
                                if (p.quantity + 1 > availableQuantity) {
                                    notification.error({
                                        message: "Số lượng vượt quá số lượng trong kho",
                                        description: `Chỉ còn ${availableQuantity} sản phẩm trong kho.`,
                                    });
                                    return p; 
                                }
                                return {
                                    ...p,
                                    quantity: p.quantity + 1,
                                };
                            } else if (action === "decrease" ) {
                                return {
                                    ...p,
                                    quantity: p.quantity - 1,
                                };
                            }
                        }
                        return p;
                    }).filter((p) => p.quantity > 0); 
                });
            }
        } catch (error) {
            console.error("Error checking product quantity:", error);
            notification.error({
                message: "Lỗi kiểm tra số lượng sản phẩm",
                description: "Không thể kiểm tra số lượng sản phẩm trong kho.",
            });
        }
    };

    const handleCreateOrder = async () => {
        let customerId = customer.customer_id;
        if (isNewCustomer) {
            const customerRes = await createCustomerAPI({phone, name: customer.name, address: customer.address});
            customerId = customerRes.data.customer_id
        } else {
            customerId = customer.customer_id;
        }

        const totalAmount = selectedProducts.reduce((sum, product) => sum + product.quantity * product.price, 0);

        const orderRes = await createOrderAPI({customer_id: customerId, paymentMethod, total_amount: totalAmount, status});
        console.log(orderRes)
        const orderId = orderRes.data.order.order_id;
        console.log("Order ID:", orderId);

        // Tạo chi tiết đơn hàng
        const orderDetailsPromises = selectedProducts.map((product) => {
            const orderDetail = {
                order_id: orderId,
                product_id: product.product_id,
                quantity: product.quantity,
                unit_price: product.price
            };

            console.log("Creating Order Detail:", orderDetail);

            return createOrderDetailsAPI(orderDetail);
        });

        await Promise.all(orderDetailsPromises);
        const updateStockPromises = selectedProducts.map(async (product) => {
            const updatedProduct = {
                product_id: product.product_id,
                stock_quantity: product.stock_quantity - product.quantity, 
            };

           
            await updateProductAPI(updatedProduct);
        });
        await Promise.all(updateStockPromises);
        const updateInventoryPromises = selectedProducts.map(async (product) => {
         
            const inventoryRes = await getInventory({product_id:product.product_id}); 
            if (inventoryRes?.data) {
                const inventory = inventoryRes.data[0];
                const updatedInventory = {
                    inventory_id: inventory.inventory_id, 
                    remaining_stock: inventory.remaining_stock - product.quantity, 
                };
                await updateInventoryAPI(updatedInventory);
            }
        });

        await Promise.all(updateInventoryPromises);


        await Promise.all(updateInventoryPromises);

        notification.success({message: "Thành công", description: "Đơn hàng và chi tiết đơn hàng đã được tạo thành công!"});
        resetAndCloseModal()
        await fetchData()

    };
    const resetAndCloseModal = () => {
        setModalOpen(true);
        setPhone("");
        setCustomer({name: "", address: "", customer_id: ""});
        setSelectedProducts([]);
        setProducts([]);
    }
    const totalAmount = selectedProducts.reduce((sum, product) => sum + product.quantity * product.price, 0);

    return (
        <div className="">
            <div style={
                {
                    display: "flex",
                    justifyContent: "end",
                    padding: "20px 10px"
                }
            }>
                <Button onClick={
                        () => setModalOpen(true)
                    }
                    icon={<PlusOutlined/>}
                    style={
                        {
                            background: "#5570F1",
                            color: "#ffffff"
                        }
                }>
                    Tạo đơn hàng
                </Button>
            </div>
            <Modal title="Tạo đơn hàng mới"
                open={isModalOpen}
                onCancel={
                    () => resetAndCloseModal()
                }
                maskClosable={false}
                width={800}
                footer={
                    [
                        <Button key="cancel"
                            onClick={
                                () => setModalOpen(false)
                        }>Hủy</Button>,
                        <Button key="create" type="primary"
                            onClick={handleCreateOrder}
                            disabled={
                                !selectedProducts.length
                        }>Tạo đơn hàng</Button>,
                    ]
            }>
                <Input placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={
                        {marginBottom: "10px"}
                    }/> {
                isNewCustomer && (
                    <>
                        <Input placeholder="Tên khách hàng"
                            value={
                                customer.name
                            }
                            onChange={
                                (e) => setCustomer({
                                    ...customer,
                                    name: e.target.value
                                })
                            }
                            style={
                                {marginBottom: "10px"}
                            }/>
                        <Input placeholder="Địa chỉ giao hàng"
                            value={
                                customer.address
                            }
                            onChange={
                                (e) => setCustomer({
                                    ...customer,
                                    address: e.target.value
                                })
                            }
                            style={
                                {marginBottom: "10px"}
                            }/>
                    </>
                )
            }

                <Select showSearch placeholder="Tìm kiếm sản phẩm"
                    onSearch={handleSearch}
                    onSelect={handleSelectProduct}
                    filterOption={false}
                    style={
                        {
                            width: "100%",
                            marginBottom: "10px"
                        }
                }>
                    {
                    products.map((product) => (
                        <Option key={
                                product.product_id
                            }
                            value={
                                product.product_id
                        }>
                            {
                            product.name
                        }
                            - Giá: {
                            product.price.toLocaleString()
                        }
                            VND
                        </Option>
                    ))
                } </Select>

                <h4>Sản phẩm đã chọn:</h4>
                <div style={
                    {
                        maxHeight: "400px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px"
                    }
                }>
                    <List dataSource={selectedProducts}
                        renderItem={
                            (item) => (
                                <List.Item>
                                    <div style={
                                        {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%"
                                        }
                                    }>
                                        <div>
                                            <b>{
                                                item.name
                                            }</b>
                                            <br/>
                                            Giá: {
                                            item.price.toLocaleString()
                                        }
                                            VND
                                        </div>
                                        <div style={
                                            {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px"
                                            }
                                        }>
                                            <Button size="small"
                                                onClick={
                                                    () => handleQuantityChange(item, "increase")
                                                }
                                                type="primary">
                                                +
                                            </Button>
                                            <span>{
                                                item.quantity
                                            }</span>
                                            <Button size="small"
                                                onClick={
                                                    () => handleQuantityChange(item, "decrease")
                                                }
                                                type="primary"
                                                danger={
                                                    item.quantity === 1
                                            }>
                                                -
                                            </Button>
                                        </div>
                                    </div>
                                </List.Item>
                            )
                        }/>
                </div>
            <div>
                <div>
                    <span>Tổng tiền:</span>
                    <h3>{
                        totalAmount.toLocaleString()
                    }
                        VND</h3>
                </div>
                <Space wrap>
                    <Select value={paymentMethod}
                        onChange={
                            (value) => setPaymentMethod(value)
                        }
                        options={
                            [
                                {
                                    value: "Online",
                                    label: "Online"
                                }, {
                                    value: "Offline",
                                    label: "Offline"
                                }
                            ]
                        }/>
                </Space>
            </div>
        </Modal>
    </div>
    );
};

export default OrderNew;
