import { describe, it, expect } from 'vitest';
import { generateVCard } from './vcard';

describe('generateVCard', () => {
  it('creates a basic vCard 3.0', () => {
    const vcf = generateVCard({
      name: 'Jane Doe',
      title: 'Solutions Architect',
      company: 'AWS',
      email: 'jane@aws.com',
      phone: '+1 555 000 1111',
      socials: []
    });
    expect(vcf).toContain('BEGIN:VCARD');
    expect(vcf).toContain('VERSION:3.0');
    expect(vcf).toContain('FN:Jane Doe');
    expect(vcf).toContain('TITLE:Solutions Architect');
    expect(vcf).toContain('ORG:AWS');
    expect(vcf).toContain('EMAIL;TYPE=INTERNET:jane@aws.com');
    expect(vcf).toContain('TEL;TYPE=CELL:+1 555 000 1111');
    expect(vcf).toContain('END:VCARD');
  });
});
