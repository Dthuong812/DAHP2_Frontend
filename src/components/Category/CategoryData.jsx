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
    deleteCategoryAPI,
    deleteCustomerAPI,
    deleteOrderAPI,
    deleteOrderDetailsAPI,
    getAllProductsAPI,
    getCategory,
    getCustomersAPI,
    getOrderAPI,
    getOrderDetailsByOrderIdAPI
} from "../../services/apiService";
import UpdateCategory from "./UpdateCategory";
import SearchData from "./SearchData";
import FilterCategory from "./FilterCategory";
import { CSVLink } from "react-csv";
import ShowCategory from "./ShowCategory";
const CategoryData = (props) => {
    const {
        categoryData,
        fetchData,
        rowSelection,
        applyFilter,
        loading
    } = props;
    const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [isModalShow, setModalShow] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [dataShow, setDataShow] = useState(null);
    const [filteredData, setFilteredData] = useState(categoryData);
    const [dataExport, setDataExport] = useState([]);
    useEffect(() => {
        console.log("Filtered Data Updated:", filteredData);
    }, [filteredData]);

    useEffect(() => {
        setFilteredData(categoryData);
    }, [categoryData]);

    const handleDeleteCategory= async (key) => {
        try {
            console.log("Deleting category with key:", key);

            // const resDetails = await getAllProductsAPI({category_id: key});
            // console.log("resDetails",resDetails)
            // if (resDetails.data && resDetails.data.length > 0) {
            //     const deleteDetailsPromises = resDetails.data.map((order) => deleteOrderDetailsAPI(order.orderItem_id));
            //     const deleteDetailsResults = await Promise.allSettled(deleteDetailsPromises);
            //     console.log("Delete order details results:", deleteDetailsResults);

            //     const deleteOrderPromises = resDetails.data.map((order) => deleteOrderAPI(order.order_id) // Xóa từng đơn hàng
            //     );
            //     const deleteOrderResults = await Promise.allSettled(deleteOrderPromises);
            //     console.log("Delete orders results:", deleteOrderResults);
            // }

            const res = await deleteCategoryAPI(key);
            console.log(res)
            if (res.data) {
                notification.success({message: "Xóa danh mục thành công", description: "danh mục và các đơn hàng đã được xóa"});
                await fetchData();
            } else {
                notification.error({
                    message: "Lỗi khi xóa danh mục",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            notification.error({message: "Xóa danh mục thất bại", description: error.message});
        }
    };

    const columns = [
        {
            title: "Mã danh mục",
            dataIndex: "key",
            key: "key",
            sorter: (a, b) => a.key.localeCompare(b.key),
            defaultSortOrder: "descend"
        },
        {
            title: "Tên danh mục",
            dataIndex: "categoryName",
            key: "categoryName",
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName)
        },
        {
            title: "Số lượng sản phẩm",
            dataIndex: "quality",
            key: "quality"
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
                                    const categoryData = await getCategory({category_id: record.key});

                                    if (categoryData && typeof categoryData === "object") {
                                        console.log("Dữ liệu khách hàng:", categoryData.data);

                                        setDataUpdate(categoryData.data);
                                        setModalUpdateOpen(true);
                                    } else {
                                        console.error("Dữ liệu không hợp lệ:", categoryData);
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
                                handleDeleteCategory(record.key)
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
    const getOrderExport = (event, done) => {
        let result = [];
        if (filteredData && filteredData.length > 0) {
            result.push([
                "Mã danh mục",
                "Tên danh mục",
            ])
            filteredData.map((item, index) => {
                let arr = [];
                arr[0] = item.key;
                arr[1] = item.categoryName;
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
                <FilterCategory setDataFilter={applyFilter}/>
                <Button>
                    <CSVLink data ={dataExport}
                        asyncOnClick={true}
                        onClick
                        ={getOrderExport}
                        filename={"category.csv"}
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
                <UpdateCategory isModalUpdateOpen={isModalUpdateOpen}
                setModalUpdateOpen={setModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                fetchData={fetchData}/>
                <ShowCategory isModalShow={isModalShow}
                setModalShow={setModalShow}
                dataShow={dataShow}
                setDataShow={setDataShow}
                fetchData={fetchData}/>
        </div>
    );
};

export default CategoryData;
