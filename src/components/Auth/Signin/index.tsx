import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <div className="flex min-h-[80vh] justify-center items-center">
      {/* <GoogleSigninButton text="Tizimga kirish" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Yoki elektron pochta orqali kirish
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div> */}

      <div className="flex flex-col w-full h-full">
        <SigninWithPassword />
      </div>

      {/* <div className="mt-6 text-center">
        <p>
          Hisobingiz yo&apos;qmi?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </p>
      </div> */}
    </div>
  );
}
