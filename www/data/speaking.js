/* speaking.js — 口语主题(Part1/2/3 全套 + 范例 + 句型) */
window.IELTS_DATA.speaking = [
  {
    id: 's001', title: 'Hometown', topic: 'Your hometown',
    intro_questions: [
      'Where is your hometown?',
      'What do you like most about it?',
      'Has your hometown changed much in recent years?',
      'Would you like to live there in the future?'
    ],
    cue_card: {
      prompt: 'Describe a place in your hometown that you enjoy visiting.',
      bullets: ['where it is', 'how often you go there', 'what you do there', 'and explain why you enjoy it']
    },
    part3_questions: [
      'How have cities in your country changed over the past few decades?',
      'Do you think people prefer living in big cities or small towns? Why?',
      'What can governments do to make cities better places to live?'
    ],
    sample_answer: 'One place I really enjoy visiting in my hometown is the old riverside park near the city centre. It is only about ten minutes from where I grew up, so I used to go there almost every weekend, and I still visit whenever I go back.\n\nWhat I usually do is quite simple — I take a slow walk along the water, sometimes with a coffee, and just watch people cycling or families having picnics. In spring the cherry trees are absolutely stunning.\n\nThe main reason I love it is that it gives me a sense of calm that is hard to find elsewhere. No matter how stressful life gets, half an hour by the river always clears my head.',
    useful_phrases: [
      { en: 'What I like most about it is...', zh: '我最喜欢它的一点是……' },
      { en: 'It gives me a sense of calm / belonging.', zh: '它给我一种平静/归属感。' },
      { en: 'I used to... but nowadays I tend to...', zh: '我过去……但现在我往往……' },
      { en: 'To be honest, / Actually, ...', zh: '说实话/其实……' }
    ],
    gemini_prompt: 'You are my IELTS speaking examiner. Topic: Hometown. Run a full mock test: Part 1 (4 warm-up questions about my hometown), then a Part 2 cue card "Describe a place in your hometown that you enjoy visiting" (give me 1 minute to prepare, then 2 minutes to speak), then 3 Part 3 questions about cities and urban life, asked one at a time. After I finish, give me band scores (0-9) for Fluency, Lexical Resource, Grammar and Pronunciation, plus 3 specific tips to reach band 7.5. Use voice mode if possible and wait for my answer before continuing.'
  },
  {
    id: 's002', title: 'A Memorable Journey', topic: 'Travel and experiences',
    intro_questions: [
      'Do you enjoy travelling?',
      'How do you usually plan your trips?',
      'Do you prefer travelling alone or with others?',
      'What kind of places do you like to visit?'
    ],
    cue_card: {
      prompt: 'Describe a journey or trip that you remember well.',
      bullets: ['where you went', 'who you went with', 'what you did there', 'and explain why it was memorable']
    },
    part3_questions: [
      'Why do you think travelling has become so popular nowadays?',
      'Does tourism always benefit local communities?',
      'How might the way people travel change in the future?'
    ],
    sample_answer: 'A trip that has really stuck in my memory was a journey I took to the mountains in the north of my country a couple of years ago. I went with two of my closest university friends, mostly because we wanted a break after our final exams.\n\nWe spent four days hiking, staying in a small guesthouse run by a lovely elderly couple. During the day we trekked through pine forests, and in the evenings we just sat around talking and looking at the stars, which were incredibly bright so far from the city.\n\nWhat made it so memorable was the combination of stunning scenery and good company. It was the first time I had felt completely disconnected from work and technology, and oddly enough, that is exactly what made it so refreshing.',
    useful_phrases: [
      { en: 'A trip that has really stuck in my memory was...', zh: '一次让我记忆犹新的旅行是……' },
      { en: 'What made it so memorable was...', zh: '让它如此难忘的是……' },
      { en: 'Oddly enough, / Surprisingly, ...', zh: '奇怪的是/出乎意料的是……' },
      { en: 'It was a once-in-a-lifetime experience.', zh: '那是一次千载难逢的体验。' }
    ],
    gemini_prompt: 'You are my IELTS speaking examiner. Topic: A memorable journey. Conduct a full mock: Part 1 (4 questions about travel), Part 2 cue card "Describe a journey or trip that you remember well" (1 min prep, 2 min talk), then 3 Part 3 questions about tourism and the future of travel, one at a time. Afterwards, score me on the four IELTS criteria (0-9 each) and give 3 concrete suggestions to reach band 7.5. Ask one question at a time and wait for my spoken reply.'
  },
  {
    id: 's003', title: 'Technology in Daily Life', topic: 'Technology',
    intro_questions: [
      'How often do you use a smartphone?',
      'What app do you find most useful?',
      'Do you think you spend too much time on screens?',
      'How did you learn to use new technology?'
    ],
    cue_card: {
      prompt: 'Describe a piece of technology you find useful.',
      bullets: ['what it is', 'how you use it', 'how often you use it', 'and explain why it is useful to you']
    },
    part3_questions: [
      'How has technology changed the way people communicate?',
      'Are there any downsides to relying on technology so heavily?',
      'Do you think artificial intelligence will create or destroy jobs?'
    ],
    sample_answer: 'The piece of technology I find most useful is, without a doubt, my smartphone — but if I had to pick one feature, it would be the translation and language-learning apps on it.\n\nI use them every single day. Whenever I come across an English word I do not know, I look it up instantly, and I also do short vocabulary drills while commuting. So I would say I rely on it for at least an hour a day in total.\n\nThe reason it is so valuable to me is that it turns dead time into productive time. Instead of just scrolling through social media on the bus, I can actually make progress towards my goals, which I find genuinely motivating.',
    useful_phrases: [
      { en: 'If I had to pick one, it would be...', zh: '如果非要选一个,那就是……' },
      { en: 'I rely on it for... / I cannot do without it.', zh: '我靠它来……/我离不开它。' },
      { en: 'It turns dead time into productive time.', zh: '它把碎片时间变成高效时间。' },
      { en: 'There is a flip side to this, though.', zh: '不过这也有另一面。' }
    ],
    gemini_prompt: 'You are my IELTS speaking examiner. Topic: Technology in daily life. Run a full mock test: Part 1 (4 questions about technology and phones), Part 2 cue card "Describe a piece of technology you find useful" (1 min prep, 2 min talk), then 3 Part 3 questions about communication, dependence on technology and AI, one at a time. Then give band scores for the four criteria and 3 tips to reach 7.5. One question at a time; wait for my answer.'
  },
  {
    id: 's004', title: 'A Skill You Want to Learn', topic: 'Skills and learning',
    intro_questions: [
      'What skills are useful in your job or studies?',
      'Do you prefer learning by yourself or with a teacher?',
      'Is it ever too late to learn something new?',
      'How do you stay motivated when learning?'
    ],
    cue_card: {
      prompt: 'Describe a skill you would like to learn.',
      bullets: ['what the skill is', 'how you would learn it', 'how long it might take', 'and explain why you want to learn it']
    },
    part3_questions: [
      'Why do some people give up when learning a new skill?',
      'Should schools focus more on practical skills than on academic knowledge?',
      'How might the skills people need change in the future?'
    ],
    sample_answer: 'A skill I have always wanted to master is public speaking. I can hold a conversation comfortably, but standing in front of a large audience still makes me nervous, and I would love to change that.\n\nI think the best way to learn it would be through a combination of a structured course and a lot of real practice — perhaps joining a speaking club where I could present regularly and get feedback. Realistically, becoming genuinely confident would probably take a year or so of consistent effort.\n\nThe main reason I want to learn it is career-related. In almost any profession, being able to express ideas clearly and persuasively can set you apart, so I see it as an investment that would pay off for the rest of my life.',
    useful_phrases: [
      { en: 'A skill I have always wanted to master is...', zh: '我一直想掌握的一项技能是……' },
      { en: 'The best way to learn it would be through...', zh: '学习它最好的方式是……' },
      { en: 'It would pay off in the long run.', zh: '从长远看它会有回报。' },
      { en: 'It can really set you apart.', zh: '它能让你脱颖而出。' }
    ],
    gemini_prompt: 'You are my IELTS speaking examiner. Topic: A skill you want to learn. Conduct a full mock: Part 1 (4 questions about skills and learning), Part 2 cue card "Describe a skill you would like to learn" (1 min prep, 2 min talk), then 3 Part 3 questions about learning, education and the future of work, one at a time. Finally, give band scores on the four IELTS criteria and 3 specific tips to reach band 7.5. Ask one at a time and wait for my reply.'
  }
];
