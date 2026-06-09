/* reading.js — 阅读文章 + 题目(持续扩充) */
window.IELTS_DATA.reading = [
  {
    id: 'r001', title: 'The Return of Urban Green Spaces', topic: '环境/城市', words: 640,
    paras: [
      'For much of the twentieth century, city planners treated parks and gardens as pleasant but optional additions to the urban landscape. Roads, housing and commercial districts took priority, and green areas were often the first things to be sacrificed when land became scarce. In recent decades, however, this attitude has changed dramatically. A growing body of research now suggests that green spaces are not a luxury but a necessity for the health of both cities and their inhabitants.',
      'One of the clearest benefits of urban vegetation is its effect on temperature. Cities are typically several degrees warmer than the surrounding countryside, a problem known as the urban heat island effect. Concrete and asphalt absorb heat during the day and release it slowly at night, keeping cities uncomfortably hot. Trees and grass, by contrast, cool the air through shade and through a process called evapotranspiration, in which plants release water vapour. Studies in several large cities have found that well-planted neighbourhoods can be up to five degrees cooler than areas with little vegetation.',
      'Green spaces also play an important role in managing water. When rain falls on a paved surface, it runs off quickly, overwhelming drains and increasing the risk of flooding. Soil and plants, however, absorb rainwater and release it gradually. For this reason, many cities are now investing in so-called green infrastructure, such as rain gardens and green roofs, to reduce the pressure on traditional drainage systems.',
      'The advantages are not only environmental. Access to parks has been linked to a range of psychological benefits, including lower levels of stress and a reduced risk of depression. Researchers believe that even brief contact with nature can restore mental energy and improve concentration. Hospitals have begun to take these findings seriously: some now design gardens for patients, having observed that those with a view of greenery tend to recover more quickly.',
      'Despite this evidence, creating and maintaining green spaces remains a challenge. Land in city centres is expensive, and parks generate little direct income compared with offices or apartments. Maintenance, too, requires steady funding that is easily cut during difficult economic times. Critics argue, moreover, that the benefits are not shared equally, since wealthier districts often have far more green space than poorer ones.',
      'Nevertheless, the direction of change seems clear. As populations grow and the climate warms, the value of urban nature is likely to increase rather than diminish. The most forward-looking cities are already weaving greenery into their plans from the very beginning, treating it as essential infrastructure on a par with water and electricity.'
    ],
    questions: [
      { type: 'tfng', q: 'During the twentieth century, parks were usually the first feature to be protected when land was limited.', answer: 'FALSE', explanation: '原文说绿地常常最先被牺牲(first to be sacrificed),而非被保护。' },
      { type: 'tfng', q: 'Cities are generally cooler than the countryside around them.', answer: 'FALSE', explanation: '原文:城市通常比周边乡村高几度(heat island effect)。' },
      { type: 'tfng', q: 'Plants help cool cities partly by releasing water vapour.', answer: 'TRUE', explanation: 'evapotranspiration,植物释放水汽降温。' },
      { type: 'mc', q: 'Why does rain on paved surfaces increase flood risk?', options: ['It evaporates immediately', 'It runs off quickly and overwhelms drains', 'It is absorbed by the soil', 'It cools the surface too fast'], answer: 1, explanation: '硬质地面雨水快速径流,使排水系统不堪重负。' },
      { type: 'gap', q: 'Cities are investing in green ________ such as rain gardens and green roofs.', answer: ['infrastructure'], explanation: 'green infrastructure(绿色基础设施)。' },
      { type: 'tfng', q: 'Patients with a view of greenery may recover faster.', answer: 'TRUE', explanation: '医院观察到能看到绿色的病人恢复更快。' },
      { type: 'mc', q: 'Which is mentioned as a difficulty in maintaining green spaces?', options: ['Lack of public interest', 'Funding is easily cut in hard times', 'Plants grow too quickly', 'Too few suitable plant species'], answer: 1, explanation: '维护需要持续资金,经济困难时易被削减。' },
      { type: 'tfng', q: 'Green space is distributed equally between rich and poor districts.', answer: 'FALSE', explanation: '批评者指出富裕区往往拥有远多于贫困区的绿地。' }
    ]
  },
  {
    id: 'r002', title: 'Why We Sleep: The Science of Rest', topic: '健康/科学', words: 600,
    paras: [
      'Sleep occupies roughly a third of human life, yet for centuries it was regarded as little more than a passive pause between periods of activity. Modern science tells a very different story. Far from being wasted time, sleep is a highly active state during which the brain and body carry out essential maintenance that cannot be performed while we are awake.',
      'During the night, the brain cycles repeatedly through several stages, including deep sleep and the phase known as REM, or rapid eye movement, sleep. Each stage appears to serve a distinct purpose. Deep sleep is associated with physical recovery and the strengthening of the immune system, while REM sleep is thought to support memory and emotional processing. Interrupting these cycles, even without reducing total sleep time, can leave people feeling unrefreshed.',
      'One of the most important discoveries of recent years concerns the way sleep helps the brain clear waste. While we rest, the spaces between brain cells widen, allowing fluid to flush away harmful substances that build up during the day. Some scientists believe that this nightly cleaning may help protect against certain diseases of the brain, although the evidence is still being gathered.',
      'Sleep also plays a crucial part in learning. Experiments have shown that people who sleep after studying remember more than those who stay awake for the same period. The brain appears to replay and reorganise new information during sleep, transferring it from temporary to long-term storage. This is one reason why students who sacrifice sleep to study often perform worse, not better.',
      'Unfortunately, modern life works against healthy sleep. Artificial light, particularly the blue light from screens, can trick the brain into thinking it is still daytime, delaying the release of the hormone that makes us feel sleepy. Irregular schedules, caffeine and stress add to the problem. Surveys suggest that a large proportion of adults in industrialised countries regularly fail to get the recommended amount of rest.',
      'The consequences of poor sleep extend well beyond tiredness. Long-term sleep deprivation has been linked to weight gain, weakened immunity, and difficulty concentrating, as well as a higher risk of accidents. Recognising this, some companies have begun to rethink long working hours, and a few even provide spaces for short daytime naps.'
    ],
    questions: [
      { type: 'tfng', q: 'In the past, sleep was often seen as an inactive pause.', answer: 'TRUE', explanation: '原文:曾被视为活动之间的被动停顿。' },
      { type: 'mc', q: 'According to the passage, deep sleep is mainly linked to:', options: ['Memory and emotion', 'Physical recovery and the immune system', 'Clearing brain waste', 'Blue light exposure'], answer: 1, explanation: '深睡与身体恢复、免疫系统增强有关;REM 才与记忆情绪有关。' },
      { type: 'tfng', q: 'Interrupting sleep cycles is harmless as long as total sleep time stays the same.', answer: 'FALSE', explanation: '即便总时长不变,打断睡眠周期也会让人不解乏。' },
      { type: 'gap', q: 'During sleep, fluid flushes away harmful ________ that build up during the day.', answer: ['substances', 'waste'], explanation: '睡眠时液体冲走白天累积的有害物质/废物。' },
      { type: 'mc', q: 'What does research suggest about studying and sleep?', options: ['Staying awake improves memory', 'Sleeping after studying improves memory', 'Sleep has no effect on learning', 'Naps harm learning'], answer: 1, explanation: '学习后睡觉的人记得更多。' },
      { type: 'tfng', q: 'Blue light from screens can make the brain think it is still daytime.', answer: 'TRUE', explanation: '蓝光让大脑误以为还是白天,延迟睡意激素分泌。' },
      { type: 'tfng', q: 'Poor sleep only causes tiredness and no other effects.', answer: 'FALSE', explanation: '还与体重增加、免疫力下降、注意力差、事故风险升高有关。' },
      { type: 'gap', q: 'Some companies now provide spaces for short daytime ________.', answer: ['naps', 'nap'], explanation: '一些公司提供小睡空间。' }
    ]
  }
];
