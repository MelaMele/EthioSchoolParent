import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, BookOpen, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('status');
  const [userData, setUserData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. ከቴሌግራም የገባውን ተጠቃሚ መረጃ ማግኘት
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserData(user);
        // የተማሪውን እና የሜሞ መረጃዎችን ከ API መጫን
        fetchStudentAndMemos(user.id);
      } else {
        // ለሙከራ ያህል (በብሮውዘር ስንከፍተው እንዲሰራልን - የእርስዎን Telegram ID እዚህ መተካት ይችላሉ)
        fetchStudentAndMemos(8965161615); 
      }
    } else {
      // ለሙከራ ያህል (በኮምፒውተር ብሮውዘር ስንከፍተው)
      fetchStudentAndMemos(8965161615);
    }
  }, []);

  const fetchStudentAndMemos = async (telegramId) => {
    setLoading(true);
    try {
      // የተማሪ መረጃ ከቪርሴል API መጥራት
      const studentRes = await fetch(`/api/student/${telegramId}`);
      const studentJson = await studentRes.json();
      
      if (studentJson.status === 'success') {
        setStudentData(studentJson.data);
      } else {
        setError(studentJson.message);
      }

      // የሜሞዎች መረጃ ከቪርሴል API መጥራት
      const memoRes = await fetch('/api/memos');
      const memoJson = await memoRes.json();
      if (memoJson.status === 'success') {
        setMemos(memoJson.data);
      }
    } catch (err) {
      setError("ከዳታቤዝ ጋር መገናኘት አልተቻለም። እባክዎ ኢንተርኔትዎን ያረጋግጡ።");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
        <p className="text-sm text-slate-400">የተማሪ መረጃ ከዳታቤዝ በመጫን ላይ...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans max-w-md mx-auto relative border-x border-slate-800">
      
      {/* 🔝 የላይኛው መግቢያ (Header) */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">🏡 የወላጅ ፖርታል</h1>
          <p className="text-xs text-slate-400">
            ወላጅ፦ <span className="text-emerald-300 font-medium">{userData ? userData.first_name : 'ክቡር ወላጅ'}</span>
          </p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-500/20">
          የአሁኑ መረጃ
        </span>
      </div>

      {/* 📱 ዋናው የይዘት ክፍል (Tabs Content Area) */}
      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1️⃣ ታብ ፦ የተማሪ ሁኔታ (Student Status) */}
        {activeTab === 'status' && studentData && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{studentData.student_name}</h3>
                  <p className="text-[11px] text-slate-500">ተማሪ ቁጥር፦ #{studentData.id}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">⏰ መገኘት (Attendance)</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-md text-xs ${studentData.attendance?.includes('ገብቷል') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {studentData.attendance || "ያልተመዘገበ"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">📝 ስነ-ምግባር (Conduct)</span>
                  <span className="text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-md text-xs">
                    {studentData.conduct || "ያልተመዘገበ"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">📚 የቤት ስራ (Homework)</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md text-xs">
                    {studentData.homework || "የለበትም"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ ታብ ፦ የክፍያ ስክሪንሾት መላኪያ */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg text-center">
              <h3 className="font-bold text-slate-200 mb-1 text-sm">💵 የባንክ ክፍያ ማረጋገጫ</h3>
              <p className="text-xs text-slate-400 mb-4">እባክዎ የከፈሉበትን የባንክ ደረሰኝ ፎቶ (Screenshot) እዚህ ያያይዙ።</p>
              
              <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500 bg-slate-800/20 rounded-xl p-8 cursor-pointer transition-all">
                <span className="text-3xl block mb-2">📸</span>
                <span className="text-xs text-slate-400">የደረሰኝ ፎቶ ለመምረጥ እዚህ ይጫኑ</span>
              </div>
              
              <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 py-3 rounded-xl font-bold text-sm transition-all shadow-md">
                ማረጋገጫውን ወደ ትምህርት ቤት ላክ
              </button>
            </div>
          </div>
        )}

        {/* 3️⃣ ታብ ፦ ሜሞ እና መልእክት (ከዳታቤዝ የሚነበብ) */}
        {activeTab === 'memo' && (
          <div className="space-y-3">
            {memos.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-10">ምንም የትምህርት ቤት ማሳወቂያ የለም።</p>
            ) : (
              memos.map((memo) => (
                <div key={memo.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border border-amber-500/20">📋 ማሳወቂያ</span>
                    <span className="text-[10px] text-slate-500">{new Date(memo.created_at).toLocaleDateString('am-ET')}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-200">{memo.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{memo.content}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* 🧭 የታችኛው መቆጣጠሪያ (Bottom Navigation) */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 grid grid-cols-3 p-2 rounded-t-2xl shadow-xl z-10">
        <button onClick={() => setActiveTab('status')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'status' ? 'text-emerald-400 bg-slate-800' : 'text-slate-500'}`}>
          <span className="text-xl">📊</span>
          <span className="text-[11px] mt-1 font-medium">ሁኔታ</span>
        </button>
        <button onClick={() => setActiveTab('payment')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'payment' ? 'text-emerald-400 bg-slate-800' : 'text-slate-500'}`}>
          <span className="text-xl">💳</span>
          <span className="text-[11px] mt-1 font-medium">ክፍያ</span>
        </button>
        <button onClick={() => setActiveTab('memo')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'memo' ? 'text-emerald-400 bg-slate-800' : 'text-slate-500'}`}>
          <span className="text-xl">🔔</span>
          <span className="text-[11px] mt-1 font-medium">ሜሞ</span>
        </button>
      </div>

    </div>
  );
}
