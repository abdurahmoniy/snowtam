"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { Login } from "@/services/auth.services";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Call backend login API
      const apires = await Login({ email: data.email, password: data.password });

      // check if api responds BAD_REQUEST or NOT_FOUND
      if (apires.status === 'NOT_FOUND' || apires.status === 'BAD_REQUEST') {
        toast.info(apires.message);
        return;
      } else if (apires.status === 'OK') {
        // Now sign in with next-auth credentials provider
        const res = await signIn("credentials", {
          redirect: true,
          accessToken: apires.data,
          email: apires.meta.user.email,
          fullname: apires.meta.user.fullname,
          status: apires.meta.user.status,
          role: JSON.stringify(apires.meta.user.role), // ["ADMIN", "USER"]
          callbackUrl: "/dashboard",
        });


        if (res?.error) {
          setError(res.error);
        }
      } else {
        toast.error(apires.message)
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Meni eslab qol"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Parolni unutdingizmi?
        </Link>
      </div>

      <div className="mb-4.5">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Tizimga kirish
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
