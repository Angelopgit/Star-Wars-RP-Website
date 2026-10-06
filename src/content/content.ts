export const ABOUT_POINTS = [
  {
    title: 'What it is',
    body: 'A persistent Clone Wars roleplay server for S&box, where every player is a character with a name, a history, and a place in the war.',
  },
  {
    title: 'Where it comes from',
    body: 'Inspired by the classic Garry’s Mod Star Wars RP servers that so many of us grew up on: the battalions, the briefings, the late-night events.',
  },
  {
    title: 'Why S&box',
    body: 'S&box gives us a modern engine, better physics, real UI, and the freedom to build systems GMod could never support. Same spirit, new foundation.',
  },
  {
    title: 'Our vision',
    body: 'A living galaxy that changes because of what players do. Wars are won and lost. Characters rise, fall, and are remembered.',
  },
  {
    title: 'What is different',
    body: 'Progression earned through roleplay, not grinding. Leadership that serves the squad. Events with real consequences across the map.',
  },
  {
    title: 'Community first',
    body: 'Built by Squad Gaming Community, for the people who play it. Your feedback shapes the roadmap.',
  },
]

export const CHARACTER_ROLES = [
  { name: 'Clone Trooper', note: 'With your own name, armor, and scars.' },
  { name: 'Jedi Padawan', note: 'Train under a master. Find your path.' },
  { name: 'Republic Officer', note: 'Lead from the bridge or the front.' },
  { name: 'Bounty Hunter', note: 'Every contract has a price.' },
  { name: 'Civilian', note: 'Ordinary life in an extraordinary war.' },
  { name: 'Criminal', note: 'The underworld always has openings.' },
  { name: 'Trader', note: 'Profit from every side of the war.' },
  { name: 'Droid Commander', note: 'Calculate. Advance. Overwhelm.' },
]

export const CHARACTER_SYSTEMS = [
  { title: 'Character Creation', body: 'Name, background, appearance, and personality. Your character, not a number.' },
  { title: 'Customization', body: 'Armor markings, battalion colors, helmets, and personal gear.' },
  { title: 'Careers', body: 'Soldier, medic, pilot, engineer, merchant, hunter. Change paths as your story grows.' },
  { title: 'Ranks', body: 'Earned through leadership and trust, not hours played.' },
  { title: 'Specializations', body: 'Heavy, medic, engineer, marksman, and more unique kits.' },
  { title: 'Equipment', body: 'Loadouts that reflect your role, rank, and experience.' },
  { title: 'Personal Progression', body: 'Your record, medals, and reputation follow you.' },
  { title: 'Player Stories', body: 'Arcs written by players, carried forward by staff events.' },
]

export const PROGRESSION = {
  steps: ['Recruit', 'Clone Trooper', 'Specialist', 'Sergeant', 'Command'],
  specialists: ['Heavy', 'Medic', 'Engineer', 'Marksman'],
  earnedBy: ['Roleplay', 'Leadership', 'Participation', 'Experience'],
}

export type FeatureGroup = { id: string; title: string; kicker: string; color: string; items: { name: string; blurb: string }[] }

export const FEATURES: FeatureGroup[] = [
  {
    id: 'combat',
    title: 'Combat',
    kicker: 'Feel every shot',
    color: '#ff5a4f',
    items: [
      { name: 'Lightsaber combat', blurb: 'Skill-based duels with weight and timing.' },
      { name: 'Blaster combat', blurb: 'Punchy, readable firefights built for squads.' },
      { name: 'Vehicles', blurb: 'Gunships, walkers, and speeders on the battlefield.' },
      { name: 'Large-scale battles', blurb: 'Battalion versus droid army event warfare.' },
      { name: 'Space combat', blurb: 'Planned where the engine allows it.' },
      { name: 'Destructible environments', blurb: 'Cover that does not last forever.' },
    ],
  },
  {
    id: 'roleplay',
    title: 'Roleplay',
    kicker: 'Live the story',
    color: '#5cc8ff',
    items: [
      { name: 'Character system', blurb: 'Persistent characters with history.' },
      { name: 'Faction & rank systems', blurb: 'Structure without the bureaucracy.' },
      { name: 'Economy & businesses', blurb: 'Player-run shops, trade, and contracts.' },
      { name: 'Inventory & jobs', blurb: 'Gear, careers, and daily life.' },
      { name: 'Missions & events', blurb: 'Staff-run and player-run operations.' },
      { name: 'Persistence', blurb: 'What you do today still matters tomorrow.' },
    ],
  },
  {
    id: 'technology',
    title: 'Technology',
    kicker: 'Built on S&box',
    color: '#9b8cff',
    items: [
      { name: 'S&box engine', blurb: 'A modern foundation for a classic genre.' },
      { name: 'Modern graphics', blurb: 'Lighting and materials GMod could not dream of.' },
      { name: 'Physics', blurb: 'Grounded, reactive, and fun.' },
      { name: 'Advanced UI', blurb: 'Holographic HUDs and clean menus.' },
      { name: 'Custom systems', blurb: 'Built in-house for this server.' },
      { name: 'Dynamic environments', blurb: 'Worlds that change with the war.' },
    ],
  },
]

export const EVENT_FEATURED = {
  label: 'Galactic Event',
  name: 'Battle of Christophsis',
  transmission: 'Separatist forces have launched an assault on Republic positions.',
  objective: 'Hold the crystal city command post until the orbital blockade is broken.',
  situation: [
    { side: 'Republic', strength: 46, color: '#5cc8ff' },
    { side: 'Separatist', strength: 54, color: '#ff5a4f' },
  ],
  involvement: 'Front-line battalions defend the city. Special operations target the blockade. Civilians evacuate, or profit.',
  rewards: 'Campaign medals, battalion honors, rank recommendations, and a permanent mark on the galaxy map.',
  outcomes: [
    { if: 'If the Republic loses', then: 'Christophsis falls. Supply lines to the Outer Rim are cut and new fronts open.' },
    { if: 'If the Republic wins', then: 'The siege breaks. The campaign pushes deeper into Separatist space.' },
  ],
}

export const PHILOSOPHY = {
  value: [
    'Player-driven stories',
    'Character development',
    'Immersion',
    'Fair leadership',
    'Serious roleplay when appropriate',
    'Fun over unnecessary bureaucracy',
    'Community events',
    'Creativity',
  ],
  discourage: [
    'Rank abuse',
    'Toxic leadership',
    'Powergaming',
    'Metagaming',
    'Random deathmatching',
    'Administrative abuse',
  ],
}

export const COMMUNITY = [
  { title: 'Discord', body: 'The hub for everything: applications, events, and the people.', icon: 'discord' },
  { title: 'Staff Team', body: 'Approachable staff who play the game too.', icon: 'staff' },
  { title: 'Community Events', body: 'Movie nights, tournaments, and campaign finales.', icon: 'events' },
  { title: 'Player Achievements', body: 'Medals, honors, and hall-of-fame moments.', icon: 'medal' },
  { title: 'Screenshots & Videos', body: 'Share your best moments with the galaxy.', icon: 'camera' },
  { title: 'Community Creations', body: 'Art, stories, and builds made by players.', icon: 'spark' },
  { title: 'Development Updates', body: 'Follow the build as it happens.', icon: 'code' },
]

export type RoadmapPhase = { phase: string; title: string; status: 'In Progress' | 'Next' | 'Planned'; items: string[] }

export const ROADMAP: RoadmapPhase[] = [
  { phase: 'Phase I', title: 'Foundation', status: 'In Progress', items: ['Core framework', 'Character system', 'Faction system', 'Basic combat', 'First map'] },
  { phase: 'Phase II', title: 'Galactic War', status: 'Next', items: ['Republic', 'Separatists', 'Vehicles', 'Missions', 'Events'] },
  { phase: 'Phase III', title: 'Expansion', status: 'Planned', items: ['New planets', 'New factions', 'Advanced progression', 'Custom events', 'Additional gameplay systems'] },
]

export const MEDIA_CATEGORIES = ['All', 'Battlefield', 'Coruscant', 'Jedi', 'Clone Army', 'Separatists', 'Community'] as const
export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]

// Drop real screenshots into /public/media and set `src` (e.g. 'media/battle-01.jpg').
// `video: true` marks a clip slot. Without src a stylized placeholder is shown.
export const MEDIA: { title: string; category: Exclude<MediaCategory, 'All'>; src?: string; video?: boolean; hue: number }[] = [
  { title: 'Holding the ridge', category: 'Battlefield', hue: 12 },
  { title: 'Senate district at dusk', category: 'Coruscant', hue: 35 },
  { title: 'Temple training hall', category: 'Jedi', hue: 200 },
  { title: 'Battalion formation', category: 'Clone Army', hue: 215, video: true },
  { title: 'Droid line advancing', category: 'Separatists', hue: 0 },
  { title: 'Community movie night', category: 'Community', hue: 265 },
  { title: 'Gunship drop', category: 'Battlefield', hue: 22, video: true },
  { title: 'Lower levels patrol', category: 'Coruscant', hue: 290 },
  { title: 'Duel at the crystal spires', category: 'Jedi', hue: 230 },
]

export const NEWS = [
  { tag: 'Dev Update', title: 'Dev Update #14: Clone Armor System', date: 'Coming soon', excerpt: 'Modular armor, battalion markings, and the first look at personal customization.' },
  { tag: 'Reveal', title: 'New Map Reveal', date: 'Coming soon', excerpt: 'A first look at the crystal city of Christophsis, built for large battles.' },
  { tag: 'Reveal', title: 'New Faction Reveal', date: 'Coming soon', excerpt: 'Meet the faction joining the war in Phase II.' },
  { tag: 'Update', title: 'Combat Update', date: 'Coming soon', excerpt: 'Blaster feel, cover, and squad-level combat roles.' },
  { tag: 'Diary', title: 'Developer Diary', date: 'Coming soon', excerpt: 'Why we are rebuilding Star Wars RP from scratch in S&box.' },
  { tag: 'Community', title: 'Community Event', date: 'Coming soon', excerpt: 'Our first community night. Bring your squad.' },
  { tag: 'Update', title: 'New Vehicle', date: 'Coming soon', excerpt: 'The first gunship takes flight.' },
  { tag: 'Roadmap', title: 'Roadmap Update', date: 'Coming soon', excerpt: 'Where Phase I stands and what comes next.' },
]

export const HOW_TO_PLAY = [
  { title: 'Join Discord', body: 'Meet the community and get the latest server info.' },
  { title: 'Read the Rules', body: 'Know what good roleplay looks like here.' },
  { title: 'Create Your Character', body: 'Pick a name, a look, and a background.' },
  { title: 'Choose Your Faction', body: 'Republic, Separatist, civilian, or something else.' },
  { title: 'Join the Server', body: 'Launch S&box and connect.' },
  { title: 'Begin Your Story', body: 'Report for your first briefing.' },
]

export const WHY_US = [
  { title: 'Built for S&box', body: 'A modern foundation for a classic RP experience.' },
  { title: 'Player-Driven', body: 'Your actions can influence the story.' },
  { title: 'Living Galaxy', body: 'Events, wars, and stories continuously evolve.' },
  { title: 'Deep Roleplay', body: 'Characters are more than their rank.' },
  { title: 'Community First', body: 'Built around the people who play it.' },
  { title: 'Constantly Evolving', body: 'New content, factions, planets, and systems.' },
]
