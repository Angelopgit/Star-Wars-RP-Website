// Central place for links and names. Swap the placeholder URLs when they are ready.
export const SITE = {
  serverName: 'Squad Gaming Star Wars RP',
  community: 'Squad Gaming Community',
  game: 'S&box',
  discordUrl: 'https://discord.gg/your-invite', // TODO: real Discord invite
  // S&box connect link or server page. TODO: replace once the server is public.
  playUrl: '#how-to-play',
  rulesUrl: '#philosophy',
}

export const DISCLAIMER_SHORT =
  'Non-profit fan project. Not affiliated with Lucasfilm, Disney, or Facepunch Studios.'

export const DISCLAIMER_FULL =
  'This is an unofficial, non-profit FAN PROJECT and FAN WEBSITE made by Squad Gaming Community purely for fun and entertainment. ' +
  'It is not affiliated with, endorsed by, sponsored by, or approved by Lucasfilm Ltd., The Walt Disney Company, or Facepunch Studios. ' +
  'Star Wars and all related names, characters, and marks are trademarks of Lucasfilm Ltd. and/or Disney. S&box is a trademark of Facepunch Studios. ' +
  'No money is made from this project, nothing is sold, and all 3D visuals on this site are original stylized artwork.'

export type NavGroup = { label: string; href: string; items?: { label: string; href: string }[] }

export const NAV: NavGroup[] = [
  { label: 'Home', href: '#top' },
  {
    label: 'About',
    href: '#about',
    items: [
      { label: 'Our Vision', href: '#about' },
      { label: 'Roleplay', href: '#philosophy' },
      { label: 'Features', href: '#features' },
    ],
  },
  {
    label: 'Galaxy',
    href: '#galaxy',
    items: [
      { label: 'Planets', href: '#galaxy' },
      { label: 'Factions', href: '#factions' },
      { label: 'Timeline', href: '#events' },
    ],
  },
  {
    label: 'Play',
    href: '#how-to-play',
    items: [
      { label: 'Getting Started', href: '#how-to-play' },
      { label: 'Character Creation', href: '#character' },
      { label: 'Rules', href: '#philosophy' },
    ],
  },
  {
    label: 'Community',
    href: '#community',
    items: [
      { label: 'Discord', href: '#community' },
      { label: 'Events', href: '#events' },
      { label: 'Media', href: '#media' },
    ],
  },
  {
    label: 'Development',
    href: '#roadmap',
    items: [
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'News', href: '#news' },
      { label: 'Developers', href: '#community' },
    ],
  },
]
