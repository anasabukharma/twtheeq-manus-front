
import React, { useState } from 'react';
import { User, Loader2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onAccountSuspended?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAccountSuspended }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasMinLength: false,
    hasSymbol: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show spinner for 2 seconds
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 2000);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (onAccountSuspended) {
      onAccountSuspended();
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-6">
          <User size={18} className="text-[#333]" />
          <span className="text-[16px] font-bold">الدُخول بواسطة إسم المُستخدم</span>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Row: Label on Right (First in DOM), Input on Left (Second in DOM) */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-x-2 gap-y-2">
            <div className="md:col-span-4 text-right">
              <label htmlFor="username" className="nas-label inline-block">اسم المستخدم</label>
            </div>
            <div className="md:col-span-8 w-full">
              <input
                id="username"
                type="text"
                className="nas-input w-full"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Row: Label on Right, Input on Left */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-x-2 gap-y-2">
            <div className="md:col-span-4 text-right">
              <label htmlFor="password" className="nas-label inline-block">كلمة المرور</label>
            </div>
            <div className="md:col-span-8 w-full">
              <input
                id="password"
                type="password"
                className="nas-input w-full"
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                placeholder="كلمة المرور"
                value={password}
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
                disabled={isLoading}
              />
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
          </div>

          {/* Verification Row: Label on Right, Widget on Left */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-x-2 gap-y-2 mt-4">
            <div className="md:col-span-4 text-right">
              <span className="nas-label inline-block">التحقق<span className="text-red-600 ml-0.5">•</span></span>
            </div>
            <div className="md:col-span-8 w-full">
              <div className="bg-[#f9f9f9] border border-[#d3d3d3] p-3 rounded-sm flex items-center justify-between shadow-sm max-w-[304px]">
                <div className="flex items-center gap-4">
                   <input type="checkbox" className="w-6 h-6 border-gray-300 rounded cursor-pointer" id="recaptcha-check" disabled={isLoading} />
                   <label htmlFor="recaptcha-check" className="text-[13px] font-medium text-gray-700 cursor-pointer">أنا لست برنامج روبوت</label>
                </div>
                <div className="flex flex-col items-center opacity-70">
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-8 h-8" alt="reCAPTCHA" />
                  <span className="text-[8px] mt-1 text-gray-500">reCAPTCHA</span>
                  <span className="text-[7px] text-gray-500">الخصوصية - الشروط</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Row: Align button to the left (end of row) */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-x-2 pt-4">
            <div className="md:col-span-4"></div>
            <div className="md:col-span-8 flex justify-start w-full">
              <button 
                type="submit"
                className="nas-btn-blue flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                استمر
              </button>
            </div>
          </div>

          {/* Links: Align to the left (end of row) */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-x-2 pt-2">
            <div className="md:col-span-4"></div>
            <div className="md:col-span-8 flex flex-col items-start gap-1 w-full">
               <a href="#" className="nas-link-blue">هل نسيت كلمة المرور؟</a>
               <a href="#" className="nas-link-blue">إنشاء حساب جديد</a>
            </div>
          </div>
        </form>
      </div>

      {/* Account Suspended Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nas-well bg-[#f5f5f5] border border-[#dcdcdc] rounded-[4px] shadow-lg max-w-[500px] w-full overflow-hidden">
            <div className="nas-well-header py-4 bg-[#f5f5f5] border-b border-[#dcdcdc]">
              <div className="flex items-center gap-3 pr-4">
                <AlertCircle size={24} className="text-[#d9534f]" />
                <h2 className="text-[19px] font-bold text-[#333]">تنبيه</h2>
              </div>
            </div>
            <div className="p-8 text-right">
              <p className="text-[16px] leading-relaxed text-[#333]">
                تم إيقاف الحساب بشكل مؤقت. لإعادة تفعيل الحساب، يجب تحديث البيانات.
              </p>
            </div>
            <div className="p-4 px-8 border-t border-gray-200 flex justify-center items-center bg-[#f9f9f9]">
              <button 
                className="nas-btn-blue min-w-[120px]"
                onClick={handleModalConfirm}
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
