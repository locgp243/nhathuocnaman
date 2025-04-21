import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="bg-white pt-6 sm:pt-10 pb-4 border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* TỔNG ĐÀI */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">TỔNG ĐÀI</h3>
            <ul className="space-y-2">
              <li className="text-xs sm:text-sm">
                Gọi mua (8:00 - 21:30):{" "}
                <Link href="tel:1900 1572" className="text-blue-600 font-medium">
                  1900 1572
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                Khiếu nại (8:00 - 21:30):{" "}
                <Link href="tel:1900 1275" className="text-blue-600 font-medium">
                  1900 1275
                </Link>
              </li>
            </ul>
          </div>

          {/* HỆ THỐNG NHÀ THUỐC */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">HỆ THỐNG NHÀ THUỐC</h3>
            <ul className="space-y-2">
              <li className="text-xs sm:text-sm">
                <Link href="/he-thong-nha-thuoc" className="text-gray-600 hover:text-blue-600">
                  Hệ thống 326 nhà thuốc
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/noi-quy" className="text-gray-600 hover:text-blue-600">
                  Nội quy nhà thuốc
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/chat-luong" className="text-gray-600 hover:text-blue-600">
                  Chất lượng phục vụ
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/chinh-sach-doi-tra" className="text-gray-600 hover:text-blue-600">
                  Chính sách đổi trả, bảo hành
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/tich-diem-vip" className="text-gray-600 hover:text-blue-600">
                  Tích điểm Quà tặng VIP
                </Link>
              </li>
            </ul>
          </div>

          {/* HỖ TRỢ KHÁCH HÀNG */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className="space-y-2">
              <li className="text-xs sm:text-sm">
                <Link href="/dieu-kien-giao-dich" className="text-gray-600 hover:text-blue-600">
                  Điều kiện giao dịch chung
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/huong-dan-mua-hang" className="text-gray-600 hover:text-blue-600">
                  Hướng dẫn mua hàng online
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/chinh-sach-giao-hang" className="text-gray-600 hover:text-blue-600">
                  Chính sách giao hàng
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/chinh-sach-thanh-toan" className="text-gray-600 hover:text-blue-600">
                  Chính sách thanh toán
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/lich-su-don-hang" className="text-gray-600 hover:text-blue-600">
                  Lịch sử đơn hàng
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/dang-ky-ban-hang" className="text-gray-600 hover:text-blue-600">
                  Đăng ký bán hàng CTV chiết khấu cao
                </Link>
              </li>
            </ul>
          </div>

          {/* VỀ NHÀ THUỐC AN KHANG */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">VỀ NHÀ THUỐC NAM AN</h3>
            <ul className="space-y-2">
              <li className="text-xs sm:text-sm">
                <Link href="/gioi-thieu" className="text-gray-600 hover:text-blue-600">
                  Giới thiệu công ty
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/ban-dieu-hanh" className="text-gray-600 hover:text-blue-600">
                  Ban Điều Hành
                </Link>
              </li>
              <li className="text-xs sm:text-sm">
                <Link href="/chinh-sach-bao-mat" className="text-gray-600 hover:text-blue-600">
                  Chính sách xử lý dữ liệu cá nhân
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-8 mb-6 sm:mb-8">
          {/* KẾT NỐI VỚI CHÚNG TÔI */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">KẾT NỐI VỚI CHÚNG TÔI</h3>
            <div className="flex space-x-3 sm:space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </div>
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </div>
              </Link>
              <Link href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold">Zalo</span>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Company Information */}
        <div className="border-t pt-4 sm:pt-6 mt-4">
          <p className="text-[10px] text-center sm:text-xs text-gray-600 leading-relaxed">
            Công Ty Cổ Phần Dược Phẩm Nam An
          </p>
        </div>
      </div>
    </footer>
  )
}
