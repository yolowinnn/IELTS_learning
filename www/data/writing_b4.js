/* writing_b4.js — 写作题(Task1 流程图/多图组合 + Task2 同意不同意/问题对策)+ 范文 + 结构 + 句型 + 自查 */
window.IELTS_DATA.writing.push(
  {
    id: "w013", task: 1, type: "流程图描述", title: "How Chocolate is Produced", min_words: 150,
    prompt: "The diagram below illustrates the process by which chocolate is produced, from the cocoa tree to the finished bar. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    outline: [
      "开头:改写题目,说明这是一个由若干阶段组成的线性流程,起点为可可树、终点为成品巧克力",
      "概述(Overview):说明流程的总阶段数,并点明起点(收获可可豆)与终点(包装成品),不展开细节",
      "主体段1:按顺序描述前半部分阶段(采摘可可荚→取豆与发酵→晾晒→装袋运往工厂)",
      "主体段2:按顺序描述后半部分阶段(烘焙→去壳碾压成浆→加入配料制成巧克力→成型包装)",
      "全文多用被动语态(are harvested / is roasted)与顺序连接词,不写数字与个人观点"
    ],
    useful_phrases: [
      { en: "The diagram illustrates the various stages involved in the production of chocolate.", zh: "该图展示了巧克力生产过程中所涉及的各个阶段。" },
      { en: "Overall, the process consists of several distinct steps, beginning with the harvesting of cocoa pods and ending with packaged chocolate.", zh: "总体而言,该流程包含若干个明确的步骤,始于采摘可可荚,终于包装好的巧克力。" },
      { en: "Once the beans have been fermented, they are then left to dry in the sun.", zh: "可可豆经过发酵后,接着被放在阳光下晾晒。" },
      { en: "At this stage, the roasted beans are crushed and their shells removed.", zh: "在此阶段,烘焙过的豆子被碾碎并去除外壳。" },
      { en: "Finally, the liquid chocolate is poured into moulds and packaged for sale.", zh: "最后,液态巧克力被倒入模具并包装出售。" }
    ],
    model_answer: "The diagram illustrates the various stages involved in producing chocolate, from the growing of cocoa on trees to the packaging of the finished bars.\n\nOverall, it is clear that the process is linear and can be divided into several main steps, beginning with the harvesting of cocoa pods on plantations and ending with solid chocolate that is ready to be sold.\n\nAt the start of the process, ripe cocoa pods are harvested by hand from cocoa trees, which typically grow in hot regions of South America, Africa and Indonesia. The pods are then opened so that the white cocoa beans inside can be removed. After this, the beans are left to ferment for a period of time, before being spread out and dried under the sun. Once they are completely dry, the beans are placed into large sacks and transported by ship to factories around the world.\n\nIn the second half of the process, the beans are roasted at a high temperature and then crushed, a stage during which their outer shells are separated and discarded. The inner part of each bean is subsequently pressed and ground until it becomes a thick liquid known as chocolate liquor. At the final stage, this liquid is mixed with other ingredients such as sugar and milk, after which it is poured into moulds, cooled until solid and packaged, ready for distribution to shops.",
    band_tips: "流程图题高分关键:1)Overview 要点明总阶段数与首尾(从可可树到成品),不展开细节;2)通篇以被动语态为主(are harvested / is roasted / are crushed),让步描述客观;3)顺序连接词丰富且不重复(at the start / then / after this / once / subsequently / at the final stage);4)严格按图中顺序描述,不漏环节、不加数字与个人观点。",
    checklist: [
      "改写了题目并点明从可可树到成品的线性流程",
      "Overview 说明了总阶段数与起止环节",
      "通篇大量使用被动语态描述各步骤",
      "顺序连接词丰富且不重复",
      "严格按图中顺序描述,无遗漏、无主观评价",
      "词数 ≥150"
    ]
  },
  {
    id: "w014", task: 1, type: "多图组合(柱状图+饼图)", title: "Energy Production and Spending", min_words: 150,
    prompt: "The bar chart below shows the amount of electricity generated from four sources in a country between 2000 and 2020, while the pie chart shows how the government's energy budget was divided in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    outline: [
      "开头:改写题目,说明这是两幅图——柱状图(四种来源2000–2020的发电量)与饼图(2020年能源预算的分配)",
      "概述(Overview):分别提炼两幅图的总体规律——发电量整体上升、可再生能源增长最快;预算中某一项占比最大",
      "主体段1:描述柱状图——四种来源在两年间的发电量变化与对比(谁主导、谁上升、谁下降)",
      "主体段2:描述饼图——2020年预算各项占比,突出最大与最小项,并与柱状图呼应",
      "全文清楚区分两图、单位准确,数据有取舍,不写个人观点"
    ],
    useful_phrases: [
      { en: "The bar chart and pie chart provide information about electricity generation and energy spending in one country.", zh: "柱状图与饼图提供了某国发电量与能源支出的相关信息。" },
      { en: "Overall, total electricity output rose markedly over the period, with renewable sources growing the fastest.", zh: "总体而言,该时期总发电量显著上升,其中可再生能源增长最快。" },
      { en: "Coal remained the dominant source of electricity throughout, despite a gradual decline.", zh: "尽管逐步下降,煤炭在整个时期仍是主要的电力来源。" },
      { en: "Turning to the pie chart, the largest share of the budget was allocated to...", zh: "再看饼图,预算中最大的一部分被分配给了……" },
      { en: "By contrast, only a small fraction of spending was devoted to...", zh: "相比之下,只有一小部分支出用于……" }
    ],
    model_answer: "The bar chart shows the quantity of electricity produced from four different sources in one country between 2000 and 2020, while the pie chart breaks down how the government divided its energy budget in 2020.\n\nOverall, it is clear that total electricity generation increased considerably over the two decades, with renewable sources expanding most rapidly. In terms of spending, the largest portion of the budget in 2020 was directed towards renewable energy, whereas relatively little was set aside for coal.\n\nAccording to the bar chart, coal was the leading source of electricity in 2000, generating around 200 units, but its output fell steadily to roughly 140 units by 2020. Natural gas, meanwhile, rose gradually from about 100 to 150 units and overtook coal by the end of the period. The most dramatic change came from renewables, which climbed sharply from a mere 30 units to approximately 180 units, while nuclear power remained broadly stable at around 80 units throughout.\n\nThe pie chart reflects these priorities. In 2020, renewable energy accounted for the largest share of government spending, at around 45 per cent, followed by natural gas at roughly 30 per cent. Nuclear power received about 15 per cent of the budget, while coal was allocated the smallest proportion, just 10 per cent. This pattern of investment closely mirrors the rapid growth of renewables and the steady decline of coal seen in the bar chart.",
    band_tips: "多图组合题高分关键:1)Overview 必须分别概括两幅图的总体规律,不混为一谈;2)清楚区分两图并准确使用各自单位(发电量单位/预算百分比);3)主体段一图一段,描述柱状图用趋势词(rose to / fell steadily / overtook),饼图用比例词(the largest share / accounted for / just 10 per cent);4)尽量让两图相互呼应(投资与发电趋势一致),体现归纳能力,不写个人观点。",
    checklist: [
      "开头改写题目并点明两幅图各自的内容与单位",
      "Overview 分别提炼了两幅图的总体规律",
      "柱状图段用了多样的趋势/比较表达",
      "饼图段用了多样的比例表达并突出最大最小项",
      "两图之间有相互呼应、数据有取舍、无个人观点",
      "词数 ≥150"
    ]
  },
  {
    id: "w015", task: 2, type: "观点类(同意/不同意)", title: "Should Children Use Smartphones?", min_words: 250,
    prompt: "Some people believe that young children should be banned from using smartphones, while others argue that the devices are essential learning tools. To what extent do you agree or disagree?",
    outline: [
      "引言:改写题目,点明关于幼儿是否应被禁止使用智能手机的争论,并明确表态(本范文:基本同意应严格限制而非完全禁止)",
      "主体段1:支持我方的第一个核心论点——过早、无节制使用的危害(注意力、视力、睡眠、社交与运动减少),配例子",
      "主体段2:让步并反驳——承认手机的学习与安全价值,但指出关键在于成人监管与适度使用,而非放任",
      "可在主体段说明为何\"严格限制\"优于\"完全禁止\"或\"完全放任\",体现思辨与权衡",
      "结论:重申立场——总体同意应严格限制幼儿使用,并强调家长与学校的引导作用"
    ],
    useful_phrases: [
      { en: "There is growing concern over whether very young children should be allowed to use smartphones at all.", zh: "关于是否应允许幼儿使用智能手机,人们的担忧与日俱增。" },
      { en: "I largely agree that the use of such devices by young children should be strictly limited.", zh: "我基本同意应严格限制幼儿对此类设备的使用。" },
      { en: "Excessive screen time can have a detrimental effect on a child's developing eyesight and attention span.", zh: "过多的屏幕时间会对儿童正在发育的视力和注意力产生有害影响。" },
      { en: "It would be naive, however, to dismiss the educational potential of these devices entirely.", zh: "然而,完全否定这些设备的教育潜力是不明智的。" },
      { en: "The key, in my view, lies not in an outright ban but in responsible adult supervision.", zh: "在我看来,关键不在于彻底禁止,而在于负责任的成人监管。" }
    ],
    model_answer: "In an age when screens are everywhere, there is heated debate about whether young children should be prevented from using smartphones or encouraged to learn with them. While I acknowledge that these devices can be useful, I largely agree that their use by young children should be strictly controlled.\n\nThe principal reason for my view is the harm that early, unrestricted use can cause. Children whose lives revolve around a screen are at risk of damaged eyesight, disturbed sleep and a shortened attention span, since fast-moving content trains the brain to expect constant stimulation. Equally worrying is the loss of real-world experience: a child absorbed in games or videos spends less time playing outdoors, talking to family members or developing social skills. A toddler handed a phone to keep them quiet, for example, may gradually struggle to entertain themselves or to cope with boredom, both of which are vital for healthy development.\n\nIt would be unreasonable, however, to deny that smartphones also offer genuine benefits. Well-designed educational applications can teach reading, numbers and foreign languages in an engaging way, and a phone allows parents to reach their child in an emergency. The crucial point, in my opinion, is that these advantages depend entirely on how the technology is used. A complete ban is neither realistic nor desirable in a digital world; what matters is that adults set firm limits, choose appropriate content and use the device alongside the child rather than as a substitute for attention.\n\nIn conclusion, although smartphones can support learning and safety, I believe their use by young children must be carefully restricted rather than left unchecked. With sensible guidance from parents and teachers, children can enjoy the benefits of technology while avoiding its considerable risks.",
    band_tips: "同意/不同意(To what extent do you agree or disagree)8分关键:1)引言必须明确表态(完全同意/基本同意/不同意),并全文立场一致;2)即使表态,也应有让步段承认对立面,再加以反驳,体现思辨;3)每段遵循 PEEL(观点-解释-例子-小结),论点配具体可信的例子;4)连接词与句式高度多样(让步状语、定语从句、被动、名词化如 stimulation/development、虚拟语气),用词精准地道;结论重申立场。",
    checklist: [
      "引言改写题目并明确表明同意程度的立场",
      "我方核心论点有解释与具体例子支撑",
      "有让步段承认对立面并加以反驳",
      "体现了\"严格限制优于完全禁止/放任\"的权衡思辨",
      "全文立场前后一致,结论再次重申",
      "连接词与句式多样(让步/定语从句/名词化等)",
      "词数 ≥250"
    ]
  },
  {
    id: "w016", task: 2, type: "问题与对策(problems and solutions)", title: "Traffic Congestion in Cities", min_words: 250,
    prompt: "Traffic congestion is becoming a serious problem in many large cities around the world. What are the main causes of this problem, and what measures could be taken to solve it?",
    outline: [
      "引言:改写题目,点明城市交通拥堵日益严重这一问题,并预告下文将分析其成因与对策",
      "主体段1(问题/成因):分析拥堵的主要原因(私家车数量激增、公共交通不足、城市规划与道路建设滞后),配例子",
      "主体段2(对策/解决方案):针对成因提出可行措施(发展公共交通、征收拥堵费/限行、鼓励拼车与远程办公、合理城市规划),并说明其作用",
      "确保\"对策\"与\"成因\"一一对应、逻辑衔接,体现因果与可行性",
      "结论:总结主要成因与对策,强调需要政府与个人共同努力"
    ],
    useful_phrases: [
      { en: "Traffic congestion has become one of the most pressing problems facing major cities today.", zh: "交通拥堵已成为当今大城市面临的最紧迫问题之一。" },
      { en: "One of the principal causes of this problem is the sharp rise in private car ownership.", zh: "造成这一问题的主要原因之一是私家车保有量的急剧上升。" },
      { en: "This is further aggravated by inadequate and unreliable public transport.", zh: "这一问题又因公共交通不足且不可靠而进一步加剧。" },
      { en: "A practical solution would be to invest heavily in efficient public transport systems.", zh: "一个切实可行的解决办法是大力投资高效的公共交通系统。" },
      { en: "Governments could also discourage car use by introducing congestion charges in city centres.", zh: "政府还可通过在市中心征收拥堵费来抑制开车出行。" }
    ],
    model_answer: "Traffic congestion has become one of the most pressing issues confronting large cities throughout the world, bringing wasted time, higher pollution and growing frustration for commuters. This essay will first examine the principal causes of the problem and then suggest a number of measures that could help to ease it.\n\nThere are several reasons why roads in major cities are increasingly blocked. The most obvious cause is the rapid growth in private car ownership: as incomes rise, more and more families are able to afford their own vehicles, and roads that were built decades ago simply cannot cope with the volume of traffic. This situation is made worse by public transport that is often slow, overcrowded or unreliable, which pushes commuters towards their cars. In addition, poor urban planning plays a significant role, since many cities have allowed housing to spread far from workplaces, forcing residents to make long daily journeys by road.\n\nFortunately, a range of measures could be taken to address these causes. The most effective solution would be to invest heavily in fast, affordable and reliable public transport, such as metro lines and bus networks, so that people have a genuine alternative to driving. At the same time, governments could discourage unnecessary car use by introducing congestion charges in city centres and creating dedicated lanes for buses and cyclists. Encouraging companies to allow remote working and promoting car-sharing schemes would further reduce the number of vehicles on the road, while better long-term planning could ensure that homes, offices and shops are located closer together.\n\nIn conclusion, urban traffic congestion stems largely from rising car ownership, weak public transport and inefficient planning. By improving public transport, deterring car use and planning cities more sensibly, both governments and individuals can work together to make this problem far more manageable.",
    band_tips: "问题与对策(problems / causes and solutions)8分关键:1)引言改写题目并预告\"先析因、后给策\"的结构;2)成因段与对策段尽量一一对应(每个原因都有对应措施),逻辑衔接紧密;3)措施要具体、可行并说明作用(而非空泛的\"加强管理\");4)每段遵循 PEEL,连接词与句式多样(让步状语、定语从句、被动、名词化如 congestion/ownership),用词精准;结论概括成因与对策并呼吁共同努力。",
    checklist: [
      "引言改写题目并预告成因与对策的结构",
      "成因段分析了多个具体且可信的原因",
      "对策段提出具体、可行的措施并说明作用",
      "对策与成因一一对应、逻辑衔接紧密",
      "每段遵循 PEEL,连接词与句式多样",
      "结论概括成因与对策并呼吁共同努力",
      "词数 ≥250"
    ]
  }
);
