/* listening_b2.js */
window.IELTS_DATA.listening.push(
  {
    id:"l003",
    title:"Renting a Studio Flat",
    section:"Section 1 · Conversation",
    scenario:"A student phones a letting agent about a rental flat and books a viewing. Listen for prices, dates, address spelling and the deposit.",
    lines:[
      { speaker:"Agent", text:"Good morning, Hartley Lettings, this is Daniel speaking. How can I help you?" },
      { speaker:"Caller", text:"Hi, I'm calling about the studio flat you've advertised on Maple Road. Is it still available?" },
      { speaker:"Agent", text:"Yes, it is. It's a one-person studio, fully furnished, on the second floor. The rent is two hundred and forty pounds per week." },
      { speaker:"Caller", text:"Two hundred and forty. And does that include any of the bills?" },
      { speaker:"Agent", text:"Water and broadband are included, but you'd pay for electricity separately. There's also a deposit of six hundred pounds, which you get back at the end." },
      { speaker:"Caller", text:"Okay. Can I ask when it becomes available? I'm hoping to move in early next month." },
      { speaker:"Agent", text:"The current tenant leaves on the fourteenth of July, so the earliest you could move in is the fifteenth." },
      { speaker:"Caller", text:"That works well for me. Is there parking? I have a small car." },
      { speaker:"Agent", text:"I'm afraid there's no private parking, but there's free street parking after six in the evening and all day at weekends." },
      { speaker:"Caller", text:"That's fine. And how far is it from the train station?" },
      { speaker:"Agent", text:"It's about a twelve-minute walk. There's also a bus, the number 36, that stops right outside the building." },
      { speaker:"Caller", text:"Great. Could I arrange a viewing? Would Saturday be possible?" },
      { speaker:"Agent", text:"Saturday's fully booked, I'm afraid. I could do Thursday at four, or Friday morning at ten." },
      { speaker:"Caller", text:"Let's say Friday at ten. Oh, and could I take your name again for the booking?" },
      { speaker:"Agent", text:"Of course. It's Daniel Foster, that's F-O-S-T-E-R. And could I have your name, please?" },
      { speaker:"Caller", text:"It's Priya Nair, N-A-I-R. Thank you so much, see you Friday." }
    ],
    questions:[
      { type:"gap", q:"The weekly rent for the studio is ____ pounds.", answer:["240","two hundred and forty"], explanation: "The agent states 'The rent is two hundred and forty pounds per week'." },
      { type:"mc", q:"Which bill does the tenant pay separately?", options:["Water","Broadband","Electricity","Gas"], answer:2, explanation: "The agent explicitly states water and broadband are included, but electricity must be paid separately, hence C (index 2)." },
      { type:"gap", q:"The deposit is ____ pounds and is refundable at the end.", answer:["600","six hundred"], explanation: "The agent mentions 'a deposit of six hundred pounds, which you get back at the end'." },
      { type:"tfng", q:"The flat has its own private parking space.", answer:"FALSE", explanation: "The agent says 'there's no private parking', only free street parking, therefore FALSE." },
      { type:"gap", q:"The flat is about a ____ -minute walk from the train station.", answer:["12","twelve"], explanation: "The agent says 'about a twelve-minute walk'." },
      { type:"mc", q:"When did the caller agree to view the flat?", options:["Thursday at four","Friday at ten","Saturday morning","Friday at four"], answer:1, explanation: "Saturday is fully booked, and the caller says 'Let's say Friday at ten', hence B (index 1)." }
    ]
  },
  {
    id:"l004",
    title:"Welcome to Riverside Science Museum",
    section:"Section 2 · Monologue",
    scenario:"A museum guide briefs visitors on the layout, opening times and rules. Listen for floors, times and regulations.",
    lines:[
      { speaker:"Guide", text:"Good afternoon everyone, and welcome to the Riverside Science Museum. My name is Olivia, and I'll give you a quick overview before you explore on your own." },
      { speaker:"Guide", text:"Let me start with the layout. The museum has three floors. The ground floor is all about space and astronomy, including our popular planetarium." },
      { speaker:"Guide", text:"On the first floor you'll find the human body gallery, and the second floor is dedicated to robotics and computing, which is especially popular with younger visitors." },
      { speaker:"Guide", text:"The planetarium shows run every hour on the hour, with the last show at four o'clock. Seats are limited, so I'd recommend collecting a free ticket from the desk as soon as you can." },
      { speaker:"Guide", text:"If you get hungry, the café is on the ground floor next to the gift shop, and it serves hot meals until three, and snacks until closing." },
      { speaker:"Guide", text:"A quick reminder about photography: you're very welcome to take photos, but please switch off your flash, as it can damage some of the older exhibits." },
      { speaker:"Guide", text:"For families, we have a treasure-hunt activity sheet, completely free, which you can pick up at the information desk. It usually takes children about an hour to complete." },
      { speaker:"Guide", text:"The museum closes at five-thirty, but please note the last entry to the galleries is at five, so do leave yourself enough time." },
      { speaker:"Guide", text:"Finally, the cloakroom is just behind me on your left, where you can leave coats and large bags free of charge. Lockers are available for one pound, which is refunded." },
      { speaker:"Guide", text:"That's everything from me. Enjoy your visit, and don't hesitate to ask any of our staff in the green shirts if you need help." }
    ],
    questions:[
      { type:"mc", q:"Which subject is featured on the ground floor?", options:["The human body","Space and astronomy","Robotics and computing","Local history"], answer:1, explanation: "The guide states the ground floor is entirely space and astronomy, including a planetarium, hence B (index 1)." },
      { type:"gap", q:"The robotics and computing gallery is on the ____ floor.", answer:["second"], explanation: "The guide says 'the second floor is dedicated to robotics and computing'." },
      { type:"gap", q:"The last planetarium show starts at ____ o'clock.", answer:["four","4"], explanation: "The guide says 'with the last show at four o'clock'." },
      { type:"tfng", q:"Visitors are allowed to use flash photography inside the museum.", answer:"FALSE", explanation: "The guide says photos are allowed but 'please switch off your flash', so flash photography is not permitted, making it FALSE." },
      { type:"mc", q:"What is the last entry time to the galleries?", options:["Three o'clock","Four o'clock","Five o'clock","Five-thirty"], answer:2, explanation: "The museum closes at 5:30, but 'the last entry to the galleries is at five', so C is chosen (index 2)." },
      { type:"gap", q:"Using a locker costs ____ pound, which is refunded.", answer:["one","1"], explanation: "The guide says 'Lockers are available for one pound, which is refunded'; the cloakroom is free, but lockers cost one pound." }
    ]
  },
  {
    id:"l005",
    title:"The Migration of Monarch Butterflies",
    section:"Section 4 · Academic lecture",
    scenario:"A biology lecture on the long-distance migration of North American monarch butterflies and how they navigate. Listen for numbers, places and explanations.",
    lines:[
      { speaker:"Lecturer", text:"Good morning. Today we're going to look at one of the most remarkable journeys in the natural world: the annual migration of the monarch butterfly." },
      { speaker:"Lecturer", text:"Each autumn, millions of monarchs leave the eastern United States and Canada and travel south to central Mexico, where they spend the winter in cool mountain forests." },
      { speaker:"Lecturer", text:"The distance involved is extraordinary. Some individuals fly as far as four thousand kilometres, and they do this in a single lifetime." },
      { speaker:"Lecturer", text:"What makes this even more surprising is that no single butterfly completes the round trip. It actually takes several generations to return north in the spring." },
      { speaker:"Lecturer", text:"So how do they find their way? Researchers believe monarchs use the position of the sun as a kind of compass, adjusting for the time of day using an internal clock." },
      { speaker:"Lecturer", text:"There's also strong evidence that they can detect the Earth's magnetic field, which helps them stay on course on cloudy days when the sun isn't visible." },
      { speaker:"Lecturer", text:"Now, the migration faces a number of threats. The most serious is the loss of milkweed, the only plant on which monarchs will lay their eggs." },
      { speaker:"Lecturer", text:"As farmland has expanded and herbicides have become more common, milkweed has declined sharply, and so has the monarch population." },
      { speaker:"Lecturer", text:"Climate change is a further concern. Unusually warm temperatures can disrupt the timing of the migration, causing butterflies to set off too early or too late." },
      { speaker:"Lecturer", text:"In response, conservation groups are encouraging people to plant milkweed in gardens, creating a network of safe stopping points along the migration route." }
    ],
    questions:[
      { type:"mc", q:"Where do the monarch butterflies spend the winter?", options:["Eastern Canada","Central Mexico","The western United States","Northern forests"], answer:1, explanation: "The lecturer says they fly south to the mountain forests of central Mexico for winter, so B is chosen (index 1)." },
      { type:"gap", q:"Some monarchs fly as far as ____ kilometres.", answer:["4000","four thousand"], explanation: "The lecturer says 'Some individuals fly as far as four thousand kilometres'." },
      { type:"tfng", q:"A single butterfly completes the whole round trip on its own.", answer:"FALSE", explanation: "The lecturer says 'no single butterfly completes the round trip', as several generations are needed to return north, making it FALSE." },
      { type:"mc", q:"According to the lecture, what helps monarchs navigate on cloudy days?", options:["The position of the sun","Wind direction","The Earth's magnetic field","Landmarks on the ground"], answer:2, explanation: "The lecturer says there's evidence they can sense the Earth's magnetic field, helping navigation on cloudy days when the sun isn't visible, so C is chosen (index 2)." },
      { type:"gap", q:"Monarchs will only lay their eggs on a plant called ____.", answer:["milkweed"], explanation: "The lecturer says milkweed is 'the only plant on which monarchs will lay their eggs'." },
      { type:"tfng", q:"Warm temperatures can affect the timing of the migration.", answer:"TRUE", explanation: "The lecturer says 'Unusually warm temperatures can disrupt the timing of the migration', making it TRUE." }
    ]
  }
);
