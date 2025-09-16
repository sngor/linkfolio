export interface SocialLink {
  label: string;
  url: string;
}

export interface ProfileConfig {
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar?: string;
  socials: SocialLink[];
}

export const profile: ProfileConfig = {
  name: 'Your Name',
  title: 'Cloud Engineer',
  company: 'Your Company',
  email: 'you@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Los Angeles, CA',
  website: 'https://example.com',
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/your-handle' },
    { label: 'X', url: 'https://x.com/your-handle' },
    { label: 'Email', url: 'mailto:you@example.com' }
  ]
};
