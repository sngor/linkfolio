import { promises as fs } from 'fs';
import path from 'path';
import type { ProfileConfig } from './profile';

const DATA_PATH = path.join(process.cwd(), 'data', 'profiles.json');

type Profiles = Record<string, ProfileConfig>;

async function ensureFile() {
  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, JSON.stringify({}, null, 2), 'utf8');
  }
}

export async function getProfiles(): Promise<Profiles> {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw || '{}');
}

export async function getProfile(id: string): Promise<ProfileConfig | null> {
  const all = await getProfiles();
  return all[id] ?? null;
}

export async function saveProfile(id: string, profile: ProfileConfig) {
  const all = await getProfiles();
  all[id] = profile;
  await fs.writeFile(DATA_PATH, JSON.stringify(all, null, 2), 'utf8');
}
