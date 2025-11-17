import React, { createContext, useContext, useEffect, useState } from 'react'
import axios, { SERVER_URL } from '@/axios';
import { usePathname, useRouter } from 'next/navigation';

export const UserContext = createContext({});

export const useUserStore = () => useContext(UserContext);

const UserStore = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();

    const getUser = async () => {
        try {
            const response = await axios.get("/auth/admin/me");
            setUser(response.data.data || response.data);
        } catch (error) {
            if (pathname != "/signin") {
                router.push("/signin");
            }
            setUser(null);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
    }

    useEffect(() => {
        if (!user) {
            setLoading(true);
            getUser();
        }
    }, [user]);

    const value = {
        user,
        setUser
    }

    if (loading) {
        return <div className='flex items-center w-screen h-screen justify-center'>
            <h1 className='text-2xl font-bold'>GustoApp Admin Panel</h1>
        </div>;
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserStore