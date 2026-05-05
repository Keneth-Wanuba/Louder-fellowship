import { ArrowRight, MessageCircle, Phone, Users, ShieldCheck, ShoppingCart, Calendar, Video, Heart, MapPin, Globe } from 'lucide-react';
import SEO from '../components/SEO';

export default function Home() {
  const papaImage = "/journey/image.png"; // High-quality ministerial placeholder
  const bookCover = "https://i.ibb.co/C3KXCrft/book-discount.jpg"; // Newly provided book image URL
  return (
    <>
      <SEO 
        title="Home"
        description="Join Louder Fellowship and Rehoboth Ministries in Kampala, Uganda. Led by Prophet Ezekiel Kayondo. Witness the audible voice of God, soul winning, and saint equipping."
        keywords="Rehoboth, Discipleship, Ezekiel Kayondo, Louder, Fellowship, Christian fellowship Kampala, winning souls, equipping saints"
      />
      {/* Hero Section */}
      <header className="relative min-h-[90vh] py-5 md:py-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000" 
            alt="Church Worship" 
            className="w-full h-full object-cover animate-subtle-zoom" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/80 to-royal-blue"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.2),transparent_60%)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-in">
            <div className="flex items-center gap-2 px-4 md:px-5 py-1 bg-royal-gold/10 backdrop-blur-md border border-royal-gold/30 rounded-full w-full sm:w-auto justify-center flex-wrap">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-royal-gold"></span>
              </span>
              <span className="text-royal-gold text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-center">Sunday Service @ 07:00 AM</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30 shrink-0"></div>
            <div className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 w-full sm:w-auto justify-center flex-wrap">
              <MapPin className="w-4 h-4 text-royal-gold shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium tracking-wide text-center">25 Hajji Juma Kayondo Rd, Kampala</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-serif font-black text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1] tracking-tighter uppercase animate-fade-in delay-200">
            Winning <span className="text-royal-gold italic">Souls</span>.  <br className="lg:hidden md:block sm:block" />
            Equipping <span className="text-royal-gold italic">Saints</span>.
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-white/70 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide animate-fade-in delay-500 px-2 md:px-0">
            A born again fellowship dedicated to winning souls to the kingdom of God & equipping believers in Christ Jesus.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 animate-fade-in delay-700 w-full max-w-md sm:max-w-none mx-auto">
            <a href="https://www.youtube.com/@louderfellowship1828/streams" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 group animate-pulse-slow border border-red-500">
              <Video className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col items-start font-sans">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/80 font-bold">Sunday 07:00 AM</span>
                <span className="text-base md:text-lg font-bold leading-none mt-0.5 whitespace-nowrap">Watch Live Stream</span>
              </div>
            </a>
            <a href="/about" className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-5 bg-royal-gold text-royal-blue font-bold rounded-full hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 group whitespace-nowrap">
              Our Story
              <ArrowRight className="w-5 h-5 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
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
                "Louder fellowship started by a revelation that God speaks loudly, not only in a still small voice."
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
                    <p className="text-slate-600">equipping believers for the work of ministry, for the edifying of the body of Christ, till we all come to the unity of the faith and of the knowledge of the Son of God, to a perfect man, to the measure of the stature of the fullness of Christ.<br /> <strong> Ephesians 4:10-16 </strong>(for the equipping of the saints for the work of ministry, for the [a]edifying of the body of Christ,)</p>
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

      {/* Kingdom Outreach Summary */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/95 via-royal-blue/80 to-transparent z-10" />
          <img 
            src="https://i.ibb.co/S4N0hFVW/image.png" 
            alt="Outreach" 
            className="w-full h-full object-cover animate-subtle-zoom"
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-royal-gold/20 border border-royal-gold/30 text-royal-gold font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-sm">
              Kingdom Outreach
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">
              Transforming Lives <br />
              <span className="text-royal-gold italic text-3xl md:text-4xl">Beyond the Four Walls</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 font-light leading-relaxed">
              We believe the church is a movement. Our outreach projects span across Uganda — from rural evangelism and emergency relief to medical camps and youth conferences. Partner with us as we bring hope and practical love to communities in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/projects" className="px-8 py-4 bg-white text-royal-blue font-bold rounded-full hover:bg-royal-gold hover:text-white transition-all shadow-xl text-center flex items-center justify-center gap-2 group">
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Explore Our Projects
              </a>
              <a href="/give" className="px-8 py-4 bg-royal-blue/50 border border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-royal-blue transition-all shadow-xl text-center flex items-center justify-center gap-2 group backdrop-blur-sm">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Partner With Us
              </a>
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
