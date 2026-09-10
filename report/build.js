const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  PageBreak, convertInchesToTwip
} = require('docx');

const MAROON = '7A1F2B';   // Amrita maroon
const GOLD   = 'B8860B';
const INK    = '1A1A1A';
const GREY   = '555555';
const LINE   = 'C9C9C9';
const BAND   = 'F2EDE6';

const CONTENT_W = 9360; // 6.5" in DXA

const noBorder = { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE},
                   left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} };
const hair = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const gridBorders = { top:hair, bottom:hair, left:hair, right:hair,
                      insideHorizontal:hair, insideVertical:hair };

const t = (text, o={}) => new TextRun({ text, font:'Calibri', size:o.size||20,
  bold:o.bold, italics:o.italics, color:o.color||INK, allCaps:o.caps, characterSpacing:o.ls });

const p = (runs, o={}) => new Paragraph({
  children: Array.isArray(runs)?runs:[runs],
  alignment: o.align, spacing:{ before:o.before||0, after:o.after===undefined?100:o.after, line:o.line||276 },
  border: o.border, indent: o.indent, keepNext: o.keepNext,
});

const body = (text, o={}) => p(t(text,{size:20}), { align: o.align||AlignmentType.JUSTIFIED, after:o.after===undefined?140:o.after });

// section heading with a rule under it
const h = (text) => new Paragraph({
  children:[ t(text,{bold:true,size:24,color:MAROON,caps:true,ls:16}) ],
  spacing:{ before:260, after:120 }, keepNext:true,
  border:{ bottom:{ style:BorderStyle.SINGLE, size:8, color:GOLD } },
});

const cell = (children, o={}) => new TableCell({
  children, width:{ size:o.w, type:WidthType.DXA },
  shading: o.fill ? { type:ShadingType.CLEAR, fill:o.fill, color:'auto' } : undefined,
  margins:{ top:70, bottom:70, left:110, right:110 },
  columnSpan:o.span, verticalAlign:o.va,
});

const kv = (rows) => new Table({
  width:{ size:CONTENT_W, type:WidthType.DXA }, columnWidths:[2600,6760],
  borders: gridBorders,
  rows: rows.map(([k,v]) => new TableRow({ children:[
    cell([p(t(k,{bold:true,size:19,color:MAROON}),{after:0})], {w:2600, fill:BAND}),
    cell([p(t(v,{size:19}),{after:0})], {w:6760}),
  ]})),
});

// ---------------------------------------------------------------- content
const TEAMS = ["Quantum","RocksHack","HexTech","Anomalists","AxisLi","Error:404","Wayne Family",
"STELLAR","CyberNova","Vetri Kazagam","Byte Circuit","Cyber Trixs","Cypher","HackEra",
"c0mrad3$.exe","Team Ascenders","TechTonic","Hello World","Trust me Bro","Code Crafters",
"Naanga Naalu Peru","Quantum Coders","SAY MY NAME!!","SYNORA","Electronexes","Neonix",
"Techgiants","Nakshathra Payaluga","CodeX","TRIVEX","Mechzords","Claude-Coders",
"Ravana Evaders","Cyber Forge"];

const DOMAINS = [
  ['Domain 01 — Digital','Software · AI · Cloud · Cybersecurity',
   ['PS 01 — Payment 4.0: The Authentication Problem',
    'PS 02 — The Impostor: When Your Digital Life Is No Longer Yours',
    'PS 03 — The Last Original: Can You Trust Digital Reality?']],
  ['Domain 02 — IoT','IoT · Embedded Systems · Electronics · Smart Devices',
   ['PS 04 — The Ghost Key',
    'PS 05 — The House That Betrayed You',
    'PS 06 — Gridlock']],
  ['Domain 03 — Autonomous Systems','Robotics · Drones · Automation · Industry 5.0',
   ['PS 07 — The Last Shift',
    'PS 08 — Ghost Driver',
    'PS 09 — Swarm']],
];

const domainTable = new Table({
  width:{ size:CONTENT_W, type:WidthType.DXA }, columnWidths:[2900,6460],
  borders: gridBorders,
  rows: [
    new TableRow({ tableHeader:true, children:[
      cell([p(t('DOMAIN',{bold:true,size:18,color:'FFFFFF',ls:16}),{after:0})],{w:2900,fill:MAROON}),
      cell([p(t('PROBLEM STATEMENTS',{bold:true,size:18,color:'FFFFFF',ls:16}),{after:0})],{w:6460,fill:MAROON}),
    ]}),
    ...DOMAINS.map(([name,tag,list]) => new TableRow({ children:[
      cell([ p(t(name,{bold:true,size:19}),{after:40}),
             p(t(tag,{size:16,italics:true,color:GREY}),{after:0}) ],{w:2900,fill:BAND}),
      cell(list.map((s,i)=>p(t(s,{size:19}),{after:i===list.length-1?0:60})),{w:6460}),
    ]})),
  ],
});

// teams in four columns
const teamRows = [];
for (let i=0;i<TEAMS.length;i+=4){
  const slice = TEAMS.slice(i,i+4);
  while (slice.length<4) slice.push('');
  teamRows.push(new TableRow({ children: slice.map((name,j)=>{
    const n = name ? String(i+j+1).padStart(2,'0')+'.  ' : '';
    return cell([p([t(n,{size:17,color:GOLD,bold:true}), t(name,{size:18})],{after:0})],{w:2340});
  })}));
}
const teamTable = new Table({
  width:{ size:CONTENT_W, type:WidthType.DXA }, columnWidths:[2340,2340,2340,2340],
  borders:{ ...noBorder, insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:'E4E4E4'} },
  rows: teamRows,
});

const panel = (title, names, note) => [
  p([t(title+'  ',{bold:true,size:19,color:MAROON})], {after:40, keepNext:true}),
  p(t(names,{size:19}), {after: note?40:140}),
  ...(note ? [p(t(note,{size:17,italics:true,color:GREY}),{after:140})] : []),
];

// photo cell: a fixed-height bordered frame the user drops an image into
const photoCell = (caption, w, h) => cell([
  new Table({
    width:{ size:w-260, type:WidthType.DXA }, columnWidths:[w-260],
    borders:{ top:hair,bottom:hair,left:hair,right:hair },
    rows:[ new TableRow({ height:{ value:h, rule:'atLeast' }, children:[
      cell([ p(t('[ insert photograph ]',{size:16,italics:true,color:'999999'}),
             {align:AlignmentType.CENTER, after:0, before: Math.round(h/2)-80}) ],
           {w:w-260, fill:'FAF8F5'}) ]}) ],
  }),
  p(t(caption,{size:15,italics:true,color:GREY}),{align:AlignmentType.CENTER, before:60, after:0}),
], {w});

const photoGrid = (items) => {
  const W = Math.floor(CONTENT_W/2), H = 2000;
  const rows = [];
  for (let i=0;i<items.length;i+=2){
    rows.push(new TableRow({ children:[
      photoCell(items[i], W, H),
      items[i+1] ? photoCell(items[i+1], W, H)
                 : cell([p(t(''),{after:0})],{w:W}),
    ]}));
  }
  return new Table({ width:{size:CONTENT_W,type:WidthType.DXA}, columnWidths:[W,W],
                     borders:noBorder, rows });
};

const doc = new Document({
  creator:'Amrita Cyber Nation',
  title:'Project Kerberos — Event Report',
  styles:{ default:{ document:{ run:{ font:'Calibri', size:20, color:INK } } } },
  sections:[{
    properties:{ page:{ margin:{ top:1080, right:1080, bottom:1080, left:1080 } } },
    children:[
      // ---------------- masthead
      p(t('AMRITA VISHWA VIDYAPEETHAM · CHENNAI CAMPUS',{size:17,bold:true,color:GREY,ls:24}),
        {align:AlignmentType.CENTER, after:40}),
      p(t('AMRITA CYBER NATION',{size:19,bold:true,color:MAROON,ls:30}),
        {align:AlignmentType.CENTER, after:180}),
      new Paragraph({ children:[ t('PROJECT KERBEROS',{bold:true,size:52,color:MAROON,ls:40}) ],
        alignment:AlignmentType.CENTER, spacing:{after:60} }),
      p(t('A 24-Hour Cyber Hackathon',{size:24,italics:true,color:GOLD}),
        {align:AlignmentType.CENTER, after:60}),
      new Paragraph({ children:[ t('EVENT REPORT',{size:18,bold:true,color:GREY,ls:30}) ],
        alignment:AlignmentType.CENTER, spacing:{after:60},
        border:{ bottom:{ style:BorderStyle.SINGLE, size:12, color:MAROON } } }),
      p(t('07 – 08 September 2026',{size:19,color:GREY}),
        {align:AlignmentType.CENTER, before:120, after:240}),

      h('Event at a Glance'),
      kv([
        ['Event','Project Kerberos — 24-Hour Cyber Hackathon (Internal)'],
        ['Organised by','Amrita Cyber Nation (ACN)'],
        ['Date & Time','07 September 2026, 9:00 AM — 08 September 2026, 9:00 AM'],
        ['Venue','Shield Lab and Astra Lab, Amrita Vishwa Vidyapeetham, Chennai'],
        ['Format','Three domains · Nine problem statements · Three rounds'],
        ['Participation','34 teams'],
        ['Team Size','3 – 4 members'],
      ]),

      h('About the Event'),
      body('Project Kerberos is a 24-hour internal hackathon conducted by Amrita Cyber Nation, built around a single question: what does a system do when it can no longer trust its own inputs? Thirty-four student teams competed across three domains — Digital, IoT, and Autonomous Systems — on problem statements set deliberately in the near future.'),
      body('Rather than asking participants to solve problems that already have textbook answers, the nine problem statements described scenarios that are only now beginning to emerge: payment authentication after PINs, OTPs and standalone biometrics can no longer be trusted; digital identities that must survive their own credentials being compromised; smart homes in which the devices themselves report false readings; autonomous drone swarms containing a member actively deceiving the rest.'),
      body('Every problem statement was structured in two acts: teams first built a functional MVP, then secured it against an adversary assumed to be already past the perimeter. Evaluation weighted the threat model as heavily as the architecture — a working demonstration alone was not sufficient to advance.'),
      body('A third act was withheld from the dossier entirely. At the midpoint of the event each team was issued a Future Card — an unannounced twist matched to its own problem statement, which changed the brief and had to be implemented on the spot. It tested adaptability rather than preparation, and proved to be the decisive round.'),

      h('Domains and Problem Statements'),
      domainTable,

      new Paragraph({ children:[ new PageBreak() ] }),

      // ---------------- page 2
      h('Organising Team'),
      ...panel('Faculty Coordinators','Dr. Suresh Veesa, Dr. Surender'),
      ...panel('Student Coordinators — Third Year','S Lakshya, Jyothir Adithya V B'),
      ...panel('Student Coordinator — Fourth Year','Mukund'),
      ...panel('Round 3 Operations — Fourth Year Coordinators',
               'Adithi Suresh, Leon, Mukund, Shudarshan Regmi, Mukilan',
               'Supported by a wider team of student volunteers across both labs.'),

      h('Round Structure and Evaluation'),
      body('The hackathon was conducted over three progressively demanding rounds across the 24-hour window.'),

      p([t('Round 1 — Concept and Threat Model  ',{bold:true,size:20,color:MAROON}),
         t('(07 September, 12:00 PM)',{size:18,italics:true,color:GREY})],{after:40,keepNext:true}),
      body('Teams presented their proposed MVP and, critically, their design for the "Secure It" brief. Submissions were evaluated by fourth-year seniors, who assessed the clarity of the threat model alongside the feasibility of the proposed build.', {after:160}),

      p([t('Round 2 — Implementation Review  ',{bold:true,size:20,color:MAROON}),
         t('(Evaluated by faculty panel)',{size:18,italics:true,color:GREY})],{after:40,keepNext:true}),
      body('Teams demonstrated working implementations and defended their security architecture before a faculty judging panel.', {after:60}),
      ...panel('Judging Panel',
        'Dr. Raghul, Dr. I R Oviya, Dr. J Anitha, Dr. Rajesh, Dr. Rithani, Dr. Prasanna Kumar, Dr. Kumar M S'),

      p([t('Round 3 — The Future Card  ',{bold:true,size:20,color:MAROON}),
         t('(Issued 12:00 AM, concluded 12:00 PM)',{size:18,italics:true,color:GREY})],{after:40,keepNext:true}),
      body('From 10:00 PM, the fourth-year coordinators and volunteer team prepared and administered the final round. At midnight, every team was issued a Future Card matched to its own problem statement — an unannounced constraint that altered the brief and had to be implemented within the remaining hours. Teams worked through the night, and the round concluded the following afternoon with final demonstrations before the judging panel.', {after:60}),
      ...panel('Final Judging Panel',
        'Dr. Sountharrajan S, Dr. Bhagavathi Priya, Dr. Natarajan, Dr. Suthir, Dr. Sreenivasa Chakravarthi'),

      h('Participating Teams'),
      p(t('A total of 34 teams participated across the three domains.',{size:19,color:GREY}),{after:120}),
      teamTable,

      new Paragraph({ children:[ new PageBreak() ] }),

      // ---------------- page 3
      h('Outcome'),
      body('All 34 teams sustained participation through the full 24-hour window and presented at each of the three evaluation checkpoints. The Future Card round produced the clearest separation between them: teams that had designed for adaptability — modular trust boundaries, configurable policy, a clean separation between detection and response — absorbed the twist and still demonstrated a working system, while more rigidly-built solutions required substantial rework in the hours that remained.'),
      body('Across all three domains the strongest submissions shared one trait: they treated verification as a continuous property of the system rather than a one-time gate, which was precisely the outcome the problem statements were written to elicit. Final placements were determined by the Round 3 panel on the basis of the implemented Future Card response, the underlying security architecture, and the quality of the live demonstration.', {after:200}),

      h('Event Photographs'),
      photoGrid([
        'Teams at work during the build phase — Shield Lab.',
        'Coordinators briefing a participating team.',
        'Faculty evaluation in progress during Round 2.',
        'Hardware prototyping for the IoT domain — Astra Lab.',
        'A team presenting its implementation to the judging panel.',
      ]),

      p([t('Report prepared by the Project Kerberos organising committee · Amrita Cyber Nation · Amrita Vishwa Vidyapeetham, Chennai',
        {size:16,italics:true,color:GREY})],
        {align:AlignmentType.CENTER, before:320, after:0,
         border:{ top:{ style:BorderStyle.SINGLE, size:6, color:LINE } }}),
    ],
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync('report/Project_Kerberos_Event_Report.docx', b); console.log('written'); });
