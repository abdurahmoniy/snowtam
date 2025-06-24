import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ro'yxatdan o'tish sahifasi",
    description: "Bu ariza uchun ro'yxatdan o'tish sahifasi.",
};

const SignUpPage = () => {
    return (
        <>
            <div className="w-full md:w-1/2 mx-auto p-4 sm:p-12.5 xl:p-15">
                <Signup />
            </div>
        </>
    );
};

export default SignUpPage; 