/* PROJECT KERBEROS — Round 3 Future Card data */

const TEAMS = [
  "Quantum","RocksHack","HexTech","Anomalists","AxisLi","Error:404","Wayne Family",
  "STELLAR","CyberNova","Vetri kazagam","Byte Circuit","Cyber Trixs","Cypher","HackEra",
  "c0mrad3$.exe","Team Ascenders","TechTonic","Hello World","TOXIC","Trust me Bro",
  "Code Crafters","Naanga Naalu Peru","Quantum Coders","SAY MY NAME!!","SYNORA",
  "Electronexes","Neonix","Techgiants","Nakshathra Payaluga","CodeX","TRIVEX",
  "Mechzords","Claude-Coders","Ravana Evaders","Cyber Forge"
];

const DOMAINS = [
  {
    id: "d1",
    num: "01",
    name: "DIGITAL FRONTIER",
    tag: "SOFTWARE · AI · CLOUD · CYBERSECURITY",
    open: "CSE · AIE · AI&DS · CYS",
    format: "Software MVP",
    blurb: "Three questions, escalating: can you trust the transaction — can you trust the person — can you trust the information itself?"
  },
  {
    id: "d2",
    num: "02",
    name: "INTELLIGENT INFRASTRUCTURE",
    tag: "IOT · EMBEDDED · ELECTRONICS · SMART DEVICES",
    open: "ECE · CCE",
    format: "Hardware build or full simulation",
    blurb: "One credential, one device, one grid — each PS asks who, or what, you can still trust when the thing itself starts lying."
  },
  {
    id: "d3",
    num: "03",
    name: "AUTONOMOUS SYSTEMS",
    tag: "ROBOTICS · DRONES · AUTOMATION · INDUSTRY 5.0",
    open: "RAI · MEE",
    format: "Hardware build or full simulation",
    blurb: "One machine, one vehicle, one swarm — what happens when machines can no longer trust their orders, their senses, or each other?"
  }
];

const PROBLEMS = [
  {
    id: "PS01", domain: "d1",
    title: "Payment 4.0: The Authentication Problem",
    scenario: "Every digital payment today comes down to the same handful of checks — a PIN, an OTP, a QR code, a fingerprint. And every one of them can be beaten: a QR code swapped mid-scan, a fingerprint spoofed, a transaction quietly altered after you've already said yes. Somewhere between \"authenticated\" and \"authorized,\" the system is trusting something it shouldn't.",
    mvp: "A working digital payment flow — pick a recipient, enter an amount, authenticate, complete the transaction.",
    secure: "Redesign the authentication step so it doesn't lean on a PIN, a static QR, or a single biometric alone. Verify person + device + transaction + context together — not just \"person = authenticated.\" It has to survive QR manipulation, biometric bypass, a stolen device, and a replayed transaction.",
    quote: "What should payment authentication look like once PINs, OTPs, static QR codes, and standalone biometrics can no longer be fully trusted?",
    cards: [
      { code: "FC-01-A", name: "BLACKOUT",
        twist: "The device goes fully offline mid-payment — no network, no server reachable, no live check against anything.",
        demand: "Authentication must still complete locally and stay replay-proof when connectivity returns. An offline approval cannot be captured and re-submitted once the link is back." },
      { code: "FC-01-B", name: "THE SECOND SIGNATURE",
        twist: "The payment now requires two people to authorize it — joint account, corporate spend, guardian approval — and they are not in the same place.",
        demand: "Neither party can be assumed to hold an uncompromised channel, and one of the two approvals may be forged. Bind both authorizations to the same transaction and detect the forged half." },
      { code: "FC-01-C", name: "INHERITANCE",
        twist: "The user's enrolled device is dead and gone. They must authorize a transaction from a brand-new device with zero prior enrollment on it.",
        demand: "Do it in under 60 seconds, without falling back to an OTP or a single biometric, and without opening the same door for an attacker holding a new device." }
    ]
  },
  {
    id: "PS02", domain: "d1",
    title: "The Impostor: When Your Digital Life Is No Longer Yours",
    scenario: "One morning, your phone doesn't recognize you. Your fingerprint fails. Your password is rejected. Your bank says \"identity verification failed.\" Somewhere, your email has a new recovery number, and your social profile — your face, your name — is being run by someone else. Nothing was \"hacked\" in the usual sense. Someone simply became more believable as you than you are.",
    mvp: "A digital identity platform where a user can register, create an identity, log in, verify themselves, and access one protected service.",
    secure: "Design identity recovery that doesn't lean on one single point of trust. \"Send another OTP\" fails if the phone's compromised. \"Check the fingerprint\" fails if the biometric's leaked. \"Verify by email\" fails if the email's compromised too. Build in independent trust anchors, so losing one credential doesn't mean losing the whole identity.",
    quote: "How do you build an identity that stays trustworthy even after some of its credentials have already been compromised?",
    cards: [
      { code: "FC-02-A", name: "THE BETTER YOU",
        twist: "An impostor arrives at your recovery flow holding more valid evidence than the real user does.",
        demand: "More correct answers, more working credentials, a cleaner history. Your recovery must still resolve to the real person — quantity of evidence can no longer be the deciding factor." },
      { code: "FC-02-B", name: "DEAD MAN'S SWITCH",
        twist: "The user is unreachable or incapacitated. A pre-declared delegate now needs access to act on their behalf.",
        demand: "Grant scoped, auditable access without ever letting the delegate become the user — and prove the incapacitation claim itself isn't the attack." },
      { code: "FC-02-C", name: "THE PURGE",
        twist: "One of your trust anchors is confirmed compromised at runtime, live, during the demo.",
        demand: "Revoke it and re-derive a trustworthy identity from the anchors that remain — no full re-registration, no loss of account continuity, and no residual authority left with the dead anchor." }
    ]
  },
  {
    id: "PS03", domain: "d1",
    title: "The Last Original: Can You Trust Digital Reality?",
    scenario: "You receive a video, a report, a voice recording, a photograph. It looks completely genuine. But it might be AI-generated. It might be 15% modified from the original. It might have passed through five different hands before reaching you, with the metadata carefully preserved to look untouched. The file looks fine. That's exactly the problem.",
    mvp: "A content verification platform where a user can create, upload, modify, transfer, and verify a digital file — with the platform keeping a history of that object.",
    secure: "Skip the plain \"deepfake detector\" — that's the generic version of this. Build a way to establish and prove a file's chain of custody, even when all you're ever handed is the latest version. Think integrity verification, metadata validation, steganalysis, hashing/signatures, provenance tracking.",
    quote: "When a digital file looks completely normal, how do you prove that what you're seeing is actually what was created — and nothing else?",
    cards: [
      { code: "FC-03-A", name: "THE FORGED LEDGER",
        twist: "Your own provenance records have been tampered with. The history you were going to trust is now itself suspect.",
        demand: "Prove the file's real lineage when your record of that lineage can no longer be taken at face value — and show how the tampering is detected, not just assumed away." },
      { code: "FC-03-B", name: "LEGITIMATE EDIT",
        twist: "A journalist must crop, redact and compress the file before publication. The output no longer matches the original bit for bit — and it shouldn't.",
        demand: "Distinguish authorized transformation from malicious modification. The edited file must still verify as descended from the original, while a 15% content forgery must not." },
      { code: "FC-03-C", name: "AIR GAP",
        twist: "Verification must run on a file handed over offline — a USB stick, no server, no chain lookup, no network at all.",
        demand: "Everything needed to establish authenticity must travel with the file itself, and must not be forgeable by whoever is carrying it." }
    ]
  },
  {
    id: "PS04", domain: "d2",
    title: "The Ghost Key",
    scenario: "A company runs its whole campus — offices, labs, parking, server rooms — on RFID/NFC access cards. A new employee's card works perfectly. Then security notices something impossible: the same credential entered two locations too far apart to reach in the time between scans. The card wasn't stolen. It was copied, replayed, or relayed.",
    mvp: "A simulated RFID/NFC access-control system — registration, credential issuance, authentication, door/zone control, access logs.",
    secure: "Defend against a cloned card, a replayed authentication, a relayed signal (the real card is elsewhere, but the reader's fooled into thinking it's close), and a physically stolen card. Possession alone shouldn't be enough — think dynamic authentication, time/location context, challenge-response.",
    quote: "Is possession of a credential enough to prove the person holding it is who they claim to be?",
    cards: [
      { code: "FC-04-A", name: "THE INSIDER",
        twist: "The credential is genuine and so is the person holding it — but they are behaving nothing like themselves.",
        demand: "Wrong hours, wrong zones, wrong sequence, wrong pace. Gate access on behavioural context without locking out a legitimate employee who simply had an unusual day." },
      { code: "FC-04-B", name: "FIRE DRILL",
        twist: "Emergency declared. Every door must unlock instantly for evacuation — and the attacker chose exactly this window.",
        demand: "Serve the evacuation without exception, while ensuring the emergency state itself can't be spoofed, extended, or used to walk into the server room." },
      { code: "FC-04-C", name: "READER DOWN",
        twist: "The reader at the door is compromised — or entirely offline. The terminal is now part of the attack surface.",
        demand: "Authenticate a person at that door without trusting the thing standing in front of them, and without leaving the door either permanently open or permanently shut." }
    ]
  },
  {
    id: "PS05", domain: "d2",
    title: "The House That Betrayed You",
    scenario: "2:13 AM. A notification: \"Front door unlocked.\" The camera feed looks normal. The alarm still says \"SYSTEM ARMED.\" But the smart home controller's already compromised — and the attacker didn't need to break every device. They only needed the devices to stop trusting each other correctly. The lock trusts the controller. The controller trusts the sensor. Nobody in the house can agree on what's actually happening.",
    mvp: "A simulated smart home — lock, door/window sensor, motion sensor, camera, alarm, central controller — coordinating a basic flow (door opens → sensor detects → controller verifies → alarm responds).",
    secure: "Introduce a device that lies — a sensor reporting \"closed\" while open, a camera reporting \"no movement\" during motion, a controller issuing an unlock it shouldn't. The system has to decide which device to believe, without ever shutting the whole house down to do it.",
    quote: "When any single device in your home could be lying, how does the system decide what's actually true?",
    cards: [
      { code: "FC-05-A", name: "MAJORITY RULE",
        twist: "It isn't one lying device any more. Half of them are lying, and they corroborate each other perfectly.",
        demand: "Consensus and voting now actively produce the wrong answer. Establish truth from something other than agreement between devices." },
      { code: "FC-05-B", name: "THE OWNER'S VOICE",
        twist: "A perfectly valid, fully authenticated command arrives from the real owner's app at 3 AM — and it contradicts every sensor in the house.",
        demand: "Decide whether to obey or refuse, act on that decision, and be able to justify it. \"The credential was valid\" is not an answer." },
      { code: "FC-05-C", name: "GUEST PROTOCOL",
        twist: "A stranger — cleaner, delivery, repair tech — must be granted temporary physical access while the lying-device attack is still live.",
        demand: "Scope the access to a place and a window, hand over nothing that survives the visit, and ensure the compromised device cannot widen that scope from the inside." }
    ]
  },
  {
    id: "PS06", domain: "d2",
    title: "Gridlock",
    scenario: "6:42 PM. City-wide power demand spikes. The control centre starts auto-shutting distribution zones — but the numbers don't add up. One substation reports 92% load. Another reports 41%. A smart meter cluster says 12%. Hospitals are approaching backup power, and nobody knows which reading is real. The attack was never on the power. It was on the data used to control it.",
    mvp: "A simulated small intelligent grid, end to end: generators, substations, distribution nodes, smart meters, consumers, a grid controller, and the communication network tying it together — with the controller making automated load-balancing calls from that data.",
    secure: "Handle a false demand report, a substation silently misreporting its real state, conflicting readings from multiple sources, and a malicious shutdown command aimed at a healthy zone — without ever defaulting to \"cut power to everyone\" as the safe move.",
    quote: "When the sensors feeding a critical system disagree, which one do you trust — and how fast can you decide?",
    cards: [
      { code: "FC-06-A", name: "CASCADE",
        twist: "A genuine emergency and a fabricated one fire at the same instant, in different zones, with identical signatures.",
        demand: "Serve the real one at full urgency while refusing to act on the fake — and do it inside the window before the real zone browns out." },
      { code: "FC-06-B", name: "THE ORACLE PROBLEM",
        twist: "The reference substation your whole trust model anchors on is the compromised node.",
        demand: "Detect that your own ground truth has turned, re-anchor trust onto something else at runtime, and recover the readings you already accepted from it." },
      { code: "FC-06-C", name: "BROWNOUT BUDGET",
        twist: "Real generation has now fallen below real demand. Somebody is losing power tonight — that part is physics, not attack.",
        demand: "Shed load fairly, safely, and by priority while the demand data itself is being manipulated. \"Cut everyone\" is still forbidden." }
    ]
  },
  {
    id: "PS07", domain: "d3",
    title: "The Last Shift",
    scenario: "Night shift at a highly automated factory. A robot is told by the production system: \"Continue at maximum speed.\" Its own safety system detects a human worker inside the operating zone. At the same moment, the human supervisor overrides: \"Continue — I'll handle it.\" Three authorities. Three different answers. The robot has about a second to decide who it actually listens to.",
    mvp: "A small autonomous industrial system — robot arm, mobile robot, conveyor sim, or digital twin — performing a repeatable task on its own (pick → move → place → inspect).",
    secure: "Build a command hierarchy: who's authorized to give which instructions, which commands can override others, and which safety conditions can never be overridden by anyone — including a legitimate senior operator. Decide when the robot simply stops and asks a human, and when it shouldn't wait.",
    quote: "How should an autonomous machine balance human authority, productivity, and safety when the three genuinely disagree?",
    cards: [
      { code: "FC-07-A", name: "CHAIN OF COMMAND BROKEN",
        twist: "The highest authority in your hierarchy has had its credentials compromised. Every command it sends is cryptographically valid and operationally wrong.",
        demand: "The machine must be able to refuse its own top authority, stay productive while doing so, and hand authority somewhere legitimate." },
      { code: "FC-07-B", name: "THE UNSAFE SAFE-STOP",
        twist: "Stopping is now the dangerous action — mid-weld, mid-lift, mid-pour. \"Halt\" is no longer the safe default.",
        demand: "Redefine the fail-safe state for an operation that cannot simply be frozen, and prove the new one is safe under the same attacks." },
      { code: "FC-07-C", name: "GHOST WORKER",
        twist: "A human is inside the operating zone and your sensors cannot see them — occluded, suppressed, or spoofed away.",
        demand: "Safety must hold without detection. Design the guarantee that survives when the thing that was supposed to notice the human is the thing that failed." }
    ]
  },
  {
    id: "PS08", domain: "d3",
    title: "Ghost Driver",
    scenario: "A self-driving car moves through the city, nobody at the wheel. The camera says the road's clear. The LiDAR says there's an obstacle ahead. The GPS says the car is 30 metres from where it should be. A remote command arrives on a channel nobody expected. The car slows, then suddenly speeds up.",
    mvp: "An autonomous navigation system that can detect, decide, and avoid obstacles — a real RC car with sensors, or fully simulated in CARLA / Gazebo / Webots / Unity / ROS.",
    secure: "Protect two separate things: what the vehicle perceives (a fake obstacle appearing, a real one going undetected, unreliable GPS) and what it obeys (an injected remote command it has to decide whether to trust). Sensor fusion and cross-validation on one side, verified / fail-safe control on the other.",
    quote: "Can an autonomous vehicle stay safe when it can no longer fully trust either its own senses or the commands it's receiving?",
    cards: [
      { code: "FC-08-A", name: "SENSOR AMPUTATION",
        twist: "One entire sensing modality is lost mid-drive — the camera blinds, or the LiDAR dies, permanently.",
        demand: "Keep navigating safely on what remains, with an honest degraded-capability posture. Cross-validation that needed the missing sensor must not simply fail open." },
      { code: "FC-08-B", name: "THE TROLLEY PATCH",
        twist: "An over-the-air update arrives mid-mission, claiming to be an urgent safety-critical fix.",
        demand: "Verify it, adopt it or reject it, live and in motion — and stay safe under both a genuinely critical patch and a malicious one wearing the same label." },
      { code: "FC-08-C", name: "CONVOY",
        twist: "Another vehicle is broadcasting V2V data — its position, its speed, its braking — and all of it is a lie.",
        demand: "Cooperate with surrounding traffic while treating everything it says as unverified. Neither blind trust nor blanket rejection is acceptable." }
    ]
  },
  {
    id: "PS09", domain: "d3",
    title: "Swarm",
    scenario: "A swarm of autonomous drones is mid-mission — searching, mapping, coordinating, no single pilot in control. One drone quietly stops behaving normally. It keeps transmitting \"Area clear.\" The others believe it, because it's still one of them. It sends \"Move to Zone B\" — and three more follow. Nobody hijacked the swarm. They hijacked exactly one member of it, and the rest don't know yet.",
    mvp: "A coordinated swarm of autonomous agents — physical drones/robots/microcontrollers, or simulated in ROS / Gazebo / Webots / AirSim — performing a shared task like searching and dividing an area.",
    secure: "Give the swarm a way to detect abnormal behaviour in one of its own, cross-check information between agents, isolate the compromised one, and keep the mission going — no full stop, no single point of failure.",
    quote: "Can a group of autonomous machines maintain trust in each other when one of their own is actively trying to deceive the rest?",
    cards: [
      { code: "FC-09-A", name: "DEFECTOR RETURNS",
        twist: "The drone you isolated comes back, re-authenticates cleanly, and claims it was a false positive.",
        demand: "Readmit or permanently exile — and be right. Build the re-admission path, its evidence bar, and the cost of getting it wrong in either direction." },
      { code: "FC-09-B", name: "SPLIT BRAIN",
        twist: "Comms partition the swarm into two isolated groups. Each half contains a traitor, and neither can reach the other.",
        demand: "Both halves must keep operating independently and safely, then reconcile conflicting world-states — and conflicting accusations — when the link returns." },
      { code: "FC-09-C", name: "THE FALSE ACCUSER",
        twist: "The compromised drone accuses a perfectly healthy one, using your own detection protocol to do it.",
        demand: "Your detection mechanism is now the attack surface. Stop the swarm from isolating its own healthy members on a malicious signal." }
    ]
  }
];
