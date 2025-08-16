import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/appContext'
import axios from 'axios';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const {seller, setSeller, navigate} = useAppContext()
    const [sellerEmail, setSellerEmail] = useState("");
    const [sellerPassword, setSellerPassword] = useState("");
    const [emailType, setEmailType] = useState("text");
    const [passwordType, setPasswordType] = useState("text");

    useEffect(()=>{
        if(seller){
            navigate("/seller");
        }
    }, [seller])

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const {data} = await axios.post('/api/seller/login', {sellerEmail, sellerPassword});

            if(data.success){
                setSeller(true);
                toast.success(data.msg);
                navigate('/seller')
            }else{
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
  return !seller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 
        rounded-lg shadow-xl border border-gray-200 '>
            <p className='text-2xl font-medium m-auto'><span className='text-primary'>Seller</span> Login</p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e) => setSellerEmail(e.target.value)} value={sellerEmail}
                type={emailType} onFocus={() => setEmailType("email")} placeholder='Enter your email' required
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'/>
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e) => setSellerPassword(e.target.value)} value={sellerPassword}
                 type={passwordType} onFocus={() => setPasswordType("password")} placeholder='Enter your password' required
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'/>
            </div>
            <button 
            // onClick={()=> setSeller(true)} 
            className='bg-primary text-white w-full py-2 rounded-md cursor-pointer
            hover:bg-primary-dull'>Login</button>
        </div>

    </form>
  )
}

export default SellerLogin
