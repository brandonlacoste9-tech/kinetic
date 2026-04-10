import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Locale = 'en' | 'fr' | 'joual';

interface Translations {
  nav: {
    studios: string;
    neighborhoods: string;
    listGym: string;
  };
  hero: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
  };
  grid: {
    title: string;
    subtitle: string;
    viewAll: string;
    viewStudio: string;
    away: string;
    filters: string;
    allGear: string;
  };
  detail: {
    manifesto: string;
    location: string;
    rating: string;
    status: string;
    book: string;
    website: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    submit: string;
  };
  ticker: {
    live: string;
    newStudio: string;
    manifestoReceived: string;
    intensityAlert: string;
  };
  localIntensity: {
    title: string;
    subtitle: string;
    searchTitle: string;
    searchDesc: string;
    verifiedTitle: string;
    verifiedDesc: string;
    activeNearYou: string;
  };
  radar: {
    toggle: string;
    exit: string;
    status: string;
    intensityHubs: string;
    scanning: string;
    coordinates: string;
    optimal: string;
    eliteStatus: string;
    log1: string;
    log2: string;
    log3: string;
    currentSector: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    rank: string;
    operator: string;
    intensity: string;
    sovereign: string;
  };
}

const dictionaries: Record<Locale, Translations> = {
  en: {
    nav: {
      studios: "STUDIOS",
      neighborhoods: "NEIGHBORHOODS",
      listGym: "LIST YOUR GYM"
    },
    hero: {
      title: "FIND YOUR <br /> <span class='text-primary italic'>SWEAT SPOT</span>",
      subtitle: "Canada's premier collective of high-intensity studios, underground boxes, and elite wellness spaces.",
      searchPlaceholder: "Search by city, gym name, or discipline...",
      searchBtn: "SEARCH"
    },
    grid: {
      title: "ELITE VENUES",
      subtitle: "Hand-picked spaces where performance meets atmosphere. Curated for the dedicated.",
      viewAll: "VIEW ALL ACROSS CANADA",
      viewStudio: "VIEW STUDIO",
      away: "KM AWAY",
      filters: "COMMAND CENTER",
      allGear: "ALL GEAR"
    },
    detail: {
      manifesto: "THE MANIFESTO",
      location: "LOCATION",
      rating: "RATING",
      status: "ELITE STATUS",
      book: "BOOK SESSION",
      website: "WEBSITE"
    },
    onboarding: {
      title: "LIST YOUR <br /> <span class='text-primary'>MANIFESTO</span>",
      subtitle: "JOIN THE NETWORK",
      submit: "PUBLISH MANIFESTO"
    },
    ticker: {
      live: "LIVE INTENSITY",
      newStudio: "NEW STUDIO LISTED",
      manifestoReceived: "MANIFESTO RECEIVED",
      intensityAlert: "INTENSITY ALERT"
    },
    localIntensity: {
      title: "LOCAL<br />INTENSITY",
      subtitle: "We don't just find gyms. We find the communities that push you. From coastal Vancouver docks to the industrial heart of Hamilton.",
      searchTitle: "HYPER-LOCAL SEARCH",
      searchDesc: "Filter by block, neighborhood, or commute time.",
      verifiedTitle: "VERIFIED STUDIOS",
      verifiedDesc: "Every gym on Kinetic is vetted for quality and atmosphere.",
      activeNearYou: "ACTIVE NEAR YOU"
    },
    radar: {
      toggle: "RADAR MODE",
      exit: "EXIT RADAR",
      status: "SECTOR STATUS",
      intensityHubs: "INTENSITY HUBS",
      scanning: "SCANNING SECTOR",
      coordinates: "COORDINATES",
      optimal: "OPTIMAL",
      eliteStatus: "ELITE STATUS",
      log1: "PLATEAU: 8 ACTIVE BOXES",
      log2: "GRIFFINTOWN: PEAK INTENSITY",
      log3: "MILE END: NEW MANIFESTO",
      currentSector: "PLATEAU SECTOR"
    },
    leaderboard: {
      title: "ELITE RANKINGS",
      subtitle: "THE MONTREAL HIERARCHY",
      rank: "RANK",
      operator: "OPERATOR",
      intensity: "INTENSITY",
      sovereign: "SOVEREIGN"
    }
  },
  fr: {
    nav: {
      studios: "STUDIOS",
      neighborhoods: "QUARTIERS",
      listGym: "INSCRIVEZ VOTRE GYM"
    },
    hero: {
      title: "TROUVEZ VOTRE <br /> <span class='text-primary italic'>ZONE DE SUEUR</span>",
      subtitle: "Le premier collectif canadien de studios haute intensité, de box souterrains et d'espaces bien-être d'élite.",
      searchPlaceholder: "Recherchez par ville, nom ou discipline...",
      searchBtn: "RECHERCHER"
    },
    grid: {
      title: "LIEUX D'ÉLITE",
      subtitle: "Des espaces triés sur le volet où la performance rencontre l'atmosphère.",
      viewAll: "VOIR TOUT AU CANADA",
      viewStudio: "VOIR LE STUDIO",
      away: "KM DE DISTANCE",
      filters: "CENTRE DE COMMANDE",
      allGear: "TOUT L'ÉQUIPEMENT"
    },
    detail: {
      manifesto: "LE MANIFESTE",
      location: "EMPLACEMENT",
      rating: "NOTE",
      status: "STATUT ÉLITE",
      book: "RÉSERVER",
      website: "SITE WEB"
    },
    onboarding: {
      title: "PUBLIEZ VOTRE <br /> <span class='text-primary'>MANIFESTE</span>",
      subtitle: "REJOIGNEZ LE RÉSEAU",
      submit: "PUBLIER LE MANIFESTE"
    },
    ticker: {
      live: "INTENSITÉ EN DIRECT",
      newStudio: "NOUVEAU STUDIO INSCRIT",
      manifestoReceived: "MANIFESTE REÇU",
      intensityAlert: "ALERTE D'INTENSITÉ"
    },
    localIntensity: {
      title: "INTENSITÉ<br />LOCALE",
      subtitle: "On ne fait pas que trouver des gyms. On trouve les communautés qui vous poussent. Des quais de Vancouver au cœur industriel de Hamilton.",
      searchTitle: "RECHERCHE HYPER-LOCALE",
      searchDesc: "Filtrez par bloc, quartier ou temps de trajet.",
      verifiedTitle: "STUDIOS VÉRIFIÉS",
      verifiedDesc: "Chaque gym sur Kinetic est vérifié pour sa qualité et son atmosphère.",
      activeNearYou: "ACTIF PRÈS DE CHEZ VOUS"
    },
    radar: {
      toggle: "MODE RADAR",
      exit: "QUITTER LE RADAR",
      status: "STATUT DU SECTEUR",
      intensityHubs: "HUBS D'INTENSITÉ",
      scanning: "BALAYAGE DU SECTEUR",
      coordinates: "COORDONNÉES",
      optimal: "OPTIMAL",
      eliteStatus: "STATUT ÉLITE",
      log1: "PLATEAU : 8 BOXES ACTIFS",
      log2: "GRIFFINTOWN : INTENSITÉ MAXIMALE",
      log3: "MILE END : NOUVEAU MANIFESTE",
      currentSector: "SECTEUR PLATEAU"
    },
    leaderboard: {
      title: "CLASSEMENT D'ÉLITE",
      subtitle: "LA HIÉRARCHIE MONTRÉALAISE",
      rank: "RANG",
      operator: "OPÉRATEUR",
      intensity: "INTENSITÉ",
      sovereign: "SOUVERAIN"
    }
  },
  joual: {
    nav: {
      studios: "LES GYMS",
      neighborhoods: "LES COINS",
      listGym: "METS TON GYM ICITTE"
    },
    hero: {
      title: "TROUVE TA <br /> <span class='text-primary italic'>PLACE POUR SUER</span>",
      subtitle: "La crème de la crème des studios intenses, des box pas mal raw pis des spots de wellness d'élite au Canada.",
      searchPlaceholder: "Cherche par ville, nom de gym ou c'que tu fais...",
      searchBtn: "GO"
    },
    grid: {
      title: "SPOTS D'ÉLITE",
      subtitle: "Des places choisies au peigne fin où ça brasse pour vrai. Juste pour les crinqués.",
      viewAll: "CHECK TOUT AU CANADA",
      viewStudio: "VOIR LE SPOT",
      away: "KM D'ICITTE",
      filters: "POSTE DE CONTRÔLE",
      allGear: "TOUTE LA GANG"
    },
    detail: {
      manifesto: "LE MANIFESTE",
      location: "C'EST OÙ",
      rating: "SCORE",
      status: "TOP CRINQUÉ",
      book: "RÉSERVE TA PLACE",
      website: "SITE WEB"
    },
    onboarding: {
      title: "METS TON <br /> <span class='text-primary'>MANIFESTE</span>",
      subtitle: "REJOINS LA GANG",
      submit: "PUBLIE ÇA"
    },
    ticker: {
      live: "ÇA BRASSE EN DIRECT",
      newStudio: "UN NOUVEAU SPOT VIENT D'POPER",
      manifestoReceived: "MANIFESTE REÇU",
      intensityAlert: "ALERTE DE GROS FER"
    },
    localIntensity: {
      title: "L'INTENSITÉ<br />DU COIN",
      subtitle: "On cherche pas juste des gyms. On trouve la gang qui va t'faire forcer. Des docks de Vancouver jusqu'au milieu industriel de Hamilton.",
      searchTitle: "RECHERCHE HYPER-LOCALE",
      searchDesc: "Filtre par bloc, par coin ou par temps d'route.",
      verifiedTitle: "SPOTS VÉRIFIÉS",
      verifiedDesc: "Chaque gym sur Kinetic est checké pour sa qualité pis son vibe.",
      activeNearYou: "ÇA BRASSE DANS TON COIN"
    },
    radar: {
      toggle: "MODE RADAR",
      exit: "LÂCHE LE RADAR",
      status: "STATUT DU COIN",
      intensityHubs: "SPOTS QUI BRASSENT",
      scanning: "CHECK DU COIN",
      coordinates: "COORDONNÉES",
      optimal: "A1",
      eliteStatus: "TOP CRINQUÉ",
      log1: "PLATEAU : 8 BOXES QUI BRASSENT",
      log2: "GRIFFINTOWN : ÇA BRASSE AU BOUTTE",
      log3: "MILE END : NOUVEAU MANIFESTE REÇU",
      currentSector: "DANS L'PLATEAU"
    },
    leaderboard: {
      title: "LES ROIS DU FER",
      subtitle: "LA HIÉRARCHIE D'ICITTE",
      rank: "RANG",
      operator: "CRINQUÉ",
      intensity: "INTENSITÉ",
      sovereign: "SOUVERAIN"
    }
  }
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const value = {
    locale,
    setLocale,
    t: dictionaries[locale]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
