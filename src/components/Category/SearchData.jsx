import { Input } from 'antd'
import React from 'react'
import { getAllProductsAPI, getSearchCategory } from '../../services/apiService';

const SearchData = (props) => {
    const { setSearchResults, fetchData } = props;

    const handleInputChange = async (e) => {
        const value = e.target.value.trim();
        if (!value) {
            fetchData(); 
            return;
        }

        try {
            const [categoryData] = await Promise.allSettled([
                getSearchCategory({ 
                    limit: 10, 
                    page: 1, 
                    name: value, 
                }),
            ]);
            if (categoryData.status === 'fulfilled' && categoryData.value?.data) {
                console.log('categoryData', categoryData.value.data);
                const results = await Promise.all(
                  categoryData.value.data.map(async (category) => {
                    const orderData = await getAllProductsAPI({ category_id: category.category_id });
                    const productCount = orderData.data?.length || 0;
                    return {
                      key: category.category_id,
                      categoryName: category.name,
                      quality: productCount,
                    };
                  })
                );
        
                setSearchResults(results);
            } else {
                setSearchResults([]); 
            }
        } catch (error) {
            console.error("Error during search:", error);
            notification.error({
                message: "Lỗi khi tìm kiếm",
                description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại.",
            });
        }
    };
  return (
    <Input
    placeholder="Tìm kiếm"
    onChange={handleInputChange}
    />
  )
}

export default SearchData