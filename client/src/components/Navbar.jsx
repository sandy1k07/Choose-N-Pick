import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/appContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    
    const { user, setUser, setUserLoginPage, navigate, cart, search, setSearch, 
        getCartCount
    } = useAppContext();
    const logout = async ()=>{
        try {
            
            const {data} = await axios.get('/api/user/logout');
            
            if(data.success){
                toast.success(data.msg);
            }else{
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error("error.message");
        }
        setUser(null);
        navigate('/');
    }

    useEffect(()=>{
        if(search.length > 0) navigate("/allproducts");
    }, [search]);
    
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className='h-20 w-auto' src={assets.logo} alt='logo' />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/allproducts'>Products</NavLink>
                <NavLink to='/'>Contact Us</NavLink>


                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearch(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Find products" />
                    <img src={assets.search_icon} alt='search' className='h-4 w-7' />
                </div>

                {/* {console.log(cart)} */}

                <div onClick = {() => navigate('/cart')} className="relative cursor-pointer
                transition-transform duration-300 ease-in-out hover:scale-105">
                    <img src={assets.nav_cart_icon} alt='cart' className='w-6 ' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                        {getCartCount()}     
                    </button>
                </div>

                {!user ? (<button onClick={()=> setUserLoginPage(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                </button>):(
                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt='profile-pic'/>
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white
                        shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={()=> navigate('my-orders')} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                            <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
            
            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick = {() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt='cart' className='w-6' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                        {getCartCount()}     
                    </button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt='menu' />
                </button>
            </div>
           

            {/* Mobile Menu */}
            {user && (<div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                
               
                <NavLink to='/' onClick={() => setOpen(false)}>Home</NavLink>
                
             
                <NavLink to='/allproducts' onClick={() => setOpen(false)}>Products</NavLink>
                
                
                {user && <NavLink to='/my-orders' onClick={() => setOpen(false)}>My Orders</NavLink>} 
                
             
                <NavLink to='/' onClick={() => setOpen(false)}>Contact Us</NavLink>

               
                {!user ? (
                    <button onClick = {()=>{
                        setOpen(false);
                        setUserLoginPage(true);
                    }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                        Login
                    </button>
                ) : (
                    <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                        Logout
                    </button>
                )}
            </div>)}

        </nav>
    )
}

export default Navbar;
