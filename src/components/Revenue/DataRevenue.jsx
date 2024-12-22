import React, { useState } from "react";
import { Table, Tag, Space, Button, Input } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, ScheduleOutlined, ExportOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const { Search } = Input;

const columns = [
  {
    title: "Sản phẩm",
    dataIndex: "productName",
    key: "productName",
    sorter: (a, b) => a.productName.localeCompare(b.productName),
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
    filters: [
      { text: "Gadgets", value: "Gadgets" },
      { text: "Fashion", value: "Fashion" },
    ],
    onFilter: (value, record) => record.category.includes(value),
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price - b.price,
    render: (price) => `${price.toLocaleString()} ₫`,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "Giảm giá",
    dataIndex: "discount",
    key: "discount",
    render: (discount) => `${discount.toLocaleString()} ₫`,
  },
  {
    title: "Tổng tiền",
    key: "total",
    render: (_, record) => {
      const total = (record.price - record.discount) * record.quantity;
      return `${total.toLocaleString()} ₫`;
    },
  },
  {
    title: "Ngày",
    dataIndex: "entryDate",
    key: "entryDate",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Nhập kho", value: "Nhập kho" },
      { text: "Đã bán", value: "Đã bán" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => {
      let color = status === "Nhập kho" ? "blue" : "orange";
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          type="primary"
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
          danger
        />
      </Space>
    ),
  },
];

const initialData = [
  {
    key: 1,
    productName: "iPhone 13 Pro",
    category: "Gadgets",
    price: 1225000,
    quantity: 8,
    discount: 0,
    entryDate: "17/11/2024 - 12:25 am",
    status: "Nhập kho",
  },
  {
    key: 2,
    productName: "iPhone 12 Pro",
    category: "Gadgets",
    price: 725000,
    quantity: 12,
    discount: 0,
    entryDate: "17/11/2024 - 12:25 am",
    status: "Đã bán",
  },
  {
    key: 3,
    productName: "Polo T-Shirt",
    category: "Fashion",
    price: 125000,
    quantity: 120,
    discount: 0,
    entryDate: "17/11/2024 - 12:25 am",
    status: "Nhập kho",
  },
];
const DataRevenue = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const [data, setData] = useState(initialData);

    // Tìm kiếm
    const onSearch = (value) => {
      const filteredData = initialData.filter((item) =>
        Object.values(item).some((field) =>
          String(field).toLowerCase().includes(value.toLowerCase())
        )
      );
      setData(filteredData);
    };
  
    // Xử lý chỉnh sửa
    const handleEdit = (record) => {
      console.log("Edit product:", record);
    };
  
    // Xử lý xóa
    const handleDelete = (record) => {
      setData(data.filter((item) => item.key !== record.key));
    };
  
    // Xuất file Excel
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, "product_data.xlsx");
    };
  
    return (
        <div style={{ padding: "30px" ,
        margin:"30px",
        background :"white",
        borderRadius:"20px"}}>
            <Space style={
                {
                marginBottom: "20px",
                display: "flex",
                alignItems:"end",
                justifyContent:"end"}
            }>
                <Input placeholder="Tìm kiếm"></Input>
                <Button ><FilterOutlined /> Lọc</Button>
                <Button ><ScheduleOutlined />Date</Button>
                <Button >Xuất file<ExportOutlined /></Button>
            </Space>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          rowSelection={rowSelection}
          bordered
        />
      </div>
    );
}

export default DataRevenue