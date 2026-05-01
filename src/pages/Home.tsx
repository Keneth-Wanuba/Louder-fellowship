import { ArrowRight, MessageCircle, Phone, Users, ShieldCheck, ShoppingCart, Calendar, Video, Heart, MapPin } from 'lucide-react';
export default function Home() {
  const papaImage = "https://images.unsplash.com/photo-1777622394988-acd91f9ec99b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=800"; // High-quality ministerial placeholder
  const bookCover = "images/photo.jpg"; // Newly uploaded book image
  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000" 
            alt="Church Worship" 
            className="w-full h-full object-cover animate-subtle-zoom" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/80 to-royal-blue"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.2),transparent_60%)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-royal-gold/10 border border-royal-gold/30 rounded-full animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-royal-gold"></span>
            </span>
            <span className="text-royal-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Join us this Sunday @ 07:00 AM</span>
          </div>

          <h1 className="text-5xl md:text-9xl font-serif font-black text-white mb-8 leading-[1] tracking-tighter uppercase animate-fade-in delay-200">
            Winning <span className="text-royal-gold italic">Souls</span>.  <br className="lg:hidden md:block sm:block" />
            Equipping <span className="text-royal-gold italic">Saints</span>.
          </h1>

          <p className="text-lg md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide animate-fade-in delay-500">
            A born again fellowship dedicated to winning souls to the kingdom of God & equipping believers in Christ Jesus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-700">
            <a href="/about" className="w-full sm:w-auto px-12 py-5 bg-royal-gold text-royal-blue font-bold rounded-full hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 group">
              Our Story
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex gap-4 w-full sm:w-auto">
              <a href="https://wa.me/256701751463" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none p-5 bg-white/5 backdrop-blur-md text-white rounded-full hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center group">
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="tel:+256701751463" className="flex-1 sm:flex-none p-5 bg-white/5 backdrop-blur-md text-white rounded-full hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center group">
                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-20 h-1 bg-royal-gold mb-8"></div>
              <h2 className="text-4xl font-serif font-bold text-royal-blue mb-6">Why/What we do</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed italic">
                "Louder fellowship started due to a revelation that God speaks loudly, not only in small still voices."
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-royal-gold/10 flex items-center justify-center text-royal-gold">
                    <Users />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-2">Win Souls</h3>
                    <p className="text-slate-600">Reaching out to the lost and bringing them into the light of Christ through prophetic evangelism.<br /> <strong> Mark 16:15 </strong>(“Go into all the world and preach the gospel to all creation.”) Mat 28:19-20</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-royal-gold/10 flex items-center justify-center text-royal-gold">
                    <ShieldCheck />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal-blue mb-2">Equip Saints</h3>
                    <p className="text-slate-600">Mentoring believers into mature Christians who go back and light up their communities and families.<br /> <strong> Ephesians 4:10-16 </strong>(for the equipping of the saints for the work of ministry, for the [a]edifying of the body of Christ,)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-royal-gold rounded-2xl z-0"></div>
              <img src={papaImage} alt="Prophet Ezekiel Kayondo" className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-2xl" />
              <div className="absolute bottom-8 right-8 z-20 bg-royal-blue text-white p-6 rounded-xl shadow-xl">
                <p className="font-serif text-xl italic mb-1">"God speaks loudly"</p>
                <p className="text-royal-gold font-bold">-Ezekiel Kayondo</p>
                <p className="text-royal-gold font-bold">(Vision bearer)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Store Section */}
      <section className="py-24 bg-royal-blue text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-royal-gold/20 border border-royal-gold/30 rounded-full mb-4">
              <span className="text-royal-gold text-xs font-bold uppercase tracking-widest text-[10px]">Ministry Store</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Resources for your <span className="text-royal-gold italic">Growth</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">All proceeds from our resources go directly to supporting the church development projects and spreading the Gospel further.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Book Item */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 transition-all hover:bg-white/10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative group-hover:scale-105 transition-transform duration-500 shadow-2xl rounded-lg overflow-hidden border border-white/20">
                  <img src={bookCover} alt="Master Teach Us To Pray Book" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="bg-royal-gold text-royal-blue text-[10px] font-black px-2 py-1 rounded">Prayer manual</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">Master Teach Us to Pray</h3>
                  <p className="text-royal-gold font-bold mb-4">by Ezekiel Kayondo</p>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    A practical guide designed to deepen your understanding and practice of prayer, a timeless and fruitful spiritual discipline. This book draws inspiration from the disciples' request to Jesus in the Gospel of Luke, asking, "Lord, teach us to pray.".
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-tight">Hard Copy</p>
                        <p className="text-lg font-bold">UGX 20,000</p>
                      </div>
                      <span className="text-[10px] text-royal-gold border border-royal-gold/30 px-2 py-1 rounded">In Local Bookshops</span>
                    </div>
                    <a href="https://www.amazon.com/Master-Teach-Us-Pray-Practical/dp/991369308X" target="_blank" rel="noreferrer" className="w-full bg-white text-royal-blue py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-royal-gold transition-colors">
                      <ShoppingCart className="w-4 h-4" /> Get Kindle/Amazon
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-royal-blue">Connect With Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <a href="/programs" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-royal-gold">
              <div className="w-14 h-14 bg-royal-blue rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Calendar />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Service Times</h3>
              <p className="text-slate-500 text-sm">Join us for physical and online gatherings throughout the week. click here</p>
            </a>
            <a href="/sermons" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-royal-gold">
              <div className="w-14 h-14 bg-royal-blue rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Video />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Watch / Listen</h3>
              <p className="text-slate-500 text-sm">Click here to access our latest sermons and zoom fellowship recordings.</p>
            </a>
            <a href="/give" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-royal-gold">
              <div className="w-14 h-14 bg-royal-blue rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Heart />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Donate</h3>
              <p className="text-slate-500 text-sm">Support the work of God and our church development projects. Any gift is appreciated.</p>
            </a>
            <a href="/contact" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-royal-gold">
              <div className="w-14 h-14 bg-royal-blue rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <MapPin />
              </div>
              <h3 className="text-xl font-bold text-royal-blue mb-2">Locate Us</h3>
              <p className="text-slate-500 text-sm">Find us in Kampala-Uganda, Kasubi-Kawaala, Mugema zone, opposite Matvic Primary School.</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
