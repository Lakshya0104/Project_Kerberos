import re, xml.etree.ElementTree as ET

SRC = 'un/word/document.xml'
raw = open(SRC, encoding='utf-8').read()

# keep every prefix Word declared, so the round-trip is byte-comparable in shape
for pfx, uri in re.findall(r'xmlns:([A-Za-z0-9]+)="([^"]+)"', re.search(r'<w:document[^>]*>', raw).group(0)):
    ET.register_namespace(pfx, uri)
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
def w(tag): return f'{{{W}}}{tag}'

tree = ET.ElementTree(ET.fromstring(raw))
root = tree.getroot()

def text_of(el):
    return ''.join(t.text or '' for t in el.iter(w('t'))).strip()

def make_p(line, bold=False, indent=0, size='22'):
    """One paragraph in the template's body style."""
    p = ET.Element(w('p'))
    pPr = ET.SubElement(p, w('pPr'))
    tabs = ET.SubElement(pPr, w('tabs'))
    tab = ET.SubElement(tabs, w('tab')); tab.set(w('val'), 'left'); tab.set(w('pos'), '8030')
    sp = ET.SubElement(pPr, w('spacing')); sp.set(w('line'), '276'); sp.set(w('lineRule'), 'auto')
    if indent:
        ind = ET.SubElement(pPr, w('ind')); ind.set(w('left'), str(indent))
    rPr0 = ET.SubElement(pPr, w('rPr'))
    if bold:
        ET.SubElement(rPr0, w('b')); ET.SubElement(rPr0, w('bCs'))
    s0 = ET.SubElement(rPr0, w('sz')); s0.set(w('val'), size)
    s0c = ET.SubElement(rPr0, w('szCs')); s0c.set(w('val'), size)
    if line:
        r = ET.SubElement(p, w('r'))
        rPr = ET.SubElement(r, w('rPr'))
        if bold:
            ET.SubElement(rPr, w('b')); ET.SubElement(rPr, w('bCs'))
        s = ET.SubElement(rPr, w('sz')); s.set(w('val'), size)
        sc = ET.SubElement(rPr, w('szCs')); sc.set(w('val'), size)
        t = ET.SubElement(r, w('t')); t.text = line
        t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    return p

def set_cell(tc, lines):
    """Replace a cell's paragraphs. lines: str | (str, {opts})"""
    for child in list(tc):
        if child.tag != w('tcPr'):
            tc.remove(child)
    for item in lines:
        line, opts = (item, {}) if isinstance(item, str) else item
        tc.append(make_p(line, **opts))

B  = {'bold': True}
I1 = {'indent': 340}
I2 = {'indent': 680}

# ---------------------------------------------------------------- row content
ROWS = {
 'Thematic Area': [
    ('Cyber Security — Secure System Design, Trust and Resilience', B)],

 'Institution Name': [
    'Amrita Vishwa Vidyapeetham,', 'Chennai Campus'],

 'Title of Hackathon': [
    ('Project Kerberos: A 24-Hour Cyber Hackathon', B)],

 'Objective': [
    'To foster innovation in secure system design by challenging students to build systems that remain trustworthy after their own components have been compromised.',
    'To build capacity among students in threat modelling, adversarial thinking, and the defence of authentication, identity, and sensor-driven systems.',
    'To provide hands-on exposure to emerging, forward-looking cybersecurity challenges through problem-based learning across software, IoT, and autonomous systems.',
    'To test adaptability under pressure by introducing an unannounced mid-event constraint that requires teams to redesign and re-secure a working system on the spot.'],

 'Timeline/ Dates': [
    ('7th to 8th September 2026 (24 hours, 9:00 AM to 9:00 AM)', B)],

 'Venue': [
    'Amrita Vishwa Vidyapeetham, Amrita School of Computing, Chennai Campus —',
    'Shield Lab and Astra Lab'],

 'Detailed Structure of Hackathon': [
    ('Phase 1: Problem Statement Release & Team Formation', B),
    'Release of the Problem Statement Dossier — 3 domains, 9 problem statements.',
    ('Phase 2: Online Round — Registration and Submission', B),
    'Teams submitted a PowerPoint presentation covering their proposed MVP and their security design for the "Secure It" brief.',
    ('Phase 3: Shortlisting', B),
    'Online submissions evaluated and teams shortlisted for the offline 24-hour round.',
    ('Phase 4 [07-09-2026]: 24-Hour Hackathon', B),
    ('Hackathon starts  9:00 AM', I1),
    ('Round 1 Evaluation  12:00 PM', I1),
    ('Round 2 Evaluation  Faculty judging panel', I1),
    ('Round 3 preparation  10:00 PM', I1),
    ('Future Cards issued, Round 3 begins  12:00 AM', I1),
    ('Phase 5 [08-09-2026]: Final Evaluation & Valedictory', B),
    ('Round 3 final evaluation and demonstrations concluded  12:00 PM', I1)],

 'Problem Statements': [
    ('Domain 1: Digital  (Software · AI · Cloud · Cybersecurity)', B),
    'PS 01 — Payment 4.0: The Authentication Problem. Redesign payment authentication for a world in which PINs, OTPs, static QR codes and standalone biometrics can no longer be trusted.',
    'PS 02 — The Impostor: When Your Digital Life Is No Longer Yours. Build an identity that remains trustworthy after some of its credentials have already been compromised.',
    'PS 03 — The Last Original: Can You Trust Digital Reality? Establish and prove a digital file’s chain of custody when only the latest version is ever available.',
    ('Domain 2: IoT  (IoT · Embedded Systems · Electronics · Smart Devices)', B),
    'PS 04 — The Ghost Key. Defend an RFID/NFC access system against cloned, replayed, relayed and stolen credentials, where possession alone is not proof of identity.',
    'PS 05 — The House That Betrayed You. Decide what is actually true in a smart home where any single device may be reporting false readings.',
    'PS 06 — Gridlock. Keep an intelligent power grid safe when its sensors disagree, without defaulting to a full shutdown.',
    ('Domain 3: Autonomous Systems  (Robotics · Drones · Automation · Industry 5.0)', B),
    'PS 07 — The Last Shift. Build a command hierarchy for an industrial robot balancing human authority, productivity and non-overridable safety.',
    'PS 08 — Ghost Driver. Keep an autonomous vehicle safe when it can trust neither its own sensors nor the commands it receives.',
    'PS 09 — Swarm. Maintain trust within an autonomous swarm when one of its own members is actively deceiving the rest.',
    ('Round 3 — The Future Card (unannounced)', B),
    'At the midpoint of the event each team was issued a Future Card — a twist bound to its own problem statement that altered the brief and had to be implemented within the remaining hours.'],

 'Eligibility & Assessment criteria': [
    ('1. Online Stage', B),
    ('Eligibility for the Online Round:', B),
    'Teams of 3–4 members submitted their approach as a PowerPoint presentation covering the proposed MVP, how it works end to end, and their design for the "Secure It" brief.',
    ('Assessment for the Online Round:', B),
    ('Problem Understanding and Threat Model  (0-5)', I1),
    ('Proposed Security Architecture  (0-5)', I1),
    ('Innovation  (0-5)', I1),
    ('Technical Feasibility  (0-5)', I1),
    ('Presentation  (0-5)', I1),
    ('2. Offline Stage', B),
    ('Round 1 Evaluation Criteria:', B),
    ('Problem Understanding  25 Marks', I1),
    ('Proposed Technical Approach  30 Marks', I1),
    ('Innovation & Creativity  20 Marks', I1),
    ('Feasibility & Practical Impact  15 Marks', I1),
    ('Pitch Clarity  10 Marks', I1),
    ('Round 2 Evaluation Criteria:', B),
    ('Technical Implementation  35 Marks', I1),
    ('Prototype Functionality  25 Marks', I1),
    ('Innovation in Implementation  15 Marks', I1),
    ('Security Architecture & Robustness  15 Marks', I1),
    ('Demo & Presentation  10 Marks', I1),
    ('Round 3 Evaluation Criteria (Future Card):', B),
    ('Correct Interpretation of the Future Card  20 Marks', I1),
    ('Quality of the Implemented Response  35 Marks', I1),
    ('Resilience of the Resulting System  25 Marks', I1),
    ('Originality and Code Quality  20 Marks', I1)],

 'Details of mentoring sessions': [
    ('1. Faculty Coordinators', B),
    'Dr. Suresh Veesa',
    'Dr. Surender',
    ('2. Round 2 — Faculty Judging Panel', B),
    'Dr. Raghul, Dr. I R Oviya, Dr. J Anitha, Dr. Rajesh, Dr. Rithani, Dr. Prasanna Kumar, Dr. Kumar M S',
    ('3. Round 3 — Final Judging Panel', B),
    'Dr. Sountharrajan S, Dr. Bhagavathi Priya, Dr. Natarajan, Dr. Suthir, Dr. Sreenivasa Chakravarthi',
    ('4. Student Coordinators', B),
    'Third Year: S Lakshya, Jyothir Adithya V B',
    'Fourth Year: Mukund',
    'Round 3 Operations: Adithi Suresh, Leon, Mukund, Shudarshan Regmi, Mukilan, supported by a wider team of student volunteers.'],

 'No. of Participants': [
    ('1. Online Stage:', B),
    ('Total No. of Participants: 155', I1),
    ('Total No. of Teams: 40', I1),
    ('2. Offline Stage:', B),
    ('Total No. of Participants: 132', I1),
    ('Total No. of Teams: 34', I1),
    ('Domain 1 — Digital', I1),
    ('Domain 2 — IoT', I1),
    ('Domain 3 — Autonomous Systems', I1)],

 'Outcomes': [
    ('Proof-of-Concept (PoC) and working Prototype / MVP for each participating team.', B),
    'All 34 offline teams delivered a functional MVP together with a defended security architecture, and implemented an unannounced Future Card modification to that system within the event window.',
    'Outputs spanned software builds, hardware prototypes and full simulations across the three domains, covering secure payment authentication, resilient digital identity, content provenance, access-control hardening, trust arbitration in smart homes and power grids, and secure autonomy for industrial robots, vehicles and drone swarms.'],

 'Action plan for taking developed PoC': [
    'Shortlisted prototypes to be developed further under faculty mentorship within the Amrita Cyber Nation student body, with a view to publication and to participation in national-level hackathons.',
    'Selected problem statements and Future Card scenarios to be retained as a reusable problem bank for subsequent editions and for classroom use in cybersecurity coursework.',
    'Teams with hardware prototypes to be supported in extending their work into project and capstone submissions.'],
}

# ---------------------------------------------------------------- apply
tbl = root.iter(w('tbl')).__next__()
filled = set()
for tr in tbl.findall(w('tr')):
    tcs = tr.findall(w('tc'))
    if len(tcs) < 3:
        continue
    label = text_of(tcs[1])
    for key, lines in ROWS.items():
        if label.startswith(key):
            set_cell(tcs[2], lines)
            filled.add(key)
            break

missing = set(ROWS) - filled
assert not missing, f'unfilled rows: {missing}'

# ---------------------------------------------------------------- title block
# "EVENT NAME" is styled all-caps, so match on the run text, not the rendered text.
body = root.find(w('body'))
for p in body.findall(w('p')):
    runs = [t for t in p.iter(w('t'))]
    if not runs:
        continue
    joined = ''.join(t.text or '' for t in runs)
    if joined.strip().startswith('EVENT NAME'):
        runs[0].text = 'PROJECT KERBEROS'
    elif joined.strip() == 'Date:':
        # the label sits in the last run of the paragraph, after leading spacer runs
        runs[-1].text = 'Date: 7th \u2013 8th September 2026'

tree.write(SRC, encoding='UTF-8', xml_declaration=True, default_namespace=None)
# Word wants the standalone attribute
d = open(SRC, encoding='utf-8').read()
d = d.replace("<?xml version='1.0' encoding='UTF-8'?>",
              '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n', 1)
open(SRC, 'w', encoding='utf-8').write(d)
print('filled rows:', len(filled))
