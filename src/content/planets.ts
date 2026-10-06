export type Planet = {
  id: string
  name: string
  region: string
  status: 'Secure' | 'Contested' | 'Under Siege' | 'Neutral' | 'Occupied'
  // Procedural planet look: ocean / land / highland colours, atmosphere tint, ocean coverage (0-1), polar ice latitude.
  look: { ocean: string; land: string; high: string; atmosphere: string; lights?: string; oceanLevel?: number; ice?: number }
  description: string
  situation: string
  factions: string[]
  roles: string[]
  locations: string[]
  conflict: string
  event: string
}

export const PLANETS: Planet[] = [
  {
    id: 'coruscant',
    name: 'Coruscant',
    region: 'Core Worlds',
    status: 'Secure',
    look: { ocean: '#1a2230', land: '#2c3340', high: '#6a707c', atmosphere: '#6f9ed0', lights: '#ffd59a', oceanLevel: 0.12, ice: 0.95 },
    description: 'The city-planet heart of the Republic. Senate halls above, the underworld far below.',
    situation: 'Heightened security after an attempted bombing in the Senate district.',
    factions: ['Republic', 'Civilian', 'Criminal'],
    roles: ['Coruscant Guard', 'Senate staff', 'Jedi', 'Underworld'],
    locations: ['Senate District', 'Jedi Temple', 'Lower Levels', '79s Cantina'],
    conflict: 'Separatist sleeper cells in the lower levels.',
    event: 'Lockdown patrols, Tuesday',
  },
  {
    id: 'kamino',
    name: 'Kamino',
    region: 'Wild Space',
    status: 'Secure',
    look: { ocean: '#071a2e', land: '#1d3d52', high: '#4c6f82', atmosphere: '#5cb6e0', oceanLevel: 0.78, ice: 0.9 },
    description: 'An ocean world of endless storms, where every clone begins their story.',
    situation: 'Recruit intake and training at full capacity.',
    factions: ['Republic'],
    roles: ['Recruits', 'Training Officers', 'Medics'],
    locations: ['Tipoca City', 'Training Grounds', 'Barracks'],
    conflict: 'Rumors of a Separatist probe beyond the storm line.',
    event: 'Recruit graduation, weekly',
  },
  {
    id: 'geonosis',
    name: 'Geonosis',
    region: 'Outer Rim',
    status: 'Contested',
    look: { ocean: '#5a2a16', land: '#8e4a2a', high: '#d2905c', atmosphere: '#e08a5a', lights: '#ff9a5a', oceanLevel: 0.2, ice: 0.98 },
    description: 'Red deserts and droid foundries. Where the war began.',
    situation: 'Foundries rebuilding beneath the surface.',
    factions: ['Republic', 'Separatist'],
    roles: ['Assault battalions', 'Engineers', 'Tactical droids'],
    locations: ['Foundry Complex', 'Petranaki Arena', 'Spire Fields'],
    conflict: 'Republic push to destroy the rebuilt foundries.',
    event: 'Foundry raid, campaign event',
  },
  {
    id: 'naboo',
    name: 'Naboo',
    region: 'Mid Rim',
    status: 'Secure',
    look: { ocean: '#0a2a4a', land: '#2d5a33', high: '#c9d3c0', atmosphere: '#6fb6e8', oceanLevel: 0.52, ice: 0.74 },
    description: 'Green hills and royal cities. A peaceful world with powerful friends.',
    situation: 'Diplomatic summit planned at the palace.',
    factions: ['Republic', 'Civilian'],
    roles: ['Diplomats', 'Royal Security', 'Traders'],
    locations: ['Theed Palace', 'Lake Country', 'Spaceport'],
    conflict: 'Assassination plots against visiting senators.',
    event: 'Diplomatic escort, monthly',
  },
  {
    id: 'tatooine',
    name: 'Tatooine',
    region: 'Outer Rim',
    status: 'Neutral',
    look: { ocean: '#8a6a3a', land: '#b08a52', high: '#e2c89a', atmosphere: '#e9c58a', lights: '#ffd59a', oceanLevel: 0.05, ice: 0.99 },
    description: 'Twin suns, sand, and scum. The Republic has little reach here.',
    situation: 'Crime syndicates bidding for control of the spaceport.',
    factions: ['Civilian', 'Criminal', 'Bounty Hunters'],
    roles: ['Smugglers', 'Bounty Hunters', 'Merchants'],
    locations: ['Mos Espa', 'Dune Sea', 'Cantina'],
    conflict: 'Syndicate war over spice routes.',
    event: 'Podrace night, weekly',
  },
  {
    id: 'christophsis',
    name: 'Christophsis',
    region: 'Outer Rim',
    status: 'Under Siege',
    look: { ocean: '#0a1a44', land: '#2a3f8a', high: '#9fb6ea', atmosphere: '#6a94e8', lights: '#bfd2ff', oceanLevel: 0.46, ice: 0.8 },
    description: 'Crystal cities glittering under siege. The front line of the current campaign.',
    situation: 'Separatist assault on Republic positions in progress.',
    factions: ['Republic', 'Separatist'],
    roles: ['Front-line battalions', 'Jedi', 'Droid army'],
    locations: ['Crystal City', 'Command Post', 'Orbital Blockade'],
    conflict: 'The Battle of Christophsis. Outcome undecided.',
    event: 'Battle of Christophsis, LIVE',
  },
  {
    id: 'felucia',
    name: 'Felucia',
    region: 'Outer Rim',
    status: 'Contested',
    look: { ocean: '#1a0a2a', land: '#4a2a5a', high: '#c75a7a', atmosphere: '#d88ac8', oceanLevel: 0.35, ice: 0.97 },
    description: 'A fungal jungle world where the planet itself fights back.',
    situation: 'Medical stations cut off by Separatist patrols.',
    factions: ['Republic', 'Separatist', 'Civilian'],
    roles: ['Medics', 'Scouts', 'Farmers'],
    locations: ['Medical Station', 'Jungle Canopy', 'Farm Villages'],
    conflict: 'Securing the medical station before reinforcements arrive.',
    event: 'Rescue operation, campaign event',
  },
  {
    id: 'mandalore',
    name: 'Mandalore',
    region: 'Outer Rim',
    status: 'Neutral',
    look: { ocean: '#2a2a2e', land: '#4a4a50', high: '#9a9aa2', atmosphere: '#8ea0c0', lights: '#dfe8ff', oceanLevel: 0.3, ice: 0.85 },
    description: 'A neutral world of domed cities and warrior traditions held in a fragile peace.',
    situation: 'Neutral government under pressure from radical clans.',
    factions: ['Civilian', 'Independent'],
    roles: ['Diplomats', 'Clan warriors', 'Traders'],
    locations: ['Sundari', 'Wastelands', 'Royal Palace'],
    conflict: 'Political unrest threatening neutrality.',
    event: 'Neutral summit, seasonal',
  },
]
