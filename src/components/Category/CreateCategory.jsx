import React, { useState } from "react";
import {
    Button,
    Input,
    Modal,
    notification
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createCategoryAPI } from "../../services/apiService"; // Add this import

const CreateCategory = (props) => {
    const { fetchData } = props;
    const [isModalOpen, setModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState(""); 

    const handleCreateCategory = async () => {
        if (!categoryName) {
            notification.error({ message: "Tên danh mục không được để trống" });
            return;
        }

        const newCategory = {
            name: categoryName,
        };

        try {
            await createCategoryAPI(newCategory);
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
        setCategoryName("");  
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
                    Tạo danh mục
                </Button>
            </div>
            <Modal
                title="Tạo danh mục mới"
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
                                !categoryName
                        }>Tạo danh mục</Button>,
                    ]
            }>
                <Input
                    placeholder="Tên danh mục"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />
            </Modal>
        </div>
    );
};

export default CreateCategory;
