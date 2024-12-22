import { Button, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { updateCategoryAPI } from '../../services/apiService';

const UpdateCategory = ({ 
    isModalUpdateOpen, 
    setModalUpdateOpen, 
    dataUpdate, 
    setDataUpdate, 
    fetchData 
}) => {
    const [key, setKey] = useState("");
    const [categoryName, setCategoryName] = useState(""); 

    useEffect(() => {
        if (dataUpdate && Array.isArray(dataUpdate) && dataUpdate.length > 0) {
            setKey(dataUpdate[0].category_id || ""); 
            setCategoryName(dataUpdate[0].name || ""); 
        }
    }, [dataUpdate]);

    const handleSubmit = async () => {
        const updatedData = {
            category_id: String(key),
            name: categoryName,
        };

        console.log("updatedData", updatedData);
        
        try {
            await updateCategoryAPI(updatedData);
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Danh mục đã được cập nhật thành công.',
            });
            fetchData();
            setModalUpdateOpen(false);
        } catch (error) {
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Đã xảy ra lỗi khi cập nhật danh mục.',
            });
        }
    };

    const resetAndCloseModal = () => {
        setCategoryName("");  
        setKey("");           
        setModalUpdateOpen(false);
    };

    return (
        <Modal
            title="Cập nhật danh mục"
            open={isModalUpdateOpen}
            onOk={handleSubmit}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            width={800}
            footer={[
                <Button key="cancel" onClick={resetAndCloseModal}>
                    Hủy
                </Button>,
                <Button
                    key="update"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!categoryName} 
                >
                    Cập nhật
                </Button>
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
                onChange={e => setCategoryName(e.target.value)}
                style={{ marginBottom: "10px" }}
            />
        </Modal>
    );
};

export default UpdateCategory;
