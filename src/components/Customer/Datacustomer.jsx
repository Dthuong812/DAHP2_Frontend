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
import {
    deleteCustomerAPI,
    deleteOrderAPI,
    deleteOrderDetailsAPI,
    getAllProductsAPI,
    getCustomersAPI,
    getOrderAPI,
    getOrderDetailsByOrderIdAPI
} from "../../services/apiService";
import UpdateCustomer from "./UpdateCustomer";
import ShowCustomer from "./ShowCustomer";
import SearchData from "./SearchData";
import FilterCustomer from "./FilterCustomer";
import { CSVLink } from "react-csv";

const Datacustomer = (props) => {
    const {
        dataCustomer,
        fetchData,
        rowSelection,
        applyFilter,
        loading
    } = props;
    const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [isModalShow, setModalShow] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [dataShow, setDataShow] = useState(null);
    const [filteredData, setFilteredData] = useState(dataCustomer);
    const [dataExport, setDataExport] = useState([]);
    useEffect(() => {
        console.log("Filtered Data Updated:", filteredData);
    }, [filteredData]);

    useEffect(() => {
        setFilteredData(dataCustomer);
    }, [dataCustomer]);

    const handleDeleteCustomer = async (key) => {
        try {
            console.log("Deleting customer with key:", key);

            const resDetails = await getOrderAPI({customer_id: key});
            if (resDetails.data && resDetails.data.length > 0) {
                const deleteDetailsPromises = resDetails.data.map((order) => deleteOrderDetailsAPI(order.orderItem_id));
                const deleteDetailsResults = await Promise.allSettled(deleteDetailsPromises);
                console.log("Delete order details results:", deleteDetailsResults);

                const deleteOrderPromises = resDetails.data.map((order) => deleteOrderAPI(order.order_id) // Xóa từng đơn hàng
                );
                const deleteOrderResults = await Promise.allSettled(deleteOrderPromises);
                console.log("Delete orders results:", deleteOrderResults);
            }

            const res = await deleteCustomerAPI(key);
            console.log(res)
            if (res.data) {
                notification.success({message: "Xóa khách hàng thành công", description: "Khách hàng và các đơn hàng đã được xóa"});
                await fetchData();
            } else {
                notification.error({
                    message: "Lỗi khi xóa khách hàng",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
            notification.error({message: "Xóa khách hàng thất bại", description: error.message});
        }
    };

    const columns = [
        {
            title: "Mã khách hàng",
            dataIndex: "key",
            key: "key",
            sorter: (a, b) => a.key.localeCompare(b.key),
            defaultSortOrder: "descend"
        },
        {
            title: "Tên khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            sorter: (a, b) => a.customerName.localeCompare(b.customerName)
        },
        {
            title: "Số điện thoại",
            dataIndex: "customerPhone",
            key: "customerPhone"
        },
        {
            title: "Địa chỉ",
            dataIndex: "customerAddress",
            key: "customerAddress"
        }, {
            title: "Tổng đơn hàng",
            dataIndex: "totalOrders",
            key: "totalOrders",
            sorter: (a, b) => a.totalOrders - b.totalOrders
        }, {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (total) => {
                const amount = total;
                return `${
                    amount.toLocaleString()
                } ₫`;
            }
        }, {
            title: 'Action',
            key: "action",
            render: (_, record) => (
                <div style={
                    {
                        display: "flex",
                        gap: "20px"
                    }
                }>
                    <EditOutlined onClick={
                            async (e) => {
                                e.stopPropagation();
                                try {
                                    const customerData = await getCustomersAPI({customer_id: record.key});

                                    if (customerData && typeof customerData === "object") {
                                        console.log("Dữ liệu khách hàng:", customerData.data);

                                        setDataUpdate(customerData.data);
                                        setModalUpdateOpen(true);
                                    } else {
                                        console.error("Dữ liệu không hợp lệ:", customerData);
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
                    <Popconfirm title="Xóa khách hàng" description="Bạn thực sự muốn xóa khách hàng này?"
                        onConfirm={
                            (e) => {
                                e.stopPropagation();
                                handleDeleteCustomer(record.key)
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
        },
    ];
    const getOrderExport = (event, done) => {
        let result = [];
        if (filteredData && filteredData.length > 0) {
            result.push([
                "Mã khách hàng",
                "Tên khách hàng",
                "Số điện thoại",
                "Địa chỉ",
                "Tổng đơn hàng",
                "Tổng tiền",
            ])
            filteredData.map((item, index) => {
                let arr = [];
                arr[0] = item.key;
                arr[1] = item.customerName;
                arr[2] = item.customerPhone;
                arr[3] = item.customerAddress;
                arr[4] = item.totalOrders;
                arr[5] = item.totalAmount;
                result.push(arr);
            })
            setDataExport(result);
            done()
        }
    }
    const getDataItem = async (record) => {
        try {
            const customerData = await getCustomersAPI(record.phone);
            console.log('Dữ liệu khách hàng:', customerData);

            const orderRes = await getOrderAPI({customer_id: record.key});
            const orderIds = orderRes.data.map(order => order.order_id);
            console.log('Danh sách Order IDs:', orderIds);

            let allOrderDetails = [];
            let allProductDetails = [];

            for (const orderId of orderIds) {
                const orderDetailsRes = await getOrderDetailsByOrderIdAPI(orderId);
                if (orderDetailsRes ?. data) {
                    allOrderDetails.push(... orderDetailsRes.data);
                    const productIds = orderDetailsRes.data.map(item => item.product_id);
                    const productDataPromises = productIds.map(product_id => getAllProductsAPI({product_id}));
                    const productDataResponses = await Promise.all(productDataPromises);

                    const productDetails = productDataResponses.flatMap(response => response ?. data ?. map(({product_id, name, price}) => ({product_id, name, price})) || []);

                    allProductDetails.push(... productDetails);
                }
            }

            const updatedRecord = {
                ...record,
                orderDetails: allOrderDetails,
                productDetails: allProductDetails
            };

            console.log("Dữ liệu cập nhật:", updatedRecord);

            setDataShow(updatedRecord);
            setModalShow(true);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };


    return (
        <div style={
            {
                padding: "30px",
                margin: "30px",
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
                <FilterCustomer setDataFilter={applyFilter}/>
                <Button>
                    <CSVLink data ={dataExport}
                        asyncOnClick={true}
                        onClick
                        ={getOrderExport}
                        filename={"customer.csv"}
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
            <UpdateCustomer isModalUpdateOpen={isModalUpdateOpen}
                setModalUpdateOpen={setModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchData={fetchData}/>
            <ShowCustomer isModalShow={isModalShow}
                setModalShow={setModalShow}
                dataShow={dataShow}
                setDataShow={setDataShow}
                fetchData={fetchData}/>
        </div>
    );
};

export default Datacustomer;
