"use client";
import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import { ROUTES } from "@/consts/routes";
import { SignUp } from "@/services/auth.services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import InputGroup from "../FormElements/InputGroup";

export default function Signup() {
    const router = useRouter();
    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.email || !data.password || !data.fullname) {
            setError("Iltimos, barcha maydonlarni to'ldiring.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const apires = await SignUp(data);
            console.log(apires)
            // check if api responds BAD_REQUEST or NOT_FOUND
            if (apires.status === 'BAD_REQUEST' || apires.status === 'NOT_FOUND') {
                toast.info(apires.message)
            } else if (apires.status === 'OK') {
                // On successful sign-up, redirect to the login page
                router.push(ROUTES.login);
            } else {
                toast.error(apires.message)
            }
        } catch (err: any) {
            setError("Ro'yxatdan o'tish muvaffaqiyatsiz tugadi. Iltimos, qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <InputGroup
                    type="text"
                    label="To'liq ism"
                    className="mb-4 [&_input]:py-[15px]"
                    placeholder="To'liq ismingizni kiriting"
                    name="fullname"
                    handleChange={handleChange}
                    value={data.fullname}
                    icon={<UserIcon />}
                />
                <InputGroup
                    type="email"
                    label="Elektron pochta"
                    className="mb-4 [&_input]:py-[15px]"
                    placeholder="Elektron pochtangizni kiriting"
                    name="email"
                    handleChange={handleChange}
                    value={data.email}
                    icon={<EmailIcon />}
                />
                <InputGroup
                    type="password"
                    label="Parol"
                    className="mb-5 [&_input]:py-[15px]"
                    placeholder="Parolingizni kiriting"
                    name="password"
                    handleChange={handleChange}
                    value={data.password}
                    icon={<PasswordIcon />}
                />
                <div className="mb-4.5">
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Ro'yxatdan o'tish
                        {loading && (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                        )}
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center">
                <p>
                    Hisobingiz bormi?{" "}
                    <Link href="/auth/sign-in" className="text-primary">
                        Kirish
                    </Link>
                </p>
            </div>
        </>
    );
} 