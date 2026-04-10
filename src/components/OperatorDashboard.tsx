import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Zap, Target, History, Lock, MapPin, Award } from 'lucide-react';
import { useOperator } from '../hooks/useOperator';
import { useLanguage } from '../contexts/LanguageContext';
import { KineticBolt, KineticZap, KineticCrosshair } from './KineticIcons';

interface OperatorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeaderboard?: () => void;
}

export default function OperatorDashboard({ isOpen, onClose, onOpenLeaderboard }: OperatorDashboardProps) {
  const { stats, loading } = useOperator();
  const { t, locale } = useLanguage();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[300] leather-navy overflow-y-auto no-scrollbar flex flex-col"
    >
      {/* Header */}
      <header className="p-8 flex justify-between items-center sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(172,44,0,0.5)]">
            <Shield className="text-on-primary" size={24} />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-black italic tracking-tighter text-white uppercase">COMMAND_HUB</h2>
            <p className="font-mono text-[10px] text-primary font-bold tracking-[0.2em]">OPERATOR_ID: {Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/10 text-white p-4 rounded-2xl hover:bg-primary transition-colors border border-white/10"
        >
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: ID Card & Stats */}
        <div className="lg:col-span-5 space-y-12">
          {/* Identity Card */}
          <motion.div 
            whileHover={{ rotateY: 5, rotateX: -5 }}
            className="relative aspect-[1.6/1] rounded-[2rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden group cursor-default"
            style={{ 
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0a1424 100%)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Card Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
            
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-primary tracking-[0.3em] uppercase">KINETIC_ELITE_ACCESS</span>
                  <h3 className="font-headline text-3xl font-black italic text-white leading-none uppercase">OPERATOR_PROFILE</h3>
                </div>
                <div className="w-16 h-16 gold-stitch rounded-2xl flex items-center justify-center bg-black/40">
                  <Award className="text-[#d4af37]" size={32} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl">
                    <img 
                      src="https://picsum.photos/seed/operator/200/200" 
                      alt="Operator" 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <div className="font-headline text-2xl font-black text-white uppercase tracking-tighter">
                      {locale === 'joual' ? "LE CRINQUÉ" : "THE OPERATOR"}
                    </div>
                    <div className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
                      RANK: {stats?.rank || 'RECRUIT'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    VALID_THRU: 12/26<br />
                    CLEARANCE: LEVEL_04
                  </div>
                  <div className="font-headline text-sm font-black italic text-[#d4af37] uppercase">
                    {locale === 'joual' ? "Y'EN A PAS D'FACILE" : "NO_EXCUSES_ONLY_IRON"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Stats */}
          <div className="grid grid-cols-2 gap-6">
            <StatBox 
              label="INTENSITY_HOURS" 
              value={stats?.intensityHours || 0} 
              icon={<Zap size={20} className="text-primary" />} 
            />
            <StatBox 
              label="IRON_MOVED_KG" 
              value={(stats?.ironMovedKg || 0).toLocaleString()} 
              icon={<KineticBolt size={20} className="text-primary" />} 
            />
          </div>

          {/* Sovereignty Map (Mini) */}
          <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-xs font-black tracking-widest text-primary uppercase">SECTOR_SOVEREIGNTY</h3>
              <Target size={16} className="text-primary" />
            </div>
            <div className="space-y-4">
              {Object.entries(stats?.sovereignty || {}).map(([sector, count]) => (
                <div key={sector} className="space-y-2">
                  <div className="flex justify-between font-mono text-[10px] font-bold text-white/60 uppercase">
                    <span>{sector}</span>
                    <span>{count} SESSIONS</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Number(count) * 20)}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
              {Object.keys(stats?.sovereignty || {}).length === 0 && (
                <p className="font-mono text-[10px] text-white/20 uppercase text-center py-4 italic">NO_SECTOR_DATA_AVAILABLE</p>
              )}
              <button 
                onClick={onOpenLeaderboard}
                className="w-full mt-4 bg-primary text-on-primary font-headline font-black text-[10px] py-4 rounded-2xl uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-[0_10px_20px_rgba(172,44,0,0.3)]"
              >
                {locale === 'joual' ? "CHECK LE CLASSEMENT" : "VIEW CITY RANKINGS"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mission Log & Vault */}
        <div className="lg:col-span-7 space-y-12">
          {/* Mission Log */}
          <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <History size={20} className="text-primary" />
                <h3 className="font-headline text-xs font-black tracking-widest text-white uppercase">MISSION_LOG // INTENSITY_HISTORY</h3>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold">{stats?.totalSessions || 0} ENTRIES</span>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
              {stats?.recentBookings.map((booking, i) => (
                <div key={booking.id} className="group relative bg-white/5 hover:bg-white/10 p-6 rounded-2xl border-l-4 border-primary transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-[10px] text-primary font-bold mb-1">
                        {new Date(booking.created_at).toLocaleDateString()} // {booking.session_time}
                      </div>
                      <h4 className="font-headline text-xl font-black italic text-white uppercase">{booking.studio.name}</h4>
                      <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-white/40 uppercase">
                        <MapPin size={10} />
                        {booking.studio.neighborhood?.name || booking.studio.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-white/60 uppercase tracking-widest">STATUS</div>
                      <div className="font-headline text-xs font-black text-primary uppercase">SUCCESS</div>
                    </div>
                  </div>
                </div>
              ))}
              {stats?.recentBookings.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                  <History size={48} />
                  <p className="font-headline text-xl font-black uppercase tracking-widest">NO_MISSIONS_LOGGED</p>
                </div>
              )}
            </div>
          </div>

          {/* The Vault */}
          <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-primary" />
                <h3 className="font-headline text-xs font-black tracking-widest text-white uppercase">THE_VAULT // ACCESS_CODES</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats?.recentBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <div>
                    <div className="font-headline text-xs font-black text-white uppercase truncate max-w-[150px]">{booking.studio.name}</div>
                    <div className="font-mono text-[9px] text-white/40 uppercase mt-1">{booking.session_time}</div>
                  </div>
                  <div className="font-mono text-lg font-black text-primary tracking-widest group-hover:scale-110 transition-transform">
                    {booking.access_code}
                  </div>
                </div>
              ))}
              {stats?.recentBookings.length === 0 && (
                <div className="col-span-2 py-12 text-center opacity-20 border-2 border-dashed border-white/10 rounded-2xl">
                  <Lock size={32} className="mx-auto mb-4" />
                  <p className="font-mono text-[10px] uppercase tracking-widest">VAULT_EMPTY</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-8 border-t border-white/5 flex justify-center opacity-20">
        <div className="font-headline text-4xl font-black italic tracking-tighter text-white uppercase">KINETIC_SYSTEMS</div>
      </footer>
    </motion.div>
  );
}

function StatBox({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <label className="font-headline text-[10px] font-black tracking-widest text-white/40 uppercase">{label}</label>
        {icon}
      </div>
      <div className="text-3xl font-black italic text-white">{value}</div>
    </div>
  );
}
