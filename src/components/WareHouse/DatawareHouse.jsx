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
    deleteInventoryAPI,
    deleteOrderAPI,
    deleteOrderDetailsAPI,
    deleteProductAPI,
    deletePurchaseOrderAPI,
    deletePurchaseOrderDetailAPI,
    getAllProductsAPI,
    getCustomersAPI,
    getInventory,
    getOrderDetailsByOrderIdAPI,
    getPurchaseOrder,
    getPurchaseOrderDetail
} from "../../services/apiService";
import SearchData from "./SearchData";
import FilterData from "./FilterData";
import UpdateProduct from "./UpdateProduct";
import ShowDataItem from "./ShowDataItem";
const DatawareHouse = (props) => {
    const {
        dataProduct,
        fetchData,
        rowSelection,
        loading,
        applyFilter
    } = props
    const [isModalUpdateOpen, setModalUpdateOpen] = useState(false)
    const [isModalShow, setModalShow] = useState(false)
    const [isDetailOpen, setDetailOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState(null)
    const [dataShow, setDataShow] = useState(null)
    const [dataDetail, setDataDetail] = useState(null)
    const [filteredData, setFilteredData] = useState(dataProduct);
    const [dateRange, setDateRange] = useState([]);
    const [dataExport, setDataExport] = useState([]);
    useEffect(() => {
        setFilteredData(dataProduct);
    }, [dataProduct]);
    const handleDeleteProduct = async (productId) => {
        try {
            console.log("Xóa sản phẩm với ID:", productId);

            const deleteProductRes = await deleteProductAPI(productId);
            console.log("Kết quả xóa sản phẩm:", deleteProductRes);


            const inventoryData = await getInventory({product_id: productId});
            console.log("inventoryData ", inventoryData)
            const deleteInventory = await deleteInventoryAPI(inventoryData.data[0].inventory_id)

            const detailData = await getPurchaseOrderDetail({product_id: productId});
            console.log("detailData", detailData)
            const deleteDetailRes = await deletePurchaseOrderDetailAPI(detailData.data[0].purchaseOrderDetail_id);
            console.log("Kết quả xóa chi tiết đơn hàng:", deleteDetailRes);


            const purchaseOrderData = await getPurchaseOrder({purchaseOrder_id: detailData.data[0].purchaseOrder_id});
            console.log("purchaseOrderData", purchaseOrderData)
            const deletePurchaseOrderRes = await deletePurchaseOrderAPI(purchaseOrderData.data[0].purchaseOrder_id);
            console.log("Kết quả xóa đơn hàng:", deletePurchaseOrderRes)


            notification.success({message: "Xóa sản phẩm", description: "Xóa thành công sản phẩm và dữ liệu liên quan."});


            await fetchData();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            notification.error({
                message: "Lỗi xóa sản phẩm",
                description: error.message || "Đã xảy ra lỗi khi xóa sản phẩm hoặc dữ liệu liên quan."
            });
        }
    };

    const getOrderExport = (event, done) => {
        let result = [];
        if (filteredData && filteredData.length > 0) {
            result.push([
                "Mã sản phẩm ",
                "Hình ảnh",
                "Tên sản phẩm",
                "Danh mục",
                "Giá nhập",
                "Giá bán",
                "Số lượng",
                "Trạng thái",
            ])
            filteredData.map((item, index) => {
                let arr = [];
                arr[0] = item.key;
                arr[1] = `http://localhost:8080/v1/product/images/${
                    item.image
                }`;
                arr[2] = item.productName;
                arr[3] = item.category;
                arr[4] = item.pricePrev;
                arr[5] = item.priceNext;
                arr[6] = item.quality;
                arr[7] = item.status;
                result.push(arr);
            })
            setDataExport(result);
            done()
        }
    }
    const columns = [
        {
            title: "Mã sản phẩm",
            dataIndex: "key",
            key: "key",
            sorter: (a, b) => a.key.localeCompare(b.key)
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <img src={
                        `http://localhost:8080/v1/product/images/${image}`
                    }
                    alt="product"
                    style={
                        {
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover'
                        }
                    }/>
            )
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "productName",
            key: "productName",
            sorter: (a, b) => a.productName.localeCompare(b.productName)
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category"
        }, {
            title: "Giá nhập",
            dataIndex: "pricePrev",
            key: "pricePrev",
            sorter: (a, b) => (a.pricePrev || 0) - (b.pricePrev || 0),
            render: (total) => {
                const amount = total || 0;
                return `${
                    amount.toLocaleString()
                } ₫`;
            }
        }, {
            title: "Giá bán",
            dataIndex: "priceNext",
            key: "priceNext",
            sorter: (a, b) => a.priceNext - b.priceNext,
            render: (total) => {
                const amount = total;
                return `${
                    amount.toLocaleString()
                } ₫`;
            }
        }, {
            title: "Số lượng",
            dataIndex: "quality",
            key: "quality",
            sorter: (a, b) => a.quality - b.quality
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
                                    const productRes = await getAllProductsAPI({product_id: record.key});
                                    const productData = productRes.data;


                                    const purchaseDetailRes = await getPurchaseOrderDetail({product_id: record.key});
                                    const purchaseDetails = purchaseDetailRes.data;


                                    const inventoryRes = await getInventory({product_id: record.key});
                                    const inventoryData = inventoryRes.data;


                                    const updatedRecord = {
                                        ...record,
                                        productDetails: productData,
                                        purchaseDetails: purchaseDetails[0],
                                        inventory: inventoryData[0]
                                    };

                                    console.log("Thông tin cập nhật:", updatedRecord);
                                    setDataUpdate(updatedRecord);
                                    setModalUpdateOpen(true);
                                } catch (error) {
                                    console.error("Lỗi khi lấy thông tin chi tiết:", error);
                                    message.error("Không thể tải chi tiết sản phẩm và dữ liệu liên quan");
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
                            (e) => {
                                e.stopPropagation();
                                handleDeleteProduct(record.key)

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
    const getDataItem = async (record) => {
        try {
            const productRes = await getAllProductsAPI({product_id: record.key});
            const productData = productRes.data;


            const purchaseDetailRes = await getPurchaseOrderDetail({product_id: record.key});
            const purchaseDetails = purchaseDetailRes.data;


            const inventoryRes = await getInventory({product_id: record.key});
            const inventoryData = inventoryRes.data;


            const updatedRecord = {
                ...record,
                productDetails: productData,
                purchaseDetails: purchaseDetails[0],
                inventory: inventoryData[0]
            };

            console.log("Thông tin cập nhật:", updatedRecord);
            setDataShow(updatedRecord);
            setModalShow(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết:", error);
            message.error("Không thể tải chi tiết sản phẩm và dữ liệu liên quan");
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
                    fetchData={fetchData}></SearchData>
                <FilterData setDataFilter={applyFilter}/>
                <Button>
                    <CSVLink data ={dataExport}
                        asyncOnClick={true}
                        onClick
                        ={getOrderExport}
                        filename={"product.csv"}
                        className="btn btn-primary"
                        target="_blank">
                        <ExportOutlined/>
                        &nbsp;
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
                    {pageSize: 10}
                }/>
            <UpdateProduct isModalUpdateOpen={isModalUpdateOpen}
                setModalUpdateOpen={setModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchData={fetchData}></UpdateProduct>
            <ShowDataItem isModalShow={isModalShow}
                setModalShow={setModalShow}
                dataShow={dataShow}
                setDataShow={setDataShow}
                fetchData={fetchData}/>
        </div>
    );
};

export default DatawareHouse
