import type { ProfileConfig } from './profile';

export function generateVCard(profile: ProfileConfig) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
    `TITLE:${profile.title}`,
    `ORG:${profile.company}`,
    profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : undefined,
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : undefined,
    profile.website ? `URL:${profile.website}` : undefined,
    'END:VCARD'
  ].filter(Boolean) as string[];
  return lines.join('\n');
}
