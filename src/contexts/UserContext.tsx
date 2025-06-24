"use client";
import { getMe } from "@/services/auth.services";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../consts/authOptions";

interface UserContextType {
    user: any;
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    error: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const me = await getMe();
                setUser(me.data);

            } catch (err: any) {
                setUser(null);
                setError(err?.message || "Foydalanuvchi ma'lumotini olishda xatolik.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
