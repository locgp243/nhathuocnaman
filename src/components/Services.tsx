import { Shield, Package, ThumbsUp, Truck } from "lucide-react"
import Link from "next/link"
export default function Service() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Thuốc chính hãng",
      description: "đã đăng và chuyển sâu",
    },
    {
      icon: <Package className="w-8 h-8 text-blue-600" />,
      title: "Đổi trả trong 30 ngày",
      description: "kể từ ngày mua hàng",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-blue-600" />,
      title: "Cam kết 100%",
      description: "chất lượng sản phẩm",
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Miễn phí vận chuyển",
      description: "theo chính sách giao hàng",
    },
  ]

  return (
      <div className="w-full bg-white bg-opacity-80 relative overflow-hidden py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">CAM KẾT 100%</h3>
                <p className="text-sm">thuốc chính hãng</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">MIỄN PHÍ GIAO HÀNG</h3>
                <p className="text-sm">đơn hàng từ 150.000đ</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">GIAO NHANH 2 GIỜ</h3>
                <p className="text-sm">
                  <Link href="#" className="text-blue-600 hover:underline">
                    Xem chi tiết
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <line x1="18" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-600">ĐỔI TRẢ TRONG 3 NGÀY</h3>
                <p className="text-sm">
                  <Link href="#" className="text-blue-600 hover:underline">
                    Xem chi tiết
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      

  )
}
