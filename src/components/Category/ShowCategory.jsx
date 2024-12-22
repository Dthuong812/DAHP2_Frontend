import { Button, Input, Modal, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { getAllProductsAPI } from "../../services/apiService"; // Import your API service

const ShowCategory = ({ isModalShow, setModalShow, dataShow, setDataShow }) => {
    const [key, setKey] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (dataShow) {
            setKey(dataShow.key); // Assuming 'key' is the category ID
            setCategoryName(dataShow.categoryName);
            fetchProducts(dataShow.key); 
        }
    }, [dataShow]);

    const fetchProducts = async (categoryId) => {
        try {
            const response = await getAllProductsAPI({ category_id: categoryId });
            const productData = response.data; 
            setProducts(productData); 
        } catch (error) {
            console.error("Error fetching products:", error);
            notification.error({
                message: "Lỗi khi lấy sản phẩm",
                description: "Đã xảy ra lỗi khi lấy dữ liệu sản phẩm. Vui lòng thử lại sau.",
            });
        }
    };

    const resetAndCloseModal = () => {
        setModalShow(false);
        setDataShow(null);
    };

    // Define the columns for the table
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
    ];

    return (
        <Modal
            title="Thông tin danh mục"
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
                placeholder="Mã danh mục"
                value={key}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Tên danh mục"
                value={categoryName}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <h4>Sản phẩm</h4>
            <Table
                dataSource={products}
                columns={columns} 
                rowKey="product_id"
                pagination={false}
            />
        </Modal>
    );
};

export default ShowCategory;
