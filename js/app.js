/* ═══════════ 기초 데이터 ═══════════ */
const S10 = "甲乙丙丁戊己庚辛壬癸".split("");
const B12 = "子丑寅卯辰巳午未申酉戌亥".split("");
const KS = { 甲:"갑",乙:"을",丙:"병",丁:"정",戊:"무",己:"기",庚:"경",辛:"신",壬:"임",癸:"계" };
const KB = { 子:"자",丑:"축",寅:"인",卯:"묘",辰:"진",巳:"사",午:"오",未:"미",申:"신",酉:"유",戌:"술",亥:"해" };
const ANIMAL = { 子:"쥐",丑:"소",寅:"호랑이",卯:"토끼",辰:"용",巳:"뱀",午:"말",未:"양",申:"원숭이",酉:"닭",戌:"개",亥:"돼지" };
const STEM_E = { 甲:"木",乙:"木",丙:"火",丁:"火",戊:"土",己:"土",庚:"金",辛:"金",壬:"水",癸:"水" };
const BR_E = { 子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水" };
const E_COLOR = { 木:"#7DB889", 火:"#EA6B5C", 土:"#E5C465", 金:"#DCE1E5", 水:"#6FA3D6" };
const E_KR = { 木:"목", 火:"화", 土:"토", 金:"금", 水:"수" };
const HIDDEN = { 子:["壬","癸"],丑:["癸","辛","己"],寅:["戊","丙","甲"],卯:["甲","乙"],辰:["乙","癸","戊"],巳:["戊","庚","丙"],午:["丙","己","丁"],未:["丁","乙","己"],申:["戊","壬","庚"],酉:["庚","辛"],戌:["辛","丁","戊"],亥:["戊","甲","壬"] };
const HOUR_OPT = [["모름",null],["子 자시 23:00~00:59",0],["丑 축시 01:00~02:59",1],["寅 인시 03:00~04:59",2],["卯 묘시 05:00~06:59",3],["辰 진시 07:00~08:59",4],["巳 사시 09:00~10:59",5],["午 오시 11:00~12:59",6],["未 미시 13:00~14:59",7],["申 신시 15:00~16:59",8],["酉 유시 17:00~18:59",9],["戌 술시 19:00~20:59",10],["亥 해시 21:00~22:59",11]];

/* 12운성 */
const JANGSAENG = { 甲:11,丙:2,戊:2,庚:5,壬:8,乙:6,丁:9,己:9,辛:0,癸:3 };
const UNS = ["장생","목욕","관대","건록","제왕","쇠","병","사","묘","절","태","양"];
const UNS_D = { 장생:"새싹이 트는 자리 — 시작과 성장의 기운", 목욕:"멋과 감성, 다듬어지는 자리 — 유혹과 시행착오도 함께", 관대:"의관을 갖추는 자리 — 자신감과 사회 진출", 건록:"제 밥벌이가 서는 자리 — 자립과 실력", 제왕:"기세의 정점 — 추진력 최고, 독선은 경계", 쇠:"정점 뒤의 원숙 — 관리와 내실의 시기", 병:"기운이 앓는 자리 — 감성적, 남을 돌보는 마음", 사:"움직임이 멎는 자리 — 몰두와 전문성", 묘:"창고에 들어가는 자리 — 저장·수집·재정 감각", 절:"끊어지고 다시 이어지는 자리 — 변화와 재출발", 태:"잉태의 자리 — 구상과 아이디어", 양:"자라나는 자리 — 보호 속의 준비" };
function unseong(dayStem, bIdx) {
  const L = JANGSAENG[dayStem];
  const yang = "甲丙戊庚壬".includes(dayStem);
  return UNS[yang ? (bIdx - L + 12) % 12 : (L - bIdx + 12) % 12];
}

/* 절기 근사 공식 (입춘~소한, ±1일 오차 가능) */
const TERM_M = [2,3,4,5,6,7,8,9,10,11,12,1];
const TERM_C20 = [4.6295,6.3826,5.59,6.318,6.5,7.928,8.35,8.44,9.098,8.218,7.9,6.11];
const TERM_C21 = [3.87,5.63,4.81,5.52,5.678,7.108,7.5,7.646,8.318,7.438,7.18,5.4055];
function termDate(cycleYear, i) {
  const calY = i === 11 ? cycleYear + 1 : cycleYear;
  const C = calY >= 2001 ? TERM_C21[i] : TERM_C20[i];
  const Y = calY % 100;
  const d = Math.floor(Y * 0.2422 + C) - Math.floor(Y / 4);
  return { date: new Date(calY, TERM_M[i] - 1, d), b: (2 + i) % 12 };
}
function termsOfCycle(year) { return Array.from({ length: 12 }, (_, i) => termDate(year, i)); }
function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/* 십신 */
function tenGod(ds, os) {
  const de = Math.floor(ds / 2), oe = Math.floor(os / 2), same = ds % 2 === os % 2;
  if (oe === de) return same ? "비견" : "겁재";
  if (oe === (de + 1) % 5) return same ? "식신" : "상관";
  if (oe === (de + 2) % 5) return same ? "편재" : "정재";
  if (de === (oe + 1) % 5) return same ? "편인" : "정인";
  return same ? "편관" : "정관";
}
const GCAT = { 비견:"비겁",겁재:"비겁",식신:"식상",상관:"식상",편재:"재성",정재:"재성",편관:"관성",정관:"관성",편인:"인성",정인:"인성" };
const GCAT_COLOR = { 비겁:"#DCE1E5", 식상:"#7DB889", 재성:"#E5C465", 관성:"#EA6B5C", 인성:"#6FA3D6" };

/* 합충 관계 */
const CHUNG = b => (b + 6) % 12;
const YUKHAP = { 子:"丑",丑:"子",寅:"亥",亥:"寅",卯:"戌",戌:"卯",辰:"酉",酉:"辰",巳:"申",申:"巳",午:"未",未:"午" };
const WONJIN = { 子:"未",未:"子",丑:"午",午:"丑",寅:"酉",酉:"寅",卯:"申",申:"卯",辰:"亥",亥:"辰",巳:"戌",戌:"巳" };
const GWIMUN = { 子:"酉",酉:"子",丑:"午",午:"丑",寅:"未",未:"寅",卯:"申",申:"卯",辰:"亥",亥:"辰",巳:"戌",戌:"巳" };
const TRI = { 申:0,子:0,辰:0, 寅:1,午:1,戌:1, 巳:2,酉:2,丑:2, 亥:3,卯:3,未:3 };
/* 천간합(干合) — 부부·연인 궁합에서 중요하게 보는 요소 */
const GANHAP_PAIRS = [["甲","己","土"], ["乙","庚","金"], ["丙","辛","水"], ["丁","壬","木"], ["戊","癸","火"]];
function ganhapCheck(sA, sB) {
  for (const [a, b, hwagi] of GANHAP_PAIRS) if ((sA === a && sB === b) || (sA === b && sB === a)) return hwagi;
  return null;
}
/* 형(刑) — 삼형·상형·자형 */
const HYEONG_GROUPS = [["寅", "巳", "申"], ["丑", "戌", "未"]];
const HYEONG_PAIR = { 子: "卯", 卯: "子" };
const JAHYEONG = ["辰", "午", "酉", "亥"];
function hyeongCheck(bA, bB) {
  if (bA === bB && JAHYEONG.includes(bA)) return "자형";
  if (HYEONG_PAIR[bA] === bB) return "상형(무례지형)";
  for (const grp of HYEONG_GROUPS) if (bA !== bB && grp.includes(bA) && grp.includes(bB)) return "삼형";
  return null;
}
const TRI_STAR = [["酉","寅","辰"],["卯","申","戌"],["午","亥","丑"],["子","巳","未"]]; /* [도화,역마,화개] */
const TRI_NAME = ["申子辰 수국","寅午戌 화국","巳酉丑 금국","亥卯未 목국"];

/* 신살 테이블 */
const CHEON_EUL = { 甲:["丑","未"],戊:["丑","未"],庚:["丑","未"],乙:["子","申"],己:["子","申"],丙:["亥","酉"],丁:["亥","酉"],辛:["寅","午"],壬:["巳","卯"],癸:["巳","卯"] };
const MUN_CHANG = { 甲:"巳",乙:"午",丙:"申",丁:"酉",戊:"申",己:"酉",庚:"亥",辛:"子",壬:"寅",癸:"卯" };
const HONG_YEOM = { 甲:"午",乙:"午",丙:"寅",丁:"未",戊:"辰",己:"辰",庚:"戌",辛:"酉",壬:"子",癸:"申" };
const YANG_IN = { 甲:"卯",丙:"午",戊:"午",庚:"酉",壬:"子" };
const GOE_GANG = ["庚辰","庚戌","壬辰","壬戌","戊戌","戊辰"];
const BAEK_HO = ["甲辰","乙未","丙戌","丁丑","戊辰","壬戌","癸丑"];
const HYEON_CHIM = "甲辛卯午未申";

/* 일간 10간 성격 */
const DM_DESC = {
  甲: "【한마디로: 곧게 뻗는 큰 나무 — 리더 기질】 갑목(甲木)은 하늘로 곧게 뻗는 큰 나무입니다. 시작하는 힘과 리더십, 굽히지 않는 자존심이 본성이라 앞에서 끌고 가는 자리에서 빛나지만, 꺾이는 것을 못 견뎌 유연함이 과제입니다.",
  乙: "【한마디로: 어디서든 살아남는 화초 — 유연한 생활력】 을목(乙木)은 담쟁이와 화초의 유연한 나무입니다. 환경에 적응하며 어디서든 살아남는 생활력과 섬세한 감각이 강점이고, 부드러워 보여도 목표를 향해 감아 올라가는 끈기가 있습니다.",
  丙: "【한마디로: 숨김없는 태양 — 밝고 화통한 인싸】 병화(丙火)는 하늘의 태양입니다. 밝고 화통하며 숨김이 없어 사람들 가운데서 존재감이 큽니다. 베풀기를 좋아하고 뒤끝이 없지만, 기복과 싫증을 다스리는 것이 과제입니다.",
  丁: "【한마디로: 어둠을 밝히는 촛불 — 세심한 외유내강】 정화(丁火)는 어둠을 밝히는 촛불과 등대의 불입니다. 겉은 온화하고 속은 뜨거우며, 한 사람 한 사람을 비추는 세심한 배려와 집중력이 강점입니다. 속으로 삭이는 성향은 풀 곳이 필요합니다.",
  戊: "【한마디로: 흔들리지 않는 큰 산 — 묵직한 신뢰】 무토(戊土)는 큰 산의 흙입니다. 묵직한 신뢰감과 중재력, 쉽게 흔들리지 않는 뚝심이 본성입니다. 품이 넓어 사람이 기대지만, 속마음을 잘 드러내지 않고 변화에 느린 면이 있습니다.",
  己: "【한마디로: 곡식을 기르는 밭 — 실속 있는 포용】 기토(己土)는 곡식을 기르는 밭의 흙입니다. 실속 있고 꼼꼼하며 무엇이든 받아들여 길러내는 포용력이 강점입니다. 겉은 순해 보여도 자기 기준이 분명하고, 걱정을 쌓아두는 편입니다.",
  庚: "【한마디로: 단단한 무쇠 — 결단과 의리의 행동파】 경금(庚金)은 원석과 무쇠의 금입니다. 결단력과 의리, 맺고 끊음이 분명한 강직함이 본성입니다. 한번 정하면 밀어붙이는 추진력이 있으나 표현이 직설적이라 오해를 살 수 있습니다.",
  辛: "【한마디로: 세공된 보석 — 예리하고 세련된 완벽주의】 신금(辛金)은 세공을 마친 보석의 금입니다. 예리한 분별력과 세련된 감각, 완벽을 향한 자기 기준이 강점입니다. 겉은 차분해도 자존심이 매우 강해 상처를 오래 기억하는 편입니다.",
  壬: "【한마디로: 큰 바다 — 스케일 크고 자유로운 지혜】 임수(壬水)는 바다와 큰 강의 물입니다. 스케일 큰 사고와 지혜, 어디로든 흘러가는 자유로움이 본성입니다. 포용력이 크지만 한곳에 매이는 것을 답답해해 변화가 필요한 사람입니다.",
  癸: "【한마디로: 스며드는 샘물 — 조용한 직관과 공감】 계수(癸水)는 이슬비와 샘물의 물입니다. 조용히 스며드는 지혜와 직관, 섬세한 공감 능력이 강점입니다. 겉은 유순해도 속은 깊고 치밀하며, 감정을 오래 담아두는 성향이 있습니다."
};

/* 60갑자 일주 한줄 풀이 */
const DAYJU = {
  甲子:"큰 나무가 찬 샘물 위에 선 상 — 총명하고 이상이 높으며 새 길을 여는 개척자형입니다.",
  乙丑:"언 땅의 화초 — 인내로 버텨 늦게 피는 대기만성형, 실속과 끈기가 남다릅니다.",
  丙寅:"떠오르는 아침 해 — 기세 좋고 화통하며 어디서든 눈에 띄는 스타형 일주입니다.",
  丁卯:"봄밤의 촛불 — 감성과 예술적 감각이 섬세하고 사람을 편안하게 하는 매력이 있습니다.",
  戊辰:"용을 품은 큰 산 — 스케일 크고 자존심 강하며 큰 조직·큰 판에서 능력을 발휘합니다.",
  己巳:"불기운 품은 옥토 — 영리하고 실속 있으며 배움과 재주가 많은 일주입니다.",
  庚午:"용광로 속의 무쇠 — 단련될수록 강해지는 상, 열정과 명예욕이 뚜렷합니다.",
  辛未:"흙 속의 보석 — 겉은 온화하나 속은 단단하고, 늦게 진가가 드러나는 형입니다.",
  壬申:"바위샘에서 솟는 큰물 — 두뇌 회전이 빠르고 임기응변과 활동력이 탁월합니다.",
  癸酉:"바위틈 맑은 샘 — 예리하고 깔끔하며 전문성으로 승부하는 일주입니다.",
  甲戌:"가을 산의 큰 나무 — 의리 있고 책임감 강하며 재물 창고를 깔고 앉은 상입니다.",
  乙亥:"물 위에 뜬 연꽃 — 유연하고 총명하며 어디서든 도움을 받는 인덕이 있습니다.",
  丙子:"호수에 비친 태양 — 화려함과 냉철함이 공존, 인기와 매력이 따르는 일주입니다.",
  丁丑:"새벽의 등불 — 묵묵히 제 몫을 지키는 성실함, 속정이 깊은 외유내강형입니다.",
  戊寅:"호랑이 사는 큰 산 — 배포와 리더십이 있고 자수성가의 기운이 강합니다.",
  己卯:"새싹 돋는 봄 밭 — 부지런하고 섬세하나 속을 잘 드러내지 않는 실속파입니다.",
  庚辰:"용이 품은 강철 — 괴강의 기상, 승부욕과 카리스마로 큰일을 감당하는 그릇입니다.",
  辛巳:"불에 제련되는 보석 — 시련 속에 빛나는 형, 총명하고 명예를 중시합니다.",
  壬午:"한낮의 큰 강물 — 지혜와 열정이 만나 재물 감각이 뛰어나고 인기가 따릅니다.",
  癸未:"메마른 땅의 단비 — 헌신적이고 온화하며 남을 살리는 데서 보람을 찾습니다.",
  甲申:"바위산 위 소나무 — 굴곡을 이기며 크는 상, 임기응변과 활동력이 좋습니다.",
  乙酉:"바위틈의 화초 — 예민한 미적 감각과 승부 근성, 전문 기술로 서는 형입니다.",
  丙戌:"노을 지는 산의 해 — 정이 많고 신앙심·직관이 발달, 베풀며 사는 상입니다.",
  丁亥:"밤바다의 등대 — 조용한 카리스마, 귀인의 도움과 총명함을 갖춘 귀한 일주입니다.",
  戊子:"물을 품은 큰 산 — 겉은 진중하고 속은 재물 감각이 흐르는 실속형입니다.",
  己丑:"한겨울의 논밭 — 근면 성실의 표본, 묵묵히 쌓아 결국 이루는 저력이 있습니다.",
  庚寅:"숲을 가르는 도끼 — 개척과 결단의 상, 역마 기운으로 움직일수록 성취합니다.",
  辛卯:"덤불 속의 보석 — 섬세하고 예리하며 재물 인연이 빠른 편이나 신경이 예민합니다.",
  壬辰:"용이 노는 큰물 — 괴강의 스케일, 두뇌와 배포로 큰물에서 노는 상입니다.",
  癸巳:"아지랑이 피는 샘 — 총명하고 눈치가 빠르며 귀인운을 타고난 일주입니다.",
  甲午:"여름 들판의 큰 나무 — 표현력과 열정이 넘치고 사람을 끄는 매력이 강합니다.",
  乙未:"마른 흙의 잔디 — 끈질긴 생명력, 온화해 보여도 뿌리 깊은 고집이 있습니다.",
  丙申:"서산에 걸린 태양 — 활동 반경이 넓고 재물 감각과 순발력이 뛰어납니다.",
  丁酉:"보석을 비추는 촛불 — 총명하고 단정하며 문서·학문과 인연이 깊은 일주입니다.",
  戊戌:"첩첩산중의 큰 산 — 신념과 뚝심의 화신, 종교·철학적 깊이가 있는 상입니다.",
  己亥:"물가의 기름진 밭 — 유연한 처세와 재물 감각, 역마의 활동력을 갖췄습니다.",
  庚子:"찬 물에 씻긴 무쇠 — 머리가 비상하고 언변이 예리한 지장(智將)형입니다.",
  辛丑:"흙에 묻힌 원석 — 인내로 다듬어져 늦을수록 귀해지는 보석의 상입니다.",
  壬寅:"호랑이 등에 탄 큰물 — 배포와 자유혼, 스케일 있게 움직이는 활동가입니다.",
  癸卯:"봄비 내리는 새벽 — 온화한 인상과 총명함, 문창의 기운으로 배움이 빛납니다.",
  甲辰:"용의 땅에 선 거목 — 백호의 강한 기운, 큰 뜻을 품고 굴곡을 이겨내는 상입니다.",
  乙巳:"불 곁의 화초 — 화려한 언변과 재주, 변화 속에서 기회를 잡는 형입니다.",
  丙午:"정오의 태양 — 양인의 기세, 존재감과 추진력이 극에 달한 불꽃 일주입니다.",
  丁未:"사막의 모닥불 — 은근한 열정과 고집, 예술·종교적 감성이 깊습니다.",
  戊申:"광산을 품은 산 — 재주가 많고 활동적이며 식복과 역마를 함께 갖췄습니다.",
  己酉:"수확 끝난 가을 밭 — 깔끔하고 분석적이며 전문 지식으로 인정받는 상입니다.",
  庚戌:"가을 산의 강철 — 괴강의 의협심, 맺고 끊음이 분명한 승부사입니다.",
  辛亥:"맑은 물에 씻긴 보석 — 총명하고 언변이 유려하며 멀리 나가 귀해지는 상입니다.",
  壬子:"한겨울 큰 바다 — 양인의 깊은 물, 지혜와 배짱이 크고 속을 알기 어렵습니다.",
  癸丑:"얼어붙은 샘 — 백호의 인내, 묵묵히 견뎌 큰일을 이루는 저력의 일주입니다.",
  甲寅:"제 자리에 선 거목 — 건록의 자립심, 굽히지 않는 소신과 리더십의 표본입니다.",
  乙卯:"봄 들판의 화초 군락 — 생명력과 인맥이 왕성하고 어디서든 뿌리내립니다.",
  丙辰:"구름 위의 태양 — 포부가 크고 식복이 있으며 베풀수록 커지는 상입니다.",
  丁巳:"횃불이 타오르는 상 — 겉은 차분해도 속은 뜨거운 승부사, 직감이 예리합니다.",
  戊午:"화산의 큰 산 — 양인의 폭발력, 한번 움직이면 크게 이루는 에너지입니다.",
  己未:"한여름의 밭 — 은근과 끈기의 화신, 내 사람은 끝까지 챙기는 속정이 있습니다.",
  庚申:"제련소의 강철 — 건록의 자수성가, 결단과 실행이 빠른 행동파입니다.",
  辛酉:"진열장의 보석 — 완벽주의와 예리함의 극치, 전문성으로 홀로 서는 상입니다.",
  壬戌:"산정호수의 물 — 괴강의 깊이, 지략과 뚝심으로 큰 조직을 이끄는 그릇입니다.",
  癸亥:"끝없는 큰 바다 — 육십갑자의 마지막, 깊은 지혜와 자유혼을 품은 철학자형입니다."
};

/* ═══════════ 상용판 정밀 보조 계산 ═══════════ */
const HIDDEN_WEIGHT = { 子:[.35,.65],丑:[.2,.25,.55],寅:[.15,.25,.6],卯:[.25,.75],辰:[.2,.25,.55],巳:[.15,.25,.6],午:[.3,.2,.5],未:[.25,.2,.55],申:[.15,.25,.6],酉:[.25,.75],戌:[.2,.25,.55],亥:[.15,.25,.6] };
function normDeg(x){ return ((x%360)+360)%360; }
function julianFromDate(dt){ return dt.getTime()/86400000 + 2440587.5; }
function solarLongitude(dt){
  const T=(julianFromDate(dt)-2451545.0)/36525;
  const L0=normDeg(280.46646+36000.76983*T+0.0003032*T*T);
  const M=normDeg(357.52911+35999.05029*T-0.0001537*T*T);
  const Mr=M*Math.PI/180;
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(Mr)+(0.019993-0.000101*T)*Math.sin(2*Mr)+0.000289*Math.sin(3*Mr);
  const omega=(125.04-1934.136*T)*Math.PI/180;
  return normDeg(L0+C-0.00569-0.00478*Math.sin(omega));
}
function angleDiff(a,b){ return ((a-b+540)%360)-180; }
function exactTermDate(cycleYear,i){
  const rough=termDate(cycleYear,i).date;
  const targets=[315,345,15,45,75,105,135,165,195,225,255,285];
  const target=targets[i];
  let lo=new Date(rough.getTime()-3*86400000), hi=new Date(rough.getTime()+3*86400000);
  for(let k=0;k<45;k++){
    const mid=new Date((lo.getTime()+hi.getTime())/2);
    if(angleDiff(solarLongitude(mid),target)<0) lo=mid; else hi=mid;
  }
  return {date:new Date((lo.getTime()+hi.getTime())/2),b:(2+i)%12,longitude:target,method:'태양 황경 근사'};
}
function exactTermsOfCycle(year){ return Array.from({length:12},(_,i)=>exactTermDate(year,i)); }
function weightedElementProfile(pillars){
  const raw={木:0,火:0,土:0,金:0,水:0};
  pillars.forEach(p=>{
    const posFactor=p.pos==='월주'?1.35:p.pos==='일주'?1.1:1;
    raw[STEM_E[p.stem]]+=1.0*posFactor;
    const ws=HIDDEN_WEIGHT[p.branch]||[];
    p.hidden.forEach((h,i)=>raw[STEM_E[h]]+=(ws[i]||1/p.hidden.length)*posFactor);
  });
  const total=Object.values(raw).reduce((a,b)=>a+b,0)||1;
  const percent={}; Object.entries(raw).forEach(([e,v])=>percent[e]=Math.round(v/total*1000)/10);
  return {raw,percent,total};
}
function rootStrength(dayStem,pillars){
  const de=STEM_E[dayStem]; let root=0;
  pillars.forEach(p=>{ const ws=HIDDEN_WEIGHT[p.branch]||[]; p.hidden.forEach((h,i)=>{if(STEM_E[h]===de)root+=(ws[i]||.3)*(p.pos==='월주'?1.5:1);}); });
  return Math.min(100,Math.round(root/2.2*100));
}
function climateNeed(monthBranch){
  if(['亥','子','丑'].includes(monthBranch)) return {need:'火',label:'한랭',why:'겨울·한랭 월령이라 온기를 우선 살핍니다.'};
  if(['巳','午','未'].includes(monthBranch)) return {need:'水',label:'조열',why:'여름·조열 월령이라 수기와 습윤을 우선 살핍니다.'};
  if(['寅','卯','辰'].includes(monthBranch)) return {need:'金',label:'생장',why:'봄의 생장 기운을 정리하고 형태를 잡아줄 금기를 보조 후보로 봅니다.'};
  return {need:'木',label:'수렴',why:'가을의 수렴 기운을 순환시킬 목기를 보조 후보로 봅니다.'};
}
function strengthBand(v){
  return v>=72?'극신강':v>=60?'신강':v>=53?'중화신강':v>=48?'중화':v>=39?'중화신약':v>=25?'신약':'극신약';
}
function strengthGroup(label){return label.includes('강')?'강':label.includes('약')?'약':'중화';}
function isStrongLabel(label){return strengthGroup(label)==='강';}
function isWeakLabel(label){return strengthGroup(label)==='약';}
function strengthHeadline(label){
  if(label==='극신강')return '기운이 매우 강한 사주 — 힘을 밖으로 쓰고 조율하는 장치가 중요합니다';
  if(label==='신강')return '기운이 센 사주 — 추진력을 일·표현·책임으로 쓰면 강점이 됩니다';
  if(label==='중화신강')return '균형권 안에서도 강한 쪽 — 뿌리와 세력이 있어 주도성이 살아납니다';
  if(label==='중화')return '균형 잡힌 사주 — 한쪽으로 크게 치우치지 않는 안정형입니다';
  if(label==='중화신약')return '균형권 안에서도 여린 쪽 — 도움과 회복 여건이 있을 때 힘이 잘 붙습니다';
  if(label==='신약')return '기운이 여린 사주 — 무리보다 지원·회복·페이스 조절이 중요합니다';
  return '기운이 매우 여린 사주 — 부담을 줄이고 기반과 도움을 먼저 확보해야 합니다';
}
function strengthBody(label){
  if(isStrongLabel(label))return label==='중화신강'?'월령만 보면 약할 수 있어도 뿌리·동료 세력·생조가 받쳐 중화보다 신강 쪽에 가깝습니다. 강한 힘을 과장하지 않고 실제 활동으로 흘려보내는 것이 중요합니다.':'일간을 돕는 뿌리와 세력이 충분한 편입니다. 식상·재성·관성처럼 힘을 밖으로 쓰는 시기에 성취가 커질 수 있습니다.';
  if(label==='중화')return '일간과 주변 기운의 균형이 비교적 고른 명식입니다. 특정 한 요소보다 실제 환경과 선택의 영향을 함께 보는 편이 정확합니다.';
  if(label==='중화신약')return '완전히 약한 명식은 아니지만 월령·설기·극의 영향을 받기 쉬워 중화보다 신약 쪽에 가깝습니다. 도움을 받는 시기와 회복 여건이 중요합니다.';
  return '일간이 주변 기운에 비해 여린 편입니다. 인성·비겁처럼 나를 돕는 조건이 있을 때 힘이 붙고, 큰 기회일수록 페이스 조절이 성패를 가릅니다.';
}
function tenGodElementMap(dayStem){
  const order=['木','火','土','金','水'],de=STEM_E[dayStem],i=order.indexOf(de);
  return {비겁:de,식상:order[(i+1)%5],재성:order[(i+2)%5],관성:order[(i+3)%5],인성:order[(i+4)%5]};
}
function childSymbolInfo(P){
  const map=tenGodElementMap(P.p.dayStem);
  const primary=P.gender==='여'?'식상':'관성';
  const element=map[primary];
  return {primary,element,count:P.p.godCount[primary]||0,percent:P.p.weightedEl.percent[element]||0,hourKnown:P.hourBranch!==null,
    note:P.gender==='여'?'이 리포트는 여명에서 식상을 자녀 상징의 1차 참고축으로 봅니다.':'이 리포트는 남명에서 관성을 1차 참고축으로 쓰되, 식상과 시주를 함께 보는 유파 차이를 병기합니다.'};
}
function strengthConsensus(methods,finalLabel){
  const vals=Object.values(methods),strong=vals.filter(v=>isStrongLabel(v.band)).length,weak=vals.filter(v=>isWeakLabel(v.band)).length;
  if(strong>=2)return `세 판정 중 ${strong}개가 신강 계열이라 최종적으로 ${finalLabel} 쪽에 무게를 두었습니다.`;
  if(weak>=2)return `세 판정 중 ${weak}개가 신약 계열이라 최종적으로 ${finalLabel} 쪽에 무게를 두었습니다.`;
  return `월령·세력·통근 결과가 엇갈려 ${finalLabel} 경계형으로 표시했습니다.`;
}
function assessmentConfidence(p,birth,last,nextT){
  const near=Math.min(Math.abs(birth-last.date),Math.abs(nextT.date-birth))/3600000;
  let score=p.pillars.length===4?90:74;
  if(near<24)score-=25; else if(near<48)score-=12;
  const disagreement=p.strengthMethods?new Set(Object.values(p.strengthMethods).map(x=>strengthGroup(x.band))).size:1;
  if(disagreement>=3)score-=15; else if(disagreement===2)score-=7;
  score=Math.max(35,Math.min(96,Math.round(score)));
  return {score,label:score>=85?'높음':score>=68?'보통':score>=50?'주의':'낮음',nearTermHours:Math.round(near),hourKnown:p.pillars.length===4,disagreement};
}
/* ═══════════ 만세력 계산 ═══════════ */
function calcPillars({ y, m, d, hourBranch, gender }) {
  const birth = new Date(y, m - 1, d, 12);
  const all = [...exactTermsOfCycle(y - 1), ...exactTermsOfCycle(y)].sort((a,b)=>a.date-b.date);
  let last=all[0],nextT=all[all.length-1];
  for(const t of all){if(t.date<=birth)last=t;else{nextT=t;break;}}
  const ipchun=exactTermDate(y,0).date;
  const solarYear=birth>=ipchun?y:y-1;
  const ys=(((solarYear-4)%10)+10)%10,yb=(((solarYear-4)%12)+12)%12;
  const mb=last.b,moff=(mb-2+12)%12,ms=((ys%5)*2+2+moff)%10;
  const dIdx=(((jdn(y,m,d)-2451545+54)%60)+60)%60,ds=dIdx%10,db=dIdx%12;
  let pillars=[];
  if(hourBranch!==null&&hourBranch!==undefined){const hs=((ds%5)*2+hourBranch)%10;pillars.push({pos:'시주',meaning:'말년 · 자녀',stem:S10[hs],branch:B12[hourBranch],sIdx:hs,bIdx:hourBranch});}
  pillars.push({pos:'일주',meaning:'나 · 배우자',stem:S10[ds],branch:B12[db],sIdx:ds,bIdx:db});
  pillars.push({pos:'월주',meaning:'청년 · 사회',stem:S10[ms],branch:B12[mb],sIdx:ms,bIdx:mb});
  pillars.push({pos:'년주',meaning:'초년 · 뿌리',stem:S10[ys],branch:B12[yb],sIdx:ys,bIdx:yb});
  pillars=pillars.map(x=>({...x,sg:x.pos==='일주'?'일원':tenGod(ds,x.sIdx),bg:tenGod(ds,S10.indexOf(HIDDEN[x.branch][HIDDEN[x.branch].length-1])),uns:unseong(S10[ds],x.bIdx),hidden:HIDDEN[x.branch]}));
  const el={木:0,火:0,土:0,金:0,水:0};pillars.forEach(x=>{el[STEM_E[x.stem]]++;el[BR_E[x.branch]]++;});
  const weightedEl=weightedElementProfile(pillars);
  const godCount={비겁:0,식상:0,재성:0,관성:0,인성:0};pillars.forEach(x=>{if(x.pos!=='일주')godCount[GCAT[x.sg]]++;godCount[GCAT[x.bg]]++;});
  const isHelp=c=>c==='비겁'||c==='인성';
  const monthP=pillars.find(x=>x.pos==='월주'),dayP=pillars.find(x=>x.pos==='일주');
  const deukryeong=isHelp(GCAT[monthP.bg]),deukji=isHelp(GCAT[dayP.bg]);
  let helperCount=0,totalUnits=0;pillars.forEach(x=>{if(x.pos!=='일주'){totalUnits++;if(isHelp(GCAT[x.sg]))helperCount++;}totalUnits++;if(isHelp(GCAT[x.bg]))helperCount++;});
  const deukse=helperCount>=Math.ceil(totalUnits/2);
  const root=rootStrength(S10[ds],pillars);
  const de=STEM_E[S10[ds]],helpPct=weightedEl.percent[de]+weightedEl.percent[['木','火','土','金','水'][(['木','火','土','金','水'].indexOf(de)+4)%5]];
  const seasonalScore=Math.max(5,Math.min(95,50+(deukryeong?28:-20)+(deukji?10:-6)));
  const forceScore=Math.max(5,Math.min(95,Math.round(helpPct*1.45)));
  const rootScore=Math.max(5,Math.min(95,Math.round(root)));
  const score=Math.round(seasonalScore*.45+forceScore*.35+rootScore*.20);
  const strengthMethods={월령법:{score:seasonalScore,band:strengthBand(seasonalScore)},세력법:{score:forceScore,band:strengthBand(forceScore)},통근법:{score:rootScore,band:strengthBand(rootScore)}};
  let strength=strengthBand(score);
  const methodGroups=Object.values(strengthMethods).map(x=>strengthGroup(x.band));
  const strongVotes=methodGroups.filter(x=>x==='강').length,weakVotes=methodGroups.filter(x=>x==='약').length;
  if(strength==='중화'&&strongVotes>=2)strength='중화신강';
  if(strength==='중화'&&weakVotes>=2)strength='중화신약';
  if(strength==='중화신강'&&weakVotes>=2)strength='중화';
  if(strength==='중화신약'&&strongVotes>=2)strength='중화';
  const xs=dIdx-(dIdx%10),gongmang=[B12[(xs%12+10)%12],B12[(xs%12+11)%12]];
  const forward=(ys%2===0)===(gender==='남');
  const gapDays=(forward?nextT.date-birth:birth-last.date)/86400000;
  const dNum=Math.min(10,Math.max(1,Math.round(gapDays/3)));
  let mIdx60=0;for(let i=0;i<60;i++)if(i%10===ms&&i%12===mb){mIdx60=i;break;}
  const daeun=Array.from({length:9},(_,i)=>{const idx=((mIdx60+(forward?i+1:-(i+1)))%60+60)%60;return{age:dNum+i*10,sIdx:idx%10,bIdx:idx%12,stem:S10[idx%10],branch:B12[idx%12]};});
  const result={pillars,el,weightedEl,godCount,score,strength,strengthMethods,rootScore,deukryeong,deukji,deukse,helperCount,totalUnits,dayStem:S10[ds],dayBranch:B12[db],dayIdx:dIdx,daeun,forward,dNum,gongmang,solarYear,termInfo:{last:last.date,next:nextT.date,method:'태양 황경 근사',gapDays:Math.round(gapDays*10)/10}};
  result.confidence=assessmentConfidence(result,birth,last,nextT);
  return result;
}

/* 용신 다중 추정 — 억부·조후·통관 후보를 분리 */
function yongsin(p) {
  const EORD=['木','火','土','金','水'],de=STEM_E[p.dayStem],i=EORD.indexOf(de);
  const sik=EORD[(i+1)%5],jae=EORD[(i+2)%5],gwan=EORD[(i+3)%5],insu=EORD[(i+4)%5];
  const strong=isStrongLabel(p.strength);
  let eokbu=strong?[sik,jae,gwan].sort((a,b)=>p.weightedEl.percent[a]-p.weightedEl.percent[b]):p.strength==='중화'?EORD.filter(e=>e!==de).sort((a,b)=>p.weightedEl.percent[a]-p.weightedEl.percent[b]):[insu,de];
  const month=p.pillars.find(x=>x.pos==='월주').branch,climate=climateNeed(month);
  const dominant=Object.entries(p.weightedEl.percent).sort((a,b)=>b[1]-a[1])[0][0];
  const domI=EORD.indexOf(dominant),tonggwan=EORD[(domI+1)%5];
  const votes={};[[eokbu[0],3],[climate.need,2],[tonggwan,1]].forEach(([e,w])=>votes[e]=(votes[e]||0)+w);
  const ranked=Object.entries(votes).sort((a,b)=>b[1]-a[1]);
  const els=ranked.slice(0,2).map(x=>x[0]);
  const agree=ranked[0][1]>=5?'높음':ranked[0][1]>=3?'보통':'낮음';
  return {els,confidence:agree,eokbu:{els:eokbu.slice(0,2),why:strong?'강한 일간의 기운을 식상·재성·관성으로 흘려보내는 후보입니다.':p.strength==='중화'?'과소한 오행을 보완하는 균형 후보입니다.':'약한 일간을 인성·비겁으로 돕는 후보입니다.'},johu:{els:[climate.need],label:climate.label,why:climate.why},tonggwan:{els:[tonggwan],why:`가장 강한 ${E_KR[dominant]} 기운이 막히지 않도록 다음 순환 오행인 ${E_KR[tonggwan]} 기운을 통관 후보로 봅니다.`},why:`억부·조후·통관 세 관점을 비교한 결과 ${els.map(e=>E_KR[e]+'('+e+')').join('·')}이 우선 후보입니다. 판정 일치도는 ${agree}이며, 하나의 오행을 절대적인 행운 요소로 단정하지 않습니다.`};
}
const ELEM_TIP = {
  木: "동쪽 · 초록/청색 · 숲과 식물 · 아침 시간 · 교육/기획 분야",
  火: "남쪽 · 붉은색 · 밝은 조명과 햇빛 · 활동적 운동 · 방송/영업 분야",
  土: "중앙 · 노란/갈색 · 흙과 산 · 규칙적 생활 · 부동산/중개 분야",
  金: "서쪽 · 흰색/금속색 · 정리정돈 · 금속 액세서리 · 금융/기계 분야",
  水: "북쪽 · 검정/남색 · 물가와 목욕 · 독서와 사색 · 연구/유통 분야"
};

/* ═══════════ 격국(格局) ═══════════ */
const GYEOK_INFO = {
  정관격: { easy: "한마디로: 모범생 그릇 — 조직에서 신용으로 올라가는 타입", desc: "월지에 정관의 기운이 뿌리내린 격 — 반듯한 원칙과 신용으로 서는 그릇입니다. 조직·제도권 안에서 정공법으로 갈 때 격이 가장 잘 삽니다.", need: "재성(정관을 낳는 뿌리)과 인성(정관을 지키는 옷)이 상신 — 이 둘이 온전하면 귀격, 상관에게 정관이 다치면 파격에 가까워집니다." },
  편관격: { easy: "한마디로: 해결사 그릇 — 위기를 뚫을 때마다 급이 오르는 타입", desc: "월지에 편관(칠살)의 기운이 뿌리내린 격 — 압박을 뚫고 나가는 힘과 카리스마로 서는 그릇입니다. 위기관리 능력이 곧 실력이 되는 구조입니다.", need: "식신으로 살을 다스리는 「식신제살」이나 인성으로 바꾸는 「살인상생」이 상신 — 갖춰지면 강한 리더, 없으면 거칠고 소모적이기 쉽습니다." },
  정재격: { easy: "한마디로: 알뜰살뜰 그릇 — 성실하게 벌어 착실히 모으는 타입", desc: "월지에 정재의 기운이 뿌리내린 격 — 성실하게 벌어 차곡차곡 쌓는 안정형 재물 그릇입니다. 근면함이 곧 자산이 되는 구조입니다.", need: "식상(재를 낳는 샘)이 상신 — 비겁이 지나치게 많으면 재를 다투는 파격 위험이 있습니다." },
  편재격: { easy: "한마디로: 사업가 그릇 — 크게 굴리고 크게 버는 타입", desc: "월지에 편재의 기운이 뿌리내린 격 — 굴리고 확장하는 스케일 큰 재물 그릇입니다. 사업·투자·유통의 감각이 타고난 구조입니다.", need: "식상이 상신 — 신약한데 편재가 너무 많으면 몸이 재물을 못 이기는 「재다신약」 파격이 될 수 있습니다." },
  식신격: { easy: "한마디로: 재능 그릇 — 잘하는 것이 곧 밥이 되는 복 있는 타입", desc: "월지에 식신의 기운이 뿌리내린 격 — 표현하고 만들어내는 재능이 밥이 되는 그릇입니다. 느긋하고 낙천적인 복(福)의 구조입니다.", need: "재성으로 결실을 돈으로 바꾸는 「식신생재」가 상신 — 편인이 식신을 극하면(도식) 파격이 됩니다." },
  상관격: { easy: "한마디로: 끼쟁이 그릇 — 말과 아이디어로 이름을 얻는 타입", desc: "월지에 상관의 기운이 뿌리내린 격 — 끼와 언변, 개혁의 기운이 두드러진 그릇입니다. 틀을 깨는 재주로 이름을 얻는 구조입니다.", need: "재성(상관생재)이나 인성(상관패인)이 상신 — 이 중 하나가 받쳐줘야 재주가 실속으로 이어집니다." },
  정인격: { easy: "한마디로: 공부 그릇 — 배움과 문서 복을 타고난 타입", desc: "월지에 정인의 기운이 뿌리내린 격 — 배움과 문서, 보호받는 복이 두드러진 그릇입니다. 학문·자격·행정과 인연이 깊은 구조입니다.", need: "관성(인성을 낳는 뿌리)이 상신 — 재성이 인성을 강하게 극하면 파격에 가까워집니다." },
  편인격: { easy: "한마디로: 전문가 그릇 — 남다른 재주로 홀로 서는 타입", desc: "월지에 편인의 기운이 뿌리내린 격 — 특수한 재주와 직관, 남다른 전문성이 두드러진 그릇입니다. 대체로 홀로 파고드는 깊이가 있습니다.", need: "관살이 상신 — 식신을 심하게 극하면(도식) 재능이 겉돌기 쉬우니 꾸준한 실행이 관건입니다." },
  건록격: { easy: "한마디로: 자수성가 그릇 — 제 힘으로 밥벌이를 세우는 타입", desc: "월지가 일간 자신의 록(祿)에 해당하는 격 — 제 힘으로 서는 자립의 그릇입니다. 남에게 기대지 않고 스스로 밥벌이를 세우는 구조입니다.", need: "식상·재성·관성으로 힘을 적절히 흘려보내는 것이 상신 — 비겁만 왕성하면 고집과 경쟁으로 소모될 수 있습니다." },
  겁재격: { easy: "한마디로: 승부사 그릇 — 경쟁 속에서 크는 타입", desc: "월지에 겁재의 기운이 뿌리내린 격 — 동료와 경쟁 속에서 크는 그릇입니다. 승부욕과 배포가 강점이나 재물이 나뉘는 기운을 함께 지닙니다.", need: "식상이나 관성으로 힘을 다스리는 것이 상신 — 비겁이 지나치면 다툼과 지출로 소모되기 쉽습니다." },
  양인격: { easy: "한마디로: 돌파형 그릇 — 큰 성취와 큰 굴곡을 함께 품은 타입", desc: "월지가 일간의 양인(제왕)에 해당하는 격 — 칼 같은 추진력과 승부 기질이 두드러진 그릇입니다. 큰 성취와 큰 굴곡을 함께 품습니다.", need: "관살로 날을 다듬는 것이 상신 — 관살 없이 비겁·양인만 강하면 극단으로 치우치기 쉽습니다." }
};
function gyeokguk(p) {
  const monthP = p.pillars.find(x => x.pos === "월주");
  const dayStem = p.dayStem;
  const primary = monthP.hidden[monthP.hidden.length - 1];
  const god = tenGod(S10.indexOf(dayStem), S10.indexOf(primary));
  const yang = "甲丙戊庚壬".includes(dayStem);
  const name = god === "비견" ? "건록격" : god === "겁재" ? (yang ? "양인격" : "겁재격") : god + "격";
  const info = GYEOK_INFO[name] || { desc: `월지 정기가 ${god}에 해당하는 격입니다.`, need: "" };
  return { name, god, monthHidden: primary, ...info };
}

/* 신살 판정 */
function calcSinsal(p) {
  const out = [];
  const branches = p.pillars.map(x => x.branch);
  const yearB = p.pillars[p.pillars.length - 1].branch, dayB = p.dayBranch, ds = p.dayStem;
  const add = (n, c, d) => out.push({ n, c, d });
  /* 삼합 기준 도화/역마/화개 (년지+일지) */
  [["도화", 0, "#EA6B5C", "매력과 인기의 별 — 사람의 눈길을 끌고 호감을 삽니다. 영업·대인 업무의 큰 무기."],
   ["역마", 1, "#6FA3D6", "이동과 확장의 별 — 움직이고 나갈수록 기회가 열립니다. 출장·이동 많은 일과 궁합."],
   ["화개", 2, "#B6BEC6", "예술과 학문의 별 — 홀로 파고드는 깊이, 종교·철학·연구와 인연."]].forEach(([name, si, color, desc]) => {
    const hits = [];
    [yearB, dayB].forEach(base => {
      const star = TRI_STAR[TRI[base]][si];
      branches.forEach((b, bi) => { if (b === star) hits.push(p.pillars[bi].pos); });
    });
    const uq = [...new Set(hits)];
    if (uq.length) add(name + "살", color, desc + ` (${uq.join("·")})`);
  });
  /* 천을귀인 */
  const ce = CHEON_EUL[ds].filter(b => branches.includes(b));
  if (ce.length) add("천을귀인", "#E5C465", `최고 길신 — 위기마다 도와주는 귀인이 나타나는 자리(${ce.join("·")}). 인덕의 표식입니다.`);
  /* 문창귀인 */
  if (branches.includes(MUN_CHANG[ds])) add("문창귀인", "#6FA3D6", "학문과 문서의 별 — 글·시험·자격·기획에서 남보다 빠른 이해력을 줍니다.");
  /* 홍염 */
  if (branches.includes(HONG_YEOM[ds])) add("홍염살", "#EA6B5C", "다정한 매력과 정(情) — 부드러운 호감형 분위기로 사람이 따릅니다.");
  /* 양인 */
  if (YANG_IN[ds] && branches.includes(YANG_IN[ds])) add("양인살", "#EA6B5C", "칼 같은 추진력의 별 — 승부처에서 폭발하는 힘. 전문 기술·의료·군경과도 인연.");
  /* 괴강 */
  p.pillars.forEach(x => { if (GOE_GANG.includes(x.stem + x.branch)) add("괴강살", "#DCE1E5", `${x.pos} ${x.stem}${x.branch} — 우두머리의 기상. 총명하고 배짱 있으나 극단을 오갈 수 있어 중심이 중요.`); });
  /* 백호 */
  p.pillars.forEach(x => { if (BAEK_HO.includes(x.stem + x.branch)) add("백호살", "#EA6B5C", `${x.pos} ${x.stem}${x.branch} — 강렬한 에너지의 살. 운전·수술·과로 등 몸 쓰는 일에 평소 주의를.`); });
  /* 현침 */
  const hc = p.pillars.flatMap(x => [x.stem, x.branch]).filter(ch => HYEON_CHIM.includes(ch));
  if (hc.length >= 2) add("현침살", "#B6BEC6", `바늘처럼 예리한 기운(${[...new Set(hc)].join("·")}) — 정밀한 손기술·의료·분석 직무에 재능으로 쓰입니다.`);
  /* 귀문 / 원진 */
  for (let i = 0; i < branches.length; i++) for (let j = i + 1; j < branches.length; j++) {
    if (GWIMUN[branches[i]] === branches[j]) { add("귀문관살", "#B6BEC6", `${branches[i]}·${branches[j]} — 극도로 예민한 촉과 몰입. 직관이 비상하나 신경성 스트레스 관리가 필요.`); break; }
  }
  for (let i = 0; i < branches.length; i++) for (let j = i + 1; j < branches.length; j++) {
    if (WONJIN[branches[i]] === branches[j]) { add("원진살", "#B6BEC6", `${branches[i]}·${branches[j]} — 가까운 사이일수록 애증이 교차하는 기운. 가족·배우자와 적당한 거리 두기가 지혜.`); break; }
  }
  /* 공망 */
  const gmHit = p.pillars.filter(x => x.pos !== "일주" && p.gongmang.includes(x.branch)).map(x => x.pos);
  if (gmHit.length) add("공망", "#8890A0", `${p.gongmang.join("·")} 공망 중 ${gmHit.join("·")}이 비어 있음 — 그 자리 인연은 집착보다 비움으로 대할 때 오히려 잘 풀립니다.`);
  return out;
}

/* ═══════════ 십이신살(十二神殺) 완전판 — 년지 기준 ═══════════ */
const TWELVE_ORDER = ["지살", "년살", "월살", "망신살", "장성살", "반안살", "역마살", "육해살", "화개살", "겁살", "재살", "천살"];
const TWELVE_DESC = {
  지살: "평안하게 움직이는 별 — 이동이 잦으나 안정적인 역마 기운. 타향에서 자리 잡는 데 유리합니다.",
  년살: "도화살과 같은 자리 — 매력과 인기, 사람을 끄는 힘입니다.",
  월살: "고초살 — 뿌리내리기 더딘 메마른 자리. 결실이 늦게 오나 꾸준함이 답입니다.",
  망신살: "체면이 깎이기 쉬운 자리 — 다만 위기 뒤 전화위복도 잦은 살이라, 겸손하면 무난합니다.",
  장성살: "장군의 별 — 리더십과 통솔력, 조직의 우두머리 기질을 뜻합니다.",
  반안살: "말안장에 오르는 별 — 승진과 출세, 윗사람 눈에 드는 자리입니다.",
  역마살: "이동과 확장의 별 — 움직이고 나갈수록 기회가 열립니다.",
  육해살: "해를 입기 쉬운 자리 — 시비와 손해수, 사람 관계는 문서로 매듭짓는 것이 안전합니다.",
  화개살: "예술과 학문의 별 — 홀로 파고드는 깊이, 종교·철학·연구와 인연이 깊습니다.",
  겁살: "빼앗기고 잃는 자리 — 갑작스러운 손실이나 강제 종료수가 있으나, 위기를 통해 단단해지는 기운입니다.",
  재살: "재앙·구속의 별 — 송사·규제와 관련이 깊습니다. 원칙을 지키는 일에는 오히려 강점이 됩니다.",
  천살: "하늘이 내리는 뜻밖의 사건 — 예고 없는 변화를 뜻합니다. 겸손과 순리가 액을 줄입니다."
};
const TWELVE_COLOR = { 지살: "#6FA3D6", 년살: "#EA6B5C", 월살: "#C3CBD3", 망신살: "#C3CBD3", 장성살: "#E5C465", 반안살: "#E5C465", 역마살: "#6FA3D6", 육해살: "#C3CBD3", 화개살: "#B6BEC6", 겁살: "#C3CBD3", 재살: "#C3CBD3", 천살: "#C3CBD3" };
const TRI_GROUP_JISAL = ["申", "寅", "巳", "亥"]; /* 그룹0(申子辰) 1(寅午戌) 2(巳酉丑) 3(亥卯未)의 지살 */
function twelveSinsalOf(refBranch, targetBranch) {
  const group = TRI[refBranch];
  const jisalIdx = B12.indexOf(TRI_GROUP_JISAL[group]);
  const diff = ((B12.indexOf(targetBranch) - jisalIdx) % 12 + 12) % 12;
  return TWELVE_ORDER[diff];
}
function calcTwelveSinsal(p) {
  const yearB = p.pillars[p.pillars.length - 1].branch;
  return p.pillars.map(x => ({ pos: x.pos, branch: x.branch, sal: twelveSinsalOf(yearB, x.branch) }));
}
/* ═══════════ 삼재(三災) ═══════════ */
function samjaeBranches(yearBranch) {
  const group = TRI[yearBranch];
  const jisalIdx = B12.indexOf(TRI_GROUP_JISAL[group]);
  return [6, 7, 8].map(o => B12[(jisalIdx + o) % 12]); /* [들삼재, 눌삼재, 날삼재] */
}
function samjaeInfo(p, refYear) {
  const yearB = p.pillars[p.pillars.length - 1].branch;
  const [inB, staB, outB] = samjaeBranches(yearB);
  const order = [inB, staB, outB];
  const refBranch = currentYearGZ(refYear).branch;
  const idx = order.indexOf(refBranch);
  const startYear = idx !== -1 ? refYear - idx : (() => { let y = refYear; while (currentYearGZ(y).branch !== inB) y++; return y; })();
  return { start: startYear, end: startYear + 2, branches: order, labels: ["들삼재", "눌삼재", "날삼재"] };
}

/* ═══════════ 십신 해석 뱅크 ═══════════ */
const GOD_MEAN = {
  비견: "나와 어깨를 나란히 하는 기운 — 자립심, 동료, 경쟁, 내 몫 지키기",
  겁재: "내 것을 나누는 기운 — 승부욕, 배포, 협업과 지출이 함께 오는 별",
  식신: "내가 만들어내는 기운 — 표현, 재능, 의식주 복, 느긋한 낙천",
  상관: "틀을 깨고 내보이는 기운 — 언변, 아이디어, 개혁, 끼와 반골 기질",
  편재: "굴리는 재물의 기운 — 사업 수완, 스케일, 유동 자금, 활동 무대",
  정재: "차곡차곡 모으는 재물 — 월급, 알뜰함, 성실한 관리, 안정 자산",
  편관: "나를 몰아붙이는 기운 — 카리스마, 책임, 압박, 위기 돌파력",
  정관: "나를 바로 세우는 기운 — 명예, 조직, 승진, 반듯한 신용",
  편인: "비스듬히 받는 지혜 — 직관, 특수 전문성, 재치, 정신세계",
  정인: "나를 길러주는 기운 — 학문, 문서, 자격, 어머니 같은 보호"
};
/* 대운 천간 십신별 10년 흐름 텍스트 */

/* ═══ 연령대별 대운 풀이 — 소년기(20세 미만) ═══ */
const DAEUN_TXT_YOUTH = {
  비견: "【한마디로: 친구들 속에서 크는 10년】 또래와 어울리며 자기 자리를 찾는 시기입니다. 친구 관계가 넓어지고 승부욕도 생기는데, 좋은 친구를 만나면 함께 크고, 휩쓸리면 함께 흔들리는 시기 — 어울리는 무리가 이 시기의 절반을 결정합니다.",
  겁재: "【한마디로: 경쟁 속에서 단단해지는 10년】 형제·친구와의 비교와 경쟁이 잦아지는 시기입니다. 지기 싫어하는 마음이 강해지는데, 그 승부욕을 공부·운동·특기 하나에 몰아주면 또래보다 빨리 두각을 나타냅니다.",
  식신: "【한마디로: 재능이 눈에 띄기 시작하는 10년】 만들고 표현하는 것을 좋아하게 되고, 잘 먹고 잘 자라는 순한 시기입니다. 이때 발견한 흥미(그리기·만들기·말하기 등)가 나중의 진로 씨앗이 되는 경우가 많으니 다양하게 시켜보는 것이 좋습니다.",
  상관: "【한마디로: 말문과 끼가 트이는 10년】 표현력이 확 늘고 어른 말에 「왜요?」가 많아지는 시기입니다. 반항처럼 보여도 사실은 머리가 크게 자라는 신호 — 누르기보다 발표·글쓰기·무대처럼 끼를 쏟을 출구를 만들어주면 재능이 됩니다.",
  편재: "【한마디로: 세상 구경에 눈뜨는 10년】 호기심과 활동 반경이 커지고, 용돈·물건에 관심이 생기는 시기입니다. 공부보다 바깥세상이 재미있어질 수 있는데, 체험·여행처럼 넓은 경험이 오히려 이 시기 최고의 공부입니다.",
  정재: "【한마디로: 성실함이 몸에 배는 10년】 꾸준하고 착실한 습관이 자리 잡기 좋은 시기입니다. 화려하진 않아도 숙제·저축·약속을 지키는 힘이 생기고, 이때 든 성실 습관이 평생의 밑천이 됩니다.",
  편관: "【한마디로: 단련되며 크는 10년】 규율·훈련·엄한 환경을 만나기 쉬운 시기입니다. 힘들게 느껴질 수 있지만 이 시기의 단련이 심지를 만듭니다 — 운동이나 규칙적인 활동으로 기운을 건강하게 빼주는 것이 중요합니다.",
  정관: "【한마디로: 모범생 기운의 10년】 반듯하고 인정받고 싶은 마음이 강해지는 시기입니다. 선생님·어른의 칭찬이 큰 동력이 되고, 반장·임원 같은 역할 경험이 자신감의 뿌리가 됩니다.",
  편인: "【한마디로: 상상력이 깊어지는 10년】 혼자만의 세계, 독특한 관심사에 빠져드는 시기입니다. 남들과 다른 걸 좋아한다고 걱정할 필요 없습니다 — 그 남다른 몰입이 훗날 전문성의 씨앗입니다.",
  정인: "【한마디로: 배움과 보호 속의 10년】 공부운이 들어오고 어른들의 보살핌을 받는 안정된 시기입니다. 학업에 힘이 붙는 때이니, 이 시기의 배움 습관이 평생 학습력의 기초가 됩니다."
};
/* ═══ 연령대별 대운 풀이 — 노년기(60세 이상) ═══ */
const DAEUN_TXT_SENIOR = {
  비견: "【한마디로: 벗과 함께하는 10년】 오랜 친구·형제·동년배와의 인연이 다시 두터워지는 시기입니다. 모임과 어울림에서 활력을 얻는 때 — 다만 정 때문에 돈을 빌려주거나 보증 서는 일만은 이 시기에도 여전히 금물입니다.",
  겁재: "【한마디로: 지키는 것이 버는 것인 10년】 주변에서 돈 이야기·투자 권유가 늘어나는 시기입니다. 평생 모은 자산이 나뉘기 쉬운 기운이니, 새로운 벌이보다 지금 가진 것을 지키는 관리가 이 10년의 재테크입니다.",
  식신: "【한마디로: 즐기며 베푸는 10년】 먹을 복과 여유가 함께 오는 편안한 시기입니다. 취미·요리·여행·손주 돌봄처럼 만들고 나누는 활동에서 큰 기쁨을 얻고, 건강운도 순한 흐름이라 인생 후반의 황금기로 꼽을 만합니다.",
  상관: "【한마디로: 경험을 나누는 10년】 평생 쌓은 지혜를 말과 글로 풀어내고 싶어지는 시기입니다. 강의·글쓰기·유튜브·모임의 어른 역할처럼 표현할 무대가 생기면 젊어지는 운 — 다만 잔소리로 나가면 관계가 상하니 「물어볼 때만 답한다」가 지혜입니다.",
  편재: "【한마디로: 자산이 움직이는 10년】 부동산 정리·증여·상속·큰 지출처럼 굵직한 돈이 움직이는 시기입니다. 돈이 도는 것 자체는 나쁘지 않으나, 큰 결정일수록 가족과 전문가(세무·법무)와 함께 정리하는 것이 자산을 지키는 길입니다.",
  정재: "【한마디로: 곳간이 안정되는 10년】 연금·임대·이자처럼 꾸준히 들어오는 돈의 구조가 자리 잡기 좋은 시기입니다. 화려하지 않아도 가장 마음 편한 재물운 — 새 투자보다 현금 흐름 정리가 이 시기의 정답입니다.",
  편관: "【한마디로: 건강이 곧 재산인 10년】 책임질 일·신경 쓸 일이 생각보다 많아지는 시기입니다. 이 나이의 편관운은 무엇보다 몸에 부담으로 오기 쉬우니, 정기검진과 무리하지 않는 일정이 최고의 개운법입니다. 감투 제안은 명예직 수준까지만 받는 것이 좋습니다.",
  정관: "【한마디로: 어른으로 존경받는 10년】 가문·모임·지역사회에서 어른 대접을 받고 이름이 반듯해지는 시기입니다. 고문·자문·회장 같은 명예로운 역할이 들어오기 좋은 운 — 품위 있게 받되, 실무 부담까지 떠안지는 마세요.",
  편인: "【한마디로: 정신이 깊어지는 10년】 공부·종교·철학·건강법처럼 안으로 파고드는 관심이 커지는 시기입니다. 늦게 시작한 배움이 유난히 잘 붙는 운이라, 평생 미뤄둔 공부를 시작하기에 최고의 때입니다.",
  정인: "【한마디로: 보살핌과 문서 복의 10년】 자녀·주변의 보살핌을 받고, 문서(연금·보험·상속 정리)가 순조롭게 풀리는 안정기입니다. 몸과 마음이 보호받는 흐름이니, 서류상 정리해둘 일들을 이 시기에 매듭지으면 두고두고 편합니다."
};
const DAEUN_TXT = {
  비견: "【한마디로: 내 편이 늘어나는 10년】 비유하자면, 혼자 걷던 길에 같은 방향으로 가는 사람들이 하나둘 합류하는 시기입니다. 이 시기에 흔한 장면 — 마음 맞는 동료·친구가 생기고, 「같이 해보자」는 제안이 들어오고, 남에게 기대지 않고 내 힘으로 서고 싶다는 마음이 강해집니다. 독립·창업·내 브랜드를 꿈꾸게 되는 것도 이 대운의 전형적인 모습이에요. 다만 사람이 모이면 돈도 함께 움직입니다 — 동업 제안, 지인의 투자 권유, 보증 부탁처럼 「정(情)과 돈이 섞이는 일」이 이 시기의 유일한 함정이니, 사람은 얻되 돈 문제는 반드시 서류로 정리하세요. 그것만 지키면 평생 갈 내 편을 얻는 든든한 10년입니다.",
  겁재: "【한마디로: 크게 걸고 크게 얻는 10년】 비유하자면, 잔잔한 동네 경기만 뛰다가 갑자기 큰 리그에 올라간 선수의 시기입니다. 이 시기에 흔한 장면 — 승부욕이 평소보다 확 올라오고, 주변에 나보다 잘나가는 사람이 자꾸 눈에 들어오고, 「나도 저 판에 껴야 하는 것 아닌가」 싶은 조바심이 듭니다. 실제로 큰 기회가 오기도 하지만 돈의 들어오고 나감도 함께 커져서, 벌 때는 크게 벌고 나갈 때도 크게 나가는 롤러코스터가 됩니다. 공략법은 하나 — 여기저기 기웃대지 말고 확실한 실력 한 가지에 판돈을 거는 것. 그러면 경쟁이 많은 이 시기가 오히려 인생의 도약대가 됩니다. 충동 투자와 남 따라 하기만 조심하세요.",
  식신: "【한마디로: 재능이 돈이 되는 10년】 비유하자면, 오래 가꾼 텃밭에서 드디어 수확이 시작되는 시기입니다. 이 시기에 흔한 장면 — 내가 만들거나 기획한 것에 「좋다」는 반응이 붙기 시작하고, 밥벌이 걱정이 줄고, 먹는 것·사는 곳이 눈에 띄게 편안해집니다. 취미로 하던 일이 부수입이 되거나, 회사에서 내 아웃풋이 인정받아 자리가 편해지는 것도 전형적인 모습이에요. 건강운까지 함께 오는 부드러운 운이라, 운동이나 식습관을 이때 잡아두면 평생 갑니다. 이 대운에 시작한 일은 뿌리가 깊게 내리니 — 미뤄둔 「해보고 싶던 것」이 있다면 지금이 심을 때입니다. 유일한 주의점은 너무 편안해서 늘어질 수 있다는 것 정도.",
  상관: "【한마디로: 말과 아이디어로 뜨는 10년】 비유하자면, 조용히 있던 사람이 마이크를 잡은 시기입니다. 이 시기에 흔한 장면 — 회의에서 내 아이디어가 채택되고, 발표·제안·글쓰기에서 「감각 있다」는 소리를 듣고, 지금 다니는 회사의 틀이 답답하게 느껴져 이직이나 새 판을 고민하게 됩니다. 기존 방식에 「왜 꼭 이렇게 해야 하지?」라는 의문이 자꾸 드는 것도 이 대운의 특징이에요. 그 반골 기질이 곧 경쟁력이지만, 딱 하나 — 윗사람 면전에서의 직설은 이 시기의 지뢰입니다. 하고 싶은 말은 문서와 기획안으로 정리해서 전달하세요. 같은 말도 종이에 담으면 「건방짐」이 「능력」으로 바뀝니다. 그 요령만 익히면 이름이 알려지는 10년입니다.",
  편재: "【한마디로: 큰돈이 도는 10년】 비유하자면, 동네 가게만 오가다 갑자기 큰 시장 한복판에 서게 된 시기입니다. 이 시기에 흔한 장면 — 부업·투자·사업 기회가 유난히 자주 눈에 들어오고, 활동 반경이 넓어지고(출장·외부 미팅·새 모임), 다루는 돈의 단위가 커집니다. 실제 수입도 늘지만 씀씀이와 나가는 돈도 정확히 같이 커지는 게 이 운의 성질이에요 — 통장을 스쳐 가는 돈은 많은데 남는 게 없다면 전형적인 편재운을 겪고 있는 겁니다. 공략법은 「번 돈」이 아니라 「남긴 돈」을 세는 습관 — 수입의 일정 비율 자동 저축 같은 시스템을 이 대운 초반에 만들어 두면, 큰물에서 논 만큼 큰 재산이 됩니다.",
  정재: "【한마디로: 차곡차곡 쌓이는 10년】 비유하자면, 화려하진 않지만 매달 이자가 붙는 적금 같은 시기입니다. 이 시기에 흔한 장면 — 갑자기 대박이 나진 않지만 연봉·수입이 꾸준히 오르고, 저축이 처음으로 목돈이 되고, 내 집·내 차처럼 「내 것」이라 부를 자산이 생깁니다. 일에서도 성실함이 평가받아 자리가 안정되고, 가정을 꾸리거나 가정이 화목해지는 것도 이 대운의 전형이에요. 한탕의 유혹(코인·급등주·지인 사업 투자)이 가장 아까운 시기 — 이 운은 복리로 불어나는 운이라, 꾸준함을 이기는 전략이 없습니다. 지루하다고 느껴진다면 잘 가고 있다는 뜻입니다.",
  편관: "【한마디로: 힘들지만 급이 올라가는 10년】 비유하자면, 훈련 강도가 확 올라간 대표팀에 소집된 시기입니다. 이 시기에 흔한 장면 — 갑자기 무거운 책임이 맡겨지고(팀장·프로젝트 리더·집안의 기둥 역할), 마감과 압박이 일상이 되고, 「왜 이렇게 나한테만 일이 몰리지?」 싶은 순간이 옵니다. 그런데 신기하게도 그 위기를 하나 넘길 때마다 주변의 대우와 내 급이 눈에 띄게 올라갑니다 — 편관운은 시련으로 계급장을 다는 운이거든요. 공략법은 두 가지 — ① 도망치지 말고 정면으로 받되 ② 몸은 철저히 지킬 것(수면·건강검진·과로 경계). 이 10년을 통과한 사람과 못 한 사람은 이후 격이 달라집니다.",
  정관: "【한마디로: 승진·합격의 10년】 비유하자면, 오래 줄 서 있던 창구에서 드디어 내 번호가 불리는 시기입니다. 이 시기에 흔한 장면 — 승진 심사에서 이름이 올라가고, 준비하던 시험·자격에 합격하고, 「저 사람은 믿을 만하다」는 평판이 자산이 되어 좋은 자리 제안이 들어옵니다. 조직·제도권 안에서 가장 빛나는 운이라, 회사원이라면 커리어의 황금기가 되기 쉬워요. 결혼·공식적인 관계 정리처럼 「도장 찍는 일」에도 좋은 흐름입니다. 주의할 것은 단 하나 — 이 운은 정공법의 운이라 편법·지름길이 유독 크게 탈이 납니다. 원칙대로, 서류대로, 반듯하게 — 그게 이 10년의 최단 경로입니다.",
  편인: "【한마디로: 내공이 쌓이는 10년】 비유하자면, 무대 위가 아니라 무대 뒤에서 다음 공연을 준비하는 시기입니다. 이 시기에 흔한 장면 — 남들이 안 하는 분야의 공부·자격에 끌리고, 혼자 파고드는 시간이 많아지고, 겉으로 드러나는 성과는 애매한데 머릿속은 그 어느 때보다 깊어집니다. 「나 지금 뭐 하고 있는 거지?」 싶어 조급해지기 쉬운 운인데 — 사실은 다음 대운에서 쓸 무기를 제작 중인 겁니다. 이 시기에 딴 자격, 익힌 기술, 읽은 책이 10년 뒤 밥벌이가 되는 경우가 정말 많아요. 공략법은 「배우면 3일 안에 작게라도 써먹기」 — 생각이 실행을 앞지르는 게 이 운의 유일한 함정이라, 작은 실전을 계속 섞어주면 완벽합니다.",
  정인: "【한마디로: 문서와 귀인의 10년】 비유하자면, 든든한 어른이 뒤를 봐주는 것 같은 시기입니다. 이 시기에 흔한 장면 — 계약·자격증·부동산·학위처럼 「종이에 남는 복」이 유난히 잘 풀리고, 결정적인 순간마다 윗사람이나 선배가 손을 내밀어주고, 마음이 전보다 안정됩니다. 공부를 다시 시작하기에도, 집을 사기에도, 큰 계약을 맺기에도 좋은 보호받는 운이에요. 몸과 마음이 편해지는 시기라 기반 다지기에 최적 — 이 10년 동안 만든 자격·문서·인맥이 평생의 안전판이 됩니다. 주의점은 편안함에 기대 「받기만」 하지 않는 것 — 도와준 사람에게 표현하고 갚는 사람에게 귀인은 계속 옵니다."
};
const DAEUN_STR_MOD = {
  신강_비겁: "다만 원국이 이미 강한 명식이라 비겁 대운은 기운 과잉 — 독주와 고집, 지출 경쟁을 특히 조심할 때입니다.",
  신강_인성: "원국이 강한 명식에 인성이 더해지면 생각이 많아지고 몸이 무거워질 수 있으니, 배우면 반드시 써먹는 실행이 열쇠입니다.",
  신강_식상: "강한 일간의 기운을 시원하게 뽑아 쓰는 배합이라 이 시기 활동은 대부분 득이 됩니다.",
  신강_재성: "강한 일간이 재물을 능히 감당하는 배합 — 재물운의 체감이 가장 큰 조합입니다.",
  신강_관성: "강한 기운을 관이 다듬어주는 배합 — 조직과 직책이 오히려 편해지는 시기입니다.",
  신약_비겁: "일간이 약한 명식에는 비겁이 아군 — 내 편이 늘고 자신감이 붙는 반가운 운입니다.",
  신약_인성: "약한 일간에게 인성은 보약 — 심신이 안정되고 귀인이 붙는, 손꼽아 기다릴 만한 운입니다.",
  신약_식상: "약한 일간의 기운을 빼 쓰는 운이라 성과는 있으되 체력 소모가 큽니다. 휴식을 일정에 먼저 넣으세요.",
  신약_재성: "기회는 많이 보이지만 신약한 일간이 다 받으면 체하는 배합 — 욕심의 8할에서 멈추는 것이 남는 장사입니다.",
  신약_관성: "약한 일간에게 관은 무거운 짐 — 책임이 몰릴 때 혼자 떠안지 말고 반드시 나눠야 탈이 없습니다."
};
/* 세운 십신별 한 해 텍스트 + 태그 */

/* ═══ 연령대별 세운 한 줄 — 소년(20세 미만)/노년(60세 이상) ═══ */
const SEUN_TXT_YOUTH = {
  비견: ["친구·어울림", "친구 관계가 넓어지는 해. 어울리는 무리에 따라 한 해의 색이 정해지니 좋은 벗을 곁에 두세요."],
  겁재: ["경쟁·승부욕", "또래와 비교·경쟁이 붙는 해. 그 승부욕을 공부나 특기 하나에 몰아주면 크게 성장합니다."],
  식신: ["재능·성장", "잘 자라고 재능이 눈에 띄는 순한 해. 새로운 활동을 시작해보기 좋습니다."],
  상관: ["표현·끼", "말문과 끼가 트이는 해. 발표·글쓰기·무대 활동에 좋고, 어른과의 말대꾸만 조심."],
  편재: ["호기심·체험", "바깥세상이 재미있어지는 해. 체험과 여행이 최고의 공부가 되는 시기입니다."],
  정재: ["성실·습관", "꾸준함이 몸에 붙는 해. 숙제·저축·약속 지키기 같은 좋은 습관을 들이기 최적입니다."],
  편관: ["단련·규율", "훈련과 규율이 강해지는 해. 운동으로 기운을 건강하게 빼주는 것이 중요합니다."],
  정관: ["모범·인정", "선생님·어른에게 인정받기 좋은 해. 임원·대표 같은 역할 경험이 자신감이 됩니다."],
  편인: ["몰입·상상", "독특한 관심사에 깊이 빠지는 해. 남다른 몰입이 훗날 전문성의 씨앗이 됩니다."],
  정인: ["학업·보호", "공부운이 정면으로 드는 해. 배움에 힘이 붙고 어른들의 도움도 따릅니다."]
};
const SEUN_TXT_SENIOR = {
  비견: ["벗·모임", "오랜 벗과의 어울림에서 활력을 얻는 해. 다만 돈 빌려주기·보증만은 금물입니다."],
  겁재: ["지출·관리", "돈 이야기가 많이 들려오는 해. 새 벌이보다 가진 것을 지키는 관리가 정답입니다."],
  식신: ["여유·건강복", "먹을 복과 여유가 드는 편안한 해. 취미·여행·나눔에서 큰 기쁨을 얻습니다."],
  상관: ["나눔·표현", "경험과 지혜를 나누고 싶어지는 해. 강의·글·모임의 어른 역할이 잘 어울립니다."],
  편재: ["자산·정리", "부동산·증여 등 굵직한 돈이 움직이기 쉬운 해. 큰 결정은 가족·전문가와 함께."],
  정재: ["안정·현금흐름", "연금·임대처럼 꾸준한 수입 구조를 다지기 좋은 해. 마음 편한 재물운입니다."],
  편관: ["건강·과로주의", "신경 쓸 일이 많아지는 해. 정기검진과 무리 없는 일정이 최고의 개운법입니다."],
  정관: ["명예·존경", "어른으로 대접받고 이름이 반듯해지는 해. 명예로운 역할 제안이 들어오기 좋습니다."],
  편인: ["공부·정신", "늦게 시작한 배움이 잘 붙는 해. 미뤄둔 공부·수양을 시작하기 좋은 때입니다."],
  정인: ["문서·보살핌", "문서(연금·보험·정리)가 순조롭고 주변의 보살핌을 받는 안정된 해입니다."]
};
const SEUN_TXT = {
  비견: ["동료·경쟁", "내 편이 늘고 함께 하자는 제안이 오는 해. 단, 돈이 나뉘는 해이기도 하니 동업·보증·큰돈 빌려주기는 두 번 생각하세요."],
  겁재: ["경쟁·지출", "경쟁이 붙고 승부욕이 오르는 해. 돈이 새기 쉬운 해라 지갑 관리와 계약서 확인을 평소보다 꼼꼼히."],
  식신: ["활동·건강복", "잘하는 일이 결과로 이어지는 순한 해. 새 일·취미·건강 관리, 뭐든 시작하기 좋습니다."],
  상관: ["표현·변화", "말과 아이디어가 빛나는 해. 발표·기획·이직 시도에 좋지만, 윗사람과 말싸움은 피하세요."],
  편재: ["재물·확장", "굵직한 돈이 오가는 해. 부수입·투자 기회가 보이지만 쓰는 돈도 커지니 들어올 돈과 나갈 돈부터 정리."],
  정재: ["재물·안정", "성실의 대가가 돌아오는 해. 연봉·저축·내 집 같은 안정 자산을 늘리기 좋은 흐름."],
  편관: ["책임·승부", "힘든 자리와 감투가 함께 오는 해. 버티면 급이 올라가는 관문 — 잠과 건강만 지키세요."],
  정관: ["관운·명예", "승진·합격·공식 인정의 해. 시험·심사·계약 같은 공식 절차에서 유리합니다."],
  편인: ["문서·전문", "특별한 공부와 자격의 해. 문서·계약엔 유리하지만 결정이 늦어지기 쉬우니 마감일을 정해두세요."],
  정인: ["문서·귀인", "문서운이 정면으로 드는 해. 계약·자격·부동산·공부에 청신호, 윗사람 도움도 따릅니다."]
};
function currentYearGZ(year) {
  const s = (((year - 4) % 10) + 10) % 10, b = (((year - 4) % 12) + 12) % 12;
  return { sIdx: s, bIdx: b, stem: S10[s], branch: B12[b] };
}
/* 세운 상세 (한 해) */
function seunDetail(p, year, age) {
  const gz = currentYearGZ(year);
  const ds = S10.indexOf(p.dayStem);
  const sg = tenGod(ds, gz.sIdx);
  const bg = tenGod(ds, S10.indexOf(HIDDEN[gz.branch][HIDDEN[gz.branch].length - 1]));
  const tags = [];
  const sCat = GCAT[sg], bCat = GCAT[bg];
  /* 연령대별 세운 문구 선택 (age 미지정 시 성인 기준) */
  const SB = (age !== undefined && age < 20) ? SEUN_TXT_YOUTH : (age !== undefined && age >= 60) ? SEUN_TXT_SENIOR : SEUN_TXT;
  tags.push({ t: SB[sg][0], c: GCAT_COLOR[sCat] });
  if (bCat !== sCat) tags.push({ t: SB[bg][0], c: GCAT_COLOR[bCat] });
  const notes = [];
  /* 일지 충/합 */
  const dbI = B12.indexOf(p.dayBranch);
  if (B12.indexOf(gz.branch) === CHUNG(dbI)) { tags.push({ t: "이동수·변동", c: "#6FA3D6" }); const mv = (age !== undefined && age >= 60) ? "이사·거처 변화·집안일 정리 등" : (age !== undefined && age < 20) ? "전학·이사 등" : "이사·이직·자리 이동 등"; notes.push(`일지를 충(沖)하는 해라 ${mv} 변동수가 큽니다. 어차피 움직일 운이라면 먼저 계획해서 움직이는 쪽이 유리합니다.`); }
  if (YUKHAP[p.dayBranch] === gz.branch) { tags.push({ t: "합·인연", c: "#7DB889" }); notes.push("일지와 합(合)이 드는 해 — 인연이 붙고 묶이는 기운이라 계약·결합·만남에 좋은 흐름입니다."); }
  /* 도화/역마 */
  if (TRI_STAR[TRI[p.dayBranch]][0] === gz.branch) { tags.push({ t: "도화·인기", c: "#EA6B5C" }); notes.push("도화가 드는 해라 인기와 주목도가 올라갑니다. 대인 업무엔 순풍, 이성 문제는 절제가 필요합니다."); }
  if (TRI_STAR[TRI[p.dayBranch]][1] === gz.branch) { tags.push({ t: "역마·이동", c: "#6FA3D6" }); notes.push("역마가 드는 해 — 출장·여행·해외·이동이 잦아지고, 움직인 만큼 기회가 생깁니다."); }
  if (p.gongmang.includes(gz.branch)) { tags.push({ t: "공망", c: "#8890A0" }); notes.push("공망이 드는 해라 결과가 손에 덜 잡히는 느낌일 수 있습니다. 큰 승부보다 공부·정리·재충전에 어울리는 해입니다."); }
  /* 삼재 */
  const sjBranches = samjaeBranches(p.pillars[p.pillars.length - 1].branch);
  const sjIdx = sjBranches.indexOf(gz.branch);
  if (sjIdx !== -1) { const lb = ["들삼재", "눌삼재", "날삼재"][sjIdx]; tags.push({ t: lb, c: "#C3CBD3" }); notes.push(`${lb} — 3년 주기로 찾아오는 전환기입니다. 나쁜 일이 정해진 게 아니라 「정리하고 준비하는 해」로 보는 것이 현대적 해석 — 큰 결정은 신중히, 관리는 꼼꼼히 하면 무난합니다.`); }
  let text = `천간으로 ${sg}(${GOD_MEAN[sg].split(" — ")[0]}), 지지로 ${bg}이 드는 해입니다. ${SB[sg][1]}`;
  if (bCat !== sCat) text += ` 바탕에는 ${SB[bg][0]}의 기류가 함께 흐릅니다.`;
  return { gz, sg, bg, tags, text, notes };
}
/* 대운 상세 */
function daeunDetail(p, du) {
  const ds = S10.indexOf(p.dayStem);
  const sg = tenGod(ds, du.sIdx);
  const bg = tenGod(ds, S10.indexOf(HIDDEN[du.branch][HIDDEN[du.branch].length - 1]));
  const uns = unseong(p.dayStem, du.bIdx);
  const strongish = isStrongLabel(p.strength);
  const key = (strongish ? "신강_" : "신약_") + GCAT[sg];
  /* 연령대별 텍스트 선택: 대운 시작 나이 기준 */
  const bank = du.age < 20 ? DAEUN_TXT_YOUTH : du.age >= 60 ? DAEUN_TXT_SENIOR : DAEUN_TXT;
  let text = bank[sg];
  if (bank === DAEUN_TXT && p.strength !== "중화" && DAEUN_STR_MOD[key]) text += " " + DAEUN_STR_MOD[key];
  const extra = [];
  if (GCAT[bg] !== GCAT[sg]) extra.push(`지지로는 ${bg}의 기운이 바탕에 깔려, 겉으로 드러나는 ${GCAT[sg]}의 일들 아래로 ${SEUN_TXT[bg][0]}의 흐름이 함께 갑니다.`);
  extra.push(`이 대운의 지지는 일간 기준 12운성으로 「${uns}」 — ${UNS_D[uns]}의 시기입니다.`);
  const dbI = B12.indexOf(p.dayBranch);
  if (du.bIdx === CHUNG(dbI)) extra.push("일지를 충하는 대운이라 이 10년 안에 거주지·직장·가정사에 큰 전환이 한 번은 옵니다. 변화를 막기보다 방향을 정해두는 것이 상책입니다.");
  return { sg, bg, uns, text, extra };
}

/* ═══════════ 분야별 심층 분석 ═══════════ */
function domainReports(p, gender, nowAge) {
  const R = [];
  const g = p.godCount, strongish = isStrongLabel(p.strength);
  const posOf = cat => p.pillars.filter(x => (x.pos !== "일주" && GCAT[x.sg] === cat) || GCAT[x.bg] === cat).map(x => x.pos);
  const POS_MEAN = { 년주: "초년과 집안 뿌리", 월주: "청년기와 사회 무대", 일주: "배우자궁과 중년", 시주: "말년과 자녀 자리" };

  /* ── 재물운 ── */
  {
    const n = g.재성, pos = [...new Set(posOf("재성"))];
    let t = "";
    if (n === 0) t = "원국에 재성이 드러나지 않은 「무재(無財)」에 가까운 구조입니다. 재물이 없다는 뜻이 아니라, 돈이 눈앞의 목표가 아니라 실력과 명분을 따라 뒤에서 들어오는 구조라는 뜻입니다. 오히려 재성운(대운·세운)이 들 때 한꺼번에 크게 들어오는 타입이니, 아래 흐름표에서 재성이 드는 시기를 재테크의 골든타임으로 잡으세요. 평소에는 고정 지출 관리와 자동 저축 같은 시스템이 통장을 지킵니다.";
    else {
      t = `원국에 재성이 ${n}개 — ${pos.map(x => POS_MEAN[x]).join(", ")}에 재물의 별이 자리합니다. `;
      const jeong = p.pillars.some(x => x.sg === "정재" || x.bg === "정재"), pyeon = p.pillars.some(x => x.sg === "편재" || x.bg === "편재");
      if (jeong && pyeon) t += "정재와 편재를 모두 갖춰 월급처럼 꾸준한 돈과 사업·투자처럼 굴리는 돈, 양쪽 감각이 다 있습니다. ";
      else if (pyeon) t += "편재 중심이라 고정 월급보다 성과급·사업·투자처럼 굴리는 돈에서 수완이 삽니다. 스케일 있게 벌고 스케일 있게 쓰는 타입이라 현금 흐름 설계가 핵심입니다. ";
      else t += "정재 중심이라 성실하게 벌어 차곡차곡 쌓는 안정형 재물 구조입니다. 한탕보다 복리가 어울리는 명식입니다. ";
      if (g.식상 > 0) t += "식상이 재성을 낳는 「식상생재」의 길이 열려 있어, 내 재능·기획·말솜씨가 곧 돈이 되는 구조입니다. ";
      if (n >= 3 && !strongish) t += "다만 재성이 많은데 일간이 약한 「재다신약」의 기미가 있어 — 기회가 많을수록 몸이 상하기 쉬우니, 다 잡으려 하지 말고 좋은 것만 골라 잡는 절제가 곧 재테크입니다.";
      else if (strongish) t += "일간이 재를 능히 감당하는 힘이 있어, 재성운이 드는 해마다 체감 수익이 뚜렷한 편입니다.";
    }
    const jaeKey = n === 0 ? "한마디로: 돈을 좇기보다 실력을 쌓으면 돈이 따라오는 타입" : (g.식상 > 0 ? "한마디로: 내 재능이 곧 돈이 되는 구조" : (strongish ? "한마디로: 돈을 감당할 힘이 있는 사주 — 재물운이 들 때 확실히 잡는 타입" : "한마디로: 기회가 많을수록 골라 잡는 절제가 재테크인 타입"));
    R.push({ icon: "◈", title: "재물운 · 財", color: "#E5C465", key: jaeKey, text: t });
  }
  /* ── 문서·학업운 ── */
  {
    const n = g.인성, pos = [...new Set(posOf("인성"))];
    let t = "";
    if (n === 0) t = "원국에 인성이 드러나지 않아, 책상 공부보다 몸으로 부딪혀 배우는 현장형 학습이 체질입니다. 문서·계약 복은 인성이 드는 대운·세운에 몰아서 오니, 그 시기에 자격증·계약·부동산 문서를 집중 처리하는 전략이 좋습니다.";
    else {
      t = `인성이 ${n}개, ${pos.map(x => POS_MEAN[x]).join(", ")}에 문서와 배움의 별이 있습니다. 공부·자격·계약·부동산처럼 「종이에 남는 복」을 타고난 편이며, 배운 것이 늦지 않게 밥이 되어 돌아오는 구조입니다. `;
      if (g.관성 > 0) t += "관성과 인성이 이어지는 「관인상생」의 길이 있어 — 조직에서 인정받아 승진하고, 그 지위가 다시 공부와 문서 복으로 이어지는 선순환 구조입니다. ";
      if (n >= 3) t += "다만 인성이 많으면 생각이 실행을 앞지르기 쉬우니, 「배우면 3일 안에 써먹는다」는 원칙이 이 명식의 성장 속도를 결정합니다.";
    }
    const mc = p.pillars.some(x => x.branch === MUN_CHANG[p.dayStem]);
    if (mc) t += " 문창귀인까지 갖춰 시험·글·기획에서 남보다 빠른 이해력이 무기입니다.";
    const inKey = n === 0 ? "한마디로: 책상 공부보다 몸으로 배우는 현장형" : "한마디로: 공부·자격·계약, 종이에 남는 복을 타고난 타입";
    R.push({ icon: "✎", title: "문서 · 학업운 · 印", color: "#6FA3D6", key: inKey, text: t });
  }
  /* ── 직업·관운 ── */
  {
    const n = g.관성;
    let t = "";
    if (n === 0) t = (nowAge !== undefined && nowAge >= 60)
      ? "관성이 드러나지 않아 평생 위계와 지시보다 스스로 판을 짜는 쪽이 체질이었던 분입니다. 관운(명예·인정)은 관성 대운·세운에 몰리니, 그 시기에 감투·명예직·집안의 어른 역할 제안이 들어오기 쉽습니다."
      : "관성이 드러나지 않아 위계와 지시 아래 있기보다 스스로 판을 짜는 쪽이 체질입니다. 조직에 있더라도 재량이 큰 역할·전문직·독립 포지션에서 능력이 삽니다. 관운은 관성 대운·세운에 몰리니 그때가 승진·시험의 적기입니다.";
    else {
      const jeong = p.pillars.some(x => x.sg === "정관" || x.bg === "정관");
      t = `관성이 ${n}개 — ${jeong ? ((nowAge !== undefined && nowAge >= 60) ? "정관 중심이라 평생 반듯한 신용으로 살아온 정통 관운의 명식입니다. 지금 시기에는 그 신용이 존경과 명예로운 역할(고문·자문·모임의 어른)로 돌아옵니다." : "정관 중심이라 반듯한 조직·제도권 안에서 신용으로 올라가는 정통 관운입니다. 승진·시험·공적 인정과 인연이 깊습니다.") : ((nowAge !== undefined && nowAge >= 60) ? "편관 중심이라 평생 책임을 짊어지며 급을 올려온 승부형 관운입니다. 지금 시기의 편관은 몸의 부담으로 오기 쉬우니 건강 관리가 곧 관운 관리입니다." : "편관 중심이라 압박과 책임 속에서 급이 올라가는 승부형 관운입니다. 위기를 맡아 돌파할 때마다 지위가 뛰는 타입입니다.")} `;
      if (g.식상 >= 2 && jeong) t += "다만 상관·식상의 기운이 관을 치는 구도가 있어(상관견관), 윗사람 앞에서의 직언은 한 템포 눌러 문서로 말하는 습관이 관운을 지킵니다. ";
      if (!strongish && n >= 2) t += "일간에 비해 관의 짐이 무거운 편이라, 책임이 몰릴 때 혼자 다 안지 말고 위임하는 기술이 곧 승진의 기술입니다.";
    }
    /* 적성 */
    const dom = Object.entries(g).sort((a, b) => b[1] - a[1])[0][0];
    const APT = { 비겁: "독립 사업 · 영업 최전선 · 스포츠 · 프리랜스", 식상: "기획 · 교육 · 콘텐츠 · 마케팅 · 요식", 재성: "영업 · 금융 · 유통 · 사업 경영", 관성: "관리자 · 공공 · 법무 · 대기업 조직", 인성: "연구 · 교육 · 문서 행정 · 전문 자격" };
    t += ` 원국에서 가장 두터운 기운은 ${dom} — 적성의 물길은 「${APT[dom]}」 쪽으로 흐릅니다.`;
    if (nowAge !== undefined && nowAge >= 60) t += " (이 적성 풀이는 평생의 성향 기준입니다 — 지금 시기에는 자문·고문·후배 양성·봉사처럼 경험을 나누는 방향으로 읽으시면 정확합니다.)";
    const gwanKey = n === 0 ? "한마디로: 지시받기보다 내 판을 짜야 사는 타입" : "한마디로: 조직에서 인정받고 올라가는 관운이 있는 타입";
    R.push({ icon: "⚖", title: "직업 · 관운 · 官", color: "#EA6B5C", key: gwanKey, text: t });
  }
  /* ── 애정·배우자운 ── */
  {
    const dayP = p.pillars.find(x => x.pos === "일주");
    const spouseGod = dayP.bg;
    let t = `배우자궁(일지)에 ${spouseGod}이 앉아 있습니다 — ${GOD_MEAN[spouseGod]}의 기운이 배우자 자리의 바탕색입니다. `;
    const SPOUSE = { 비견: "배우자가 친구 같은 대등한 관계가 되며, 서로의 영역을 존중할 때 오래갑니다.", 겁재: "밀당과 승부가 있는 인연 — 재물 관리만 투명하면 화끈하고 의리 있는 짝입니다.", 식신: "배우자 덕에 먹을 복과 편안함이 따르는 좋은 배치 — 가정이 안식처가 됩니다.", 상관: "표현이 활발한 가정 — 다만 말로 이기려 들면 다투니, 유머가 부부의 약입니다.", 편재: "활동적이고 스케일 있는 배우자 인연 — 함께 움직이고 여행할 때 정이 깊어집니다.", 정재: "알뜰하고 헌신적인 인연 — 배우자가 실질적인 복이 되는 안정 배치입니다.", 편관: "카리스마 있는 강한 배우자 인연 — 긴장감이 있지만 위기에 가장 든든한 짝입니다.", 정관: "반듯하고 책임감 있는 배우자 인연 — 모범적인 가정을 이루는 배치입니다.", 편인: "지적이고 개성 있는 배우자 인연 — 서로의 정신세계를 존중하는 거리가 필요합니다.", 정인: "어머니처럼 나를 품어주는 배우자 인연 — 기대는 만큼 표현으로 갚아야 오래갑니다." };
    t += SPOUSE[spouseGod] + " ";
    const partnerStar = gender === "남" ? "재성" : "관성", pn = g[partnerStar];
    if (pn === 0) t += `${gender === "남" ? "남명의 배우자별인 재성" : "여명의 배우자별인 관성"}이 원국에 드러나지 않아 인연이 늦거나 조용히 오는 편 — 대신 ${partnerStar}운이 드는 해가 곧 인연의 해이니 아래 흐름표의 ${partnerStar} 해를 눈여겨보세요.`;
    else if (pn >= 3) t += `배우자별(${partnerStar})이 ${pn}개로 많아 인연 자체는 끊이지 않으나 고르는 눈이 과제 — 조건보다 생활 습관을 볼 때 실패가 없습니다.`;
    else t += `배우자별(${partnerStar})이 알맞게 자리해 인연의 때가 오면 자연스럽게 맺어지는 구조입니다.`;
    const dbI = B12.indexOf(p.dayBranch);
    if (p.pillars.some(x => x.pos !== "일주" && B12.indexOf(x.branch) === CHUNG(dbI))) t += " 다만 배우자궁이 충을 맞는 구도가 있어, 각자의 공간과 시간을 존중하는 「따로 또 같이」가 이 명식 부부 화목의 공식입니다.";
    if (p.pillars.some(x => x.branch === HONG_YEOM[p.dayStem]) || p.pillars.some(x => x.branch === TRI_STAR[TRI[p.dayBranch]][0])) t += " 도화·홍염의 매력이 있어 이성의 호감을 사는 인상 — 결혼 후에는 이 매력을 일(영업·대인)로 돌리는 것이 지혜입니다.";
    const loveKey = pn === 0 ? "한마디로: 인연이 조용히, 대신 확실한 때에 오는 타입" : pn >= 3 ? "한마디로: 인연은 많은데 고르는 눈이 관건인 타입" : "한마디로: 때가 오면 자연스럽게 맺어지는 무난한 인연 구조";
    R.push({ icon: "♥", title: "애정 · 배우자운", color: "#EA6B5C", key: loveKey, text: t });
  }
  /* ── 건강운 ── */
  {
    const HEALTH = { 木: "간·담·눈·근육 — 스트레칭과 신 음식, 눈 휴식", 火: "심장·혈압·순환기 — 유산소와 수면, 카페인 절제", 土: "위장·소화기·비장 — 규칙적 식사, 과식 금지", 金: "폐·호흡기·피부·대장 — 맑은 공기, 매운 음식 절제", 水: "신장·방광·생식기·귀 — 수분과 하체 보온, 과음 주의" };
    const over = Object.entries(p.el).filter(([, v]) => v >= 3).map(([k]) => k);
    const lack = Object.entries(p.el).filter(([, v]) => v === 0).map(([k]) => k);
    let t = "";
    if (over.length) t += over.map(e => `${E_KR[e]}(${e}) 기운이 과다해 ${HEALTH[e].split(" — ")[0]} 계통에 과부하가 걸리기 쉽습니다(${HEALTH[e].split(" — ")[1]}).`).join(" ") + " ";
    if (lack.length) t += lack.map(e => `${E_KR[e]}(${e}) 기운이 비어 ${HEALTH[e].split(" — ")[0]} 쪽이 선천적으로 허한 자리 — ${HEALTH[e].split(" — ")[1]}로 보충하세요.`).join(" ");
    if (!over.length && !lack.length) t = "오행이 고르게 순환하는 명식이라 타고난 건강 균형이 좋은 편입니다. 다만 균형형은 무너질 때 전체가 함께 흔들리니, 수면 리듬 하나만 지켜도 건강운의 8할을 지킵니다.";
    if (!strongish) t += " 일간이 약한 명식은 에너지 총량이 정해진 배터리와 같아 — 무리한 다음 날 반드시 회복 시간을 넣는 것이 최고의 보약입니다.";
    const healthKey = (over.length || lack.length) ? `한마디로: ${[...over.map(e=>E_KR[e]+"("+e+") 과다"), ...lack.map(e=>E_KR[e]+"("+e+") 부족")].join(", ")} — 이 부분만 챙기면 됩니다` : "한마디로: 타고난 균형이 좋은 편 — 수면 리듬 하나만 지키면 됩니다";
    t += " 이 내용은 전통 오행 상징에 따른 생활 참고이며 질병 위험·진단을 뜻하지 않습니다. 증상이 있으면 의료진의 판단을 우선하세요.";
    R.push({ icon: "✚", title: "건강운 · 생활 참고", color: "#7DB889", key: healthKey, text: t });
  }
  /* ── 대인관계 ── */
  {
    let t = "";
    if (g.비겁 >= 2) t += "비겁이 두터워 내 편을 만드는 힘과 동료 운이 좋습니다. 다만 돈과 사람이 얽히면(동업·보증) 정 때문에 손해 보는 구조이니, 사람은 깊게 사귀되 돈은 얕게 섞으세요. ";
    else if (g.비겁 === 0) t += "비겁이 없어 넓게 몰려다니기보다 소수와 깊게 맺는 관계형입니다. 혼자 결정하고 혼자 책임지는 데 익숙하나, 큰일일수록 한 사람의 조언자를 두면 실수가 줄어듭니다. ";
    if (g.식상 >= 2) t += "식상이 활발해 말과 표현으로 사람을 얻는 타입 — 모임의 분위기를 만드는 재주가 있습니다. ";
    const ce = CHEON_EUL[p.dayStem].some(b => p.pillars.some(x => x.branch === b));
    if (ce) t += "천을귀인이 있어 결정적인 순간마다 도와주는 사람이 나타나는 인덕의 명식입니다. ";
    if (!t) t = "관계의 기운이 담백한 명식 — 일과 역할로 맺어진 관계에서 신뢰를 쌓는 타입이며, 그 신뢰가 오래가는 자산이 됩니다.";
    const peopleKey = g.비겁 >= 2 ? "한마디로: 사람은 깊게, 돈은 얕게 섞어야 하는 타입" : g.비겁 === 0 ? "한마디로: 넓게보다 좁고 깊게 사귀는 타입" : "한마디로: 일과 신뢰로 관계를 쌓는 타입";
    R.push({ icon: "☰", title: "대인관계 · 인덕", color: "#DCE1E5", key: peopleKey, text: t });
  }
  return R;
}

/* ═══════════ 궁합(2인 비교) · 심층 확장판 ═══════════ */
const COMPAT_TYPE_META = {
  "연인": {
    badge:"LOVE", first:"끌림·호감", intimacy:"애정 표현과 친밀감", future:"연애 흐름과 관계 성장", showChild:false,
    scoreTitle:"연애 궁합 지수",
    intro:"서로에게 끌리는 이유, 애정 표현 방식, 갈등 뒤 다시 가까워지는 힘을 중심으로 봅니다.",
    weights:{attraction:.24,communication:.18,daily:.10,conflict:.16,money:.05,growth:.12,support:.07,balance:.08},
    labels:{attraction:"끌림·설렘",communication:"대화·감정표현",daily:"데이트·생활리듬",conflict:"화해·회복",money:"소비·데이트비",growth:"함께 성장",support:"정서적 지원",balance:"주도권 균형"},
    metricDesc:{attraction:"연애 감정과 호감이 자연스럽게 살아나는 정도",communication:"좋아하는 마음과 서운함을 표현하는 호흡",daily:"데이트 빈도·연락·생활 속도를 맞추는 정도",conflict:"다툰 뒤 감정을 풀고 친밀감을 회복하는 힘",money:"데이트비·선물·소비 기준을 맞추는 정도",growth:"서로의 가능성과 자존감을 키워주는 정도",support:"힘들 때 정서적으로 편이 되어주는 정도",balance:"밀고 당기기와 관계 주도권의 균형"},
    conflictScript:"지금 누가 맞는지보다, 내가 어떤 말에서 서운했는지부터 한 문장씩 말하자.",
    operationTitle:"데이트·연락 운영법", operationGuide:"연락 빈도, 혼자 있는 시간, 데이트 비용, 이성 친구 경계를 초반에 가볍게 합의하세요.",
    timelineGuide:"두 사람의 감정 온도와 관계 진전 속도가 잘 맞는 시기를 중심으로 봅니다."
  },
  "부부": {
    badge:"MARRIAGE", first:"배우자 유대", intimacy:"부부의 애정과 돌봄 방식", future:"가정의 안정과 공동 계획", showChild:true,
    scoreTitle:"부부 생활 궁합 지수",
    intro:"설렘보다 생활, 돈, 역할 분담, 갈등 회복처럼 오래 함께 살 때 중요한 요소를 더 크게 봅니다.",
    weights:{attraction:.08,communication:.14,daily:.22,conflict:.20,money:.16,growth:.07,support:.07,balance:.06},
    labels:{attraction:"정서적 유대",communication:"부부 대화",daily:"생활·가사 호흡",conflict:"갈등 회복",money:"재정·공동비용",growth:"공동 목표",support:"돌봄·지지",balance:"역할·주도권"},
    metricDesc:{attraction:"부부로서 친밀감과 정서적 유대를 유지하는 정도",communication:"생활 문제와 감정을 솔직하게 조율하는 정도",daily:"수면·가사·육아·휴식 루틴을 맞추는 정도",conflict:"갈등이 쌓이기 전에 풀고 다시 협력하는 힘",money:"소득·저축·지출·부채를 함께 운영하는 정도",growth:"집·커리어·가족계획 같은 공동 목표를 세우는 정도",support:"아플 때와 힘들 때 실제로 돌보는 힘",balance:"가사·결정권·책임이 한쪽에 몰리지 않는 정도"},
    conflictScript:"우리 편끼리 싸우는 게 아니라 같은 문제를 함께 푼다고 생각하고, 오늘 정할 것 하나만 정하자.",
    operationTitle:"가사·재정·가족 역할 운영법", operationGuide:"공동통장, 가사 분담, 양가 일정, 큰 지출 승인 기준을 문장으로 정해두면 관계 피로가 크게 줄어듭니다.",
    timelineGuide:"함께 결정하고 생활 구조를 조정하기 좋은 시기와 각자 부담을 줄여야 할 시기를 봅니다."
  },
  "썸·소개": {
    badge:"BEGINNING", first:"첫인상·호감", intimacy:"호감 표현과 거리 조절", future:"관계 발전 가능성", showChild:false,
    scoreTitle:"썸 발전 가능성 지수",
    intro:"첫인상, 연락 템포, 호감 표현, 부담 없이 관계가 이어지는지를 중심으로 봅니다.",
    weights:{attraction:.32,communication:.24,daily:.05,conflict:.08,money:.02,growth:.11,support:.10,balance:.08},
    labels:{attraction:"첫인상·호감",communication:"연락·대화 템포",daily:"만남 리듬",conflict:"오해 정리",money:"데이트 부담",growth:"관계 발전",support:"안심·신뢰",balance:"속도·주도권"},
    metricDesc:{attraction:"첫 만남과 초반 호감이 생기는 정도",communication:"연락 빈도와 대화의 템포가 맞는 정도",daily:"자연스럽게 다음 만남으로 이어지는 정도",conflict:"답장 지연·말투 같은 작은 오해를 풀 수 있는 정도",money:"초반 데이트 비용이 부담이나 시험이 되지 않는 정도",growth:"썸이 연애로 발전할 여지가 있는 정도",support:"상대에게 부담보다 편안함을 주는 정도",balance:"한쪽만 쫓거나 밀어내지 않는 속도 균형"},
    conflictScript:"추측하지 말고 가볍게 확인할게. 나는 이렇게 느꼈는데 네 의도는 어땠어?",
    operationTitle:"연락·만남 속도 조절법", operationGuide:"답장 시간보다 대화의 질을 보고, 호감 확인 전에는 과한 선물·미래 약속·감정 시험을 피하세요.",
    timelineGuide:"관계가 자연스럽게 가까워지는 시기와 서두르지 않는 편이 좋은 시기를 봅니다."
  },
  "친구": {
    badge:"FRIENDSHIP", first:"편안함·친밀감", intimacy:"우정 표현과 의지 방식", future:"오래 가는 우정", showChild:false,
    scoreTitle:"우정 궁합 지수",
    intro:"재미, 신뢰, 비밀 유지, 서로의 성장을 돕는 힘과 경계 존중을 중심으로 봅니다.",
    weights:{attraction:.05,communication:.24,daily:.10,conflict:.16,money:.06,growth:.18,support:.16,balance:.05},
    labels:{attraction:"편안함·친밀감",communication:"대화·유머",daily:"만남·연락 리듬",conflict:"서운함 회복",money:"정산·빌려주기",growth:"서로의 성장",support:"의리·지원",balance:"관계 경계"},
    metricDesc:{attraction:"함께 있을 때 긴장하지 않고 편안한 정도",communication:"대화·유머·관심사를 자연스럽게 공유하는 정도",daily:"연락이 뜸해도 관계를 유지하는 리듬",conflict:"서운함을 쌓지 않고 다시 편하게 돌아오는 힘",money:"정산·선물·돈 빌려주기에서 선을 지키는 정도",growth:"서로의 도전과 변화를 응원하는 정도",support:"필요할 때 현실적으로 편이 되어주는 정도",balance:"사생활과 다른 인간관계를 존중하는 정도"},
    conflictScript:"우리 사이를 오래 가져가고 싶어서 말해. 내가 서운했던 부분만 짧게 설명할게.",
    operationTitle:"우정의 경계·신뢰 운영법", operationGuide:"돈 거래, 비밀 공유, 연락 의무, 다른 친구 관계에 대한 기대치를 지나치게 묶지 않는 것이 오래 가는 비결입니다.",
    timelineGuide:"함께 활동하기 좋은 시기와 서로의 생활을 존중하며 느슨하게 연결할 시기를 봅니다."
  },
  "가족": {
    badge:"FAMILY", first:"정서적 유대", intimacy:"돌봄과 정서 표현", future:"가족 관계의 안정", showChild:false,
    scoreTitle:"가족 관계 조화 지수",
    intro:"가족이라는 이유로 당연시하기 쉬운 돌봄, 간섭, 책임, 세대 차이와 정서적 안전을 중심으로 봅니다.",
    weights:{attraction:.03,communication:.15,daily:.18,conflict:.24,money:.10,growth:.05,support:.20,balance:.05},
    labels:{attraction:"정서적 유대",communication:"가족 대화",daily:"생활·돌봄",conflict:"갈등·거리조절",money:"가족 비용",growth:"서로의 독립",support:"보호·지원",balance:"책임 분담"},
    metricDesc:{attraction:"가족으로서 기본적인 애착과 정서적 연결감",communication:"잔소리나 회피 대신 필요한 말을 전달하는 정도",daily:"생활 공간과 돌봄 역할을 조율하는 정도",conflict:"세대 차이와 오래된 서운함을 안전하게 다루는 힘",money:"생활비·부양·경조사 비용의 기준을 맞추는 정도",growth:"서로를 통제하지 않고 독립과 성장을 허용하는 정도",support:"아플 때·힘들 때 실제로 보호하고 돕는 정도",balance:"희생과 책임이 특정 가족에게 몰리지 않는 정도"},
    conflictScript:"가족이니까 참으라는 말 대신, 서로 지킬 선과 도울 수 있는 범위를 구체적으로 정하자.",
    operationTitle:"돌봄·거리·가족비용 운영법", operationGuide:"연락 의무, 방문 빈도, 생활비·부양 범위, 사생활 경계를 명확히 하면 애정이 간섭으로 변하는 것을 줄일 수 있습니다.",
    timelineGuide:"가족 행사와 돌봄을 함께 처리하기 좋은 시기, 거리를 두고 부담을 나눌 시기를 봅니다."
  },
  "사업파트너": {
    badge:"PARTNERSHIP", first:"신뢰·업무 호흡", intimacy:"역할 인정과 피드백 방식", future:"공동 목표와 성과", showChild:false,
    scoreTitle:"사업 파트너 적합 지수",
    intro:"친밀감보다 역할 분담, 의사결정, 돈, 책임, 계약, 위기 대응을 가장 크게 봅니다.",
    weights:{attraction:.02,communication:.20,daily:.08,conflict:.14,money:.22,growth:.22,support:.05,balance:.07},
    labels:{attraction:"초기 신뢰",communication:"보고·피드백",daily:"업무 루틴",conflict:"이견 조정",money:"자금·정산",growth:"성과·확장",support:"위기 지원",balance:"권한·역할"},
    metricDesc:{attraction:"첫 협업에서 신뢰와 실행 기대가 생기는 정도",communication:"보고·회의·피드백이 명확하게 오가는 정도",daily:"마감·업무 방식·속도를 맞추는 정도",conflict:"전략 이견을 감정싸움 없이 결정하는 힘",money:"매출·비용·급여·지분·정산을 투명하게 운영하는 정도",growth:"각자의 강점을 결합해 성과와 확장을 만드는 정도",support:"위기나 업무 공백 때 서로를 보완하는 정도",balance:"대표권·의사결정권·실무 책임이 명확한 정도"},
    conflictScript:"사람 평가와 안건을 분리하고, 데이터·기한·책임자를 기준으로 결정하자.",
    operationTitle:"지분·권한·계약 운영법", operationGuide:"역할, 대표권, 비용 승인, 급여, 지분, 지식재산권, 퇴사·해산 조건을 친할 때 문서로 정해야 합니다.",
    timelineGuide:"공동 프로젝트를 확장하기 좋은 시기와 현금·책임·계약을 보수적으로 관리할 시기를 봅니다."
  }
};
const ROLE_DESC = {
  비견:"나와 비슷한 결을 가진 동료처럼 느낍니다. 편하고 솔직하지만, 서로 양보하지 않으면 은근한 경쟁이 생길 수 있습니다.",
  겁재:"강한 자극과 승부욕을 일으키는 상대입니다. 함께 도전할 때 힘이 커지지만 돈·주도권의 경계가 필요합니다.",
  식신:"편안함과 웃음을 끌어내는 상대입니다. 함께 먹고 쉬고 만들 때 정이 깊어지는 관계입니다.",
  상관:"생각과 표현을 흔들어 깨우는 상대입니다. 재미와 아이디어가 넘치지만 직설적인 말은 조절해야 합니다.",
  편재:"활동 반경을 넓혀주는 매력적인 상대입니다. 새로운 경험과 사람을 연결하지만 지출 속도도 빨라질 수 있습니다.",
  정재:"생활을 안정시키고 현실을 챙겨주는 상대입니다. 약속과 꾸준함이 관계의 신뢰가 됩니다.",
  편관:"긴장감과 책임감을 동시에 주는 상대입니다. 위기에는 든든하지만 통제나 압박으로 느껴지지 않게 해야 합니다.",
  정관:"믿음·원칙·공식성을 느끼게 하는 상대입니다. 관계를 반듯하게 만들지만 지나친 평가와 기준은 부담이 됩니다.",
  편인:"남다른 관점과 직관을 열어주는 상대입니다. 깊이 통할 수 있지만 혼자 생각하고 추측하는 시간을 줄여야 합니다.",
  정인:"보호받고 이해받는 느낌을 주는 상대입니다. 안정감이 크지만 한쪽만 계속 돌보는 구조가 되지 않게 해야 합니다."
};
const AFFECTION_STYLE = {
  木:"함께 성장할 계획을 세우고, 가능성을 응원해줄 때 애정을 느낍니다.",
  火:"분명한 표현·칭찬·반응이 중요합니다. 좋아하면 좋아한다고 바로 보여주는 편입니다.",
  土:"식사·일정·생활을 챙기는 행동으로 마음을 표현합니다. 꾸준함이 사랑의 언어입니다.",
  金:"약속을 지키고 문제를 정확히 해결해주는 방식으로 신뢰와 애정을 보여줍니다.",
  水:"깊은 대화와 공감, 둘만의 조용한 시간을 통해 친밀감을 쌓습니다."
};
const CONFLICT_STYLE = {
  비겁:"문제가 생기면 즉시 맞서거나 자기 입장을 지키려는 편",
  식상:"말로 풀어야 답답함이 사라지는 편",
  재성:"감정보다 현실적인 해결책과 손익을 먼저 보는 편",
  관성:"옳고 그름·약속·책임을 분명히 하려는 편",
  인성:"바로 말하기보다 혼자 생각하고 정리할 시간이 필요한 편"
};
const NEED_PHRASE = {
  木:"네가 가려는 방향을 이해해. 같이 방법을 찾아보자.",
  火:"네 마음이 중요해. 내가 분명하게 표현할게.",
  土:"말뿐 아니라 실제로 이렇게 챙길게.",
  金:"약속과 기준을 정확히 정리해보자.",
  水:"서두르지 않을게. 네 생각을 끝까지 들어볼게."
};
function clampCompat(n){ return Math.max(18, Math.min(96, Math.round(n))); }
function dominantCat(p){ return Object.entries(p.godCount).sort((a,b)=>b[1]-a[1])[0][0]; }
function branchesOf(p){ return p.pillars.map(x=>x.branch); }
function hasGod(p, god){ return p.pillars.some(x=>x.sg===god||x.bg===god); }
function romanceSignal(p){ const bs=branchesOf(p); return bs.includes(HONG_YEOM[p.dayStem]) || bs.includes(TRI_STAR[TRI[p.dayBranch]][0]); }
function childFortuneWindow(husband, wife, fromYear, years) {
  years = years || 6;
  const out = [];
  for (let i = 0; i < years; i++) {
    const yr = fromYear + i;
    const wd = seunDetail(wife.p, yr, yr - wife.y + 1), hd = seunDetail(husband.p, yr, yr - husband.y + 1);
    const wGood = GCAT[wd.sg] === '식상' || GCAT[wd.bg] === '식상';
    const hGood = GCAT[hd.sg] === '관성' || GCAT[hd.bg] === '관성';
    const hAlt = GCAT[hd.sg] === '식상' || GCAT[hd.bg] === '식상';
    if (wGood || hGood) out.push({year:yr,both:wGood&&hGood,wGood,hGood,hAlt});
  }
  return out;
}
function strengthHarmony(pa,pb){
  const diff=Math.abs(pa.score-pb.score), aStrong=pa.score>=52, bStrong=pb.score>=52;
  let score=68, text="";
  if(aStrong!==bStrong && diff>=12 && diff<=38){ score=84; text="한쪽의 추진력과 한쪽의 조율력이 맞물리는 보완형입니다. 강한 쪽은 결정하되 지배하지 말고, 조율하는 쪽은 배려하되 참기만 하지 않는 것이 핵심입니다."; }
  else if(diff<10){ score=74; text="두 사람의 에너지 크기가 비슷해 속도와 자존심을 이해하기 쉽습니다. 다만 둘 다 강하면 주도권 경쟁, 둘 다 약하면 결정 미루기를 조심하세요."; }
  else if(diff>45){ score=54; text="에너지 차이가 큰 편이라 한쪽이 관계를 끌고 다른 쪽이 따라가는 구조가 되기 쉽습니다. 결정권과 휴식권을 의식적으로 나누는 것이 좋습니다."; }
  else { score=70; text="추진력의 차이가 적당합니다. 역할을 고정하지 않고 상황에 따라 리더와 조율자를 바꾸면 균형이 좋아집니다."; }
  if(pa.strength.includes("극")||pb.strength.includes("극")) score-=5;
  return {score:clampCompat(score),text,diff};
}
function mutualSupport(pa,pb){
  const ba=branchesOf(pa), bb=branchesOf(pb);
  const aNoble=CHEON_EUL[pa.dayStem].some(x=>bb.includes(x));
  const bNoble=CHEON_EUL[pb.dayStem].some(x=>ba.includes(x));
  const aStudy=bb.includes(MUN_CHANG[pa.dayStem]);
  const bStudy=ba.includes(MUN_CHANG[pb.dayStem]);
  return {aNoble,bNoble,aStudy,bStudy};
}
function compatYear(A,B,year){
  const pa=A.p,pb=B.p,gz=currentYearGZ(year),sa=seunDetail(pa,year,year-A.y+1),sb=seunDetail(pb,year,year-B.y+1);
  let score=56; const tags=[];
  const inspect=(P,S,label)=>{
    if(YUKHAP[P.dayBranch]===gz.branch){score+=9;tags.push(label+" 합");}
    if(TRI[P.dayBranch]===TRI[gz.branch]&&P.dayBranch!==gz.branch){score+=5;tags.push(label+" 흐름");}
    if(B12.indexOf(gz.branch)===CHUNG(B12.indexOf(P.dayBranch))){score-=10;tags.push(label+" 변동");}
    if(WONJIN[P.dayBranch]===gz.branch){score-=6;tags.push(label+" 서운함");}
    if(GWIMUN[P.dayBranch]===gz.branch){score-=4;tags.push(label+" 예민");}
    if(S.tags.some(t=>t.t.includes("합·인연"))){score+=5;}
    if(S.tags.some(t=>t.t.includes("이동"))){tags.push(label+" 이동");}
    if(["정관","정인","식신"].includes(S.sg))score+=2;
    if(["겁재","편관"].includes(S.sg))score-=2;
  };
  inspect(pa,sa,A.name); inspect(pb,sb,B.name);
  if(GCAT[sa.sg]===GCAT[sb.sg]){score+=4;tags.push("관심사 일치");}
  score=clampCompat(score);
  const title=score>=73?"함께 밀기 좋은 해":score>=61?"대화와 협력이 잘 붙는 해":score>=49?"무난하게 조율하는 해":"각자의 속도를 지켜야 하는 해";
  return {year,score,title,tags:[...new Set(tags)].slice(0,4),gz:gz.stem+gz.branch};
}
function relationshipExpression(element,type){
  const base=AFFECTION_STYLE[element];
  if(type==="사업파트너"){
    const m={木:"아이디어와 성장 방향을 인정하고 자율성을 줄 때 역량이 살아납니다.",火:"빠른 피드백과 공개적인 인정이 동력이 됩니다.",土:"일정·자원·책임을 안정적으로 제공할 때 신뢰합니다.",金:"기준·권한·품질 조건을 명확히 할 때 편하게 일합니다.",水:"정보와 맥락을 충분히 공유하고 생각할 시간을 줄 때 좋은 판단을 냅니다."}; return m[element];
  }
  if(type==="가족"){
    const m={木:"간섭보다 가능성을 믿고 독립을 응원해주는 돌봄을 원합니다.",火:"고마움과 애정을 말로 분명히 표현해줄 때 가족의 정을 느낍니다.",土:"식사·건강·생활을 실제 행동으로 챙겨줄 때 안정감을 느낍니다.",金:"약속과 경계를 존중하고 필요한 일을 정확히 해줄 때 믿습니다.",水:"판단하기 전에 이야기를 충분히 들어주고 감정을 이해해줄 때 가까워집니다."}; return m[element];
  }
  if(type==="친구"){
    const m={木:"서로의 도전을 응원하고 새로운 경험을 함께할 때 우정이 깊어집니다.",火:"자주 웃고 반응하며 솔직하게 좋아한다고 표현하는 친구를 편하게 느낍니다.",土:"약속을 지키고 실제로 챙겨주는 꾸준한 우정을 중요하게 봅니다.",金:"비밀과 선을 지키며 문제를 정확히 도와주는 친구를 신뢰합니다.",水:"깊은 이야기와 조용한 공감을 나눌 수 있을 때 친밀감을 느낍니다."}; return m[element];
  }
  if(type==="썸·소개"){
    const m={木:"공통 관심사와 다음 계획을 자연스럽게 제안할 때 호감이 자랍니다.",火:"호감을 숨기기보다 밝은 반응과 구체적인 칭찬을 보여주는 편입니다.",土:"말보다 약속을 지키고 편안한 만남을 반복하면서 신뢰를 쌓습니다.",金:"시간·장소·의도를 명확히 하는 깔끔한 태도에서 호감을 느낍니다.",水:"서두르지 않는 대화와 섬세한 공감 속에서 천천히 마음을 엽니다."}; return m[element];
  }
  return base;
}
function applyRelationProfile(baseMetrics,type){
  const meta=COMPAT_TYPE_META[type]||COMPAT_TYPE_META["연인"];
  const metrics=baseMetrics.map(m=>({
    ...m,
    label:meta.labels[m.key]||m.label,
    desc:meta.metricDesc[m.key]||m.desc
  }));
  let weighted=0,total=0;
  for(const m of metrics){const w=meta.weights[m.key]||0;weighted+=m.score*w;total+=w;}
  return {metrics,score:clampCompat(weighted/(total||1))};
}
function relationshipArchetype(metrics,flags,type){
  const by=Object.fromEntries(metrics.map(x=>[x.key,x.score]));
  const top=[...metrics].sort((a,b)=>b.score-a.score)[0];
  if(type==="사업파트너"){
    if(by.money>=78&&by.growth>=76)return {name:"성과 확장형 파트너",desc:"돈의 흐름과 성장 방향을 함께 설계할 힘이 큽니다. 친분보다 계약과 책임 구조를 먼저 세우면 강한 팀이 됩니다."};
    if(by.communication>=78)return {name:"전략·기획형 파트너",desc:"아이디어와 피드백을 빠르게 주고받는 팀입니다. 회의 결과를 문서와 담당자로 남기면 실행력이 살아납니다."};
    if(by.balance>=78)return {name:"역할 분업형 파트너",desc:"대표·영업·기획·운영처럼 역할을 나눌 때 강합니다. 권한과 최종 결정권을 사전에 명확히 해야 합니다."};
    return {name:"검증 후 성장형 파트너",desc:"처음부터 크게 합치기보다 작은 프로젝트로 신뢰와 정산 방식을 검증한 뒤 확장하는 편이 좋습니다."};
  }
  if(type==="가족"){
    if(by.support>=80)return {name:"서로 지키는 가족형",desc:"위기와 생활 문제에서 실제로 돕는 힘이 큽니다. 도움과 간섭의 경계를 구분하면 안정감이 커집니다."};
    if(by.conflict<58)return {name:"거리 조절이 필요한 가족형",desc:"오래된 역할과 서운함이 반복되기 쉽습니다. 가족이라는 이유보다 각자의 경계와 책임 범위를 다시 정하는 것이 중요합니다."};
    return {name:"생활 협력형 가족",desc:"말보다 반복되는 돌봄과 생활 협력을 통해 관계가 안정되는 가족입니다."};
  }
  if(type==="친구"){
    if(by.communication>=80)return {name:"대화가 끊이지 않는 친구",desc:"이야기와 관심사를 나누며 에너지를 얻는 우정입니다. 비밀과 타인의 이야기에 대한 선을 지키면 오래 갑니다."};
    if(by.support>=80)return {name:"의리형 친구",desc:"필요할 때 실제로 움직여주는 친구 관계입니다. 도움을 당연하게 여기지 않고 표현하는 것이 중요합니다."};
    return {name:"느슨하지만 오래 가는 친구",desc:"자주 연락하지 않아도 각자의 생활을 존중하며 다시 만날 수 있는 우정입니다."};
  }
  if(type==="썸·소개"){
    if(by.attraction>=82&&by.communication>=72)return {name:"빠르게 가까워지는 썸",desc:"첫인상과 대화 흐름이 좋아 관계가 빠르게 진전될 수 있습니다. 속도보다 실제 행동의 일관성을 확인하세요."};
    if(by.attraction>=75&&by.balance<60)return {name:"밀고 당기기 강한 썸",desc:"호감은 있지만 관계 속도가 엇갈릴 수 있습니다. 추측과 시험보다 다음 만남을 구체적으로 제안하는 편이 낫습니다."};
    return {name:"천천히 확인하는 썸",desc:"강한 첫인상보다 반복되는 만남과 신뢰로 호감이 커지는 관계입니다."};
  }
  if(type==="부부"){
    if(by.daily>=80&&by.conflict>=70)return {name:"생활 동반자형 부부",desc:"함께 살수록 강점이 드러나는 부부입니다. 가사와 돈의 규칙을 꾸준히 업데이트하면 안정적입니다."};
    if(by.money>=78&&by.growth>=70)return {name:"공동 목표형 부부",desc:"자산·커리어·가족 계획을 함께 세울 때 힘이 커집니다. 목표가 관계보다 앞서지 않게 정서적 시간을 남겨두세요."};
    if(by.conflict<58)return {name:"회복 규칙이 필요한 부부",desc:"사랑보다 갈등 처리 방식이 관계의 만족도를 좌우합니다. 싸움의 금지선과 재논의 시간을 정해두세요."};
  }
  if(by.attraction>=80&&by.conflict<58)return {name:"불꽃 성장형 연인",desc:"강한 끌림과 강한 자극이 함께 있는 관계입니다. 감정의 온도를 낮추는 기술을 배우면 오래 갈수록 단단해집니다."};
  if(by.support>=78||flags.fillCount>=2)return {name:"상호 보완형 연인",desc:"서로에게 없는 기운과 역할을 채워주는 관계입니다. 상대의 다름을 고치려 하지 않을 때 가장 큰 시너지가 납니다."};
  if(top.key==="communication")return {name:"대화 성장형 연인",desc:"말과 생각을 주고받으며 함께 성장하는 관계입니다. 대화가 길어져도 결론과 행동을 남기는 습관이 필요합니다."};
  return {name:"잔잔한 축적형 연인",desc:"한 번의 강한 사건보다 반복되는 신뢰를 통해 정이 깊어지는 관계입니다."};
}
function computeCompat(A, B, type) {
  type=type||"연인";
  if(type==="연인·부부") type="연인";
  const pa = A.p, pb = B.p, meta=COMPAT_TYPE_META[type]||COMPAT_TYPE_META["연인"];
  let score = 50;
  const mind = [], life = [], social = [];
  const F = (arr, t, pts, c, d) => { score += pts; arr.push({ t, pts, c, d }); };
  const gh = ganhapCheck(pa.dayStem, pb.dayStem);
  const ea = STEM_E[pa.dayStem], eb = STEM_E[pb.dayStem];
  const EORD = ["木", "火", "土", "金", "水"], ia=EORD.indexOf(ea),ib=EORD.indexOf(eb);
  const stemGenerateAB=(ia+1)%5===ib, stemGenerateBA=(ib+1)%5===ia, sameElement=ea===eb;
  if (gh) F(mind, "일간 간합(干合)", 20, "#E5C465", `【한마디로: 서로에게 자석처럼 끌리는 조합】 ${A.name}님의 ${pa.dayStem}와 ${B.name}님의 ${pb.dayStem}가 천간합을 이룹니다. 서로에게 자연스럽게 관심이 향하고, 함께 있을 때 각자와 다른 관계의 색이 만들어지는 구조로 봅니다.`);
  else if (sameElement) F(mind, "일간 비화(比和)", 5, "#DCE1E5", `【한마디로: 친구처럼 편한 조합】 두 사람 모두 ${E_KR[ea]}(${ea}) 기운의 일간이라 속도와 취향을 설명하지 않아도 이해하기 쉽습니다. 닮은 단점까지 함께 커지지 않도록 역할을 나누는 것이 좋습니다.`);
  else if (stemGenerateAB||stemGenerateBA) { const giver=stemGenerateAB?A:B,receiver=stemGenerateAB?B:A; F(mind,"일간 상생(相生)",15,"#7DB889",`【한마디로: 한쪽이 북돋고 한쪽이 자라는 조합】 ${giver.name}님이 자연스럽게 챙기고 밀어주며 ${receiver.name}님은 그 곁에서 힘을 얻는 흐름입니다. 주는 쪽이 지치지 않도록 받은 쪽의 표현이 중요합니다.`); }
  else F(mind, "일간 상극(相剋)", -8, "#C3CBD3", `【한마디로: 다름이 선명한 조합】 ${E_KR[ea]}와 ${E_KR[eb]}는 서로를 제어하는 관계라 긴장과 배움이 함께 옵니다. 상대를 고치려 하기보다 서로의 다른 기능을 인정하면 강한 팀이 됩니다.`);

  const da=pa.dayBranch,db=pb.dayBranch;
  const yukhap=YUKHAP[da]===db, sameTri=TRI[da]===TRI[db]&&da!==db, chung=B12.indexOf(db)===CHUNG(B12.indexOf(da)), wonjin=WONJIN[da]===db, gwimun=GWIMUN[da]===db, hy=hyeongCheck(da,db);
  let lifeHit=false;
  if(yukhap){lifeHit=true;F(life,"일지 육합(六合)",25,"#7DB889",`【한마디로: 함께 있을 때 생활이 편한 조합】 두 사람의 일지 ${da}·${db}가 육합을 이룹니다. 일상과 가까운 거리에서 서로를 자연스럽게 받아들이는 힘이 큽니다.`);}
  if(sameTri){lifeHit=true;F(life,"일지 삼합(三合)",15,"#7DB889",`【한마디로: 같은 방향을 바라보는 조합】 두 사람의 일지가 같은 삼합 그룹에 속해 목표와 관심사를 함께 키우기 좋습니다.`);}
  if(chung){lifeHit=true;F(life,"일지 충(沖)",-20,"#EA6B5C",`【한마디로: 생활 방식이 달라 움직임이 많은 조합】 루틴·속도·공간 사용에서 부딪힐 수 있습니다. 각자의 시간과 영역을 분명히 두면 충의 기운이 변화와 활력으로 쓰입니다.`);}
  if(wonjin){lifeHit=true;F(life,"일지 원진(怨嗔)",-15,"#C3CBD3",`【한마디로: 가까울수록 사소한 서운함이 쌓일 수 있는 조합】 마음을 추측하지 말고 그날그날 짧게 확인하는 습관이 필요합니다.`);}
  if(gwimun){lifeHit=true;F(life,"일지 귀문(鬼門)",-10,"#C3CBD3",`【한마디로: 깊이 읽지만 깊이 오해할 수도 있는 조합】 표정과 말투를 지나치게 해석하지 말고 질문으로 확인하세요.`);}
  if(hy){lifeHit=true;F(life,`일지 형(刑·${hy})`,-12,"#C3CBD3",`【한마디로: 아끼는 마음이 간섭으로 바뀌기 쉬운 조합】 조언하기 전에 상대가 해결책을 원하는지 공감을 원하는지 먼저 물어보는 것이 좋습니다.`);}
  if(!lifeHit)F(life,"담백한 일지 관계",0,"#DCE1E5",`【한마디로: 만들어가는 조합】 강한 합충보다 반복되는 경험과 신뢰를 통해 관계가 깊어지는 타입입니다.`);

  const ya=pa.pillars[pa.pillars.length-1].branch,yb=pb.pillars[pb.pillars.length-1].branch;
  if(TRI[ya]===TRI[yb]&&ya!==yb)F(social,"띠 삼합",15,"#7DB889",`${ANIMAL[ya]}띠와 ${ANIMAL[yb]}띠는 삼합 관계로, 주변 환경과 공동체 안에서 자연스럽게 어울리는 조합으로 봅니다.`);
  else if(YUKHAP[ya]===yb)F(social,"띠 육합",10,"#7DB889",`${ANIMAL[ya]}띠와 ${ANIMAL[yb]}띠는 육합 관계로, 겉으로 드러나는 호흡이 편안한 편입니다.`);
  else if(B12.indexOf(yb)===CHUNG(B12.indexOf(ya)))F(social,"띠 충",-10,"#EA6B5C",`${ANIMAL[ya]}띠와 ${ANIMAL[yb]}띠는 충 관계입니다. 세대·가족 문화·바깥 활동 방식에서 다름이 드러날 수 있으나, 띠는 전체 명식 중 일부입니다.`);
  else F(social,"띠 평운",0,"#DCE1E5",`${ANIMAL[ya]}띠와 ${ANIMAL[yb]}띠는 특별한 합충 없이 무난한 관계입니다.`);

  const lackA=Object.keys(pa.el).filter(e=>pa.el[e]===0&&pb.el[e]>0),lackB=Object.keys(pb.el).filter(e=>pb.el[e]===0&&pa.el[e]>0),fillCount=lackA.length+lackB.length;
  if(fillCount>0){const parts=[];if(lackA.length)parts.push(`${A.name}님에게 부족한 ${lackA.map(e=>E_KR[e]).join("·")}을 ${B.name}님이 보완`);if(lackB.length)parts.push(`${B.name}님에게 부족한 ${lackB.map(e=>E_KR[e]).join("·")}을 ${A.name}님이 보완`);F(social,"오행 보완",Math.min(15,fillCount*5),"#E5C465",`【한마디로: 서로의 빈칸을 채우는 조합】 ${parts.join(", ")}합니다. 다만 상대가 내 부족함을 자동으로 해결해준다는 뜻은 아니며, 서로 다른 장점을 활용할 때 시너지가 난다는 의미입니다.`);}

  score=Math.max(5,Math.min(98,Math.round(score)));
  const traditionalScore=score;
  const support=mutualSupport(pa,pb),balance=strengthHarmony(pa,pb),domA=dominantCat(pa),domB=dominantCat(pb);
  const roleA=tenGod(S10.indexOf(pa.dayStem),S10.indexOf(pb.dayStem)),roleB=tenGod(S10.indexOf(pb.dayStem),S10.indexOf(pa.dayStem));
  let attraction=58+(gh?24:0)+(yukhap?16:0)+(sameTri?9:0)+(sameElement?7:0)+((romanceSignal(pa)||romanceSignal(pb))?5:0)+(chung?5:0);
  let communication=58+(sameElement?10:0)+((stemGenerateAB||stemGenerateBA)?13:-2)+Math.min(12,(pa.godCount.식상+pb.godCount.식상+pa.godCount.인성+pb.godCount.인성)*2)-(gwimun?7:0)-(wonjin?4:0);
  let daily=65+(yukhap?24:0)+(sameTri?14:0)-(chung?20:0)-(wonjin?13:0)-(hy?10:0);
  let conflict=68+(gh?5:0)+(yukhap?10:0)-(chung?18:0)-(wonjin?18:0)-(gwimun?10:0)-(hy?14:0)-((pa.godCount.비겁>=2&&pb.godCount.비겁>=2)?7:0)+((pa.godCount.인성+pb.godCount.인성)>=3?5:0);
  let money=60+(Math.abs(pa.godCount.재성-pb.godCount.재성)<=1?7:0)+((pa.godCount.식상>=1&&pb.godCount.재성>=1)||(pb.godCount.식상>=1&&pa.godCount.재성>=1)?9:0)+((pa.godCount.관성>=1&&pb.godCount.재성>=1)||(pb.godCount.관성>=1&&pa.godCount.재성>=1)?6:0)-((pa.godCount.비겁>=2&&pb.godCount.비겁>=2)?12:0);
  const nextCat={비겁:"식상",식상:"재성",재성:"관성",관성:"인성",인성:"비겁"};
  let growth=62+(domA===domB?6:0)+((nextCat[domA]===domB||nextCat[domB]===domA)?13:0)+Math.min(14,fillCount*5)+(sameTri?6:0);
  let supportScore=52+(support.aNoble?16:0)+(support.bNoble?16:0)+(support.aStudy?5:0)+(support.bStudy?5:0)+Math.min(12,fillCount*4);
  const baseMetrics=[
    {key:"attraction",label:meta.first,score:clampCompat(attraction),desc:"서로에게 자연스럽게 관심이 향하고 친밀감이 붙는 정도"},
    {key:"communication",label:"대화·표현",score:clampCompat(communication),desc:"말의 속도와 감정 표현을 이해하는 정도"},
    {key:"daily",label:"생활·루틴",score:clampCompat(daily),desc:"가까운 거리에서 일상과 습관을 조율하는 정도"},
    {key:"conflict",label:"갈등 회복",score:clampCompat(conflict),desc:"부딪힌 뒤 감정을 정리하고 다시 연결하는 힘"},
    {key:"money",label:"돈·현실",score:clampCompat(money),desc:"지출·저축·책임과 현실 문제를 운영하는 호흡"},
    {key:"growth",label:"목표·성장",score:clampCompat(growth),desc:"서로의 실력과 가능성을 키워주는 정도"},
    {key:"support",label:"귀인·지원",score:clampCompat(supportScore),desc:"필요할 때 도움과 다른 관점을 제공하는 정도"},
    {key:"balance",label:"강약·추진력",score:balance.score,desc:"리더·조율자 역할과 에너지 속도의 균형"}
  ];
  const profiled=applyRelationProfile(baseMetrics,type), metrics=profiled.metrics, relationScore=profiled.score;
  score=Math.max(5,Math.min(98,Math.round(traditionalScore*.42+relationScore*.58)));
  const archetype=relationshipArchetype(metrics,{fillCount},type);
  const sorted=[...metrics].sort((a,b)=>b.score-a.score),top=sorted.slice(0,3),low=sorted.slice(-2).reverse();
  const years=Array.from({length:6},(_,i)=>compatYear(A,B,NOW.getFullYear()+i)),bestYears=[...years].sort((a,b)=>b.score-a.score).slice(0,2),cautionYear=[...years].sort((a,b)=>a.score-b.score)[0];

  const all=[...mind,...life,...social],posT=all.filter(n=>n.pts>0).map(n=>n.t),negT=all.filter(n=>n.pts<0).map(n=>n.t);
  let synthesis=`${meta.intro} ${A.name}님과 ${B.name}님의 ${meta.scoreTitle}는 ${score}점이며, 관계 유형은 「${archetype.name}」입니다. `;
  if(posT.length)synthesis+=`${posT.slice(0,3).join("·")}이 관계의 강점으로 작용합니다. `;
  if(negT.length)synthesis+=`${negT.slice(0,2).join("·")}에서는 결의 차이가 드러날 수 있으므로, 누가 맞는지보다 운영 규칙을 정하는 편이 좋습니다. `;
  synthesis+=`가장 높은 지수는 ${top[0].label} ${top[0].score}점, 가장 보완할 지수는 ${low[0].label} ${low[0].score}점입니다. 점수는 관계의 성공 확률이 아니라 이 앱의 명리 규칙을 비교하기 위한 상대 지표입니다.`;

  const moneyStyle=p=>{
    if(p.godCount.재성>=2&&p.godCount.식상>=1)return "기회를 만들고 돈을 움직이는 확장형";
    if(hasGod(p,"정재"))return "예산과 안정적인 축적을 중시하는 관리형";
    if(hasGod(p,"편재"))return "경험·사람·기회에 과감히 쓰는 순환형";
    if(p.godCount.비겁>=2)return "사람과 공동 활동에 지출이 붙기 쉬운 관계형";
    if(p.godCount.인성>=2)return "충분히 알아보고 안전판을 만든 뒤 쓰는 준비형";
    return "상황에 따라 탄력적으로 조절하는 혼합형";
  };
  const good=[
    `${top[0].label}을 강점으로 쓰세요 — ${top[0].desc}.`,
    `${A.name}님에게는 “${NEED_PHRASE[ea]}”라는 말이, ${B.name}님에게는 “${NEED_PHRASE[eb]}”라는 말이 잘 통합니다.`,
    type==="사업파트너"?"회의마다 결정사항·담당자·기한을 남기세요.":type==="가족"?"도울 수 있는 범위와 지켜야 할 사생활 경계를 함께 말하세요.":type==="친구"?"연락 횟수보다 필요할 때 믿을 수 있는 행동을 남기세요.":type==="부부"?"가사·돈·가족 일정은 사랑이 아니라 시스템으로 운영하세요.":type==="썸·소개"?"말보다 다음 만남을 구체적으로 제안해 호감을 확인하세요.":"연락·데이트·혼자 있는 시간의 기준을 미리 맞추세요."
  ];
  const cautions=[
    `${low[0].label}은 자동으로 맞지 않을 수 있습니다 — 감정이 커지기 전에 규칙과 시간을 먼저 정하세요.`,
    `${CONFLICT_STYLE[domA]}인 ${A.name}님과 ${CONFLICT_STYLE[domB]}인 ${B.name}님은 같은 문제도 다른 순서로 풀 수 있습니다.`,
    type==="사업파트너"?"친분으로 지분·비용·퇴사 조건을 흐리지 마세요.":type==="가족"?"가족이라는 이유로 희생과 연락을 의무화하지 마세요.":type==="친구"?"돈 빌려주기와 비밀 공유가 우정의 시험이 되지 않게 하세요.":type==="썸·소개"?"답장 속도와 SNS 반응만으로 상대 마음을 단정하지 마세요.":type==="부부"?"한 사람이 감정노동·가사·부양을 모두 떠안지 않게 정기적으로 역할을 재조정하세요.":"질투·시험·잠수로 애정을 확인하려 하지 마세요."
  ];

  let child=null;
  if(meta.showChild&&A.gender!==B.gender){const husband=A.gender==="남"?A:B,wife=A.gender==="남"?B:A;if(wife.nowAge<=51&&wife.nowAge>=18)child={husbandName:husband.name,wifeName:wife.name,husbandInfo:childSymbolInfo(husband),wifeInfo:childSymbolInfo(wife),hourKnown:husband.hourBranch!==null&&wife.hourBranch!==null,windows:childFortuneWindow(husband,wife,NOW.getFullYear(),6)};}
  return {type,meta,score,traditionalScore,relationScore,mind,life,social,ganhap:gh,synthesis,child,ya,yb,da,db,metrics,archetype,top,low,years,bestYears,cautionYear,roleA,roleB,domA,domB,support,balance,fillCount,lackA,lackB,moneyA:moneyStyle(pa),moneyB:moneyStyle(pb),affectionA:relationshipExpression(ea,type),affectionB:relationshipExpression(eb,type),good,cautions};
}

function svgEsc(v){return esc(v);}
function compatRadarSvg(metrics){
  const size=340,cx=170,cy=170,r=112,n=metrics.length;
  const point=(ratio,i)=>{const a=-Math.PI/2+(Math.PI*2*i/n);return [cx+Math.cos(a)*r*ratio,cy+Math.sin(a)*r*ratio];};
  const poly=ratio=>metrics.map((_,i)=>point(ratio,i).map(v=>v.toFixed(1)).join(',')).join(' ');
  const grids=[.25,.5,.75,1].map((q,i)=>`<polygon points="${poly(q)}" fill="none" stroke="rgba(195,203,211,${i===3?.35:.16})" stroke-width="1"/>`).join('');
  const axes=metrics.map((_,i)=>{const p=point(1,i);return `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="rgba(195,203,211,.18)" stroke-width="1"/>`;}).join('');
  const data=metrics.map((m,i)=>point(m.score/100,i).map(v=>v.toFixed(1)).join(',')).join(' ');
  const dots=metrics.map((m,i)=>{const p=point(m.score/100,i);return `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#E5C465" stroke="#191D22" stroke-width="1.5"/>`;}).join('');
  const labels=metrics.map((m,i)=>{const p=point(1.24,i);const anchor=Math.abs(p[0]-cx)<14?'middle':p[0]>cx?'start':'end';return `<text x="${p[0]}" y="${p[1]}" text-anchor="${anchor}" dominant-baseline="middle" fill="#D8DEE3" font-size="10.5" font-weight="600">${svgEsc(m.label)}</text>`;}).join('');
  return `<div class="compat-chart"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="두 사람의 8대 관계 지수 레이더 차트">${grids}${axes}<polygon points="${data}" fill="rgba(229,196,101,.24)" stroke="#E5C465" stroke-width="2.5"/>${dots}${labels}<circle cx="${cx}" cy="${cy}" r="23" fill="#191D22" stroke="rgba(229,196,101,.45)"/><text x="${cx}" y="${cy-3}" text-anchor="middle" fill="#F7F1E1" font-size="15" font-weight="700">${Math.round(metrics.reduce((s,m)=>s+m.score,0)/metrics.length)}</text><text x="${cx}" y="${cy+11}" text-anchor="middle" fill="#B6BEC6" font-size="8.5">평균</text></svg><div class="compat-chart-caption">바깥쪽에 가까울수록 해당 영역의 호흡이 좋습니다. 낮은 영역은 실패가 아니라 대화와 규칙이 필요한 지점입니다.</div></div>`;
}
function elementPercentages(p){
  const vals=['木','火','土','金','水'].map(e=>Math.max(0,Number(p.el[e]||0))); const total=vals.reduce((a,b)=>a+b,0)||1;
  return vals.map(v=>Math.round(v/total*1000)/10);
}
function compatElementVisual(A,B){
  const es=['木','火','土','金','水'], pa=elementPercentages(A.p),pb=elementPercentages(B.p);
  const combined=es.map((_,i)=>(pa[i]+pb[i])/2);
  const row=(name,arr)=>`<div class="compat-element-row"><div class="compat-element-name">${svgEsc(name)}</div><div class="compat-element-bar">${arr.map((v,i)=>`<div class="compat-element-seg" style="width:${v}%;background:${E_COLOR[es[i]]}" title="${E_KR[es[i]]} ${v}%">${v>=13?`<span>${Math.round(v)}</span>`:''}</div>`).join('')}</div></div>`;
  const legend=es.map(e=>`<span><i style="background:${E_COLOR[e]}"></i>${E_KR[e]}</span>`).join('');
  return `<div class="compat-element-panel">${row(A.name,pa)}${row(B.name,pb)}${row('둘이 함께',combined)}<div class="compat-element-legend">${legend}</div><div class="compat-chart-caption">개별 오행의 단순 분포를 나란히 본 도식입니다. ‘둘이 함께’는 두 사람의 평균 분포이며, 상대가 내 부족함을 자동 해결한다는 뜻은 아닙니다.</div></div>`;
}
function compatFlowSvg(A,B,c){
  const support=c.support.aNoble||c.support.bNoble||c.support.aStudy||c.support.bStudy||c.fillCount>0;
  const relation=support?'귀인·보완 연결':'관계 경험으로 만드는 연결';
  const aColor=E_COLOR[STEM_E[A.p.dayStem]],bColor=E_COLOR[STEM_E[B.p.dayStem]];
  return `<div class="compat-flow-wrap"><svg viewBox="0 0 620 220" role="img" aria-label="두 사람의 상호 역할과 귀인 연결도"><defs><marker id="arrowGold" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#E5C465"/></marker><marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#6FA3D6"/></marker></defs><circle cx="115" cy="110" r="64" fill="${aColor}" fill-opacity=".18" stroke="${aColor}" stroke-width="3"/><circle cx="505" cy="110" r="64" fill="${bColor}" fill-opacity=".18" stroke="${bColor}" stroke-width="3"/><text x="115" y="102" text-anchor="middle" fill="#F7F1E1" font-size="18" font-weight="700">${svgEsc(A.name)}</text><text x="115" y="123" text-anchor="middle" fill="#C3CBD3" font-size="11">${A.p.dayStem}${A.p.dayBranch} · ${svgEsc(c.roleA)}</text><text x="505" y="102" text-anchor="middle" fill="#F7F1E1" font-size="18" font-weight="700">${svgEsc(B.name)}</text><text x="505" y="123" text-anchor="middle" fill="#C3CBD3" font-size="11">${B.p.dayStem}${B.p.dayBranch} · ${svgEsc(c.roleB)}</text><path d="M180,82 C270,25 350,25 440,82" fill="none" stroke="#E5C465" stroke-width="3" marker-end="url(#arrowGold)"/><text x="310" y="42" text-anchor="middle" fill="#E5C465" font-size="11" font-weight="700">${svgEsc(A.name)} → ${svgEsc(B.name)} : ${svgEsc(c.roleA)}</text><path d="M440,139 C350,195 270,195 180,139" fill="none" stroke="#6FA3D6" stroke-width="3" marker-end="url(#arrowBlue)"/><text x="310" y="196" text-anchor="middle" fill="#8CB8E2" font-size="11" font-weight="700">${svgEsc(B.name)} → ${svgEsc(A.name)} : ${svgEsc(c.roleB)}</text><line x1="190" y1="110" x2="430" y2="110" stroke="rgba(229,196,101,.6)" stroke-width="2" stroke-dasharray="7 6"/><rect x="238" y="88" width="144" height="44" rx="18" fill="#191D22" stroke="rgba(229,196,101,.55)"/><text x="310" y="107" text-anchor="middle" fill="#F7F1E1" font-size="11" font-weight="700">${svgEsc(relation)}</text><text x="310" y="122" text-anchor="middle" fill="#B6BEC6" font-size="9.5">오행 보완 ${c.fillCount} · 지원 지수 ${c.metrics.find(m=>m.key==='support').score}</text></svg><div class="compat-chart-caption">화살표는 상대를 바라보는 십신 역할이 방향마다 다르다는 점을 보여줍니다.</div></div>`;
}
function compatTimelineSvg(years){
  const W=640,H=230,padL=42,padR=18,padT=22,padB=42,chartH=H-padT-padB,step=(W-padL-padR)/years.length,barW=Math.min(54,step*.55);
  const guides=[40,60,80].map(v=>{const y=padT+chartH*(1-v/100);return `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="rgba(195,203,211,.15)"/><text x="${padL-8}" y="${y+3}" text-anchor="end" fill="#8890A0" font-size="9">${v}</text>`;}).join('');
  const bars=years.map((y,i)=>{const x=padL+step*i+(step-barW)/2,h=chartH*y.score/100,yy=padT+chartH-h;const color=y.score>=70?'#7DB889':y.score>=55?'#E5C465':'#EA6B5C';return `<rect x="${x}" y="${yy}" width="${barW}" height="${h}" rx="7" fill="${color}" fill-opacity=".78"/><text x="${x+barW/2}" y="${yy-7}" text-anchor="middle" fill="#F7F1E1" font-size="11" font-weight="700">${y.score}</text><text x="${x+barW/2}" y="${H-20}" text-anchor="middle" fill="#C3CBD3" font-size="10">${y.year}</text>`;}).join('');
  return `<div class="compat-timeline-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="향후 6년 관계 흐름 막대그래프">${guides}${bars}</svg><div class="visual-key"><span><i style="background:#7DB889"></i>함께 밀기</span><span><i style="background:#E5C465"></i>조율</span><span><i style="background:#EA6B5C"></i>속도 조절</span></div></div>`;
}
function compatSupportText(A,B,c){
  const bits=[];
  if(c.support.aNoble)bits.push(`${B.name}님의 지지에 ${A.name}님의 천을귀인 글자가 있어, ${B.name}님이 ${A.name}님에게 현실적인 조력자·소개자 역할로 느껴질 수 있습니다.`);
  if(c.support.bNoble)bits.push(`${A.name}님의 지지에 ${B.name}님의 천을귀인 글자가 있어, ${A.name}님이 ${B.name}님에게 위기 때 길을 열어주는 사람처럼 작용할 수 있습니다.`);
  if(c.support.aStudy)bits.push(`${B.name}님은 ${A.name}님의 문창 기운을 자극해 공부·기획·대화를 끌어내는 역할을 할 수 있습니다.`);
  if(c.support.bStudy)bits.push(`${A.name}님은 ${B.name}님의 문창 기운을 자극해 아이디어와 표현을 북돋울 수 있습니다.`);
  if(c.fillCount)bits.push(`두 사람은 서로에게 부족한 오행을 ${c.fillCount}개 영역에서 보완합니다.`);
  if(!bits.length)bits.push("특정 귀인 글자가 직접 겹치지는 않지만, 귀인은 고정된 운명적 인물이 아니라 실제로 도움을 주고받는 행동을 통해 만들어지는 관계이기도 합니다.");
  return bits.join(" ");
}
async function copyCompatSummary(){
  const A=state.person,B=state.person2,c=state.compat;if(!A||!B||!c)return;
  const txt=`${A.name} × ${B.name} ${c.type} 궁합\n\n궁합 점수: ${c.score}점\n관계 유형: ${c.archetype.name}\n${c.archetype.desc}\n\n강점: ${c.top.map(x=>x.label+" "+x.score+"점").join(", ")}\n보완점: ${c.low.map(x=>x.label+" "+x.score+"점").join(", ")}\n\n※ 전통 명리 규칙을 단순화한 오락·성찰용 상대 지표입니다.`;
  let ok=false;try{await navigator.clipboard.writeText(txt);ok=true;}catch(e){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove();}
  const b=document.getElementById("compat-copy");if(b)b.textContent=ok?"✓ 요약 복사 완료":"복사 실패";
}
function renderCompat() {
  const A=state.person,B=state.person2,c=state.compat,meta=c.meta;
  const ptsBadge=n=>n.pts!==0?` <span class="dim" style="font-weight:400">(${n.pts>0?"+":""}${n.pts}점)</span>`:"";
  const noteBlock=arr=>arr.map(n=>`<div class="subcard"><div class="cardtitle" style="font-size:13px;color:${n.c}">${n.t}${ptsBadge(n)}</div><div class="body sm">${n.d}</div></div>`).join("");
  const metricGrid=c.metrics.map(m=>`<div class="compat-metric"><div class="compat-metric-top"><span>${m.label}</span><span class="compat-num">${m.score}</span></div><div class="compat-bar"><span style="width:${m.score}%"></span></div><div class="dim">${m.desc}</div></div>`).join("");
  const childCard=c.child?`<div class="card compat-anchor" id="compat-child"><div class="eyebrow">자녀·가족계획 흐름 · 전통 상징 참고</div><div class="body sm">이 영역은 임신 가능성을 계산하지 않습니다. 전통 명리의 자녀 상징이 원국과 세운에 어떻게 드러나는지만 설명합니다.</div><div class="compat-duo"><div class="compat-person"><div class="compat-person-name">${esc(c.child.wifeName)}님 · ${c.child.wifeInfo.primary} ${E_KR[c.child.wifeInfo.element]}(${c.child.wifeInfo.element})</div><div class="body sm">${c.child.wifeInfo.note} 원국 표시 ${c.child.wifeInfo.count}개 · 가중 오행 ${c.child.wifeInfo.percent}%.</div></div><div class="compat-person"><div class="compat-person-name">${esc(c.child.husbandName)}님 · ${c.child.husbandInfo.primary} ${E_KR[c.child.husbandInfo.element]}(${c.child.husbandInfo.element})</div><div class="body sm">${c.child.husbandInfo.note} 원국 표시 ${c.child.husbandInfo.count}개 · 가중 오행 ${c.child.husbandInfo.percent}%.</div></div></div><div class="notice"><strong>오행 연결 확인</strong> 자녀 상징을 단순히 “목이 부족하다”처럼 판단하지 않습니다. 각 사람의 일간에 따라 식상·관성의 오행이 달라집니다. 특히 금 일간의 식상은 수(水)입니다.</div>${!c.child.hourKnown?`<div class="notice"><strong>신뢰도 제한</strong> 두 사람 중 한 명이라도 출생시간이 없어 전통적으로 자녀궁으로 보는 시주를 확인하지 못했습니다. 아래 연도는 낮은 신뢰도의 참고 흐름입니다.</div>`:""}${c.child.windows.length?c.child.windows.map(w=>`<div class="subcard"><div class="cardtitle" style="font-size:13px;color:${w.both?"#E5C465":"#7DB889"}">${w.year}년${w.both?" · 두 사람의 1차 참고축이 함께 활성화":w.wGood?` · ${c.child.wifeName}님 식상 흐름`:` · ${c.child.husbandName}님 관성 흐름`}</div><div class="dim">가족계획을 논의하거나 돌봄·창작·책임 이슈에 관심이 커질 수 있는 상징적 시기입니다. 출산 사건을 예측하는 뜻은 아닙니다.</div></div>`).join(""):`<div class="subcard"><div class="body sm">향후 6년에는 이 계산 방식의 1차 참고축이 동시에 두드러지는 해가 없습니다. 자녀 인연이나 임신 가능성이 없다는 뜻이 아닙니다.</div></div>`}<div class="note">임신·난임·피임·출산 시기 판단에는 사용할 수 없으며 의료진의 안내와 실제 가족계획을 우선하세요.</div></div>`:"";
  return `<header><div class="overline">四柱深層 · COMPATIBILITY</div><h1>${esc(A.name)} ✕ ${esc(B.name)}</h1><div class="sub">${A.p.dayStem}${A.p.dayBranch} 일주 · ${B.p.dayStem}${B.p.dayBranch} 일주</div><div class="update-badge">업데이트 2026.07.13 · v6 정리판 · v6 리팩토링 완료</div></header>
  <div class="toolbar"><button type="button" class="btn btn-ghost" id="compat-copy" onclick="copyCompatSummary()">궁합 요약 복사</button><button type="button" class="btn btn-ghost" onclick="window.print()">궁합 전체 인쇄 · PDF</button></div>
  <div class="compat-hero"><span class="compat-type">${meta.badge} · ${esc(c.type)}</span><div class="compat-scoreline"><div><div class="eyebrow" style="margin-top:12px">${meta.scoreTitle}</div><div class="compat-bigscore">${c.score}<span style="font-size:16px;color:#C3CBD3"> / 100</span></div></div><div><div class="eyebrow">관계 캐릭터</div><div class="compat-archetype">${c.archetype.name}</div></div></div><div class="body" style="margin-top:12px">${c.archetype.desc}</div><div class="compat-highlight"><div><div class="dim">가장 잘 맞는 영역</div><div class="cardtitle" style="margin-top:4px">${c.top[0].label} ${c.top[0].score}점</div></div><div><div class="dim">의식적으로 맞출 영역</div><div class="cardtitle" style="margin-top:4px">${c.low[0].label} ${c.low[0].score}점</div></div></div><div class="note">점수는 관계의 성공 확률이 아니라 앱 내부의 전통 명리 비교 지표입니다.</div></div>
  <div class="compat-nav screen-only"><a href="#compat-summary">총평</a><a href="#compat-metrics">8대 지수</a><a href="#compat-role">서로의 역할</a><a href="#compat-talk">대화·갈등</a><a href="#compat-money">돈·생활</a><a href="#compat-support">귀인</a><a href="#compat-fun">상황극</a><a href="#compat-traditional">전통 근거</a></div>
  <div class="card compat-anchor" id="compat-summary"><div class="eyebrow">한눈에 보는 종합 총평</div><div class="body">${c.synthesis}</div></div>
  <div class="card compat-anchor" id="compat-metrics"><div class="eyebrow">우리 사이 8대 관계 지수</div><div class="body sm">${meta.intro} 같은 두 사람이라도 선택한 관계에 따라 중요하게 보는 지수와 종합 점수의 가중치가 달라집니다.</div><div class="compat-visual-grid">${compatRadarSvg(c.metrics)}<div class="compat-grid">${metricGrid}</div></div></div>
  <div class="card compat-anchor" id="compat-role"><div class="eyebrow">서로를 어떻게 느끼는가 · 십신 역할</div>${compatFlowSvg(A,B,c)}<div class="compat-duo"><div class="compat-person"><div class="compat-person-name">${esc(A.name)} → ${esc(B.name)} · ${c.roleA}</div><div class="body sm">${ROLE_DESC[c.roleA]}</div></div><div class="compat-person"><div class="compat-person-name">${esc(B.name)} → ${esc(A.name)} · ${c.roleB}</div><div class="body sm">${ROLE_DESC[c.roleB]}</div></div></div><div class="aside">같은 두 사람이어도 상대를 바라보는 십신은 방향에 따라 달라집니다. 한쪽은 보호자로 느끼고 다른 쪽은 동료로 느낄 수도 있습니다.</div></div>
  <div class="card"><div class="eyebrow">${meta.intimacy}</div><div class="compat-duo"><div class="compat-person"><div class="compat-person-name">${esc(A.name)}님의 표현 방식</div><div class="body sm">${c.affectionA}</div></div><div class="compat-person"><div class="compat-person-name">${esc(B.name)}님의 표현 방식</div><div class="body sm">${c.affectionB}</div></div></div></div>
  <div class="card compat-anchor" id="compat-talk"><div class="eyebrow">대화법과 갈등 회복 매뉴얼</div><div class="body sm"><span class="cream">${esc(A.name)}</span>님은 ${CONFLICT_STYLE[c.domA]}이고, <span class="cream">${esc(B.name)}</span>님은 ${CONFLICT_STYLE[c.domB]}입니다. 문제 자체보다 ‘언제 말할지’와 ‘어떤 순서로 풀지’를 합의하면 갈등 회복력이 높아집니다.</div><div class="compat-script"><b>싸움이 커지기 전 사용할 문장</b><br>“${meta.conflictScript}”<br><br><b>${esc(A.name)}님에게 잘 통하는 말</b><br>“${NEED_PHRASE[STEM_E[A.p.dayStem]]}”<br><b>${esc(B.name)}님에게 잘 통하는 말</b><br>“${NEED_PHRASE[STEM_E[B.p.dayStem]]}”</div></div>
  <div class="card compat-anchor" id="compat-money"><div class="eyebrow">${meta.operationTitle}</div><div class="compat-duo"><div class="compat-person"><div class="compat-person-name">${esc(A.name)} · ${c.moneyA}</div><div class="body sm">돈을 쓰는 이유와 불안해하는 지점을 말로 설명하면 오해가 줄어듭니다.</div></div><div class="compat-person"><div class="compat-person-name">${esc(B.name)} · ${c.moneyB}</div><div class="body sm">각자의 자유 지출과 공동 비용을 분리하면 관계의 피로가 줄어듭니다.</div></div></div><div class="keyline">추천 운영법: ${meta.operationGuide}</div></div>
  <div class="card"><div class="eyebrow">오행 보완과 추진력 균형</div><div class="body"><span class="cream">${esc(A.name)}</span> ${A.p.strength} ${A.p.score}점 · <span class="cream">${esc(B.name)}</span> ${B.p.strength} ${B.p.score}점</div>${compatElementVisual(A,B)}<div class="gauge"><div class="gfill" style="width:${c.balance.score}%"></div></div><div class="body sm">${c.balance.text}</div></div>
  <div class="card compat-anchor" id="compat-support"><div class="eyebrow">서로의 귀인·성장 파트너 가능성</div><div class="body">${compatSupportText(A,B,c)}</div><div class="note">귀인은 상대가 나를 반드시 구해준다는 뜻이 아니라, 서로의 선택·소개·지식·현실적 도움을 통해 길이 열릴 수 있다는 상징입니다.</div></div>
  ${renderCompatFun(A,B,c)}
  <div class="card"><div class="eyebrow">이 관계를 잘 운영하는 법</div><div class="compat-actions"><div class="compat-action good"><div class="cardtitle" style="font-size:13px;color:#9FD3AA">✓ 잘되는 습관</div><ul>${c.good.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="compat-action caution"><div class="cardtitle" style="font-size:13px;color:#F0897C">△ 피할 함정</div><ul>${c.cautions.map(x=>`<li>${x}</li>`).join("")}</ul></div></div></div>
  <div class="card compat-anchor" id="compat-traditional"><div class="eyebrow">전통 궁합 근거 ① 마음의 합 · 일간</div><div class="dim">일간은 두 사람의 기본 성정과 반응 방식을 봅니다.</div>${noteBlock(c.mind)}</div>
  <div class="card"><div class="eyebrow">전통 궁합 근거 ② 일지와 생활</div><div class="dim">일지는 가까운 관계에서 드러나는 생활 습관과 정서적 반응을 봅니다.</div>${noteBlock(c.life)}</div>
  <div class="card"><div class="eyebrow">전통 궁합 근거 ③ 띠와 오행 보완</div><div class="dim">가족·사회적 어울림과 서로의 부족한 오행을 보완하는지를 봅니다.</div>${noteBlock(c.social)}</div>
  ${childCard}
  <div class="card"><div class="eyebrow">두 사람의 기본 기질</div><div class="body sm"><span class="cream">${esc(A.name)}</span> — ${DM_DESC[A.p.dayStem]}</div><div class="divider"></div><div class="body sm"><span class="cream">${esc(B.name)}</span> — ${DM_DESC[B.p.dayStem]}</div></div>
  <div class="card"><div class="eyebrow">궁합은 이렇게 계산했어요</div><div class="body sm">기본 전통 점수는 일간·일지·띠·오행 보완을 중심으로 계산합니다. 별도의 8대 관계 지수는 같은 계산값을 대화·생활·갈등·돈·성장·귀인·추진력 관점으로 재편집한 앱 내부 상대 지표입니다.</div><div class="subcard"><div class="body sm"><span class="cream">일간</span> — 간합·상생·비화·상극을 통해 기본 성정의 만남을 봅니다.</div></div><div class="subcard"><div class="body sm"><span class="cream">일지</span> — 육합·삼합·충·원진·귀문·형으로 가까운 관계의 생활 결을 봅니다.</div></div><div class="subcard"><div class="body sm"><span class="cream">띠·오행·신강약</span> — 바깥 어울림, 부족한 기운의 보완, 추진력 차이를 함께 봅니다.</div></div><div class="note">궁합은 관계의 성공·결혼·이별을 예측하지 않습니다. 실제 관계의 질은 대화, 안전, 존중, 생활 조건에 의해 달라집니다.</div></div>
  <button class="btn btn-ghost" onclick="backToInput()">처음으로 돌아가기</button><footer><div class="dim">사주 캐릭터 연구소 · 업데이트 2026.07.13 · v6 정리판 · v6 리팩토링 완료 · 전통 명리 기반 참고 콘텐츠 · 중요한 결정은 실제 관계와 전문가 판단을 우선하세요</div></footer>`;
}

/* ═══════════ 상태 & 유틸 ═══════════ */
const NOW = new Date();
const state = { view: "input", mode: "single", tab: "premium", name: "", y: "", m: "", d: "", hour: "", gender: "남", name2: "", y2: "", m2: "", d2: "", hour2: "", gender2: "여", err: "", person: null, person2: null, selDaeun: null, profiles: [], profilesLoaded: false, compat: null, compatType: "연인", theme: (localStorage.getItem("saju-theme") || "dark") };
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function gzKr(stem, branch) { return KS[stem] + KB[branch]; }

/* STORAGE: js/storage.js */
function applyTheme(){document.body.classList.toggle('light-theme',state.theme==='light');}
function toggleTheme(){state.theme=state.theme==='light'?'dark':'light';try{localStorage.setItem('saju-theme',state.theme)}catch(e){}applyTheme();render();}
const ANIMAL_EMOJI={쥐:'🐭',소:'🐮',호랑이:'🐯',토끼:'🐰',용:'🐲',뱀:'🐍',말:'🐴',양:'🐑',원숭이:'🐵',닭:'🐔',개:'🐶',돼지:'🐷'};
function firstHeadline(text){const m=String(text||'').match(/【한마디로:\s*([^】]+)】/);return m?m[1]:String(text||'').split('—')[0].trim();}
function specificGodCounts(p){const c={비견:0,겁재:0,식신:0,상관:0,편재:0,정재:0,편관:0,정관:0,편인:0,정인:0};p.pillars.forEach(x=>{if(x.pos!=='일주'&&c[x.sg]!==undefined)c[x.sg]++;if(c[x.bg]!==undefined)c[x.bg]++;});return c;}
function dominantGod(p){const c=specificGodCounts(p);return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];}
function shortGodName(g){return ({비견:'자립·동료',겁재:'승부·확장',식신:'재능·생산',상관:'표현·기획',편재:'사업·유통',정재:'관리·축적',편관:'돌파·책임',정관:'신용·조직',편인:'직관·전문',정인:'학습·문서'})[g]||g;}
function yearOpportunity(P,s){const cat=GCAT[s.sg];return ({비겁:'사람과 연결해 판을 넓히기',식상:'기획·표현을 실제 결과물로 내놓기',재성:'수입과 자산 구조를 숫자로 정리하기',관성:'공식 평가·승진·계약을 활용하기',인성:'배움·자격·문서로 기반을 다지기'})[cat]||'가장 중요한 목표 하나에 집중하기';}
function yearCaution(P,s){if(s.notes.some(n=>n.includes('충(沖)')))return '변화를 막기보다 일정·계약·이동 계획을 먼저 세우기';if(s.tags.some(t=>t.t.includes('공망')))return '결과를 서두르지 말고 검토와 정리에 시간을 두기';const cat=GCAT[s.sg];return ({비겁:'정과 돈을 섞지 말고 역할을 문서로 나누기',식상:'직설과 과로를 줄이고 말은 한 번 정리해서 전하기',재성:'매출보다 남는 돈을 확인하고 충동 지출을 막기',관성:'책임을 혼자 떠안지 말고 수면과 회복을 일정에 넣기',인성:'생각만 늘리지 말고 배운 것을 작은 실전으로 옮기기'})[cat]||'한꺼번에 너무 많은 결정을 하지 않기';}
function coreSummaryData(P){const p=P.p,dg=dominantGod(p),animal=ANIMAL[p.dayBranch],dj=p.dayStem+p.dayBranch;return [
 {icon:p.dayStem,label:'나의 본질',value:`${p.dayStem} ${E_KR[STEM_E[p.dayStem]]} 일간`,desc:firstHeadline(DM_DESC[p.dayStem])},
 {icon:ANIMAL_EMOJI[animal]||'✦',label:'일주 캐릭터',value:`${dj} · ${animal}`,desc:(DAYJU[dj]||'').split('—')[0].trim()},
 {icon:'✦',label:'핵심 능력',value:`${dg} · ${shortGodName(dg)}`,desc:(GOD_MEAN[dg]||'').split(' — ')[0]},
 {icon:'◐',label:'균형 상태',value:`${p.strength} · ${p.score}점`,desc:strengthHeadline(p.strength)}
];}
function renderCoreOverview(P){const p=P.p,gk=gyeokguk(p),ys=yongsin(p),now=seunDetail(p,NOW.getFullYear(),NOW.getFullYear()-P.y+1),core=coreSummaryData(P);return `
 <section class="hero-summary"><div class="hero-kicker">MY SAJU AT A GLANCE</div><div class="hero-title">${esc(P.name)}님은 ${firstHeadline(DM_DESC[p.dayStem]).replace(/^[^—]+—\s*/,'')} 기질 위에, ${shortGodName(dominantGod(p))} 능력을 쓰는 사람입니다.</div><div class="hero-copy">${gk.easy||gk.name} · ${p.strength} 경향 · ${ys.els.map(e=>E_KR[e]+'('+e+')').join('·')} 기운이 균형을 돕습니다. 먼저 네 장의 카드만 읽고, 궁금한 근거는 아래에서 펼쳐보세요.</div></section>
 <div class="core-grid">${core.map(x=>`<div class="core-card"><div class="core-icon">${x.icon}</div><div class="core-label">${x.label}</div><div class="core-value">${x.value}</div><div class="core-desc">${x.desc}</div></div>`).join('')}</div>
 <div class="year-focus"><div class="focus-card good"><div class="focus-title">${NOW.getFullYear()} 올해의 기회</div><div class="focus-main">${yearOpportunity(P,now)}</div><div class="focus-copy">${now.text}</div></div><div class="focus-card care"><div class="focus-title">올해 이것만은 조심</div><div class="focus-main">${yearCaution(P,now)}</div><div class="focus-copy">운세는 사건 예언보다 ‘어떻게 대응할지’를 정하는 참고 지도에 가깝습니다.</div></div></div>
 <div class="quick-nav"><button class="quick-btn" onclick="openDomain(0)"><span>💰</span>재물</button><button class="quick-btn" onclick="openDomain(2)"><span>💼</span>직업·능력</button><button class="quick-btn" onclick="openDomain(3)"><span>💗</span>애정·관계</button><button class="quick-btn" onclick="openDomain(4)"><span>🌿</span>건강</button></div>`;}
function openDomain(idx){state.tab='deep';render();requestAnimationFrame(()=>document.getElementById('domain-'+idx)?.scrollIntoView({behavior:'smooth',block:'start'}));saveLastView();}
function ringMetric(n,v,note='상대 지표'){return `<div class="ring-item"><div class="score-ring" style="--score:${v}"><strong>${v}</strong></div><div class="ring-label">${n}</div><div class="ring-note">${note}</div></div>`;}
function categoryFromTitle(title){if(title.includes('재물'))return '재성';if(title.includes('학업')||title.includes('문서'))return '인성';if(title.includes('직업')||title.includes('관운'))return '관성';if(title.includes('애정'))return '관계';if(title.includes('건강'))return '건강';return '비겁';}
function bestYearsByCat(P,cat){return Array.from({length:10},(_,i)=>{const y=NOW.getFullYear()+i,s=seunDetail(P.p,y,y-P.y+1);return {y,s,hit:GCAT[s.sg]===cat||GCAT[s.bg]===cat};}).filter(x=>x.hit).slice(0,3).map(x=>x.y);}
function domainGuide(r,P,idx){const title=r.title;let good='',care='',actions=[];if(title.includes('재물')){good='수입을 여러 갈래로 보기보다, 들어온 돈이 실제로 남는 구조를 만드는 방식';care='사람과 돈을 섞거나, 기회가 보인다는 이유로 동시에 여러 판을 벌이는 패턴';actions=['고정비와 변동비를 한 화면에 정리하기','큰 지출은 24시간 뒤 다시 결정하기','재성운의 해에는 수익보다 현금흐름을 먼저 확인하기'];}
else if(title.includes('문서')||title.includes('학업')){good='배운 내용을 자격·문서·포트폴리오처럼 눈에 보이는 증거로 남기는 방식';care='준비와 생각이 길어져 실제 실행 시점을 놓치는 패턴';actions=['배운 것은 3일 안에 한 번 써먹기','자격·계약·서류 마감일을 캘린더에 고정하기','한 번에 한 과정만 끝까지 완료하기'];}
else if(title.includes('직업')){good='내가 잘하는 역할과 조직이 기대하는 책임을 분명히 연결하는 방식';care='인정받기 위해 책임을 혼자 떠안거나, 답답함만으로 급하게 자리를 옮기는 패턴';actions=['내 성과를 숫자와 사례로 기록하기','결정권·책임 범위를 시작 전에 확인하기','이직은 감정이 아니라 역할·성장·보상 세 기준으로 비교하기'];}
else if(title.includes('애정')){good='마음을 추측하게 두지 않고, 생활 기준과 원하는 표현을 구체적으로 말하는 방식';care='말로 이기거나 서운함을 오래 저장한 뒤 한꺼번에 꺼내는 패턴';actions=['서운함은 사실·감정·요청 순서로 말하기','돈·시간·연락 빈도의 기준을 미리 합의하기','갈등 중 결론보다 회복 시간을 먼저 확보하기'];}
else if(title.includes('건강')){good='몸의 반응을 운세보다 먼저 보고, 수면·식사·활동 리듬을 일정하게 유지하는 방식';care='좋은 흐름이라는 이유로 과로하거나 오행 해석을 의학적 진단처럼 믿는 패턴';actions=['수면 시간을 가장 먼저 일정에 넣기','불편한 증상은 운세가 아니라 의료진에게 확인하기','강한 활동 뒤에는 회복일을 미리 배치하기'];}
else{good='넓게 친해지기보다 역할과 신뢰를 쌓아 오래가는 관계를 만드는 방식';care='정 때문에 책임·돈·감정을 구분하지 못하는 패턴';actions=['부탁과 약속은 범위를 명확히 하기','돈 거래는 친분과 별도로 기록하기','도움을 받은 뒤 짧게라도 표현하기'];}
const cat=categoryFromTitle(title),yrs=['재성','인성','관성','비겁'].includes(cat)?bestYearsByCat(P,cat):[];return {good,care,actions,yrs};}
function publicShareText(P){const p=P.p,dg=dominantGod(p),dj=p.dayStem+p.dayBranch;return `나의 사주 핵심\n${p.dayStem} ${E_KR[STEM_E[p.dayStem]]} 일간 · ${dj} ${ANIMAL[p.dayBranch]}\n${p.strength} · ${shortGodName(dg)} 능력\n${firstHeadline(DM_DESC[p.dayStem])}\n\n사주 캐릭터 연구소`;}
async function copyPublicSummary(){const t=publicShareText(state.person);try{await navigator.clipboard.writeText(t);alert('생년월일을 제외한 공유용 요약을 복사했습니다.');}catch(e){prompt('아래 내용을 복사하세요.',t);}}

function premiumScore(P, category) {
  const p=P.p, g=p.godCount;
  const strengthFit = p.strength === "중화" ? 12 : (p.strength.includes("강") ? 10 : 8);
  const base = { 재물: 48 + g.재성*9 + g.식상*5, 직업: 48 + g.관성*9 + g.인성*4, 관계: 50 + g.비겁*6 + g.식상*4, 학습: 48 + g.인성*10 + g.관성*3, 실행: 48 + g.식상*7 + g.비겁*6 }[category] || 50;
  return Math.max(35, Math.min(92, Math.round(base + strengthFit - 8)));
}
function premiumYearSignal(P, year) {
  const p=P.p, s=seunDetail(p, year, year-P.y+1), cat=GCAT[s.sg];
  const strong=p.strength.includes("강"), weak=p.strength.includes("약");
  let score=55;
  if (strong && ["식상","재성","관성"].includes(cat)) score+=16;
  if (weak && ["비겁","인성"].includes(cat)) score+=16;
  if (p.strength==="중화") score+=8;
  if (s.notes.some(n=>n.includes("충(沖)"))) score-=12;
  if (s.notes.some(n=>n.includes("합(合)"))) score+=8;
  if (s.tags.some(t=>t.t.includes("공망"))) score-=6;
  score=Math.max(30,Math.min(90,score));
  const level=score>=72?"확장":score>=58?"선택과 집중":score>=45?"관리": "보수적 운영";
  const action=cat==="재성"?"수익 구조와 현금흐름을 점검하고, 숫자로 남는 선택에 집중하세요.":cat==="관성"?"승진·심사·계약처럼 공식 절차를 활용하되 책임 범위를 명확히 하세요.":cat==="식상"?"콘텐츠·기획·영업·표현 활동을 밖으로 내보내고 결과물을 축적하세요.":cat==="인성"?"자격·문서·학습·기반 정리에 투자하고, 배운 것을 작은 실전으로 연결하세요.":"협업과 네트워크를 넓히되 돈과 역할은 문서로 분리하세요.";
  return {year,s,score,level,action};
}
function renderPremium() {
  const P=state.person,p=P.p,ys=yongsin(p),gk=gyeokguk(p),domains=domainReports(p,P.gender,P.nowAge);
  const metrics=[['재물 설계력',premiumScore(P,'재물')],['커리어 상승력',premiumScore(P,'직업')],['관계 확장력',premiumScore(P,'관계')],['학습·문서력',premiumScore(P,'학습')],['실행·표현력',premiumScore(P,'실행')]];
  const years=Array.from({length:10},(_,i)=>premiumYearSignal(P,NOW.getFullYear()+i));
  const best=[...years].sort((a,b)=>b.score-a.score).slice(0,3);
  const care=[...years].sort((a,b)=>a.score-b.score).slice(0,2);
  const nowDu=P.curDaeun||p.daeun[0],dd=daeunDetail(p,nowDu);
  return `${renderCoreOverview(P)}<div class="card"><div class="eyebrow">나의 활용 지수 · 상대 지표</div><div class="dim">미래 사건의 확률이 아니라, 같은 엔진 안에서 강점의 활용 방향을 비교한 지표입니다.</div><div class="ring-grid">${ringMetric('재물',premiumScore(P,'재물'))}${ringMetric('직업',premiumScore(P,'직업'))}${ringMetric('관계',premiumScore(P,'관계'))}${ringMetric('학습',premiumScore(P,'학습'))}</div></div><div class="card"><div class="eyebrow">PREMIUM EXECUTIVE SUMMARY</div><div class="cardtitle">${esc(P.name)}님의 운을 한 문장으로</div><div class="keyline">${gk.easy||gk.name} · ${p.strength} 명식 · ${ys.els.map(e=>E_KR[e]).join('·')} 기운을 활용할수록 흐름이 좋아집니다.</div><div class="body sm">현재 큰 흐름은 ${nowDu.age}세부터의 ${nowDu.stem}${nowDu.branch} 대운입니다. ${dd.text}</div><div style="margin-top:10px"><span class="quality-badge">계산 근거 표시</span><span class="quality-badge">10년 타이밍 분석</span><span class="quality-badge">행동 지침 포함</span></div></div>
  <div class="card"><div class="eyebrow">LIFE SCORECARD · 상대 지표</div><div class="dim">아래 점수는 미래를 확률로 예측한 값이 아니라, 이 앱의 명식 요소를 같은 기준으로 비교한 내부 상대 지표입니다.</div><div class="pro-grid">${metrics.map(([n,v])=>`<div class="pro-metric"><div class="dim">${n}</div><div class="pro-score">${v}<span class="dim"> / 100</span></div><div class="gauge"><div class="gfill" style="width:${v}%"></div></div></div>`).join('')}</div></div>
  <div class="card"><div class="eyebrow">10년 기회 지도 · ${NOW.getFullYear()}–${NOW.getFullYear()+9}</div><div class="body sm"><span class="hl">우선 활용할 해</span> — ${best.map(x=>`${x.year}년(${x.level})`).join(' · ')}<br><span class="hl">속도를 조절할 해</span> — ${care.map(x=>`${x.year}년(${x.level})`).join(' · ')}</div><div class="pro-list">${years.map(x=>`<div class="pro-row"><div class="pro-year">${x.year}</div><div><div class="cardtitle" style="font-size:13px">${x.s.gz.stem}${x.s.gz.branch} · ${x.level} <span class="dim">${x.score}점</span></div><div class="body sm">${x.s.text} ${x.action}</div>${x.s.notes.length?`<div class="aside">${x.s.notes.join(' ')}</div>`:''}</div></div>`).join('')}</div></div>
  <div class="card"><div class="eyebrow">분야별 실행 처방</div>${domains.map((r,i)=>`<div class="subcard"><div class="cardtitle" style="font-size:13px">${i+1}. ${r.title}</div><div class="keyline">${r.key}</div><div class="body sm">${r.text}</div></div>`).join('')}</div>
  <div class="card"><div class="eyebrow">90일 실행 플랜</div><div class="subcard"><div class="cardtitle" style="font-size:13px">1–30일 · 정리</div><div class="body sm">고정 지출·미완료 문서·미뤄둔 건강검진처럼 운과 무관하게 손실을 만드는 항목을 먼저 정리하세요. 목표는 세 개가 아니라 한 개만 남깁니다.</div></div><div class="subcard"><div class="cardtitle" style="font-size:13px">31–60일 · 실험</div><div class="body sm">${ys.els.map(e=>ELEM_TIP[e]).join(' / ')} 중 현실적으로 적용 가능한 활동을 하나 골라 작은 프로젝트로 시험하세요.</div></div><div class="subcard"><div class="cardtitle" style="font-size:13px">61–90일 · 증거 만들기</div><div class="body sm">성과를 느낌이 아니라 숫자·문서·포트폴리오로 남기세요. 다음 운의 기회는 기록된 실적을 통해 잡는다는 원칙으로 움직입니다.</div></div></div>
  <div class="share-card"><div class="share-mark">四柱深層</div><div class="share-main">${p.dayStem}${p.dayBranch} · ${p.strength} · ${shortGodName(dominantGod(p))}</div><div class="share-tags"><span>${E_KR[STEM_E[p.dayStem]]} 일간</span><span>${ANIMAL[p.dayBranch]} 일주</span><span>${ys.els.map(e=>E_KR[e]).join("·")} 활용</span></div><button class="btn btn-ghost" style="max-width:260px;margin:14px auto 0" onclick="copyPublicSummary()">생년월일 없이 핵심 요약 복사</button></div><div class="card"><div class="eyebrow">판매본 품질 표시</div><div class="body sm"><span class="commercial-stamp">ENGINE v4</span> 절기 황경 계산 · 지장간 가중 오행 · 월령/세력/통근 교차 판정 · 억부/조후/통관 용신 후보 · 전체 PDF 인쇄를 적용했습니다.</div><div class="notice"><strong>출고 전 검수 대상</strong> 판정 신뢰도 68점 미만, 절기 24시간 이내, 출생시간 미상인 주문은 자동으로 검수 필요 배지를 표시하세요. 이 규칙을 실제 주문 관리자 화면과 연결할 수 있도록 결과 객체에 confidence가 포함되어 있습니다.</div></div>
  <div class="card"><div class="eyebrow">해석 품질과 한계</div><div class="body sm">이 리포트는 원국, 월지 중심 신강약, 격국, 억부식 용신 추정, 대운·세운, 합충형해와 신살을 조합합니다. 다만 절기는 태양 황경 기반으로 시각을 근사합니다. 출생지 경도·해외 시간대·서머타임·진태양시는 자동 보정하지 않습니다. 절입일 또는 자시 경계 출생자는 전문 만세력으로 원국을 교차 확인해야 합니다. 점수는 상품 내부의 설명 편의를 위한 상대 지표이며 통계적 예측 확률이 아닙니다.</div></div>`;
}
function renderPrintAll() {
  const P=state.person;
  return `<div class="wrap"><section class="print-cover"><div class="overline">四柱深層 · PREMIUM REPORT</div><h1>${esc(P.name)}의 사주 캐릭터</h1><div class="print-meta">${P.y}. ${String(P.m).padStart(2,'0')}. ${String(P.d).padStart(2,'0')} · ${P.gender}<br>${P.p.dayStem}${P.p.dayBranch} 일주 · 생성일 ${NOW.getFullYear()}.${String(NOW.getMonth()+1).padStart(2,'0')}.${String(NOW.getDate()).padStart(2,'0')}<br><br>사주 캐릭터 연구소 · 업데이트 2026.07.13 · v6 정리판 · v6 리팩토링 완료</div></section><section class="print-toc"><div class="pro-section-title">목차</div><ol><li>프리미엄 핵심 요약과 10년 기회 지도</li><li>원국·오행·신강약·격국·용신</li><li>재물·직업·학업·관계·건강 심층 분석</li><li>대운 90년 흐름</li><li>향후 10년 세운</li><li>신살·십이신살·삼재</li><li>종합 풀이</li></ol></section><div class="pro-section-title">1. 프리미엄 핵심 분석</div>${renderPremium()}<div class="pro-section-title">2. 사주 캐릭터</div>${renderCharacter()}<div class="pro-section-title">3. 원국 분석</div>${renderWonguk()}<div class="pro-section-title">4. 분야별 심층 분석</div>${renderDeep()}<div class="pro-section-title">5. 대운 흐름</div>${renderDaeun()}<div class="pro-section-title">6. 세운 흐름</div>${renderSeun()}<div class="pro-section-title">7. 신살 분석</div>${renderSinsal()}<div class="pro-section-title">8. 종합 풀이</div>${renderSynthesis()}<div class="card"><div class="eyebrow">면책 및 계산 범위</div><div class="body sm">전통 명리 규칙을 계산·편집한 유료 콘텐츠용 리포트입니다. 계산 근거와 신뢰도를 함께 표시하지만 과학적 예측이나 사실 보증은 아닙니다. 의료·임신·법률·투자·채용·혼인 등 중대한 결정을 대신하지 않습니다. 절기 경계와 출생시간 경계에서는 원국이 달라질 수 있습니다.</div></div></div>`;
}
function cleanupPrintRoot(){const r=document.getElementById('print-root');if(r)r.remove();document.body.classList.remove('printing-all');}
function printReport(){
  if(state.view!=="report"||!state.person){window.print();return;}
  cleanupPrintRoot();
  const root=document.createElement('div');root.id='print-root';root.className='print-only';root.innerHTML=renderPrintAll();document.body.appendChild(root);document.body.classList.add('printing-all');
  const done=()=>{cleanupPrintRoot();window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);setTimeout(()=>window.print(),80);
}

/* ═══════════ 명식 빌더 (1인/궁합 공용) ═══════════ */
function buildPerson(name, y, m, d, hourBranch, gender) {
  const p = calcPillars({ y, m, d, hourBranch, gender });
  const nowAge = NOW.getFullYear() - y + 1;
  let curDaeun = null;
  p.daeun.forEach(du => { if (nowAge >= du.age) curDaeun = du; });
  return { name, y, m, d, hourBranch, gender, p, nowAge, curDaeun };
}

/* ═══════════ 입력 화면 ═══════════ */
function personFormBlock(sfx) {
  const nameVal = esc(state["name" + sfx] || ""), yVal = esc(state["y" + sfx] || ""), mVal = esc(state["m" + sfx] || ""), dVal = esc(state["d" + sfx] || "");
  const hourVal = state["hour" + sfx] === undefined ? "" : state["hour" + sfx];
  const genderVal = state["gender" + sfx] || (sfx === "2" ? "여" : "남");
  const profileOpts = state.profiles.map(pr => `<option value="${pr.id}">${esc(pr.name)} (${pr.y}.${pr.m}.${pr.d})</option>`).join("");
  return `
    ${state.profiles.length ? `<select class="inp" style="margin-bottom:10px" onchange="loadProfileToForm(this.value,'${sfx}')"><option value="">저장된 사주에서 불러오기…</option>${profileOpts}</select>` : ""}
    <label>이름</label>
    <input class="inp" id="in-name${sfx}" autocomplete="off" aria-label="이름" value="${nameVal}" placeholder="예: 홍길동 (별칭도 가능)">
    <label>생년월일 (양력)</label>
    <div class="row3">
      <input class="inp" id="in-y${sfx}" type="number" min="1902" max="2050" aria-label="출생 연도" value="${yVal}" placeholder="년 · 4자리 (예: 1992)" inputmode="numeric">
      <input class="inp" id="in-m${sfx}" type="number" min="1" max="12" aria-label="출생 월" value="${mVal}" placeholder="월 (예: 02)" inputmode="numeric">
      <input class="inp" id="in-d${sfx}" type="number" min="1" max="31" aria-label="출생 일" value="${dVal}" placeholder="일 (예: 14)" inputmode="numeric">
    </div>
    <label>태어난 시간</label>
    <select class="inp" id="in-h${sfx}" aria-label="태어난 시간">${HOUR_OPT.map(([t, v]) => `<option value="${v === null ? "" : v}" ${String(hourVal) === String(v === null ? "" : v) ? "selected" : ""}>${t}</option>`).join("")}</select>
    <label>성별</label>
    <div class="seg">
      <button class="segbtn ${genderVal === "남" ? "on" : ""}" onclick="setGender('남','${sfx}')">남</button>
      <button class="segbtn ${genderVal === "여" ? "on" : ""}" onclick="setGender('여','${sfx}')">여</button>
    </div>`;
}
function renderInput() {
  const profileChips = state.profiles.length ? `
  <div class="card">
    <div class="eyebrow">최근 본 사람 · ${state.profiles.length}명</div>
    <div class="chipline">${state.profiles.map(pr => `<span class="chip" style="cursor:pointer" onclick="openProfileReport('${pr.id}')">${esc(pr.name)} <a href="javascript:void(0)" onclick="event.stopPropagation();deleteProfile('${pr.id}')" style="color:#EA6B5C;margin-left:5px;font-weight:700">×</a></span>`).join("")}</div>
    <div class="dim" style="margin-top:8px">이름을 누르면 바로 다시 볼 수 있어요. 이 기기 브라우저에만 저장됩니다.</div>
    <button type="button" class="btn btn-ghost" onclick="clearAllSavedData()">저장 정보 전체 삭제</button>
  </div>` : "";
  const modeToggle = `
  <div class="seg" style="margin-bottom:14px">
    <button class="segbtn ${state.mode === "single" ? "on" : ""}" onclick="setMode('single')">1인 리포트</button>
    <button class="segbtn ${state.mode === "compat" ? "on" : ""}" onclick="setMode('compat')">궁합 (2인)</button>
  </div>`;
  const header = `
  <header>
    <div class="overline">四柱性格 · SAJU CHARACTER LAB</div>
    <h1>사주 캐릭터 연구소</h1>
    <div class="sub">원국 · 오행 · 귀인 · 대운 · 세운 · 심층 궁합</div>
    <div class="update-badge">업데이트 2026.07.13 · v6 정리판</div>
  </header>`;
  if (state.mode === "compat") {
    return `${header}${modeToggle}${profileChips}
    <div class="card"><div class="eyebrow">사람 A</div>${personFormBlock("")}</div>
    <div class="card"><div class="eyebrow">사람 B</div>${personFormBlock("2")}</div>
    <div class="card"><div class="eyebrow">관계 유형</div><label for="compat-type">어떤 관계를 보고 있나요?</label><select class="inp" id="compat-type">${Object.keys(COMPAT_TYPE_META).map(t=>`<option value="${t}" ${state.compatType===t?"selected":""}>${t}</option>`).join("")}</select><div class="dim" style="margin-top:8px">연인·부부를 분리했으며, 썸·친구·가족·사업 파트너마다 중요 지수와 조언이 실제로 다르게 계산됩니다.</div></div>
    ${state.err ? `<div class="err">${esc(state.err)}</div>` : ""}
    <button class="btn btn-gold" onclick="makeCompat()">심층 궁합 보기</button>
    <div class="notice"><strong>궁합 결과는 오락·성찰용 심층 리포트입니다.</strong><br>일주·오행·신강신약뿐 아니라 대화, 갈등, 돈, 귀인과 실제 상황별 반응까지 보여줍니다. 점수는 관계의 성공·실패 확률이 아니며 출생시간을 모르면 시주가 제외됩니다.</div>`;
  }
  return `${header}${modeToggle}${profileChips}
  <div class="card">
    <div class="eyebrow">명식 입력</div>
    ${personFormBlock("")}
    ${state.err ? `<div class="err">${esc(state.err)}</div>` : ""}
    <button class="btn btn-gold" onclick="makeReport()">리포트 생성</button>
    <div class="notice"><strong>계산 범위와 개인정보 안내</strong><br>양력 기준이며 절기일은 근사식입니다. 절입 전후 1일, 자시(23시 전후), 해외 출생·서머타임·진태양시 보정이 필요한 경우 명식이 달라질 수 있습니다. 입력 정보는 서버로 전송하지 않지만, 직접 「현재 사람 저장」을 누르면 브라우저 저장소에 남습니다.</div>
  </div>`;
}
function setMode(m) { saveInputs(); state.mode = m; state.err = ""; render(); }
function setGender(g, sfx) { state["gender" + sfx] = g; saveInputs(); render(); }
function saveInputs() {
  const el = id => document.getElementById(id);
  if (el("in-name")) { state.name = el("in-name").value; state.y = el("in-y").value; state.m = el("in-m").value; state.d = el("in-d").value; state.hour = el("in-h").value; }
  if (el("in-name2")) { state.name2 = el("in-name2").value; state.y2 = el("in-y2").value; state.m2 = el("in-m2").value; state.d2 = el("in-d2").value; state.hour2 = el("in-h2").value; }
  if (el("compat-type")) state.compatType = el("compat-type").value;
}
function validatePerson(name, y, m, d) {
  if (!name.trim()) return "이름을 입력해 주세요.";
  if (!Number.isInteger(y) || y < 1902 || y > 2050) return "년도는 1902~2050 사이 4자리 숫자로 입력해 주세요.";
  if (!Number.isInteger(m) || m < 1 || m > 12) return "월은 1~12 사이 숫자로 입력해 주세요.";
  if (!Number.isInteger(d) || d < 1 || d > 31) return "일은 1~31 사이 숫자로 입력해 주세요.";
  const dt = new Date(y, m - 1, d, 12);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return "실제로 존재하는 날짜를 입력해 주세요.";
  const today = new Date(); today.setHours(23,59,59,999);
  if (dt > today) return "미래 날짜는 입력할 수 없습니다.";
  return "";
}
/* ═══════════ 계산 로딩 연출 ═══════════ */
const LOAD_STEPS_SINGLE = ["절기력으로 생년월일 변환 중", "만세력에서 사주팔자 추출 중", "일간 기준 십신·오행 분석 중", "신강약·용신·격국 판정 중", "대운·세운·신살 배치 중"];
const LOAD_STEPS_COMPAT = ["두 사람의 만세력 계산 중", "일주·오행·신강신약 대조 중", "대화·갈등·생활 지수 구성 중", "귀인·지원 관계 확인 중", "상황별 관계 반응 구성 중", "심층 궁합 리포트 편집 중"];
function renderLoading() {
  const steps = state.loadingSteps || [];
  const cur = state.loadingStep || 0;
  return `
  <header>
    <div class="overline">四柱深層</div>
    <h1>명식을 계산하고 있습니다</h1>
    <div class="sub">만세력 규칙 기반으로 원국과 흐름을 구성합니다</div><div class="update-badge">업데이트 2026.07.13 · v6 정리판</div>
  </header>
  <div class="card" style="text-align:center;padding:28px 18px">
    <div class="spin" style="width:26px;height:26px;border-width:3px;margin:0 auto 18px;display:block"></div>
    ${steps.map((s, i) => `<div class="body sm" style="margin:7px 0;text-align:left;padding-left:24%;${i < cur ? "color:#7DB889" : i === cur ? "color:#F7F1E1;font-weight:600" : "opacity:.35"}">${i < cur ? "✓" : i === cur ? "▸" : "·"} ${s}</div>`).join("")}
  </div>`;
}
function runLoading(steps, done) {
  state.view = "loading"; state.loadingSteps = steps; state.loadingStep = 0;
  render();
  const tick = () => {
    state.loadingStep++;
    if (state.loadingStep >= steps.length) { done(); return; }
    render();
    setTimeout(tick, 160);
  };
  setTimeout(tick, 160);
}

function makeReport() {
  saveInputs();
  const y = +state.y, m = +state.m, d = +state.d;
  const errMsg = validatePerson(state.name, y, m, d);
  if (errMsg) { state.err = errMsg; return render(); }
  state.err = "";
  const hourBranch = state.hour === "" ? null : +state.hour;
  const nm = state.name.trim(), gd = state.gender;
  runLoading(LOAD_STEPS_SINGLE, () => {
    state.person = buildPerson(nm, y, m, d, hourBranch, gd);
    state.selDaeun = state.person.curDaeun ? state.person.curDaeun.age : state.person.p.daeun[0].age;
    state.view = "report"; state.tab = "premium";
    rememberProfile(state.person);
    render();
    saveLastView();
  });
}
function openProfileReport(id) {
  const pr = state.profiles.find(x => x.id === id);
  if (!pr) return;
  runLoading(LOAD_STEPS_SINGLE, () => {
    state.person = buildPerson(pr.name, pr.y, pr.m, pr.d, pr.hourBranch, pr.gender);
    state.selDaeun = state.person.curDaeun ? state.person.curDaeun.age : state.person.p.daeun[0].age;
    state.view = "report"; state.tab = "premium";
    render();
    saveLastView();
  });
}
function makeCompat() {
  saveInputs();
  const yA = +state.y, mA = +state.m, dA = +state.d;
  const yB = +state.y2, mB = +state.m2, dB = +state.d2;
  const errA = validatePerson(state.name, yA, mA, dA);
  if (errA) { state.err = "사람 A: " + errA; return render(); }
  const errB = validatePerson(state.name2, yB, mB, dB);
  if (errB) { state.err = "사람 B: " + errB; return render(); }
  state.err = "";
  const hourA = state.hour === "" ? null : +state.hour;
  const hourB = state.hour2 === "" ? null : +state.hour2;
  const nmA = state.name.trim(), gdA = state.gender, nmB = state.name2.trim(), gdB = state.gender2;
  runLoading(LOAD_STEPS_COMPAT, () => {
    state.person = buildPerson(nmA, yA, mA, dA, hourA, gdA);
    state.person2 = buildPerson(nmB, yB, mB, dB, hourB, gdB);
    state.compat = computeCompat(state.person, state.person2, state.compatType);
    rememberProfile(state.person); rememberProfile(state.person2);
    state.view = "compat";
    render();
    saveLastView();
  });
}
function backToInput() { state.view = "input"; state.compat = null; clearLastView(); render(); }

/* ═══════════ 원국 탭 ═══════════ */
function renderWonguk() {
  const P = state.person, p = P.p;
  const cols = p.pillars.map(x => `
    <div class="pcol ${x.pos === "일주" ? "day" : ""}">
      <div class="ppos">${x.pos}</div>
      <div class="pk">${x.meaning}</div>
      <div class="pgod">${x.sg}</div>
      <div class="pchar" style="color:${E_COLOR[STEM_E[x.stem]]}">${x.stem}<div class="pk">${KS[x.stem]} · ${STEM_E[x.stem]}</div></div>
      <div class="pchar" style="color:${E_COLOR[BR_E[x.branch]]}">${x.branch}<div class="pk">${KB[x.branch]} · ${BR_E[x.branch]}</div></div>
      <div class="pgod">${x.bg}</div>
      <div class="phid">지장간<br>${x.hidden.join(" ")}</div>
      <div class="puns">${x.uns}</div>
    </div>`).join("");
  const total = Object.values(p.el).reduce((a, b) => a + b, 0);
  const bar = Object.entries(p.el).map(([e, v]) => v ? `<div style="width:${(v / total) * 100}%;background:${E_COLOR[e]}"></div>` : "").join("");
  const leg = Object.entries(p.el).map(([e, v]) => `<span><span class="edot" style="background:${E_COLOR[e]}"></span>${E_KR[e]} ${v}</span>`).join("");
  const ys = yongsin(p);
  const gk = gyeokguk(p);
  const tgMap = tenGodElementMap(p.dayStem);
  const dj = p.dayStem + p.dayBranch;
  const missing = Object.entries(p.el).filter(([, v]) => v === 0).map(([e]) => E_KR[e] + "(" + e + ")");
  return `
  <div class="card">
    <div class="eyebrow">원국 · 命式</div>
    <div class="cardtitle">${esc(P.name)} — ${P.y}. ${P.m}. ${P.d}. ${P.hourBranch === null ? "시간 미상" : HOUR_OPT.find(h => h[1] === P.hourBranch)[0].split(" ").slice(0, 2).join(" ")} · ${P.gender}</div>
    <div class="dim">${p.solarYear}년 ${gzKr(...[currentYearGZ(p.solarYear).stem, currentYearGZ(p.solarYear).branch])}년 ${ANIMAL[currentYearGZ(p.solarYear).branch]}띠 · 현재 ${P.nowAge}세(세는나이)</div>
    <div class="plate" style="grid-template-columns:repeat(${p.pillars.length},1fr)">${cols}</div>
    ${P.hourBranch === null ? `<div class="note">시주가 빠져 3기둥으로 계산했습니다. 시간을 알면 말년·자녀운까지 정밀해집니다.</div>` : ""}
  </div>
  <div class="card">
    <div class="eyebrow">오행 분포</div>
    <div class="ebar">${bar}</div>
    <div class="eleg">${leg}</div>
    ${missing.length ? `<div class="subcard"><div class="body sm">비어 있는 오행: <span class="cream">${missing.join(", ")}</span> — 없는 기운은 그 영역의 인연이 늦게 오거나 담백하다는 뜻으로, 해당 운이 드는 해에 몰아서 들어옵니다.</div></div>` : ""}
  </div>
  <div class="card">
    <div class="eyebrow">신강 · 신약</div>
    <div class="cardtitle">${p.strength} <span class="dim">(${p.score}점)</span></div>
    <div class="keyline">한마디로: ${strengthHeadline(p.strength)}</div>
    <div class="gauge"><div class="gfill" style="width:${p.score}%"></div></div>
    <div class="gscale"><span>극신약</span><span>중화</span><span>극신강</span></div>
    <div class="chipline" style="margin-top:12px">
      <span class="chip" style="${p.deukryeong ? "border-color:#7DB889;color:#7DB889" : "opacity:.55"}">득령(월지) ${p.deukryeong ? "○" : "✕"}</span>
      <span class="chip" style="${p.deukji ? "border-color:#7DB889;color:#7DB889" : "opacity:.55"}">득지(일지) ${p.deukji ? "○" : "✕"}</span>
      <span class="chip" style="${p.deukse ? "border-color:#7DB889;color:#7DB889" : "opacity:.55"}">득세(세력 ${p.helperCount}/${p.totalUnits}) ${p.deukse ? "○" : "✕"}</span>
    </div>
    <div class="body sm" style="margin-top:10px">${strengthBody(p.strength)}</div>
    <div class="subcard">
      <div class="body sm"><span class="hl">판정 근거</span> — 전통 명리는 ①득령(월지가 나를 돕는가) ②득지(일지가 나를 돕는가) ③득세(전체 세력에서 비겁·인성이 많은가) 세 가지로 신강약을 봅니다. 이 명식은 ${[p.deukryeong && "득령", p.deukji && "득지", p.deukse && "득세"].filter(Boolean).join("·") || "셋 다 갖추지 못한"} ${[p.deukryeong, p.deukji, p.deukse].filter(Boolean).length >= 2 ? "쪽이라 힘이 실린 명식으로" : [p.deukryeong, p.deukji, p.deukse].filter(Boolean).length === 1 ? "하나만 갖춰 중간 지대의 명식으로" : "구조라 여린 명식으로"} 판정했습니다.</div>
      <div class="dim" style="margin-top:8px">${strengthConsensus(p.strengthMethods,p.strength)} 신강약은 유파에 따라 결과가 갈릴 수 있으므로, 이 리포트는 중화신강·중화신약 경계 구간을 따로 표시하고 월령·세력·통근 결과를 함께 공개합니다.</div>
    </div>
    <div class="subcard">
      <div class="body sm"><span class="hl">용신 후보 — ${ys.els.map(e => E_KR[e] + "(" + e + ")").join(", ")}</span> <span class="quality-badge">일치도 ${ys.confidence}</span><br>${ys.why}</div>
      <div class="evidence">억부: ${ys.eokbu.els.map(e=>E_KR[e]).join('·')} — ${ys.eokbu.why}<br>조후: ${ys.johu.els.map(e=>E_KR[e]).join('·')} — ${ys.johu.why}<br>통관: ${ys.tonggwan.els.map(e=>E_KR[e]).join('·')} — ${ys.tonggwan.why}</div>
      <div class="dim" style="margin-top:8px">${ys.els.map(e => `${E_KR[e]}: ${ELEM_TIP[e]}`).join("<br>")}</div>
    </div>
  </div>
  <div class="card">
    <div class="eyebrow">격국(格局)</div>
    <div class="cardtitle">${gk.name}</div>
    ${gk.easy ? `<div class="keyline">${gk.easy}</div>` : ""}
    <div class="body sm">${gk.desc}</div>
    <div class="subcard"><div class="body sm"><span class="hl">상신(相神)</span> — ${gk.need}</div></div>
    <div class="dim" style="margin-top:8px">월지(${p.pillars.find(x => x.pos === "월주").branch}) 정기 ${gk.monthHidden} 기준 · ${gk.god}</div>
  </div>
  <div class="card">
    <div class="eyebrow">일주론 · ${dj} ${gzKr(p.dayStem, p.dayBranch)}일주</div>
    <div class="body">${DAYJU[dj] || ""}</div>
    <div class="divider"></div>
    <div class="body sm">${DM_DESC[p.dayStem]}</div>
    <div class="chipline"><span class="chip">일지 12운성 · ${p.pillars.find(x => x.pos === "일주").uns}</span><span class="chip">공망 · ${p.gongmang.join("")}</span><span class="chip">대운 ${p.forward ? "순행" : "역행"} · ${p.dNum}대운</span></div>
  </div>
  <div class="card">
    <div class="eyebrow">COMMERCIAL ENGINE AUDIT · 판정 신뢰도</div>
    <div class="cardtitle">${p.confidence.label} <span class="dim">${p.confidence.score}/100</span></div>
    <div class="confidence-panel">
      ${Object.entries(p.strengthMethods).map(([k,v])=>`<div class="confidence-item"><div class="dim">${k}</div><div class="cardtitle" style="font-size:13px">${v.band} · ${v.score}</div></div>`).join('')}
    </div>
    <div class="subcard"><div class="body sm"><span class="hl">가중 오행</span> — ${Object.entries(p.weightedEl.percent).map(([e,v])=>`${E_KR[e]} ${v}%`).join(' · ')}</div><div class="evidence">천간·지장간·월지 가중치를 반영한 보조 분포입니다. 화면의 단순 오행 개수와 함께 읽어야 합니다.</div></div>
    <div class="subcard"><div class="body sm"><span class="hl">십신 오행 연결 검수</span> — ${E_KR[STEM_E[p.dayStem]]}(${STEM_E[p.dayStem]}) 일간 기준: 비겁 ${E_KR[tgMap.비겁]} · 식상 ${E_KR[tgMap.식상]} · 재성 ${E_KR[tgMap.재성]} · 관성 ${E_KR[tgMap.관성]} · 인성 ${E_KR[tgMap.인성]}</div><div class="evidence">예: 금(金) 일간의 식상은 수(水), 재성은 목(木), 관성은 화(火)입니다. 이 연결표를 기준으로 자녀·재물·직업 문장을 생성합니다.</div></div>
    <div class="subcard"><div class="body sm"><span class="hl">절기 경계</span> — 가장 가까운 절기까지 약 ${p.confidence.nearTermHours}시간 · 시주 ${p.confidence.hourKnown?'포함':'미포함'} · 판정법 불일치 ${p.confidence.disagreement}단계</div></div>
    <div class="notice"><strong>검수 규칙</strong> 절기 24시간 이내, 출생시간 미상, 세 판정법이 크게 갈리는 명식은 결과를 단정형으로 판매하지 않고 “경계형”으로 표시합니다.</div>
  </div>
  <div class="card">
    <div class="eyebrow">이 리포트의 계산 방식</div>
    <div class="body sm">모든 풀이는 아래 순서로 계산됩니다 — 궁금하실 때 참고하세요.</div>
    <div class="subcard"><div class="body sm"><span class="cream">① 사주팔자</span> — 년주는 입춘, 월주는 12절기 기준으로 세우고(양력 생일을 절기력으로 변환), 일주는 60갑자 일진, 시주는 일간에 따른 시간표로 정합니다.</div></div>
    <div class="subcard"><div class="body sm"><span class="cream">② 십신·오행</span> — 일간(태어난 날의 천간)을 기준으로 나머지 일곱 글자가 나에게 어떤 관계(비겁·식상·재성·관성·인성)인지 정하고, 여덟 글자의 오행 분포를 셉니다.</div></div>
    <div class="subcard"><div class="body sm"><span class="cream">③ 신강약·용신</span> — 월령법·세력법·통근법을 각각 계산하고, 중화신강·중화신약 경계 구간과 다수 판정의 방향을 함께 반영합니다. 용신은 억부·조후·통관 후보를 분리해 제시합니다.</div></div>
    <div class="subcard"><div class="body sm"><span class="cream">④ 대운·세운</span> — 대운 방향은 년간의 음양과 성별로(양남음녀 순행), 대운수는 생일과 절기 사이 일수를 3으로 나눠 정합니다. 세운은 매해의 간지를 일간 기준 십신으로 읽습니다.</div></div>
    <div class="subcard"><div class="body sm"><span class="cream">⑤ 신살·격국</span> — 신살은 년지·일지·일간 기준의 전통 조견표로, 격국은 월지 지장간의 정기를 일간과 대조해 정합니다.</div></div>
    <div class="note">절기는 태양 황경 근사로 시각까지 탐색합니다. 다만 출생지 경도·해외 시간대·서머타임은 아직 자동 보정하지 않으므로 해외 출생자는 전문 만세력과 교차 확인해야 합니다.</div>
  </div>`;
}

/* ═══════════ 심층 탭 ═══════════ */
function renderDeep() {
  const P = state.person;
  const domains=domainReports(P.p,P.gender,P.nowAge);
  const top=`<div class="card"><div class="section-intro"><div><div class="eyebrow">분야별 심층 풀이</div><div class="cardtitle">결론부터 읽고, 근거는 펼쳐보세요</div></div><span class="section-chip">기존 상세 내용 유지</span></div><div class="dim">각 분야를 ‘한 줄 결론 → 잘 맞는 방식 → 주의 패턴 → 실행 3가지 → 상세 근거’ 순서로 재편했습니다.</div><div class="ring-grid">${ringMetric('재물',premiumScore(P,'재물'))}${ringMetric('직업',premiumScore(P,'직업'))}${ringMetric('관계',premiumScore(P,'관계'))}${ringMetric('실행',premiumScore(P,'실행'))}</div></div>`;
  return top+domains.map((r,i)=>{const g=domainGuide(r,P,i);return `
    <div class="card" id="domain-${i}">
      <div class="section-intro"><div><div class="eyebrow" style="color:${r.color}">${r.icon} ${r.title}</div><div class="cardtitle">${r.key||'이 분야의 핵심 흐름'}</div></div>${g.yrs.length?`<span class="section-chip">활용 시기 ${g.yrs.join('·')}</span>`:''}</div>
      <div class="domain-layout"><div class="domain-box"><h4>잘 맞는 방식</h4><p>${g.good}</p></div><div class="domain-box"><h4>주의할 패턴</h4><p>${g.care}</p></div></div>
      <div class="domain-actions">${g.actions.map((a,n)=>`<div class="action-line"><span class="action-num">${n+1}</span><span>${a}</span></div>`).join('')}</div>
      <details class="read-more"><summary>계산 근거와 기존 상세 풀이 펼쳐보기</summary><div class="body" style="margin-top:10px">${r.text}</div></details>
    </div>`;}).join("");
}

/* ═══════════ 대운 탭 ═══════════ */
function renderDaeun() {
  const P = state.person, p = P.p;
  const strip = p.daeun.map(du => {
    const dd = daeunDetail(p, du);
    const isNow = P.curDaeun && P.curDaeun.age === du.age;
    return `<div class="dcell ${isNow ? "now" : ""} ${state.selDaeun === du.age ? "sel" : ""}" onclick="selDaeun(${du.age})">
      <div class="dage">${du.age}세${isNow ? " ●" : ""}</div>
      <div class="dgz">${du.stem}${du.branch}</div>
      <div class="dgod">${dd.sg}<br>${dd.bg}</div>
    </div>`;
  }).join("");
  const sel = p.daeun.find(d => d.age === state.selDaeun) || p.daeun[0];
  const dd = daeunDetail(p, sel);
  const isNow = P.curDaeun && P.curDaeun.age === sel.age;
  return `
  <div class="card">
    <div class="eyebrow">대운 · 10년 단위의 큰 물결</div>
    <div class="dim">대운수 ${p.dNum} · ${p.forward ? "순행" : "역행"} — 각 나이는 그 대운이 시작되는 세는나이입니다. 칸을 눌러 상세 풀이를 보세요.</div>
    <div class="dstrip" style="margin-top:10px">${strip}</div>
  </div>
  <div class="card">
    <div class="eyebrow">${sel.age}세 ~ ${sel.age + 9}세 · ${sel.stem}${sel.branch} 대운 ${isNow ? '<span class="hl">— 지금 지나는 중</span>' : ""}</div>
    <div class="cardtitle">${dd.sg} 천간 · ${dd.bg} 지지 · 12운성 「${dd.uns}」</div>
    <div class="body">${dd.text}</div>
    ${dd.extra.map(x => `<div class="subcard"><div class="body sm">${x}</div></div>`).join("")}
  </div>`;
}
function selDaeun(age) { state.selDaeun = age; render(); }

/* ═══════════ 세운 탭 ═══════════ */
function renderSeun() {
  const P = state.person, p = P.p;
  const startY = NOW.getFullYear();
  const rows = Array.from({ length: 10 }, (_, i) => {
    const yr = startY + i;
    const age = yr - P.y + 1;
    const s = seunDetail(p, yr, age);
    return `<div class="yrow">
      <div class="ybox">
        <div class="yyr">${yr}</div>
        <div class="ygz">${s.gz.stem}${s.gz.branch}</div>
        <div class="yage">${gzKr(s.gz.stem, s.gz.branch)} · ${age}세</div>
      </div>
      <div style="flex:1">
        <div class="tags">${s.tags.map(t => `<span class="tag" style="color:${t.c};border-color:${t.c}55">${t.t}</span>`).join("")}</div>
        <div class="body sm">${s.text}</div>
        ${s.notes.map(n => `<div class="dim" style="margin-top:5px">↳ ${n}</div>`).join("")}
      </div>
    </div>`;
  }).join("");
  return `
  <div class="card">
    <div class="eyebrow">세운 · 해마다 드는 기운 (${startY}~${startY + 9})</div>
    <div class="dim">일간 ${p.dayStem}(${KS[p.dayStem]}) 기준으로 매해의 간지가 어떤 십신으로 작용하는지 본 흐름표입니다. 태그가 그 해의 키워드입니다.</div>
    ${rows}
  </div>`;
}

/* ═══════════ 귀인 강조 섹션 ═══════════ */
function guinActivationYears(p, branchTargets, years=10) {
  const out=[];
  for(let i=0;i<years;i++){
    const yr=NOW.getFullYear()+i, gz=currentYearGZ(yr);
    if(branchTargets.includes(gz.branch)) out.push(`${yr}년 ${gz.stem}${gz.branch}`);
  }
  return out;
}
function renderGuinHighlights(p) {
  const branches=p.pillars.map(x=>x.branch), ds=p.dayStem;
  const items=[];
  const ceTargets=CHEON_EUL[ds]||[];
  const ceHits=ceTargets.filter(b=>branches.includes(b));
  if(ceHits.length) items.push({rank:'대표 귀인 1',name:'천을귀인',tone:'#E5C465',summary:'막힌 순간에 사람과 기회를 통해 돌파구가 생기는 대표적인 길신입니다.',detail:`원국의 ${ceHits.join('·')} 자리에서 작동합니다. 모든 문제가 저절로 풀린다는 뜻보다, 도움을 청하고 관계를 연결할 때 해결 속도가 빨라지는 성향으로 읽습니다.`,years:guinActivationYears(p,ceTargets)});
  const mc=MUN_CHANG[ds];
  if(branches.includes(mc)) items.push({rank:`대표 귀인 ${items.length+1}`,name:'문창귀인',tone:'#6FA3D6',summary:'글·문서·시험·기획·설명 능력에서 도움을 받는 배움의 귀인입니다.',detail:`${mc} 기운이 원국에 있어 배우고 정리해서 전달하는 일이 강점이 되기 쉽습니다. 자격증, 보고서, 콘텐츠, 상담처럼 지식을 형태로 남길 때 귀인운이 살아납니다.`,years:guinActivationYears(p,[mc])});
  const hasCheon=items.some(x=>x.name==='천을귀인');
  if(!hasCheon) items.push({rank:'잠재 귀인',name:'천을귀인 활성 시기',tone:'#E5C465',summary:'원국에 고정된 천을귀인은 없지만, 해당 지지가 들어오는 해에는 조력자 운을 활용할 수 있습니다.',detail:'그 해에는 혼자 버티기보다 선배·전문가·기관·소개를 적극적으로 활용하는 편이 좋습니다.',years:guinActivationYears(p,ceTargets)});
  const ce=CHEON_EUL[ds].some(b=>branches.includes(b));
  const hasHong=branches.includes(HONG_YEOM[ds]);
  if(hasHong) items.push({rank:`관계 귀인`,name:'홍염의 인연력',tone:'#EA6B5C',summary:'부드러운 호감과 친근함이 사람을 연결하는 힘으로 쓰이는 별입니다.',detail:'단순한 이성운보다 고객·협업자·소개자와 빠르게 친밀감을 만드는 관계 자산으로 활용하는 것이 좋습니다.',years:guinActivationYears(p,[HONG_YEOM[ds]])});
  const cards=items.slice(0,4).map((g,i)=>`<div class="guin-card"><div class="guin-rank">${g.rank}</div><div class="guin-title" style="color:${g.tone}">${g.name}</div><div class="body sm">${g.summary}</div><div class="dim" style="margin-top:7px">${g.detail}</div>${g.years.length?`<div style="margin-top:8px">${g.years.map(y=>`<span class="guin-year">${y}</span>`).join('')}</div>`:`<div class="aside">향후 10년 안에는 해당 지지가 직접 들어오는 해가 없습니다. 귀인운이 없다는 뜻은 아니며, 원국의 다른 인덕 요소와 실제 관계가 더 중요합니다.</div>`}</div>`).join('');
  return `<div class="guin-hero"><div class="eyebrow">귀인 집중 리포트 · 도움은 어떤 모습으로 오는가</div><div class="cardtitle" style="font-size:19px">${items[0]?.name||'관계 속에서 만드는 귀인운'}</div><div class="body">귀인은 특정 사람이 정해져 있다는 뜻이 아닙니다. <span class="hl">어떤 경로로 도움을 받기 쉬운지, 내가 도움을 받을 준비를 어떻게 해야 하는지</span>를 보여주는 상징으로 읽는 것이 실용적입니다.</div><div class="guin-grid">${cards}</div><div class="note">활성 연도는 해당 귀인 지지가 세운에 들어오는 시점을 표시한 참고 지표입니다. 실제 도움은 평소 쌓은 신뢰와 행동에 따라 달라집니다.</div></div>`;
}

/* ═══════════ 신살 탭 ═══════════ */
function renderSinsal() {
  const P = state.person, p = P.p;
  const sals = calcSinsal(p);
  const twelve = calcTwelveSinsal(p);
  const sj = samjaeInfo(p, NOW.getFullYear());
  const inSamjaeNow = NOW.getFullYear() >= sj.start && NOW.getFullYear() <= sj.end;
  const twelveCols = twelve.map(t => `
    <div class="pcol" style="padding:9px 2px">
      <div class="ppos">${t.pos}</div>
      <div class="pchar" style="font-size:19px;color:${TWELVE_COLOR[t.sal]}">${t.branch}</div>
      <div class="puns" style="color:${TWELVE_COLOR[t.sal]}">${t.sal}</div>
    </div>`).join("");
  const uniqueSals = [...new Set(twelve.map(t => t.sal))];
  return `
  ${renderGuinHighlights(p)}
  <div class="card">
    <div class="eyebrow">십이신살(十二神殺) · 년지 기준</div>
    <div class="dim">${TRI_NAME[TRI[p.pillars[p.pillars.length - 1].branch]]} 그룹 — 각 기둥이 어떤 신살에 해당하는지 보여줍니다.</div>
    <div class="plate" style="grid-template-columns:repeat(${twelve.length},1fr);margin-top:10px">${twelveCols}</div>
    <div class="divider"></div>
    ${uniqueSals.map(s => `<div class="subcard"><div class="cardtitle" style="font-size:13px;color:${TWELVE_COLOR[s]}">${s}</div><div class="body sm">${TWELVE_DESC[s]}</div></div>`).join("")}
  </div>
  <div class="card">
    <div class="eyebrow">삼재(三災)</div>
    <div class="cardtitle">${sj.start}년 ~ ${sj.end}년 ${inSamjaeNow ? '<span class="hl">— 지금 삼재 기간</span>' : ""}</div>
    <div class="body sm">${sj.branches.map((b, i) => `${sj.labels[i]}(${b}년)`).join(" · ")}. 삼재는 3년마다 찾아오는 전환의 시기로, 무조건 흉한 것이 아니라 「정리하고 준비하는 기간」으로 보는 것이 현대적 해석입니다. 큰 결정(이직·투자·이사)은 신중히, 몸과 재정 관리는 평소보다 꼼꼼히 하면 무난히 지나갑니다.</div>
  </div>
  ${sals.length ? `
  <div class="card">
    <div class="eyebrow">개별 신살 · ${sals.length}개</div>
    <div class="dim">신살은 명식의 양념 — 좋고 나쁨보다 「어떤 기질이 강조되는가」로 읽는 것이 현대적 해석입니다.</div>
    ${sals.map(s => `<div class="subcard"><div class="cardtitle" style="font-size:13px;color:${s.c}">${s.n}</div><div class="body sm">${s.d}</div></div>`).join("")}
  </div>` : `<div class="card"><div class="body sm">두드러진 개별 신살은 없는 담백한 명식입니다.</div></div>`}`;
}

/* ═══════════ 종합 풀이 (로컬 생성, 항상 동작) ═══════════ */
function localSynthesis(P) {
  const p = P.p, dj = p.dayStem + p.dayBranch, ys = yongsin(p);
  const gk0 = gyeokguk(p);
  const paras = [];
  paras.push(`【세 줄 요약】 ① ${P.name}님은 ${gk0.easy ? gk0.easy.replace("한마디로: ", "") : gk0.name + " 사주"}입니다. ② 기운은 ${p.strength} — ${isStrongLabel(p.strength) ? "주도성과 추진력이 살아나는 편" : p.strength === "중화" ? "균형이 좋은 편" : "지원과 페이스 조절이 중요한 편"}이고, ${ys.els.map(e => E_KR[e]).join("·")} 기운이 들어올 때 잘 풀립니다. ③ 지금은 ${P.curDaeun ? P.curDaeun.stem + P.curDaeun.branch + " 대운, " + DAEUN_TXT[tenGod(S10.indexOf(p.dayStem), P.curDaeun.sIdx)].split("】")[0].replace("【한마디로: ", "") : "첫 대운 이전 시기"}입니다.`);
  paras.push(`${P.name}님은 ${gzKr(p.dayStem, p.dayBranch)}(${dj}) 일주입니다. ${DAYJU[dj] || ""} ${DM_DESC[p.dayStem]}`);
  const strengthTxt = p.strength.includes("강")
    ? "일간이 뿌리가 튼튼해 주도적으로 밀고 나가는 힘이 좋은 명식입니다. 기운을 쓰는 시기에 성취가 크게 따릅니다."
    : p.strength === "중화"
    ? "일간과 주변 기운의 균형이 좋아 어느 운이 와도 크게 흔들리지 않는 안정형입니다."
    : "일간이 주변 기운에 비해 여린 명식이라, 도와주는 시기에 힘이 붙고 큰 기회일수록 페이스 조절이 성패를 가릅니다.";
  paras.push(`사주 전체로 보면 ${p.strength}(${p.score}점) 명식입니다. ${strengthTxt} 용신은 ${ys.els.map(e => E_KR[e] + "(" + e + ")").join(", ")} — ${ys.why}`);
  const du = P.curDaeun || p.daeun[0];
  const dd = daeunDetail(p, du);
  paras.push(`${P.curDaeun ? "현재 지나는" : "앞으로 다가올 첫"} 대운은 ${du.age}세부터 시작되는 ${du.stem}${du.branch} 대운입니다. ${dd.text}`);
  const sy = seunDetail(p, NOW.getFullYear(), P.nowAge);
  paras.push(`${NOW.getFullYear()}년 올해는 ${sy.gz.stem}${sy.gz.branch}년입니다. ${sy.text}`);
  const sals = calcSinsal(p);
  if (sals.length) paras.push(`원국에는 ${sals.slice(0, 3).map(s => s.n).join("·")}${sals.length > 3 ? " 등" : ""}이 자리해 있습니다. ${sals.slice(0, 2).map(s => s.d).join(" ")}`);
  const R = domainReports(p, P.gender, P.nowAge);
  const jae = R.find(r => r.title.includes("재물")), gwan = R.find(r => r.title.includes("관운"));
  if (jae) paras.push(jae.text);
  if (gwan) paras.push(gwan.text);
  const caution = sals.filter(s => ["백호살", "괴강살", "귀문관살", "원진살"].includes(s.n));
  paras.push(caution.length
    ? `다만 ${caution.map(c => c.n).join("·")}의 기운이 있어 참고할 부분이 있습니다. ${caution.map(c => c.d).join(" ")}`
    : `두드러지게 조심할 살은 없는 명식입니다. 대운·세운 흐름표에서 일지를 충(沖)하는 해만 평소보다 속도를 늦추면 무난합니다.`);
  return paras.join("\n\n");
}

function renderSynthesis() {
  const P = state.person;
  const local = localSynthesis(P);
  return `
  <div class="card">
    <div class="eyebrow">종합 풀이</div>
    <div class="dim">사주·오행·신강약·대운·세운·신살을 한데 모은 총평입니다.</div>
    <div class="divider"></div>
    <div class="body aiout">${local.split("\n\n").filter(Boolean).map(x => `<p>${esc(x)}</p>`).join("")}</div>
  </div>`;
}

/* ═══════════ 질문하기 (클로드에게 넘기기) ═══════════ */
function buildContextPrompt(P) {
  const p = P.p;
  const pil = p.pillars.map(x => `${x.pos} ${x.stem}${x.branch}(천간 ${x.sg} / 지지 ${x.bg}, 지장간 ${x.hidden.join("")}, 12운성 ${x.uns})`).join("\n- ");
  const gk = gyeokguk(p), ys = yongsin(p);
  const sals = calcSinsal(p).map(s => s.n).join(", ") || "없음";
  const daeunList = p.daeun.map(d => { const dd = daeunDetail(p, d); return `${d.age}세~ ${d.stem}${d.branch}(${dd.sg}/${dd.bg})`; }).join(", ");
  const sy = seunDetail(p, NOW.getFullYear(), P.nowAge);
  const sj = samjaeInfo(p, NOW.getFullYear());
  return `아래는 만세력으로 계산한 사주 명식입니다. 이 명식을 바탕으로 질문에 답해주세요. 30년 경력 명리학자처럼 따뜻하고 구체적으로, 단정보다 경향과 조언 중심으로 풀어주세요.

[명식 정보]
- 이름: ${P.name} (${P.gender}, ${P.y}년 ${P.m}월 ${P.d}일생, 앱 내부 연령 기준 ${P.nowAge}세)
- ${pil}
- 오행 분포: ${Object.entries(p.el).map(([e, v]) => E_KR[e] + v).join(" ")}
- 신강약: ${p.strength}(${p.score}점) — 득령 ${p.deukryeong ? "○" : "✕"} / 득지 ${p.deukji ? "○" : "✕"} / 득세 ${p.deukse ? "○" : "✕"}
- 격국: ${gk.name} / 용신 추정: ${ys.els.map(e => E_KR[e] + "(" + e + ")").join(", ")}
- 공망: ${p.gongmang.join("")} / 신살: ${sals}
- 대운(${p.forward ? "순행" : "역행"}, ${p.dNum}대운): ${daeunList}
- 현재 대운: ${P.curDaeun ? P.curDaeun.age + "세~ " + P.curDaeun.stem + P.curDaeun.branch : "첫 대운 이전"}
- 올해(${NOW.getFullYear()}년) 세운: ${sy.gz.stem}${sy.gz.branch}년, 천간 ${sy.sg} / 지지 ${sy.bg}
- 삼재: ${sj.start}~${sj.end}년

[주의]
- 이 명식은 절기 근사식과 단순화된 규칙으로 계산되어 경계 날짜·시간에는 오차가 있을 수 있습니다.
- 건강·임신·법률·투자 판단은 전문 조언을 대체하지 않습니다.

[질문]
`;
}
const ASK_PRESETS = ["올해 이직해도 괜찮을까?", "재물운이 가장 좋아지는 시기는 언제야?", "결혼·연애 인연은 언제쯤 올까?", "내 사주에 맞는 직업 방향을 더 구체적으로 알려줘", "앞으로 3년간 조심할 것과 밀어붙일 것을 알려줘", "건강에서 특히 관리할 부분은?"];
function setAskPreset(i) {
  const ta = document.getElementById("ask-q");
  if (ta) { ta.value = ASK_PRESETS[i]; ta.focus(); }
}
async function copyAskPrompt() {
  const ta = document.getElementById("ask-q");
  const q = (ta && ta.value.trim()) || "이 사주를 종합적으로 깊이 있게 풀어줘.";
  const full = buildContextPrompt(state.person) + q;
  let ok = false;
  try { await navigator.clipboard.writeText(full); ok = true; } catch (e) {
    try {
      const tmp = document.createElement("textarea");
      tmp.value = full; document.body.appendChild(tmp); tmp.select();
      ok = document.execCommand("copy"); document.body.removeChild(tmp);
    } catch (e2) { ok = false; }
  }
  const btn = document.getElementById("ask-btn");
  if (btn) { btn.textContent = ok ? "✓ 복사 완료 — AI 채팅에 붙여넣으세요" : "복사 실패 — 아래 내용을 직접 복사하세요"; }
  if (!ok) {
    const out = document.getElementById("ask-out");
    if (out) { out.style.display = "block"; out.value = full; }
  }
}
function renderAsk() {
  const P = state.person;
  return `
  <div class="card">
    <div class="eyebrow">AI에게 물어보기 · 클로드/ChatGPT/제미나이</div>
    <div class="body sm">이 리포트가 계산한 명식 전체(사주·신강약·격국·용신·대운·세운·신살)를 질문과 함께 하나의 프롬프트로 묶어 복사합니다. <span class="cream">복사한 내용을 <b>클로드·ChatGPT·제미나이</b> 등 쓰시는 AI 아무 곳에나 붙여넣으면, AI가 ${esc(P.name)}님의 사주를 전부 아는 상태에서 대화가 시작됩니다.</span> 궁금한 걸 이어서 계속 물어볼 수 있어요.</div>
    <label>질문 (비워두면 종합 풀이를 요청합니다)</label>
    <textarea class="inp" id="ask-q" rows="3" placeholder="예: 내년에 부서를 옮기는 게 좋을까?" style="resize:vertical"></textarea>
    <div class="chipline" style="margin-top:10px">${ASK_PRESETS.map((q, i) => `<span class="chip" style="cursor:pointer" onclick="setAskPreset(${i})">${q}</span>`).join("")}</div>
    <button class="btn btn-gold" id="ask-btn" onclick="copyAskPrompt()">명식 + 질문 복사하기</button>
    <textarea class="inp" id="ask-out" rows="8" style="display:none;margin-top:10px;font-size:11px" readonly></textarea>
    <div class="note">① 복사 버튼 누르기 → ② 클로드 / ChatGPT / 제미나이 새 대화 열기 → ③ 붙여넣고 전송.<br>후속 질문은 그 대화에서 계속 이어가면 됩니다.</div>
  </div>`;
}


/* ═══════════ v5 캐릭터 콘텐츠 엔진 ═══════════ */
/* CHARACTER DATA: data/character-data.js */
function charData(P){return CHARACTER_STEM[P.p.dayStem]||CHARACTER_STEM.甲;}
function charScene(P,key){const d=charData(P);return d.react[key]||'';}
function sceneIcon(key){return ({kind:'💬',boss:'📣',read:'📱',late:'⏰',breakup:'💔',money:'💸',fight:'⚡',travel:'🧳'})[key]||'✨';}
function renderCharacter(){const P=state.person,d=charData(P),dom=dominantGod(P.p);return `
 <div class="character-hero cute-hero"><div class="hero-mascot" aria-hidden="true">${ANIMAL_EMOJI[ANIMAL[P.p.dayBranch]]||'🐣'}</div><div><div class="eyebrow">나의 사주 캐릭터</div><div class="meme-line">“${d.meme}”</div><div class="character-badges"><span class="character-badge">${d.tag}</span><span class="character-badge">${P.p.dayStem}${P.p.dayBranch} 일주</span><span class="character-badge">핵심 능력 ${dom}</span><span class="character-badge">${P.p.strength}</span></div></div></div>
 <div class="card"><div class="eyebrow">고전 캐릭터로 비유하면</div><div class="history-card"><div class="history-emblem">${d.historyIcon}</div><div><div class="cardtitle">${d.history}</div><div class="body sm">${d.historyWhy}</div><div class="keyline" style="margin-top:9px">한 줄 모토 · ${d.motto}</div></div></div><div class="aside">실제 인물의 사주가 같다는 뜻이 아니라, 이해를 돕기 위한 성향 비유입니다.</div></div>
 <div class="card"><div class="eyebrow">사람들이 나를 오해하는 지점</div><div class="keyline">${d.misread}</div><div class="character-grid"><div class="character-card"><h4>💼 회사에서의 나</h4><div class="big">${d.work}</div></div><div class="character-card"><h4>💗 연애할 때의 나</h4><div class="big">${d.love}</div></div><div class="character-card"><h4>📱 카톡 스타일</h4><div class="big">${d.chat}</div></div><div class="character-card"><h4>🌿 스트레스 해소법</h4><div class="big">${d.stress}</div></div></div></div>
 <div class="card"><div class="eyebrow">상황별 나의 반응</div><div class="scene-list">${CHARACTER_SCENES.map(([k,q])=>`<article class="scene-card"><div class="scene-q"><span class="scene-icon">${sceneIcon(k)}</span><span>${q}</span></div><div class="scene-a">${charScene(P,k)}</div>${k==='fight'?`<div class="scene-tip">사실과 감정을 한 문장씩 나눠 말하면 오해가 줄어요.</div>`:k==='money'?`<div class="scene-tip">금액·기한·방법을 먼저 합의하면 관계를 지키기 쉬워요.</div>`:''}</article>`).join('')}</div><div class="character-disclaimer">※ 전통 명리의 성향을 오늘의 언어로 가볍게 풀어낸 콘텐츠입니다.</div></div>
 <div class="card"><div class="eyebrow">나를 한 장으로 공유하기</div><div class="share-meme"><div class="dim">${esc(P.name)}의 사주 캐릭터</div><div class="meme-line" style="font-size:20px">${d.meme}</div><div class="body sm">${d.tag} · ${d.history} · ${P.p.strength}</div></div><button class="btn btn-gold screen-only" onclick="copyCharacterSummary()">캐릭터 요약 복사</button></div>`;}
async function copyCharacterSummary(){const P=state.person,d=charData(P);const txt=`${P.name}의 사주 캐릭터\n\n“${d.meme}”\n${d.tag} · ${d.history}\n\n사람들이 오해하는 점: ${d.misread}\n회사: ${d.work}\n연애: ${d.love}\n카톡: ${d.chat}\n\n※ 전통 명리를 오늘의 언어로 번역한 오락·성찰 콘텐츠`;try{await navigator.clipboard.writeText(txt);alert('캐릭터 요약을 복사했습니다.');}catch(e){alert('복사하지 못했습니다.');}}
function compatFunScenarios(type){const common=[['late','약속에 한 사람이 20분 늦었다'],['read','카톡을 읽고 답이 없다'],['fight','“됐어.”라는 말로 대화가 끝났다'],['travel','둘이 여행을 떠났다'],['money','한 사람이 큰 지출을 제안했다']];if(type==='부부'||type==='가족')common.push(['family','명절·가족 일정이 겹쳤다']);else if(type==='사업파트너')common.push(['boss','중요한 회의 직전 문제가 터졌다']);else common.push(['breakup','한 사람이 관계를 그만두자고 말했다']);return common;}
function compatSceneReaction(P,key){if(key==='family'){const d=charData(P);return P.p.godCount.관성>=2?'책임과 순서를 먼저 정하려 한다.':P.p.godCount.비겁>=2?'내 사람의 입장을 먼저 지키려 한다.':d.react.fight;}return charScene(P,key);}
function compatSceneTip(A,B,key){const a=charData(A),b=charData(B);if(key==='late')return '늦은 이유 설명보다 먼저 사과하고, 그 다음 재발 방지책을 말하면 두 반응 순서를 모두 만족시킬 수 있습니다.';if(key==='read')return '답장 속도를 애정의 크기로 해석하지 말고, 바쁠 때의 연락 기준을 평소에 정해두세요.';if(key==='fight')return '한 사람은 바로 결론을 원하고 다른 사람은 시간이 필요할 수 있습니다. “30분 뒤 다시 이야기하기”처럼 재개 시점을 정하세요.';if(key==='travel')return '한 명이 큰 동선을, 다른 한 명이 현장 선택을 맡으면 서로의 장점이 살아납니다.';if(key==='money')return '찬반보다 예산 상한선·결정 시한·철회 조건을 먼저 숫자로 합의하세요.';if(key==='breakup')return '감정적인 선언인지 최종 결정인지 한 번 확인하되, 상대의 안전과 경계를 우선하세요.';if(key==='family')return '누구 가족인지보다 시간·비용·돌봄 부담을 공평하게 나누는 기준을 먼저 세우세요.';if(key==='boss')return '원인 분석 담당과 즉시 대응 담당을 나누고, 회의 뒤 책임 범위를 문서로 남기세요.';return `${a.tag}와 ${b.tag}의 해결 순서가 다를 수 있으니 먼저 원하는 것을 한 문장씩 말하세요.`;}
function renderCompatFun(A,B,c){const scenes=compatFunScenarios(c.type);return `<div class="card compat-anchor" id="compat-fun"><div class="eyebrow">같은 상황, 다른 반응 · 관계 상황극</div><div class="body sm">궁합 점수보다 실제로 더 궁금한 순간들을 두 사람의 캐릭터로 비교했습니다.</div>${scenes.map(([k,q])=>`<div class="scene-card" style="margin-top:10px"><div class="scene-q">상황 · ${q}</div><div class="speech-wrap"><div><div class="speech-person">${esc(A.name)}님의 반응</div><div class="speech-bubble">${compatSceneReaction(A,k)}</div></div><div><div class="speech-person">${esc(B.name)}님의 반응</div><div class="speech-bubble">${compatSceneReaction(B,k)}</div></div></div><div class="compat-fun-tip"><b>둘 사이 팁</b> · ${compatSceneTip(A,B,k)}</div></div>`).join('')}</div>`;}


/* ═══════════ 탭별 초보자 안내 ═══════════ */
const TAB_GUIDE = {
  character: ["캐릭터 탭은 뭔가요?", "일간·일주·십신을 오늘의 언어로 번역해 <b>카톡·직장·연애·약속·이별 상황</b>에서 나타날 수 있는 반응을 보여줍니다. 실제 행동을 단정하는 검사가 아니라 재미와 자기이해를 위한 콘텐츠입니다."],
  premium: ["요약 화면은 무엇을 보여주나요?", "처음에는 <b>본질·일주 캐릭터·핵심 능력·균형 상태</b> 네 카드와 올해의 기회·주의를 보여주고, 아래에서 10년 타이밍과 계산 근거를 확인할 수 있습니다. 점수는 통계 확률이 아니라 같은 엔진 안에서 비교하기 위한 상대 지표입니다."],
  wonguk: ["원국(原局)이 뭔가요?", "태어난 순간의 하늘과 땅 기운을 여덟 글자로 적은 것 — 말하자면 <b>나라는 사람의 출고 사양서</b>입니다. 아래 표의 세로 네 줄이 각각 시·일·월·년의 기둥이고, 가운데 금색 칸(일주)이 「나 자신」입니다."],
  deep: ["심층 풀이가 뭔가요?", "원국 여덟 글자를 <b>돈·일·사랑·건강·사람</b> 여섯 가지 삶의 영역으로 번역한 것입니다. 각 분야를 <b>결론·잘 맞는 방식·주의 패턴·실행 3가지</b>로 먼저 보여주고, 기존 긴 해석은 접어서 그대로 보존했습니다."],
  daeun: ["대운(大運)이 뭔가요?", "10년마다 바뀌는 <b>인생의 큰 계절</b>입니다. 같은 사람이라도 봄 대운엔 심고, 여름 대운엔 밀어붙이고, 겨울 대운엔 준비하는 게 유리하죠. 금색 테두리가 지금 지나는 계절이고, 칸을 누르면 그 10년의 상세 풀이가 나옵니다."],
  seun: ["세운(歲運)이 뭔가요?", "대운이 계절이라면 세운은 <b>그해의 날씨</b>입니다. 해마다 들어오는 기운이 달라서 어떤 해는 문서운(계약·합격), 어떤 해는 재물운, 어떤 해는 이동수가 듭니다. 태그가 그해의 날씨 예보라고 보시면 됩니다."],
  sinsal: ["귀인·신살은 어떻게 보나요?", "먼저 <b>천을귀인·문창귀인 등 도움의 통로</b>를 친절하게 설명하고, 향후 10년 중 해당 기운이 활성화되는 해를 보여줍니다. 그 아래에서 도화·역마·십이신살·삼재를 기존과 동일하게 모두 확인할 수 있습니다."],
  synth: ["종합풀이가 뭔가요?", "앞의 모든 탭(원국·심층·대운·세운·신살)을 <b>한 편의 글</b>로 엮은 총평입니다. 맨 위 「세 줄 요약」만 읽어도 내 사주의 뼈대가 잡힙니다."],
};
function renderTabGuide(tab) {
  const g = TAB_GUIDE[tab];
  if (!g) return "";
  return `<div class="card" style="background:rgba(229,196,101,.07);border-color:rgba(229,196,101,.35);padding:13px 16px">
    <div style="font-size:12px;font-weight:700;color:#E5C465;margin-bottom:4px">💡 ${g[0]}</div>
    <div class="body sm" style="color:#D8DEE3">${g[1]}</div>
  </div>`;
}

/* ═══════════ 메인 렌더 ═══════════ */
const TABS = [["premium", "요약"], ["character", "캐릭터"], ["wonguk", "원국"], ["deep", "심층"], ["daeun", "대운"], ["seun", "세운"], ["sinsal", "귀인·신살"], ["synth", "종합"]];
function setTab(t) { state.tab = t; render(); saveLastView(); }
function render() {
  applyTheme();
  const app = document.getElementById("app");
  if (state.view === "input") { app.innerHTML = renderInput(); return; }
  if (state.view === "loading") { app.innerHTML = renderLoading(); return; }
  if (state.view === "compat") { app.innerHTML = renderCompat(); return; }
  const P = state.person;
  app.innerHTML = `
  <header>
    <div class="overline">四柱性格 · SAJU CHARACTER LAB</div>
    <h1>${esc(P.name)}의 사주 캐릭터</h1>
    <div class="sub">${P.y}. ${String(P.m).padStart(2, "0")}. ${String(P.d).padStart(2, "0")} · ${P.gender} · ${P.p.dayStem}${P.p.dayBranch} 일주</div>
    <div class="update-badge">업데이트 2026.07.13 · v6 정리판</div>
  </header>
  <nav aria-label="리포트 메뉴">${TABS.map(([k, t]) => `<button type="button" class="tabbtn ${state.tab === k ? "on" : ""}" onclick="setTab('${k}')" aria-pressed="${state.tab === k}">${t}</button>`).join("")}</nav>
  <div class="toolbar">
    <button type="button" class="btn btn-ghost" onclick="saveCurrentProfile('')">현재 사람 저장</button>
    <button type="button" class="btn btn-ghost" onclick="printReport()">전체 리포트 인쇄 · PDF</button>
    <button type="button" class="btn btn-ghost theme-toggle" onclick="toggleTheme()">${state.theme==='light'?'🌙 다크 모드':'☀️ 밝은 독서 모드'}</button>
  </div>
  ${renderTabGuide(state.tab)}
  ${state.tab === "premium" ? renderPremium() :
    state.tab === "character" ? renderCharacter() :
    state.tab === "wonguk" ? renderWonguk() :
    state.tab === "deep" ? renderDeep() :
    state.tab === "daeun" ? renderDaeun() :
    state.tab === "seun" ? renderSeun() :
    state.tab === "sinsal" ? renderSinsal() :
    state.tab === "synth" ? renderSynthesis() : renderPremium()}
  <button class="btn btn-ghost" onclick="backToInput()">다른 사람 보기 · 입력으로 돌아가기</button>
  <footer><div class="dim">사주 캐릭터 연구소 · 업데이트 2026.07.13 · v6 정리판 · 전통 명리 기반 참고 콘텐츠 · 중요한 결정은 전문가와 교차 확인하세요</div></footer>`;
}
window.addEventListener("error", e => {
  const app = document.getElementById("app");
  if (app && !app.innerHTML) app.innerHTML = `<div class="card"><div class="cardtitle">화면을 불러오지 못했습니다</div><div class="body sm">페이지를 새로고침해 주세요. 문제가 반복되면 저장 정보를 삭제한 뒤 다시 시도해 주세요.</div></div>`;
});
applyTheme();
render();
loadProfiles();
