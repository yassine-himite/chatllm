export const MOCK_USER = {
  name: 'Yassine',
  email: 'yassine@twelo.ai',
  initials: 'Y',
};

export const MOCK_THREADS = [
  { id: '1', title: 'Wat is kwantumcomputing precies?', date: 'Vandaag' },
  { id: '2', title: 'Schrijf een businessplan voor mijn startup', date: 'Vandaag' },
  { id: '3', title: 'Python script voor web scraping', date: 'Vandaag' },
  { id: '4', title: 'Vertaal dit Engelse document naar NL', date: 'Gisteren' },
  { id: '5', title: 'Maak een samenvatting van dit artikel', date: 'Gisteren' },
  { id: '6', title: 'Hoe werkt het menselijk brein?', date: 'Gisteren' },
  { id: '7', title: 'Beste aanpak voor microservices', date: '3 dagen geleden' },
];

export const MOCK_MESSAGES = [
  {
    id: '1',
    role: 'user' as const,
    content: 'Wat is kwantumcomputing precies en hoe verschilt het van klassieke computers?',
  },
  {
    id: '2',
    role: 'ai' as const,
    content: `Kwantumcomputing is een vorm van berekening die gebruikmaakt van kwantummechanische verschijnselen zoals **superpositie** en **verstrengeling**.

In tegenstelling tot klassieke computers die met bits werken (0 of 1), gebruikt een kwantumcomputer **qubits** die tegelijkertijd 0 én 1 kunnen zijn. Dit maakt het mogelijk om enorme hoeveelheden berekeningen parallel uit te voeren.

**Belangrijkste verschillen:**
- Klassieke bits: altijd 0 of 1
- Qubits: kunnen superpositie zijn van 0 en 1
- Kwantumverstrengeling maakt qubits afhankelijk van elkaar
- Exponentieel sneller voor specifieke problemen (cryptografie, optimalisatie, simulaties)`,
  },
  {
    id: '3',
    role: 'user' as const,
    content: 'Welke bedrijven zijn koploper op dit gebied?',
  },
  {
    id: '4',
    role: 'ai' as const,
    content: `De grootste spelers in kwantumcomputing zijn:

**Tech-giganten:**
- **IBM** — heeft het IBM Quantum Network en biedt cloudtoegang tot kwantumcomputers
- **Google** — toonde in 2019 kwantumsuprematie aan met hun Sycamore-processor
- **Microsoft** — focust op topologische qubits en Azure Quantum

**Gespecialiseerde startups:**
- **IonQ** — gebruikt ion-trap technologie, beursgenoteerd
- **Rigetti Computing** — ontwikkelt hybride kwantum-klassieke systemen
- **D-Wave** — pionier in kwantumoptimalisatie

Nederland heeft ook een sterke positie via **QuTech** (TU Delft & TNO).`,
  },
];

export const MOCK_AZURE_KEYS = [
  { id: '1', name: 'Azure GPT-4o', deploymentName: 'gpt-4o' },
  { id: '2', name: 'Azure GPT-4o Mini', deploymentName: 'gpt-4o-mini' },
];

export const EXAMPLE_PROMPTS = [
  { emoji: '📊', text: 'Analyseer een dataset' },
  { emoji: '✍️', text: 'Schrijf een e-mail' },
  { emoji: '🔍', text: 'Onderzoek een onderwerp' },
  { emoji: '💡', text: 'Brainstorm ideeën' },
  { emoji: '🌐', text: 'Vertaal een tekst' },
  { emoji: '📝', text: 'Maak een samenvatting' },
];
