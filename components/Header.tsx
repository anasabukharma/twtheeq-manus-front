import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-6 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-14 flex justify-between items-center max-w-[1600px]" dir="rtl">
        
        {/* RIGHT: Tawtheeq Logo */}
        <div className="flex items-center">
          <img 
            src="https://www.nas.gov.qa/idp/static/cache/img/nas-logo-op9_97x100_transparent.png" 
            alt="Tawtheeq Logo" 
            className="h-[70px] md:h-[80px] w-auto object-contain"
          />
        </div>

        {/* LEFT: System Name Branding */}
        <div className="flex flex-col items-start text-left" dir="ltr">
          <span className="text-[#8a1538] text-[26px] md:text-[32px] font-bold leading-none tracking-tight mb-2">نظام التوثيق الوطني</span>
          <span className="text-gray-900 text-[13px] md:text-[15px] font-bold leading-none tracking-[0.2em] uppercase">National Authentication System</span>
        </div>

      </div>
    </header>
  );
};

export default Header;