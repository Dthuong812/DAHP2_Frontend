import React, {useEffect, useState} from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Popconfirm,
    notification
} from "antd";
import {
    FilterOutlined,
    ScheduleOutlined,
    ExportOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { deleteSupplierAPI, getAllProductsAPI, getPurchaseOrder, getPurchaseOrderDetail, getSupplier } from "../../services/apiService";
import UpdateSupplier from "./UpdateSupplier";
import SearchData from "./SearchData";
import FilterSupplier from "./FilterSupplier";
import { CSVLink } from "react-csv";
import ShowSupplier from "./ShowSupplier";



const DataSupplier =(props) => {
    const {
        dataSupplier,
        fetchData,
        rowSelection,
        applyFilter,
        loading
    } = props;
    const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [isModalShow, setModalShow] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [dataShow, setDataShow] = useState(null);
    const [filteredData, setFilteredData] = useState(dataSupplier);
    const [dataExport, setDataExport] = useState([]);
    useEffect(() => {
        console.log("Filtered Data Updated:", filteredData);
    }, [filteredData]);

    useEffect(() => {
        setFilteredData(dataSupplier);
    }, [dataSupplier]);

    const  handleDeleteSupplier= async (key) => {
    try {
        console.log("Deleting category with key:", key);
        const res = await  deleteSupplierAPI(key);
        console.log(res)
        if (res.data) {
            notification.success({message: "Xóa nhà cung cấp thành công", description: "nhà cung cấp và các đơn hàng đã được xóa"});
            await fetchData();
        } else {
            notification.error({
                message: "Lỗi khi xóa nhà cung cấp",
                description: JSON.stringify(res.message)
            });
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        notification.error({message: "Xóa nhà cung cấp thất bại", description: error.message});
    }
    };

    const columns = [
        {
            title: "Mã nhà cung cấp",
            dataIndex: "key",
            key: "key",
            sorter: (a, b) => a.key.localeCompare(b.key),
            defaultSortOrder: "descend"
        },
        {
            title: "Tên danh mục",
            dataIndex: "supplierName",
            key: "supplierName",
            sorter: (a, b) => a.supplierName.localeCompare(b.supplierName)
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: "Địa chỉ",
            dataIndex: "location",
            key: "location"
        },
        {
            title: "Số sản phẩm",
            dataIndex: "quality",
            key: "quality"
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice"
        },
        {
            title: 'Hành động',
            key: "action",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <EditOutlined onClick={
                            async (e) => {
                                e.stopPropagation();
                                try {
                                    console.log(record.key)
                                    const supplierData = await getSupplier({supplier_id: record.key});
                                    console.log(supplierData.data)
                                    if ( supplierData && typeof  supplierData === "object") {
                                        console.log("Dữ liệu khách hàng:",  supplierData.data);

                                        setDataUpdate(supplierData.data);
                                        setModalUpdateOpen(true);
                                    } else {
                                        console.error("Dữ liệu không hợp lệ:",  supplierData);
                                    }
                                } catch (error) {
                                    console.error("Lỗi khi gọi API:", error);
                                }
                            }
                        }
                        style={
                            {
                                cursor: "pointer",
                                color: "orange"
                            }
                        }/>
                    <Popconfirm title="Xóa danh mục" description="Bạn thực sự muốn xóa danh mục này?"
                        onConfirm={
                            (e) => {
                                e.stopPropagation();
                                handleDeleteSupplier(record.key)
                            }
                        }
                        okText="Yes"
                        cancelText="No"
                        placement='left'>
                        <DeleteOutlined onClick={
                                (e) => e.stopPropagation()
                            }
                            style={
                                {
                                    cursor: "pointer",
                                    color: "red"
                                }
                            }/>
                    </Popconfirm>
                </div>
            )
        }
    ];
    const getDataItem = async (record) => {
        try {
            const supplierData = await getPurchaseOrder({ supplier_id: record.key });
            console.log("Dữ liệu nhà cung cấp:", supplierData);
    
            const purchaseOrderIds = supplierData.data.map(order => order.purchaseOrder_id);
            console.log("Danh sách mã PurchaseOrder:", purchaseOrderIds);
    
            let allOrderDetails = [];
    
            for (const purchaseOrderId of purchaseOrderIds) {
                const purchaseDetailsRes = await getPurchaseOrderDetail({ purchaseOrder_id: purchaseOrderId });
    
                if (purchaseDetailsRes?.data) {
                    allOrderDetails.push(...purchaseDetailsRes.data);
                }
            }

            const uniqueProductIds = [...new Set(allOrderDetails.map(detail => detail.product_id))];
            console.log("Danh sách product_id duy nhất:", uniqueProductIds);
    
    
            const productDataResponses = await getAllProductsAPI({ product_ids: uniqueProductIds });
            const allProductDetails = productDataResponses?.data?.map(({ product_id, name }) => ({
                product_id,
                name,
            })) || [];
    
            console.log("Chi tiết sản phẩm:", allProductDetails);
 
            const updatedRecord = {
                ...record,
                productDetails: allProductDetails,
            };
    
            console.log("Dữ liệu cập nhật:", updatedRecord);
    
            setDataShow(updatedRecord);
            setModalShow(true);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            notification.error({
                message: "Lỗi khi lấy dữ liệu",
                description: error.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định.",
            });
        }
    };
    const getOrderExport = (event, done) => {
        let result = [];
        if (filteredData && filteredData.length > 0) {
            result.push([
                "Mã nhà cung cấp",
                "Tên nhà cung cấp",
                "Số điện thoại",
                "Địa chỉ",
            ])
            filteredData.map((item, index) => {
                let arr = [];
                arr[0] = item.key;
                arr[1] = item.supplierName;
                arr[2] = item.phone;
                arr[3] = item.location;
                result.push(arr);
            })
            setDataExport(result);
            done()
        }
    }
    

    return (
        <div style={
            {
                padding: "30px",
                margin: "0 30px 30px 30px",
                background: "white",
                borderRadius: "20px"
            }
        }>
         <Space style={
                {
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                    marginBottom: "20px"
                }
            }>
                <SearchData setSearchResults={setFilteredData}
                    fetchData={fetchData}/>
                <FilterSupplier setDataFilter={applyFilter}/>
                <Button>
                    <CSVLink data ={dataExport}
                        asyncOnClick={true}
                        onClick
                        ={getOrderExport}
                        filename={"supplier.csv"}
                        className="btn btn-primary"
                        target="_blank">
                        <ExportOutlined/> &nbsp;
                          Xuất file
                    </CSVLink>
                </Button>
            </Space>
            <Table columns={columns}
                dataSource={filteredData}
                rowSelection={rowSelection}
                onRow={
                    (record) => ({
                        onDoubleClick: () => {
                            getDataItem(record)
                        }
                    })
                }
                pagination={
                    {pageSize: 8}
                }
                bordered/>
                 <UpdateSupplier isModalUpdateOpen={isModalUpdateOpen}
                setModalUpdateOpen={setModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchData={fetchData}/>
                <ShowSupplier isModalShow={isModalShow}
                setModalShow={setModalShow}
                dataShow={dataShow}
                setDataShow={setDataShow}
                fetchData={fetchData}/>
        </div>
    );
};


export default DataSupplier