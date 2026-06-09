/* listening.js — 听力脚本 + 题目(TTS 朗读)。lines:[{speaker,text}] */
window.IELTS_DATA.listening = [
  {
    id: 'l001', title: 'Booking a Language Course', section: 'Section 1 · 生活对话', scenario: '电话咨询报名',
    lines: [
      { speaker: 'Receptionist', text: 'Good morning, Cambridge Language Centre. How can I help you?' },
      { speaker: 'Caller', text: 'Hi, I would like to enrol in an English evening course. Could you give me some details?' },
      { speaker: 'Receptionist', text: 'Of course. We have three levels: elementary, intermediate and advanced. Which one are you interested in?' },
      { speaker: 'Caller', text: 'I think the intermediate one. How often does it meet?' },
      { speaker: 'Receptionist', text: 'The intermediate class runs twice a week, on Tuesday and Thursday, from seven to nine in the evening.' },
      { speaker: 'Caller', text: 'That sounds good. And how much does it cost?' },
      { speaker: 'Receptionist', text: 'The full course is three hundred and forty pounds, but there is a discount for students, which brings it down to two hundred and ninety.' },
      { speaker: 'Caller', text: 'Great, I am a student. When does the course start?' },
      { speaker: 'Receptionist', text: 'It begins on the fifteenth of September and lasts for ten weeks.' },
      { speaker: 'Caller', text: 'Perfect. Do I need to bring anything to the first lesson?' },
      { speaker: 'Receptionist', text: 'Just a notebook and your student card for the discount. The textbook is provided free of charge.' },
      { speaker: 'Caller', text: 'Wonderful. Could I register now over the phone?' },
      { speaker: 'Receptionist', text: 'Certainly. May I take your full name and a contact number?' }
    ],
    questions: [
      { type: 'mc', q: 'Which level does the caller choose?', options: ['Elementary', 'Intermediate', 'Advanced', 'Beginner'], answer: 1, explanation: '来电者选 intermediate。' },
      { type: 'gap', q: 'The class meets on Tuesday and ________.', answer: ['Thursday'], explanation: '周二和周四。' },
      { type: 'gap', q: 'With the student discount, the course costs £________.', answer: ['290', 'two hundred and ninety'], explanation: '学生优惠后 290 镑。' },
      { type: 'mc', q: 'When does the course start?', options: ['5th September', '15th September', '15th October', '50th September'], answer: 1, explanation: '9 月 15 日开课。' },
      { type: 'gap', q: 'The course lasts for ________ weeks.', answer: ['10', 'ten'], explanation: '持续 10 周。' },
      { type: 'tfng', q: 'The student must buy the textbook separately.', answer: 'FALSE', explanation: '课本免费提供(free of charge)。' }
    ]
  },
  {
    id: 'l002', title: 'The History of Tea', section: 'Section 4 · 学术讲座', scenario: '课堂讲座',
    lines: [
      { speaker: 'Lecturer', text: 'Good afternoon, everyone. Today we will look at the surprising history of one of the world\'s most popular drinks: tea.' },
      { speaker: 'Lecturer', text: 'According to legend, tea was discovered in China nearly five thousand years ago, when leaves accidentally blew into a pot of boiling water.' },
      { speaker: 'Lecturer', text: 'For a long time, tea remained almost entirely an Asian product. It was valued not only as a drink but also as a medicine.' },
      { speaker: 'Lecturer', text: 'Tea reached Europe only in the seventeenth century, brought back by traders. At first it was extremely expensive and drunk mainly by the wealthy.' },
      { speaker: 'Lecturer', text: 'In Britain, tea quickly became fashionable. By the eighteenth century, demand had grown so much that it influenced trade routes and even taxation policies.' },
      { speaker: 'Lecturer', text: 'To meet this demand, the British began growing tea in India, particularly in the region of Assam, which had a suitable warm and wet climate.' },
      { speaker: 'Lecturer', text: 'Today, tea is produced in more than forty countries, but the two largest producers remain China and India.' },
      { speaker: 'Lecturer', text: 'Interestingly, the way tea is prepared varies enormously. In some cultures it is served with milk and sugar, while in others adding anything to it would be unthinkable.' }
    ],
    questions: [
      { type: 'gap', q: 'According to legend, tea was discovered in ________ about 5,000 years ago.', answer: ['China'], explanation: '传说茶起源于中国。' },
      { type: 'tfng', q: 'Tea was originally valued only as a drink, never as a medicine.', answer: 'FALSE', explanation: '它也被当作药物。' },
      { type: 'mc', q: 'When did tea reach Europe?', options: ['5th century', '15th century', '17th century', '19th century'], answer: 2, explanation: '17 世纪传入欧洲。' },
      { type: 'gap', q: 'The British grew tea in India, especially in the region of ________.', answer: ['Assam'], explanation: '印度阿萨姆地区。' },
      { type: 'mc', q: 'Which two countries are the largest tea producers today?', options: ['Britain and India', 'China and India', 'China and Japan', 'India and Kenya'], answer: 1, explanation: '中国和印度。' },
      { type: 'tfng', q: 'Tea is prepared in the same way across all cultures.', answer: 'FALSE', explanation: '不同文化做法差异很大。' }
    ]
  }
];
