import { useState } from 'react';
import { Gift, Building, Building2, Send, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Give() {
  const [isPaying, setIsPaying] = useState(false);

  /*
  const handleOnlinePayment = async () => {
    const amountStr = prompt("Enter donation amount (UGX):", "50000");
    if (!amountStr || isNaN(Number(amountStr))) return;
    
    const amount = Number(amountStr);
    if (amount < 500) {
      alert("Minimum donation amount is UGX 500");
      return;
    }

    const email = prompt("Enter your email for receipt:", "");
    if (!email) return;

    setIsPaying(true);
    try {
      const response = await fetch("/api/pay/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email })
      });
      
      const data = await response.json();
      if (data.link) {
        window.location.href = data.link;
      } else {
        throw new Error(data.error || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}. Please try again later or use the mobile money options.`);
    } finally {
      setIsPaying(false);
    }
  };
  */

  return (
    <>
      <SEO 
        title="Give"
        description="Support Louder Fellowship and Rehoboth Ministries. Your tithes, offerings, and donations fund our missions, church development projects, and soul-winning efforts in Uganda."
        keywords="donate to church Uganda, tithes and offerings, Christian giving, support missions Kampala, building project donation"
      />
      <header className="bg-royal-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Donate</h1>
          <p className="text-royal-gold uppercase tracking-[0.3em] font-bold">Support the vision of winning souls and equipping saints</p>
        </div>
      </header>

            {/* Online Payment Integration (Commented out for future work) */}
            {/* 
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-royal-blue/10 rounded-2xl flex items-center justify-center text-royal-blue mb-6">
                    <Send className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-royal-blue mb-4">Pay Online (Card / Mobile Money)</h2>
                  <p className="text-slate-600">
                    Give easily using your credit/debit card or Mobile Money from anywhere in the world. 
                    Safe, secure, and fast processing via our global payment partner.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={handleOnlinePayment}
                    disabled={isPaying}
                    className="bg-royal-gold text-royal-blue px-10 py-5 rounded-full font-black text-lg hover:bg-royal-blue hover:text-white transition-all shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Initialising...
                      </>
                    ) : "Pay Online Now"}
                  </button>
                  <p className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Secured by Flutterwave
                  </p>
                </div>
              </div>
            </div>
            */}


      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* General Giving */}
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
              <div className="w-16 h-16 bg-royal-gold/10 rounded-2xl flex items-center justify-center text-royal-gold mb-8">
                <Gift className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue mb-6">Donate/Gift by Merchant code</h2>
              <p className="text-slate-600 mb-10">
                Your gifts, tithes, offerings, love offerings, and first fruits help us not only maintain the daily operations of the fellowship and reach more souls, but also develop the ministry.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/journey/New-mtn-logo.jpg" 
                      alt="MTN" 
                      className="w-10 h-10 object-contain rounded-lg p-1 bg-[#FFCC00]" 
                    />
                    <span className="font-bold text-royal-blue hidden sm:inline">MTN Merchant Code</span>
                    <span className="font-bold text-royal-blue sm:hidden">MTN</span>
                  </div>
                  <span className="text-2xl font-mono font-bold text-royal-gold">706552</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/airtel-logo.svg" 
                      alt="Airtel" 
                      className="w-10 h-10 object-contain rounded-lg p-1 bg-white" 
                    />
                    <span className="font-bold text-royal-blue hidden sm:inline">AIRTEL Merchant Code</span>
                    <span className="font-bold text-royal-blue sm:hidden">AIRTEL</span>
                  </div>
                  <span className="text-2xl font-mono font-bold text-royal-gold">4371416</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs uppercase tracking-widest text-royal-blue/50 mb-2">DIAMOND TRUST BANK (DTB Bank)</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-royal-blue">Account Number</span>
                    <span className="text-xl font-mono font-bold text-royal-gold">0316389002</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Project */}
            <div className="bg-royal-blue rounded-3xl shadow-xl p-10 text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Building className="w-64 h-64" />
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-royal-gold mb-8">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-royal-gold mb-6">Mobile Money</h2>
              <p className="text-white/70 mb-10">
                For those in diaspora, Merchant codes are not an option. Please use the following lines both in the names of <strong> ALESI ADROA</strong>, 
                and our bank account.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/journey/New-mtn-logo.jpg" 
                      alt="MTN" 
                      className="w-10 h-10 object-contain rounded-lg p-1 bg-[#FFCC00]" 
                    />
                    <span className="font-bold hidden sm:inline">MTN Number</span>
                    <span className="font-bold sm:hidden">MTN</span>
                  </div>
                  <span className="text-2xl font-mono font-bold text-royal-gold">0761503111</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/airtel-logo.svg" 
                      alt="Airtel" 
                      className="w-10 h-10 object-contain rounded-lg p-1 bg-white" 
                    />
                    <span className="font-bold hidden sm:inline">AIRTEL Number</span>
                    <span className="font-bold sm:hidden">AIRTEL</span>
                  </div>
                  <span className="text-2xl font-mono font-bold text-royal-gold">0756333301</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/50 mb-2">DIAMOND TRUST BANK (DTB Bank)</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Account Number</span>
                    <span className="text-xl font-mono font-bold text-royal-gold">0316389002</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
