import React, { useState } from 'react';

const SearchBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // Không tìm kiếm nếu chuỗi rỗng
        if (searchQuery.trim() === '') {
            return;
        }
        // Chuyển hướng đến trang tìm kiếm với từ khóa trên URL
        router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex-1 max-w-2xl">
            <div className="relative">
                <Input 
                    placeholder="Bạn cần tìm gì?" 
                    className="h-12 text-base text-black pl-5 pr-12 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button 
                    size="icon" 
                    className="absolute top-1/2 right-2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary/90 hover:bg-primary"
                    onClick={handleSearch}
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};