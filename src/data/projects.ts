export interface Project {
  id: number;
  title: string;
  type: 'Evangelism' | 'Humanitarian Aid' | 'Youth' | 'Health' | 'Education';
  location: string;
  timeframe: string;
  description: string;
  funded: number;
  image: string;
  fullDescription: string;
  gallery: string[];
  impactStats: { label: string; value: string }[];
  stories?: { quote: string; name: string }[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Mission Mukono",
    type: 'Evangelism',
    location: "Mukono, Kampala, Uganda",
    timeframe: "March 2024",
    description: "A 5-day open-air crusade reaching over 4,000 souls Butebe grounds, and daily door-to-doorgospel evangelism with life-changing messages.",
    fullDescription: "The mission Mukono Crusade was a monumental 5-day evangelistic event held at the famous Butebe grounds. We saw unprecedented crowds hungry for the word of God. The focus was on soul winning, healing, and equipping the local saints for the work of the ministry. Through powerful preaching and prophetic ministry, thousands committed their lives to Christ.",
    funded: 100,
    image: "/journey/Mission Mukono 1.jpeg",
    gallery: [
      "/journey/Mission Mukono 1.jpeg",
      "/journey/Mission Mukono 2.jpeg"
    ],
    impactStats: [
      { label: "Souls Saved", value: "4,000+" },
      { label: "Days", value: "5" },
      { label: "Volunteers", value: "120" }
    ],
    stories: [
      { quote: "I came to the crusade broken and lost, but the word of God healed my heart.", name: "James K." }
    ]
  },
  {
    id: 2,
    title: "Feeding Kasubi",
    type: 'Humanitarian Aid',
    location: "Kasubi, Uganda",
    timeframe: "Dec 2026 - Jan 2027, Annual, Ongoing",
    description: "Emergency chrismas food relief distributed to 300 families in drought-hit Karamoja regions.",
    fullDescription: "In response to severe hunger in the area of Kasubi-Kawaala region, Louder Fellowship launched the 'Feed Kasubi' initiative, an annual food relief program. Our teams delivered emergency food supplies, clean water, and medical essentials to over 300 families  in 2025. We believe that meeting physical needs opens the door for spiritual transformation.",
    funded: 10,
    image: "/journey/Feed Kasubi.jpeg",
    gallery: [
      "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=1000",
      "/journey/Feed Kasubi.jpeg"
    ],
    impactStats: [
      { label: "Families Fed", value: "300" },
      { label: "Meals Provided", value: "18,000" },
      { label: "Tons of Food", value: "15" }
    ],
    stories: [
      { quote: "Last December was economically very hard. When the hunger hit, we thought we were finished. The food arrived just in time.", name: "Mrs. Nakato Martha." }
    ]
  },
  {
    id: 3,
    title: "The children's mega cell",
    type: 'Youth',
    location: "Kampala, Uganda",
    timeframe: "Weekly, Ongoing",
    description: "Weekly discipleship program for 500+ children and teenagers, with workshops on Spiritual Growth, purity, salvation and deliverance.",
    fullDescription: "The Children's Mega Cell is ministry to real needs of the children, in real time, in a real community, from real places.. The goal is to ignite a passion for Christ in the next generation. We hold bible studies, prayer meetings, movie shows, meals, sports and games, music sessions, interactive sessions among others.",
    funded: 60,
    image: "/journey/Childrens cell 5.jpeg",
    gallery: [
      "/journey/Childrens cell 1.jpeg",
      "/journey/Childrens cell 2.jpeg",
      "/journey/Childrens cell 3.jpeg",
      "/journey/Childrens cell 4.jpeg",
      "/journey/Childrens cell 5.jpeg",
      "/journey/Childrens cell tr Derrick.jpeg",
      "/journey/Childrens cell TV.jpeg"
    ],
    impactStats: [
      { label: "Attendees", value: "500" },
      { label: "Schools Represented", value: "24" },
      { label: "Cell gatherings", value: "8" }
    ],
    stories: [
      { quote: "Our pupils love coming to the Children's Mega Cell. It's a safe place where they learn about God and have fun. I have noticed a real transformation in their prayes lives and their love for God. They now even preach to their friends about Jesus!", name: "Muwanguzi Donald" }
    ]
  },
  {
    id: 4,
    title: "Healing Medical Camp",
    type: 'Health',
    location: "Kasubi, Kampala, Uganda",
    timeframe: "February, annual, Ongoing",
    description: "Free medical checkups, diagnosis, medication, counseling, prayer, and HIV testing for 300+ community members in all surrounding remote areas.",
    fullDescription: "Combining medical care with the healing power of Jesus, our healing Medical Camp set up in the underprivileged areas of Kasubi. Volunteer doctors and nurses provided free checkups, medication, and HIV testing. Simultaneously, our prayer teams ministered to the sick, seeing remarkable testimonies of physical healing.",
    funded: 20,
    image: "https://i.ibb.co/8nrVbkrC/image.png",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000"
    ],
    impactStats: [
      { label: "Patients Treated", value: "300+" },
      { label: "Medical Pros", value: "15" },
      { label: "Healings Testified", value: "40" }
    ],
    stories: [
      { quote: "The doctors prayed with me before the checkup. I felt healed in my spirit first.", name: "Mama Florence" }
    ]
  },
  {
    id: 5,
    title: "School ministry and back to school drive",
    type: 'Education',
    location: "Kampala, Uganda",
    timeframe: "October, annual, Ongoing",
    description: "Candidates dedication, scholastic materials, sanitary pads, spiritual materials donated to over 200 children from vulnerable families to support their education.",
    fullDescription: "Education is a powerful tool for breaking the cycle of poverty. The students dedication and back to school drivetargets over 2000 vulnerable children in Kampala Uganda, providing them with essential school supplies, backpacks, and uniforms for the new academic year.",
    funded: 10,
    image: "/journey/School outreach 2.jpeg",
    gallery: [
      "https://i.ibb.co/mrqKTXr5/image.png",
      "/journey/School outreach 2.jpeg",
      "/journey/School outreach 1.jpeg"
      
    ],
    impactStats: [
      { label: "Children Supported", value: "500" },
      { label: "exam-kits given", value: "500" },
      { label: "sanitary pads distributed", value: "350" },
      { label: "schools reached", value: "10" }
    ],
    stories: [
      { quote: "Our school strugggled alot last year. The pupils could not afford sanitary towels, inner garments, scholastic materials, etc. Louder Fellowship's back to school drive was a blessing.", name: "Geofrey M." }
    ]
  },
  {
    id: 6,
    title: "Mission Kitagobwa",
    type: 'Evangelism',
    location: "Wakiso, Uganda",
    timeframe: "May, 2025",
    description: "Teams of trained evangelists visiting remote villages of Kasangati daily with the gospel and support, delivering induviduals and places.",
    fullDescription: "The Kitagobwa mission wasn't just about sharing messages; it was about building sustainable faith communities in villages that haven't seen a church in generations. We send out trained teams every day to share the gospel, equip new believers, and establish local cell groups. We successfully reached over 10 villages, with many testimonies of lives transformed, changed the place name from Kitagobwa to Kigobedwa.",
    funded: 100,
    image: "/journey/Mission kigobeddwa 1.jpeg",
    gallery: [
      "/journey/Mission kigobeddwa 1.jpeg"
    ],
    impactStats: [
      { label: "Villages Reached", value: "10+" },
      { label: "Souls won", value: "1000+" },
      { label: "Baptisms in 2025", value: "100" },
      { label: "New Cell Groups", value: "10" }
    ],
    stories: [
      { quote: "For the first time in 40 years, our village has hope. Rehoboth didn't just bring words, they brought family.", name: "Elder Masaba" }
    ]
  }
];
