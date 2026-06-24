import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('status');
  const [userData, setUserData] = useState(null);

  // ከቴሌግራም የገባውን ወላጅ ስም እና መረጃ በቀጥታ ማንበብ
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserData(user);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans max-w-md mx-auto relative border-x border-slate-800">
      
      {/* 🔝 የላይኛው መግቢያ (Header) */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">🏡 የወላጅ ፖርታል</h1>
          <p className="text-xs text-slate-400">
            እንኳን ደህና መጡ፣ <span className="text-emerald-300 font-medium">{userData ? userData.first_name : 'ክቡር ወላጅ'}</span>
          </p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-500/20 animate-pulse">
          Active
        </span>
      </div>

      {/* 📱 ዋናው የይዘት ክፍል (Tabs Content Area) */}
      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        
        {/* 1️⃣ ታብ ፦ የተማሪ ሁኔታ (Student Status) */}
        {activeTab === 'status' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
              <h3 className="font-bold text-slate-200 mb-3 text-sm flex items-center gap-2">
                <span>👦</span> የዛሬው የተማሪው ሁኔታ ሪፖርት
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm bg-slate-800/60 p-3 rounded-xl border border-slate-700/30">
                  <span className="text-slate-400">⏰ መገኘት (Attendance)</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-xs">✅ ትምህርት ቤት ገብቷል</span>
                </div>
                <div className="flex justify-between items-center text-sm bg-slate-800/60 p-3 rounded-xl border border-slate-700/30">
                  <span className="text-slate-400">📝 ስነ-ምግባር (Conduct)</span>
                  <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md text-xs">በጣም ጥሩ</span>
                </div>
                <div className="flex justify-between items-center text-sm bg-slate-800/60 p-3 rounded-xl border border-slate-700/30">
                  <span className="text-slate-400">📚 የቤት ስራ (Homework)</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md text-xs">የእንግሊዘኛ አልሰራም</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ ታብ ፦ የክፍያ ስክሪንሾት መላኪያ (Payment Screen) */}
        {activeTab === 'payment' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg text-center">
              <h3 className="font-bold text-slate-200 mb-1 text-sm">💵 የባንክ ክፍያ ማረጋገጫ</h3>
              <p className="text-xs text-slate-400 mb-4">እባክዎ የከፈሉበትን የባንክ ደረሰኝ ፎቶ (Screenshot) እዚህ ያያይዙ።</p>
              
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-800/40 rounded-xl p-8 cursor-pointer transition-all duration-200">
                <span className="text-3xl block mb-2">📸</span>
                <span className="text-xs text-slate-400">የደረሰኝ ፎቶ ለመምረጥ እዚህ ይጫኑ</span>
              </div>
              
              <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/10">
                ማረጋገጫውን ወደ ትምህርት ቤት ላክ
              </button>
            </div>
          </div>
        )}

        {/* 3️⃣ ታብ ፦ ሜሞ እና መልእክት (Memos & Announcements) */}
        {activeTab === 'memo' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-amber-500/20">🚨 አስቸኳይ ሜሞ</span>
                <span className="text-[10px] text-slate-500">ሰኔ 17, 2018</span>
              </div>
              <h4 className="font-bold text-sm text-slate-200">ነገ የኢንተርቪው ቀን መሆኑን ማሳወቅ</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                ክቡራን ወላጆች፣ ነገ ሰኔ 18 ቀን የተማሪዎች የደብተር እና የባህርይ ሁኔታ ውይይት ስላለ ከጠዋቱ 2:30 ጀምሮ ትምህርት ቤት ድረስ በመገኘት ከክፍል ኃላፊው ጋር እንድትወያዩ እናሳስባለን።
              </p>
            </div>
          </div>
        )}

      </div>

      {/* 🧭 የታችኛው መቆጣጠሪያ (Bottom Navigation - ልክ እንደ Hamster Kombat) */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 grid grid-cols-3 p-2 rounded-t-2xl shadow-xl z-10">
        <button 
          onClick={() => setActiveTab('status')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'status' ? 'text-emerald-400 bg-slate-800' : 'text-slate-500 hover:text-slate-400'}`}
        >
          <span className="text-xl">📊</span>
          <span className="text-[11px] mt-1 font-medium">ሁኔታ</span>
        </button>

        <button 
          onClick={() => setActiveTab('payment')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'payment' ? 'text-emerald-400 bg-slate-800' : 'text-slate-500 hover:text-slate-400'}`}
        >
          <span className="text-xl">💳</span>
          <span className="text-[11px] mt-1 font-medium">ክፍያ</span>
        </button>

        <button 
          onClick={() => setActiveTab('memo')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'memo' ? 'text-emerald-400 bg-slate-800' : 'text-slate-500 hover:text-slate-400'}`}
        >
          <span className="text-xl">🔔</span>
          <span className="text-[11px] mt-1 font-medium">ሜሞ</span>
        </button>
      </div>

    </div>
  );
}
