import { Button, Input, Modal, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { getPurchaseOrder, getPurchaseOrderDetail, getAllProductsAPI } from "../../services/apiService";

const ShowSupplier = ({ isModalShow, setModalShow, dataShow, setDataShow }) => {
    const [supplierId, setSupplierId] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (dataShow) {
            setSupplierId(dataShow.key);
            setSupplierName(dataShow.supplierName);
            fetchProducts(dataShow.key);
        }
    }, [dataShow]);

    const fetchProducts = async (supplierId) => {
        setLoading(true);
        try {
            const purchaseOrdersResponse = await getPurchaseOrder({ supplier_id: supplierId });
            const purchaseOrders = purchaseOrdersResponse.data;

            const purchaseDetailPromises = purchaseOrders.map((order) =>
                getPurchaseOrderDetail({ purchaseOrder_id: order.purchaseOrder_id})
            );
            const purchaseDetailsResponses = await Promise.all(purchaseDetailPromises);

            const productIds = new Set(
                purchaseDetailsResponses.flatMap((response) =>
                    response.data.map((detail) => detail.product_id)
                )
            );

            const productPromises = Array.from(productIds).map((productId) =>
                getAllProductsAPI({ product_id: productId })
            );
            const productResponses = await Promise.all(productPromises);

            const uniqueProducts = Array.from(
                new Map(
                    productResponses.flatMap((response) =>
                        response?.data?.map((product) => [
                            product.product_id,
                            {
                                product_id: product.product_id,
                                name: product.name,
                                stock_quantity: product.stock_quantity,
                                price: product.price,
                            },
                        ])
                    )
                ).values()
            );

            setProducts(uniqueProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            if (error.response) {
                notification.error({
                    message: "Lỗi từ server",
                    description: `Mã lỗi: ${error.response.status}. Vui lòng thử lại sau.`,
                });
            } else if (error.request) {
                notification.error({
                    message: "Không thể kết nối",
                    description: "Kiểm tra kết nối mạng và thử lại.",
                });
            } else {
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Đã xảy ra lỗi. Vui lòng thử lại.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const resetAndCloseModal = () => {
        setModalShow(false);
        setDataShow(null);
        setProducts([]);
    };

    const columns = [
        {
            title: "Mã sản phẩm",
            dataIndex: "product_id",
            key: "product_id",
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "stock_quantity",
            key: "stock_quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Thành tiền",
            key: "total",
            render: (_, record) => record.price * record.stock_quantity,
        },
    ];

    return (
        <Modal
            title="Thông tin nhà cung cấp"
            open={isModalShow}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            width={800}
            footer={[
                <Button key="cancel" onClick={resetAndCloseModal}>
                    Đóng
                </Button>,
            ]}
        >
            <Input
                placeholder="Mã nhà cung cấp"
                value={supplierId}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Tên nhà cung cấp"
                value={supplierName}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <h4>Sản phẩm</h4>
            <Table
                dataSource={products}
                columns={columns}
                rowKey="product_id"
                pagination={false}
                loading={loading}
                locale={{ emptyText: "Không có sản phẩm nào được tìm thấy." }}
            />
        </Modal>
    );
};

export default ShowSupplier;
