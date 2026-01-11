import React from 'react';

interface PaymentInfoProps {
  onNext: () => void;
  onPrev: () => void;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ onNext, onPrev }) => {
  return (
    <div className="w-full max-w-[880px] bg-[#f5f5f5] border border-[#eeeeee] rounded-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="text-right pt-8 pb-4 bg-[#f5f5f5] px-10">
        <h1 className="text-[18px] font-bold text-[#333]">تسديد الرسوم</h1>
        <div className="w-full border-b border-[#dddddd] mt-4"></div>
      </div>
      
      <div className="px-10 py-6">
        <div className="bg-white border border-[#eeeeee] rounded-[6px] p-6 mb-6 text-right shadow-sm">
          <p className="text-[14px] text-[#333] leading-relaxed mb-4">
            سيتم استيفاء مبلغ <span className="font-bold">(10 ر.ق)</span> بدل رسوم تفعيل وتنشيط الحساب لإتمام عملية التسجيل في نظام التوثيق الوطني (توثيق) للاستفادة من الخيارات المحددة من خدمات نظام التوثيق الوطني:
          </p>
          
          <div className="mt-4">
            <p className="text-[14px] font-bold text-[#333] mb-3">وتتمتع خدمة التوثيق الوطني بالمزايا التالية:</p>
            
            <ul className="space-y-2 text-[13px] text-[#333] leading-relaxed">
              <li className="flex items-start">
                <span className="ml-2">•</span>
                <span>تسهيل ربط الجهات الحكومية بالخدمة من خلال إجراءات مبسطة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">•</span>
                <span>تأمين استخدام الخدمات الإلكترونية والعمليات من قبل المستخدمين.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">•</span>
                <span>توفير متعدد المستويات لاستخدام (البطاقة الذكية/ كلمة السر أو كلمة المرور/ البريد الإلكتروني للأراضي أو أحدى الإضافة الموقتة المصرحة).</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">•</span>
                <span>ضمان تسجيل الدخول الموحد للحساب، مما يسهل تجربة العميل عند إتمام أي خدمة أو معاملة إلكترونية.</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button 
              className="border border-[#cccccc] rounded-[4px] px-8 py-4 bg-white inline-flex items-center gap-4 hover:bg-gray-50 hover:border-[#007fb1] transition-all shadow-sm cursor-pointer"
              onClick={onNext}
            >
              <img src="/naps_button.png" alt="NAPS" className="h-[32px] w-auto" />
              <span className="text-[15px] text-[#333] font-semibold">Qatari Debit Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
