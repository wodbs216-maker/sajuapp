/* Browser-only recent people storage */
/* ═══════════ 프로필 저장(window.storage) ═══════════ */
/* ═══════════ 저장 어댑터 (클로드 내부/일반 브라우저 모두 지원) ═══════════ */
const store = {
  async get(k) {
    if (typeof window !== "undefined" && window.storage && window.storage.get) return window.storage.get(k, false);
    try { const v = localStorage.getItem(k); return v !== null ? { value: v } : null; } catch (e) { return null; }
  },
  async set(k, v) {
    if (typeof window !== "undefined" && window.storage && window.storage.set) return window.storage.set(k, v, false);
    try { localStorage.setItem(k, v); } catch (e) {}
  },
  async del(k) {
    if (typeof window !== "undefined" && window.storage && window.storage.delete) return window.storage.delete(k, false);
    try { localStorage.removeItem(k); } catch (e) {}
  }
};
async function loadProfiles() {
  try {
    const r = await store.get("saju-profiles");
    state.profiles = r && r.value ? JSON.parse(r.value) : [];
  } catch (e) { state.profiles = []; }
  state.profilesLoaded = true;
  /* 마지막 화면 복원 — 새로고침해도 리포트 유지 */
  try {
    const last = await store.get("saju-last");
    if (last && last.value) {
      const L = JSON.parse(last.value);
      if (L.view === "report" && L.a) {
        state.person = buildPerson(L.a.name, L.a.y, L.a.m, L.a.d, L.a.hourBranch, L.a.gender);
        state.selDaeun = state.person.curDaeun ? state.person.curDaeun.age : state.person.p.daeun[0].age;
        state.view = "report"; state.tab = L.tab || "wonguk";
      } else if (L.view === "compat" && L.a && L.b) {
        state.person = buildPerson(L.a.name, L.a.y, L.a.m, L.a.d, L.a.hourBranch, L.a.gender);
        state.person2 = buildPerson(L.b.name, L.b.y, L.b.m, L.b.d, L.b.hourBranch, L.b.gender);
        state.compatType = (L.compatType === "연인·부부" ? "연인" : (L.compatType || "연인"));
        state.compat = computeCompat(state.person, state.person2, state.compatType);
        state.view = "compat";
      }
    }
  } catch (e) {}
  render();
}
function personSnapshot(P) { return { name: P.name, y: P.y, m: P.m, d: P.d, hourBranch: P.hourBranch, gender: P.gender }; }
async function saveLastView() {
  try {
    if (state.view === "report" && state.person) await store.set("saju-last", JSON.stringify({ view: "report", tab: state.tab, a: personSnapshot(state.person) }));
    else if (state.view === "compat" && state.person && state.person2) await store.set("saju-last", JSON.stringify({ view: "compat", compatType: state.compatType, a: personSnapshot(state.person), b: personSnapshot(state.person2) }));
  } catch (e) {}
}
async function clearLastView() { try { await store.del("saju-last"); } catch (e) {} }
async function saveProfileList() {
  try { await store.set("saju-profiles", JSON.stringify(state.profiles)); } catch (e) {}
}
function profileFromPerson(P) {
  return { id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), name: P.name, y: P.y, m: P.m, d: P.d, hourBranch: P.hourBranch, gender: P.gender };
}
async function saveCurrentProfile(slot) {
  const P = slot === "2" ? state.person2 : state.person;
  if (!P) return;
  const dup = state.profiles.some(pr => pr.name === P.name && pr.y === P.y && pr.m === P.m && pr.d === P.d && pr.hourBranch === P.hourBranch && pr.gender === P.gender);
  if (!dup) { state.profiles.unshift(profileFromPerson(P)); state.profiles=state.profiles.slice(0,8); await saveProfileList(); }
  render();
}
async function deleteProfile(id) {
  state.profiles = state.profiles.filter(pr => pr.id !== id);
  await saveProfileList();
  render();
}
function loadProfileToForm(id, sfx) {
  if (!id) return;
  const pr = state.profiles.find(x => x.id === id);
  if (!pr) return;
  saveInputs();
  state["name" + sfx] = pr.name; state["y" + sfx] = String(pr.y); state["m" + sfx] = String(pr.m); state["d" + sfx] = String(pr.d);
  state["hour" + sfx] = pr.hourBranch === null ? "" : String(pr.hourBranch);
  state["gender" + sfx] = pr.gender;
  render();
}

async function clearAllSavedData() {
  if (!confirm("이 기기에 저장된 사주 프로필과 마지막 화면을 모두 삭제할까요?")) return;
  state.profiles = [];
  await store.del("saju-profiles");
  await store.del("saju-last");
  state.view = "input"; state.person = null; state.person2 = null; state.compat = null;
  render();
}
async function rememberProfile(P) {
  if (!P) return;
  const snap = profileFromPerson(P);
  const key = x => [x.name,x.y,x.m,x.d,x.hourBranch,x.gender].join('|');
  state.profiles = [snap, ...state.profiles.filter(x => key(x)!==key(snap))].slice(0,8);
  await saveProfileList();
}

