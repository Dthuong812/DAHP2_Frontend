import React, {useEffect, useState} from 'react'
import Header from '../components/layout/Header'
import BoxOverview from '../components/layout/BoxOverview'
import DeletesCustomer from '../components/Customer/DeletesCustomer'
import {getAllProductsAPI, getCategory, getProductsAPI} from '../services/apiService'
import CategoryData from '../components/Category/CategoryData'
import CreateCategory from '../components/Category/CreateCategory'
import DeletesCategory from '../components/Category/DeletesCategory'

const Category = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try { 
            const [categoryResponse, productResponse] = await Promise.all([getCategory(), getAllProductsAPI(),]);

            const categories = categoryResponse.data;
            const products = productResponse.data;
            console.log(products)

            const combinedData = categories.map((category) => {
                const productCount = products.filter(product => product.category_id === category.category_id).length;
                console.log(productCount)
                return {key: category.category_id, categoryName: category.name, quality: productCount};
            });
            console.log(combinedData)
            setCategoryData(combinedData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };


    const applyFilter = (filterCriteria) => {
        const {minQuality, maxQuality} = filterCriteria;

        let filtered = [...categoryData];

        if (!minQuality && !maxQuality) {
            fetchData()
        } else {
            

            if (minQuality) {
                filtered = filtered.filter((categories) => categories.quality >= parseFloat(minQuality));
            }

            if (maxQuality) {
                filtered = filtered.filter((categories) => categories.quality <= parseFloat(maxQuality));
            }

        }
        setCategoryData(filtered);
        console.log("filtered", filtered)
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    return (
        <div className='menu_header'>
            <Header>Danh mục</Header>
            <div style={
                {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    marginRight: '30px'
                }
            }>
                <CreateCategory fetchData={fetchData}/>
                <DeletesCategory selectedRowKeys={selectedRowKeys}
                    fetchData={fetchData}/>
            </div>
            <CategoryData categoryData={categoryData}
                rowSelection={rowSelection}
                loading={loading}
                fetchData={fetchData}
                applyFilter={applyFilter}
            ></CategoryData>
        </div>
    )
}

export default Category
