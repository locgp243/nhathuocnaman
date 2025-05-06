import { Shield, Phone, ThumbsUp, Truck } from "lucide-react";

export default function Service() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-[#309D94]" />,
      title: "GIAO THUỐC NHANH",
      description:
        "Đơn hàng của bạn sẽ được mua và giao từ nhà thuốc gần nhất và tốt nhất",
    },
    {
      icon: <Shield className="w-8 h-8 text-[#309D94]" />,
      title: "ĐÁNG TIN CẬY",
      description:
        "Nhà thuốc Nam An chỉ hoạt động với các hiệu thuốc đạt chuẩn GPP và được cấp phép của Bộ Y Tế",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-[#309D94]" />,
      title: "TƯ VẤN NHIỆT TÌNH",
      description:
        "Các dược sĩ có kinh nghiệm sẽ gọi điện và tư vấn sản phẩm phù hợp với bạn",
    },
    {
      icon: <Phone className="w-8 h-8 text-[#309D94]" />,
      title: "PHỤC VỤ 24H",
      description:
        "Khách hàng luôn biết trước giá với mức giá thành hợp lý, giúp bạn an tâm sử dụng dịch vụ",
    },
  ];

  return (
    <div className="w-full bg-white bg-opacity-80 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-3 px-4">
              <div>{feature.icon}</div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="text-ml text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
