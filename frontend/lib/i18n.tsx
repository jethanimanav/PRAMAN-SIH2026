"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type Language = "en" | "hi";

type Translations = Record<string, string>;

// ─────────────────────────────────────────────────────────────────────────────
// Translation Dictionaries
// ─────────────────────────────────────────────────────────────────────────────

const en: Translations = {
  // Navigation
  home: "Home",
  about: "About",
  forStartups: "For Startups",
  forGovernment: "For Government",
  resources: "Resources",
  contactUs: "Contact Us",
  login: "Login",
  register: "Register",
  signOut: "Sign Out",

  // Hero
  heroEyebrow: "IDEAS • COLLABORATION • IMPACT",
  heroHeadline1: "Ideas for a",
  heroHeadline2: "Stronger Maharashtra",
  heroSubtitle: "Connecting government challenges with startup innovation to build efficient, transparent and citizen-centric solutions for a better Maharashtra.",
  exploreStartupPortal: "Explore Startup Portal",
  howItWorks: "How it Works",

  // Sections
  whatIsPraman: "What is PRAMAN?",
  pramanDescription: "PRAMAN is a public procurement intelligence platform that helps government departments define real-world problems, discover and collaborate with innovative startups, and manage the entire journey from evaluation to pilot and procurement — with transparency, evidence and measurable impact.",
  learnMore: "Learn More",

  // Empowering section
  empoweringTitle: "Empowering Startups with Opportunities",
  empoweringSubtitle: "A transparent, evidence-driven pathway for innovative companies to co-pilot solutions directly with Maharashtra public departments.",
  discoverTitle: "Discover Government Needs",
  discoverDesc: "Explore real-world challenges across Maharashtra departments and municipal bodies.",
  showcaseTitle: "Showcase Your Solution",
  showcaseDesc: "Present your proprietary innovation and telemetry directly to government stakeholders.",
  collaborateTitle: "Collaborate with Departments",
  collaborateDesc: "Work together in 90-day sandbox environments to pilot and validate solutions with real data.",
  scaleTitle: "Scale Your Impact",
  scaleDesc: "Turn proven pilots into procurement readiness and unlock state-wide implementation.",

  // CTA section
  ctaTitle: "From Government Need to Measurable Impact",
  ctaSubtitle: "PRAMAN connects problem identification, startup discovery, evaluation, pilot execution and evidence-based procurement in one transparent workflow.",
  ctaButton: "Explore How PRAMAN Works",

  // Footer
  contactUsTitle: "Contact Us",
  quickAccessTitle: "Quick Access",
  locateUsTitle: "Locate Us",
  latestOpportunities: "Latest Opportunities",
  startupRegistration: "Startup Registration",
  departmentLogin: "Department Login",
  guidelinesFaqs: "Guidelines & FAQs",
  copyright: "© 2025 PRAMAN. Government of Maharashtra. All rights reserved.",
  termsConditions: "Terms & Conditions",
  privacyPolicy: "Privacy Policy",
  accessibility: "Accessibility",

  // Auth modal
  officialGateway: "PRAMAN Official Gateway",
  signInSubtitle: "Department & Startup Sign In · 2FA Enforced",
  officialEmail: "Official Email",
  password: "Password",
  mfaCode: "MFA Verification Code",
  authenticateSignIn: "Authenticate & Sign In",
  verifyingCredentials: "Verifying Credentials…",
  demoPersonas: "One-Click Demo Personas:",

  // Role modal
  startupPortal: "Startup Portal",
  governmentPortal: "Government Portal",
  registerNewStartup: "Register a New Startup",
  registerGovEntity: "Register Government Entity",
  loginAsStartup: "Login as Startup",
  loginAsOfficer: "Login as Government Officer",
  strictIsolation: "Strict Portal Isolation · Protected by 2FA · Government of Maharashtra",

  // Shell / Dashboard header
  help: "Help",
  contact: "Contact",
  portalMenu: "Portal Menu",
  notifications: "Notifications",
  toggleLanguage: "Toggle Language",
  switchToHindi: "हिंदी",
  switchToEnglish: "English",
};

const hi: Translations = {
  // Navigation
  home: "होम",
  about: "परिचय",
  forStartups: "स्टार्टअप के लिए",
  forGovernment: "सरकार के लिए",
  resources: "संसाधन",
  contactUs: "संपर्क करें",
  login: "लॉगिन",
  register: "पंजीकरण",
  signOut: "साइन आउट",

  // Hero
  heroEyebrow: "विचार • सहयोग • प्रभाव",
  heroHeadline1: "एक मजबूत",
  heroHeadline2: "महाराष्ट्र के लिए विचार",
  heroSubtitle: "सरकारी चुनौतियों को स्टार्टअप नवाचार से जोड़कर बेहतर महाराष्ट्र के लिए कुशल, पारदर्शी और नागरिक-केंद्रित समाधान बनाना।",
  exploreStartupPortal: "स्टार्टअप पोर्टल देखें",
  howItWorks: "यह कैसे काम करता है",

  // Sections
  whatIsPraman: "PRAMAN क्या है?",
  pramanDescription: "PRAMAN एक सार्वजनिक खरीद इंटेलिजेंस प्लेटफ़ॉर्म है जो सरकारी विभागों को वास्तविक समस्याओं को परिभाषित करने, नवाचारी स्टार्टअप के साथ सहयोग करने और पारदर्शिता, साक्ष्य और मापनीय प्रभाव के साथ मूल्यांकन से पायलट और खरीद तक की पूरी यात्रा का प्रबंधन करने में मदद करता है।",
  learnMore: "और जानें",

  // Empowering section
  empoweringTitle: "स्टार्टअप को अवसरों से सशक्त बनाना",
  empoweringSubtitle: "नवाचारी कंपनियों के लिए महाराष्ट्र के सार्वजनिक विभागों के साथ समाधान को-पायलट करने का पारदर्शी, साक्ष्य-आधारित मार्ग।",
  discoverTitle: "सरकारी जरूरतें खोजें",
  discoverDesc: "महाराष्ट्र विभागों और नगर निकायों में वास्तविक चुनौतियों का अन्वेषण करें।",
  showcaseTitle: "अपना समाधान प्रस्तुत करें",
  showcaseDesc: "अपनी मालिकाना नवाचार और टेलीमेट्री सीधे सरकारी हितधारकों को प्रस्तुत करें।",
  collaborateTitle: "विभागों के साथ सहयोग करें",
  collaborateDesc: "वास्तविक डेटा के साथ समाधानों को पायलट और सत्यापित करने के लिए 90-दिन के सैंडबॉक्स वातावरण में काम करें।",
  scaleTitle: "अपना प्रभाव बढ़ाएं",
  scaleDesc: "सिद्ध पायलटों को खरीद तत्परता में बदलें और राज्यव्यापी कार्यान्वयन अनलॉक करें।",

  // CTA section
  ctaTitle: "सरकारी जरूरत से मापनीय प्रभाव तक",
  ctaSubtitle: "PRAMAN समस्या पहचान, स्टार्टअप खोज, मूल्यांकन, पायलट निष्पादन और साक्ष्य-आधारित खरीद को एक पारदर्शी वर्कफ़्लो में जोड़ता है।",
  ctaButton: "PRAMAN कैसे काम करता है देखें",

  // Footer
  contactUsTitle: "संपर्क करें",
  quickAccessTitle: "त्वरित पहुँच",
  locateUsTitle: "हमें खोजें",
  latestOpportunities: "नवीनतम अवसर",
  startupRegistration: "स्टार्टअप पंजीकरण",
  departmentLogin: "विभाग लॉगिन",
  guidelinesFaqs: "दिशानिर्देश और FAQs",
  copyright: "© 2025 PRAMAN. महाराष्ट्र सरकार। सर्वाधिकार सुरक्षित।",
  termsConditions: "नियम और शर्तें",
  privacyPolicy: "गोपनीयता नीति",
  accessibility: "अभिगम्यता",

  // Auth modal
  officialGateway: "PRAMAN आधिकारिक गेटवे",
  signInSubtitle: "विभाग और स्टार्टअप साइन इन · 2FA अनिवार्य",
  officialEmail: "आधिकारिक ईमेल",
  password: "पासवर्ड",
  mfaCode: "MFA सत्यापन कोड",
  authenticateSignIn: "प्रमाणित करें और साइन इन करें",
  verifyingCredentials: "प्रमाण-पत्र सत्यापित हो रहे हैं…",
  demoPersonas: "एक-क्लिक डेमो व्यक्तित्व:",

  // Role modal
  startupPortal: "स्टार्टअप पोर्टल",
  governmentPortal: "सरकारी पोर्टल",
  registerNewStartup: "नया स्टार्टअप पंजीकृत करें",
  registerGovEntity: "सरकारी संस्था पंजीकृत करें",
  loginAsStartup: "स्टार्टअप के रूप में लॉगिन",
  loginAsOfficer: "सरकारी अधिकारी के रूप में लॉगिन",
  strictIsolation: "सख्त पोर्टल अलगाव · 2FA द्वारा सुरक्षित · महाराष्ट्र सरकार",

  // Shell / Dashboard header
  help: "सहायता",
  contact: "संपर्क",
  portalMenu: "पोर्टल मेनू",
  notifications: "सूचनाएं",
  toggleLanguage: "भाषा बदलें",
  switchToHindi: "हिंदी",
  switchToEnglish: "English",
};

const DICTIONARIES: Record<Language, Translations> = { en, hi };

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isHindi: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  function t(key: string): string {
    return DICTIONARIES[language][key] ?? DICTIONARIES["en"][key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isHindi: language === "hi" }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
}
