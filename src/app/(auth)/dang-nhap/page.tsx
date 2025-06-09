import { LoginForm } from "@/components/FormLogin"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-5xl mb-5">Đăng nhập</h1>
        <p className="text-center mb-5">Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.</p>
        <LoginForm />
        <p className="text-center mt-4 text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
