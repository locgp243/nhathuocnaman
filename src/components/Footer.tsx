import Link from "next/link";
import React from "react";
import { MapPin, Mail, Phone, ShieldCheck, Facebook } from "lucide-react";

// Component footer đã được chỉnh sửa để khớp với ảnh mẫu
export default function SiteFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin liên hệ */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Nhà Thuốc Nam An</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start">
                {/* Icon được đổi thành màu trắng */}
                <MapPin size={16} className="mr-3 mt-1 text-white flex-shrink-0" />
                <span>132 Đường Sức Khỏe, Phường An Bình, TP. Dĩ An, Tỉnh Bình Dương</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-3 text-white flex-shrink-0" />
                <Link href="mailto:support@nhathuocnaman.com" className="transition-all hover:underline">
                  support@nhathuocnaman.com
                </Link>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-3 text-white flex-shrink-0" />
                <Link href="tel:19001572" className="transition-all hover:underline font-medium">
                  1900 1572
                </Link>
              </li>
            </ul>
            <div className="mt-5 flex space-x-3">
              <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#1877F2] transition-transform hover:scale-110">
                  <Facebook fill="#1877F2" />
              </Link>
              {/* Thêm các icon social khác nếu cần */}
            </div>
          </div>
          
          {/* Cột 2: Hệ thống nhà thuốc */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Hệ thống nhà thuốc</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Nội quy nhà thuốc</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Chất lượng phục vụ</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Chính sách đổi trả, bảo hành</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Tích điểm Quà tặng VIP</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Điều kiện giao dịch chung</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Hướng dẫn mua hàng online</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Chính sách giao hàng</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Chính sách thanh toán</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Lịch sử đơn hàng</Link></li>
            </ul>
          </div>
          
          {/* Cột 4: Về nhà thuốc */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Về nhà thuốc Nam An</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Giới thiệu công ty</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Ban Điều Hành</Link></li>
              <li><Link href="#" className="text-sm text-white/90 transition-all hover:underline">Chính sách xử lý cá nhân</Link></li>
            </ul>
          </div>
        </div>

        {/* Dải phân cách và Copyright */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center text-center">
          <p className="text-xs text-white/60 mb-3 sm:mb-0">
            © {new Date().getFullYear()} Công Ty Cổ Phần Dược Phẩm Nam An. All rights reserved.
          </p>
          <div className="flex items-center text-xs text-white/80 font-medium">
             <ShieldCheck size={16} className="mr-2 text-white" />
             <span>Website đạt chuẩn GPP - An toàn và Tin cậy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}