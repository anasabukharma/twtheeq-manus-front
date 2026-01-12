import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const SimpleLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!password || password.length < 8) {
      setPasswordError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    
    // Simulate login attempt
    setErrorMessage('يبدوا ان اسم المستخدم او كلمة المرور التي تم ادخالها غير صحيحة. يرجى المحاولة مرة اخرى.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/qgcc_LOGO.png" 
              alt="Qatar Government Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center gap-3">
            <img 
              src="/naps.png" 
              alt="NAPS Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-[18px] font-black text-gray-800 text-center mb-8">
            تسجيل الدخول بإستخدام رقم الهاتف وكلمة المرور الموثقة.
          </h1>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-[#00d084] rounded-lg">
              <p className="text-[14px] text-gray-700 text-center leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Phone Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-black text-gray-700 text-right">
                البريد الإلكتروني او اسم المستخدم
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-left text-[15px] focus:outline-none focus:border-[#00d084] transition-colors"
                placeholder="sshsh@gmail.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-black text-gray-700 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    const englishRegex = /^[a-zA-Z0-9%$#@&/\-_]*$/;
                    if (!englishRegex.test(value)) {
                      setPasswordError('يرجى إدخال الأحرف الإنجليزية والأرقام والرموز فقط');
                      return;
                    }
                    setPassword(value);
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-left text-[15px] focus:outline-none focus:border-[#00d084] transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[#d9534f] text-[12px] mt-1 text-center">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a 
                href="#" 
                className="text-[14px] font-black text-[#e63946] hover:underline"
              >
                هل نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#e63946] text-white font-black py-3.5 rounded-lg text-[16px] hover:bg-[#d62839] transition-colors shadow-md"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-4">
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
