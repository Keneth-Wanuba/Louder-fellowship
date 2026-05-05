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
    title: "Pearl of Africa Crusade",
    type: 'Evangelism',
    location: "Kampala, Uganda",
    timeframe: "March 2024",
    description: "A 5-day open-air crusade reaching over 4,000 souls in Namboole grounds with life-changing messages.",
    fullDescription: "The Pearl of Africa Crusade was a monumental 5-day evangelistic event held at the Namboole grounds. We saw unprecedented crowds hungry for the word of God. The focus was on soul winning, healing, and equipping the local saints for the work of the ministry. Through powerful preaching and prophetic ministry, thousands committed their lives to Christ.",
    funded: 85,
    image: "https://i.ibb.co/RGqsk9pn/image.png",
    gallery: [
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1000"
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
    title: "Feeding the Forgotten",
    type: 'Humanitarian Aid',
    location: "Karamoja, Uganda",
    timeframe: "Jan–Feb 2024",
    description: "Emergency food relief distributed to 600 families in drought-hit Karamoja regions.",
    fullDescription: "In response to the severe drought in the Karamoja region, Louder Fellowship launched the 'Feeding the Forgotten' initiative. Our teams delivered emergency food supplies, clean water, and medical essentials to over 600 families. We believe that meeting physical needs opens the door for spiritual transformation.",
    funded: 100,
    image: "https://i.ibb.co/kgLC3WdC/image.png",
    gallery: [
      "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=1000"
    ],
    impactStats: [
      { label: "Families Fed", value: "600" },
      { label: "Meals Provided", value: "18,000" },
      { label: "Tons of Food", value: "15" }
    ],
    stories: [
      { quote: "When the drought hit, we thought we were finished. The food arrived just in time.", name: "Sarah A." }
    ]
  },
  {
    id: 3,
    title: "Youth Arise Conference",
    type: 'Youth',
    location: "Jinja, Uganda",
    timeframe: "April 2024",
    description: "2-day leadership and discipleship conference for 500 young people from across the country.",
    fullDescription: "Youth Arise Conference brought together 500 teenagers and young adults for an intense 2-day discipleship program. The goal was to ignite a passion for Christ in the next generation. We had workshops on leadership, purity, and career development, all rooted in strong biblical principles.",
    funded: 60,
    image: "https://i.ibb.co/FL8wcCk5/image.png",
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"
    ],
    impactStats: [
      { label: "Attendees", value: "500" },
      { label: "Schools Represented", value: "24" },
      { label: "Workshops", value: "8" }
    ],
    stories: [
      { quote: "The conference showed me that as a young man, I have a place in the Kingdom.", name: "John Baptist" }
    ]
  },
  {
    id: 4,
    title: "Mobile Medical Camp",
    type: 'Health',
    location: "Masaka District",
    timeframe: "February 2024",
    description: "Free medical checkups, prayer, and HIV testing for 300+ community members in remote areas.",
    fullDescription: "Combining medical care with the healing power of Jesus, our Mobile Medical Camp set up in the remote Masaka District. Volunteer doctors and nurses provided free checkups, medication, and HIV testing. Simultaneously, our prayer teams ministered to the sick, seeing remarkable testimonies of physical healing.",
    funded: 100,
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
    title: "Back to School Mission",
    type: 'Education',
    location: "Gulu, Northern Uganda",
    timeframe: "January 2024",
    description: "School supplies and uniforms donated to 200 children from vulnerable families to support their education.",
    fullDescription: "Education is a powerful tool for breaking the cycle of poverty. The Back to School Mission targeted 200 vulnerable children in Northern Uganda, providing them with essential school supplies, backpacks, and uniforms for the new academic year.",
    funded: 72,
    image: "https://i.ibb.co/mrqKTXr5/image.png",
    gallery: [
      "https://i.ibb.co/mrqKTXr5/image.png"
    ],
    impactStats: [
      { label: "Children Supported", value: "200" },
      { label: "Backpacks Given", value: "200" },
      { label: "Uniforms Provided", value: "150" }
    ]
  },
  {
    id: 6,
    title: "Village Evangelism Tour",
    type: 'Evangelism',
    location: "Eastern Uganda",
    timeframe: "Ongoing",
    description: "Teams of trained evangelists visiting remote villages weekly with the gospel and support.",
    fullDescription: "The Eastern Uganda Evangelism tour isn't just about sharing messages; it's about building sustainable faith communities in villages that haven't seen a church in generations. We send out trained teams every week to share the gospel, baptize new believers, and establish local cell groups.",
    funded: 45,
    image: "https://i.ibb.co/b5hNzDvx/image.png",
    gallery: [
      "https://i.ibb.co/pj6440YQ/image.png"
    ],
    impactStats: [
      { label: "Villages Reached", value: "50+" },
      { label: "Baptisms in 2024", value: "1,200" },
      { label: "New Cell Groups", value: "20" }
    ],
    stories: [
      { quote: "For the first time in 40 years, our village has hope. Louder Fellowship didn't just bring words, they brought family.", name: "Elder Masaba" }
    ]
  }
];
