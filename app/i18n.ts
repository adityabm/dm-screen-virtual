export type Language = "en" | "id";

export const translations = {
  en: {
    // Header
    title: "DM",
    subtitle: "ULTIMATE",
    screen: "SCREEN",
    
    // Dice
    diceRoller: "Dice Roller",
    
    // Initiative
    initiative: "Initiative",
    clear: "Clear",
    namePlaceholder: "Name...",
    rollPlaceholder: "Roll",
    
    // NPCs
    savedNpcs: "Saved NPCs",
    noNpcs: "No NPCs yet...",
    
    // Tabs
    newTab: "New Tab",
    uploadImage: "Upload Image",
    deleteTab: "Delete Tab",
    deleteImage: "REMOVE IMAGE",
    plotPlaceholder: "Write your adventure plot here...",
    saveData: "SAVE DATA",
    
    // Encounter
    encounter: "Encounter",
    reset: "Reset",
    enemyPlaceholder: "Enemy...",
    hpPlaceholder: "Max HP",
    
    // NPC Generator
    npcGenerator: "NPC Generator",
    viewDetails: "VIEW DETAILS",
    clickGenerate: "Click to generate new NPC.",
    generateBtn: "Generate NPC",
    
    // Rules
    dmRules: "DM Rules",
    rulesPlaceholder: "Your favorite rules...",
    
    // Modal
    personality: "Personality:",
    motivation: "Motivation:",
    saveNpcBtn: "SAVE NPC",
    closeBtn: "CLOSE",
    
    // Messages
    criticalSuccess: "CRITICAL SUCCESS!",
    npcSaved: "NPC SAVED!",
    dataSaved: "DATA SAVED!",
    storageFull: "STORAGE FULL!",
    exportData: "EXPORT DATA",
    importData: "IMPORT DATA",
    dataExported: "DATA EXPORTED!",
    dataImported: "DATA IMPORTED!",
    importFailed: "IMPORT FAILED!",
    newCampaign: "NEW CAMPAIGN",
    
    // Prompts
    confirmDeleteTab: "Delete this tab?",
    confirmResetEnemies: "Reset all enemies?",
    confirmDeleteNpc: "Delete NPC?",
    confirmResetTimer: "Reset session timer?",
    confirmNewCampaign: "Are you sure you want to start a new campaign? All current data will be lost!",
    
    // Default App Data strings
    defaultTabTitle: "Main Plot",
    defaultTabContent: "Start your adventure here...",
    defaultReference: "• Status:\nBlinded: Disadv on attacks.\nProne: Melee attackers have Adv.\n\n• DC:\n10: Easy\n15: Medium\n20: Hard",
    defaultCampaignTitle: "My Epic Campaign",
    campaignTitlePlaceholder: "Campaign Title...",
  },
  id: {
    // Header
    title: "DM",
    subtitle: "ULTIMATE",
    screen: "SCREEN",

    // Dice
    diceRoller: "Dice Roller",
    
    // Initiative
    initiative: "Initiative",
    clear: "Clear",
    namePlaceholder: "Nama...",
    rollPlaceholder: "Roll",
    
    // NPCs
    savedNpcs: "Saved NPCs",
    noNpcs: "Belum ada NPC...",
    
    // Tabs
    newTab: "Tab Baru",
    uploadImage: "Unggah Gambar",
    deleteTab: "Hapus Tab",
    deleteImage: "HAPUS GAMBAR",
    plotPlaceholder: "Tulis plot petualangan di sini...",
    saveData: "SIMPAN DATA",
    
    // Encounter
    encounter: "Encounter",
    reset: "Reset",
    enemyPlaceholder: "Musuh...",
    hpPlaceholder: "Max HP",
    
    // NPC Generator
    npcGenerator: "NPC Generator",
    viewDetails: "LIHAT DETAIL",
    clickGenerate: "Klik generate NPC baru.",
    generateBtn: "Generate NPC",
    
    // Rules
    dmRules: "DM Rules",
    rulesPlaceholder: "Aturan favoritmu...",
    
    // Modal
    personality: "Kepribadian:",
    motivation: "Motivasi:",
    saveNpcBtn: "SIMPAN NPC",
    closeBtn: "TUTUP",
    
    // Messages
    criticalSuccess: "CRITICAL SUCCESS!",
    npcSaved: "NPC DISIMPAN!",
    dataSaved: "DATA DISIMPAN!",
    storageFull: "STORAGE PENUH!",
    exportData: "EKSPOR DATA",
    importData: "IMPOR DATA",
    dataExported: "DATA DIEKSPOR!",
    dataImported: "DATA DIIMPOR!",
    importFailed: "GAGAL IMPOR!",
    newCampaign: "KAMPANYE BARU",
    
    // Prompts
    confirmDeleteTab: "Hapus tab ini?",
    confirmResetEnemies: "Reset semua musuh?",
    confirmDeleteNpc: "Hapus NPC?",
    confirmResetTimer: "Reset timer sesi?",
    confirmNewCampaign: "Yakin ingin memulai kampanye baru? Semua data saat ini akan dihapus!",

    // Default App Data strings
    defaultTabTitle: "Plot Utama",
    defaultTabContent: "Mulai petualanganmu di sini...",
    defaultReference: "• Status:\nBlinded: Disadv on attacks.\nProne: Melee attackers have Adv.\n\n• DC:\n10: Easy\n15: Medium\n20: Hard",
    defaultCampaignTitle: "Kampanye Epikku",
    campaignTitlePlaceholder: "Judul Kampanye...",
  }
};

export const npcPoolTranslations = {
  en: {
    traits: ["Highly suspicious", "Speaks in whispers", "Friendly but forgetful", "Recklessly brave"],
    goals: ["Find missing sibling", "Save for retirement", "Spy on enemies", "Wants good ale"]
  },
  id: {
    traits: ["Sangat curiga", "Bicara berbisik", "Ramah tapi pelupa", "Pemberani ceroboh"],
    goals: ["Cari saudara hilang", "Kumpul uang pensiun", "Mata-mata musuh", "Ingin bir enak"]
  }
};
