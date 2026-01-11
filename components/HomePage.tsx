import React from 'react';

interface HomePageProps {
  onStart: () => void;
  onLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="w-full bg-white font-sans min-h-screen flex flex-col" dir="rtl">
      {/* Home Header - Matching Refined Header */}
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

      {/* Sub Nav */}
      <div className="container mx-auto px-4 md:px-10 max-w-[1400px] py-4">
        <div className="flex gap-4 text-[14px] font-extrabold text-[#007fb1]">
          <a href="#" className="hover:underline">English</a>
          <button onClick={onLogin} className="hover:underline border-r border-gray-300 pr-4">تسجيل الدخول</button>
        </div>
      </div>

      {/* Main Content Card */}
      <main className="flex-1 flex justify-center pt-12 pb-20 px-4">
        <div className="nas-well bg-[#f5f5f5] border border-[#dcdcdc] rounded-[4px] shadow-sm max-w-[800px] w-full h-fit overflow-hidden">
          <div className="p-8 md:p-12 text-right">
            <h1 className="text-[22px] font-black text-[#333] mb-8">الصفحة الرئيسية لبوابة الخدمة الذاتية</h1>
            <div className="w-full h-[1px] bg-gray-300 mb-8 opacity-50"></div>
            
            <div className="space-y-6 text-[15px] text-[#333] leading-relaxed">
              <p className="font-extrabold">للوصول إلى بوابة الخدمة الذاتية، يجب النقر على رابط تسجيل الدخول.</p>
              
              <div className="space-y-3">
                <p className="font-extrabold text-gray-700">إذا لم يكن لديك حساب مستخدم، يرجى محاولة القيام بالإجراء الآتي:</p>
                <ul className="list-disc list-inside pr-4 text-[#007fb1] font-black">
                  <li>
                    <button onClick={onStart} className="hover:underline">تسجيل مستخدم جديد</button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="font-extrabold text-gray-700">إذا لم تتمكن من الدخول إلى حسابك، يرجى محاولة القيام بأحد الإجراءات الآتية:</p>
                <ul className="list-disc list-inside pr-4 text-[#007fb1] font-black space-y-2">
                  <li><button onClick={onStart} className="hover:underline">إعادة تعيين كلمة المرور</button></li>
                  <li><button onClick={onStart} className="hover:underline">تغيير رقم الجوال</button></li>
                  <li><button onClick={onStart} className="hover:underline">إعادة تشغيل الحساب</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-100">
        <div className="text-center text-gray-800 text-[14px] font-black">
          © 2025 حكومة قطر
        </div>
      </footer>
    </div>
  );
};

export default HomePage;