"use client";
import { useEffect, useState } from 'react';
import { MockAuthenticator } from '@/components/MockAuthenticator';
import { mockAuth } from '@/lib/mockAuth';
import type { ProfileConfig, SocialLink } from '@/lib/profile';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="antialiased bg-animated-gradient min-h-screen">
      <MockAuthenticator>
        <DashboardInner />
      </MockAuthenticator>
    </main>
  );
}

function DashboardInner() {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const currentUser = await mockAuth.getCurrentUser();
      setUser(currentUser);
    };
    getUser();
  }, []);
  
  const signOut = async () => {
    await mockAuth.signOut();
    window.location.href = '/';
  };
  const [profile, setProfile] = useState<ProfileConfig | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const session = await mockAuth.fetchAuthSession();
        const token = session?.tokens?.idToken?.toString();
        if (!token) return;
        
        // Initialize profile if missing
        await fetch('/api/profile', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        const res = await fetch('/api/profile', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        const profileData = await res.json();
        setProfile(profileData);
        setSocials(profileData.socials || []);
        setAvatarPreview(profileData.avatar || null);
        
        // Set public URL
        const email = user?.signInDetails?.loginId || profileData.email;
        if (email) {
          const baseUrl = window.location.origin;
          setPublicUrl(`${baseUrl}/p/${encodeURIComponent(email)}`);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const addSocialLink = () => {
    setSocials([...socials, { label: '', url: '' }]);
  };

  const updateSocialLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...socials];
    updated[index][field] = value;
    setSocials(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const form = new FormData(e.currentTarget);
      const session = await mockAuth.fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) return;

      const updatedProfile = {
        name: form.get('name') as string,
        title: form.get('title') as string,
        company: form.get('company') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        location: form.get('location') as string,
        website: form.get('website') as string,
        avatar: avatarPreview || undefined,
        socials: socials.filter(s => s.label && s.url)
      };

      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedProfile)
      });
      
      setProfile(updatedProfile);
      setSaved(true);
      
      // Reset success state after 5 seconds
      setTimeout(() => setSaved(false), 5000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-3xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="text-center mt-4 text-slate-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100">Dashboard</h1>
            <p className="text-slate-600 dark:text-gray-300 mt-1">Manage your digital business card</p>
          </div>
          <div className="flex items-center gap-4">
            {publicUrl && (
              <Link href={publicUrl} target="_blank" className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7v10" />
                </svg>
                View Public
              </Link>
            )}
            <button onClick={signOut} className="inline-flex items-center px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-200 rounded-xl transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo */}
        <div className="glass-card rounded-3xl p-8 animate-slide-up delay-100">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-6">Profile Photo</h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-500/20 dark:ring-cyan-500/50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center ring-4 ring-slate-200 dark:ring-gray-600">
                  <svg className="w-12 h-12 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 dark:file:bg-cyan-900/20 dark:file:text-cyan-400 dark:hover:file:bg-cyan-900/40 file:transition-colors"
                />
              </label>
              <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                Upload a square image for best results. Max 5MB.
              </p>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => setAvatarPreview(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="glass-card rounded-3xl p-8 animate-slide-up delay-200">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'name', label: 'Full Name', type: 'text', required: true },
              { name: 'title', label: 'Job Title', type: 'text', required: true },
              { name: 'company', label: 'Company', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phone', label: 'Phone', type: 'tel', required: false },
              { name: 'location', label: 'Location', type: 'text', required: false },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  defaultValue={profile?.[field.name as keyof ProfileConfig] as string || ''}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                name="website"
                type="url"
                placeholder="https://example.com"
                defaultValue={profile?.website || ''}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card rounded-3xl p-8 animate-slide-up delay-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">Social Links</h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Link
            </button>
          </div>
          <div className="space-y-4">
            {socials.map((social, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    placeholder="LinkedIn, Twitter, etc."
                    value={social.label}
                    onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={social.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {socials.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p>No social links added yet</p>
                <p className="text-sm">Click "Add Link" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="glass-card rounded-3xl p-6 animate-slide-up delay-400">
          {saved ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-2">Profile Updated!</h3>
              <p className="text-slate-600 dark:text-gray-300 mb-6">Your changes have been saved successfully.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={publicUrl}
                  target="_blank"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7v10" />
                  </svg>
                  View Public Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-200 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-gray-300">
                  Your public profile: <span className="font-mono text-cyan-600">{publicUrl}</span>
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
