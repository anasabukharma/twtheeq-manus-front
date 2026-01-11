
import React from 'react';
import { List } from 'lucide-react';

const SmartCardSection: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <List size={18} className="text-[#333]" />
        <span className="text-[16px] font-bold">الدخول باستخدام البطاقة الذكية</span>
      </div>

      <div className="space-y-4 pr-2">
        <button className="nas-btn-blue">
          الدخول بالبطاقة الذكية
        </button>

        <div className="pt-2">
          <a href="#" className="nas-link-blue">
            أسئلة متكررة عن البطاقة الذكية
          </a>
        </div>
      </div>
    </div>
  );
};

export default SmartCardSection;
