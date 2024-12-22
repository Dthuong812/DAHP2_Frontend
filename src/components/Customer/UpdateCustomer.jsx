import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { updateCustomerAPI } from '../../services/apiService';

const UpdateCustomer = ({
  isModalUpdateOpen,
  setModalUpdateOpen,
  dataUpdate,
  setDataUpdate,
  fetchData
}) => {
  const [key, setKey] = useState("");
  const [phone, setPhone] = useState(""); 
  const [customer, setCustomer] = useState({
      name: "",
      address: ""
  });
  useEffect(() => {
    if (dataUpdate) {
      setKey(dataUpdate[0].customer_id || ""); 
      setPhone(dataUpdate[0].phone || ""); 
      setCustomer({
        name: dataUpdate[0].name || "", 
        address: dataUpdate[0].address || "", 
      });
    }
  }, [dataUpdate]);

  const handleSubmit=async()=>{
    const updatedData = {
      customer_id: String(key),
      phone: phone,
      name: customer.name,
      address: customer.address,
    };
    await updateCustomerAPI(updatedData);
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
                value={customer.name}
                onChange={e =>
                    setCustomer({ ...customer, name: e.target.value })
                }
                style={{ marginBottom: "10px" }}
                
            />

            <Input
                placeholder="Địa chỉ giao hàng"
                value={customer.address}
                onChange={e =>
                    setCustomer({ ...customer, address: e.target.value })
                }
                style={{ marginBottom: "10px" }}
                
            />
    </Modal>
  )
}

export default UpdateCustomer