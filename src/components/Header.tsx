'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ShoppingCart,
  User,
  Phone,
  Truck,
  Search,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import MenuMobile from "./MenuMobile";

export default function Header() {
  return (
    <div className="bg-destructive text-black px-4 py-3">
      <div className="max-w-7xl mx-auto w-full">

        {/* ==== PC/Desktop header ==== */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={160}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Xem giá tại */}
          {/* <Button className="bg-[#1EAFA5] hover:bg-white/20 text-black flex items-center gap-2">
            <MapPin size={18} />
            <div className="text-left leading-4">
              <div className="text-xs">Xem giá tại</div>
              <div className="text-sm font-semibold flex items-center">
                Hồ Chí Minh <ChevronDown size={14} className="ml-1" />
              </div>
            </div>
          </Button> */}

          {/* Search bar */}
          <div className="flex-1 mx-4">
            <div className="flex items-center bg-white rounded-md overflow-hidden w-full">
              <Search className="text-primary mx-3" size={28} />
              <Input
                placeholder="Bạn cần tìm gì?"
                className="border-none focus:ring-0 focus-visible:ring-0 text-sm text-black placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 text-md whitespace-nowrap">
            <div className="flex items-center gap-1">
              <Phone size={24} className="text-primary"/>
              <p className="text-[#333333]">
                Gọi mua hàng<br/>
                <strong>1800.2097</strong>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={24} className="text-primary"/>
              <p className="text-[#333333]">
                Cửa hàng<br/>
                gần bạn
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Truck size={24} className="text-primary"/>
              <p className="text-[#333333]">
                Tra cứu <br/>
                đơn hàng
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart size={24} className="text-primary"/>
              <p className="text-[#333333]">
                <Link href="/gio-hang">Giỏ<br/>hàng</Link>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#1EAFA5] hover:text-black px-3 py-1 rounded-md text-white">
              <User size={24} className="text-white"/>
              <p>
                <Link href="/dang-nhap">Tài khoản<br/>của tôi</Link>
              </p>
            </div>
          </div>
        </div>

        {/* ==== Mobile Header ==== */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Menu */}
          <MenuMobile />

          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Cart icon */}
          <Button variant="ghost" size="icon" onClick={() => console.log("Go to cart")}>
            <ShoppingCart size={24} />
          </Button>
        </div>

        {/* Search bar for mobile */}
        <div className="mt-3 lg:hidden">
          <div className="flex items-center bg-white rounded-md overflow-hidden w-full">
            <Search className="text-gray-500 mx-3" size={20} />
            <Input
              placeholder="Bạn cần tìm gì?"
              className="border-none focus:ring-0 focus-visible:ring-0 text-sm text-black placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
