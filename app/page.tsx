"use client";

import { useState, useEffect, useRef } from "react";
import { translations, npcPoolTranslations, Language } from "./i18n";

// Types
type Tab = {
  title: string;
  content: string;
  image: string | null;
};

type Initiative = {
  name: string;
  score: number;
};

type NPC = {
  id: number;
  name: string;
  sub: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  trait: string;
  goal: string;
};

type Encounter = {
  id: number;
  name: string;
  maxHp: number;
  curHp: number;
};

type AppData = {
  language: Language;
  tabs: Tab[];
  activeTabIndex: number;
  initiative: Initiative[];
  savedNPCs: NPC[];
  encounters: Encounter[];
  reference: string;
  darkMode: boolean;
};

const defaultAppData: AppData = {
  language: "en",
  tabs: [
    {
      title: translations.en.defaultTabTitle,
      content: translations.en.defaultTabContent,
      image: null,
    },
  ],
  activeTabIndex: 0,
  initiative: [],
  savedNPCs: [],
  encounters: [],
  reference: translations.en.defaultReference,
  darkMode: false,
};

const npcPool = {
  names: ["Grog", "Elara", "Finn", "Morgra", "Thorn", "Siv", "Kael", "Runa", "Boric", "Lyra"],
  lastNames: ["Ironheart", "Shadowstep", "Oakmantle", "Stormborn", "Fireweaver"],
  races: ["Human", "Elf", "Dwarf", "Halfling", "Tiefling", "Dragonborn"],
  classes: ["Warrior", "Mage", "Rogue", "Cleric", "Bard", "Ranger"],
};

function rDice() {
  return Math.floor(Math.random() * 10) + 8;
}

export default function DMUltimateScreen() {
  const [appData, setAppData] = useState<AppData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dmScreenUltimateData_V5");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.language) parsed.language = "en";
          return parsed;
        } catch (e) {
          console.error("Error parsing saved data", e);
        }
      }
    }
    return defaultAppData;
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [diceResult, setDiceResult] = useState<number | string>("--");
  const [diceScale, setDiceScale] = useState(false);

  const [initName, setInitName] = useState("");
  const [initScore, setInitScore] = useState("");

  const [enemyName, setEnemyName] = useState("");
  const [enemyHp, setEnemyHp] = useState("");

  const [currentNPC, setCurrentNPC] = useState<NPC | null>(null);
  const [showNpcModal, setShowNpcModal] = useState(false);
  const [isViewingSavedNpc, setIsViewingSavedNpc] = useState(false);

  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const notifTimeout = useRef<NodeJS.Timeout | null>(null);

  const [timeStr, setTimeStr] = useState("00:00:00");

  // Load from LocalStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString("id-ID"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply Theme
  useEffect(() => {
    if (appData.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [appData.darkMode]);

  const t = translations[appData.language];

  const showMsg = (msg: string) => {
    setNotification(msg);
    setShowNotification(true);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setShowNotification(false), 2000);
  };

  const saveAllData = (dataToSave: AppData, notify = true) => {
    try {
      localStorage.setItem("dmScreenUltimateData_V5", JSON.stringify(dataToSave));
      if (notify) showMsg(t.dataSaved);
    } catch (e) {
      showMsg(t.storageFull);
    }
  };

  const updateAppData = (updater: (prev: AppData) => AppData, notifySave = false) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAllData(next, notifySave);
      return next;
    });
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  const toggleDarkMode = () => {
    updateAppData((prev) => ({ ...prev, darkMode: !prev.darkMode }), false);
  };

  const changeLanguage = (lang: Language) => {
    updateAppData((prev) => ({ ...prev, language: lang }), false);
  };

  // Tabs
  const activeTab = appData.tabs[appData.activeTabIndex] || appData.tabs[0];

  const addNewTab = () => {
    updateAppData((prev) => ({
      ...prev,
      tabs: [...prev.tabs, { title: t.newTab, content: "", image: null }],
      activeTabIndex: prev.tabs.length,
    }));
  };

  const deleteCurrentTab = () => {
    if (appData.tabs.length <= 1) return;
    if (window.confirm(t.confirmDeleteTab)) {
      updateAppData((prev) => {
        const newTabs = [...prev.tabs];
        newTabs.splice(prev.activeTabIndex, 1);
        return {
          ...prev,
          tabs: newTabs,
          activeTabIndex: 0,
        };
      });
    }
  };

  const updateTabTitle = (title: string) => {
    updateAppData((prev) => {
      const newTabs = [...prev.tabs];
      newTabs[prev.activeTabIndex].title = title;
      return { ...prev, tabs: newTabs };
    });
  };

  const updateTabContent = (content: string) => {
    updateAppData((prev) => {
      const newTabs = [...prev.tabs];
      newTabs[prev.activeTabIndex].content = content;
      return { ...prev, tabs: newTabs };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      updateAppData((prev) => {
        const newTabs = [...prev.tabs];
        newTabs[prev.activeTabIndex].image = evt.target?.result as string;
        return { ...prev, tabs: newTabs };
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    updateAppData((prev) => {
      const newTabs = [...prev.tabs];
      newTabs[prev.activeTabIndex].image = null;
      return { ...prev, tabs: newTabs };
    });
  };

  // Dice
  const rollDice = (sides: number) => {
    // eslint-disable-next-line react-hooks/purity
    const res = Math.floor(Math.random() * sides) + 1;
    setDiceResult(res);
    setDiceScale(true);
    setTimeout(() => setDiceScale(false), 100);
    if (sides === 20 && res === 20) showMsg(t.criticalSuccess);
  };

  // Initiative
  const addInitiative = () => {
    const score = parseInt(initScore);
    if (!initName || isNaN(score)) return;
    updateAppData((prev) => ({
      ...prev,
      initiative: [...prev.initiative, { name: initName, score }],
    }));
    setInitName("");
    setInitScore("");
  };

  const clearInitiative = () => {
    updateAppData((prev) => ({ ...prev, initiative: [] }));
  };

  // Encounter Tracker
  const addEnemy = () => {
    const max = parseInt(enemyHp);
    if (!enemyName || isNaN(max)) return;
    updateAppData((prev) => ({
      ...prev,
      encounters: [...prev.encounters, { id: Date.now(), name: enemyName, maxHp: max, curHp: max }],
    }), false);
    setEnemyName("");
    setEnemyHp("");
  };

  const updateEnemyHP = (idx: number, amount: number) => {
    updateAppData((prev) => {
      const enc = [...prev.encounters];
      enc[idx].curHp = Math.max(0, Math.min(enc[idx].maxHp, enc[idx].curHp + amount));
      return { ...prev, encounters: enc };
    }, false);
  };

  const removeEnemy = (idx: number) => {
    updateAppData((prev) => {
      const enc = [...prev.encounters];
      enc.splice(idx, 1);
      return { ...prev, encounters: enc };
    }, false);
  };

  const clearEncounter = () => {
    if (window.confirm(t.confirmResetEnemies)) {
      updateAppData((prev) => ({ ...prev, encounters: [] }), false);
    }
  };

  // NPC Generator
  const generateNPC = () => {
    const tPool = npcPoolTranslations[appData.language];
    // eslint-disable-next-line react-hooks/purity
    const f = npcPool.names[Math.floor(Math.random() * npcPool.names.length)];
    // eslint-disable-next-line react-hooks/purity
    const l = npcPool.lastNames[Math.floor(Math.random() * npcPool.lastNames.length)];
    // eslint-disable-next-line react-hooks/purity
    const r = npcPool.races[Math.floor(Math.random() * npcPool.races.length)];
    // eslint-disable-next-line react-hooks/purity
    const c = npcPool.classes[Math.floor(Math.random() * npcPool.classes.length)];

    const npc: NPC = {
      id: Date.now(),
      name: `${f} ${l}`,
      sub: `${r} ${c}`,
      // eslint-disable-next-line react-hooks/purity
      stats: { str: rDice(), dex: rDice(), con: rDice(), int: rDice(), wis: rDice(), cha: rDice() },
      // eslint-disable-next-line react-hooks/purity
      trait: tPool.traits[Math.floor(Math.random() * tPool.traits.length)],
      // eslint-disable-next-line react-hooks/purity
      goal: tPool.goals[Math.floor(Math.random() * tPool.goals.length)],
    };
    setCurrentNPC(npc);
    setIsViewingSavedNpc(false);
    setShowNpcModal(true);
  };

  const saveCurrentNPC = () => {
    if (currentNPC && !appData.savedNPCs.some(n => n.id === currentNPC.id)) {
      updateAppData((prev) => ({
        ...prev,
        savedNPCs: [...prev.savedNPCs, currentNPC],
      }), false);
      showMsg(t.npcSaved);
    }
    setShowNpcModal(false);
  };

  const viewSavedNPC = (npc: NPC) => {
    setCurrentNPC(npc);
    setIsViewingSavedNpc(true);
    setShowNpcModal(true);
  };

  const deleteSavedNPC = (idx: number) => {
    if (window.confirm(t.confirmDeleteNpc)) {
      updateAppData((prev) => {
        const npcs = [...prev.savedNPCs];
        npcs.splice(idx, 1);
        return { ...prev, savedNPCs: npcs };
      }, false);
    }
  };

  // Reference
  const updateReference = (ref: string) => {
    updateAppData((prev) => ({ ...prev, reference: ref }), false);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="neo-card p-4 transform -rotate-1">
          <h1 className="text-3xl md:text-4xl font-fantasy font-black tracking-tighter">
            {t.title} <span className="bg-primary text-white px-2">{t.subtitle}</span> {t.screen}
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            value={appData.language}
            onChange={(e) => changeLanguage(e.target.value as Language)}
            className="neo-btn bg-white text-black px-3 py-2 font-bold cursor-pointer outline-none"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>

          <button onClick={toggleDarkMode} className="neo-btn bg-white text-black p-3 rounded-full" title="Toggle Dark Mode">
            <i className={`fas ${appData.darkMode ? "fa-sun text-yellow-400" : "fa-moon text-black"}`}></i>
          </button>
          <div className="neo-card bg-accent p-3 text-xl font-black font-mono text-black">
            {timeStr}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KOLOM KIRI */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Dice Roller */}
          <section className="neo-card p-4 bg-secondary">
            <h2 className="font-black uppercase mb-3 text-white">
              <i className="fas fa-dice-d20 mr-2"></i> {t.diceRoller}
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[4, 6, 8, 10, 12].map(d => (
                <button key={d} onClick={() => rollDice(d)} className="neo-btn bg-white text-black p-2 text-xs">
                  D{d}
                </button>
              ))}
              <button onClick={() => rollDice(20)} className="neo-btn bg-black text-white p-2 text-xs">
                D20
              </button>
            </div>
            <div className="bg-white border-4 border-border p-4 text-center">
              <div className={`text-5xl font-black text-black transition-transform ${diceScale ? "scale-125" : ""}`}>
                {diceResult}
              </div>
            </div>
          </section>

          {/* Initiative */}
          <section className="neo-card p-4 bg-green-500">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black uppercase text-white">
                <i className="fas fa-list-ol mr-2"></i> {t.initiative}
              </h2>
              <button onClick={clearInitiative} className="text-[10px] font-bold underline uppercase text-white hover:bg-black p-1">
                {t.clear}
              </button>
            </div>
            <div className="space-y-2 mb-4">
              <input value={initName} onChange={e => setInitName(e.target.value)} type="text" placeholder={t.namePlaceholder} className="neo-input text-sm" />
              <div className="flex gap-2">
                <input value={initScore} onChange={e => setInitScore(e.target.value)} type="number" placeholder={t.rollPlaceholder} className="neo-input text-sm" />
                <button onClick={addInitiative} className="neo-btn bg-black text-white px-4">+</button>
              </div>
            </div>
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {[...appData.initiative].sort((a, b) => b.score - a.score).map((i, idx) => (
                <li key={idx} className="flex justify-between items-center bg-white text-black border-2 border-border p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span>{i.name}</span> <span className="bg-black text-white px-2">{i.score}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Saved NPCs */}
          <section className="neo-card p-4 bg-purple-500">
            <h2 className="font-black uppercase mb-3 text-white">
              <i className="fas fa-users mr-2"></i> {t.savedNpcs}
            </h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {appData.savedNPCs.length === 0 ? (
                <li className="text-[10px] italic text-white opacity-60">{t.noNpcs}</li>
              ) : (
                appData.savedNPCs.map((n, idx) => (
                  <li key={n.id} className="bg-white text-black border-2 border-border p-1 shadow-[2px_2px_0px_0px_black] flex justify-between items-center text-[10px] font-bold">
                    <span className="cursor-pointer truncate flex-grow" onClick={() => viewSavedNPC(n)}>{n.name}</span>
                    <button onClick={() => deleteSavedNPC(idx)} className="text-red-500 ml-1">X</button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </aside>

        {/* KOLOM TENGAH */}
        <main className="lg:col-span-6 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <div className="flex flex-wrap gap-2">
              {appData.tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => updateAppData(prev => ({ ...prev, activeTabIndex: idx }), false)}
                  className={`neo-btn px-4 py-2 text-xs min-w-[80px] truncate max-w-[120px] ${idx === appData.activeTabIndex ? "tab-active" : "tab-inactive"}`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <button onClick={addNewTab} className="neo-btn bg-accent text-black w-10 h-10 text-xl">+</button>
          </div>

          <section className="neo-card flex-grow p-6 relative min-h-[600px] flex flex-col overflow-hidden">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <input
                value={activeTab.title}
                onChange={e => updateTabTitle(e.target.value)}
                className="text-2xl font-black uppercase border-b-4 border-border bg-transparent focus:outline-none flex-grow mr-4"
              />
              <div className="flex gap-2">
                <label className="neo-btn bg-blue-500 text-white p-2 cursor-pointer" title={t.uploadImage}>
                  <i className="fas fa-image"></i>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <button onClick={deleteCurrentTab} className="neo-btn bg-red-500 text-white p-2" title={t.deleteTab}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {activeTab.image && (
              <div className="mb-4 border-4 border-border relative">
                <img src={activeTab.image} className="w-full max-h-[300px] object-contain bg-black" alt="Tab content" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 text-xs border-2 border-black font-bold">
                  {t.deleteImage}
                </button>
              </div>
            )}

            <textarea
              value={activeTab.content}
              onChange={e => updateTabContent(e.target.value)}
              className="flex-grow w-full font-semibold text-lg bg-transparent focus:outline-none resize-none"
              placeholder={t.plotPlaceholder}
            />

            <div className="mt-4 flex justify-end">
              <button onClick={() => saveAllData(appData, true)} className="neo-btn bg-green-500 text-white px-6 py-2 text-sm">
                {t.saveData}
              </button>
            </div>
          </section>
        </main>

        {/* KOLOM KANAN */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Encounter */}
          <section className="neo-card p-4 bg-orange-600">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black uppercase text-white">
                <i className="fas fa-skull mr-2"></i> {t.encounter}
              </h2>
              <button onClick={clearEncounter} className="text-[10px] font-bold underline uppercase text-white hover:bg-black p-1">
                {t.reset}
              </button>
            </div>
            <div className="space-y-2 mb-4">
              <input value={enemyName} onChange={e => setEnemyName(e.target.value)} type="text" placeholder={t.enemyPlaceholder} className="neo-input text-sm" />
              <div className="flex gap-2">
                <input value={enemyHp} onChange={e => setEnemyHp(e.target.value)} type="number" placeholder={t.hpPlaceholder} className="neo-input text-sm" />
                <button onClick={addEnemy} className="neo-btn bg-black text-white px-4 font-black">+</button>
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {appData.encounters.map((e, idx) => {
                const percentage = (e.curHp / e.maxHp) * 100;
                const colorClass = percentage > 50 ? "bg-green-500" : percentage > 20 ? "bg-yellow-500" : "bg-red-600";
                return (
                  <div key={e.id} className="neo-card p-3 bg-white text-black text-xs font-bold space-y-2">
                    <div className="flex justify-between">
                      <span className="truncate pr-2">{e.name}</span>
                      <button onClick={() => removeEnemy(idx)} className="text-red-500 hover:bg-black p-0.5"><i className="fas fa-trash"></i></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateEnemyHP(idx, -1)} className="neo-btn bg-red-400 w-6 h-6 p-0 shadow-[2px_2px_0px_0px_black]">-1</button>
                      <div className="flex-grow bg-gray-200 border-2 border-black h-4 relative overflow-hidden">
                        <div className={`hp-bar h-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] mix-blend-difference text-white">{e.curHp}/{e.maxHp}</span>
                      </div>
                      <button onClick={() => updateEnemyHP(idx, 1)} className="neo-btn bg-green-400 w-6 h-6 p-0 shadow-[2px_2px_0px_0px_black]">+1</button>
                    </div>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => updateEnemyHP(idx, -5)} className="neo-btn bg-red-600 text-white px-2 py-0.5 shadow-[2px_2px_0px_0px_black]">-5</button>
                      <button onClick={() => updateEnemyHP(idx, 5)} className="neo-btn bg-green-600 text-white px-2 py-0.5 shadow-[2px_2px_0px_0px_black]">+5</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* NPC Gen */}
          <section className="neo-card p-4 bg-pink-400">
            <h2 className="font-black uppercase mb-3 text-black">{t.npcGenerator}</h2>
            {currentNPC && !isViewingSavedNpc ? (
              <div className="bg-white border-4 border-black p-3 mb-3 font-bold text-sm text-black">
                <div className="text-lg">{currentNPC.name}</div>
                <div className="text-xs text-gray-500 italic mb-2">{currentNPC.sub}</div>
                <button onClick={() => setShowNpcModal(true)} className="neo-btn bg-black text-white w-full py-1 text-[10px]">
                  {t.viewDetails}
                </button>
              </div>
            ) : (
              <div className="bg-white/50 border-4 border-black border-dashed p-3 mb-3 text-center text-xs font-bold text-black opacity-60">
                {t.clickGenerate}
              </div>
            )}
            <button onClick={generateNPC} className="neo-btn bg-white text-black w-full py-2 text-sm">
              {t.generateBtn}
            </button>
          </section>

          {/* Reference */}
          <section className="neo-card p-4 bg-orange-400">
            <h2 className="font-black uppercase mb-3 text-white">{t.dmRules}</h2>
            <textarea
              value={appData.reference}
              onChange={e => updateReference(e.target.value)}
              className="neo-input flex-grow text-xs leading-relaxed font-bold h-40 focus:bg-yellow-50 focus:text-black"
              placeholder={t.rulesPlaceholder}
            />
          </section>
        </aside>
      </div>

      {/* NPC MODAL */}
      {showNpcModal && currentNPC && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="neo-card w-full max-w-md bg-white text-black p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-fantasy font-black">{currentNPC.name}</h2>
                <p className="text-primary font-bold italic">{currentNPC.sub}</p>
              </div>
              <button onClick={() => setShowNpcModal(false)} className="neo-btn bg-black text-white w-8 h-8">
                X
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((stat) => (
                <div key={stat} className="border-2 border-black p-2 text-center">
                  <div className="text-[10px] font-black uppercase">{stat}</div>
                  <div className="text-xl font-black">{currentNPC.stats[stat]}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t-2 border-black pt-4">
              <p><strong>{t.personality}</strong> <span className="italic">{currentNPC.trait}</span></p>
              <p><strong>{t.motivation}</strong> <span>{currentNPC.goal}</span></p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {!isViewingSavedNpc && (
                <button onClick={saveCurrentNPC} className="neo-btn bg-green-500 text-white py-2">
                  {t.saveNpcBtn}
                </button>
              )}
              <button onClick={() => setShowNpcModal(false)} className={`neo-btn bg-black text-white py-2 ${isViewingSavedNpc ? 'col-span-2' : ''}`}>
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <div
        className={`fixed bottom-10 right-10 neo-card bg-black text-white px-6 py-3 font-black transition-transform duration-300 z-[110] ${showNotification ? "translate-y-0" : "translate-y-[200%]"}`}
      >
        {notification}
      </div>
    </div>
  );
}
