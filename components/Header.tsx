import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-4 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-10 flex justify-between items-center max-w-[1400px]" dir="rtl">
        {/* RIGHT: Logo */}
        <div className="flex items-center">
          <img 
            src="https://www.nas.gov.qa/idp/static/cache/img/nas-logo-op9_97x100_transparent.png" 
            alt="Tawtheeq Logo" 
            className="h-[60px] md:h-[70px] w-auto object-contain"
          />
        </div>
        {/* LEFT: Text Branding */}
        <div className="flex flex-col items-start text-left" dir="ltr">
          <span className="text-[#8a1538] text-[22px] md:text-[26px] font-black leading-tight tracking-tight">نظام التوثيق الوطني</span>
          <span className="text-gray-900 text-[12px] md:text-[14px] font-extrabold leading-tight tracking-wide">National Authentication System</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
