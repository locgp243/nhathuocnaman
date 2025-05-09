"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { phone?: string; password?: string } = {}

    if (!phoneNumber) {
      newErrors.phone = "Vui lòng không bỏ trống"
    } else if (!/^[0-9]{10}$/.test(phoneNumber)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (!password) {
      newErrors.password = "Vui lòng không bỏ trống"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Here you would normally call your authentication API
      // For demo purposes, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to home page after successful login
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <div className="relative">
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Nhập mật khẩu"
          />
          <div className="absolute right-0 top-2">
            <Link href="/forgot-password" className="text-green-700 text-sm">
              Quên mật khẩu?
            </Link>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#309D94] text-white py-3 rounded-md hover:bg-[#309D70] transition duration-300 disabled:opacity-70"
      >
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  )
}
