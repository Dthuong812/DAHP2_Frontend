import React, { useEffect, useState } from "react";
import { Button, Input, Modal, List, Select, Space } from "antd";

const { Option } = Select;

const ShowDataItem = ({
    isModalShow,
    setModalShow,
    dataShow,
    setDataShow
}) => {
    const [phone, setPhone] = useState("");
    const [customer, setCustomer] = useState({ name: "", address: "" });
    const [paymentMethod, setPaymentMethod] = useState("Offline");
    const [status, setStatus] = useState("Đang xử lý");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderDate, setOrderDate] = useState("");
    useEffect(() => {
        if (dataShow) {
            setPhone(dataShow.customerPhone || "");
            setCustomer({
                name: dataShow.customerName || "",
                address: dataShow.address
            });
            setPaymentMethod(dataShow.paymentMethod || "Offline");
            setStatus(dataShow.status || "Đang xử lý");
            setOrderDate(dataShow.created_at || "");

            const formattedProducts = dataShow.orderDetails.map(item => {
                const productDetail = dataShow.productDetails.find(
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
            setTotalAmount(dataShow.total_amount || 0);
        }
    }, [dataShow]);

    const resetAndCloseModal = () => {
        setPhone("");
        setCustomer({ name: "", address: "" });
        setPaymentMethod("Offline");
        setStatus("Đang xử lý");
        setSelectedProducts([]);
        setModalShow(false);
        setDataShow(null);
    };

    return (
        <Modal
            title="Thông tin đơn hàng"
            open={isModalShow}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            width={800}
            footer={[
                <Button key="cancel" onClick={resetAndCloseModal}>
                    Đóng
                </Button>
            ]}
        >
            <Input
                placeholder="Số điện thoại"
                value={phone}
                style={{ marginBottom: "10px" }}
                disabled
            />

            <Input
                placeholder="Tên khách hàng"
                value={customer.name}
                style={{ marginBottom: "10px" }}
                disabled
            />

            <Input
                placeholder="Địa chỉ giao hàng"
                value={customer.address}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Ngày đặt"
                value={orderDate}
                onChange={e => setOrderDate(e.target.value)}
                style={{ marginBottom: "10px" }}
                disabled
            />

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
                    disabled
                    onChange={value => setPaymentMethod(value)}
                    options={[
                        { value: "Online", label: "Online" },
                        { value: "Offline", label: "Offline" }
                    ]}
                />
                <Select
                    value={status}
                    disabled
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

export default ShowDataItem;
