"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"

export default function RegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    newsletter: false,
    termsAgreed: false,
    isStudent: false,
  })

  const [errors, setErrors] = useState({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
    termsAgreed: false,
  })

  const [touched, setTouched] = useState({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
    termsAgreed: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Validate on change
    if (touched[name as keyof typeof touched]) {
      validateField(name, type === "checkbox" ? checked : value)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setTouched({
      ...touched,
      [name]: true,
    })
    validateField(name, type === "checkbox" ? checked : value)
  }

  const validateField = (name: string, value: string | boolean) => {
    const newErrors = { ...errors }

    switch (name) {
      case "fullName":
        newErrors.fullName = value === ""
        break
      case "phoneNumber":
        newErrors.phoneNumber = value === "" || !/^[0-9]{10}$/.test(value as string)
        break
      case "email":
        if (value === "") {
          newErrors.email = false // Email is optional
        } else {
          newErrors.email = !/\S+@\S+\.\S+/.test(value as string)
        }
        break
      case "password":
        newErrors.password = value === "" || !/((?=.*\d)(?=.*[a-zA-Z]).{8,})/.test(value as string)
        break
      case "confirmPassword":
        newErrors.confirmPassword = value === "" || value !== formData.password
        break
      case "termsAgreed":
        newErrors.termsAgreed = !value
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newTouched = {
      fullName: true,
      phoneNumber: true,
      email: true,
      password: true,
      confirmPassword: true,
      termsAgreed: true,
    }
    setTouched(newTouched)

    // Validate each field
    validateField("fullName", formData.fullName)
    validateField("phoneNumber", formData.phoneNumber)
    validateField("email", formData.email)
    validateField("password", formData.password)
    validateField("confirmPassword", formData.confirmPassword)
    validateField("termsAgreed", formData.termsAgreed)

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error)

    if (!hasErrors && formData.termsAgreed) {
      // Form is valid, submit
      console.log("Form submitted:", formData)

      // Redirect to success page or home
      router.push("dang-ky/thanh-cong")
    }
  }

  const isFormValid = () => {
    return (
      formData.fullName !== "" &&
      formData.phoneNumber !== "" &&
      /^[0-9]{10}$/.test(formData.phoneNumber) &&
      (formData.email === "" || /\S+@\S+\.\S+/.test(formData.email)) &&
      /((?=.*\d)(?=.*[a-zA-Z]).{8,})/.test(formData.password) &&
      formData.password === formData.confirmPassword &&
      formData.termsAgreed
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400">Nhập họ và tên</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
        />
        {touched.fullName && errors.fullName && <p className="text-red-500 text-xs mt-1">Vui lòng không bỏ trống</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Nhập số điện thoại</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
        />
        {touched.phoneNumber && errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">Vui lòng không bỏ trống</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Nhập email (không bắt buộc)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
        />
        <p className="text-xs text-gray-500 mt-1">Hóa đơn VAT khi mua hàng sẽ được gửi qua email này</p>
        {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">Email không hợp lệ</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-yellow-600 uppercase">Ngày sinh</label>
        <div className="relative">
          <input
            type="text"
            name="birthDate"
            placeholder="dd/mm/yyyy"
            value={formData.birthDate}
            onChange={handleChange}
            className="mt-1 block w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              e.target.type = "text"
              if (!e.target.value) {
                e.target.placeholder = "dd/mm/yyyy"
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Nhập mật khẩu</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
        />
        {touched.password && errors.password && <p className="text-red-500 text-xs mt-1">Vui lòng không bỏ trống</p>}
        <p className="text-xs text-red-400 mt-1">
          (*) Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ và 1 số (VD: 12345a)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Nhập lại mật khẩu</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">Vui lòng không bỏ trống</p>
        )}
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-start">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={formData.newsletter}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
            Đăng ký nhận bản tin khuyến mãi từ CellphoneS
          </label>
        </div>

        <div className="flex items-start">
          <input
            id="termsAgreed"
            name="termsAgreed"
            type="checkbox"
            checked={formData.termsAgreed}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="termsAgreed" className="ml-2 block text-sm text-gray-700">
            Tôi đồng ý với các điều khoản sử dụng và chính sách bảo mật.
          </label>
        </div>
        {touched.termsAgreed && errors.termsAgreed && (
          <p className="text-red-500 text-xs ml-6">Bạn phải đồng ý với điều khoản</p>
        )}

        <div className="flex items-start">
          <input
            id="isStudent"
            name="isStudent"
            type="checkbox"
            checked={formData.isStudent}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="ml-2">
            <label htmlFor="isStudent" className="block text-sm text-gray-700">
              Tôi là Học sinh - sinh viên / Giáo viên - giảng viên{" "}
              <span className="inline-block w-4 h-4 text-xs text-center rounded-full bg-gray-200">?</span>
            </label>
            <p className="text-xs text-gray-500">(nhận thêm ưu đãi tới 500k/sản phẩm)</p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#309D94] hover:bg-[#309D70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            !isFormValid() ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid()}
        >
          Đăng ký
        </button>
      </div>
    </form>
  )
}
