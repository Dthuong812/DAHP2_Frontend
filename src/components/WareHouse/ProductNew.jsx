import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select, notification, Upload, Spin } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createInventoryAPI,
  createProductAPI,
  createPurchaseOrderAPI,
  createPurchaseOrderDetailAPI,
  getCategory,
  getSupplier,
} from "../../services/apiService";

const { TextArea } = Input;

const ProductNew = ({ fetchData }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock_quantity: "",
    description: "",
    category_id: "",
    discount: "",
    image: "",
    supplier_id: "",
    import_price: "",
    import_quantity: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoryRes, supplierRes] = await Promise.all([
          getCategory(),
          getSupplier(),
        ]);
        if (categoryRes?.data) setCategories(categoryRes.data);
        if (supplierRes?.data) setSuppliers(supplierRes.data);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu danh mục hoặc nhà cung cấp.",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = ({ file }) => {
    // Kiểm tra trạng thái của file
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: file.originFileObj, 
      }));
    }
  

  const validateForm = () => {
    const { name, price, import_price, import_quantity, category_id, supplier_id } = product;
    if (!name || !price || !import_price || !import_quantity || !category_id || !supplier_id) {
      notification.error({
        message: "Lỗi xác thực",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
      });
      return false;
    }
    if (isNaN(price) || isNaN(import_price) || isNaN(import_quantity)) {
      notification.error({
        message: "Lỗi xác thực",
        description: "Giá cả và số lượng phải là số hợp lệ.",
      });
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return; // Kiểm tra dữ liệu nhập hợp lệ
  
    setLoading(true);
    try {
      const importQuantity = parseInt(product.import_quantity);
  
      // Kiểm tra nếu ảnh tồn tại trong state
      if (!product.image) {
        notification.error({
          message: 'Lỗi',
          description: 'Vui lòng tải lên ảnh sản phẩm.',
        });
        return;
      }
  
      // Tạo FormData để gửi dữ liệu cùng ảnh
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('stock_quantity', importQuantity);
      formData.append('description', product.description);
      formData.append('category_id', product.category_id);
      formData.append('discount', product.discount);
      formData.append('image', product.image); // Gửi ảnh lên backend
      formData.append('supplier_id', product.supplier_id);
      formData.append('import_price', product.import_price);
      formData.append('import_quantity', product.import_quantity);
  
      // Gửi dữ liệu lên API tạo sản phẩm
      const productRes = await createProductAPI(formData);
  
      if (productRes?.data) {
        const createdProduct = productRes.data;
  
        const purchaseOrderRes = await createPurchaseOrderAPI({
          supplier_id: product.supplier_id,
          total_amount: product.import_price * importQuantity,
        });
  
        if (purchaseOrderRes?.data) {
          const purchaseOrderId = purchaseOrderRes.data;
  
          await createPurchaseOrderDetailAPI({
            purchaseOrder_id: purchaseOrderId.purchaseOrder_id,
            product_id: createdProduct.product_id,
            quantity: importQuantity,
            unit_cost: product.import_price,
            subtotal: product.import_price * importQuantity,
          });
  
          notification.success({
            message: 'Thành công',
            description: 'Sản phẩm và đơn hàng đã được tạo thành công!',
          });
  
          await createInventoryAPI({
            purchaseOrder_id: purchaseOrderId.purchaseOrder_id,
            product_id: createdProduct.product_id,
            quantity: importQuantity,
            remaining_stock: importQuantity,
          });
  
          resetAndCloseModal();
          fetchData();
        }
      }
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi tạo sản phẩm. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetAndCloseModal = () => {
    setModalOpen(true);
    setProduct({
      name: "",
      price: "",
      stock_quantity: "",
      description: "",
      category_id: "",
      discount: "",
      image: "null",
      supplier_id: "",
      import_price: "",
      import_quantity: "",
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "end", padding: "20px 10px" }}>
        <Button
          onClick={() => setModalOpen(true)}
          icon={<PlusOutlined />}
          style={{ background: "#5570F1", color: "#ffffff" }}
        >
          Tạo sản phẩm
        </Button>
      </div>
      <Modal
        title="Tạo sản phẩm mới"
        open={isModalOpen}
        onCancel={
                    () => resetAndCloseModal()
                }
        maskClosable={false}
        footer={[
          <Button key="cancel"
                            onClick={
                                () => setModalOpen(false)
                        }>
            Hủy
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={handleCreateProduct}
            loading={loading}
          >
            Tạo sản phẩm
          </Button>,
        ]}
      >
        <Select
          placeholder="Chọn nhà cung cấp"
          value={product.supplier_id}
          onChange={(value) => handleSelectChange("supplier_id", value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {suppliers.map((sup) => (
            <Select.Option key={sup.supplier_id} value={sup.supplier_id}>
              {sup.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Chọn danh mục sản phẩm"
          value={product.category_id}
          onChange={(value) => handleSelectChange("category_id", value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {categories.map((cat) => (
            <Select.Option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        <Input
          placeholder="Tên sản phẩm"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Giá nhập"
          name="import_price"
          type="number"
          value={product.import_price}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Giá bán"
          name="price"
          type="number"
          value={product.price}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Số lượng nhập"
          name="import_quantity"
          type="number"
          value={product.import_quantity}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Mã giảm giá"
          name="discount"
          value={product.discount}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Upload
          name="image"
          listType="picture"
          onChange={handleImageUpload}
        >
          <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
        </Upload>
        <TextArea
          placeholder="Mô tả sản phẩm"
          name="description"
          value={product.description}
          onChange={handleInputChange}
          rows={4}
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </div>
  );
};

export default ProductNew;
