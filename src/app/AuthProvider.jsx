"use client"
import axios from "axios";
import { createContext , useContext, useEffect, useState } from "react";

const AuthContext = createContext(null)

export default function AuthProvider({children}){
    const [user , setuser] = useState(null)
    const [cart , setcart] = useState([])
    const [count , setcount] = useState(0)

    useEffect(() => {
        const fetchdata = async() => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/authprovider` , {
                    withCredentials:true
                })
                setuser(res.data.user)
                console.log(res.data.user)
                
            } catch (error) {
                console.log(error.response?.data?.message || "errror")
                
            }
        }
        fetchdata()
    } , [])

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/getAllCart`, {
                    withCredentials: true
                });
                setcount(res.data.data.length);
            } catch (error) {
                console.log("Error fetching cart count:", error.response?.data?.message);
            }
        };
        fetchCart();
    }, [user]);

    return(
        <AuthContext.Provider value={{user,setuser , cart , setcart , count , setcount}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)