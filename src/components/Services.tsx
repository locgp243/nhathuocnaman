import { Shield, Package, ThumbsUp, Truck } from "lucide-react"

export default function Service() {
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
    <div className="w-full bg-blue-50 bg-opacity-80 py-6 relative overflow-hidden">
      {/* Background pharmacy image (faded) */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: "url('/placeholder.svg?height=300&width=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">{feature.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
