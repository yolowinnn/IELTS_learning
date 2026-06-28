/* exam_bank.js — 当期"真题/机经"题库:口语 Part2 题卡(2026年5–8月在考轮次,考生回忆)+ 写作 Task2 近期真题(2025–2026 考生回忆)。
   说明:雅思真题保密、官方从不公开原卷;以下为全球考生回忆汇编的"当前在考题目",是最接近实战的题源。仅收录题目本身(非任何机构的范文)。 */
(function () {
  var SPK_SRC = 'IELTS Speaking Part 2 · candidate-recalled exam questions (机经) · May–Aug 2026';
  var WRT_SRC = 'IELTS Writing Task 2 · recent reported exam questions (机经) · 2025–2026';

  // —— 口语 Part 2 题卡:[prompt, [bullets...]] ——
  var cues = [
    ['Describe a time when you felt proud of a family member', ['When it happened', 'Who the person is', 'What the person did', 'Why you felt proud of him/her']],
    ['Describe a perfect job you would like to have in the future', ['What it is', 'How you knew it', 'What you need to learn to get the job', 'Why you think it is a perfect job for you']],
    ['Describe a famous person you would like to meet', ['Who he/she is', 'How you knew him/her', 'How/where you would like to meet him/her', 'Why you would like to meet him/her']],
    ['Describe an occasion when you were not allowed to use your mobile phone', ['When it was', 'Where it was', 'Why you were not allowed to use your mobile phone', 'How you felt about it']],
    ['Describe an occasion when many people were smiling', ['When it happened', 'Who you were with', 'What happened', 'Why many people were smiling']],
    ['Describe a story you have read recently', ['What it is about', 'When you read it', 'Whether you liked it', 'What you have learned from it']],
    ['Describe a program or app on your computer or phone', ['What it is', 'When/how you use it', 'Where you found it', 'How you feel about it']],
    ['Describe a child you know who likes drawing very much', ['How you knew him/her', 'What he/she is like', 'How often he/she draws', 'Why you think he/she likes drawing']],
    ['Describe a piece of technology (not a phone) that you would like to own', ['What it is', 'How much it costs', 'What you will use it for', 'Why you would like to own it']],
    ['Describe a person who makes plans a lot and is good at planning', ['Who he/she is', 'How you knew him/her', 'What plans he/she makes', 'How you feel about this person']],
    ['Describe a foreign country you would like to stay or work in for a short period of time', ['Which country it is', 'Where you got to know this country', 'What you will do there', 'Why you will stay or work there just for a short period of time']],
    ['Describe a time when you gave advice to others', ['When it was', 'To whom you gave the advice', 'What the advice was', 'Why you gave the advice']],
    ['Describe something important that has been kept in your family for a long time', ['What it is', 'When your family had it', 'How your family got it', 'Why it is important to your family']],
    ['Describe a shopping mall', ['What its name is', 'Where it is', 'How often you visit it', 'What you usually buy at the mall']],
    ['Describe a bicycle/motorcycle/car trip you would like to go on', ['Who you would like to go with', 'Where you would like to go', 'When you would like to go', 'Why you would like to go by bicycle/motorcycle/car']],
    ['Describe a person who solved a problem in a smart way', ['Who this person is', 'What the problem was', 'How he/she solved it', 'Why you think he/she did it in a smart way']],
    ['Describe a person who encouraged you to protect nature', ['Who he/she is', 'How he/she encouraged you', 'What he/she encouraged you to do', 'How you feel about this person']],
    ['Describe one of your friends who learned something without a teacher', ['Who he/she is', 'What skill he/she learned', 'Why he/she learned this', 'Whether it would be easier to learn from a teacher']],
    ['Describe a music event that you did not enjoy', ['What it was', 'Who you went with', 'Why you decided to go there', 'Why you did not enjoy it']],
    ['Describe a movie you watched and enjoyed recently', ['When and where you watched it', 'Who you watched it with', 'What it was about', 'Why you watched this movie']],
    ['Describe a time you needed to use your imagination', ['When it was', 'Why you needed to use imagination', 'How difficult or easy it was', 'How you felt about it']],
    ['Describe an interesting building', ['Where it is', 'What it looks like', 'What function it has', 'Why you think it is interesting']],
    ['Describe a person who often helps others', ['Who this person is', 'How often he/she helps others', 'How/why he/she helps others', 'How you feel about this person']],
    ['Describe an item on which you spent more than expected', ['What it is', 'How much you spent on it', 'Why you bought it', 'Why you think you spent more than expected']],
    ['Describe a time when you encouraged someone to do something that he/she did not want to do', ['Who he or she is', 'What you encouraged him/her to do', 'How he/she reacted', 'Why you encouraged him/her to do it']],
    ['Describe a TV/online program you enjoy watching', ['What it is', 'What it is about', 'Which country it is from', 'When you watch it and why you like it']],
    ['Describe a short-term job you want to have in a foreign country', ['Where it is', 'How you know of it', 'What the job is', 'Why you want to do it']],
    ['Describe a good friend who is important to you', ['Who he/she is', 'How/where you got to know him/her', 'How long you have known each other', 'Why he/she is important to you']],
    ['Describe a wild animal that you want to know more about', ['What it is', 'When/where you saw it', 'Why you want to know more about it', 'What you want to know more about it']],
    ['Describe a friend of yours who is good at music/singing', ['Who he/she is', 'When/where you listen to his/her music/singing', 'What kind of music/songs he/she is good at', 'How you feel when listening to it']],
    ['Describe an occasion when you lost your way', ['Where you were', 'What happened', 'How you felt', 'How you found your way']],
    ['Describe a trip you would like to make again', ['Where and when you went', 'Who you made the trip with', 'What you did during the trip', 'Why you would like to make the trip again']],
    ['Describe a person you know who enjoys working for a family business', ['Who he/she is', 'What the business is', 'What his/her job is', 'Why he/she enjoys working there']],
    ['Describe a natural talent (sports, music, etc.) you want to improve', ['What it is', 'When you discovered it', 'How you want to improve it', 'How you feel about it']],
    ['Describe a great dinner you and your friends or family members enjoyed', ['What you had', 'Who you had the dinner with', 'What you talked about during the dinner', 'Why you enjoyed it']],
    ['Describe a long journey you had', ['Where you went', 'Who you had the journey with', 'Why you had the journey', 'How you felt about the journey']],
    ['Describe an interesting traditional story', ['What the story is about', 'When/how you knew it', 'Who told you the story', 'How you felt when you first heard it']],
    ['Describe a time when the electricity suddenly went off', ['When/where it happened', 'What you were doing at the time', 'What you did after it went off', 'How you felt about it']],
    ['Describe a time when someone apologized to you', ['When it was', 'Who apologized to you', 'Why they apologized', 'How you felt about it']],
    ['Describe an exciting activity you have tried for the first time', ['What it is', 'When/where you did it', 'Why you thought it was exciting', 'How you felt about it']],
    ['Describe a creative person (e.g. an artist, a musician) you admire', ['Who he/she is', 'How you knew him/her', 'What his/her greatest achievement is', 'Why you think he/she is creative']],
    ['Describe an important old thing that your family has kept for a long time', ['What it is', 'How/when your family first got this thing', 'How long your family has kept it', 'Why this thing is important to your family']],
    ['Describe the time when you first talked in a foreign language', ['Where you were', 'Who you were with', 'What you talked about', 'How you felt about it']],
    ['Describe a time you saw something interesting on social media', ['When it was', 'Where you saw it', 'What you saw', 'Why you think it was interesting']],
    ['Describe a time when you broke something', ['What it was', 'When/where that happened', 'How you broke it', 'What you did after that']],
    ['Describe an area/subject of science you are interested in', ['Which area/subject it is', 'When and where you came to know this', 'How you get information about this area/subject', 'Why you are interested in it']],
    ['Describe a book you read that you found useful', ['What it is', 'When you read it', 'Why you think it is useful', 'How you felt about it']],
    ['Describe a successful sportsperson you admire', ['Who he/she is', 'What you know about him/her', 'What he/she is like in real life', 'Why you admire him/her']],
    ['Describe a toy you liked in your childhood', ['What kind of toy it is', 'When you received it', 'How you played with it', 'How you felt about it']],
    ['Describe an important decision made with the help of other people', ['What the decision was', 'Why you made the decision', 'Who helped you make the decision', 'How you felt about it']],
    ['Describe an interesting building you saw during a trip', ['Where you saw it', 'What it looks like', 'What you have known about it', 'Why you think it is interesting']],
    ['Describe a time when you waited for something special that would happen', ['What you waited for', 'Where you waited', 'Why it was special', 'How you felt while you were waiting']],
    ['Describe a time when you received good service in a shop/store', ['Where the shop is', 'When you went to the shop', 'What service you received from the staff', 'How you felt about the service']],
    ['Describe a natural place (e.g. parks, mountains)', ['Where this place is', 'How you knew this place', 'What it is like', 'Why you like to visit it']],
    ['Describe a quiet place you like to go to', ['Where it is', 'How you knew it', 'How often you go there', 'What you do there and how you feel']],
    ['Describe a city that you have been to and would like to visit again', ['When you visited it', 'What you did there', 'What it was like', 'Why you would like to visit it again']]
  ];

  // —— 写作 Task 2 近期真题(已轻度修正回忆稿明显笔误)——
  var w2 = [
    'Some people say that seeing ancient objects in a museum can give the public a unique awareness of history. Others say that modern media such as films or talks on the internet provide a more effective way for the public to learn about history. Discuss both these views and give your own opinion.',
    'Some people think that children are having too much free time and that this time should be used to study more. To what extent do you agree with this statement?',
    'It is inevitable that as technology advances, traditional cultures will be lost. It seems that we cannot have these two things together. To what extent do you agree or disagree?',
    'Some people think that secondary or high school students should be taught how to manage money, as it is an important life skill. Do you agree or disagree with the statement?',
    'Many people think children should not be punished at an early age. To what extent do you agree or disagree? What sort of punishment may be applied to children?',
    'As mass communication and transport continue to grow, societies are becoming more and more alike, leading to a phenomenon known as globalisation. Some people fear that globalisation will inevitably lead to the total loss of cultural identity. To what extent do you agree or disagree with this statement?',
    'In most successful organizations, some people believe that communication between managers and workers is important, while others say that other factors are more important. What is your opinion?',
    'In many countries, some people live with their families while studying, but other students prefer to attend universities in other cities. Do the benefits of living away from home outweigh the disadvantages?',
    'There is an increasing trend of older people living longer in many countries around the world. Do you think this has a positive or a negative effect on the population as a whole?',
    'People’s shopping habits depend more on the age group they belong to than on any other factor. To what extent do you agree or disagree?',
    'In some countries, people follow the latest fashion and hairstyles. In your opinion, what is influencing this? Is it a good or a bad thing?',
    'Learning a new language at an early age is helpful for children. Is it more positive for their future, or does it have some adverse effects? Do you agree or disagree?',
    'More and more people are buying things on the internet, like air tickets, books and groceries, making online shopping more popular every day. Do the advantages of such shopping outweigh the disadvantages?',
    'Nowadays, more and more people choose to do their shopping online instead of going to physical stores. Why is this so? What are the disadvantages of this trend?',
    'In many countries today, both men and women need to work full time. Therefore, some people think men and women should share household tasks equally (e.g. cleaning and looking after children). To what extent do you agree or disagree?',
    'In today’s competitive world, many families find it necessary for both parents to work. While some believe that children in these families benefit from the additional income, others believe that they lack support because of their parents’ absence. Discuss both views and give your opinion.',
    'The best way to solve the world’s environmental problems is to increase the price of fuel. To what extent do you agree or disagree?',
    'Traffic and housing problems in major cities could be solved by moving large companies and factories, along with their employees, to the countryside. To what extent do you agree or disagree with this opinion?',
    'Some people think that school uniforms are unnecessary and should be banned. To what extent do you agree or disagree?',
    'Some people believe that children should spend all of their free time with their parents. Others believe that this is unnecessary or even negative. Discuss the possible arguments on both sides, and say which side you personally support.',
    'Some people think that the government should make university education free for all students, regardless of their financial situation. To what extent do you agree or disagree?',
    'In many countries, children do not do as much physical exercise as before and tend to become more and more overweight. What are the reasons and solutions for this?',
    'Some people believe that culture will be ruined if it is used to earn tourism revenue, while others consider that tourism is the only way of protecting culture. Discuss both sides and give your own opinion.',
    'Governments are encouraging industries and businesses to move from large cities to regional areas. Do the advantages outweigh the disadvantages?',
    'Playing team sports is good for children to prepare for working life. To what extent do you agree or disagree? Discuss both views and give your opinion.',
    'In some countries, there has been an increase in the number of advertisements that try to persuade children to buy snacks, toys and other goods. Some people claim this is unfair as parents feel under pressure to buy these things for their children. To what extent do you agree or disagree?',
    'Education and health care should be funded by the government and free for everyone. To what extent do you agree or disagree with this opinion?',
    'Some people believe that no one should be allowed to continue working after the age of 65. However, others say that there should be no limitation on age and anyone should be allowed to work regardless of their age. Discuss both views and give your opinion.',
    'Some people believe that there are various reasons that can motivate a person to keep working for the same company, whereas others say that money is the main reason that gives motivation. Do you agree or disagree?',
    'Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both views and give your own opinion.',
    'With modern transportation, workers and students are increasingly mobile and have more and more opportunities to study and work abroad. Discuss the advantages and disadvantages of this development.',
    'Some people think it is not necessary for adults to receive education in class. Self-study is a good way for them to study more effectively. To what extent do you agree or disagree?',
    'We should introduce laws to make businesses and state services employ equal numbers of male and female workers in every department or area of the company. How far do you agree with this idea?',
    'Teenagers should not be allowed to use mobile phones at school. To what extent do you agree?',
    'Some people think that buildings such as flats and houses should be designed to last a long time. Others believe that it is more important to provide accommodation quickly and cheaply. Discuss both these views and give your own opinion.',
    'Some people think that hosting an international sports event is good for a country, while others think it is bad. Discuss both views and state your opinion.',
    'Do you agree or disagree with the following statement: it is more important to work at a job you enjoy than to make a lot of money? Support your answer with specific reasons and examples.',
    'In the last 20 years, there have been significant developments in the field of information technology, for example the World Wide Web and communication by email. However, these developments are likely to have more negative effects than positive ones in the future. To what extent do you agree with this view?',
    'Newspapers have influenced people’s ideas and opinions. What are the reasons for this? Is this a positive or a negative situation?',
    'Some people argue that the public should be allowed to own guns, while others do not agree. Discuss both views and give your opinion.',
    'Some people think that modern technology has more negative effects on our lives than positive ones. To what extent do you agree or disagree?',
    'Some teachers think that international student exchange programs would be beneficial for all teenage school students. Do you think the advantages outweigh the disadvantages?',
    'Some people believe that young people should follow the older generation’s example. Others disagree and believe that it is good to challenge older people’s opinions and thoughts. Discuss both views and give your own opinion.',
    'The government should make people take responsibility for their actions towards the environment. To what extent do you agree?',
    'People from poor and rural backgrounds find it difficult to get a university education. Some people think that governments should make it easier for them to enter universities. To what extent do you agree or disagree with this opinion?',
    'Public transport could be made free of charge. Are there more advantages or disadvantages to this change?',
    'Some people see sports only as a leisure activity, while others believe sports play a more important role. Discuss both views and give your opinion.',
    'How a child grows up depends on how they were brought up by their parents. To what extent do you agree or disagree?',
    'Cycling is a healthier and more environmentally friendly means of transport. Nevertheless, cycling is becoming less popular. What are the reasons for this trend, and what can be done to make cycling more popular?',
    'Some people think that the increasing use of artificial intelligence in the workplace will benefit society, while others worry it will cause more harm than good. Discuss both views and give your own opinion.'
  ];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function titleOf(prompt) {
    var t = prompt.replace(/^Describe (a |an |the )?/i, '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function wtype(q) {
    if (/discuss both/i.test(q)) return 'Discuss both views';
    if (/outweigh|advantages? and disadvantages?|more advantages or disadvantages/i.test(q)) return 'Advantages / Disadvantages';
    if (/reasons?.*(solutions?|what can be done)|problem.*solution/i.test(q)) return 'Problem / Solution';
    if (/what (are|is) the reasons?|why is this|why is this so/i.test(q)) return 'Two-part question';
    if (/positive or (a )?negative|good or (a )?bad/i.test(q)) return 'Positive or negative';
    return 'Agree / Disagree';
  }

  window.IELTS_DATA.speaking = window.IELTS_DATA.speaking || [];
  cues.forEach(function (c, i) {
    window.IELTS_DATA.speaking.push({
      id: 'sb' + pad(i + 1),
      title: titleOf(c[0]),
      topic: c[0],
      source: SPK_SRC,
      cue_card: { prompt: c[0], bullets: c[1] }
    });
  });

  window.IELTS_DATA.writing = window.IELTS_DATA.writing || [];
  w2.forEach(function (q, i) {
    window.IELTS_DATA.writing.push({
      id: 'wb' + pad(i + 1),
      task: 2,
      title: wtype(q) + ' · Q' + (i + 1),
      type: wtype(q),
      prompt: q,
      min_words: 250,
      source: WRT_SRC
    });
  });
})();
