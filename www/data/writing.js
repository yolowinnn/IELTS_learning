/* writing.js — 写作题目(Task1/Task2)+ 范文 + 结构 + 句型 + 自查 */
window.IELTS_DATA.writing = [
  {
    id: 'w001', task: 1, type: 'Bar chart description', title: 'Coffee vs Tea Consumption', min_words: 150,
    prompt: 'The bar chart below shows the consumption of coffee and tea in four countries (the UK, the USA, China and Brazil) in 2020, measured in cups per person per day. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    outline: [
      '开头:改写题目(paraphrase),说明图表内容与单位',
      '概述(Overview):指出最突出的1-2个总体特征,不写数字',
      '主体段1:描述其中两国(如UK、China)并比较',
      '主体段2:描述另外两国(如USA、Brazil)并比较',
      '不要写个人观点;数据要有选择地写,突出对比'
    ],
    useful_phrases: [
      { en: 'The chart illustrates / compares...', zh: '该图表展示/比较了……' },
      { en: 'Overall, it is clear that... / The most striking feature is...', zh: '总体而言/最突出的特征是……' },
      { en: 'A is roughly twice as high as B.', zh: 'A 大约是 B 的两倍。' },
      { en: 'In contrast / By comparison, ...', zh: '相比之下……' },
      { en: 'The figure for X stood at around...', zh: 'X 的数值约为……' }
    ],
    model_answer: 'The bar chart compares how many cups of coffee and tea people drank per day in four countries — the UK, the USA, China and Brazil — in 2020.\n\nOverall, it is clear that tea was the preferred drink in the UK and China, whereas coffee was far more popular in the USA and Brazil. The largest single figure was for tea consumption in China.\n\nIn the UK, people drank around three cups of tea a day, more than double their coffee consumption of roughly one and a half cups. The pattern in China was even more pronounced: tea consumption reached about four cups per person, while coffee was almost negligible at well under one cup.\n\nThe situation was reversed in the two American countries. In the USA, coffee dominated at approximately three cups daily, compared with just one cup of tea. Brazilians showed a similar preference, consuming about two and a half cups of coffee but only half a cup of tea.\n\nIn short, hot-drink preferences divided the four nations sharply, with the two traditionally tea-drinking countries on one side and the two coffee-drinking nations on the other.',
    band_tips: "Keys to a high score in report writing: 1) Must have a clear Overview; 2) Select data and highlight comparisons; 3) Use varied comparative structures and trend words; 4) Avoid subjective evaluation.",
    checklist: ['有改写题目的开头句', '有不含细节数字的总体概述(Overview)', '主体段做了国家之间的比较', '用了至少3种不同的比较/数据表达', '没有出现个人观点', '词数 ≥150']
  },
  {
    id: 'w002', task: 1, type: 'Process diagram description', title: 'How Paper is Recycled', min_words: 150,
    prompt: 'The diagram below shows the process by which waste paper is recycled. Summarise the information by selecting and reporting the main features.',
    outline: [
      '开头:改写题目,说明这是一个由若干阶段组成的流程',
      '概述:说明流程的总阶段数,以及起点和终点',
      '主体段1:按顺序描述前半部分阶段(收集→分类→制浆)',
      '主体段2:描述后半部分(去墨→压制成型→成品)',
      '多用被动语态与顺序连接词'
    ],
    useful_phrases: [
      { en: 'The diagram illustrates the process of...', zh: '该图展示了……的流程' },
      { en: 'The process consists of X main stages, beginning with... and ending with...', zh: '该流程包含 X 个阶段,始于……终于……' },
      { en: 'First / Next / After that / Subsequently / Finally', zh: '首先/接着/之后/随后/最后' },
      { en: 'Once the paper has been..., it is then...', zh: '一旦纸张被……,接着就被……' },
      { en: 'At this stage, the X is + 过去分词', zh: '在此阶段,X 被……' }
    ],
    model_answer: 'The diagram illustrates how waste paper is processed and turned into new paper products. Overall, the process is cyclical and can be divided into six main stages, starting with the collection of used paper and ending with the production of recycled paper.\n\nTo begin with, waste paper is collected from homes and offices and transported to a recycling plant. There, it is sorted by hand and by machine to remove unsuitable materials such as plastic. Once the paper has been sorted, it is mixed with water and chemicals and broken down into a soft mixture known as pulp.\n\nIn the next phase, the pulp is cleaned in a process called de-inking, in which the old ink is removed. After that, the cleaned pulp is passed through rollers, which press out the water and flatten it into thin sheets. Finally, the sheets are dried and rolled, producing fresh paper that can be sent back to shops and offices, allowing the cycle to begin again.',
    band_tips: "Core of process diagrams: passive voice (e.g., \"is collected / is sorted\"), sequential connectors, and clear stage division. The overview should state the total number of stages and the start and end points.",
    checklist: ['改写了题目', '概述说明了阶段数和起止', '大量使用被动语态', '顺序连接词丰富且不重复', '按正确顺序描述', '词数 ≥150']
  },
  {
    id: 'w003', task: 2, type: 'Opinion (agree / disagree)', title: 'Should University Be Free?', min_words: 250,
    prompt: 'Some people believe that university education should be free for all students, while others think students should pay for it themselves. Discuss both views and give your own opinion.',
    outline: [
      '引言:改写题目 + 表明你的立场',
      '主体段1:讨论一方观点(免费教育的理由 + 例子)',
      '主体段2:讨论另一方观点(自费的理由 + 例子)',
      '主体段3(可选)或在段尾:重申自己的立场与理由',
      '结论:总结两方并明确你的观点'
    ],
    useful_phrases: [
      { en: 'There is an ongoing debate about whether...', zh: '关于……一直存在争论' },
      { en: 'On the one hand... On the other hand...', zh: '一方面……另一方面……' },
      { en: 'Proponents argue that... / Critics, however, contend that...', zh: '支持者认为……/批评者则主张……' },
      { en: 'For instance / A clear example of this is...', zh: '例如/一个明显的例子是……' },
      { en: 'In my view / On balance, I believe that...', zh: '在我看来/总体而言,我认为……' }
    ],
    model_answer: 'The question of who should pay for higher education provokes strong opinions. While some argue that university should be funded entirely by the state, others maintain that students themselves should bear the cost. This essay will examine both positions before explaining why I believe a partly subsidised system is the fairest solution.\n\nThose who support free university education point to the issue of equality. If tuition is expensive, talented students from poorer families may be discouraged from applying, which wastes human potential and deepens social divisions. A free system, by contrast, allows everyone to compete on merit rather than wealth. Supporters also argue that society as a whole benefits from a well-educated population, since graduates contribute skills, pay higher taxes and drive innovation.\n\nOn the other hand, opponents stress the enormous cost to taxpayers. Funding every student is expensive, and this money might otherwise be spent on schools or healthcare. Furthermore, when education is free, some students may not value it or may choose courses with little practical benefit. Charging fees, they argue, encourages learners to take their studies seriously and to select subjects with clear career prospects.\n\nIn my opinion, both extremes are flawed. A completely free system places a heavy burden on the state, yet leaving students to pay full fees risks excluding the poor. The most sensible approach is therefore a balanced one, in which the government subsidises tuition while students contribute a modest, income-based amount after graduation. This protects access without ignoring economic reality.\n\nIn conclusion, although free education promotes fairness and self-funding encourages responsibility, a partly subsidised model best combines the strengths of both views.',
    band_tips: "Keys to an essay score of 7.5: 1) Clear and consistent stance throughout; 2) Each body paragraph follows PEEL (Point-Explanation-Example-Link); 3) Natural and varied connectors; 4) Precise vocabulary and varied sentence structures (subordinate clauses/inversion/passive).",
    checklist: ['引言改写题目并表明立场', '两个观点各有独立段落', '每段都有具体理由或例子', '有清晰的个人观点', '连接词多样不重复', '句式有复杂结构变化', '结论呼应全文', '词数 ≥250']
  },
  {
    id: 'w004', task: 2, type: 'Advantages / Discussion', title: 'Remote Work', min_words: 250,
    prompt: 'More and more people are working from home rather than in an office. Do the advantages of this development outweigh the disadvantages?',
    outline: [
      '引言:改写题目 + 表明利大于弊还是弊大于利',
      '主体段1:优点(灵活性、节省通勤、提高效率)+ 例子',
      '主体段2:缺点(孤立感、沟通困难、工作生活界限模糊)+ 例子',
      '结尾:权衡后给出明确结论'
    ],
    useful_phrases: [
      { en: 'A growing number of people now...', zh: '越来越多的人现在……' },
      { en: 'One significant advantage is that...', zh: '一个显著的优点是……' },
      { en: 'This is not without drawbacks, however.', zh: '然而这并非没有缺点。' },
      { en: 'A further / Another downside is that...', zh: '另一个不利之处是……' },
      { en: 'Weighing up both sides, I would argue that...', zh: '权衡两方面,我认为……' }
    ],
    model_answer: 'In recent years, an increasing number of employees have begun working from home instead of commuting to a traditional office. Although this shift brings certain difficulties, I believe its benefits clearly outweigh its drawbacks.\n\nThe advantages of remote work are considerable. Most obviously, it removes the daily commute, saving workers both time and money and reducing traffic and pollution. Employees also gain flexibility, allowing them to balance professional duties with family responsibilities more easily. Many people, moreover, find that they concentrate better at home, away from the constant interruptions of a busy office, which can increase productivity. A parent, for example, can attend to a sick child and still complete a full day of work.\n\nNevertheless, there are genuine disadvantages. Working alone can be isolating, and the lack of face-to-face contact may weaken teamwork and the sense of belonging to a company. Communication can also become slower and more prone to misunderstanding when it relies entirely on email and video calls. Perhaps most seriously, the boundary between work and personal life can blur, leading some people to work longer hours and feel unable to switch off.\n\nIn my view, however, these problems can largely be managed. Regular video meetings and occasional office days can preserve teamwork, while clear routines help separate work from rest. The fundamental gains in flexibility, well-being and reduced commuting are harder to replace.\n\nIn conclusion, while remote work poses real challenges relating to isolation and communication, its advantages in terms of flexibility and efficiency are greater. With sensible management, working from home is, on balance, a positive development.',
    band_tips: "For \"advantages outweigh disadvantages\" essays, clearly state your position in the introduction and reiterate it in the conclusion. Note synonyms for \"advantage/disadvantage\" (e.g., \"benefit/drawback/downside/merit\").",
    checklist: ['引言表明利弊立场', '优点段有具体例子', '缺点段有具体例子', '结论重申立场', 'advantage 类词有同义替换', '连接词自然', '词数 ≥250']
  }
];
