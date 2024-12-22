import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { updateSupplier } from '../../services/apiService';

const UpdateSupplier =  ({
    isModalUpdateOpen,
    setModalUpdateOpen,
    dataUpdate,
    setDataUpdate,
    fetchData
  }) => {
    const [key, setKey] = useState("");
    const [phone, setPhone] = useState(""); 
    const [supplier, setSupplier] = useState("");
    const [location, setLocation] = useState("");
    useEffect(() => {
        if (dataUpdate && Array.isArray(dataUpdate) && dataUpdate.length > 0) {
        setKey(dataUpdate[0].supplier_id || ""); 
        setPhone(dataUpdate[0].phone || ""); 
        setSupplier(dataUpdate[0].name || ""); 
        setLocation(dataUpdate[0].location || ""); 
        }
    }, [dataUpdate]);
    
  
    const handleSubmit=async()=>{
      const updatedData = {
        supplier_id: String(key),
        phone: phone,
        name: supplier,
        location: location,
      };
      console.log(updatedData)
      await updateSupplier(updatedData);

      fetchData();  
      setModalUpdateOpen(false);
    }
    const resetAndCloseModal=()=>{
      setModalUpdateOpen(false);
    }
    return (
      <Modal
              title="Cập nhật thông tin khách hàng"
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
                  >
                      Cập nhật
                  </Button>
              ]}
          >
              <Input
                  placeholder="Mã khách hàng"
                  value={key}
                  onChange={e => setPhone(e.target.value)}
                  style={{ marginBottom: "10px" }}
                  disabled
              />
              <Input
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ marginBottom: "10px" }}
                  
              />
  
              <Input
                  placeholder="Tên khách hàng"
                  value={supplier}
                  onChange={e =>
                      setSupplier(e.target.value )
                  }
                  style={{ marginBottom: "10px" }}
                  
              />
  
              <Input
                  placeholder="Địa chỉ giao hàng"
                  value={location}
                  onChange={e =>
                      setLocation(e.target.value )
                  }
                  style={{ marginBottom: "10px" }}
                  
              />
      </Modal>
    )
  }
  

export default UpdateSupplier