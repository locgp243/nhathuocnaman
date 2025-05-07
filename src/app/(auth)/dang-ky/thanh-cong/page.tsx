import Link from "next/link"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đăng ký thành công!</h2>
          <p className="mt-2 text-sm text-gray-600">Cảm ơn bạn đã đăng ký tài khoản.</p>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <Link
              href="/auth/dang-nhap"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập ngay
            </Link>
          </div>
          <div>
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
