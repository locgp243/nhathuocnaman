import RegistrationForm from "@/components/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Đăng ký tài khoản</h2>
        <RegistrationForm />
      </div>
    </div>
  )
}
