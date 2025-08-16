import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(false);
    const [userLoginPage, setUserLoginPage] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [search, setSearch] = useState("");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [itemAmount, setItemAmount] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // const navigateWithLog = (...args) => {
    //     console.log("navigate called with:", args);
    //     navigate(...args);
    // };

    // fetch seller status

    const fetchSellerStatus = async () => {
        try {
            const {data} = await axios.get('/api/seller/checkAuth');
            if(data.success){
                setSeller(true);
            }else{
                // toast.error(data.msg);
                setSeller(false);
            }
        } catch (error) {
            toast.error(error.message);
            setSeller(false);
        }
    }


    // user logged in status

    const fetchUserStatus = async () => {
        try {
            const {data} = await axios.get('/api/user/checkAuth');
            if(data.success){
                setUser(data.user);
                setCart(data.user.cart);
            }else{
                // toast.error(data.msg)
            }
        } catch (error) {
            setUser(null);
            toast.error(error.message);
        }
    }

    // get cart count

    const getCartCount = () => {
        let count = 0;
        for(const item in cart) count += cart[item];
        return count;
    }

    // cart amount

    const getCartAmount = () => {
        let amount = 0;
        for(const item in cart){
            let itemInfo = products.find((product)=> product._id === item);
            if(!itemInfo) continue;
            amount+= (itemInfo.offerPrice * cart[item]);
        }
        return Math.floor(amount * 100) / 100;
    }

    // fetching products

    const fetchProducts = async ()=>{
        try {
            const {data} = await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products);
            }else{
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    
    useEffect(()=>{
        const loadData = async () => {
            await fetchProducts();
            await fetchUserStatus();
            fetchSellerStatus();
        }
        loadData();
    }, [])

    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', { cart })
                if (!data.success) {
                    toast.error(data.msg)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        let amt = getCartAmount();
        const updateDeliveryFee = () => {
            if (amt >= 100) return setDeliveryFee(0);
            else if (Object.keys(cart).length > 0) return setDeliveryFee(50);
            else return setDeliveryFee(0);
        }
        
        const updateItemAmount = () => {
            return setItemAmount(amt);
        }
        
        const updateTaxAmount = () => {
            return setTaxAmount(Number((amt*0.12).toFixed(2)));
        }
        
        if(user){
            updateCart(); updateDeliveryFee(); updateItemAmount(); updateTaxAmount();
        }
    }, [cart])

    useEffect(() => {
        setTotalAmount(deliveryFee + itemAmount + taxAmount);
    }, [deliveryFee, itemAmount, taxAmount])


    // adding to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cart);
        if(cartData[itemId]){
            cartData[itemId]+= 1;
            toast.success("Quantity Increased")
        }else{
            cartData[itemId] = 1;
            toast.success("Added to Cart")
        }
        setCart(cartData);
    }

    // update item quantity
    const updateCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cart);
        cartData[itemId] = quantity;
        setCart(cartData);
        toast.success("Item quantity updated")
    }

    // remove from cart
    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cart);
        if(cartData[itemId]){
            cartData[itemId]-= 1;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }
        }
        setCart(cartData);
        if(!cartData[itemId]) toast.success("Removed from Cart")
        else toast.success("Quantity reduced")
    }
    
    const value = {navigate, user, setUser, seller, setSeller, userLoginPage, setUserLoginPage,
        products, currency, addToCart, updateCartItem, removeFromCart, cart, search, setSearch,
        getCartCount, getCartAmount, fetchProducts, setCart, deliveryFee, itemAmount, taxAmount, totalAmount
};
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}

// can directly use this useAppContext and directly access the value in all the child components