import {
    Button,
    Input,
    List,
    Modal,
    Space
} from "antd";
import {useEffect, useState} from "react";

const ShowCustomer = ({isModalShow, setModalShow, dataShow, setDataShow}) => {
    const [phone, setPhone] = useState("");
    const [customer, setCustomer] = useState({name: "", address: ""});
    const [paymentMethod, setPaymentMethod] = useState("Offline");
    const [status, setStatus] = useState("Đang xử lý");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderDate, setOrderDate] = useState("");
    const [orderId, setOrderId] = useState("");
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (
            date.getMonth() + 1
        )).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    useEffect(() => {
        if (dataShow) {
            setPhone(dataShow.customerPhone || "");
            setCustomer({
                name: dataShow.customerName || "",
                address: dataShow.customerAddress || ""
            });
            setPaymentMethod(dataShow.paymentMethod || "Offline");
            setStatus(dataShow.status || "Đang xử lý");
            setOrderDate(dataShow.created_at || "");
            setOrderId(dataShow.key || "");

            // Cập nhật thông tin sản phẩm từ chi tiết đơn hàng
            const formattedProducts = dataShow.orderDetails.map(item => {
                const productDetail = dataShow.productDetails.find(product => product.product_id === item.product_id);

                return {
                    order_id: item.order_id,
                    createAt: item.createdAt,
                    product_id: item.product_id,
                    name: productDetail ? productDetail.name : "Không có tên sản phẩm",
                    quantity: item.quantity,
                    price: item.unit_price
                };
            });

            const groupedOrders = formattedProducts.reduce((acc, order) => {
                const existingOrder = acc.find(o => o.order_id === order.order_id);

                if (existingOrder) {
                    const existingProduct = existingOrder.products.find(p => p.product_id === order.product_id);

                    if (existingProduct) {
                        existingProduct.quantity += order.quantity;
                    } else {
                        existingOrder.products.push({
                            ...order
                        });
                    }
                } else {
                    acc.push({
                        order_id: order.order_id,
                        createAt: order.createAt,
                        products: [
                            {
                                ...order
                            }
                        ]
                    });
                }

                return acc;
            }, []);

            setSelectedProducts(groupedOrders);

            const total = formattedProducts.reduce((acc, item) => acc + item.quantity * item.price, 0);
            setTotalAmount(total);
        }
    }, [dataShow]);
    const resetAndCloseModal = () => {
        setPhone("");
        setCustomer({name: "", address: ""});
        setPaymentMethod("Offline");
        setStatus("Đang xử lý");
        setSelectedProducts([]);
        setModalShow(false);
        setDataShow(null);
    };
    const calculateOrderTotal = (order) => {
        return order.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };
    return (
        <Modal title="Thông tin đơn hàng"
            open={isModalShow}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            width={800}
            footer={
                [
                    <Button key="cancel"
                        onClick={resetAndCloseModal}>
                        Đóng
                    </Button>
                ]
        }>
            <Input placeholder="Mã đơn hàng"
                value={orderId}
                style={
                    {marginBottom: "10px"}
                }
                disabled/>
            <Input placeholder="Số điện thoại"
                value={phone}
                style={
                    {marginBottom: "10px"}
                }
                disabled/>

            <Input placeholder="Tên khách hàng"
                value={
                    customer.name
                }
                style={
                    {marginBottom: "10px"}
                }
                disabled/>

            <Input placeholder="Địa chỉ giao hàng"
                value={
                    customer.address
                }
                style={
                    {marginBottom: "10px"}
                }
                disabled/>

            <h4>Sản phẩm đã mua</h4>
            <div style={
                {
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "10px"
                }
            }>
                {
                selectedProducts.map(order => (
                    <div key={
                        order.order_id
                    }>
                        <div style={
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }
                        }>
                            <h3 style={
                                {marginTop: "10px"}
                            }>Mã đơn: {
                                order.order_id
                            }</h3>
                            <h5 style={
                                {marginTop: "10px"}
                            }>
                                Ngày đặt: {
                                formatDate(order.createAt)
                            }</h5>
                        </div>
                        <List dataSource={
                                order.products
                            }
                            renderItem={
                                item => (
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
                                                <span>{
                                                    item.quantity
                                                }</span>
                                            </div>
                                        </div>

                                    </List.Item>
                                )
                            }/>
                        
                        <div style={
                            {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "end",
                                alignItems:"end",
                                marginBottom:"10px"
                            }
                        }>
                            <h4>Tiền</h4>
                            <h3>{calculateOrderTotal(order).toLocaleString()} VND</h3>
                        </div>
                        <hr></hr>
                    </div>
                ))
            } </div>

            <div style={
                {marginTop: "10px"}
            }>
                <span>Tổng tiền:</span>
                <h3>{
                    totalAmount.toLocaleString()
                }
                    VND</h3>
            </div>
        </Modal>
    );
};

export default ShowCustomer;
