export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/profile/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <main className="antialiased bg-animated-gradient min-h-screen flex items-center justify-center px-4 py-8">
        <div className="glass-card rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Profile Not Found</h1>
          <p className="text-slate-600 dark:text-gray-300">The requested profile could not be found.</p>
        </div>
      </main>
    );
  }
  const profile = await res.json();

  return (
    <main className="antialiased bg-animated-gradient min-h-screen flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-md mx-auto glass-card rounded-3xl overflow-hidden animate-fade-in">
        <div className="p-8">
          {/* Profile Section */}
          <div className="text-center">
            {profile.avatar && (
              <img 
                className="w-32 h-32 rounded-full mx-auto ring-4 ring-cyan-500/20 dark:ring-cyan-500/50 object-cover shadow-lg animate-slide-up delay-100" 
                src={profile.avatar} 
                alt={profile.name} 
              />
            )}
            <h1 className="text-3xl font-bold mt-6 text-slate-900 dark:text-gray-100 animate-slide-up delay-200">{profile.name}</h1>
            <p className="text-lg text-cyan-600 dark:text-cyan-400 mt-1 font-medium animate-slide-up delay-300">{profile.title}</p>
            <p className="text-slate-600 dark:text-gray-300 mt-2 text-sm leading-relaxed animate-slide-up delay-400">{profile.company}{profile.location ? ` • ${profile.location}` : ''}</p>
          </div>

          {/* Links Section */}
          <div className="mt-10 animate-slide-up delay-500">
            <h2 className="text-center text-sm font-semibold text-slate-500 dark:text-gray-400 mb-4">Connect with me</h2>
            <div className="space-y-4">
              {profile.socials && profile.socials.length > 0 ? (
                profile.socials.map((s: { label: string; url: string }) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full bg-slate-100 hover:bg-slate-200 hover:text-slate-800 dark:bg-gray-700/50 dark:hover:bg-gray-600/80 text-slate-700 dark:text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center">
                      <span className="w-6 h-6 mr-4 inline-flex items-center justify-center rounded bg-white/60 dark:bg-white/10 text-xs font-bold">{s.label[0]}</span>
                      <span>{s.label}</span>
                    </div>
                    <svg className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p>No social links added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 animate-slide-up delay-600">
            <a href={`/api/vcard?id=${encodeURIComponent(id)}`} download="contact.vcf" className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white dark:hover:bg-cyan-500 font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50">
              <svg className="inline-block w-6 h-6 mr-2 -mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Save to Contacts
            </a>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center py-4 border-t border-slate-200 dark:border-gray-700/50 animate-slide-up delay-700">
          <p className="text-xs text-slate-500 dark:text-gray-400">© 2025 {profile.name}. All Rights Reserved.</p>
        </div>
      </div>
    </main>
  );
}
