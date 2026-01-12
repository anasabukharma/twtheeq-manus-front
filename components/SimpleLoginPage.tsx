import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const SimpleLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      {/* Ooredoo Logo Header */}
      <div className="w-full bg-white border-b border-gray-200 py-6">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-center">
          <img src="/ooredoo_logo.png" alt="Ooredoo" className="h-[50px] w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        {/* Login Form Section */}
        <div className="w-full max-w-[500px] mb-12">
          {/* Title */}
          <h1 className="text-[32px] md:text-[36px] font-black text-gray-900 text-center mb-3">
            تسجيل الدخول إلى My Ooredoo
          </h1>
          <p className="text-[14px] md:text-[15px] text-gray-600 text-center mb-10">
            تسجيل الدخول باستخدام اسم المستخدم وكلمة المرور.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني أو اسم المستخدم"
                className="w-full px-4 py-4 border border-gray-300 rounded-md text-right text-[15px] placeholder-gray-500 focus:outline-none focus:border-[#e30613] transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-4 py-4 border border-gray-300 rounded-md text-right text-[15px] placeholder-gray-500 focus:outline-none focus:border-[#e30613] transition-colors"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a 
                href="/?page=forgot-password" 
                className="text-[14px] font-bold text-[#e30613] hover:underline"
              >
                هل نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#e30613] text-white font-bold py-4 rounded-full text-[16px] hover:bg-[#c00510] transition-colors shadow-md"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>

        {/* Create Account Section */}
        <div className="w-full max-w-[600px] bg-[#f5f5f5] rounded-lg p-8 md:p-10">
          <div className="flex items-start gap-4">
            {/* Arrow Icon */}
            <button className="mt-2 text-gray-700 hover:text-gray-900 transition-colors">
              <ArrowLeft size={24} />
            </button>

            {/* Content */}
            <div className="flex-1">
              <p className="text-[13px] text-gray-600 mb-2">
                أرغب بإنشاء حساب جديد
              </p>
              <h2 className="text-[28px] md:text-[32px] font-black text-gray-900 mb-4">
                إنشاء حساب
              </h2>
              <a 
                href="#" 
                className="text-[14px] font-bold text-[#e30613] hover:underline inline-block"
              >
                إنشاء حساب للشركات
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[13px] text-gray-600">
            © 2026 حكومة قطر
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLoginPage;
