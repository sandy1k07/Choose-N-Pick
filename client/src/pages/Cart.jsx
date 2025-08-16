import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/appContext'
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const Cart = () => {
    const {cart, removeFromCart, products, currency, getCartCount, updateCartItem,
        navigate, getCartAmount, user, setCart, deliveryFee, itemAmount, taxAmount, totalAmount
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = React.useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [paymentResult, setPaymentResult] = useState(null);
    const API = import.meta.env.VITE_BACKEND_URL;
    

    const getAddresses = async () => {
        try {
            const {data} = await axios.get('/api/address/fetch');
            if(data.success){
                setAddresses(data.addresses);
                if(data.addresses.length > 0){
                    setSelectedAddress(data.addresses[0]);
                }
            }else{
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getCart = async () => {
        let tempArray = [];
        for(const id in cart){
            const product = await products.find((item) => item._id === id);
            product.quantity = cart[id];
            tempArray.push(product);
        }
        setCartArray(tempArray);
    }

    useEffect(()=>{
        if(products.length > 0 && cart) getCart();    
    }, [products, cart])



    useEffect(() => {
        if(user){
            getAddresses();
            getCart();
        }
    }, [user])

    const placeOrder = async () => {
        try {
            if(!selectedAddress){
                return toast.error("No address selected")
            }

            // COD
            if(paymentOption === 'COD'){
                try {
                    const { data } = await axios.post('/api/order/cod', {
                        items: cartArray.map((item) => ({
                            product: item._id,
                            quantity: item.quantity
                        })),
                        address: selectedAddress._id
                    })

                    if (data.success) {
                        toast.success(data.msg);
                        setCart({});
                        navigate('/my-orders')
                    }
                    else {
                        toast.error(data.msg);
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            }else{
                try {
                    const { data } = await axios.post('/api/order/online', {
                        items: cartArray.map((item) => ({
                            product: item._id,
                            quantity: item.quantity
                        })),
                        address: selectedAddress._id
                    })

                    if(data.success){
                        const orderInfo = data.order;
                        const { data: { order, orderData} } = await axios.post('/api/payment/checkout', { amount: totalAmount, orderInfo })
                        const { data: { key } } = await axios.get("/api/payment/key");



                        const options = {
                            key: key, // Enter the Key ID generated from the Dashboard
                            amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            currency: "INR",
                            name: "Choose-N-Pick",
                            description: "Test Transaction",
                            image: "https://example.com/your_logo",
                            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            handler: async (response) => {
                                try {
                                    const res = await fetch(`${API}/api/payment/verification`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        credentials: "include",
                                        body: JSON.stringify({...response, orderData})
                                    });
                                    const data = await res.json();
                                    if(data.success){
                                        toast.success(data.msg);
                                        setCart({});
                                        navigate('/my-orders');
                                    }else{
                                        toast.error(data.msg);
                                    }
                                } catch (error) {
                                    toast.error(error.message);
                                }
                            },
                            theme: {
                                color: "#094e89"
                            }
                        };
                        const razor = new window.Razorpay(options);
                        razor.open();
                    } else{
                        toast.error(data.msg);
                    }
                } catch (error) {
                    toast.error(error.message);
                }  
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    return products.length > 0 && cart ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}}`); scrollTo(0,0);}} 
                            className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.images[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={(e) => updateCartItem(product._id, Number(e.target.value))} 
                                        value={product.quantity} className='outline-none'>
                                            {Array(cart[product._id] > 9 ? cart[product_id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency} {product.offerPrice * product.quantity}</p>
                        <button onClick={()=>removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6'/>
                        </button>
                    </div>)
                )}

                <button onClick={()=> {navigate("/allproducts"); scrollTo(0, 0)}} 
                className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className='group:hover-translate-x-1 transition' src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, 
                        ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No Address Found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, index)=>(
                                    <p key={index} onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street}, {address.state}, {address.state}, {address.country}
                                </p>
                            ))}
                                <p onClick={() => navigate("/addresses/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onClick={(e) => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span >Price</span><span>{currency} {itemAmount}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-primary">
                        {cartArray.length > 0 ? ((deliveryFee === 0 ) ? "Free" : `${currency} ${deliveryFee}`) : ("NA")}
                            </span>
                    </p>
                    <p className="flex justify-between">
                        <span>GST (12%)</span><span>{currency} {taxAmount}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{currency} {totalAmount}</span>
                    </p>
                </div>

                <button onClick={() => placeOrder()} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed To Checkout"}
                </button>
            </div>
        </div>
    ) : (null)
}

export default Cart;