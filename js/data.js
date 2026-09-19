const NAV_ITEMS = [
  { id: "home", label: "Hem" },
  { id: "learn", label: "Lär dig" },
  { id: "prefix", label: "Prefix" },
  { id: "units", label: "Enheter" },
  { id: "sigfigs", label: "Värdesiffror" },
  { id: "time", label: "Tid" },
  { id: "velocity", label: "Hastighet" },
  { id: "density", label: "Densitet" },
  { id: "formulas", label: "Formler" },
  { id: "mix", label: "Blandad träning" },
  { id: "hard", label: "Mina fel" },
  { id: "exam", label: "Prov" }
];

const MODE_TITLES = {
  home: "Hem",
  learn: "Lär dig",
  prefix: "Prefix",
  prefixdrill: "Prefixträning",
  expand: "Skriv utan prefix",
  compress: "Sätt dit prefix",
  units: "Enheter",
  sigfigs: "Värdesiffror",
  sigcalc: "Värdesiffror i beräkningar",
  time: "Tid",
  velocity: "Hastighet",
  convert: "km/h och m/s",
  mixedu: "Blandade enheter",
  density: "Densitet",
  formulas: "Formler",
  first: "Vad ska jag göra först?",
  linear: "Linjära samband",
  problems: "Problemlösning",
  mix: "Blandad träning",
  hard: "Mina fel",
  exam: "Prov",
  results: "Resultat",
  flash: "Flashcards",
  speedq: "Hastighetsuppgifter",
  prefixdrill: "Prefixträning",
  expand: "Skriv utan prefix",
  compress: "Sätt dit prefix",
  sigcalc: "Värdesiffror i beräkningar",
  convert: "km/h och m/s",
  mixedu: "Blandade enheter",
  first: "Vad ska jag göra först?",
  linear: "Linjära samband",
  problems: "Problemlösning"
};

const UNITS = [
  { id: "stracka", name: "Sträcka", unit: "m", extra: "meter" },
  { id: "tid", name: "Tid", unit: "s", extra: "sekund" },
  { id: "hastighet", name: "Hastighet", unit: "m/s", extra: "meter per sekund" },
  { id: "acc", name: "Acceleration", unit: "m/s²", extra: "meter per sekundkvadrat" },
  { id: "massa", name: "Massa", unit: "kg", extra: "kilogram" },
  { id: "densitet", name: "Densitet", unit: "kg/m³", extra: "kilogram per kubikmeter" },
  { id: "kraft", name: "Kraft", unit: "N", extra: "newton" },
  { id: "energi", name: "Energi", unit: "J", extra: "joule" },
  { id: "effekt", name: "Effekt", unit: "W", extra: "watt" },
  { id: "tryck", name: "Tryck", unit: "Pa", extra: "pascal" },
  { id: "frekvens", name: "Frekvens", unit: "Hz", extra: "hertz" },
  { id: "strom", name: "Ström", unit: "A", extra: "ampere" },
  { id: "resistans", name: "Resistans", unit: "Ω", extra: ["ohm", "omega"] },
  { id: "kap", name: "Kapacitans", unit: "F", extra: "farad" },
  { id: "b", name: "Magnetisk flödestäthet", unit: "T", extra: "tesla" }
];

const LEARN = [
  {
    id: "l-si",
    area: "prefix",
    title: "SI-prefix",
    body: "Prefix sätter en tiopotens framför en enhet. kilo betyder 10³, så 3 km = 3 × 10³ m = 3000 m. mega betyder 10⁶. milli betyder 10⁻³. Samma system används för watt, volt, hertz och sekunder.",
    think: "Varför skriver man hellre 5 MW än 5 000 000 W?",
    explain: "Talet blir kortare och antalet värdesiffror syns tydligare. 5 MW har en värdesiffra i koefficienten 5, medan 5 000 000 W kan se mer osäkert ut."
  },
  {
    id: "l-line",
    area: "prefix",
    title: "Prefix-linjen",
    body: "De vanligaste stegen i fysiken är tre tiopotenser i taget: T, G, M, k, grundenhet, m, µ, n, p. Varje steg åt höger är 10⁻³ gånger så stort. Varje steg åt vänster är 10³ gånger så stort.",
    think: "Hur många steg är det från k till µ?",
    explain: "k → (grund) → m → µ är tre steg à 10³, alltså 10⁹. 4 kV = 4 × 10⁹ µV, men vanligare: 4 kV = 4 × 10⁶ mV = 4 × 10³ V."
  },
  {
    id: "l-unit",
    area: "units",
    title: "Storhet och enhet",
    body: "En storhet är det man mäter, till exempel sträcka eller tid. Enheten talar om vilken måttstock som används. I SI är sträcka i meter, tid i sekunder och massa i kilogram. Sammansatta enheter byggs av dessa, till exempel m/s.",
    think: "Varför räcker det inte att svara 5 på 100 m / 20 s?",
    explain: "5 vad? Utan enhet vet man inte om det är 5 m/s, 5 km/h eller något annat. I fysik hör tal och enhet ihop."
  },
  {
    id: "l-sig",
    area: "sigfigs",
    title: "Värdesiffror",
    body: "Värdesiffror visar hur noggrant ett mätvärde är. Inledande nollor räknas inte. Nollor mellan siffror räknas. Avslutande nollor efter decimaltecken räknas. Tiopotensform gör antalet tydligt: 9,0 × 10¹ har två värdesiffror, 9 × 10¹ har en.",
    think: "Hur många värdesiffror har 0,70070?",
    explain: "Siffrorna 7, 0, 0, 7 och 0 efter decimalen som inte bara är inledande nollor: fem värdesiffror. Den sista nollan är avslutande efter decimaltecken och räknas."
  },
  {
    id: "l-sigop",
    area: "sigfigs",
    title: "Värdesiffror vid räkning",
    body: "Vid multiplikation och division ska resultatet normalt ha lika många värdesiffror som det mätvärde som har minst antal. 4,37 har tre, 6,158 har fyra, produkten avrundas till tre: 26,9.",
    think: "Varför avrundar man inte 4,37 × 6,158 till 26,91046?",
    explain: "4,37 är bara känt med tre värdesiffror. Extra decimaler i kalkylatorn låtsas att mätningen var noggrannare än den var."
  },
  {
    id: "l-tid",
    area: "time",
    title: "Tid",
    body: "1 min = 60 s. 1 h = 60 min = 3600 s. 1 dygn = 24 h = 86 400 s. 1 vecka = 7 dygn. Vid omvandling: fler små enheter fås genom multiplikation, färre stora genom division.",
    think: "Hur många sekunder är 2,5 h?",
    explain: "2,5 × 3600 = 9000 s. Multiplicera eftersom du går från en större enhet (timme) till en mindre (sekund)."
  },
  {
    id: "l-v",
    area: "velocity",
    title: "Hastighet",
    body: "Medelhastighet definieras som v = s / t. Då är s sträcka och t tid. Formeln kan skrivas om: s = v × t och t = s / v. Enheten följer av storheterna: meter per sekund, eller km/h om s är i km och t i timmar.",
    think: "Vilken formel använder du om du känner v och t och söker s?",
    explain: "s = v × t. Sträckan är hastigheten multiplicerad med tiden, så länge enheterna hör ihop."
  },
  {
    id: "l-36",
    area: "convert",
    title: "km/h och m/s",
    body: "1 m/s = 3,6 km/h eftersom 1 m/s = 3600 m/h = 3,6 km/h. Därför: km/h → m/s dividera med 3,6. m/s → km/h multiplicera med 3,6.",
    think: "Varför blir 72 km/h precis 20 m/s?",
    explain: "72 / 3,6 = 20. Det är ett tal värt att känna igen. 36 km/h = 10 m/s, 108 km/h = 30 m/s."
  },
  {
    id: "l-rho",
    area: "density",
    title: "Densitet",
    body: "Densitet är massa per volym: ρ = m / V. Då är m = ρV och V = m / ρ. Enheter måste matcha. 1 g/cm³ = 1000 kg/m³, vilket är ungefär vattens densitet.",
    think: "Vad händer med densiteten om massan fördubblas men volymen är densamma?",
    explain: "ρ = m/V fördubblas. Densitet är en materialegenskap i homogena ämnen, men i uppgiften räknas den direkt ur givna m och V."
  },
  {
    id: "l-steg",
    area: "problem",
    title: "Problemlösning",
    body: "Ett fysikproblem löses i steg: 1) Vad är känt och sökt? 2) Behöver enheter omvandlas? 3) Välj formel. 4) Sätt in värden. 5) Räkna. 6) Enhet och rimlighet. Multiplicera inte 72 km/h med 30 s direkt.",
    think: "Varför måste 72 km/h ofta bli m/s innan s = vt med t i sekunder?",
    explain: "Annars blandas km/h med sekunder. Antingen gör du t till timmar eller v till m/s. Vanligast i fysik 1 är v i m/s och t i s, så s kommer i meter."
  },
  {
    id: "l-lin",
    area: "linear",
    title: "Linjära samband",
    body: "Om y ändras ungefär lika mycket varje gång x ökar med 1, är sambandet ungefär linjärt. Lutningen är förändring i y per enhet x. En graf gör mönstret synligt.",
    think: "Om en lina blir 6 cm kortare per knut, vad är lutningen?",
    explain: "Δy/Δx ≈ −6 cm per knut. Negativ lutning betyder att längden minskar när antalet knutar ökar."
  }
];

const SIG_COUNT = [
  { prompt: "0,567 × 10⁸", answer: 3, why: "Koefficienten 0,567 har tre värdesiffror. Tiopotensen räknas inte extra." },
  { prompt: "321,094", answer: 6, why: "Alla siffror från 3 till 4 räknas, inklusive nollan i mitten." },
  { prompt: "0,223", answer: 3, why: "Inledande nollor räknas inte. 2, 2 och 3 är värdesiffror." },
  { prompt: "0,70070", answer: 5, why: "Nollor mellan siffror och avslutande nolla efter decimaltecken räknas: 70070 i signifikanta positioner." },
  { prompt: "42", answer: 2, why: "Båda siffrorna är betydelsefulla." },
  { prompt: "90", answer: 1, alt: [1, 2], why: "Utan decimaltecken är nollan osäker. I tiopotensform: 9 × 10¹ har en värdesiffra. 9,0 × 10¹ skulle ha två." },
  { prompt: "9,0 × 10¹", answer: 2, why: "Koefficienten 9,0 har två värdesiffror. Nollan efter decimaltecknet räknas." },
  { prompt: "9 × 10¹", answer: 1, why: "Koefficienten 9 har en värdesiffra." },
  { prompt: "4,37", answer: 3, why: "Tre siffror, alla betydelsefulla." },
  { prompt: "6,158", answer: 4, why: "Fyra värdesiffror." },
  { prompt: "0,00320", answer: 3, why: "Inledande nollor räknas inte. 3, 2 och avslutande 0 räknas." },
  { prompt: "1,00 × 10³", answer: 3, why: "1,00 har tre värdesiffror." }
];

const SIG_CALC = [
  { a: 4.37, b: 6.158, op: "*", raw: 26.91046, sig: 3, answer: 26.9, why: "4,37 har tre värdesiffror, 6,158 har fyra. Produkten avrundas till tre: 26,9." },
  { a: 12.2, b: 3.04, op: "*", raw: 37.088, sig: 3, answer: 37.1, why: "Båda har tre värdesiffror. 37,088 avrundas till 37,1." },
  { a: 8.15, b: 2.1, op: "/", raw: 3.880952, sig: 2, answer: 3.9, why: "2,1 har två värdesiffror, minst. 8,15/2,1 ≈ 3,88 → 3,9." },
  { a: 0.56, b: 4.113, op: "*", raw: 2.30328, sig: 2, answer: 2.3, why: "0,56 har två värdesiffror." },
  { a: 25.0, b: 5.00, op: "/", raw: 5, sig: 3, answer: 5.00, why: "Båda har tre värdesiffror. Kvoten ska visas med tre värdesiffror: 5,00." },
  { a: 3.14, b: 2.0, op: "*", raw: 6.28, sig: 2, answer: 6.3, why: "2,0 har två värdesiffror. 6,28 → 6,3." },
  { a: 9.81, b: 3.5, op: "*", raw: 34.335, sig: 2, answer: 34, why: "3,5 har två värdesiffror. 34,335 → 34." },
  { a: 144, b: 12.0, op: "/", raw: 12, sig: 3, answer: 12.0, why: "144 har tre, 12,0 har tre. Kvoten 12,0." }
];

const KNOTS = [
  { n: 0, L: 108.2 },
  { n: 1, L: 102.5 },
  { n: 2, L: 94.9 },
  { n: 3, L: 90.0 },
  { n: 4, L: 83.6 },
  { n: 5, L: 77.2 }
];

const FLASHCARDS = [];

Phy.PREFIXES.filter(function (p) {
  return p.id !== "none";
}).forEach(function (p) {
  FLASHCARDS.push({
    id: "p-" + p.id,
    area: "prefix",
    front: "Vad betyder " + p.symbol + "?",
    back: p.name + " = " + Phy.tenText(p.exp)
  });
  FLASHCARDS.push({
    id: "pe-" + p.id,
    area: "prefix",
    front: "Vilket prefix motsvarar " + Phy.tenText(p.exp) + "?",
    back: p.name + " (" + p.symbol + ")"
  });
});

UNITS.forEach(function (u) {
  FLASHCARDS.push({
    id: "u-" + u.id,
    area: "units",
    front: "Vilken SI-enhet har " + u.name.toLowerCase() + "?",
    back: u.unit + " (" + (typeof u.extra === "string" ? u.extra : u.extra[0]) + ")"
  });
  FLASHCARDS.push({
    id: "uq-" + u.id,
    area: "units",
    front: "Vilken storhet mäts i " + u.unit + "?",
    back: u.name
  });
});

FLASHCARDS.push(
  { id: "f-v", area: "formula", front: "Formel för medelhastighet", back: "v = s / t" },
  { id: "f-s", area: "formula", front: "Om v = s/t, hur får du s?", back: "s = v × t" },
  { id: "f-t", area: "formula", front: "Om v = s/t, hur får du t?", back: "t = s / v" },
  { id: "f-rho", area: "formula", front: "Formel för densitet", back: "ρ = m / V" },
  { id: "f-36", area: "convert", front: "Hur omvandlar man km/h till m/s?", back: "Dividera med 3,6." },
  { id: "f-36b", area: "convert", front: "Hur omvandlar man m/s till km/h?", back: "Multiplicera med 3,6." },
  { id: "f-min", area: "time", front: "Hur många sekunder är 1 min?", back: "60 s" },
  { id: "f-h", area: "time", front: "Hur många sekunder är 1 h?", back: "3600 s" },
  { id: "f-d", area: "time", front: "Hur många sekunder är 1 dygn?", back: "86 400 s" }
);

const FORMULA_Q = [
  { id: "fo1", area: "formula", prompt: "Du känner till sträckan och tiden och söker hastigheten. Vilken formel?", answer: "v = s/t", options: ["v = s/t", "s = v × t", "t = s/v", "ρ = m/V"] },
  { id: "fo2", area: "formula", prompt: "Du känner till hastigheten och tiden och söker sträckan. Vilken formel?", answer: "s = v × t", options: ["v = s/t", "s = v × t", "t = s/v", "m = ρV"] },
  { id: "fo3", area: "formula", prompt: "Du känner till sträckan och hastigheten och söker tiden. Vilken formel?", answer: "t = s/v", options: ["v = s/t", "s = v × t", "t = s/v", "V = m/ρ"] },
  { id: "fo4", area: "formula", prompt: "Om v = s/t, vilken formel ger s?", answer: "s = v × t", options: ["s = v / t", "s = v × t", "s = t / v", "s = v + t"] },
  { id: "fo5", area: "formula", prompt: "Om v = s/t, vilken formel ger t?", answer: "t = s / v", options: ["t = v / s", "t = s × v", "t = s / v", "t = v − s"] },
  { id: "fo6", area: "formula", prompt: "Du känner till massan och volymen och söker densiteten. Vilken formel?", answer: "ρ = m/V", options: ["ρ = m/V", "m = ρ/V", "V = ρ/m", "ρ = m × V"] },
  { id: "fo7", area: "formula", prompt: "Om ρ = m/V, hur får du massan?", answer: "m = ρV", options: ["m = ρ/V", "m = V/ρ", "m = ρV", "m = ρ + V"] },
  { id: "fo8", area: "formula", prompt: "Om ρ = m/V, hur får du volymen?", answer: "V = m/ρ", options: ["V = ρ/m", "V = m/ρ", "V = mρ", "V = m − ρ"] }
];

const FIRST_Q = [
  {
    id: "st1",
    area: "problem",
    prompt: "Du får hastigheten 72 km/h och tiden 30 s. Vad bör du göra först om du vill använda formeln s = vt och få svaret i meter?",
    answer: "Omvandla 72 km/h till m/s",
    options: [
      "Omvandla 72 km/h till m/s",
      "Multiplicera 72 med 30 direkt",
      "Omvandla sekunder till kilometer",
      "Dividera 72 med 30"
    ],
    explain: "72 km/h och 30 s hör inte ihop. 72 / 3,6 = 20 m/s, sedan s = 20 × 30 = 600 m."
  },
  {
    id: "st2",
    area: "problem",
    prompt: "En bil kör 18 km/h i 2,5 minuter. Du vill ha sträckan i km. Vad är ett korrekt första steg?",
    answer: "Gör 2,5 min till timmar, eller 18 km/h till km/min",
    options: [
      "Gör 2,5 min till timmar, eller 18 km/h till km/min",
      "Multiplicera 18 med 2,5 direkt",
      "Dividera 18 med 3,6 och sluta där",
      "Byt km/h mot m/s och strunta i tiden"
    ],
    explain: "t måste vara i timmar om v är i km/h: 2,5 min = 2,5/60 h. s = 18 × 2,5/60 = 0,75 km."
  },
  {
    id: "st3",
    area: "problem",
    prompt: "Du ska räkna densitet och har m = 500 g och V = 100 cm³. Vad bör du tänka på först?",
    answer: "Att m och V ska ha enheter som hör ihop, till exempel g och cm³",
    options: [
      "Att m och V ska ha enheter som hör ihop, till exempel g och cm³",
      "Att alltid räkna om till ljusår",
      "Att strunta i volymen",
      "Att multiplicera 500 med 100"
    ],
    explain: "500 g / 100 cm³ = 5,0 g/cm³. Vill du ha kg/m³ måste båda omvandlas konsekvent (5000 kg/m³)."
  },
  {
    id: "st4",
    area: "problem",
    prompt: "Uppgiften ber om medelhastighet och ger sträcka och tid. Vilket steg kommer före insättning i formeln?",
    answer: "Kontrollera att s och t har enheter som ger den enhet du vill ha på v",
    options: [
      "Kontrollera att s och t har enheter som ger den enhet du vill ha på v",
      "Gissa ett svar i newton",
      "Addera sträcka och tid",
      "Byt till densitetsformeln"
    ],
    explain: "v = s/t. Meter och sekunder ger m/s. km och timmar ger km/h."
  }
];

const LINEAR_Q = [
  { id: "ln1", area: "linear", prompt: "En lina mäts enligt tabellen. Vad var längden från början (0 knutar)?", answer: 108.2, si: 1.082, unit: "cm", dim: "L", display: "108,2 cm", explain: "Vid 0 knutar är längden 108,2 cm. Det är skärningen med L-axeln." },
  { id: "ln2", area: "linear", prompt: "Hur mycket minskar längden ungefär per knut, i cm? Ange ett värde kring medeländringen.", answer: 6.2, si: 0.062, unit: "cm", dim: "L", rel: 0.18, display: "ungefär 6,2 cm per knut", explain: "Från 108,2 cm till 77,2 cm på 5 knutar: (108,2 − 77,2)/5 = 6,2 cm per knut. Enskilda steg varierar något." },
  { id: "ln3", area: "linear", type: "mc", prompt: "Vilket samband stämmer bäst med tabellen?", answer: "Längden minskar ungefär linjärt när antalet knutar ökar.", options: ["Längden ökar exponentiellt", "Längden minskar ungefär linjärt när antalet knutar ökar.", "Längden är oberoende av knutar", "Längden fördubblas för varje knut"], explain: "Ungefär samma minskning per knut tyder på ett linjärt samband med negativ lutning." }
];

function nice(n) {
  return Math.round(n * 1000) / 1000;
}

function makeExpandBank() {
  const bank = [
    { coeff: 7.5, prefix: "mega", unit: "Hz", si: 7.5e6, dim: "f", display: "7,5 MHz" },
    { coeff: 6, prefix: "nano", unit: "g", si: 6e-9, dim: "M", display: "6 ng" },
    { coeff: 8, prefix: "mega", unit: "V", si: 8e6, dim: "U", display: "8 MV" },
    { coeff: 50, prefix: "centi", unit: "m", si: 0.5, dim: "L", display: "50 cm" },
    { coeff: 44, prefix: "tera", unit: "W", si: 44e12, dim: "P", display: "44 TW" },
    { coeff: 5, prefix: "milli", unit: "m", si: 0.005, dim: "L", display: "5 mm" },
    { coeff: 3.2, prefix: "mega", unit: "W", si: 3.2e6, dim: "P", display: "3,2 MW" },
    { coeff: 4.5, prefix: "mikro", unit: "s", si: 4.5e-6, dim: "T", display: "4,5 µs" },
    { coeff: 2.4, prefix: "kilo", unit: "m", si: 2400, dim: "L", display: "2,4 km" },
    { coeff: 12, prefix: "milli", unit: "A", si: 0.012, dim: "I", display: "12 mA" },
    { coeff: 9, prefix: "giga", unit: "Hz", si: 9e9, dim: "f", display: "9 GHz" },
    { coeff: 3, prefix: "piko", unit: "s", si: 3e-12, dim: "T", display: "3 ps" },
    { coeff: 250, prefix: "milli", unit: "s", si: 0.25, dim: "T", display: "250 ms" },
    { coeff: 1.5, prefix: "kilo", unit: "V", si: 1500, dim: "U", display: "1,5 kV" },
    { coeff: 80, prefix: "centi", unit: "m", si: 0.8, dim: "L", display: "80 cm" }
  ];
  const extras = [];
  const combos = [
    { c: [2, 3, 4.5, 6, 7.2, 8, 12, 15], p: "kilo", u: "m", dim: "L" },
    { c: [1.2, 2.5, 3, 5, 6.4], p: "mega", u: "W", dim: "P" },
    { c: [2, 5, 8, 10, 20], p: "milli", u: "s", dim: "T" },
    { c: [3, 4.8, 6, 9], p: "mikro", u: "A", dim: "I" },
    { c: [2, 4, 5, 8], p: "nano", u: "s", dim: "T" }
  ];
  combos.forEach(function (row) {
    row.c.forEach(function (c) {
      const p = Phy.prefixById(row.p);
      extras.push({
        coeff: c,
        prefix: row.p,
        unit: row.u,
        si: c * Math.pow(10, p.exp),
        dim: row.dim,
        display: Phy.formatPlain(c, 3) + " " + p.symbol + row.u
      });
    });
  });
  return bank.concat(extras);
}

function makeCompressBank() {
  return [
    { si: 30000, dim: "U", unit: "V", display: "30 000 V", prefer: "30 kV", preferSiUnit: 1000 },
    { si: 0.4, dim: "M", unit: "kg", display: "400 g", prefer: "0,40 kg eller 400 g", g: true },
    { si: 5e-6, dim: "I", unit: "A", display: "0,000005 A", prefer: "5 µA" },
    { si: 2e-5, dim: "M", unit: "kg", display: "0,02 g", prefer: "20 mg" },
    { si: 5e6, dim: "P", unit: "W", display: "5 000 000 W", prefer: "5 MW" },
    { si: 3e-6, dim: "T", unit: "s", display: "0,000003 s", prefer: "3 µs" },
    { si: 7500, dim: "L", unit: "m", display: "7 500 m", prefer: "7,5 km" },
    { si: 0.25, dim: "L", unit: "m", display: "0,25 m", prefer: "25 cm" },
    { si: 1.2e9, dim: "f", unit: "Hz", display: "1 200 000 000 Hz", prefer: "1,2 GHz" },
    { si: 8e-3, dim: "T", unit: "s", display: "0,008 s", prefer: "8 ms" },
    { si: 4500, dim: "U", unit: "V", display: "4500 V", prefer: "4,5 kV" },
    { si: 6e-9, dim: "T", unit: "s", display: "0,000000006 s", prefer: "6 ns" }
  ];
}

const EXPAND_BANK = makeExpandBank();
const COMPRESS_BANK = makeCompressBank();

const TIME_Q = [
  { prompt: "Hur många sekunder är 3,5 timmar?", si: 12600, dim: "T", display: "12 600 s", steps: ["1 h = 3600 s", "3,5 × 3600 = 12 600 s"] },
  { prompt: "Hur många minuter är 720 sekunder?", si: 720, dim: "T", display: "12 min", unitHint: "min", steps: ["1 min = 60 s", "720 / 60 = 12 min"] },
  { prompt: "Hur många sekunder finns det i ett dygn?", si: 86400, dim: "T", display: "86 400 s", steps: ["1 dygn = 24 h", "24 × 3600 = 86 400 s"] },
  { prompt: "Hur många sekunder är 2 minuter?", si: 120, dim: "T", display: "120 s", steps: ["2 × 60 = 120 s"] },
  { prompt: "Hur många timmar är 18 000 s?", si: 18000, dim: "T", display: "5 h", unitHint: "h", steps: ["18 000 / 3600 = 5 h"] },
  { prompt: "Hur många sekunder är 1,5 min?", si: 90, dim: "T", display: "90 s", steps: ["1,5 × 60 = 90 s"] },
  { prompt: "Hur många dygn är 168 timmar?", si: 604800, dim: "T", display: "7 dygn", unitHint: "dygn", steps: ["168 / 24 = 7 dygn, en vecka"] },
  { prompt: "Hur många minuter är 2,5 h?", si: 9000, dim: "T", display: "150 min", unitHint: "min", steps: ["2,5 × 60 = 150 min"] },
  { prompt: "Hur många sekunder är 4 h 20 min?", si: 15600, dim: "T", display: "15 600 s", steps: ["4 × 3600 = 14 400", "20 × 60 = 1 200", "Summa 15 600 s"] },
  { prompt: "Hur många timmar är 3 dygn?", si: 259200, dim: "T", display: "72 h", unitHint: "h", steps: ["3 × 24 = 72 h"] }
];

const SPEED_Q = [
  { kind: "v", s: 120, t: 2, su: "km", tu: "h", v: 60, vu: "km/h", prompt: "En bil kör 120 km på 2 timmar. Vilken medelhastighet har bilen?", steps: ["v = s/t", "v = 120/2", "v = 60 km/h"] },
  { kind: "s", v: 7.5, t: 2, vu: "km/h", tu: "h", s: 15, su: "km", prompt: "En löpare springer med 7,5 km/h i 2 timmar. Hur långt springer personen?", steps: ["s = v × t", "s = 7,5 × 2", "s = 15 km"] },
  { kind: "t", s: 150, v: 75, su: "km", vu: "km/h", t: 2, tu: "h", prompt: "En bil kör 150 km med hastigheten 75 km/h. Hur lång tid tar resan?", steps: ["t = s/v", "t = 150/75", "t = 2 h"] },
  { kind: "v", s: 100, t: 20, su: "m", tu: "s", v: 5, vu: "m/s", prompt: "En person går 100 m på 20 s. Bestäm medelhastigheten.", steps: ["v = s/t", "v = 100/20", "v = 5 m/s"] },
  { kind: "s", v: 12, t: 8, vu: "m/s", tu: "s", s: 96, su: "m", prompt: "Ett föremål rör sig med 12 m/s i 8,0 s. Hur långt hinner det?", steps: ["s = vt", "s = 12 × 8,0", "s = 96 m"] },
  { kind: "t", s: 240, v: 16, su: "m", vu: "m/s", t: 15, tu: "s", prompt: "Sträckan är 240 m och hastigheten 16 m/s. Hur lång tid tar det?", steps: ["t = s/v", "t = 240/16", "t = 15 s"] },
  { kind: "v", s: 45, t: 1.5, su: "km", tu: "h", v: 30, vu: "km/h", prompt: "En cyklist cyklar 45 km på 1,5 h. Bestäm medelhastigheten.", steps: ["v = 45/1,5 = 30 km/h"] },
  { kind: "s", v: 90, t: 0.5, vu: "km/h", tu: "h", s: 45, su: "km", prompt: "En bil kör 90 km/h i 0,50 h. Hur långt kommer den?", steps: ["s = 90 × 0,50 = 45 km"] }
];

const CONVERT_Q = [
  { from: 200, fromU: "km/h", to: 200 / 3.6, toU: "m/s", prompt: "Omvandla 200 km/h till m/s.", steps: ["km/h → m/s: dividera med 3,6", "200 / 3,6 = 55,555…", "55,6 m/s (tre värdesiffror)"] },
  { from: 15, fromU: "m/s", to: 54, toU: "km/h", prompt: "Omvandla 15 m/s till km/h.", steps: ["m/s → km/h: multiplicera med 3,6", "15 × 3,6 = 54 km/h"] },
  { from: 72, fromU: "km/h", to: 20, toU: "m/s", prompt: "Omvandla 72 km/h till m/s.", steps: ["72 / 3,6 = 20 m/s"] },
  { from: 10, fromU: "m/s", to: 36, toU: "km/h", prompt: "Omvandla 10 m/s till km/h.", steps: ["10 × 3,6 = 36 km/h"] },
  { from: 108, fromU: "km/h", to: 30, toU: "m/s", prompt: "Omvandla 108 km/h till m/s.", steps: ["108 / 3,6 = 30 m/s"] },
  { from: 25, fromU: "m/s", to: 90, toU: "km/h", prompt: "Omvandla 25 m/s till km/h.", steps: ["25 × 3,6 = 90 km/h"] },
  { from: 36, fromU: "km/h", to: 10, toU: "m/s", prompt: "Omvandla 36 km/h till m/s.", steps: ["36 / 3,6 = 10 m/s"] },
  { from: 5, fromU: "m/s", to: 18, toU: "km/h", prompt: "Omvandla 5,0 m/s till km/h.", steps: ["5,0 × 3,6 = 18 km/h"] },
  { from: 90, fromU: "km/h", to: 25, toU: "m/s", prompt: "Omvandla 90 km/h till m/s.", steps: ["90 / 3,6 = 25 m/s"] },
  { from: 8, fromU: "m/s", to: 28.8, toU: "km/h", prompt: "Omvandla 8,0 m/s till km/h.", steps: ["8,0 × 3,6 = 28,8 km/h"] }
];

const MIXED_U = [
  { prompt: "En bil kör 18 km/h i 2,5 minuter. Hur långt kör bilen?", si: 750, dim: "L", display: "0,75 km eller 750 m", steps: ["2,5 min = 2,5/60 h = 1/24 h", "s = v t = 18 × 2,5/60 = 0,75 km", "0,75 km = 750 m"] },
  { prompt: "En bil kör 72 km/h i 45 sekunder. Hur långt kör den i meter?", si: 900, dim: "L", display: "900 m", steps: ["72 km/h = 72/3,6 = 20 m/s", "s = v t = 20 × 45 = 900 m"] },
  { prompt: "En löpare springer 1609,344 m på 239,4 s. Bestäm medelhastigheten i m/s.", si: 1609.344 / 239.4, dim: "V", display: "6,723 m/s", sig: 4, steps: ["v = s/t", "v = 1609,344 / 239,4 ≈ 6,723 m/s"] },
  { prompt: "En bil kör 150 km på 2,5 h. Bestäm hastigheten.", si: 60 / 3.6, dim: "V", display: "60 km/h", steps: ["v = s/t = 150/2,5 = 60 km/h"] },
  { prompt: "Ett tåg kör 90 km/h i 2,0 minuter. Hur långt kommer det i km?", si: 3000, dim: "L", display: "3,0 km", steps: ["2,0 min = 2/60 h", "s = 90 × 2/60 = 3,0 km"] },
  { prompt: "En cyklist håller 6,0 m/s i 4,0 min. Hur långt kommer hen i meter?", si: 1440, dim: "L", display: "1440 m", steps: ["4,0 min = 240 s", "s = 6,0 × 240 = 1440 m"] },
  { prompt: "Hastigheten är 54 km/h och sträckan 270 m. Hur lång tid tar det i sekunder?", si: 18, dim: "T", display: "18 s", steps: ["54 km/h = 15 m/s", "t = s/v = 270/15 = 18 s"] },
  { prompt: "En bil kör 12 m/s. Vad är det i km/h, och hur långt kommer den på 2,5 min i meter?", si: 1800, dim: "L", display: "1800 m (12 m/s = 43,2 km/h)", steps: ["12 × 3,6 = 43,2 km/h", "2,5 min = 150 s", "s = 12 × 150 = 1800 m"] }
];

const DENSITY_Q = [
  { prompt: "Ett material har massan 500 g och volymen 100 cm³. Bestäm densiteten.", si: 5000, dim: "D", display: "5,0 g/cm³ eller 5000 kg/m³", steps: ["ρ = m/V", "ρ = 500/100 = 5,0 g/cm³", "5,0 g/cm³ = 5000 kg/m³"] },
  { prompt: "ρ = 2,0 g/cm³ och V = 50 cm³. Bestäm massan i gram.", si: 0.1, dim: "M", display: "100 g", steps: ["m = ρV = 2,0 × 50 = 100 g"] },
  { prompt: "m = 8,0 kg och ρ = 2000 kg/m³. Bestäm volymen.", si: 0.004, dim: "Vol", display: "0,0040 m³", steps: ["V = m/ρ = 8,0/2000 = 0,0040 m³"] },
  { prompt: "En kloss har massan 270 g och volymen 100 cm³. Bestäm ρ i g/cm³.", si: 2700, dim: "D", display: "2,70 g/cm³", steps: ["ρ = 270/100 = 2,70 g/cm³"] },
  { prompt: "Vatten har ungefär ρ = 1,00 g/cm³. Vilken massa har 250 cm³ vatten?", si: 0.25, dim: "M", display: "250 g", steps: ["m = 1,00 × 250 = 250 g"] },
  { prompt: "m = 1,8 kg och V = 0,0020 m³. Bestäm densiteten i kg/m³.", si: 900, dim: "D", display: "900 kg/m³", steps: ["ρ = 1,8 / 0,0020 = 900 kg/m³"] }
];

const PROBLEM_Q = [
  { level: "adv", prompt: "En löpare springer 1609,344 m på 239,4 s. Bestäm medelhastigheten i m/s.", si: 1609.344 / 239.4, dim: "V", display: "6,723 m/s", steps: ["Känt: s = 1609,344 m, t = 239,4 s. Sökt: v.", "v = s/t", "v = 1609,344 / 239,4", "v ≈ 6,723 m/s"] },
  { level: "adv", prompt: "En bil kör 72 km/h i 45 s. Hur långt kör den i meter?", si: 900, dim: "L", display: "900 m", steps: ["Känt: v = 72 km/h, t = 45 s. Sökt: s i m.", "72 / 3,6 = 20 m/s", "s = vt = 20 × 45", "s = 900 m"] },
  { level: "adv", prompt: "En bil kör 150 km på 2,5 h. Bestäm hastigheten.", si: 16.6667, dim: "V", display: "60 km/h", steps: ["s = 150 km, t = 2,5 h", "v = s/t = 150/2,5", "v = 60 km/h"] },
  { level: "mid", prompt: "100 m / 20 s. Skriv svaret med enhet.", si: 5, dim: "V", display: "5 m/s", steps: ["v = s/t = 100/20 = 5 m/s"] },
  { level: "adv", prompt: "Ett föremål rör sig 2,4 km på 3,0 min. Bestäm v i m/s.", si: 13.333, dim: "V", display: "13 m/s", steps: ["2,4 km = 2400 m", "3,0 min = 180 s", "v = 2400/180 = 13,333… m/s ≈ 13 m/s med två värdesiffror"] },
  { level: "adv", prompt: "ρ = 800 kg/m³, V = 0,015 m³. Bestäm massan.", si: 12, dim: "M", display: "12 kg", steps: ["m = ρV = 800 × 0,015 = 12 kg"] },
  { level: "mid", prompt: "Omvandla 3,2 MW till watt utan prefix.", si: 3.2e6, dim: "P", display: "3,2 × 10⁶ W", steps: ["M = 10⁶", "3,2 MW = 3,2 × 10⁶ W"] },
  { level: "grund", prompt: "Vad betyder prefixet µ?", type: "text", accepted: ["mikro", "micro", "10^-6", "10−6"], display: "mikro = 10⁻⁶" }
];

function prefixMcBank() {
  const list = [];
  Phy.PREFIXES.filter(function (p) {
    return p.id !== "none";
  }).forEach(function (p) {
    const others = shuffle(
      Phy.PREFIXES.filter(function (x) {
        return x.id !== p.id && x.id !== "none";
      })
    ).slice(0, 3);
    list.push({
      id: "pm-" + p.id,
      area: "prefix",
      type: "mc",
      prompt: "Vad betyder " + p.symbol + "?",
      answer: p.name + " = " + Phy.tenText(p.exp),
      options: shuffle([p.name + " = " + Phy.tenText(p.exp)].concat(others.map(function (x) {
        return x.name + " = " + Phy.tenText(x.exp);
      })))
    });
    list.push({
      id: "pe-" + p.id,
      area: "prefix",
      type: "mc",
      prompt: "Vilket prefix motsvarar " + Phy.tenText(p.exp) + "?",
      answer: p.name + " (" + p.symbol + ")",
      options: shuffle([p.name + " (" + p.symbol + ")"].concat(others.map(function (x) {
        return x.name + " (" + x.symbol + ")";
      })))
    });
  });
  return list;
}

const PREFIX_MC = prefixMcBank();

function unitMcBank() {
  return UNITS.map(function (u) {
    const distractors = shuffle(UNITS.filter(function (x) { return x.id !== u.id; })).slice(0, 3);
    return {
      id: "um-" + u.id,
      area: "units",
      type: "mc",
      prompt: "Vilken SI-enhet har " + u.name.toLowerCase() + "?",
      answer: u.unit,
      options: shuffle([u.unit].concat(distractors.map(function (d) { return d.unit; })))
    };
  }).concat(
    UNITS.map(function (u) {
      const distractors = shuffle(UNITS.filter(function (x) { return x.id !== u.id; })).slice(0, 3);
      return {
        id: "uq-" + u.id,
        area: "units",
        type: "mc",
        prompt: "Vilken storhet mäts i " + u.unit + "?",
        answer: u.name,
        options: shuffle([u.name].concat(distractors.map(function (d) { return d.name; })))
      };
    })
  );
}

const UNIT_MC = unitMcBank();
