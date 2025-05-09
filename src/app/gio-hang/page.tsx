"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"


interface CartItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  type: string
  typeOptions: string[]
}

export default function ShoppingCart() {
  const router = useRouter()
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Dầu phật Linh trị cảm cúm, sổ mũi, nghẹt mũi, chóng mặt, say tàu xe...",
      image: "/images/sanpham1.webp",
      price: 7500,
      quantity: 1,
      type: "Chai",
      typeOptions: ["Chai", "Lọ", "Hộp"],
    },
    {
      id: "2",
      name: "Viên nén Decolgen ND trị các triệu chứng cảm thông thường - không buồn ngủ",
      image: "/images/sanpham2.webp",
      price: 5000,
      quantity: 1,
      type: "Vỉ",
      typeOptions: ["Vỉ", "Hộp", "Gói"],
    },
  ])

  const [selectAll, setSelectAll] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>(cartItems.map((item) => item.id))

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === cartItems.length) {
        setSelectAll(true)
      }
    }
  }

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.id)) {
        return total + item.price * item.quantity
      }
      return total
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const discount = 0
  const total = subtotal - discount

  return (
    <div className="bg-gray-100 pb-10">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 bg-white rounded-md shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Giỏ hàng ({cartItems.length})</h1>
              </div>
              <button className="text-blue-500 hover:underline">Xoá</button>
            </div>

            <div className="border-b pb-4">
              <div className="grid grid-cols-12 gap-4 text-sm text-gray-600 mb-2">
                <div className="col-span-6">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="mr-2 data-[state=checked]:bg-blue-500"
                    />
                    <span>Sản phẩm</span>
                  </div>
                </div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Thành tiền</div>
              </div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="py-4 border-b">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        className="mr-2 data-[state=checked]:bg-blue-500"
                      />
                      <div className="flex items-center">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-contain mr-3"
                        />
                        <div>
                          <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                          <div className="flex items-center text-xs text-gray-600">
                            <span>Phân loại: {item.type}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-1"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">{formatPrice(item.price)} đ</div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
                      >
                        <Minus size={16} />
                      </button>
                      <input type="text" value={item.quantity} readOnly className="w-10 text-center mx-2 border-none" />
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-center font-medium">{formatPrice(item.price * item.quantity)} đ</span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-gray-400 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-md shadow-sm p-6 mb-4">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-blue-500"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="font-medium">Khuyến mãi</span>
                <button className="ml-auto text-blue-500 hover:underline text-sm">Chọn mã</button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatPrice(subtotal)} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá ưu đãi</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá sản phẩm</span>
                  <span>-</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng tiền</span>
                  <span className="text-xl font-bold text-red-500">{formatPrice(total)} đ</span>
                </div>

                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
                  onClick={() => router.push("/thanh-toan")}
                >
                  Mua hàng ({cartItems.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
