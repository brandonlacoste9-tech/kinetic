import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, MapPin, Check, Loader2, Globe } from "lucide-react";
import { getSupabase } from "../lib/supabase";

import { useLanguage } from "../contexts/LanguageContext";

export default function OnboardingForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    city: "Montreal",
    province: "QC",
    tagline_en: "",
    tagline_fr: "",
    tagline_joual: "",
    lat: 45.5017,
    lng: -73.5673,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      // Demo submission fallback
      const newStudio = {
        id: `local-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
        address: formData.address,
        city: formData.city,
        province: formData.province,
        image_url: preview || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070",
        rating: 5.0,
        is_featured: true,
        lat: formData.lat,
        lng: formData.lng,
        neighborhood: { name: "Local", city: "Montreal" },
        translations: [
          { locale: 'en', tagline: formData.tagline_en },
          { locale: 'fr', tagline: formData.tagline_fr },
          { locale: 'joual', tagline: formData.tagline_joual },
        ]
      };

      const localStudiosJson = localStorage.getItem('kinetic_local_studios');
      const localStudios = localStudiosJson ? JSON.parse(localStudiosJson) : [];
      localStorage.setItem('kinetic_local_studios', JSON.stringify([...localStudios, newStudio]));

      alert("DEMO_MODE: Studio saved locally to your session.");
      onClose();
      window.location.reload(); // Refresh to show new studio
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Image if exists
      let image_url = "";
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('studios')
          .upload(fileName, image);
        
        if (storageError) throw storageError;
        const { data: { publicUrl } } = supabase.storage.from('studios').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      // 2. Insert Studio
      const { data: studio, error: studioError } = await supabase
        .from('studios')
        .insert({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
          address: formData.address,
          city: formData.city,
          province: formData.province,
          image_url,
          location: `POINT(${formData.lng} ${formData.lat})`,
        })
        .select()
        .single();

      if (studioError) throw studioError;

      // 3. Insert Translations
      const translations = [
        { studio_id: studio.id, locale: 'en', tagline: formData.tagline_en },
        { studio_id: studio.id, locale: 'fr', tagline: formData.tagline_fr },
        { studio_id: studio.id, locale: 'joual', tagline: formData.tagline_joual },
      ].filter(t => t.tagline);

      if (translations.length > 0) {
        const { error: transError } = await supabase
          .from('studio_translations')
          .insert(translations);
        if (transError) throw transError;
      }

      alert("Studio listed successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error listing studio. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-on-surface/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
        >
          <motion.div 
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors z-10"
            >
              <X size={32} />
            </button>

            <div className="p-8 md:p-16">
              <header className="mb-12">
                <span className="font-headline text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">{t.onboarding.subtitle}</span>
                <h2 
                  className="font-headline text-5xl md:text-7xl font-black italic tracking-tighter text-on-surface leading-[0.8]"
                  dangerouslySetInnerHTML={{ __html: t.onboarding.title }}
                />
              </header>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Step 1: Identity */}
                <section className="space-y-8">
                  <div className="group">
                    <label className="font-headline text-sm font-bold tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block mb-2 uppercase">STUDIO NAME</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. METRO STRENGTH LAB"
                      className="w-full bg-transparent border-b-4 border-outline-variant/20 focus:border-primary outline-none py-4 text-3xl md:text-5xl font-black italic tracking-tighter text-on-surface placeholder:text-outline-variant/30 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="font-headline text-xs font-bold tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block mb-2 uppercase">ADDRESS</label>
                      <div className="relative">
                        <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                        <input 
                          required
                          type="text" 
                          placeholder="123 RUE DE LA MONTAGNE"
                          className="w-full bg-transparent border-b-2 border-outline-variant/20 focus:border-primary outline-none py-3 pl-8 text-xl font-bold text-on-surface placeholder:text-outline-variant/30 transition-all"
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="font-headline text-xs font-bold tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors block mb-2 uppercase">CITY</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-transparent border-b-2 border-outline-variant/20 focus:border-primary outline-none py-3 text-xl font-bold text-on-surface transition-all"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                {/* Step 2: Cultural Voice */}
                <section className="bg-surface-container-low p-8 rounded-2xl space-y-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-primary" size={20} />
                    <h3 className="font-headline font-bold tracking-widest text-xs text-primary uppercase">LOCALIZATION & VOICE</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="group">
                      <label className="font-headline text-[10px] font-black tracking-[0.2em] text-on-surface-variant uppercase block mb-1">ENGLISH TAGLINE</label>
                      <input 
                        type="text" 
                        placeholder="Where performance meets atmosphere..."
                        className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none py-2 text-lg font-medium text-on-surface placeholder:text-outline-variant/30"
                        value={formData.tagline_en}
                        onChange={e => setFormData({...formData, tagline_en: e.target.value})}
                      />
                    </div>
                    <div className="group">
                      <label className="font-headline text-[10px] font-black tracking-[0.2em] text-on-surface-variant uppercase block mb-1">FRANÇAIS TAGLINE</label>
                      <input 
                        type="text" 
                        placeholder="L'élite de l'entraînement..."
                        className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none py-2 text-lg font-medium text-on-surface placeholder:text-outline-variant/30"
                        value={formData.tagline_fr}
                        onChange={e => setFormData({...formData, tagline_fr: e.target.value})}
                      />
                    </div>
                    <div className="group">
                      <label className="font-headline text-[10px] font-black tracking-[0.2em] text-primary uppercase block mb-1">JOUAL AUTHENTIC VOICE</label>
                      <input 
                        type="text" 
                        placeholder="C'est icitte que ça s'passe..."
                        className="w-full bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none py-2 text-lg font-black italic text-primary placeholder:text-primary/20"
                        value={formData.tagline_joual}
                        onChange={e => setFormData({...formData, tagline_joual: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                {/* Step 3: Visuals */}
                <section>
                  <label className="font-headline text-xs font-bold tracking-widest text-on-surface-variant block mb-4 uppercase">VENUE PHOTOGRAPHY</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`h-64 rounded-2xl border-4 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${preview ? 'border-primary' : 'border-outline-variant/20 group-hover:border-primary/50'}`}>
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                      ) : (
                        <>
                          <Upload className="text-outline-variant group-hover:text-primary transition-colors" size={48} />
                          <p className="font-headline font-bold text-sm text-outline-variant group-hover:text-primary">UPLOAD HIGH-RES ASSET</p>
                        </>
                      )}
                    </div>
                  </div>
                </section>

                <div className="pt-8">
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full kinetic-gradient text-on-primary font-headline font-black text-2xl py-6 rounded-2xl shadow-2xl shadow-primary/40 transform transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 uppercase"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={32} />
                    ) : (
                      <>
                        {t.onboarding.submit}
                        <Check size={32} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
