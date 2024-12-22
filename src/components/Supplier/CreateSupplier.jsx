import React, { useState } from "react";
import {
    Button,
    Input,
    Modal,
    notification
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createSupplierAPI } from "../../services/apiService";

const CreateSupplier =(props) => {
    const { fetchData } = props;
    const [isModalOpen, setModalOpen] = useState(false);
    const [supplierName, setSupplierName] = useState(""); 
    const [phone, setPhone] = useState(""); 
    const [location, setLocation] = useState(""); 

    const handleCreateCategory = async () => {
        if (!supplierName) {
            notification.error({ message: "Tên danh mục không được để trống" });
            return;
        }

        const newCategory = {
            name: supplierName,
            phone: phone,
            location: location,
        };

        try {
            await createSupplierAPI(newCategory);
            notification.success({
                message: "Tạo danh mục thành công",
                description: "Danh mục mới đã được tạo thành công.",
            });

            fetchData(); 
            resetAndCloseModal()   
        } catch (error) {
            notification.error({
                message: "Lỗi khi tạo danh mục",
                description: error.message,
            });
        }
    };

    const resetAndCloseModal = () => {
        setModalOpen(true);
        setSupplierName("");  
        setPhone("");  
        setLocation("");  
        setModalOpen(true); 
    };
    

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "end", padding: "20px 10px" }}>
                <Button
                    onClick={() => setModalOpen(true)}
                    icon={<PlusOutlined />}
                    style={{
                        background: "#5570F1",
                        color: "#ffffff",
                    }}
                >
                    Tạo nhà cung cấp
                </Button>
            </div>
            <Modal
                title="Tạo nhà cung cấp mới"
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
                            onClick={ handleCreateCategory}
                            disabled={
                                !supplierName
                        }>Tạo nhà cung cấp</Button>,
                    ]
            }>
                <Input
                    placeholder="Tên nhà cung cấp"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Địa chỉ"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />
            </Modal>
        </div>
    );
};

export default CreateSupplier