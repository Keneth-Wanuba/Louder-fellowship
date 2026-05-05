import { Eye, Home, Users, Globe, BookOpen, Video, PenTool, Heart, Target, Baby, Building, GraduationCap, School } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  const papaImage = "https://i.ibb.co/s97GCMX7/Untitled-design.jpg";
  const achievements = [
    { icon: <Home className="text-royal-gold" />, text: "Rehoboth: Our first church, with land in Kasubi" },
    { icon: <Users className="text-royal-gold" />, text: "Children's ministry: Over 300 children in Sunday school" },
    { icon: <Globe className="text-royal-gold" />, text: "Global Cell Program" },
    { icon: <BookOpen className="text-royal-gold" />, text: "Nourish: School of Ministry" },
    { icon: <Video className="text-royal-gold" />, text: "Global Zoom Fellowships" },
    { icon: <PenTool className="text-royal-gold" />, text: "Baruch - School of Christian Writers" },
    { icon: <Heart className="text-royal-gold" />, text: "Medical outreaches" },
    { icon: <Target className="text-royal-gold" />, text: "Nationwide Gospel Missions" },
    { icon: <Baby className="text-royal-gold" />, text: "Orphanage" },
    { icon: <Building className="text-royal-gold" />, text: "Children's Mission Centre" },
    { icon: <GraduationCap className="text-royal-gold" />, text: "Kings and Priests Christian School" },
    { icon: <School className="text-royal-gold" />, text: "School Outreaches" },
  ];

  return (
    <>
      <SEO 
        title="Our Story"
        description="Learn about the history of Louder Fellowship and Rehoboth Ministries, from a core 3-person Bible study in Makerere Kivulu to a global prophetic ministry."
        keywords="church history, Louder Fellowship origin, Rehoboth Discipleship Global Ministries, Ezekiel Kayondo vision, ministry achievements Uganda"
      />
      <header className="bg-royal-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Our Journey</h1>
          <p className="text-royal-gold uppercase tracking-[0.3em] font-bold">From Cell to Global Ministry</p>
        </div>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            {/* 2015 */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">2015</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">The Beginning: Mayim Chayim</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-12">
              We began in 2015 with a Bible study of three people meeting in a corridor at Bulamba Hostel in Makerere Kivulu. That small gathering grew into a fellowship called <strong>Mayim Chayim</strong> — a Hebrew phrase meaning Living Water — where we would gather on a veranda to hear the Word of God and pray.
            </p>

            {/* The Vision */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">
                <Eye />
              </div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">The Ministry Vision</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
              God then gave our vision bearer, Ezekiel Kayondo, a vision during a time of prayer and fasting. In it, God showed him multitudes of people moving along the road from Kasubi to Makerere University Western gate — a sign that He was sending us to that area, and that many would turn to Him through our service there.
            </p>

            {/* 2018 */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">2018</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">New revelation - God Speaks LOUDER</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
              In 2018, following a series of outdoor all-night prayer meetings at the MTR grounds in Makerere University, alongside cell meetings in Kivulu and inhouse fellowships, God directed us to start <strong>Louder Fellowship</strong>. God declared, "I speak louder" — that His voice is not merely a whisper, but audible, loud, and clear — and we were called to proclaim and demonstrate exactly that through prophetic teaching.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <img src="/journey/2018-god-speaks.jpeg" alt="God Speaks LOUDER" className="w-full h-80 rounded-2xl shadow-lg object-cover" />
              <img src="/journey/2018-new-level.jpeg" alt="A New Level in 2018" className="w-full h-80 rounded-2xl shadow-lg object-cover" />
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-royal-gold mb-12">
              <p className="text-slate-600 m-0">
                The fellowship began by faith. It moved from a rented restaurant, to a rented hall, to a rented garage, to a rented house, to an offered office, then through two rented schools consecutively — and now to our own land in Kampala, Kasubi–Kawaala, and beyond to the nations.
              </p>
            </div>

            {/* 2020 */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">2020</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">Expansion to the Nations</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-12">
              When the COVID-19 pandemic struck in 2020 and physical gatherings were no longer possible, our man of God was led by the Holy Spirit to launch online meetings. This expanded our reach beyond Uganda to other nations, and into the army, police, schools, and communities across the country.
            </p>

            {/* 2021 */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">2021</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">Corporate Growth & Hotels</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
              As physical gatherings slowly resumed, our numbers had multiplied. God graced us to host our powerful services in hotel conference halls. This marked a significant phase of corporate growth and maturity for the ministry.
            </p>
            <img src="/journey/2021-in-hotel.jpeg" alt="2021 Fellowship in Hotel" className="w-full rounded-2xl shadow-lg mb-12 max-h-[500px] object-cover" />

            {/* 2022 */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">2022</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">Planting Rehoboth</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
              In 2022, God led us to plant a church in Kasubi, Kampala, in fulfilment of the heavenly vision. That church was initially called <em>Light the Fire Again</em>, as its mandate was to rekindle passion and love for Christ in the surrounding community. That church is now officially registered as <strong>Rehoboth Discipleship Global Ministries</strong>, and God has blessed it with land and a large home.
            </p>
            <p className="text-slate-700 leading-relaxed mb-12 text-xl font-serif italic text-royal-blue text-center">
              Rehoboth means "God has made room for us to flourish and be fruitful in the land" — and that is precisely what is happening.
            </p>

            {/* 2025 */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-royal-gold text-2xl font-serif font-bold flex-shrink-0">2025</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">Media Ministry: Radio & TV</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
              Taking the message to the airwaves. By 2025, our media outreach exploded as the prophetic voice of Louder Fellowship extended to national Radio and TV broadcasts, bringing the uncompromised truth of Christ to millions in their homes and workplaces.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <img src="/journey/2025-radio-ministry.jpeg" alt="Radio Ministry" className="w-full h-80 rounded-2xl shadow-lg object-cover" />
              <img src="/journey/tv.jpeg" alt="TV Ministry" className="w-full h-80 rounded-2xl shadow-lg object-cover" />
            </div>

            {/* 8th Anniversary */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-royal-gold rounded-full flex items-center justify-center text-royal-blue text-2xl font-serif font-bold flex-shrink-0 mt-2">8th</div>
              <h2 className="text-3xl font-serif font-bold text-royal-blue m-0">Anniversary Milestone</h2>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
              Celebrating eight years of God's faithfulness! From a humble start of three people on a veranda to a global movement, His grace has been our anchor. This milestone marks not just our past, but the launchpad for a bolder future.
            </p>
            <img src="/journey/8th-anniversary.jpeg" alt="8th Anniversary" className="w-full rounded-2xl shadow-lg mb-16 max-h-[500px] object-cover object-top" />

            {/* Achievements */}
            <div className="bg-royal-blue text-white p-8 rounded-2xl mb-12 shadow-xl">
              <p className="text-white/80 uppercase tracking-widest text-xs mb-4 font-bold">Our sound has gone out to</p>
              <p className="m-0 leading-relaxed">
                Makerere, Kikoni, Nankulabye, Kasubi, Kawaala, Namungona, Kampala, Mukono, Mbarara, Lutete, Mengo, Kisasi, Mpererwe, Entebbe, Nansana, Bombo, Budo, Mbale, Nigeria, Somalia, Dubai, Canada, Turkey, Germany, France, the United Kingdom, the USA — and we are still preaching Christ, louder!
              </p>
            </div>

            <ul className="grid md:grid-cols-2 gap-4 list-none p-0 mb-20">
              {achievements.map((item, index) => (
                <li key={index} className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Leadership Section */}
            <div className="border-t border-slate-100 pt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold text-royal-blue mb-4">Our Leadership</h2>
                <div className="w-16 h-1 bg-royal-gold mx-auto"></div>
              </div>
              <div className="max-w-md mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-royal-gold to-royal-blue rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-sm text-center">
                    <img src={papaImage} alt="Prophet Ezekiel Kayondo" className="w-32 h-32 rounded-full mx-auto object-cover mb-6 border-4 border-royal-gold/20" />
                    <h3 className="text-2xl font-serif font-bold text-royal-blue mb-2">Ezekiel Kayondo</h3>
                    <p className="text-royal-gold font-bold uppercase tracking-widest text-xs mb-4">Vision Bearer</p>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "To win souls and equip saints. We are called to raise a generation that hears God clearly and acts boldly."
                    </p>
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
