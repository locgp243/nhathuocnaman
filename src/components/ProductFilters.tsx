'use client';

import { useState, useEffect, FC } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from '@/components/ui/card';

// Định nghĩa kiểu dữ liệu cho các props
interface FilterProps {
    availableBrands: string[];
    onFilterChange: (filters: { brands: string[], priceRange: string | null }) => void;
}

const priceRanges = ["Tất cả","Dưới 100.000đ", "100.000đ - 200.000đ", "200.000đ - 500.000đ", "Trên 500.000đ"];

const ProductFilters: FC<FilterProps> = ({ availableBrands, onFilterChange }) => {
    const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    // Khi bộ lọc thay đổi, gọi hàm callback để báo cho component cha
    useEffect(() => {
        onFilterChange({
            brands: Array.from(selectedBrands),
            priceRange: selectedPrice
        });
    }, [selectedBrands, selectedPrice, onFilterChange]);

    const handleBrandChange = (brand: string, checked: boolean) => {
        setSelectedBrands(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(brand);
            } else {
                newSet.delete(brand);
            }
            return newSet;
        });
    };

    return (
        <Card className="w-full shadow-sm">
            <div className="p-4">
                <h3 className="text-base font-bold mb-2">Bộ lọc nâng cao</h3>
                <Accordion type="multiple" defaultValue={['price', 'brand']} className="w-full">
                    <AccordionItem value="price">
                        <AccordionTrigger className="text-sm font-semibold">Giá</AccordionTrigger>
                        <AccordionContent>
                            <RadioGroup value={selectedPrice ?? ""} onValueChange={setSelectedPrice} className="space-y-3 pt-2">
                                {priceRanges.map((range, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <RadioGroupItem value={range} id={`price-${i}`} />
                                        <Label htmlFor={`price-${i}`} className="font-normal cursor-pointer">{range}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="brand">
                        <AccordionTrigger className="text-sm font-semibold">Thương hiệu</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {availableBrands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={brand} 
                                            checked={selectedBrands.has(brand)}
                                            onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                                        />
                                        <Label htmlFor={brand} className="font-normal cursor-pointer">{brand}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Card>
    );
};

export default ProductFilters;