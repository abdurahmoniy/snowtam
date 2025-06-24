import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tizimga kirish",
};

export default function SignIn() {
    return (
        <>
            {/* <Breadcrumb pageName="Tizimga kirish" /> */}


            <div className="w-full md:w-1/2 mx-auto p-4 sm:p-12.5 xl:p-15">
                <Signin />
            </div>

        </>
    );
} 