import React, {useState, useEffect} from "react";
import {CSVLink, CSVDownload} from "react-csv";
import {
    Table,
    Tag,
    Space,
    Button,
    Input,
    message,
    Popconfirm,
    notification
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    FilterOutlined,
    ScheduleOutlined
} from "@ant-design/icons";
import {
    deleteOrderAPI,
    deleteOrderDetailsAPI,
    getAllProductsAPI,
    getCustomersAPI,
    getOrderDetailsByOrderIdAPI
} from "../../services/apiService";
import UpdateOrder from "./UpdateOrder";
import SearchData from "./SearchData";
import FillerData from "./FillerData";
import DateData from "./DateData";
import ShowDataItem from "./ShowDataItem";

const OrderData = (props) => {
    const {dataOrder, fetchData, rowSelection, loading} = props
    const [isModalUpdateOpen, setModalUpdateOpen] = useState(false)
    const [isModalShow, setModalShow] = useState(false)
    const [isDetailOpen, setDetailOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState(null)
    const [dataShow, setDataShow] = useState(null)
    const [dataDetail, setDataDetail] = useState(null)
    const [filteredData, setFilteredData] = useState(dataOrder);
    const [dateRange, setDateRange] = useState([]);
    const [dataExport, setDataExport] = useState([]);
    // useEffect(() => {
    //     console.log("Filtered Data Updated:", filteredData);
    // }, [filteredData]);
    useEffect(() => {
        if (dateRange.length > 0) {
            const filtered = dataOrder.filter((order) => {
                const orderDate = new Date(order.created_at);
                return(orderDate >= dateRange[0].toDate() && orderDate <= dateRange[1].toDate());
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(dataOrder);
        }
    }, [dataOrder, dateRange]);

    const handleSetDataFilter = async (filterCriteria) => {
        console.log("Filter criteria in OrderData:", filterCriteria[0]);
        const itemData = filterCriteria.map(item => item.customer_id);
        // console.log("itemData", itemData);

        const getData = await getCustomersAPI({customer_id: itemData});
        // console.log("itemData from API", getData.data);

        const customers = getData.data.map(item => ({customerName: item.name, customerPhone: item.phone, key: item.customer_id}));

        // console.log("Processed customer data:", customers);

        const filteredData = filterCriteria.map(order => {
            const customer = customers.find(cust => cust.key === order.customer_id);
            return {
                created_at: order.createdAt,
                customerName: customer ? customer.customerName : "",
                customerPhone: customer ? customer.customerPhone : "",
                key: order.order_id,
                paymentMethod: order.paymentMethod,
                status: order.status,
                total_amount: order.total_amount
            };
        });

        // console.log("Filtered data:", filteredData);
        setFilteredData(filteredData);
    };
    const getOrderExport = (event, done) => {
        let result = [];
        if (filteredData && filteredData.length > 0) {
            result.push([
                "Mã đơn hàng",
                "Tên khách hàng",
                "Số điện thoại",
                "Tổng tiền",
                "Ngày đặt",
                "Trạng thái",
                "Phương thức thành toán"
            ])
            filteredData.map((item, index) => {
                let arr = [];
                arr[0] = item.key;
                arr[1] = item.customerName;
                arr[2] = item.customerPhone;
                arr[3] = item.total_amount;
                arr[4] = item.created_at;
                arr[5] = item.status;
                arr[6] = item.paymentMethod;
                result.push(arr);
            })
            setDataExport(result);
            done()
        }
    }

    const handleDeleteOrder = async (key) => {
        const resDetails = await getOrderDetailsByOrderIdAPI(key);
        console.log(resDetails.data)
        const deleteDetailsPromises = resDetails.data.map((Item) => deleteOrderDetailsAPI(Item.orderItem_id));
        const deleteDetailsResults = await Promise.allSettled(deleteDetailsPromises);
        console.log(deleteDetailsResults)
        const res = await deleteOrderAPI(key)
        if (res.data) {
            notification.success({message: "Xóa đơn hàng", description: "Xóa thành công"})
            await fetchData()
        } else {
            notification.error({
                message: "Error delete User",
                description: JSON.stringify(res.message)
            })
        }
    }
    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "key",
            key: "key",
            sorter: (a, b) => a.key.localeCompare(b.key),
            defaultSortOrder: "descend"
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        },
        {
            title: "Số điện thoại",
            dataIndex: "customerPhone",
            key: "customerPhone"
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            key: "total_amount",
            sorter: (a, b) => a.total_amount - b.total_amount,
            render: (total) => `${
                total.toLocaleString()
            } ₫`
        }, {
            title: "Ngày đặt",
            dataIndex: "created_at",
            key: "created_at",
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (createdAt) => {
                const formattedDate = new Date(createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
                return formattedDate;
            }
        }, {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                {
                    text: "Đang xử lý",
                    value: "Đang xử lý"
                }, {
                    text: "Đã hoàn thành",
                    value: "Đã hoàn thành"
                }, {
                    text: "Đã hủy",
                    value: "Đã hủy"
                },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = "green";
                if (status === "Đã hủy") 
                    color = "red";
                


                if (status === "Đang xử lý") 
                    color = "orange";
                


                return <Tag color={color}>
                    {status}</Tag>;
            }
        }, {
            title: "Phương thức ",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            filters: [
                {
                    text: "Online",
                    value: "Online"
                }, {
                    text: "Offline",
                    value: "Offline"
                },
            ],
            onFilter: (value, record) => record.paymentMethod === value
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
                                const customerData = await getCustomersAPI(record.phone)
                                console.log(customerData)
                                const addressData = customerData.data.map(item => item);
                                console.log(addressData)
                                const address = []
                                for (const element of addressData) {
                                    if (record.customerPhone === element.phone) {
                                        address.push(element.address)
                                    }
                                }
                                console.log(address)

                                const res = await getOrderDetailsByOrderIdAPI(record.key);
                                if (res && res.data) {
                                    console.log('Chi tiết đơn hàng:', res.data);
                                    const ResData = res.data.map(item => item.product_id);
                                    const productDetails = [];

                                    for (const item of ResData) {
                                        const productData = await getAllProductsAPI({product_id: item});
                                        console.log(productData.data)
                                        for (const element of productData.data) {

                                            if (element) {
                                                productDetails.push({product_id: item, name: element.name, price: element.price});
                                            }
                                        }
                                    }

                                    // Cập nhật thông tin vào record
                                    const updatedRecord = {
                                        ...record,
                                        orderDetails: res.data,
                                        productDetails: productDetails,
                                        address: address
                                    };
                                    console.log(updatedRecord)
                                    setDataUpdate(updatedRecord);
                                    setModalUpdateOpen(true);
                                } else {
                                    message.error('Không thể tải chi tiết đơn hàng');
                                }
                            }
                        }
                        style={
                            {
                                cursor: "pointer",
                                color: "orange"
                            }
                        }/>
                    <Popconfirm title="Xóa đơn hàng " description="Bạn thưc sự muốn xóa đơn hàng này?"
                        onConfirm={
                            (e) => 
                            {
                                e.stopPropagation();
                                handleDeleteOrder(record.key)
                    
                            }
                        }
                        okText="Yes"
                        cancelText="No"
                        placement='left'
                 
                        >
                        <DeleteOutlined 
                        onClick={(e) => e.stopPropagation()} 
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
    const getDataItem = async (record) => {
        try {
            // Lấy thông tin khách hàng
            const customerData = await getCustomersAPI(record.phone);
            console.log('Customer Data:', customerData);
    
            const address = customerData.data.filter(item => item.phone === record.customerPhone).map(item => item.address);
            console.log('Address:', address);
    
            // Lấy chi tiết đơn hàng
            const res = await getOrderDetailsByOrderIdAPI(record.key);
            if (res && res.data) {
                console.log('Chi tiết đơn hàng:', res.data);
    
                // Lấy thông tin sản phẩm
                const productIds = res.data.map(item => item.product_id);
                const productDetails = [];
    
                // Lấy tất cả sản phẩm theo từng product_id
                const productDataPromises = productIds.map(product_id => getAllProductsAPI({ product_id }));
                const productDataResponses = await Promise.all(productDataPromises);
    
                // Tạo chi tiết sản phẩm
                productDataResponses.forEach(response => {
                    if (response?.data) {
                        response.data.forEach(element => {
                            if (element) {
                                productDetails.push({ product_id: element.product_id, name: element.name, price: element.price });
                            }
                        });
                    }
                });

                const updatedRecord = {
                    ...record,
                    orderDetails: res.data,
                    productDetails: productDetails,
                    address: address
                };
    
                // Set data và mở modal
                setDataShow(updatedRecord);
                setModalShow(true);
            }
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
                    fetchData={fetchData}></SearchData>
                <FillerData setDataFilter={handleSetDataFilter}></FillerData>
                <DateData setDateRange={setDateRange}
                    fetchData={fetchData}></DateData>
                <Button>
                    <CSVLink data ={dataExport}
                        asyncOnClick={true}
                        onClick
                        ={getOrderExport}
                        filename={"order.csv"}
                        className="btn btn-primary"
                        target="_blank">
                        <ExportOutlined/> &nbsp;
                          Xuất file
                    </CSVLink>
                </Button>

            </Space>
            <Table rowKey="key"
                columns={columns}
                dataSource={filteredData}
                rowSelection={rowSelection}
                fetchData={fetchData}
                loading={loading}
                onRow={
                    (record) => ({
                        onDoubleClick: () => {
                            getDataItem(record)
                        }
                    })
                }
                pagination={
                    {pageSize: 8}
                }/>
            <UpdateOrder isModalUpdateOpen={isModalUpdateOpen}
                setModalUpdateOpen={setModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchData={fetchData}></UpdateOrder>
            <ShowDataItem 
            isModalShow={isModalShow}
                setModalShow={setModalShow}
                dataShow={dataShow}
                setDataShow={setDataShow}
                fetchData={fetchData}/>
        </div>
    );
};

export default OrderData;
