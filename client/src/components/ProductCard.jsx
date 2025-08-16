import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/appContext";

const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, updateCartItem, navigate, cart} = useAppContext();


    return product && (
        <div onClick={()=> {
            navigate(`/allproducts/${product.category.toLowerCase()}/${product._id}`);
            scrollTo(0, 0);
            }} className="border border-primary rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.images[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-primary font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        (
                            <img key={i} className="md:w-3.5 w-3" src={ i<4 ? assets.star : assets.star_blank}/>
                        ) 
                    ))}
                    <p>(4)</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}{product.price}</span>
                    </p>

                    {/* ensures only this particula event listener is triggered and not of parent's */}
                    <div onClick={(e) => e.stopPropagation()} className="text-primary"> 
                        {/* {console.log(cart.length)} */}
                        {!cart[product._id] ? (
                            <button onClick={()=> addToCart(product._id)} className="flex items-center justify-center gap-1 bg-primary border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded text-white 
                            hover:bg-primary-dull cursor-pointer" >
                                <img src={assets.cart_icon} alt="cart_icon" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => removeFromCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cart[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;