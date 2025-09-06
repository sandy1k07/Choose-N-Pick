import React, { useState } from 'react'
import { useAppContext } from '../../context/appContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const ProductList = () => {
  const { products, currency, fetchProducts } = useAppContext()

  const [showPopup, setShowPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newStock, setNewStock] = useState("")
  const [sellerProducts, setSellerProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      const {data} = await axios.get('/api/product/seller');
      if(data.success){
        setSellerProducts(data.products);
      }else{
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, [])

  const stockUpdate = async (prodId, stockCount) => {
    try {
      const { data } = await axios.post('/api/product/stock', { prodId, stockCount })
      if (data.success) {
        fetchAllProducts();
        fetchProducts();
        
        toast.success(data.msg)
        setShowPopup(false)
      } else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleOpenPopup = (product) => {
    setSelectedProduct(product)
    setNewStock(product.stockCount) 
    setShowPopup(true)
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate text-center">Product</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Category</th>
                <th className="px-4 py-3 font-semibold truncate text-center hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Stock Count</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {sellerProducts.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <img src={product.images[0]} alt="Product" className="w-16" />
                    </div>
                    <span className="truncate max-sm:hidden w-full">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-center">{product.category}</td>
                  <td className="px-4 py-3 text-center max-sm:hidden">{currency}{product.offerPrice}</td>
                  <td className="px-4 py-3 text-center">{product.stockCount}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenPopup(product)}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dull transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

          {/* Popup */}
          {showPopup && selectedProduct && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                      <h3 className="text-lg font-semibold mb-4">
                          Update Stock for {selectedProduct.name}
                      </h3>
                      <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-full border rounded px-3 py-2 mb-4"
                      />
                      <div className="flex justify-end gap-3">
                          <button
                              onClick={() => setShowPopup(false)}
                              className="px-3 py-1 border rounded hover:bg-gray-100"
                          >
                              Cancel
                          </button>
                          <button
                              onClick={() => stockUpdate(selectedProduct._id, Number(newStock))}
                              className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dull"
                          >
                              Update
                          </button>
                      </div>
                  </div>
              </div>
          )}

    </div>
  )
}

export default ProductList
