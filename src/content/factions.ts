export type Faction = {
  id: string
  name: string
  tagline: string
  color: string
  glow: string
  units: string[]
  description: string
  role: string
  gameplay: string[]
  howToJoin: string
  progression: string
  ranks: string[]
}

export const FACTIONS: Faction[] = [
  {
    id: 'republic',
    name: 'Galactic Republic',
    tagline: 'For the Republic. For each other.',
    color: '#5cc8ff',
    glow: 'rgba(92,200,255,0.45)',
    units: ['Clone Troopers', 'Jedi Order', 'Republic Navy', 'Republic Command', 'Specialized Units'],
    description:
      'The backbone of the war effort. Battalions of clone troopers, Jedi generals, and naval crews hold the line across a galaxy on fire.',
    role: 'Defend Republic worlds, push back Separatist offensives, and keep the fleet in the fight.',
    gameplay: [
      'Squad deployments and planetside operations',
      'Venator-class shipboard life, briefings, and drills',
      'Battalion identity, callsigns, and traditions',
      'Jedi training, temple duties, and command roles',
    ],
    howToJoin: 'Every new player can enlist as a clone recruit. Battalion and Jedi applications open through Discord.',
    progression: 'Earned through training, deployments, leadership, and the trust of your squad.',
    ranks: ['Recruit', 'Trooper', 'Specialist', 'Sergeant', 'Lieutenant', 'Captain', 'Commander'],
  },
  {
    id: 'separatist',
    name: 'Separatist Alliance',
    tagline: 'Roger, roger.',
    color: '#ff5a4f',
    glow: 'rgba(255,90,79,0.45)',
    units: ['B1 Battle Droids', 'B2 Super Battle Droids', 'Droidekas', 'Tactical Droids', 'Separatist Leadership'],
    description:
      'An endless tide of machines directed by cold strategists. Separatist players drive the war forward and give every battle real stakes.',
    role: 'Launch assaults, seize worlds, and outthink Republic command during galactic events.',
    gameplay: [
      'Event-driven invasions and sieges',
      'Tactical droid command of droid formations',
      'Leadership intrigue and Separatist council plots',
      'Comedic B1 roleplay when the moment calls for it',
    ],
    howToJoin: 'Separatist slots open for events and selected regular roles. Apply through Discord.',
    progression: 'Unlock heavier droid chassis and command roles by leading successful operations.',
    ranks: ['B1 Unit', 'B1 Squad Leader', 'B2 Unit', 'Droideka', 'Tactical Droid', 'Strategist', 'Council'],
  },
  {
    id: 'neutral',
    name: 'Civilian & Neutral',
    tagline: 'The war is not the only story.',
    color: '#ffc457',
    glow: 'rgba(255,196,87,0.45)',
    units: ['Civilians', 'Traders', 'Merchants', 'Criminals', 'Bounty Hunters', 'Independent Organizations'],
    description:
      'Life goes on between the battles. Cantina owners, smugglers, merchants, and hunters fill the galaxy with color and consequence.',
    role: 'Run businesses, broker deals, chase bounties, and decide which side you profit from.',
    gameplay: [
      'Player-run shops and an evolving economy',
      'Bounty contracts and criminal syndicates',
      'Smuggling runs between contested worlds',
      'Civilian stories caught in the middle of the war',
    ],
    howToJoin: 'Open to everyone from day one. Create a civilian character and make your own way.',
    progression: 'Grow your reputation, wealth, crew, and influence in the underworld or the open market.',
    ranks: ['Drifter', 'Local', 'Established', 'Respected', 'Influential', 'Kingpin'],
  },
  {
    id: 'specops',
    name: 'Special Operations',
    tagline: 'Officially, we were never here.',
    color: '#9b8cff',
    glow: 'rgba(155,140,255,0.45)',
    units: ['ARC Troopers', 'Clone Commandos', 'Republic Intelligence', 'Jedi Special Operations'],
    description:
      'Elite operatives sent where the main battle lines cannot go. Covert insertions, sabotage, recon, and high-value targets.',
    role: 'Run classified missions that shape the outcome of galactic events before the main assault lands.',
    gameplay: [
      'Covert infiltration and sabotage missions',
      'Small-team commando operations',
      'Intelligence gathering that changes event outcomes',
      'Joint operations with Jedi special forces',
    ],
    howToJoin: 'Invite or application only, for experienced players with a strong roleplay record.',
    progression: 'Selection, trials, and proven performance in the field. Trust is the real rank.',
    ranks: ['Candidate', 'Operative', 'Senior Operative', 'Team Lead', 'Section Chief'],
  },
]

// Battalion color schemes used by the 3D clone troopers and the battalion chips.
export const BATTALIONS = [
  { name: '501st', color: '#3d7bff' },
  { name: '212th', color: '#ff8a2a' },
  { name: '327th', color: '#f2c230' },
  { name: 'Coruscant Guard', color: '#d6313b' },
  { name: '41st', color: '#4f9a4a' },
  { name: '104th', color: '#8a96a8' },
]
