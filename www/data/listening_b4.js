/* listening_b4.js */
window.IELTS_DATA.listening.push(
  {
    id:"l009",
    title:"Opening a Student Bank Account",
    section:"Section 1 · 生活对话",
    scenario:"一名新生 Olivia 到银行咨询并办理学生账户。银行职员 Thomas 介绍账户类型、利率、所需证件,并记录她的姓名、出生日期和联系方式。注意听数字、日期、价格和姓名拼写。",
    lines:[
      { speaker:"Thomas", text:"Good afternoon, welcome to Riverside Bank. My name's Thomas. How can I help you today?" },
      { speaker:"Olivia", text:"Hi Thomas. I've just started at the university and I'd like to open a student account, please." },
      { speaker:"Thomas", text:"Certainly. We have two student accounts. The basic one is free, and the gold one costs three pounds a month but comes with travel insurance and a larger overdraft." },
      { speaker:"Olivia", text:"What overdraft do I get with the basic account?" },
      { speaker:"Thomas", text:"With the basic account you get an interest-free overdraft of up to one thousand pounds. With the gold account that rises to fifteen hundred." },
      { speaker:"Olivia", text:"A thousand is more than enough for me, so I'll go with the basic one. Does it pay any interest on savings?" },
      { speaker:"Thomas", text:"It does, a small amount. The current rate is one point five percent a year, paid monthly into your account." },
      { speaker:"Olivia", text:"That's fine. What do I need to bring to open it?" },
      { speaker:"Thomas", text:"Two things, really. A form of photo identification, such as your passport, and proof of your address, like a recent utility bill or a letter from the university." },
      { speaker:"Olivia", text:"I've got my passport here, and I can bring my accommodation letter tomorrow. Can I start the application now?" },
      { speaker:"Thomas", text:"Of course. Let me just take a few details. Could I have your full name, please?" },
      { speaker:"Olivia", text:"Yes, it's Olivia Hartley. The surname is spelt H-A-R-T-L-E-Y." },
      { speaker:"Thomas", text:"Thank you. And your date of birth?" },
      { speaker:"Olivia", text:"The third of March, two thousand and four." },
      { speaker:"Thomas", text:"Lovely. And finally, a mobile number so we can send you a security code?" },
      { speaker:"Olivia", text:"It's oh-seven-eight-one-two, four-five-six, nine-double-three. I'll come back tomorrow with the letter to finish everything off." }
    ],
    questions:[
      { type:"mc", q:"Which account does Olivia decide to open?", options:["The gold account","The basic account","A joint account","A business account"], answer:1, explanation:"Olivia 说一千镑透支额度对她足够,'I'll go with the basic one',故选 B(索引 1)。" },
      { type:"gap", q:"The basic account offers an interest-free overdraft of up to ____ pounds.", answer:["1000","a thousand","one thousand"], explanation:"Thomas 说 basic account 'an interest-free overdraft of up to one thousand pounds'。" },
      { type:"gap", q:"The current savings interest rate is ____ percent a year.", answer:["1.5","one point five"], explanation:"Thomas 说 'The current rate is one point five percent a year'。" },
      { type:"tfng", q:"Olivia has brought both her passport and her accommodation letter to the bank today.", answer:"FALSE", explanation:"Olivia 说护照带了,但住宿证明信要 'bring my accommodation letter tomorrow',并非两样都带齐,故为 FALSE。" },
      { type:"gap", q:"Olivia's surname is spelt ____.", answer:["hartley"], explanation:"Olivia 拼出姓氏 'H-A-R-T-L-E-Y',即 Hartley。" },
      { type:"mc", q:"What is Olivia's date of birth?", options:["3rd March 2004","13th March 2004","3rd May 2004","30th March 2004"], answer:0, explanation:"Olivia 说 'The third of March, two thousand and four',即 2004 年 3 月 3 日,故选 A(索引 0)。" }
    ]
  },
  {
    id:"l010",
    title:"Welcome to Greenfield Country Park",
    section:"Section 2 · 设施导览",
    scenario:"一名园区向导向新到访的游客介绍 Greenfield 乡村公园的设施、开放时间、活动安排和注意事项。speaker 为单人独白。注意听时间、地点和价格。",
    lines:[
      { speaker:"Guide", text:"Hello everyone, and a very warm welcome to Greenfield Country Park. My name's Sam, and I'll give you a quick overview before you set off to explore." },
      { speaker:"Guide", text:"The park is open every day from eight in the morning until dusk. The main car park is just behind the visitor centre, and it costs four pounds for the whole day." },
      { speaker:"Guide", text:"There are three marked walking trails. The blue trail is the shortest at two kilometres and is suitable for wheelchairs and buggies. The red trail is the most challenging, taking you up to the viewpoint on the hill." },
      { speaker:"Guide", text:"If you've brought children, the adventure playground is next to the lake and is completely free to use. Please note that the lake itself is for fishing only, so swimming is not allowed at any time." },
      { speaker:"Guide", text:"For refreshments, the Lakeside Cafe serves hot meals until three in the afternoon, and drinks and snacks until it closes at half past four." },
      { speaker:"Guide", text:"Every Saturday morning at ten thirty, one of our rangers leads a free guided bird walk. It's very popular, so I'd recommend booking a place at the information desk." },
      { speaker:"Guide", text:"A quick word about dogs. They're very welcome on the trails, but they must be kept on a lead in the wildlife area, where ground-nesting birds are easily disturbed." },
      { speaker:"Guide", text:"Finally, if you'd like a souvenir, the gift shop in the visitor centre stocks maps, local honey and postcards. Do enjoy your visit, and please take all your litter home with you." }
    ],
    questions:[
      { type:"gap", q:"All-day parking at the main car park costs ____ pounds.", answer:["4","four"], explanation:"向导说 main car park 'costs four pounds for the whole day'。" },
      { type:"mc", q:"Which trail is suitable for wheelchairs and buggies?", options:["The red trail","The blue trail","The hill viewpoint trail","All three trails"], answer:1, explanation:"向导说 blue trail 最短(两公里)且 'suitable for wheelchairs and buggies',故选 B(索引 1)。" },
      { type:"tfng", q:"Visitors are allowed to swim in the lake.", answer:"FALSE", explanation:"向导说湖只用于钓鱼,'swimming is not allowed at any time',故为 FALSE。" },
      { type:"gap", q:"The Lakeside Cafe stops serving hot meals at ____ in the afternoon.", answer:["3","three"], explanation:"向导说咖啡馆 'serves hot meals until three in the afternoon'。" },
      { type:"mc", q:"When does the free guided bird walk take place?", options:["Every morning at eight","Saturday morning at ten thirty","Saturday afternoon at three","Sunday morning at ten thirty"], answer:1, explanation:"向导说 'Every Saturday morning at ten thirty' 有免费观鸟导览,故选 B(索引 1)。" },
      { type:"tfng", q:"Dogs must be kept on a lead in the wildlife area.", answer:"TRUE", explanation:"向导说狗在 wildlife area 'must be kept on a lead',因为地面筑巢的鸟容易受惊,故为 TRUE。" }
    ]
  },
  {
    id:"l011",
    title:"An Introduction to Renewable Energy",
    section:"Section 4 · 学术讲座",
    scenario:"一位讲师向本科生介绍可再生能源,讲解主要类型、各自的优缺点以及未来发展的关键挑战。注意听具体数据和术语。",
    lines:[
      { speaker:"Lecturer", text:"Good morning everyone. Today we'll be looking at renewable energy, the sources of power that, unlike coal or oil, will not run out within human timescales." },
      { speaker:"Lecturer", text:"Globally, renewables already supply around thirty percent of the world's electricity, and that share is rising every year as costs continue to fall." },
      { speaker:"Lecturer", text:"Let's start with solar power. Photovoltaic panels convert sunlight directly into electricity. Their great advantage is that the fuel, sunlight, is completely free, though output obviously drops on cloudy days and at night." },
      { speaker:"Lecturer", text:"Wind power is the second major source. Modern turbines are remarkably efficient, but they have one well-known drawback: they only generate electricity when the wind is actually blowing." },
      { speaker:"Lecturer", text:"This brings us to the central problem of both solar and wind, which engineers call intermittency. Because the supply varies, we need ways to store energy for when the sun isn't shining and the wind isn't blowing." },
      { speaker:"Lecturer", text:"Hydropower, by contrast, is far more reliable. Water held behind a dam can be released on demand, and it currently provides the largest share of all renewable electricity worldwide." },
      { speaker:"Lecturer", text:"However, large dams are not without problems. Building them can flood huge areas of land and force communities to move, so the environmental cost is not always small." },
      { speaker:"Lecturer", text:"A fourth source, often overlooked, is geothermal energy, which uses heat from deep within the Earth. It's extremely reliable, but it's only practical in regions where that heat is close to the surface." },
      { speaker:"Lecturer", text:"So the future is unlikely to rely on a single technology. Instead, most experts expect a mix of sources, combined with much better storage, to be the key to a stable, low-carbon grid." },
      { speaker:"Lecturer", text:"In next week's lecture, we'll focus specifically on battery storage and examine why it may turn out to be the most important technology of all." }
    ],
    questions:[
      { type:"gap", q:"Renewables currently supply around ____ percent of the world's electricity.", answer:["30","thirty"], explanation:"讲师说 renewables 'already supply around thirty percent of the world's electricity'。" },
      { type:"mc", q:"According to the lecturer, what is the main advantage of solar power?", options:["It works equally well at night","The fuel, sunlight, is free","It never varies with the weather","It needs no panels"], answer:1, explanation:"讲师说太阳能最大优势是 'the fuel, sunlight, is completely free',故选 B(索引 1);夜晚和阴天反而出力下降。" },
      { type:"gap", q:"Engineers use the term ____ to describe the problem that solar and wind supply varies.", answer:["intermittency"], explanation:"讲师说 solar 和 wind 的核心问题 'engineers call intermittency'。" },
      { type:"tfng", q:"Hydropower provides the largest share of renewable electricity worldwide.", answer:"TRUE", explanation:"讲师说水电 'provides the largest share of all renewable electricity worldwide',故为 TRUE。" },
      { type:"tfng", q:"The lecturer says large dams have no environmental drawbacks.", answer:"FALSE", explanation:"讲师说大坝会淹没大片土地、迫使社区搬迁,'the environmental cost is not always small',故为 FALSE。" },
      { type:"mc", q:"What does the lecturer say is the key to a stable, low-carbon grid?", options:["Relying on a single technology","A mix of sources with better storage","Using only hydropower","Abandoning solar and wind"], answer:1, explanation:"讲师说未来不会依赖单一技术,而是 'a mix of sources, combined with much better storage',故选 B(索引 1)。" }
    ]
  }
);
