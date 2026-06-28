/* listening_bx.js — 新增 IELTS 听力 section(Cambridge 19 标准, 2026 原创)*/
window.IELTS_DATA.listening = window.IELTS_DATA.listening || [];
window.IELTS_DATA.listening.push(
{
  id: "lx01",
  title: "Booking a Holiday Cottage",
  section: "Section 1 · Everyday conversation",
  scenario: "A customer phones Greenfield Holiday Cottages to book a self-catering cottage; listen for the dates, prices, the cottage name, the deposit, contact details and what is included.",
  source: "IELTS Academic Listening · Cambridge 19 (2024) standard · original, Jun 2026",
  lines: [
    { speaker: "Agent", text: "Good morning, Greenfield Holiday Cottages, Karen speaking. How can I help you?" },
    { speaker: "Customer", text: "Hello, I'd like to book a cottage for a short break in the autumn, if you have anything free." },
    { speaker: "Agent", text: "Of course. Can I take your name first?" },
    { speaker: "Customer", text: "Yes, it's Daniel Forsythe." },
    { speaker: "Agent", text: "Could you spell the surname for me, please?" },
    { speaker: "Customer", text: "Certainly. It's F-O-R-S-Y-T-H-E. Forsythe." },
    { speaker: "Agent", text: "Lovely, thank you. And which dates were you thinking of?" },
    { speaker: "Customer", text: "We'd like to arrive on the fourteenth of October and stay for a week, so leaving on the twenty-first." },
    { speaker: "Agent", text: "Let me have a look. For that week I've got two properties available. The first is Rose Cottage, which sleeps four, and the second is Willow Cottage, which sleeps six." },
    { speaker: "Customer", text: "There'll be five of us, so the smaller one won't be big enough. We'll take the one that sleeps six." },
    { speaker: "Agent", text: "Right, so that's Willow Cottage. It's a lovely converted barn with a wood-burning stove and a large garden." },
    { speaker: "Customer", text: "That sounds perfect. Could you tell me how much it would be for the week?" },
    { speaker: "Agent", text: "For that week in October the rate is two hundred and forty pounds per night." },
    { speaker: "Customer", text: "Sorry, did you say two hundred and forty a night? That's more than I expected." },
    { speaker: "Agent", text: "I do apologise, that's the figure for the whole stay, not per night. The total for the seven nights is six hundred and eighty pounds." },
    { speaker: "Customer", text: "Ah, that's much better. And do I need to pay it all now?" },
    { speaker: "Agent", text: "No, to confirm the booking we just ask for a deposit of one hundred and fifty pounds, and the balance is due four weeks before you arrive." },
    { speaker: "Customer", text: "That's fine. Can you tell me what's included in the price?" },
    { speaker: "Agent", text: "Yes. All your bed linen and towels are provided, and there's free wi-fi throughout. Electricity and heating are included too." },
    { speaker: "Customer", text: "What about firewood for the stove? Is that extra?" },
    { speaker: "Agent", text: "The first basket is complimentary, but after that there's a small charge. Oh, and I should mention the cottage is strictly no pets, I'm afraid." },
    { speaker: "Customer", text: "That's not a problem, we won't be bringing any. Where exactly is the cottage?" },
    { speaker: "Agent", text: "It's in the village of Ashbourne. The postcode is D-E-six, four-L-P, if you want to put it in your sat nav." },
    { speaker: "Customer", text: "DE6 4LP. Got it. And is there parking?" },
    { speaker: "Agent", text: "Yes, there's space for two cars right outside, and check-in is from four o'clock in the afternoon." },
    { speaker: "Customer", text: "Perfect. How would you like the deposit?" },
    { speaker: "Agent", text: "If you give me a call back on our payments line, that's 0-1-3-3-five, double two, seven, eight, one, you can pay by card." },
    { speaker: "Customer", text: "Lovely, I'll ring that number this afternoon. Thank you very much for your help." },
    { speaker: "Agent", text: "You're very welcome, Mr Forsythe. We look forward to seeing you in October." }
  ],
  questions: [
    { type: "gap", q: "The customer's surname is spelled ____.", answer: ["FORSYTHE", "Forsythe"], explanation: "The customer spells it out: 'F-O-R-S-Y-T-H-E. Forsythe.'" },
    { type: "gap", q: "The guests want to arrive on the ____ of October.", answer: ["14th", "fourteenth", "14"], explanation: "The customer says they want to arrive 'on the fourteenth of October'." },
    { type: "gap", q: "The name of the cottage the customer books is ____ Cottage.", answer: ["Willow", "willow"], explanation: "They choose the one that sleeps six, which the agent confirms is 'Willow Cottage'." },
    { type: "gap", q: "The total price for the seven-night stay is ____.", answer: ["£680", "680", "six hundred and eighty pounds"], explanation: "The agent says 'The total for the seven nights is six hundred and eighty pounds.'" },
    { type: "gap", q: "To confirm the booking the customer must pay a deposit of ____.", answer: ["£150", "150", "one hundred and fifty pounds"], explanation: "The agent asks for 'a deposit of one hundred and fifty pounds'." },
    { type: "gap", q: "The postcode of the cottage is ____.", answer: ["DE6 4LP", "DE64LP"], explanation: "The agent gives the postcode 'DE6 4LP', which the customer reads back." },
    { type: "mc", q: "What is NOT included in the price of the cottage?", options: ["Bed linen and towels", "Heating and electricity", "Unlimited firewood for the stove", "Free wi-fi"], answer: 2, explanation: "Linen, towels, wi-fi, electricity and heating are all included; only the first basket of firewood is free, so unlimited firewood is not included." },
    { type: "mc", q: "From what time can guests check in?", options: ["From two o'clock", "From three o'clock", "From four o'clock", "From six o'clock"], answer: 2, explanation: "The agent says 'check-in is from four o'clock in the afternoon.'" },
    { type: "tfng", q: "Guests are allowed to bring pets to the cottage.", answer: "FALSE", explanation: "The agent states 'the cottage is strictly no pets'." },
    { type: "tfng", q: "There is space to park two cars outside the cottage.", answer: "TRUE", explanation: "The agent says 'there's space for two cars right outside'." }
  ],
},
{
  id: "lx02",
  title: "Riverside Science Museum Orientation",
  section: "Section 2 · Monologue",
  scenario: "A guide gives new visitors an orientation talk at a science museum, explaining where exhibits are, opening times, ticket prices, the café and shop, and a couple of rules.",
  source: "IELTS Academic Listening · Cambridge 19 (2024) standard · original, Jun 2026",
  lines: [
    { speaker: "Guide", text: "Good morning everyone, and a very warm welcome to the Riverside Science Museum. My name's Daniel, and I'm one of the visitor guides here. Before you head off to explore, I'd like to spend a few minutes telling you what's where, so you can make the most of your day." },
    { speaker: "Guide", text: "Let me start with the layout, because the building is bigger than it looks from outside. We're standing now in the main entrance hall on the ground floor. If you turn to your right, you'll find the cloakroom, where you can leave coats and large bags free of charge." },
    { speaker: "Guide", text: "Still on the ground floor, the largest gallery is the Space and Flight Hall, which is straight ahead of you through the wide doorway. That's where you'll see the rockets, the satellites and our full-size replica of a lunar landing module, which is very popular with families." },
    { speaker: "Guide", text: "Now, a lot of people ask first about our newest attraction, the Human Body exhibition. That one is not on the ground floor; you'll need to take the lift or the stairs up to the first floor. It opened only last month, and I'd strongly recommend it." },
    { speaker: "Guide", text: "Sharing the first floor with the Human Body is our hands-on area for younger children, called the Discovery Zone, where everything is designed to be touched, pushed and pulled. The two are right next to each other, so families tend to spend most of their morning up there." },
    { speaker: "Guide", text: "If you carry on up to the second floor, you'll reach the Energy and Climate gallery. It's our quietest space, with interactive screens about renewable power, and the views over the river from its windows are honestly some of the best in the whole city." },
    { speaker: "Guide", text: "Let me say a word about opening times, because they vary through the week. From Monday to Friday the museum opens at ten o'clock and closes at five. On Saturdays and Sundays, though, we open an hour earlier, at nine, to give weekend visitors a bit more time. The last entry is always thirty minutes before closing." },
    { speaker: "Guide", text: "Now, you've all bought tickets today, but for those of you thinking of coming back, here's how our pricing works. A standard adult ticket costs fourteen pounds. Children under sixteen are charged half that, so seven pounds each, and children under five come in completely free." },
    { speaker: "Guide", text: "If you think you'll visit more than once, the best value is our annual pass. For just forty pounds, that gives one adult unlimited entry for a whole year, including to the special exhibitions, which usually carry an extra fee for day visitors." },
    { speaker: "Guide", text: "When you need a break, there are two places to get something. On the ground floor near the entrance there's the museum shop, which sells books, posters and science kits to take home. For food and drink, head up to the café, which you'll find on the first floor, just past the Discovery Zone." },
    { speaker: "Guide", text: "The café serves hot meals until two thirty, but drinks, sandwiches and cakes are available right through until closing. I'd add that there's plenty of seating, so even at the busiest times around lunch you should have no trouble finding a table." },
    { speaker: "Guide", text: "Finally, just two quick rules to keep everyone happy. Photography is absolutely fine throughout the museum, and we love it when people share their visit online; however, please switch off the flash, as it can damage some of the older, light-sensitive displays." },
    { speaker: "Guide", text: "And one more thing: we do ask that no food or drink is taken into the galleries themselves. Please finish anything you've bought either in the café or out on the terrace. That's everything from me, so do enjoy your visit, and if you get lost, just look for a guide in a green shirt." }
  ],
  questions: [
    {
      type: "gap",
      q: "The full-size replica of a lunar landing module is in the Space and ____ Hall.",
      answer: ["Flight", "flight"],
      explanation: "The guide says the largest ground-floor gallery is the 'Space and Flight Hall', which contains the lunar landing module replica."
    },
    {
      type: "gap",
      q: "On weekdays the museum closes at ____ o'clock.",
      answer: ["5", "five"],
      explanation: "The guide says that Monday to Friday the museum 'opens at ten o'clock and closes at five'."
    },
    {
      type: "gap",
      q: "At weekends the museum opens at ____ o'clock.",
      answer: ["9", "nine"],
      explanation: "The guide says on Saturdays and Sundays 'we open an hour earlier, at nine'."
    },
    {
      type: "gap",
      q: "A child under sixteen pays ____ pounds for a standard ticket.",
      answer: ["7", "seven"],
      explanation: "Children under sixteen are charged half the adult price, 'so seven pounds each'."
    },
    {
      type: "gap",
      q: "An annual pass for one adult costs ____ pounds.",
      answer: ["40", "forty"],
      explanation: "The guide says the annual pass costs 'just forty pounds' for one adult's unlimited entry."
    },
    {
      type: "mc",
      q: "On which floor is the Human Body exhibition?",
      options: ["The ground floor", "The first floor", "The second floor", "The terrace"],
      answer: 1,
      explanation: "The guide says the Human Body exhibition is 'not on the ground floor' and you take the lift or stairs 'up to the first floor'."
    },
    {
      type: "mc",
      q: "What does the guide say about the Energy and Climate gallery?",
      options: ["It is the museum's newest gallery.", "It is the noisiest part of the museum.", "It offers very good views of the river.", "It is closed at weekends."],
      answer: 2,
      explanation: "The guide says of the second-floor gallery that 'the views over the river from its windows are honestly some of the best in the whole city'."
    },
    {
      type: "mc",
      q: "Where can visitors buy science kits to take home?",
      options: ["In the café", "In the Discovery Zone", "In the museum shop", "On the terrace"],
      answer: 2,
      explanation: "The guide says the museum shop on the ground floor 'sells books, posters and science kits to take home'."
    },
    {
      type: "tfng",
      q: "Hot meals are served in the café until closing time.",
      answer: "FALSE",
      explanation: "The guide says the café 'serves hot meals until two thirty', while only drinks, sandwiches and cakes continue until closing, so hot meals are not served all day."
    },
    {
      type: "tfng",
      q: "Visitors are allowed to take photographs with the flash on.",
      answer: "FALSE",
      explanation: "The guide says photography is fine but asks visitors to 'switch off the flash, as it can damage some of the older, light-sensitive displays'."
    }
  ],
},
{
  id: "lx03",
  title: "The Bystander Effect Field Study",
  section: "Section 3 · Academic discussion",
  scenario: "Two psychology students, Megan and Tom, meet their tutor Dr Hartley to plan a field study on helping behaviour; listen for the method, who does which task, the sample size, the equipment, and the deadline.",
  source: "IELTS Academic Listening · Cambridge 19 (2024) standard · original, Jun 2026",
  lines: [
    { speaker: "Dr Hartley", text: "Come in, Megan, Tom. So, you've chosen the bystander effect for your field study. Have you settled on how you'll actually collect the data?" },
    { speaker: "Megan", text: "We have. We're going with covert observation rather than a questionnaire. We thought asking people whether they'd help would just give us what they think they ought to say." },
    { speaker: "Dr Hartley", text: "That's sensible. Self-report on helping behaviour is notoriously unreliable. So you'll stage a situation and watch how passers-by respond?" },
    { speaker: "Tom", text: "Exactly. One of us drops a folder of papers near the library steps, and we record whether anyone stops to help and how long it takes them." },
    { speaker: "Dr Hartley", text: "Good. And what's your independent variable? What are you actually changing between trials?" },
    { speaker: "Megan", text: "The number of other people standing nearby. We want to see whether people are slower to help when there's a crowd than when the street is almost empty." },
    { speaker: "Dr Hartley", text: "That's the classic prediction. Now, who's doing what? With covert work it matters that the roles are clear before you start." },
    { speaker: "Tom", text: "I'll be the one dropping the folder, since I don't mind looking a bit clumsy in public. Megan stays back and times the response." },
    { speaker: "Megan", text: "And I'll handle the write-up afterwards, the analysis section especially. Tom's stronger on setting up the situation, so it splits quite naturally." },
    { speaker: "Dr Hartley", text: "What about recruiting your participants? Or rather, since they don't know they're in a study, what about logging them?" },
    { speaker: "Megan", text: "There's no recruiting as such. We just record whoever happens to walk past during the session. Tom's keeping a tally of everyone who passes, whether they help or not." },
    { speaker: "Dr Hartley", text: "Right, so Tom does the counting as well as the staging. That's a lot for one person mid-trial." },
    { speaker: "Tom", text: "It is, so we agreed Megan takes over the head-count if I'm in the middle of dropping the folder. The timing she can do at the same time." },
    { speaker: "Dr Hartley", text: "Sensible. Now, how many observations are you aiming for? A handful won't tell you anything." },
    { speaker: "Megan", text: "We're aiming for sixty separate trials. We did wonder about a hundred, but the ethics form has to be approved first and that eats into our time." },
    { speaker: "Dr Hartley", text: "Sixty is defensible at this level. Just make sure they're spread across different times of day, not all at lunchtime." },
    { speaker: "Tom", text: "We've blocked out morning and late-afternoon slots for that reason. Same spot each time, though, so the location stays constant." },
    { speaker: "Dr Hartley", text: "Good thinking. And how are you measuring the response time precisely? You can't just guess at it." },
    { speaker: "Megan", text: "We thought about a phone, but the screen's hard to read outdoors. So we're using a stopwatch instead. It's easier to start the instant the folder lands." },
    { speaker: "Dr Hartley", text: "A stopwatch is fine. Are you recording anything visually? Filming members of the public is a real ethical minefield, you know." },
    { speaker: "Tom", text: "We did consider a small camera at first, but the consent issue ruled it out. Everything goes straight onto a paper tally sheet by hand." },
    { speaker: "Dr Hartley", text: "That's the right call. No images of identifiable people without consent, full stop. Now, the part everyone forgets: when is this due?" },
    { speaker: "Megan", text: "The written report has to be submitted by the fourteenth of March. The data collection itself we want wrapped up a fortnight before that." },
    { speaker: "Dr Hartley", text: "So roughly the end of February for fieldwork. That leaves you two clear weeks to analyse and write. Don't let it slip, March comes round fast." },
    { speaker: "Tom", text: "We won't. Megan's already drafted the introduction, so once the numbers are in she can move straight to the results." },
    { speaker: "Dr Hartley", text: "Excellent. One last thing, do book the ethics approval now. If that's late, nothing else can start, and I can't extend the March deadline for you." },
    { speaker: "Megan", text: "Understood. We'll get the form in this week." },
    { speaker: "Dr Hartley", text: "Then you're in good shape. Send me the ethics form before you submit it and I'll check it over." }
  ],
  questions: [
    {
      type: "mc",
      q: "Why did the students reject a questionnaire as their method?",
      options: [
        "It would have taken too long to design",
        "People tend to report what they feel they should do",
        "The tutor advised against using one",
        "It could not measure response times"
      ],
      answer: 1,
      explanation: "Megan says asking people 'would just give us what they think they ought to say', i.e. socially desirable answers."
    },
    {
      type: "mc",
      q: "What is the independent variable in the study?",
      options: [
        "The time of day the trial takes place",
        "The location where the folder is dropped",
        "The number of other people standing nearby",
        "How heavy the dropped folder is"
      ],
      answer: 2,
      explanation: "Megan identifies the variable being changed as 'the number of other people standing nearby'."
    },
    {
      type: "mc",
      q: "Why was a phone rejected for timing the responses?",
      options: [
        "Its screen is hard to read outdoors",
        "It might record people without consent",
        "Its battery would not last a session",
        "It was not accurate enough"
      ],
      answer: 0,
      explanation: "Megan says of the phone 'the screen's hard to read outdoors', so they chose a stopwatch."
    },
    {
      type: "mc",
      q: "What does Dr Hartley insist the students do straight away?",
      options: [
        "Increase the number of trials to a hundred",
        "Choose a second observation location",
        "Book the ethics approval",
        "Send him a draft of the results"
      ],
      answer: 2,
      explanation: "At the end he says 'do book the ethics approval now', warning that nothing else can start otherwise."
    },
    {
      type: "gap",
      q: "The students will collect their data using ____ observation.",
      answer: ["covert"],
      explanation: "Megan: 'We're going with covert observation rather than a questionnaire.'"
    },
    {
      type: "gap",
      q: "The student who drops the folder is ____.",
      answer: ["Tom"],
      explanation: "Tom says 'I'll be the one dropping the folder', while Megan times the response."
    },
    {
      type: "gap",
      q: "The students are aiming for a total of ____ separate trials.",
      answer: ["60", "sixty"],
      explanation: "Megan: 'We're aiming for sixty separate trials.'"
    },
    {
      type: "gap",
      q: "The written report must be submitted by the ____ of March.",
      answer: ["14th", "fourteenth", "14"],
      explanation: "Megan states the report 'has to be submitted by the fourteenth of March'."
    },
    {
      type: "tfng",
      q: "The students decided to film passers-by with a small camera.",
      answer: "FALSE",
      explanation: "Tom says the camera was 'ruled out' by the consent issue; everything is recorded on a paper tally sheet."
    },
    {
      type: "tfng",
      q: "Megan has already written a draft of the introduction.",
      answer: "TRUE",
      explanation: "Tom says 'Megan's already drafted the introduction', so she can move straight to the results."
    }
  ],
},
{
  id: "lx04",
  title: "Monitoring Volcanoes and Predicting Eruptions",
  section: "Section 4 · Academic lecture",
  scenario: "A university lecturer explains how scientists monitor active volcanoes and forecast eruptions; listen for instruments, warning signs, figures and place examples.",
  source: "IELTS Academic Listening · Cambridge 19 (2024) standard · original, Jun 2026",
  lines: [
    { speaker: "Lecturer", text: "Good morning, everyone. Today we're going to look at how scientists keep watch over active volcanoes, and how, increasingly, they can warn the public before an eruption actually happens." },
    { speaker: "Lecturer", text: "Now, the first thing to understand is that a volcano almost never erupts without warning. In the weeks, days, or sometimes just hours beforehand, it produces a whole range of signals, and the job of the monitoring team is to detect and interpret those signals correctly." },
    { speaker: "Lecturer", text: "Let me start with the single most important warning sign, which is earthquakes. As molten rock, or magma, forces its way upward, it cracks the surrounding rock, and this generates thousands of very small tremors. To measure them, scientists rely on an instrument called a seismometer." },
    { speaker: "Lecturer", text: "A seismometer is extremely sensitive, picking up vibrations that no human could ever feel. Around a well-studied volcano you might find a network of twenty or thirty of these devices, all feeding data back to a central observatory in real time." },
    { speaker: "Lecturer", text: "What the team is really looking for is a change in the pattern. A sudden swarm of tiny earthquakes, all at a similar depth, often means that magma is on the move and the situation is becoming dangerous." },
    { speaker: "Lecturer", text: "The second key sign is that the ground itself begins to swell. As magma collects in a chamber beneath the surface, the whole flank of the volcano can bulge outward, sometimes by just a few centimetres, and we call this deformation." },
    { speaker: "Lecturer", text: "Measuring such tiny movements used to be very difficult, but today the standard tool is satellite positioning. A small receiver bolted to the rock can record its own position to within a millimetre, so even the slightest swelling shows up clearly in the data." },
    { speaker: "Lecturer", text: "A classic example of this comes from Mount St Helens in the United States. Before its famous eruption in 1980, the northern side of the mountain bulged outward at a rate of about one and a half metres per day, an astonishing figure that told scientists something major was coming." },
    { speaker: "Lecturer", text: "The third warning sign involves the gases that escape from the volcano. Magma contains dissolved gases, and as it rises towards the surface these are released, rather like the bubbles in a bottle of fizzy drink when you remove the cap." },
    { speaker: "Lecturer", text: "The gas that scientists watch most closely is sulphur dioxide. A sharp rise in the amount being given off is a strong indication that fresh magma has reached a shallow level, and instruments can now measure this from a safe distance, or even from an aircraft flying overhead." },
    { speaker: "Lecturer", text: "There's a fourth sign too, and that's a change in temperature. The arrival of new magma heats the rock and any water inside the volcano, so the team also keeps an eye on the temperature of hot springs and small lakes in the crater." },
    { speaker: "Lecturer", text: "Increasingly, this heat is detected from space. Satellites carrying thermal cameras can spot a warm patch on a volcano long before anything is visible to the eye, which is enormously useful for the many volcanoes that are remote or difficult to reach on foot." },
    { speaker: "Lecturer", text: "So how good are these forecasts in practice? Well, I should be honest with you: predicting the exact day of an eruption remains extremely hard. What scientists are much better at is judging whether the level of unrest is rising or falling." },
    { speaker: "Lecturer", text: "To communicate this to the public, most observatories use a colour-coded alert system, running from green, meaning normal, up through yellow and orange to red, which signals that an eruption is underway or expected imminently." },
    { speaker: "Lecturer", text: "And the results can be remarkable. Perhaps the best success story is Mount Pinatubo in the Philippines in 1991. The eruption was one of the largest of the twentieth century, yet because the warnings were heeded and people were evacuated in time, tens of thousands of lives were saved." },
    { speaker: "Lecturer", text: "It's worth noting, though, that we simply cannot watch every volcano this closely. There are roughly fifteen hundred volcanoes around the world that are considered potentially active, and only a small fraction of them have any monitoring equipment at all." },
    { speaker: "Lecturer", text: "In fact, the latest surveys suggest that fewer than half of these potentially active volcanoes are monitored to even a basic standard, and the proportion is far lower in the world's poorer regions, where the risk to local people is often greatest." },
    { speaker: "Lecturer", text: "Looking to the future, one of the most promising developments is the use of artificial intelligence. Computers can now sift through the vast streams of seismic data far faster than any human analyst, flagging unusual patterns that a person might easily miss." },
    { speaker: "Lecturer", text: "But I want to leave you with one important caution. No matter how sophisticated our instruments become, every volcano behaves slightly differently, and there will always be a degree of uncertainty. The aim is not perfect prediction, but giving communities enough time to get out of harm's way." }
  ],
  questions: [
    { type: "gap", q: "The instrument used to measure the small earthquakes caused by rising magma is called a ____.", answer: ["seismometer"], explanation: "The lecturer says tremors are measured with an instrument called a seismometer." },
    { type: "gap", q: "When the flank of a volcano swells as magma collects beneath it, this process is known as ____.", answer: ["deformation"], explanation: "Ground swelling as magma collects is called deformation." },
    { type: "gap", q: "To measure tiny ground movements, the standard modern tool is a receiver that uses ____ positioning.", answer: ["satellite"], explanation: "The standard tool is satellite positioning, recording position to within a millimetre." },
    { type: "gap", q: "Before the 1980 eruption of Mount St Helens, the northern side bulged at about ____ metres per day.", answer: ["1.5", "one and a half", "one point five"], explanation: "The lecturer states the bulge grew at about one and a half metres per day." },
    { type: "gap", q: "The gas that scientists watch most closely as a sign of rising magma is ____.", answer: ["sulphur dioxide", "sulfur dioxide"], explanation: "The gas watched most closely is sulphur dioxide." },
    { type: "gap", q: "Heat from new magma can now be detected from space by satellites carrying ____ cameras.", answer: ["thermal"], explanation: "Satellites carrying thermal cameras can spot a warm patch on a volcano." },
    { type: "mc", q: "When monitoring earthquakes, what change does the team consider most significant?", options: ["A single very strong tremor", "A sudden swarm of tiny earthquakes at a similar depth", "Tremors that gradually become weaker over time", "Earthquakes felt by people living nearby"], answer: 1, explanation: "The team looks for a sudden swarm of tiny earthquakes all at a similar depth, meaning magma is moving." },
    { type: "mc", q: "According to the lecturer, what are scientists currently best able to do?", options: ["Predict the exact day an eruption will occur", "Judge whether the level of unrest is rising or falling", "Determine how large an eruption will eventually be", "Stop an eruption once it has begun"], answer: 1, explanation: "He says predicting the exact day is hard, but scientists are much better at judging whether unrest is rising or falling." },
    { type: "tfng", q: "Most of the world's potentially active volcanoes are monitored to at least a basic standard.", answer: "FALSE", explanation: "The lecturer says fewer than half of potentially active volcanoes are monitored even to a basic standard." },
    { type: "tfng", q: "Artificial intelligence has already replaced human analysts at most volcano observatories.", answer: "NOT GIVEN", explanation: "He says AI can sift data faster than humans and flag patterns, but never states it has replaced analysts at most observatories." }
  ],
},
{
  id: "lx05",
  title: "Joining Riverbank Community Sports Centre",
  section: "Section 1 · Everyday conversation",
  scenario: "A man visits the Riverbank Community Sports Centre to sign up as a new member; listen for membership types and fees, class times, his registration number, opening hours and the steps to join.",
  source: "IELTS Academic Listening · Cambridge 19 (2024) standard · original, Jun 2026",
  lines: [
    { speaker: "Receptionist", text: "Good morning, welcome to Riverbank Community Sports Centre. How can I help you today?" },
    { speaker: "Daniel", text: "Hi, good morning. I've just moved into the area and I'd like to become a member, if that's possible." },
    { speaker: "Receptionist", text: "Of course, we'd be happy to sign you up. Have you been to the centre before, or is this your first visit?" },
    { speaker: "Daniel", text: "It's my first time. A neighbour recommended it, actually. She said the swimming pool here is excellent." },
    { speaker: "Receptionist", text: "That's lovely to hear. Let me start by taking a few details. Could I have your full name, please?" },
    { speaker: "Daniel", text: "Yes, it's Daniel Whitlock." },
    { speaker: "Receptionist", text: "And how do you spell the surname?" },
    { speaker: "Daniel", text: "It's W-H-I-T-L-O-C-K. Whitlock." },
    { speaker: "Receptionist", text: "Thank you. Now, we offer three types of membership. The Standard membership gives you access to the gym and the pool, and that's forty pounds a month." },
    { speaker: "Daniel", text: "Right, and what do the other two include?" },
    { speaker: "Receptionist", text: "The Premium membership adds all of our fitness classes, plus use of the sauna, and that's fifty-five a month. And we also have a Student membership, which is just twenty-eight pounds, but you'd need to show a valid student card." },
    { speaker: "Daniel", text: "I finished my studies last year, so I won't qualify for the student rate, unfortunately. I think the Premium one sounds right for me, because I'd really like to do the classes." },
    { speaker: "Receptionist", text: "Good choice. The Premium membership is very popular. Were there any particular classes you were interested in?" },
    { speaker: "Daniel", text: "Yes, I used to play badminton, and someone mentioned you run a yoga class as well?" },
    { speaker: "Receptionist", text: "We do. The yoga class runs on Tuesday and Thursday evenings, starting at half past six. It's a great way to unwind after work." },
    { speaker: "Daniel", text: "That timing works perfectly for me. What about the badminton?" },
    { speaker: "Receptionist", text: "Badminton is on Wednesday mornings, but I should mention it's already fully booked until the end of August, so you'd need to put your name on a waiting list." },
    { speaker: "Daniel", text: "Oh, that's a shame. I'll go on the list anyway. So just to check the opening hours, what time do you open?" },
    { speaker: "Receptionist", text: "On weekdays we're open from six in the morning until ten at night. At weekends it's a bit shorter, eight until eight." },
    { speaker: "Daniel", text: "That's plenty of flexibility. I tend to train early, so the six o'clock start is ideal." },
    { speaker: "Receptionist", text: "Lovely. Now, let me set up your account. Your membership has been registered, and your personal registration number is 4-0-7-2-6." },
    { speaker: "Daniel", text: "Sorry, could you repeat that? Four, oh, seven...?" },
    { speaker: "Receptionist", text: "Four, oh, seven, two, six. You'll need that number whenever you book a class online, and it's also the code for your locker in the changing rooms." },
    { speaker: "Daniel", text: "Got it, forty thousand seven hundred and twenty-six. I'll write it down. So what happens next, in terms of actually joining?" },
    { speaker: "Receptionist", text: "There are just three steps. First, complete the registration form, which I'll hand you in a moment. Second, we take a quick photograph for your membership card. And finally, you make the first monthly payment at the desk, and then you're all set to start." },
    { speaker: "Daniel", text: "And can I begin using the facilities straight away today?" },
    { speaker: "Receptionist", text: "Absolutely. Once the photo's taken and the payment's made, your card is printed within five minutes, and you're free to use everything immediately." },
    { speaker: "Daniel", text: "That's wonderful. Thank you so much for your help." }
  ],
  questions: [
    {
      type: "gap",
      q: "The Standard membership costs ____ pounds a month.",
      answer: ["40", "forty"],
      explanation: "The receptionist says the Standard membership is 'forty pounds a month'."
    },
    {
      type: "gap",
      q: "The Premium membership, which includes the fitness classes and the sauna, costs ____ a month.",
      answer: ["55", "fifty-five", "fifty five"],
      explanation: "The receptionist states the Premium membership is 'fifty-five a month'."
    },
    {
      type: "gap",
      q: "The member's surname is spelled ____.",
      answer: ["Whitlock", "WHITLOCK"],
      explanation: "Daniel spells it 'W-H-I-T-L-O-C-K. Whitlock.'"
    },
    {
      type: "gap",
      q: "The yoga class begins at ____ on Tuesday and Thursday evenings.",
      answer: ["6.30", "6:30", "half past six", "6.30pm", "6:30pm", "18:30"],
      explanation: "The receptionist says the yoga class starts 'at half past six' on Tuesday and Thursday evenings."
    },
    {
      type: "gap",
      q: "The member's personal registration number is ____.",
      answer: ["40726", "4 0 7 2 6", "forty thousand seven hundred and twenty-six"],
      explanation: "The receptionist gives the number as 'four, oh, seven, two, six' (40726)."
    },
    {
      type: "gap",
      q: "On weekdays the centre is open from six in the morning until ____ at night.",
      answer: ["10", "ten", "10pm", "10.00", "22:00"],
      explanation: "The receptionist says weekday hours run 'from six in the morning until ten at night'."
    },
    {
      type: "mc",
      q: "Why does Daniel decide not to take the Student membership?",
      options: [
        "It does not include access to the pool.",
        "He finished his studies last year and has no student card.",
        "It is more expensive than the Premium membership.",
        "The classes he wants are not available with it."
      ],
      answer: 1,
      explanation: "Daniel says, 'I finished my studies last year, so I won't qualify for the student rate', and the student rate requires a valid student card."
    },
    {
      type: "mc",
      q: "What is the situation with the badminton class?",
      options: [
        "It runs on Wednesday evenings.",
        "It is only open to Premium members.",
        "It is fully booked, so Daniel joins a waiting list.",
        "It has been cancelled for the summer."
      ],
      answer: 2,
      explanation: "The receptionist says badminton is 'fully booked until the end of August', and Daniel agrees to go 'on the list'."
    },
    {
      type: "tfng",
      q: "Daniel can start using the centre's facilities on the same day that he registers.",
      answer: "TRUE",
      explanation: "The receptionist confirms that once the photo and payment are done, 'you're free to use everything immediately'."
    },
    {
      type: "tfng",
      q: "Daniel was given a guided tour of the swimming pool during his visit.",
      answer: "NOT GIVEN",
      explanation: "The pool is mentioned by his neighbour and in the membership description, but nothing in the conversation says he was given a tour of it."
    },
  ]
},
{
  id: "lx06",
  title: "The Past and Future of Electric Vehicles",
  section: "Section 4 · Academic lecture",
  scenario: "A university lecturer traces the history and future of electric vehicles; listen for dates, percentages, technical challenges, and predictions.",
  source: "IELTS Academic Listening · Cambridge 19 (2024) standard · original, Jun 2026",
  lines: [
    { speaker: "Lecturer", text: "Good morning, everyone. Today I want to take you on a journey through the surprisingly long history of the electric vehicle, or EV, and then look ahead to where the technology might be heading over the next few decades." },
    { speaker: "Lecturer", text: "Now, most people assume the electric car is a modern invention, but the first practical examples actually appeared in the eighteen-thirties. By the year nineteen hundred, electric cars were genuinely popular, and remarkably, they made up around thirty-eight per cent of all vehicles sold in the United States at that time." },
    { speaker: "Lecturer", text: "Why were they so attractive? Well, unlike the petrol cars of the day, they were quiet, they produced no smoke, and crucially, they did not need to be started with a hand crank, which was difficult and even dangerous." },
    { speaker: "Lecturer", text: "So what went wrong? The decline came rather suddenly. The key factor was the discovery of large reserves of cheap oil, which made petrol affordable for ordinary drivers for the first time." },
    { speaker: "Lecturer", text: "On top of that, the introduction of the electric starter motor in nineteen twelve removed the main inconvenience of petrol engines, and the mass production techniques pioneered by Henry Ford brought the price of petrol cars right down. By the nineteen-thirties, the electric car had all but disappeared from the market." },
    { speaker: "Lecturer", text: "For roughly half a century, very little happened. Interest only revived in the nineteen-nineties, partly because of growing concern about air pollution in major cities, and partly because of new regulations in California that pushed manufacturers to develop cleaner vehicles." },
    { speaker: "Lecturer", text: "The real turning point, though, came with a single technical advance: the lithium-ion battery. This type of battery, which had originally been developed for laptops and mobile phones, could store far more energy in a much lighter package than the older lead-acid designs." },
    { speaker: "Lecturer", text: "And that brings me to the central challenge that has shaped the entire industry, namely range. Range simply means the distance a vehicle can travel on a single charge, and for years this was the biggest barrier to wider adoption." },
    { speaker: "Lecturer", text: "Early modern electric cars could manage only about a hundred kilometres before needing to recharge, which made drivers extremely anxious about being stranded. Today, by contrast, a typical new model offers a range of roughly four hundred kilometres, and that figure continues to climb." },
    { speaker: "Lecturer", text: "The second great challenge is charging. Even with a good range, an EV is only useful if it can be refuelled conveniently, and this involves two separate problems: the time it takes to charge, and the availability of charging points." },
    { speaker: "Lecturer", text: "On the question of time, the latest fast chargers can now restore enough power for several hundred kilometres in around twenty minutes, which is a dramatic improvement, although still slower than filling a fuel tank." },
    { speaker: "Lecturer", text: "On availability, the picture varies enormously between countries. Some nations have invested heavily in public infrastructure, while others lag far behind, and this remains one of the strongest predictors of how quickly people in a given region switch to electric." },
    { speaker: "Lecturer", text: "There is also a third issue that receives less attention but matters greatly: the cost and supply of the raw materials. Batteries rely on metals such as lithium and cobalt, and securing a stable, ethical supply of these is a serious concern for manufacturers." },
    { speaker: "Lecturer", text: "Now, the good news is that battery costs have fallen astonishingly quickly. Over the past decade, the price of a battery pack has dropped by almost ninety per cent, and this single trend explains much of the recent surge in sales." },
    { speaker: "Lecturer", text: "Let me put some current figures on the table. In twenty twenty-three, fully electric vehicles accounted for approximately eighteen per cent of new car sales worldwide, a share that would have seemed unimaginable just ten years earlier." },
    { speaker: "Lecturer", text: "So where is all this heading? Many analysts now predict that electric vehicles will reach price parity with petrol cars, meaning they will cost the same to buy, at some point before the year twenty thirty." },
    { speaker: "Lecturer", text: "Beyond that, a number of governments have announced that they will ban the sale of new petrol and diesel cars entirely, with several major economies setting twenty thirty-five as their target date." },
    { speaker: "Lecturer", text: "Looking further ahead, the most exciting prospect is the so-called solid-state battery. This emerging technology promises to be safer, to charge even faster, and to offer a substantially greater range, perhaps doubling what is possible today." },
    { speaker: "Lecturer", text: "I should add a note of caution, however. Solid-state batteries are notoriously difficult to manufacture at scale, and although prototypes exist, experts disagree sharply about when they will become commercially available." },
    { speaker: "Lecturer", text: "Finally, it is worth remembering that the environmental benefit of an EV depends heavily on how the electricity is generated. An electric car charged from a coal-fired grid is far less clean than one charged from renewable sources such as wind or solar." },
    { speaker: "Lecturer", text: "So, to summarise: a technology that was almost forgotten a century ago has returned to the centre of the transport revolution, and the decisions we make in the next few years will determine just how rapidly that transformation unfolds. Right, let us turn to the reading list." }
  ],
  questions: [
    { type: "gap", q: "The first practical electric vehicles appeared in the ____.", answer: ["1830s", "eighteen-thirties", "1830's"], explanation: "Line 2: 'the first practical examples actually appeared in the eighteen-thirties.'" },
    { type: "gap", q: "By 1900, electric cars made up around ____ per cent of all vehicles sold in the United States.", answer: ["38", "thirty-eight"], explanation: "Line 2: 'they made up around thirty-eight per cent of all vehicles sold in the United States.'" },
    { type: "gap", q: "The electric ____ motor, introduced in 1912, removed the main inconvenience of petrol engines.", answer: ["starter"], explanation: "Line 5: 'the introduction of the electric starter motor in nineteen twelve removed the main inconvenience.'" },
    { type: "gap", q: "The type of battery that became the key technical turning point was the ____ battery.", answer: ["lithium-ion", "lithium ion"], explanation: "Line 7: 'a single technical advance: the lithium-ion battery.'" },
    { type: "gap", q: "A typical new electric model today offers a range of roughly ____ kilometres.", answer: ["400", "four hundred"], explanation: "Line 9: 'a typical new model offers a range of roughly four hundred kilometres.'" },
    { type: "gap", q: "In 2023, fully electric vehicles accounted for approximately ____ per cent of new car sales worldwide.", answer: ["18", "eighteen"], explanation: "Line 15: 'fully electric vehicles accounted for approximately eighteen per cent of new car sales worldwide.'" },
    { type: "mc", q: "According to the lecturer, why did the electric car decline in the early twentieth century?", options: ["Electric cars were too quiet for drivers to feel safe", "Cheap oil and mass production made petrol cars affordable", "Governments banned electric vehicles in the 1930s", "Lead-acid batteries were banned for safety reasons"], answer: 1, explanation: "Lines 4-5: cheap oil made petrol affordable and Ford's mass production 'brought the price of petrol cars right down.'" },
    { type: "mc", q: "What does the lecturer identify as the single trend that best explains the recent surge in EV sales?", options: ["The banning of petrol cars by governments", "The rise of solid-state batteries", "An almost 90 per cent fall in battery pack prices", "Increased anxiety about being stranded"], answer: 2, explanation: "Line 14: 'the price of a battery pack has dropped by almost ninety per cent, and this single trend explains much of the recent surge in sales.'" },
    { type: "tfng", q: "Several major economies have set 2035 as the target date for banning the sale of new petrol and diesel cars.", answer: "TRUE", explanation: "Line 17: governments will ban new petrol and diesel cars 'with several major economies setting twenty thirty-five as their target date.'" },
    { type: "tfng", q: "Experts agree that solid-state batteries will be commercially available before 2030.", answer: "NOT GIVEN", explanation: "Line 19: experts 'disagree sharply about when they will become commercially available'; no specific year of agreement is stated." }
  ],
}
);
