"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface VerificationFormProps {
  phoneNumber: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VerificationForm({ phoneNumber }: VerificationFormProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(39)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input field on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!verificationCode) {
      setError("Vui lòng nhập mã xác nhận")
      return
    }

    if (!/^[0-9]{4}$/.test(verificationCode)) {
      setError("Mã xác nhận không hợp lệ")
      return
    }

    // Clear any errors
    setError("")

    // In a real app, you would verify the code with your backend
    // For this example, we'll just simulate a successful verification
    // and redirect to the home page or dashboard
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          maxLength={4}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-3"
          placeholder="Nhập mã xác nhận gồm 4 chữ số"
          value={verificationCode}
          onChange={(e) => {
            // Only allow numbers
            const value = e.target.value.replace(/[^0-9]/g, "")
            setVerificationCode(value)
          }}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors mb-4"
      >
        XÁC NHẬN
      </button>

      <div className="text-center text-sm text-gray-600 mb-4">
        <p>Nếu không nhận được mã, thử lại sau {countdown} giây</p>
      </div>

      <div className="text-center">
        <Link href="/login" className="text-blue-500 hover:underline text-sm">
          Thay đổi số điện thoại
        </Link>
      </div>
    </form>
  )
}
