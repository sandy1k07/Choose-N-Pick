import React from 'react'
import { useAppContext } from '../context/appContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
    const {setUserLoginPage, setUser, user, navigate, setCart} = useAppContext();

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const {data} = await axios.post(`/api/user/${state}`, {
                name, email, password
            });

            if(data.success){
                toast.success(data.msg);
                setUser(data.user);
                try {
                    const {data} = await axios.get('/api/cart');
                    if(data.success){
                        setCart(data.cart);
                    }else{
                        toast.error(data.msg)
                    }
                } catch (error) {
                    toast.error(error.message)
                }
                navigate('/');
                setUserLoginPage(false);
            }else{
                toast.error(data.msg);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }
    
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emailType, setEmailType] = useState("text");
    const [passwordType, setPasswordType] = useState("text");


  return (
      <div onClick={()=> {setUserLoginPage(false)}} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600
      bg-black/50'>
          <form onSubmit={onSubmitHandler} onClick={(e)=> e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
              <p className="text-2xl font-medium m-auto text-primary">
                  {state === "login" ? "Login" : "Sign Up"}
              </p>
              {state === "register" && (
                  <div className="w-full">
                      <p>Name</p>
                      <input 
                      onChange={(e) => setName(e.target.value)} value={name} placeholder="Your Name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                  </div>
              )}
              <div className="w-full ">
                  <p>Email</p>
                  <input name='user-email'
                  onChange={(e) => setEmail(e.target.value)} value={email} placeholder="abc@example.com" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type={emailType} required 
                  onFocus={() => setEmailType("email")} />
              </div>
              <div className="w-full ">
                  <p>Password</p>
                  <input name='user-password'
                  onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter a strong passowrd" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type={passwordType} required 
                  onFocus={() => setPasswordType("password")} />
              </div>
              {state === "register" ? (
                  <p>
                      Already have an account? <span onClick={() => setState("login")} className="text-primary cursor-pointer hover:text-primary-dull">LOGIN</span>
                  </p>
              ) : (
                  <p>Not yet Registered? <span onClick={() => setState("register")} className="text-primary cursor-pointer hover:text-primary-dull">REGISTER</span>
                  </p>
              )}
              <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                  {state === "register" ? "Create Account" : "Login"}
              </button>
          </form>
      </div>
  )
}

export default Login
