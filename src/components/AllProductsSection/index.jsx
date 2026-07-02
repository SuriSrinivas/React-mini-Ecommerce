import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'

import ProductsHeader from '../ProductsHeader'
import ProductCard from '../ProductCard'

import './index.css'

const sortByOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const AllProductsSection = () => {
  const [activeOptionId, setActiveOptionId] = useState(
    sortByOptions[0].optionId,
  )

  const [productsList, setProductsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getProducts = async () => {
    setIsLoading(true)

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const formattedData = fetchedData.products.map(product => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        imageUrl: product.image_url,
        rating: product.rating,
      }))

      setProductsList(formattedData)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getProducts()
  }, [activeOptionId])

  const updateActiveOptionId = id => {
    setActiveOptionId(id)
  }

  const renderProductsList = () => (
    <>
      <ProductsHeader
        sortbyOptions={sortByOptions}
        activeOptionId={activeOptionId}
        updateActiveOptionId={updateActiveOptionId}
      />

      <ul className="products-list">
        {productsList.map(product => (
          <ProductCard key={product.id} productData={product} />
        ))}
      </ul>
    </>
  )

  const renderLoader = () => (
    <div className="loading-container" data-testid="loader">
      <BeatLoader color="#0b69ff" />
    </div>
  )

  return isLoading ? renderLoader() : renderProductsList()
}

export default AllProductsSection
