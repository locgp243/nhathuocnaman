"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [showVatInvoice, setShowVatInvoice] = useState(false)
  const [saveInfo, setSaveInfo] = useState(true)
  const [agreeToTerms, setAgreeToTerms] = useState(true)
  const [showProductInfo, setShowProductInfo] = useState(true)

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h1 className="text-xl font-bold mb-4">Thanh toán</h1>

              {/* Promotion Banner */}
              <div className="bg-yellow-50 p-4 rounded-md mb-6">
                <p className="text-sm">
                  Đăng ký thành viên của Nhà thuốc Nam An để hưởng những khuyến mãi hấp dẫn và tích lũy P-Xu Vàng cho các lần
                  mua tiếp theo.
                </p>
                <Button variant="link" className="text-blue-600 p-0 h-auto text-sm mt-1">
                  Tham gia ngay
                </Button>
              </div>

              {/* Product Summary */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src="/images/sanpham1.webp"
                      alt="Swisse Ultiboost Liver Detox"
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      Viên uống Swisse Ultiboost Liver Detox hỗ trợ giải độc gan (hộp 60 viên)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Hộp</p>
                    <p className="text-xs text-orange-500 mt-1">Deal Giảm 15% - (01-31/5)</p>
                  </div>
                  <div className="flex-shrink-0 ml-4 text-right">
                    <p className="text-sm">x1</p>
                    <p className="text-sm mt-1">
                      <span className="line-through text-gray-500">599.000 đ</span>{" "}
                      <span className="font-medium">509.150 đ</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <Textarea id="notes" placeholder="Nhập ghi chú ở đây" className="w-full" />
              </div>

              {/* Delivery Method */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Hình thức nhận hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`py-3 px-4 rounded-md text-center text-sm font-medium ${
                      deliveryMethod === "delivery"
                        ? "bg-blue-50 border-2 border-blue-500 text-blue-700"
                        : "bg-gray-100 border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setDeliveryMethod("delivery")}
                  >
                    Giao hàng tận nơi
                  </button>
                  <button
                    className={`py-3 px-4 rounded-md text-center text-sm font-medium ${
                      deliveryMethod === "pickup"
                        ? "bg-blue-50 border-2 border-blue-500 text-blue-700"
                        : "bg-gray-100 border border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setDeliveryMethod("pickup")}
                  >
                    Nhận tại nhà thuốc
                  </button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-medium mb-4">Thông tin người đặt hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Họ và Tên
                    </label>
                    <Input id="fullname" placeholder="Nhập họ và tên" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Số điện thoại
                    </label>
                    <Input id="phone" placeholder="Nhập số điện thoại" className="w-full" />
                  </div>
                </div>

                <h3 className="text-sm font-medium mb-4">Địa chỉ nhận hàng</h3>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Địa chỉ
                    </label>
                    <Input id="address" placeholder="Nhập số nhà, tên đường" className="w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Tỉnh/ Thành phố
                    </label>
                    <div className="relative">
                      <select
                        id="province"
                        className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hn">Hà Nội</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Quận/ Huyện
                    </label>
                    <div className="relative">
                      <select
                        id="district"
                        className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn Quận/Huyện</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Phường/ Xã
                    </label>
                    <div className="relative">
                      <select
                        id="ward"
                        className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn Phường/Xã</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Nhờ người khác nhận hàng</h3>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Chọn đơn vị vận chuyển</h3>
                  <div className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200">
                    <span className="text-sm">Đơn vị vận chuyển</span>
                    <Button variant="ghost" className="text-blue-600 p-0 h-auto text-sm">
                      Thay đổi
                    </Button>
                  </div>
                </div>

                <div className="flex items-center">
                  <Checkbox id="save-info" checked={saveInfo} onCheckedChange={(checked) => setSaveInfo(!!checked)} />
                  <label htmlFor="save-info" className="ml-2 text-sm text-gray-700">
                    Lưu lại thông tin cho lần mua hàng sau
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">Phương thức thanh toán</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center">
                      {/* <Image
                        src="/placeholder.svg?text=COD&width=30&height=30&fontColor=white&bgColor=2196F3"
                        alt="COD"
                        width={30}
                        height={30}
                        className="mr-2"
                      /> */}
                      <span>COD</span>
                      <span className="ml-2 text-sm text-gray-500">Tiền mặt</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center">
                      {/* <Image
                        src="/placeholder.svg?text=MoMo&width=30&height=30&fontColor=white&bgColor=d82d8b"
                        alt="MoMo"
                        width={30}
                        height={30}
                        className="mr-2"
                      /> */}
                      <span>MoMo</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem value="zalopay" id="zalopay" />
                    <Label htmlFor="zalopay" className="flex items-center">
                      {/* <Image
                        src="/placeholder.svg?text=ZaloPay&width=30&height=30&fontColor=white&bgColor=0068ff"
                        alt="ZaloPay"
                        width={30}
                        height={30}
                        className="mr-2"
                      /> */}
                      <span>ZaloPay</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem value="atm" id="atm" />
                    <Label htmlFor="atm" className="flex items-center">
                      {/* <Image
                        src="/placeholder.svg?text=ATM&width=30&height=30&fontColor=white&bgColor=4CAF50"
                        alt="Thẻ ATM"
                        width={30}
                        height={30}
                        className="mr-2"
                      /> */}
                      <span>Thẻ ATM</span>
                    </Label>
                  </div>


                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-md shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
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
                </div>
                <button className="text-blue-500 hover:underline text-sm">Chọn mã</button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  className={`text-sm py-1 px-3 rounded-md ${
                    showVatInvoice ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setShowVatInvoice(!showVatInvoice)}
                >
                  Hóa đơn VAT
                </button>
                <button className="text-sm py-1 px-3 rounded-md bg-blue-100 text-blue-700">Yêu cầu xuất hóa đơn</button>
              </div>

              <div className="flex items-center mb-4">
                <Checkbox
                  id="product-info"
                  checked={showProductInfo}
                  onCheckedChange={(checked) => setShowProductInfo(!!checked)}
                />
                <label htmlFor="product-info" className="ml-2 text-sm">
                  Ẩn thông tin sản phẩm
                </label>
              </div>

              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm">Thông tin sản phẩm sẽ được ẩn trên Phiếu gửi hàng</span>
                  <div className="ml-1 text-gray-500 cursor-help">
                    <Info className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${showProductInfo ? "bg-green-500" : "bg-gray-300"} mr-2`}
                  ></div>
                  <span className="text-sm text-gray-600">Đã bật</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Chi tiết thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>{formatPrice(599000)} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span>0 đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá sản phẩm</span>
                    <span>-{formatPrice(89850)} đ</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Tổng tiền</span>
                      <div className="text-xs text-gray-500">1 sản phẩm</div>
                    </div>
                    <span className="text-xl font-bold text-red-500">{formatPrice(509150)} đ</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                      />
                      <label htmlFor="terms" className="ml-2 text-sm">
                        Bằng cách tích vào ô chọn, bạn đã đồng ý với{" "}
                        <Link href="#" className="text-blue-600 hover:underline">
                          Điều khoản Nam An
                        </Link>
                      </label>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md">
                      Đặt hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
