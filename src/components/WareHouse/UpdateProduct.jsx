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

const UpdateProduct = ({isModalUpdateOpen, setModalUpdateOpen, dataUpdate, fetchData}) => {
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
        if (dataUpdate) {
            setProduct({
                key: dataUpdate.key,
                productName: dataUpdate.productName,
                image: dataUpdate.image,
                category: dataUpdate.category,
                pricePrev: dataUpdate.pricePrev,
                priceNext: dataUpdate.priceNext,
                inventoryQuantity: dataUpdate.quality,
                description: dataUpdate.productDetails ?. description,
                discount: dataUpdate.discount || ""
            });
        }
    }, [dataUpdate]);

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

    const handleUpdateProduct = async () => {
        if (! validateForm()) 
            return;
        

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("product_id", String(product.key));
            formData.append("name", product.productName);
            formData.append("price", product.priceNext);
            formData.append("stock_quantity", product.inventoryQuantity);
            formData.append("category_id", product.category);
            formData.append("description", product.description);
            formData.append("discount", product.discount);

            if (product.image) {
                formData.append("image", product.image);
            }

            console.log("formData",formData)
            await updateProductAPI(formData);

            notification.success({message: "Thành công", description: "Sản phẩm đã được cập nhật thành công!"});

            fetchData(); // Load lại dữ liệu
            setModalUpdateOpen(false); // Đóng modal
        } catch (error) {
            const errorMessage = error.response ?. data ?. message || "Có lỗi xảy ra";
            notification.error({message: "Lỗi", description: errorMessage});
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Chỉnh sửa sản phẩm"
            open={isModalUpdateOpen}
            onCancel={
                () => setModalUpdateOpen(false)
            }
            maskClosable={false}
            footer={
                [
                    <Button key="cancel"
                        onClick={
                            () => setModalUpdateOpen(false)
                    }>
                        Hủy
                    </Button>,
                    <Button key="save" type="primary"
                        onClick={handleUpdateProduct}
                        loading={loading}>
                        Lưu thay đổi
                    </Button>,
                ]
        }>
            <Input placeholder="Mã sản phẩm"
                value={
                    product.key
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        key: e.target.value
                    })
                }
                style={
                    {marginBottom: "10px"}
                }
                disabled/>
            <Input placeholder="Tên sản phẩm"
                value={
                    product.productName
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        productName: e.target.value
                    })
                }
                style={
                    {marginBottom: "10px"}
                }/>
            <Select placeholder="Chọn danh mục sản phẩm"
                value={
                    product.category
                }
                onChange={
                    (value) => handleSelectChange("category", value)
                }
                style={
                    {
                        width: "100%",
                        marginBottom: "10px"
                    }
            }>
                {
                categories.map((cat) => (
                    <Select.Option key={
                            cat.category_id
                        }
                        value={
                            cat.category_id
                    }>
                        {
                        cat.name
                    } </Select.Option>
                ))
            } </Select>

            <Input placeholder="Giá cũ" name="pricePrev" type="number"
                value={
                    product.pricePrev
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        pricePrev: e.target.value
                    })
                }
                style={
                    {marginBottom: "10px"}
                }
                disabled/>
            <Input placeholder="Giá mới" name="priceNext" type="number"
                value={
                    product.priceNext
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        priceNext: e.target.value
                    })
                }
                style={
                    {marginBottom: "10px"}
                }/>
            <Input placeholder="Số lượng" name="inventoryQuantity" type="number"
                value={
                    product.inventoryQuantity
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        inventoryQuantity: e.target.value
                    })
                }
                style={
                    {marginBottom: "10px"}
                }
                disabled/>
            <Input placeholder="Giảm giá" name="discount"
                value={
                    product.discount
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        discount: e.target.value
                    })
                }
                style={
                    {marginBottom: "10px"}
                }/>
            <Upload name="image" listType="picture"
                onChange={handleImageUpload}>
                <Button icon={<UploadOutlined/>}>Tải lên hình ảnh</Button>
            </Upload>
            <TextArea placeholder="Mô tả sản phẩm" name="description"
                value={
                    product.description
                }
                onChange={
                    (e) => setProduct({
                        ...product,
                        description: e.target.value
                    })
                }
                rows={4}
                style={
                    {marginTop: "10px"}
                }/>
        </Modal>
    );
};

export default UpdateProduct;
