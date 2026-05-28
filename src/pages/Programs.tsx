import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';

const DEFAULT_SCHEDULE = [
  {
    day: "Sunday",
    title: "The Lord's Day",
    subtitle: "Sunday",
    events: [
      { time: "7am - 9am", name: "Nourish", desc: "School of Ministry - Deepening your walk with God." },
      { time: "9am - 12pm", name: "Prophetic Service", desc: "Main in-person physical sunday service. Zoom link and youtube livestream provided for those away." },
    ]
  },
  {
    day: "Monday",
    title: "Monday",
    subtitle: "Online Connection",
    events: [
      { time: "8pm - 10pm", name: "Zoom Fellowship", desc: "Connecting our global family through prayer and the word. Given Sunday is not enough to dissect the entire topics, we use this online fellowship for deeper teachings." },
    ]
  },
  {
    day: "Tuesday",
    title: "Tuesday",
    subtitle: "Personal Prophetic Ministry",
    events: [
      { time: "8pm - 10pm", name: "One-on-One Prayers", desc: "Personal prophetic prayers on Zoom. Bring your prayer request, hear from God, receive prophecies and direction/guidance about your situation." },
    ]
  },
  {
    day: "Wednesday",
    title: "Wednesday",
    subtitle: "Mid-week Gathering",
    events: [
      { time: "6pm - 9pm", name: "Physical Gathering", desc: "Intercession gatherings or Louder Fellowship major physical meeting in Kampala, as always announced" },
    ]
  },
  {
    day: "Thursday",
    title: "Thursday",
    subtitle: "Community & Development",
    events: [
      { time: "Evening", name: "Cell Gatherings", desc: "Meeting in homes across the globe for nourishment." },
      { time: "8:00pm", name: "Zoom Fellowship", desc: "Dream and vision interpretation. Learn to see in the Spirit, hear from God, or interpret messages from God." },
    ]
  },
  {
    day: "Friday",
    title: "Friday",
    subtitle: "Prayer Nights",
    events: [
      { time: "Last Fri", name: "Overnight Prayer", desc: "General physical overnight." },
      { time: "Fridays", name: "Upper Room Experience", desc: "1st, 2nd and 3rd fridays at Matvic Primary school." },
    ]
  },
  {
    day: "Saturday",
    title: "Saturday",
    subtitle: "Preparations and Children ministry",
    events: [
      { time: "1:00pm", name: "Children's mega cell", desc: "Last Saturday of every month during school time, and every Saturday during holidays." },
      { time: "4:00pm", name: "Choir practice", desc: "Practical rehearsals, prayer meetings and preparations for Sunday service for the choir department" },
      { time: "5:00pm", name: "Church set-up", desc: "Ushering department meets to clean, organize and prepare for service. Departmental prayer meeting happens here." },
    ]
  }
];

export default function Programs() {
  const [programs, setPrograms] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    fetch('/api/programs', { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setPrograms(data.filter((p: any) => p.visible !== false));
        } else {
          setPrograms([]);
        }
      })
      .catch(() => {
        if (!mounted) return;
        // Leave null so we render fallback
        setPrograms(null);
      });

    return () => { mounted = false; controller.abort(); };
  }, []);

  const renderProgramCard = (program: any, idx: number) => (
    <div key={program.id || idx} className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow ${program.highlight ? 'bg-royal-gold/5 border-royal-gold/20' : ''}`}>
      <div className="bg-royal-blue p-6 text-white">
        <h3 className="text-2xl font-serif font-bold text-royal-gold">{program.title}</h3>
        {program.subtitle && <p className="text-white/60 text-sm">{program.subtitle}</p>}
      </div>
      <div className="p-6 space-y-4">
        {Array.isArray(program.events) && program.events.length > 0 ? (
          program.events.map((event: any, eventIndex: number) => (
            <div key={eventIndex} className="flex gap-4">
              <div className="text-royal-gold font-bold whitespace-nowrap text-sm">{event.time}</div>
              <div>
                <h4 className="font-bold text-royal-blue">{event.name}</h4>
                <p className="text-sm text-slate-500">{event.desc}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            {program.time && <div className="text-royal-gold font-bold whitespace-nowrap text-sm">{program.time}</div>}
            {program.stats && <div className="px-3 py-1 bg-white/80 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 inline-block">{program.stats}</div>}
            {program.description && <p className="text-sm text-slate-500 mt-2">{program.description}</p>}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SEO 
        title="Weekly Programs"
        description="View the service times and weekly activities for Louder Fellowship. Join us for physical Sunday services in Kampala or our global Zoom fellowships throughout the week."
        keywords="church services Kampala, Sunday service times, Zoom fellowship, prophetic prayers online, church weekly schedule"
      />

      <header className="bg-royal-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Weekly Programs</h1>
          <p className="text-royal-gold uppercase tracking-[0.3em] font-bold">Join us in worship and fellowship</p>
        </div>
      </header>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs === null && DEFAULT_SCHEDULE.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
                <div className="bg-royal-blue p-6 text-white">
                  <h3 className="text-2xl font-serif font-bold text-royal-gold">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.subtitle}</p>
                </div>
                <div className="p-6 space-y-6">
                  {item.events.map((event, eIndex) => (
                    <div key={eIndex} className="flex gap-4">
                      <div className="text-royal-gold font-bold whitespace-nowrap text-sm">{event.time}</div>
                      <div>
                        <h4 className="font-bold text-royal-blue">{event.name}</h4>
                        <p className="text-sm text-slate-500">{event.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {programs !== null && programs.length === 0 && (
              <div className="col-span-full text-center text-slate-500">No programs available.</div>
            )}

            {programs !== null && programs.length > 0 && programs.map((p, i) => renderProgramCard(p, i))}

          </div>
        </div>
      </section>
    </>
  );
}
