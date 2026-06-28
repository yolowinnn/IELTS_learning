/* reading_bx.js — 新增整套 IELTS Academic 阅读(Cambridge 19 标准, 2026 原创)*/
window.IELTS_DATA.reading = window.IELTS_DATA.reading || [];
window.IELTS_DATA.reading.push(
{
  id: "rx01",
  title: "The Tiny Tide: Microplastics in the World's Oceans",
  topic: "Environment / Oceans",
  words: 880,
  source: "IELTS Academic Reading · Cambridge 19 (2024) standard · original, Jun 2026",
  paras: [
    "When most people picture ocean plastic pollution, they imagine drifting bottles, discarded fishing nets or the vast floating accumulations called garbage patches. Yet a far less visible threat now occupies marine scientists. Microplastics, conventionally defined as plastic fragments smaller than five millimetres across, have spread to every corner of the marine environment, from coastal shallows to the deepest ocean trenches and even the sea ice of the polar regions. Because these particles are so small, they evade the clean-up technologies designed for larger debris and pass easily through the filtration systems of sewage treatment plants. Their sheer ubiquity, rather than the volume of any single source, is what makes them so difficult to address.",
    "Microplastics arise through two broad pathways. So-called primary microplastics are manufactured at a small size from the outset. These include the plastic pellets, known in the industry as nurdles, that serve as the raw material for moulded goods, as well as the microbeads once added to cosmetics and exfoliating scrubs. Secondary microplastics, by contrast, are produced when larger items break apart. Sunlight, abrasion by waves and the grinding action of sand gradually fragment bottles, packaging and synthetic rope into ever smaller pieces. A particularly significant contributor here is textile fibre: a single domestic wash of synthetic clothing can release hundreds of thousands of microscopic strands, which travel through household drains into rivers and ultimately the sea. Researchers now estimate that laundry is among the largest single sources of microplastic entering the oceans.",
    "Once dispersed, these particles interact with marine life in troubling ways. Filter-feeding organisms such as mussels, oysters and certain plankton ingest microplastics indiscriminately, mistaking them for food or taking them in along with genuine nourishment. The physical consequences can include a false sensation of fullness that reduces the intake of real food, leading to slower growth and lower reproductive success. A chemical dimension may prove still more serious. Plastics readily absorb persistent organic pollutants from the surrounding seawater, concentrating these toxins on their surfaces, and when an organism consumes a contaminated particle the pollutants can be released into its tissues. As smaller creatures are eaten by larger ones, both the plastics and their chemical cargo may accumulate at successive levels of the food web, a process scientists refer to as biomagnification.",
    "The implications for human health remain under active investigation, and caution is essential. Microplastics have been detected in commercially important seafood, in table salt and in bottled water, and very small particles have been identified in human blood and other tissues. It would be premature, however, to draw firm conclusions. The mere presence of a substance in the body does not establish that it causes harm, and the doses to which most people are exposed are, on current evidence, extremely low. What troubles many researchers is not any proven illness but the depth of our ignorance: the long-term effects of low-level exposure have simply not been studied for long enough to permit confident statements either way.",
    "Confronting the problem demands action on several fronts at once, since no single measure can succeed in isolation. The most effective interventions, most experts agree, are those that prevent plastic from entering the environment in the first place, rather than attempting the far harder task of recovering it afterwards. Some governments have already moved in this direction. Bans on plastic microbeads in personal-care products, introduced in several countries from the mid-2010s onwards, offer an encouraging precedent: because microbeads served no essential purpose and substitutes existed, the policy proved relatively painless to implement and quickly reduced one source of contamination.",
    "Technological responses are advancing too, though they tend to tackle symptoms rather than causes. Filters fitted to washing machines can capture much of the fibre shed during laundering, and some jurisdictions are beginning to require such devices in new appliances. At the river mouths where freshwater meets the sea, barriers can intercept floating debris before it disperses into the open ocean, where retrieval becomes virtually impossible. Yet engineers caution that these measures can only ever complement reductions at source. Filtering the open ocean itself is generally regarded as impractical: the particles are too small, too widely scattered and too easily confused with the plankton on which entire marine ecosystems depend.",
    "Perhaps the most fundamental shift, many argue, must occur in how plastic is designed, used and discarded. A genuinely circular approach, in which materials are continually recovered and reprocessed instead of being thrown away after a single use, would attack the problem at its root by reducing the total quantity of plastic in circulation. Encouragingly, the scientific community is moving towards greater coordination. International efforts to standardise the methods by which microplastics are sampled and measured should make findings from different studies directly comparable, allowing the true scale of the problem to be assessed with far greater precision than is possible today.",
    "None of this should breed complacency. The plastic already in the oceans will persist for generations, fragmenting endlessly without ever truly disappearing, and the flow of new material has yet to be stemmed. But the combination of preventive regulation, practical technology and a rethinking of how societies use plastic offers a realistic, if demanding, path forward. The tiny tide can be slowed; whether it can be reversed will depend on choices made in the years ahead."
  ],
  questions: [
    {
      type: "tfng",
      q: "Microplastics are easily removed by the equipment used at sewage treatment plants.",
      answer: "FALSE",
      explanation: "Paragraph 1 states that microplastics pass easily through the filtration systems of sewage treatment plants, which contradicts the statement."
    },
    {
      type: "tfng",
      q: "Laundering synthetic clothing is thought to be one of the biggest sources of microplastics reaching the sea.",
      answer: "TRUE",
      explanation: "Paragraph 2 says researchers estimate that laundry is among the largest single sources of microplastic entering the oceans."
    },
    {
      type: "tfng",
      q: "Microbead bans were difficult and expensive for manufacturers to put into practice.",
      answer: "FALSE",
      explanation: "Paragraph 5 says the microbead policy proved relatively painless to implement because substitutes existed, contradicting the claim of difficulty and expense."
    },
    {
      type: "tfng",
      q: "Most plastic microbeads are now produced in countries that have not introduced bans.",
      answer: "NOT GIVEN",
      explanation: "The passage discusses microbead bans but gives no information about where microbeads are now produced, so this cannot be confirmed."
    },
    {
      type: "ynng",
      q: "Does the writer believe that microplastics have been proven to cause illness in humans?",
      answer: "NO",
      explanation: "In paragraph 4 the writer says it would be premature to draw firm conclusions and that the concern is ignorance rather than any proven illness."
    },
    {
      type: "ynng",
      q: "Does the writer consider rethinking how plastic is used to be a more fundamental change than the technological measures available?",
      answer: "YES",
      explanation: "In paragraph 7 the writer calls a redesign of how plastic is used the most fundamental shift, contrasting it with the symptom-tackling technologies of paragraph 6."
    },
    {
      type: "mc",
      q: "According to the passage, what makes microplastics especially hard to deal with?",
      options: [
        "They are produced in greater total quantities than larger debris.",
        "They are present almost everywhere rather than concentrated in one place.",
        "They are more toxic than other forms of plastic waste.",
        "They are manufactured deliberately rather than formed by accident."
      ],
      answer: 1,
      explanation: "Paragraph 1 concludes that their sheer ubiquity, rather than the volume of any single source, is what makes them so difficult to address."
    },
    {
      type: "mc",
      q: "What does the writer suggest about the chemical effects of microplastics on marine organisms?",
      options: [
        "Plastics neutralise pollutants already present in seawater.",
        "Pollutants are most concentrated in the largest fragments of plastic.",
        "Toxins gathered on plastic surfaces can build up through the food web.",
        "Filter-feeding organisms are unaffected by absorbed pollutants."
      ],
      answer: 2,
      explanation: "Paragraph 3 explains that plastics absorb pollutants which can accumulate at successive levels of the food web through biomagnification."
    },
    {
      type: "mc",
      q: "Which approach to the problem do most experts regard as most effective?",
      options: [
        "Recovering plastic particles after they reach the ocean.",
        "Stopping plastic from entering the environment at all.",
        "Developing new technologies to filter seawater.",
        "Encouraging consumers to buy fewer synthetic products."
      ],
      answer: 1,
      explanation: "Paragraph 5 states that the most effective interventions are those that prevent plastic from entering the environment in the first place."
    },
    {
      type: "gap",
      q: "Plastic fragments smaller than five ____ across are classified as microplastics.",
      answer: ["millimetres", "millimeters"],
      explanation: "Paragraph 1 defines microplastics as plastic fragments smaller than five millimetres across."
    },
    {
      type: "gap",
      q: "The plastic pellets used as raw material in industry are known as ____.",
      answer: ["nurdles"],
      explanation: "Paragraph 2 states that plastic pellets are known in the industry as nurdles."
    },
    {
      type: "gap",
      q: "A ____ approach would recover and reprocess materials continually instead of discarding them after one use.",
      answer: ["circular"],
      explanation: "Paragraph 7 describes a genuinely circular approach in which materials are continually recovered and reprocessed instead of being thrown away."
    },
    {
      type: "gap",
      q: "Standardising sampling methods will let scientists assess the true ____ of the problem with greater precision.",
      answer: ["scale"],
      explanation: "Paragraph 7 says standardised methods will allow the true scale of the problem to be assessed with far greater precision."
    },
  ]
},
{
  id: "rx02",
  title: "The Architecture of Remembering and Forgetting",
  topic: "Psychology / Memory",
  words: 824,
  source: "IELTS Academic Reading · Cambridge 19 (2024) standard · original, Jun 2026",
  paras: [
    "For much of the twentieth century, popular thinking treated human memory as a kind of recording device, faithfully capturing experiences and filing them away to be replayed on demand. Psychologists have long since abandoned this metaphor. Memory, the evidence now suggests, is less an archive than a reconstruction: each time we recall an event, the brain reassembles fragments of information rather than retrieving a complete, unaltered copy. This distinction matters, because it helps explain not only the remarkable capacity of human memory but also its everyday failures. Far from being a flaw in the system, much of what we call forgetting may be a feature of how memory is designed to work.",
    "The first stage in this process is encoding, the conversion of incoming sensory information into a form the brain can store. Crucially, encoding is selective. At any moment a person is bombarded by far more stimuli than could ever be retained, and the brain prioritises material that is meaningful, emotionally charged, or connected to existing knowledge. Information that is processed only superficially, such as the precise wording of a sentence one has just read, tends to fade quickly, whereas information that is interpreted in terms of its significance is far more likely to persist. This is why a student who merely repeats a definition aloud often remembers less than one who pauses to relate the idea to something already understood.",
    "Once encoded, memories must be consolidated, a process that stabilises the fragile traces formed during initial learning. Consolidation depends heavily on the hippocampus, a seahorse-shaped structure deep within the brain, which acts as a temporary hub linking the scattered components of an experience. Over time, and particularly during sleep, these memories are gradually transferred to the wider cortex, where they become more durable and less dependent on the hippocampus. Studies of patients who have suffered damage to this region are revealing: such individuals can often recall events from years before their injury yet prove unable to form lasting new memories, a pattern that underlines the hippocampus's role in building rather than housing the long-term record.",
    "Yet even well-consolidated memories are not immune to loss, and researchers have proposed several reasons why forgetting occurs. The oldest explanation is decay, the idea that memory traces simply weaken with the passage of time if they are not used. While intuitively appealing, decay alone struggles to account for the evidence, since memories that seem entirely lost can sometimes be recovered with the right prompt. A more persuasive account emphasises interference, whereby other memories compete with the target and obstruct its retrieval. Newly acquired information can disrupt the recall of older material, and, conversely, established knowledge can hinder the learning of something new, as anyone who has struggled to remember a recently changed password will recognise.",
    "Interference points to a broader truth: forgetting is frequently a problem of access rather than storage. The information may remain in the brain, but the cues needed to reach it are missing. This explains the familiar tip-of-the-tongue state, in which a person is certain they know a word yet cannot produce it, sometimes recalling its first letter or number of syllables. It also explains why returning to the place where something was learned can suddenly unlock a memory that seemed irretrievable. Such observations suggest that the contents of memory are often intact but rendered temporarily inaccessible by the absence of an appropriate retrieval cue.",
    "Some psychologists argue that a degree of forgetting is not merely unavoidable but positively useful. A memory system that preserved every detail with equal vividness would be cluttered with trivia, making it harder to identify the patterns and general principles that guide sensible behaviour. By allowing irrelevant specifics to fall away while retaining the gist of past experience, forgetting may actually sharpen judgement. There is even evidence that the deliberate act of retrieving certain memories causes related but unwanted memories to be suppressed, a phenomenon known as retrieval-induced forgetting, which helps keep the mind focused on what is currently relevant.",
    "This functional view also casts the reconstructive nature of memory in a new light. Because recall involves rebuilding an event from partial information, the gaps are routinely filled using expectation, general knowledge and suggestion. The result is that memories can be confidently held yet substantially mistaken, a finding with serious implications for the reliability of eyewitness testimony in courts of law. Experiments have repeatedly shown that the way a question is phrased after an event can alter what witnesses subsequently report having seen, demonstrating how easily later information becomes woven into the original memory.",
    "Understanding memory as an active, selective and reconstructive process rather than a passive storehouse changes how we should regard its limitations. The frustration of a forgotten name or a misremembered conversation reflects the operation of a system that evolved not to record the past with perfect fidelity but to extract from it whatever proves most useful for the present and the future. Seen in this way, forgetting is not the opposite of a well-functioning memory but an integral part of it."
  ],
  questions: [
    {
      type: "tfng",
      q: "Most psychologists once believed that memory worked like a recording device.",
      answer: "TRUE",
      explanation: "Paragraph 1 states that for much of the twentieth century popular thinking treated memory as a kind of recording device, a metaphor psychologists have since abandoned."
    },
    {
      type: "tfng",
      q: "The brain stores every stimulus it receives before deciding what to keep.",
      answer: "FALSE",
      explanation: "Paragraph 2 says encoding is selective and that a person is bombarded by far more stimuli than could ever be retained, so not everything is stored."
    },
    {
      type: "tfng",
      q: "Damage to the hippocampus typically erases a person's memories of events from many years earlier.",
      answer: "FALSE",
      explanation: "Paragraph 3 notes that patients with hippocampal damage can often recall events from years before their injury but cannot form lasting new memories."
    },
    {
      type: "tfng",
      q: "Scientists have determined the exact number of memories the hippocampus can hold at one time.",
      answer: "NOT GIVEN",
      explanation: "The passage discusses the hippocampus's role in consolidation but never mentions any measured limit on how many memories it can hold."
    },
    {
      type: "ynng",
      q: "Does the writer believe that the decay theory fully explains why forgetting happens?",
      answer: "NO",
      explanation: "In paragraph 4 the writer says decay alone struggles to account for the evidence and presents interference as a more persuasive account."
    },
    {
      type: "ynng",
      q: "Does the writer regard some forgetting as beneficial?",
      answer: "YES",
      explanation: "Paragraph 6 states that a degree of forgetting is not merely unavoidable but positively useful and may actually sharpen judgement."
    },
    {
      type: "mc",
      q: "According to the passage, information is most likely to be remembered when it is",
      options: [
        "repeated aloud several times without pause.",
        "processed in terms of its meaning and links to prior knowledge.",
        "received during a moment of sensory overload.",
        "stored as the precise wording of a sentence."
      ],
      answer: 1,
      explanation: "Paragraph 2 says information interpreted in terms of its significance and related to existing knowledge is far more likely to persist, unlike superficial processing or mere repetition."
    },
    {
      type: "mc",
      q: "The tip-of-the-tongue state is used in the passage to illustrate that forgetting can be",
      options: [
        "the permanent loss of stored information.",
        "caused mainly by the decay of memory traces.",
        "a failure of access rather than of storage.",
        "a sign of damage to the cortex."
      ],
      answer: 2,
      explanation: "Paragraph 5 presents the tip-of-the-tongue state as evidence that forgetting is frequently a problem of access rather than storage, with the information intact but temporarily unreachable."
    },
    {
      type: "mc",
      q: "What does the writer suggest about eyewitness testimony?",
      options: [
        "It is generally accurate because memories are stored faithfully.",
        "It can be distorted by how questions are phrased after an event.",
        "It improves when witnesses are highly confident.",
        "It is unaffected by information received later."
      ],
      answer: 1,
      explanation: "Paragraph 7 reports that the way a question is phrased after an event can alter what witnesses report, because later information becomes woven into the original memory."
    },
    {
      type: "gap",
      q: "During the process of ____, the brain converts incoming sensory information into a storable form.",
      answer: ["encoding"],
      explanation: "Paragraph 2 defines encoding as the conversion of incoming sensory information into a form the brain can store."
    },
    {
      type: "gap",
      q: "Memories are gradually moved to the wider ____, where they become more durable, especially during sleep.",
      answer: ["cortex"],
      explanation: "Paragraph 3 states that over time, particularly during sleep, memories are transferred to the wider cortex, where they become more durable."
    },
    {
      type: "gap",
      q: "The competition between memories that obstructs retrieval of a target memory is known as ____.",
      answer: ["interference"],
      explanation: "Paragraph 4 describes interference as the process whereby other memories compete with the target and obstruct its retrieval."
    },
    {
      type: "gap",
      q: "The phenomenon in which recalling some memories suppresses related unwanted ones is called ____.",
      answer: ["retrieval-induced forgetting"],
      explanation: "Paragraph 6 names this phenomenon retrieval-induced forgetting, where retrieving certain memories causes related but unwanted memories to be suppressed."
    },
  ],
},
{
  id: "rx03",
  title: "Growing Up: Vertical Farming and the Future of Urban Food",
  topic: "Agriculture / Technology",
  words: 855,
  source: "IELTS Academic Reading · Cambridge 19 (2024) standard · original, Jun 2026",
  paras: [
    "As the world's population becomes increasingly concentrated in cities, the question of how to feed urban populations has acquired fresh urgency. Conventional agriculture depends on vast areas of arable land, much of it located far from the markets it ultimately supplies. The resulting food often travels hundreds of kilometres before reaching consumers, accumulating costs and emissions along the way. Against this background, a once-marginal idea has moved towards the centre of debate: the cultivation of crops indoors, in stacked layers, within or close to the cities that consume them. Known as vertical farming, the approach promises to bring production and consumption into far closer proximity than traditional methods ever could.",
    "The principle is deceptively simple. Instead of spreading crops horizontally across fields, growers arrange them vertically on shelves housed in controlled environments, frequently in repurposed warehouses or purpose-built towers. Plants are typically grown without soil, their roots suspended in nutrient-rich water (a technique called hydroponics) or bathed in a fine mist (known as aeroponics). Light-emitting diodes, tuned to the precise wavelengths that plants absorb most efficiently, replace sunlight entirely. Because every variable can be regulated, from temperature and humidity to the concentration of carbon dioxide, the indoor farm is in effect a factory in which growing conditions never deviate from the optimum.",
    "The advantages claimed for this model are considerable. Yields per square metre can far exceed those of open fields, partly because crops grow in tightly packed tiers and partly because harvests continue throughout the year, unaffected by season or weather. Water use is dramatically lower, since the liquid that nourishes the plants is captured and recirculated rather than lost to the ground or the air; some operators report consuming as little as five per cent of the water a conventional farm would require for an equivalent crop. Pesticides become largely unnecessary, as the sealed environment keeps insects and diseases at bay. Perhaps most strikingly, a vertical farm can be situated almost anywhere, including districts where no arable land exists, allowing leafy greens and herbs to be picked and delivered within hours.",
    "Yet for all these merits, the economics of vertical farming remain stubbornly difficult. The single greatest obstacle is energy. Replacing free sunlight with artificial illumination, and maintaining a constant climate inside a sealed building, consumes electricity on a scale that conventional growers never confront. Where that electricity is generated from fossil fuels, the environmental gains from reduced transport and water use may be cancelled out, or even reversed. Critics have therefore questioned whether the practice deserves its green reputation at all. The verdict depends heavily on the local energy supply: a vertical farm powered by hydroelectric or solar generation tells a very different story from one drawing on a coal-fired grid.",
    "Cost is a further constraint that has humbled several ambitious ventures. Constructing and equipping a vertical farm demands enormous initial investment in lighting, climate control and automation, and the running expenses, dominated by power, eat into already slender margins. The crops that prove profitable under these conditions tend to be a narrow range of fast-growing, high-value plants, chiefly salad leaves, microgreens and culinary herbs, which command good prices and reach maturity quickly. Staple crops such as wheat, rice and potatoes, by contrast, occupy too much space and sell too cheaply to justify the expense. For this reason, few specialists believe that vertical farming will ever displace the open field as the source of humanity's basic calories.",
    "The sector's recent history has been turbulent. During the early 2020s, a wave of enthusiasm attracted substantial venture capital, and a number of high-profile companies expanded rapidly on the strength of optimistic projections. When energy prices rose sharply and the predicted demand failed to materialise at the anticipated scale, several of these firms collapsed or drastically reduced their operations. The episode served as a sobering corrective to earlier hype, yet it did not extinguish interest in the underlying technology. Instead, it prompted a more measured assessment of where vertical farming genuinely makes sense and where it does not.",
    "Looking ahead, most observers expect the technology to occupy a complementary rather than a dominant role. In regions where land is scarce, water is precious or imported produce is expensive, such as desert states, isolated islands and densely built cities, vertical farms may supply a meaningful share of fresh vegetables. Continued improvements in the efficiency of light-emitting diodes, together with the falling cost of renewable electricity, could gradually tilt the economic balance in the practice's favour. Some researchers also envisage integrating vertical farms with other urban systems, capturing waste heat from nearby buildings or treating the carbon dioxide that growing plants conveniently absorb.",
    "Whether vertical farming ultimately fulfils its early promise will depend less on the technology itself, which is already mature, than on the wider context in which it operates. Cheaper clean energy, smarter design and a sober appreciation of its limits could secure the practice a lasting place in the urban landscape. For now, it is best understood not as a replacement for the farm but as one tool among many in the long search for a sustainable way to feed an increasingly urban world."
  ],
  questions: [
    {
      type: "tfng",
      q: "Most food produced by conventional agriculture is grown close to the cities where it is consumed.",
      answer: "FALSE",
      explanation: "The first paragraph states conventional agriculture depends on arable land 'much of it located far from the markets it ultimately supplies', and food 'often travels hundreds of kilometres'."
    },
    {
      type: "tfng",
      q: "In a vertical farm, the growing conditions are kept constant rather than allowed to change.",
      answer: "TRUE",
      explanation: "The second paragraph says every variable can be regulated and 'growing conditions never deviate from the optimum'."
    },
    {
      type: "tfng",
      q: "Salad leaves grown in vertical farms taste better than those grown in open fields.",
      answer: "NOT GIVEN",
      explanation: "The passage discusses the yield, cost and profitability of salad leaves but makes no comparison of their taste with field-grown crops."
    },
    {
      type: "tfng",
      q: "The collapse of several vertical-farming companies in the early 2020s caused interest in the technology to disappear.",
      answer: "FALSE",
      explanation: "The sixth paragraph states the episode 'did not extinguish interest in the underlying technology' and prompted a more measured assessment."
    },
    {
      type: "ynng",
      q: "Does the writer believe that vertical farming is automatically better for the environment than conventional farming?",
      answer: "NO",
      explanation: "The fourth paragraph argues that where electricity comes from fossil fuels the environmental gains 'may be cancelled out, or even reversed', so the benefit is not automatic."
    },
    {
      type: "ynng",
      q: "Does the writer expect vertical farming to replace conventional field agriculture as the main source of basic foods?",
      answer: "NO",
      explanation: "The fifth paragraph says few specialists believe it 'will ever displace the open field as the source of humanity's basic calories', and the final paragraph calls it 'one tool among many', not a replacement."
    },
    {
      type: "mc",
      q: "According to the passage, one reason vertical farms can grow crops all year round is that",
      options: [
        "they rely on naturally long growing seasons in cities.",
        "their production is not affected by season or weather.",
        "they import seedlings from warmer regions.",
        "they use genetically modified fast-growing plants."
      ],
      answer: 1,
      explanation: "The third paragraph says harvests 'continue throughout the year, unaffected by season or weather'."
    },
    {
      type: "mc",
      q: "The writer identifies which factor as the single biggest difficulty facing vertical farming?",
      options: [
        "the shortage of suitable urban buildings",
        "consumer reluctance to buy indoor-grown produce",
        "the amount of energy the farms consume",
        "the risk of insect infestation in sealed spaces"
      ],
      answer: 2,
      explanation: "The fourth paragraph states 'The single greatest obstacle is energy', citing artificial lighting and climate control."
    },
    {
      type: "mc",
      q: "What does the passage suggest about the future role of vertical farming?",
      options: [
        "It will dominate global food production within a decade.",
        "It will be abandoned once energy prices fall.",
        "It will play a supporting role, especially where land or water is limited.",
        "It will be restricted to growing staple crops such as wheat and rice."
      ],
      answer: 2,
      explanation: "The seventh paragraph expects 'a complementary rather than a dominant role', particularly where land is scarce or water is precious."
    },
    {
      type: "gap",
      q: "In the soil-free technique known as aeroponics, the roots of the plants are bathed in a fine ____.",
      answer: ["mist"],
      explanation: "The second paragraph describes aeroponics as roots 'bathed in a fine mist'."
    },
    {
      type: "gap",
      q: "Because the water that feeds the plants is captured and ____ rather than lost, water use in vertical farms is far lower.",
      answer: ["recirculated"],
      explanation: "The third paragraph says the liquid 'is captured and recirculated rather than lost to the ground or the air'."
    },
    {
      type: "gap",
      q: "Staple crops are considered unsuitable for vertical farms partly because they occupy too much ____.",
      answer: ["space"],
      explanation: "The fifth paragraph states staple crops 'occupy too much space and sell too cheaply'."
    },
    {
      type: "gap",
      q: "Some researchers propose linking vertical farms to surrounding buildings in order to capture their waste ____.",
      answer: ["heat"],
      explanation: "The seventh paragraph mentions 'capturing waste heat from nearby buildings'."
    }
  ],
},
{
  id: "rx04",
  title: "Reading the Sky: Celestial Navigation Before Satellites",
  topic: "History / Navigation",
  words: 831,
  source: "IELTS Academic Reading · Cambridge 19 (2024) standard · original, Jun 2026",
  paras: [
    "For the greater part of recorded history, sailors who ventured beyond the sight of land had no instrument that could tell them, at a glance, where they were. The coastline that had guided earlier voyages simply vanished, and with it the familiar landmarks of headland, river mouth and harbour wall. What remained constant, in clear weather at least, was the sky. The sun by day and the stars by night moved across the heavens in patterns that, although bewilderingly complex at first acquaintance, were in fact strictly regular. Mariners gradually learned to treat these moving lights as a vast natural clock and chart combined. The discipline that grew out of this learning is known as celestial navigation, and for almost three thousand years it was the only reliable means of crossing open water.",
    "The principle behind it is deceptively simple. Because the Earth is a sphere, the height of a particular star above the horizon depends on how far north or south of the equator the observer happens to be. A navigator who measured that height accurately could therefore work out his latitude, his position along the north-south axis. In the northern hemisphere the most useful reference point was Polaris, the Pole Star, which sits almost directly above the North Pole and barely appears to move during the night. By measuring the angle between Polaris and the horizon, a sailor obtained his latitude with reasonable precision. The Polynesian navigators of the Pacific, working entirely without written records, memorised the rising and setting points of dozens of stars and used them as a kind of compass, passing this knowledge from one generation to the next through chant and apprenticeship.",
    "Measuring an angle from the heaving deck of a ship was far from easy. The earliest devices were crude. The astrolabe, adapted by Arab astronomers and later carried aboard Portuguese vessels, was a heavy disc suspended from the thumb; the navigator sighted a star along a movable arm and read off the angle. On a rolling vessel the instrument swung wildly, and a single reading might be wrong by several degrees. The cross-staff and, later, the backstaff improved matters, but it was the invention of the sextant in the eighteenth century that transformed the practice. Using mirrors, the sextant brought the image of a star down to the horizon, so that the navigator measured the gap between the two directly. Crucially, the doubled image moved with the ship, cancelling out much of the motion and allowing measurements accurate to a fraction of a degree.",
    "Latitude, however, was only half of the problem, and by far the easier half. To fix a position completely a navigator also needed longitude, the east-west coordinate, and longitude proved enormously difficult to determine. The reason lies in the rotation of the Earth, which turns a full circle in twenty-four hours. This means that every hour of difference in local time corresponds to fifteen degrees of longitude. If a sailor could compare the local time aboard ship, easily found from the sun, with the time at a known reference place such as a home port, the difference would give the longitude at once. The obstacle was that no clock of the period could keep accurate time during a long voyage. Pendulum clocks were useless at sea, and ordinary timepieces drifted hopelessly in the heat, damp and constant motion of a ship.",
    "The consequences of this ignorance were severe. Unable to fix their longitude, captains frequently ran aground or wasted weeks searching for islands that lay only a short distance from their actual track. In 1707 a British fleet, mistaking its position, struck the rocks of the Scilly Isles with the loss of some two thousand lives. The disaster prompted the British government, seven years later, to offer a substantial cash prize to anyone who could devise a practical method of finding longitude at sea. The challenge attracted astronomers, mathematicians and instrument-makers across Europe, and for decades it remained unsolved.",
    "The eventual solution came from an unexpected quarter. John Harrison, a self-taught Yorkshire carpenter, devoted much of his life to building a clock that would keep time at sea despite temperature changes and the ship's movement. His series of marine timekeepers, refined over more than thirty years, culminated in a compact watch that lost only a few seconds on a voyage of several weeks. When such instruments, known as chronometers, became affordable, the longitude problem was effectively solved. A navigator now carried the reference time in his pocket and could calculate his position with a confidence that earlier generations would have envied.",
    "Celestial navigation remained the backbone of ocean travel until well into the twentieth century, when radio signals and ultimately satellite systems began to replace it. Yet the older skill has not entirely disappeared. Naval academies still teach it, partly as a safeguard against electronic failure, and a small community of enthusiasts continues to cross oceans guided by sextant and star tables alone. There is, they argue, a particular satisfaction in fixing one's place on the planet using nothing but a precise instrument, a reliable clock and the unchanging geometry of the sky."
  ],
  questions: [
    {
      type: "tfng",
      q: "Before the development of celestial navigation, sailors relied on visible features of the coast to guide their voyages.",
      answer: "TRUE",
      explanation: "The first paragraph states that the coastline guided earlier voyages through 'the familiar landmarks of headland, river mouth and harbour wall'."
    },
    {
      type: "tfng",
      q: "The patterns made by the sun and stars across the sky are random and unpredictable.",
      answer: "FALSE",
      explanation: "The passage says the lights 'moved across the heavens in patterns that, although bewilderingly complex at first acquaintance, were in fact strictly regular'."
    },
    {
      type: "tfng",
      q: "Polynesian navigators recorded the positions of the stars in written charts.",
      answer: "FALSE",
      explanation: "The text states they worked 'entirely without written records' and passed knowledge 'through chant and apprenticeship'."
    },
    {
      type: "tfng",
      q: "The astrolabe was originally invented by Portuguese sailors.",
      answer: "NOT GIVEN",
      explanation: "The passage says the astrolabe was 'adapted by Arab astronomers and later carried aboard Portuguese vessels', but does not state who originally invented it."
    },
    {
      type: "ynng",
      q: "Does the writer regard the basic principle of celestial navigation as more complicated than it first appears?",
      answer: "NO",
      explanation: "The writer describes the principle as 'deceptively simple', indicating it is simpler than it might seem, not more complicated."
    },
    {
      type: "ynng",
      q: "Does the writer believe that the older skill of celestial navigation still has value today?",
      answer: "YES",
      explanation: "The final paragraph notes naval academies teach it 'as a safeguard against electronic failure' and describes the 'particular satisfaction' it offers, showing the writer sees continuing value."
    },
    {
      type: "mc",
      q: "Why was the sextant a significant improvement over earlier instruments?",
      options: [
        "It was much lighter and easier to carry on board.",
        "Its doubled image moved with the ship and cancelled out much of the motion.",
        "It did not require the navigator to look at the horizon.",
        "It could measure longitude as well as latitude."
      ],
      answer: 1,
      explanation: "The third paragraph explains 'the doubled image moved with the ship, cancelling out much of the motion and allowing measurements accurate to a fraction of a degree'."
    },
    {
      type: "mc",
      q: "What made the determination of longitude so difficult before Harrison's work?",
      options: [
        "Sailors could not measure the height of the sun accurately.",
        "The reference port was usually too far away.",
        "No clock of the period could keep accurate time during a long voyage.",
        "The Earth's rotation was not yet understood."
      ],
      answer: 2,
      explanation: "The fourth paragraph states 'no clock of the period could keep accurate time during a long voyage', identifying the timekeeping failure as the obstacle."
    },
    {
      type: "mc",
      q: "What prompted the British government to offer a prize for finding longitude?",
      options: [
        "A shipwreck off the Scilly Isles that caused heavy loss of life.",
        "Pressure from European astronomers and mathematicians.",
        "The invention of the marine chronometer.",
        "A shortage of skilled navigators in the navy."
      ],
      answer: 0,
      explanation: "The fifth paragraph links the 1707 disaster at the Scilly Isles, with 'the loss of some two thousand lives', to the government's decision to offer the prize."
    },
    {
      type: "gap",
      q: "In the northern hemisphere, navigators used ____ as their most useful reference point because it sits almost directly above the North Pole.",
      answer: ["polaris", "the pole star"],
      explanation: "The second paragraph names Polaris, the Pole Star, which 'sits almost directly above the North Pole and barely appears to move'."
    },
    {
      type: "gap",
      q: "Each hour of difference in local time corresponds to fifteen ____ of longitude.",
      answer: ["degrees"],
      explanation: "The fourth paragraph states 'every hour of difference in local time corresponds to fifteen degrees of longitude'."
    },
    {
      type: "gap",
      q: "John Harrison was a self-taught ____ from Yorkshire who built clocks to keep time at sea.",
      answer: ["carpenter", "yorkshire carpenter"],
      explanation: "The sixth paragraph describes him as 'a self-taught Yorkshire carpenter' who devoted his life to building a sea clock."
    },
    {
      type: "gap",
      q: "Accurate marine timekeepers eventually became known as ____.",
      answer: ["chronometers"],
      explanation: "The sixth paragraph states that such instruments became 'known as chronometers', after which the longitude problem was solved."
    }
  ],
},
{
  id: "rx05",
  title: "The Living Architecture of the Sea",
  topic: "Marine Biology",
  words: 824,
  source: "IELTS Academic Reading · Cambridge 19 (2024) standard · original, Jun 2026",
  paras: [
    "Coral reefs occupy less than one per cent of the ocean floor, yet they shelter roughly a quarter of all known marine species. This striking disproportion has led biologists to describe them as the rainforests of the sea, a comparison that captures both their extraordinary biological richness and their structural complexity. A reef is not, as is sometimes assumed, a lifeless rock formation. It is built by colonies of tiny animals called polyps, each no larger than a pinhead, which secrete a hard skeleton of calcium carbonate. Over centuries, the accumulated skeletons of countless generations form the towering ridges and intricate caverns that constitute a mature reef. The largest such structure, the Great Barrier Reef off the coast of Australia, extends for more than two thousand kilometres and is the only living formation visible from space.",
    "The biological success of reef-building corals rests on a remarkable partnership. Within the tissues of each polyp live microscopic algae known as zooxanthellae. Through photosynthesis these algae convert sunlight into sugars, and they pass as much as ninety per cent of this energy to their coral hosts. In return, the polyps provide the algae with shelter and with the nitrogen and carbon dioxide that photosynthesis requires. This mutually beneficial arrangement, known as symbiosis, explains why thriving reefs are confined to clear, shallow, sunlit waters, typically no deeper than fifty metres. It also explains their vivid colouration, for the pigments that give corals their famous hues belong not to the polyps themselves but to the algae that inhabit them.",
    "The ecological value of reefs extends well beyond the species that live within them. Reefs function as natural breakwaters, absorbing a substantial proportion of the energy carried by waves before it reaches the shore. A healthy reef can reduce wave energy by up to ninety-seven per cent, sparing coastal communities from erosion and storm damage that would otherwise be severe. The economic dimension of this protection is considerable. Researchers estimate that reefs guard property and infrastructure worth billions of dollars each year, a service that would be prohibitively expensive to replicate with artificial sea walls. In addition, reefs underpin fisheries that feed hundreds of millions of people and sustain a tourism industry on which many tropical economies depend.",
    "Despite their resilience over geological time, modern reefs are proving acutely vulnerable to rapid environmental change. The most widely publicised threat is coral bleaching. When water temperatures rise even one or two degrees above the seasonal maximum, the stressed polyps expel their algal partners, losing both their colour and their principal source of nourishment. A bleached coral is not immediately dead, and if normal conditions return quickly the algae may be reacquired. If the stress is prolonged, however, the starved polyps perish, and the reef begins to disintegrate. Mass bleaching events, once exceptional, have become alarmingly frequent: several have struck the Great Barrier Reef within a single decade, leaving extensive stretches of the formation severely damaged.",
    "A second and more insidious danger arises from the chemistry of the ocean itself. As the atmosphere accumulates carbon dioxide, a portion of that gas dissolves into seawater, where it forms carbonic acid and lowers the water's pH. This process, termed ocean acidification, makes it progressively harder for corals to extract the carbonate ions they need to build their skeletons. Some studies suggest that if current emission trends continue, reefs may eventually erode faster than they can grow. Unlike bleaching, acidification produces no dramatic visible signal; its effects accumulate slowly and largely unseen, which is precisely why some scientists consider it the graver long-term menace.",
    "Local pressures compound these global ones. Sediment washed from cleared farmland clouds the water and blocks the sunlight on which the symbiotic algae depend. Fertiliser run-off triggers blooms of competing seaweed that smother slow-growing coral. Destructive fishing practices, including the use of explosives and cyanide, shatter reef structures directly, while careless tourism and anchoring inflict further physical harm. Because these stresses act together, a reef already weakened by warming may be unable to withstand a pollution event that a healthy reef would have survived. The cumulative nature of the damage makes any single cause difficult to isolate and any single remedy insufficient.",
    "The outlook, while sobering, is not uniformly bleak. Marine protected areas, where fishing and other activities are restricted, have allowed some reefs to recover a measure of their former vitality. Scientists are experimenting with selectively breeding coral strains that tolerate warmer water, and with cultivating fragments in nurseries before transplanting them onto degraded sites. Such interventions cannot substitute for a reduction in greenhouse gas emissions, which remains the only measure capable of addressing the root of the problem. Nevertheless, they may buy precious time. Whether the living architecture of the sea endures into the next century will depend less on the ingenuity of restoration techniques than on the speed with which humanity curbs the emissions driving the oceans to change."
  ],
  questions: [
    {
      type: "tfng",
      q: "Coral reefs cover a larger area of the ocean floor than is generally believed.",
      answer: "FALSE",
      explanation: "The passage states reefs occupy 'less than one per cent of the ocean floor', so they do not cover a large area."
    },
    {
      type: "tfng",
      q: "The colours seen in healthy corals are produced by the algae rather than by the polyps.",
      answer: "TRUE",
      explanation: "The text says the pigments giving corals their hues 'belong not to the polyps themselves but to the algae that inhabit them'."
    },
    {
      type: "tfng",
      q: "Coral that has bleached can never regain its algae under any circumstances.",
      answer: "FALSE",
      explanation: "The passage states that 'if normal conditions return quickly the algae may be reacquired', so recovery is possible."
    },
    {
      type: "tfng",
      q: "The Great Barrier Reef supports more marine species than any other reef on Earth.",
      answer: "NOT GIVEN",
      explanation: "The passage notes the reef's length and visibility from space but makes no claim comparing its species count with other reefs."
    },
    {
      type: "ynng",
      q: "Does the writer believe ocean acidification is more dangerous in the long term than bleaching?",
      answer: "YES",
      explanation: "The writer reports that acidification, being slow and unseen, is why 'some scientists consider it the graver long-term menace' and frames it as more insidious."
    },
    {
      type: "ynng",
      q: "Does the writer think restoration techniques alone will be enough to save reefs?",
      answer: "NO",
      explanation: "The text states such interventions 'cannot substitute for a reduction in greenhouse gas emissions, which remains the only measure capable of addressing the root of the problem'."
    },
    {
      type: "mc",
      q: "According to the passage, why are thriving reefs limited to shallow, clear water?",
      options: [
        "The polyps cannot survive high water pressure at depth.",
        "The symbiotic algae require sunlight to photosynthesise.",
        "Wave energy in deeper water destroys the coral skeletons.",
        "Predators of coral are more common in deeper water."
      ],
      answer: 1,
      explanation: "The symbiosis with light-dependent algae 'explains why thriving reefs are confined to clear, shallow, sunlit waters'."
    },
    {
      type: "mc",
      q: "What does the writer suggest about the coastal protection that reefs provide?",
      options: [
        "It is less effective than purpose-built sea walls.",
        "It would be very costly to reproduce by artificial means.",
        "It benefits only the tourism industry.",
        "It has been exaggerated by previous researchers."
      ],
      answer: 1,
      explanation: "The text says replicating this protection 'with artificial sea walls' would be 'prohibitively expensive'."
    },
    {
      type: "mc",
      q: "Why does the writer describe the combined local and global threats as especially serious?",
      options: [
        "They affect only reefs that are already legally protected.",
        "They make a single cause and a single solution hard to identify.",
        "They are confined to the Great Barrier Reef.",
        "They can be reversed quickly once warming stops."
      ],
      answer: 1,
      explanation: "The passage states the cumulative damage 'makes any single cause difficult to isolate and any single remedy insufficient'."
    },
    {
      type: "gap",
      q: "Each coral polyp builds a hard skeleton made of ____.",
      answer: ["calcium carbonate"],
      explanation: "The passage states the polyps 'secrete a hard skeleton of calcium carbonate'."
    },
    {
      type: "gap",
      q: "A healthy reef can reduce the energy of waves by as much as ____ per cent.",
      answer: ["ninety-seven", "97"],
      explanation: "The text states a healthy reef 'can reduce wave energy by up to ninety-seven per cent'."
    },
    {
      type: "gap",
      q: "When carbon dioxide dissolves in seawater it forms ____, which lowers the pH.",
      answer: ["carbonic acid"],
      explanation: "The passage explains the dissolved gas 'forms carbonic acid and lowers the water's pH'."
    },
    {
      type: "gap",
      q: "Run-off containing ____ encourages blooms of seaweed that smother coral.",
      answer: ["fertiliser", "fertilizer"],
      explanation: "The text says 'Fertiliser run-off triggers blooms of competing seaweed that smother slow-growing coral'."
    }
  ],
},
{
  id: "rx06",
  title: "Pricing the Right to Drive",
  topic: "Economics / Cities",
  words: 831,
  source: "IELTS Academic Reading · Cambridge 19 (2024) standard · original, Jun 2026",
  paras: [
    "For most of the twentieth century, urban planners treated road space as a free public good, to be supplied in ever greater quantities as the number of motor vehicles grew. Streets were widened, ring roads were laid, and flyovers were thrown across crowded districts in the belief that congestion was an engineering problem with an engineering solution. Yet the relief these schemes brought was almost always temporary. Within a few years the new capacity filled, and traffic crawled once more. Economists have a name for this disappointing cycle. They call it induced demand: when something valuable is offered without charge, people consume more of it than they otherwise would, and the queue simply reappears at a larger scale.",
    "The reason a road behaves so awkwardly lies in a peculiarity of its economics. A driver who joins a busy street pays for petrol, for the wear on the vehicle, and for the value of the time spent travelling. What the driver does not pay for is the delay imposed on everyone else, since each additional car slows the whole stream. This unpaid cost, which economists label a negative externality, is borne by other road users rather than by the person who creates it. Because the private cost of a trip falls short of its true social cost, the road is used more heavily than is efficient for the city as a whole. The market, left to itself, sends the wrong signal.",
    "The classic remedy, first proposed in the 1920s by the British economist Arthur Pigou and refined decades later by the Nobel laureate William Vickrey, is to make the missing cost visible through a charge. If drivers were required to pay a fee that reflected the congestion they caused, and if that fee rose during the busiest hours, some would choose to travel earlier or later, to share a vehicle, to switch to a bus or train, or to forgo the journey altogether. The aim is not to banish cars but to ration a scarce resource by price rather than by the blunt mechanism of waiting in a queue. In principle, the charge should equal the gap between private and social cost at the moment the trip is taken.",
    "Turning this elegant idea into a working policy proved difficult. Until recently the technology for measuring and billing individual journeys did not exist at an acceptable cost, and the political obstacles were formidable. Motorists tend to regard the freedom to drive as a right, and any new charge as an unfair tax on an activity they already pay for heavily through fuel duty and vehicle licensing. Singapore was the pioneer, introducing a paper-licence scheme in 1975 and later an automated electronic system, but for many years few other cities dared to follow. The turning point came in February 2003, when London imposed a daily fee on vehicles entering its centre, despite warnings that the plan would prove unworkable and politically fatal.",
    "The London results surprised even some of the scheme's supporters. Traffic entering the charging zone fell by roughly a fifth in the first year, average speeds rose, and bus passengers no longer found their journeys swallowed by gridlock. Revenue from the charge was directed, by law, into improving public transport, which softened the objection that the policy merely punished drivers. Stockholm, after a seven-month trial in 2006, held a referendum and narrowly voted to keep its own cordon charge; opposition that had been loud before the trial faded once residents experienced the benefits. The lesson, analysts suggested, was that public approval often follows rather than precedes the introduction of pricing.",
    "Critics nonetheless raise a serious objection on grounds of fairness. A flat daily charge, they argue, takes a far larger bite out of a low earner's budget than a wealthy commuter's, so the scheme risks reserving the cleared roads for those who can comfortably pay. Defenders reply that the poorest city dwellers are least likely to own a car in the first place, and that they benefit most from the faster, better-funded buses that the revenue makes possible. The distributional outcome, in other words, depends heavily on how the money raised is spent. Where it is returned to ordinary residents or invested in alternatives to driving, the policy can prove progressive rather than regressive.",
    "Economists are careful to point out what congestion pricing cannot do. It eases the particular delay caused by too many vehicles competing for the same stretch of road at the same time, but it does nothing to widen pavements, plant trees, or make a city quieter and more pleasant on its own. Nor will a charge set too low have much effect, while one set too high may drive commerce away to rival towns. Setting the level correctly demands good data and a willingness to adjust the figure as conditions change. The charge is best understood as one instrument among several, valuable precisely because it tackles a problem that road-building alone has repeatedly failed to solve.",
    "What the experience of recent decades has demonstrated is that traffic is not a fixed quantity to be accommodated but a flexible response to the incentives drivers face. Change the price of a trip and the number of trips changes with it. This insight, long resisted by engineers and politicians alike, is now reshaping how cities think about their streets, and it suggests that the most stubborn urban congestion may yield not to concrete and asphalt but to a carefully designed signal in the form of a price."
  ],
  questions: [
    {
      type: "tfng",
      q: "Road-widening schemes in the twentieth century usually produced only short-lived reductions in congestion.",
      answer: "TRUE",
      explanation: "The first paragraph states that 'the relief these schemes brought was almost always temporary' and that within a few years 'traffic crawled once more'."
    },
    {
      type: "tfng",
      q: "The concept of induced demand was first identified by traffic engineers rather than economists.",
      answer: "NOT GIVEN",
      explanation: "The passage attributes the name 'induced demand' to economists but says nothing about who first identified the concept, so this cannot be verified."
    },
    {
      type: "tfng",
      q: "A driver who joins a congested road pays directly for the delay that his or her car causes to other road users.",
      answer: "FALSE",
      explanation: "The second paragraph explicitly says the driver 'does not pay for' the delay imposed on everyone else; this unpaid cost is borne by other road users."
    },
    {
      type: "tfng",
      q: "Singapore introduced its first congestion charging scheme using automated electronic technology.",
      answer: "FALSE",
      explanation: "The fourth paragraph says Singapore introduced 'a paper-licence scheme in 1975 and later an automated electronic system', so the first scheme was not electronic."
    },
    {
      type: "ynng",
      q: "Does the writer believe the aim of congestion pricing is to remove cars from cities entirely?",
      answer: "NO",
      explanation: "The third paragraph states 'The aim is not to banish cars but to ration a scarce resource by price', directly contradicting this idea."
    },
    {
      type: "ynng",
      q: "Does the writer suggest that public support for road pricing tends to grow after a scheme is in operation?",
      answer: "YES",
      explanation: "The fifth paragraph concludes that 'public approval often follows rather than precedes the introduction of pricing', citing the Stockholm experience."
    },
    {
      type: "mc",
      q: "According to the second paragraph, why is a road used more heavily than is efficient for a city?",
      options: [
        "because drivers underestimate the cost of petrol and vehicle wear",
        "because the private cost of a trip is lower than its true social cost",
        "because public transport alternatives are too expensive for most people",
        "because cities deliberately keep road space free to encourage commerce"
      ],
      answer: 1,
      explanation: "The paragraph states that 'the private cost of a trip falls short of its true social cost', so the road 'is used more heavily than is efficient'."
    },
    {
      type: "mc",
      q: "What does the writer identify as the main reason London's charge attracted less opposition over time?",
      options: [
        "The daily fee was gradually reduced after the first year.",
        "Revenue was legally required to fund better public transport.",
        "The charging zone was made smaller than originally planned.",
        "Drivers were given exemptions if they shared their vehicles."
      ],
      answer: 1,
      explanation: "The fifth paragraph says revenue 'was directed, by law, into improving public transport, which softened the objection that the policy merely punished drivers'."
    },
    {
      type: "mc",
      q: "Which of the following best summarises the writer's view of congestion pricing in the final two paragraphs?",
      options: [
        "It is a complete solution to the problems of modern cities.",
        "It is a useful tool for one specific problem but has clear limits.",
        "It should replace all spending on roads and public transport.",
        "It works only in cities that already have wealthy populations."
      ],
      answer: 1,
      explanation: "The seventh paragraph says the charge 'is best understood as one instrument among several' that cannot, for example, make a city quieter or greener on its own."
    },
    {
      type: "gap",
      q: "Economists describe the delay one car imposes on all the others as a negative ____.",
      answer: ["externality"],
      explanation: "The second paragraph names this unpaid cost as a 'negative externality' borne by other road users."
    },
    {
      type: "gap",
      q: "The economist Arthur Pigou first proposed making the missing cost visible through a ____ in the 1920s.",
      answer: ["charge"],
      explanation: "The third paragraph states the classic remedy proposed by Pigou is 'to make the missing cost visible through a charge'."
    },
    {
      type: "gap",
      q: "Critics argue that a flat daily charge takes a larger share of a ____ budget than a wealthy commuter's.",
      answer: ["low earner's", "low earners"],
      explanation: "The sixth paragraph says the charge 'takes a far larger bite out of a low earner's budget than a wealthy commuter's'."
    },
    {
      type: "gap",
      q: "Whether the policy proves progressive or regressive depends largely on how the ____ is spent.",
      answer: ["money raised", "revenue"],
      explanation: "The sixth paragraph states the distributional outcome 'depends heavily on how the money raised is spent'."
    }
  ]
}
);
