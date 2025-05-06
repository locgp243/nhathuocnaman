import Image from "next/image"

export default function AppPromotion() {
  return (
    <div className="w-full bg-[#f5f9fc] py-8 md:py-12 overflow-hidden relative">

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Phone illustration */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative z-10">
              <div className="relative">
                <Image
                  src="/qr.jpg"
                  alt="Phone mockup"
                  width={280}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right side - Text and download options */}
          <div className="w-full md:w-2/3 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Mua thuốc khi cần mọi lúc mọi nơi - Ứng dụng giao thuốc online 24/7
            </h2>

            <p className="text-lg font-medium text-gray-700">Tại nhà, tại công ty, ban ngày hay nửa đêm</p>

            <p className="text-gray-600">
              Với Miniapp Nam An, bạn có thể mua thuốc trực tuyến, nhận hàng siêu tốc, được tư
              vấn tận tình từ dược sĩ, và theo dõi tình trạng đơn hàng dù bạn ở bất cứ đâu.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
