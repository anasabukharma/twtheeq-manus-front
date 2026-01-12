import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import Header from './Header';

const SimpleLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasMinLength: false,
    hasSymbol: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password requirements
    if (!passwordRequirements.hasLower || !passwordRequirements.hasUpper || 
        !passwordRequirements.hasNumber || !passwordRequirements.hasMinLength || 
        !passwordRequirements.hasSymbol) {
      return;
    }
    
    // Simulate login attempt - show modal again
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans" dir="rtl">
      {/* Unified Header */}
      <Header />

      {/* Ooredoo Logo Section */}
      <div className="flex flex-col items-center mt-10 mb-8 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-center">
          <img src="/ooredoo_logo.png" alt="Ooredoo Logo" className="h-[60px] w-auto" />
        </div>
      </div>

      {/* Error Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl text-red-600">⚠</span>
                </div>
              </div>
              <h3 className="text-[20px] font-black text-gray-800 mb-4">خطأ في تسجيل الدخول تطبيق Ooredoo</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                البريد الإلكتروني أو كلمة المرور خطأ. يرجى التأكد من صحة البيانات المدخلة وإعادة المحاولة.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-[#8a1538] text-white font-black py-3 rounded-md hover:bg-[#640d2b] transition-colors"
              >
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[600px] bg-white rounded-lg shadow-md p-8 md:p-12">
          {/* Title */}
          <h1 className="text-[22px] font-black text-[#2d3a5a] text-center mb-8">
            تسجيل الدخول بإستخدام البريد الإلكتروني وكلمة المرور
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-black text-gray-700 text-right">
                البريد الإلكتروني أو اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm text-left text-[15px] focus:outline-none focus:border-[#8a1538] transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[14px] font-black text-gray-700 text-right">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Block Hindi/Arabic numerals
                    const hindiNumeralsRegex = /[٠-٩۰-۹]/;
                    if (hindiNumeralsRegex.test(value)) {
                      setPasswordError('يرجى إدخال الأرقام الإنجليزية فقط (0-9) وليس الأرقام الهندية');
                      return;
                    }
                    // Allow only English letters, numbers, and special characters
                    const englishRegex = /^[a-zA-Z0-9%$#@&/\-_]*$/;
                    if (!englishRegex.test(value)) {
                      setPasswordError('يرجى إدخال الأحرف الإنجليزية والأرقام والرموز فقط');
                      return;
                    }
                    setPasswordError('');
                    setPassword(value);
                    
                    // Validate password requirements
                    setPasswordRequirements({
                      hasLower: /[a-z]/.test(value),
                      hasUpper: /[A-Z]/.test(value),
                      hasNumber: /[0-9]/.test(value),
                      hasMinLength: value.length >= 8,
                      hasSymbol: /[%$#@&/\-_]/.test(value)
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm text-left text-[15px] focus:outline-none focus:border-[#8a1538] transition-colors pl-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[#d9534f] text-[12px] mt-1">{passwordError}</p>
              )}
              {password && (!passwordRequirements.hasLower || !passwordRequirements.hasUpper || !passwordRequirements.hasNumber || !passwordRequirements.hasMinLength || !passwordRequirements.hasSymbol) && (
                <div className="mt-2 text-[11px] space-y-1">
                  {!passwordRequirements.hasLower && <p className="text-[#d9534f]">✗ حرف صغير واحد على الأقل</p>}
                  {!passwordRequirements.hasUpper && <p className="text-[#d9534f]">✗ حرف كبير واحد على الأقل</p>}
                  {!passwordRequirements.hasNumber && <p className="text-[#d9534f]">✗ رقم واحد على الأقل</p>}
                  {!passwordRequirements.hasMinLength && <p className="text-[#d9534f]">✗ الحد الأدنى لطول كلمة المرور 8 أحرف</p>}
                  {!passwordRequirements.hasSymbol && <p className="text-[#d9534f]">✗ رمز واحد على الأقل (% $ # @ & / - _)</p>}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#8a1538] text-white font-black py-3.5 rounded-sm text-[16px] hover:bg-[#640d2b] transition-colors shadow-md"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-4 mt-auto">
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
