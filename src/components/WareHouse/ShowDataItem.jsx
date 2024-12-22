import React, {useState, useEffect} from "react";
import {
    Modal,
    Input,
    Button,
    Select,
    notification,
    Upload,
} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {updateProductAPI, getCategory, getSupplier} from "../../services/apiService";
import TextArea from "antd/es/input/TextArea";

const ShowDataItem = ({isModalShow,  setModalShow,dataShow, setDataShow,fetchData}) => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        key: "",
        productName: "",
        image: null,
        category: "",
        pricePrev: "",
        priceNext: "",
        inventoryQuantity: "",
        description: "",
        discount: ""
    });

    useEffect(() => {
        if (dataShow) {
            setProduct({
                key:dataShow.key,
                productName:dataShow.productName,
                image:dataShow.image,
                category:dataShow.category,
                pricePrev:dataShow.pricePrev,
                priceNext:dataShow.priceNext,
                inventoryQuantity:dataShow.quality,
                description:dataShow.productDetails ?. description,
                discount:dataShow.discount || ""
            });
        }
    }, [dataShow]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoryRes, supplierRes] = await Promise.all([getCategory(), getSupplier()]);
                setCategories(categoryRes ?. data || []);
                setSuppliers(supplierRes ?. data || []);
            } catch (error) {
                notification.error({message: "Lỗi", description: "Không thể tải dữ liệu danh mục hoặc nhà cung cấp."});
            }
        };
        fetchInitialData();
    }, []);

    const handleSelectChange = (name, value) => {
        setProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = ({file}) => {
        setProduct((prev) => ({
            ...prev,
            image: file.originFileObj
        }));
    };

    const validateForm = () => {
        const {productName, pricePrev, priceNext, category} = product;
        if (!productName || !pricePrev || !priceNext || !category) {
            notification.error({message: "Lỗi xác thực", description: "Vui lòng điền đầy đủ thông tin bắt buộc."});
            return false;
        }
        if (isNaN(pricePrev) || isNaN(priceNext)) {
            notification.error({message: "Lỗi xác thực", description: "Giá phải là số hợp lệ."});
            return false;
        }
        return true;
    };

 
    return (
        <Modal
            title="Thông tin sản phẩm"
            open={isModalShow}
            onCancel={() => setModalShow(false)}
            maskClosable={false}
            footer={[
                <Button key="cancel" onClick={() => setModalShow(false)}>
                    Hủy
                </Button>
            ]}
        >
        {product.image && (
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <img
                        src={
                        `http://localhost:8080/v1/product/images/${product.image}`}
                        alt="Product"
                        style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #d9d9d9",
                        }}
                    />
                </div>
            )}
            <Input
                placeholder="Mã sản phẩm"
                value={product.key}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Tên sản phẩm"
                value={product.productName}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Select
                placeholder="Chọn danh mục sản phẩm"
                value={product.category}
                style={{ width: "100%", marginBottom: "10px" }}
                disabled
            >
                {categories.map((cat) => (
                    <Select.Option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                    </Select.Option>
                ))}
            </Select>
    
            <Input
                placeholder="Giá cũ"
                value={product.pricePrev}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Giá mới"
                value={product.priceNext}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Số lượng"
                value={product.inventoryQuantity}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <Input
                placeholder="Giảm giá"
                value={product.discount}
                style={{ marginBottom: "10px" }}
                disabled
            />
            <TextArea
                placeholder="Mô tả sản phẩm"
                value={product.description}
                rows={4}
                style={{ marginTop: "10px" }}
                disabled
            />
        </Modal>
    );
    
};

export default ShowDataItem;
