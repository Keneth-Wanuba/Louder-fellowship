import { BookOpen, Sun, Cross, Heart, Wind, Users, Sparkles, CloudSun, Home, Baby } from 'lucide-react';

export default function Faith() {
  const beliefs = [
    {
      id: "01",
      icon: <BookOpen className="w-40 h-40 text-royal-blue" />,
      title: "Scripture",
      text: "We believe all of Scripture (i.e., both the Old and New Testament) is inspired by God and infallible. All of Scripture is our final authority in all matters of faith and practice and is profitable for doctrine, reproof, correction, and instruction in righteousness (2 Timothy 3:16,17). We believe that the Scriptures do not simply contain the Word of God but are the Word of God that inherently possess His life and authority and bring faith, revelation, and healing to those who choose to receive (Matthew 4:4; Matthew 22:31; Romans 1:17; Romans 15:4; 2 Corinthians 4:13; Hebrews 10:7; Proverbs 4:20-22)."
    },
    {
      id: "02",
      icon: <Sun className="w-40 h-40 text-royal-blue" />,
      title: "God",
      text: "We believe in only one true and eternal God; One in essence, nature, and attributes, but eternally existing in three distinct persons: Father, Son, and Holy Spirit (1 John 5:7)."
    },
    {
      id: "03",
      icon: <Cross className="w-40 h-40 text-royal-blue" />,
      title: "Jesus Christ",
      text: "We believe in the deity of the Lord Jesus Christ, in His virgin birth, in His sinless life on earth, in His shed blood and death on Calvary for the forgiveness of our sins, in His bodily resurrection on the third day and ascension to the Father’s right hand. We believe He has accomplished all that is necessary for man’s salvation. We do not accept the doctrine that He is merely “a” way to the Father, but rather we believe He is the only way through which we can receive righteousness, regeneration, sanctification, and glorification. He is, in fact, our salvation (1 Corinthians 1:30-31)."
    },
    {
      id: "04",
      icon: <Heart className="w-40 h-40 text-royal-blue" />,
      title: "Salvation",
      text: "We believe it is essential for man to repent of sin and by faith receive the finished work of Christ and regeneration by the Holy Spirit, by confessing Jesus as Lord with their mouth and believing in one’s heart that God raised him from the dead. (Acts 20:20-21; Romans 10:9-13; John 3:5-6). We believe that salvation is offered to all men by God’s grace but is only effectual for those who believe (Ephesians 1:13). We reject the false doctrines of universalism, ultimate reconciliation, or inclusionism in their various forms."
    },
    {
      id: "05",
      icon: <Wind className="w-40 h-40 text-royal-blue" />,
      title: "Holy Spirit",
      text: "We believe that the Holy Spirit is the Spirit of God and is God. The Holy Spirit is a divine Person possessing all the attributes of personality and deity. The Holy Spirit is coequal with the Father and the Son (Matthew 28:19; Acts 5:3-4; 28:25-26; 1 Corinthians 12:4-6; 2 Corinthians 13:14). We believe the Holy Spirit is continuing the work He started at Pentecost, empowering believers to live godly and to continue in all the works of Jesus Christ. We believe in the baptism with the Holy Spirit, expressed with speaking in tongues according to Acts 1:8; 2:4; 9:17; 10:44-46; 11:15-16; and 19:6. We believe this experience is distinct from and subsequent to the new birth and can be received by faith (Galatians 3:2). We believe that spiritual gifts and manifestations of the Holy Spirit are for the common good and building up of others today (1 Corinthians 12:7). We do not accept the doctrine that the gifts of the Holy Spirit ceased, but we believe they are all still available and active today."
    },
    {
      id: "06",
      icon: <Users className="w-40 h-40 text-royal-blue" />,
      title: "The Church",
      text: "We believe that the universal church is comprised of all true believers who have received salvation through Christ, regardless of denominational affiliation (Ephesians 1:22-23). We believe all born-again believers have been commissioned to proclaim the Gospel to all the world (Matthew 28:16-20). We also believe in and encourage fellowship with a local church (Hebrews 10:25)."
    },
    {
      id: "07",
      icon: <Sparkles className="w-40 h-40 text-royal-blue" />,
      title: "Healing",
      text: "We believe that the redemptive work of Christ on the cross has provided healing for the human body (Matthew 8:16-17; Isaiah 53:4; 1 Peter 2:24). We believe it is God’s will for everyone who is sick or diseased to receive bodily healing by faith."
    },
    {
      id: "08",
      icon: <CloudSun className="w-40 h-40 text-royal-blue" />,
      title: "The Second Coming & Resurrection",
      text: "We believe in a literal, physical second return of the Lord Jesus Christ (1 Thessalonians 1:10; 4:16-17) and that His return did not happen in A.D. 70 but is a future, physical event. (Revelation 1:7; Matthew 24:30; Acts 1:11) We believe His return is imminent, that upon His return, those who have believed in Him will be resurrected to a heavenly dwelling in an incorruptible body. We also believe that those who do not believe will join Satan and his host in everlasting punishment. (Matthew 25:46; 1 Corinthians 15). We believe that hell as described in both Old and New Testaments is a literal, eternal destination for all who have rejected Christ’s redemptive work and refused the gift of salvation. (2 Pet. 2:4-9; Luke 12:5)"
    },
    {
      id: "09",
      icon: <Home className="w-40 h-40 text-royal-blue" />,
      title: "Marriage, Gender & Sexuality",
      text: "We believe in marriage between one man and one woman as biologically designed at birth. God instituted marriage between male and female as the foundation of the family and the basic structure of human society (Genesis 2:24). God has commanded that no sexual activity be committed other than in the context of marriage between a man and a woman (Genesis 19:5, 26:8-11; Leviticus 18:1-30; Romans 1:26-29; I Corinthians 5:1, 6:9; 1 Thessalonians 4:1-8; Hebrews 13:4). God has wonderfully and immutably created each person as male or female. These two distinct, complementary genders, together, reflect the image and nature of God (Genesis 1:26-27)."
    },
    {
      id: "10",
      icon: <Baby className="w-40 h-40 text-royal-blue" />,
      title: "Sanctity of Life",
      text: "We believe a unique human life, bearing the image of God, begins at the moment of conception. God alone is the Author of life, and He alone numbers our days from the moment of conception until natural death. Accordingly, all human life is sacred from conception until natural death, and every person possesses a God-given, unalienable right to life. Every human has inherent, equal and unalienable value, worth, and dignity because we are made in His image. The church must defend, protect and value the weak, vulnerable, infirm, elderly, handicapped, and pre-born. (Psalm 39:4; 127:3; 71:6; 139:14-16; Jer. 1:5; Luke 1:44; 1 Cor. 11:12; Job 14:5-7; Galatians 1:5)"
    }
  ];

  return (
    <>
      <header className="relative py-24 bg-royal-blue overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=2000" 
            alt="Bible" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-royal-blue/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 uppercase tracking-tight">
            Statement <span className="text-royal-gold">of Faith</span>
          </h1>
          <div className="w-24 h-1 bg-royal-gold mx-auto mb-8"></div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
            Our doctrinal foundations and core beliefs that guide our fellowship and ministry.
          </p>
        </div>
      </header>

      <section className="py-20 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-royal-blue/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-12">
            {beliefs.map((belief) => (
              <div 
                key={belief.id} 
                className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${parseInt(belief.id) % 2 === 0 ? 'bg-royal-blue' : 'bg-royal-gold'}`}></div>
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                  {belief.icon}
                </div>
                <div className="relative">
                  <h2 className="text-3xl font-serif font-bold text-royal-blue mb-6 flex items-baseline gap-3">
                    <span className="text-royal-gold text-5xl font-black opacity-20">{belief.id}</span>
                    <span>{belief.title}</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed font-light">
                    {belief.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
