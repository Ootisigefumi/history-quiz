/**
 * 勉強RPG 歴史クエスト
 * app.js - Optimized for Root index.html (Retro UI)
 * FIX: Added Player HP logic, corrected toast class, fixed enemy HP width
 */

/* --- Supabase Config (Mock Placeholder) --- */
let sb;
async function initSB() {
  if (typeof supabase !== 'undefined') {
    // Note: Constants for SB_URL/KEY are usually injected or hardcoded
  }
}

/* --- Core Data: Year (100 items) --- */
const YEAR_DATA = [
  {year: 239, event: '邪馬台国の卑弥呼が魏に使いを送る'},
  {year: 538, event: '百済から仏教が伝来する'},
  {year: 593, event: '聖徳太子が推古天皇の摂政になる'},
  {year: 607, event: '遣隋使として小野妹子を送る'},
  {year: 645, event: '大化の改新で中大兄皇子、中臣鎌足が蘇我氏を倒す'},
  {year: 672, event: '壬申の乱'},
  {year: 701, event: '大宝律令'},
  {year: 710, event: '元明天皇が平城京に遷都'},
  {year: 723, event: '三世一身の法'},
  {year: 743, event: '墾田永年私財法'},
  {year: 794, event: '桓武天皇が平安京に遷都'},
  {year: 894, event: '遣唐使廃止'},
  {year: 939, event: '平将門の乱'},
  {year: 939, event: '藤原純友の乱'},
  {year: 1016, event: '藤原道長が摂政'},
  {year: 1086, event: '白河上皇の院政開始'},
  {year: 1156, event: '保元の乱'},
  {year: 1159, event: '平治の乱'},
  {year: 1167, event: '平清盛が太政大臣'},
  {year: 1185, event: '壇ノ浦の戦い・守護地頭'},
  {year: 1192, event: '源頼朝が征夷大将軍に任命された'},
  {year: 1221, event: '後鳥羽上皇が承久の乱を起こした'},
  {year: 1232, event: '北条泰時が御成敗式目を制定'},
  {year: 1274, event: '文永の役'},
  {year: 1281, event: '弘安の役'},
  {year: 1333, event: '鎌倉幕府滅亡'},
  {year: 1334, event: '後醍醐天皇の建武の新政'},
  {year: 1338, event: '足利尊氏が室町幕府を開く'},
  {year: 1392, event: '足利義満による南北朝統一'},
  {year: 1428, event: '正長の土一揆'},
  {year: 1467, event: '応仁の乱'},
  {year: 1485, event: '山城の国一揆'},
  {year: 1488, event: '加賀一向一揆'},
  {year: 1543, event: 'ポルトガル人が種子島に鉄砲伝来'},
  {year: 1549, event: 'キリスト教伝来'},
  {year: 1573, event: '室町幕府滅亡'},
  {year: 1575, event: '長篠の戦い'},
  {year: 1582, event: '本能寺の変'},
  {year: 1588, event: '刀狩'},
  {year: 1590, event: '全国統一'},
  {year: 1600, event: '関ヶ原の戦い'},
  {year: 1603, event: '江戸幕府成立'},
  {year: 1615, event: '武家諸法度'},
  {year: 1635, event: '参勤交代'},
  {year: 1637, event: '島原の乱'},
  {year: 1639, event: '鎖国完成'},
  {year: 1716, event: '享保の改革'},
  {year: 1772, event: '田沼意次'},
  {year: 1787, event: '寛政の改革'},
  {year: 1825, event: '異国船打払令'},
  {year: 1837, event: '大塩平八郎の乱'},
  {year: 1841, event: '天保の改革'},
  {year: 1853, event: 'ペリー来航'},
  {year: 1854, event: '日米和親条約'},
  {year: 1858, event: '日米修好通商条約'},
  {year: 1860, event: '桜田門外の変'},
  {year: 1866, event: '薩長同盟'},
  {year: 1867, event: '大政奉還'},
  {year: 1868, event: '五箇条の御誓文'},
  {year: 1871, event: '廃藩置県'},
  {year: 1872, event: '学制発布'},
  {year: 1873, event: '地租改正'},
  {year: 1877, event: '西南戦争'},
  {year: 1881, event: '自由民権運動'},
  {year: 1885, event: '内閣制度'},
  {year: 1889, event: '大日本帝国憲法'},
  {year: 1890, event: '帝国議会'},
  {year: 1894, event: '日清戦争'},
  {year: 1895, event: '下関条約'},
  {year: 1901, event: '八幡製鉄所'},
  {year: 1902, event: '日英同盟'},
  {year: 1904, event: '日露戦争'},
  {year: 1905, event: 'ポーツマス条約'},
  {year: 1910, event: '韓国併合'},
  {year: 1911, event: '関税自主権回復'},
  {year: 1914, event: '第一次世界大戦'},
  {year: 1915, event: '二十一か条の要求'},
  {year: 1917, event: 'ロシア革命'},
  {year: 1918, event: '米騒動'},
  {year: 1920, event: '国際連盟'},
  {year: 1923, event: '関東大震災'},
  {year: 1925, event: '普通選挙法・治安維持法'},
  {year: 1929, event: '世界恐慌'},
  {year: 1931, event: '満州事変'},
  {year: 1932, event: '五・一五事件'},
  {year: 1933, event: '国際連盟脱退'},
  {year: 1936, event: '二・二六事件'},
  {year: 1937, event: '日中戦争'},
  {year: 1938, event: '国家総動員法'},
  {year: 1939, event: '第二次世界大戦'},
  {year: 1941, event: '太平洋戦争'},
  {year: 1945, event: '終戦'},
  {year: 1950, event: '朝鮮戦争'},
  {year: 1951, event: 'サンフランシスコ平和条約'},
  {year: 1956, event: '国連加盟'},
  {year: 1964, event: '東京オリンピック'},
  {year: 1972, event: '沖縄返還'},
  {year: 1978, event: '日中平和友好条約'},
  {year: 1990, event: '東西ドイツ統一'},
  {year: 1995, event: '阪神淡路大震災'}
];

/* --- PERSON DATA --- */
const PERSON_DATA = [
  {person: '卑弥呼', deed: '邪馬台国の女王。まじないによって人々を支配した。魏に使いを送り、称号を授かる。'},
  {person: '紫式部', deed: '小説「源氏物語」の作者。藤原道長の娘である彰子の家庭教師。'},
  {person: '清少納言', deed: '随筆「枕草子」の作者。藤原道長の兄の娘である定子の家庭教師。'},
  {person: '北条政子', deed: '源頼朝の妻。頼朝の死後、尼将軍と呼ばれる。承久の乱のとき、御家人をはげます。'},
  {person: '樋口一葉', deed: '明治時代の小説家。「にごりえ」「たけくらべ」などを著す。五千円札の肖像。'},
  {person: '津田梅子', deed: '日本初の女子留学生の1人。女子英学塾を創設し英語教育。五千円札の肖像。'},
  {person: '与謝野晶子', deed: '歌人。日露戦争に出征した弟を案じ、詩「君死にたまふことなかれ」を発表。'},
  {person: '平塚らいてう', deed: '市川房枝らとともに女性の解放や参政権を求める運動を展開。雑誌「青鞜」を創刊。'},
  {person: '雄略天皇', deed: '5世紀の後の五王の1人。倭王武。埼玉県稲荷山古墳の鉄剣にその名がある。'},
  {person: '推古天皇', deed: '初の女性の天皇。おいの聖徳太子を摂政にして大王（天皇）中心の政治をめざす。'},
  {person: '聖徳太子', deed: '冠位十二階・十七条の憲法を制定。小野妹子を遣隋使として送る. '},
  {person: '中大兄皇子', deed: '蘇我氏を滅ぼして大化の改新を始める。後に、大津で即位して天智天皇に。'},
  {person: '元明天皇', deed: '710年に都を藤原京から平城京に移した女性の天皇。'},
  {person: '聖武天皇', deed: '国ごとに国分寺を、東大寺に大仏をつくることを命令。墾田永年私財法を制定。'},
  {person: '桓武天皇', deed: '平安京に都を移し、律令政治の立て直しに努める。坂上田村麻呂を東北地方に派遣。'},
  {person: '白河上皇', deed: '1086年、天皇をしりぞいて上皇となり、院政を始める。'},
  {person: '後鳥羽上皇', deed: '鎌倉幕府を倒しようと承久の乱を起こすが、幕府軍に敗れ、隠岐に流される。'},
  {person: '後醍醐天皇', deed: '鎌倉幕府を倒して建武の新政を始めるが失敗。吉野に逃れ、南朝を開く。'},
  {person: '明治天皇', deed: '五か条の御誓文・大日本帝国憲法・教育勅語などを発布し、天皇の権威を確立する。'},
  {person: '中臣鎌足', deed: '中大兄皇子に協力して大化の改新をすすめる。天智天皇から藤原の姓を授かる。'},
  {person: '藤原道長', deed: '娘を次々と天皇のきさきにして、摂政として摂関政治の全盛期を築く。'},
  {person: '菅原道真', deed: '遣唐使の廃止を提案。後に九州の大宰府に流され、現在は学問の神様。'},
  {person: '行基', deed: '仏教を広める一方、橋やため池をつくる。聖武天皇に協力して大仏建立を助ける。'},
  {person: '鑑真', deed: '唐の僧。何度も失敗して来日。唐招提寺を建てる。'},
  {person: '最澄', deed: '比叡山に延暦寺を建て、天台宗を広める。'},
  {person: '空海', deed: '高野山に金剛峰寺を建て、真言宗を広める。'},
  {person: '阿倍仲麻呂', deed: '遣唐使として唐に渡るが、帰国できずに唐の政府で役人として一生を終える。'},
  {person: '小野妹子', deed: '最初の遣隋使として隋へ。聖徳太子の手紙を隋の皇帝に渡す。'},
  {person: '平清盛', deed: '武士として初めて太政大臣になる。日宋貿易。'},
  {person: '源頼朝', deed: '鎌倉幕府を開き、征夷大将軍になる。'},
  {person: '源義経', deed: '源頼朝の弟。平氏を壇ノ浦の戦いで滅ぼす。'},
  {person: '北条泰時', deed: '鎌倉幕府の3代執権。御成敗式目を制定する。'},
  {person: '北条時宗', deed: '鎌倉幕府の8代執権。2度の元寇（文永の役・弘安の役）に対処。'},
  {person: '足利尊氏', deed: '後醍醐天皇に協力して鎌倉幕府を倒すが、後に反目して室町幕府を開く。'},
  {person: '足利義満', deed: '室町幕府の3代将軍。南北朝を統一し、金閣を建てる。日明貿易。'},
  {person: '足利義政', deed: '室町幕府の8代将軍。銀閣を建てる。応仁の乱の原因を作る。'},
  {person: '武田信玄', deed: '甲斐の戦国大名。上杉謙信と川中島で何度も戦う。'},
  {person: '上杉謙信', deed: '越後の戦国大名。武田信玄のライバル。'},
  {person: '織田信長', deed: '室町幕府を滅ぼし、天下統一を目指す。本能寺の変で。'},
  {person: '豊臣秀吉', deed: '天下統一を果たす。太閤検地や刀狩を行う。'},
  {person: '徳川家康', deed: '江戸幕府を開き、260年続く太平の世の礎を築く。'},
  {person: '徳川家光', deed: '江戸幕府の3代将軍。参勤交代を定例化し、鎖国を完成させる。'},
  {person: '徳川綱吉', deed: '江戸幕府の5代将軍。生類憐みの令を出す。朱子学を奨励。'},
  {person: '徳川吉宗', deed: '江戸幕府の8代将軍。享保の改革を行う。目安箱を設置。'},
  {person: '徳川慶喜', deed: '江戸幕府の最後の将軍。大政奉還を行う。'},
  {person: '田沼意次', deed: '老中として商業を重視する政治を行うが、わいろが横行し批判される。'},
  {person: '松平定信', deed: '白河藩主から老中になり、寛政の改革を行う。'},
  {person: '水野忠邦', deed: '老中として天保の改革を行う。株仲間の解散。'},
  {person: '大塩平八郎', deed: '元大阪町奉行所の役人。飢饉に苦しむ人々を救うため乱を起こす。'},
  {person: '西郷隆盛', deed: '薩摩藩士。薩長同盟を結ぶ。明治新政府で活躍するが、後に西南戦争。'},
  {person: '大久保利通', deed: '薩摩藩士。岩倉使節団に参加。内務卿として新政府の基礎を固める。'},
  {person: '木戸孝允', deed: '長州藩士（桂小五郎）。版籍奉還や廃藩置県を推進。'},
  {person: '坂本龍馬', deed: '土佐藩出身。薩長同盟の仲立ちをする。'},
  {person: '勝海舟', deed: '幕臣。咸臨丸で渡米。西郷隆盛と会談し、江戸城無血開城を実現。'},
  {person: '伊藤博文', deed: '初代内閣総理大臣。大日本帝国憲法の制定に関わる。'},
  {person: '板垣退助', deed: '自由民権運動の指導者。野党を、自由党を結成。'},
  {person: '大隈重信', deed: '立憲改進党を結成。早稲田大学を創設。'},
  {person: '陸奥宗光', deed: '外務大臣として、日清戦争直前に領事裁判権の撤廃に成功。'},
  {person: '小村寿太郎', deed: '外務大臣として、日露戦争後に、関税自主権の完全回復に成功。'},
  {person: '明治天皇', deed: '五か条の御誓文を出し、近代国家の基礎を築く。'},
  {person: '山県有朋', deed: '徴兵制を確立。内閣総理大臣を2度務める。軍部大臣現役武官制。'},
  {person: '原敬', deed: '初の本格的な政党内閣を組織。「平民宰相」と呼ばれる。'},
  {person: '犬養毅', deed: '五・一五事件で暗殺される。政党政治の終焉。'},
  {person: '吉田茂', deed: '戦後の首相。サンフランシスコ平和条約を結ぶ。'},
  {person: '佐藤栄作', deed: '非核三原則を提唱。沖縄返還を実現。'},
  {person: '田中角栄', deed: '日中国交正常化を実現。「日本列島改造論」。'},
  {person: '雪舟', deed: '水墨画を日本風に完成させる。'},
  {person: '狩野永徳', deed: '安土桃山時代の絵師。「唐獅子図屏風」など。'},
  {person: '葛飾北斎', deed: '江戸時代の浮世絵師。「富嶽三十六景」。'},
  {person: '歌川広重', deed: '江戸時代の浮世絵師。「東海道五十三次」。'},
  {person: '菱川師宣', deed: '浮世絵の祖。「見返り美人図」。'},
  {person: '本居宣長', deed: '「古事記伝」を著し、国学を大成する。'},
  {person: '杉田玄白', deed: '「解体新書」を出版。蘭学の発展に貢献。'},
  {person: '伊能忠敬', deed: '日本全国を測量し、正確な日本地図を作成。'},
  {person: '紫式部', deed: '「源氏物語」の著者。'},
  {person: '清少納言', deed: '「枕草子」の著者。'},
  {person: '近松門左衛門', deed: '人形浄瑠璃・歌舞伎の脚本家。「曽根崎心中」。'},
  {person: '松尾芭蕉', deed: '俳諧を芸術に高める。「おくのほそ道」。'},
  {person: '夏目漱石', deed: '「吾輩は猫である」「坊っちゃん」「こころ」の著者。'},
  {person: '森鴎外', deed: '「舞姫」「阿部一族」の著者。医学博士。'},
  {person: '芥川龍之介', deed: '「羅生門」「鼻」「河童」の著者。'},
  {person: '宮沢賢治', deed: '「銀河鉄道の夜」「注文の多い料理店」。「雨ニモマケズ」。'},
  {person: '太宰治', deed: '「走れメロス」「人間失格」の著者。'},
  {person: '福沢諭吉', deed: '「学問のすゝめ」を著す。慶應義塾の創設。'},
  {person: '新渡戸稲造', deed: '「武士道」の著者。国際連盟次長。'},
  {person: '内村鑑三', deed: 'キリスト教思想家。非戦論を唱える。'},
  {person: '北里柴三郎', deed: '細菌学者。ペスト菌の発見。破傷風の治療法を開発。'},
  {person: '野口英世', deed: '細菌学者。黄熱病の研究中にアフリカで病死。'},
  {person: '志賀潔', deed: '赤痢菌の発見者。'},
  {person: '高峰譲吉', deed: 'アドレナリンの抽出、タカジアスターゼの開発。'},
  {person: '鈴木梅太郎', deed: 'ビタミンB1（オリザニン）の発見。'},
  {person: '長岡半太郎', deed: '原子モデルの研究。'},
  {person: '湯川秀樹', deed: '日本人初のノーベル賞受賞者（物理学賞）。中間子の存在を予言。'},
  {person: '朝永振一郎', deed: 'ノーベル物理学賞受賞。量子電磁力学の研究。'},
  {person: '黒澤明', deed: '映画監督。「羅生門」「七人の侍」。'},
  {person: '手塚治虫', deed: '漫画家。「鉄腕アトム」「火の鳥」。'},
  {person: '聖徳太子', deed: '十七条の憲法、冠位十二階。'},
  {person: '空海', deed: '真言宗。高野山。'},
  {person: '最澄', deed: '天台宗。比叡山。'},
  {person: '法然', deed: '浄土宗。専修念仏。'},
  {person: '親鸞', deed: '浄土真宗。悪人正機。'},
  {person: '一遍', deed: '時宗。踊念仏。'},
  {person: '栄西', deed: '臨済宗。座禅。茶の普及。'},
  {person: '道元', deed: '曹洞宗。只管打坐。'},
  {person: '日蓮', deed: '日蓮宗。お題目。'},
  {person: 'フランシスコ・ザビエル', deed: 'キリスト教を日本に伝える。'},
  {person: 'マルコ・ポーロ', deed: '「世界の記述」で日本を黄金の国ジパングと紹介。'},
  {person: 'ペリー', deed: '1853年、黒船を率いて来航。日米和親条約を結ぶ。'},
  {person: 'ハリス', deed: '初代のアメリカ総領事。1858年、日米修好通商条約を結ぶ。'},
  {person: 'マッカーサー', deed: '連合国軍最高司令官。戦後の日本の占領政策をすすめた。'}
];

/* --- Configuration & Labels --- */
const YEAR_STAGE_LABELS = ['古代①','古代②','中世①','中世②','近世①','近世②','近代①','近代②','昭和①','昭和・平成'];
const PERSON_STAGE_LABELS = ['伝説・古代の女性','古代の天皇・政治家','奈良・平安の知識人','平安・鎌倉の武士','室町・戦国の英雄','江戸の政治と一揆','幕末・維新の志士','明治・大正の政治','昭和・現代の歩み','古典芸術・作家①','古典芸術・作家②','宗教家・思想家'];

const ROLES = [
  { lv: 1, title: '見習い剣士' },
  { lv: 6, title: '熟練の騎士' },
  { lv: 11, title: '勇名な竜騎士' },
  { lv: 21, title: '王宮の聖騎士' },
  { lv: 31, title: '知識の賢者' },
  { lv: 46, title: '大魔導師' },
  { lv: 61, title: '伝説の英雄' },
  { lv: 81, title: '王国の守護神' },
  { lv: 95, title: '歴史の預言者' },
  { lv: 99, title: '歴史の神' }
];

/* --- Global State --- */
let currentSeries = 'year'; 
let currentMode = 'yearToEvent'; 
let currentStage = 0;
let currentQuestions = [];
let currentIdx = 0;
let score = 0;
let playerHP = 5;
let currentUser = null;
let userLv = 1;
let userXP = 0;
let progress = { year: Array(10).fill(0), person: Array(12).fill(0) };
let records = [];
let wrongList = [];

/* --- Rendering --- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-main') renderStageGrid();
}

function updateBars() {
    const role = getRole(userLv);
    const next = getNextRole(userLv);

    setText('headerLv', `Lv.${userLv}`);
    setText('headerClass', role.title);
    setText('headerXP', userXP);
    setText('nextLVXP', userLv * 100);
    setText('nextRole', next.title);
    setText('nextRoleLv', next.lv);

    const bar = document.getElementById('headerXPBar');
    if (bar) {
        const pct = Math.min(100, (userXP / (userLv * 100)) * 100);
        bar.style.width = pct + '%';
    }

    setText('statTotal', records.length);
    setText('statPerfect', records.filter(r => r.score === 10).length);
    setText('statTotalXP', records.reduce((sum, r) => sum + r.score * 10, 0));
}

function setText(id, txt) {
    const el = document.getElementById(id);
    if(el) el.textContent = txt;
}

function renderStageGrid() {
  const grid = document.getElementById('stageGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  const labels = currentSeries === 'year' ? YEAR_STAGE_LABELS : PERSON_STAGE_LABELS;
  const progArr = currentSeries === 'year' ? progress.year : progress.person;

  labels.forEach((label, i) => {
    const btn = document.createElement('div');
    btn.className = 'retro-box stage-card';
    btn.style.padding = '10px';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'center';
    
    const high = progArr[i] || 0;
    btn.innerHTML = `
      <div style="font-size:0.6rem; color:var(--m-gold)">STAGE ${i+1}</div>
      <div style="font-size:0.8rem; margin:4px 0;">${label}</div>
      <div style="font-size:0.6rem;">記録: ${high}/10</div>
    `;
    btn.onclick = () => startStage(i);
    grid.appendChild(btn);
  });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    const content = document.getElementById(`tab-${tabId}`);
    if (content) content.classList.add('active');
    
    if(tabId === 'quest') document.getElementById('tabBtn2')?.classList.add('active');
    if(tabId === 'records') document.getElementById('tabBtn3')?.classList.add('active');
}

function setSeries(series) {
    currentSeries = series;
    document.getElementById('btnSeriesYear').classList.toggle('active', series==='year');
    document.getElementById('btnSeriesPerson').classList.toggle('active', series==='person');
    renderStageGrid();
}

function setMode(mode, btn) {
    currentMode = mode;
    document.querySelectorAll('#modeBtn1, #modeBtn2, #modeBtn3').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
}

function startStage(stageIdx) {
  currentStage = stageIdx;
  score = 0;
  currentIdx = 0;
  playerHP = 5;
  wrongList = [];
  
  const dataSet = currentSeries === 'year' ? YEAR_DATA : PERSON_DATA;
  const slice = dataSet.slice(stageIdx * 10, (stageIdx + 1) * 10);
  
  currentQuestions = slice.map(item => {
    let modeToUse = currentMode;
    if (currentMode === 'random') {
        const rnd = Math.random();
        if (currentSeries === 'year') {
           modeToUse = rnd > 0.5 ? 'yearToEvent' : 'eventToYear';
        } else {
           modeToUse = rnd > 0.5 ? 'personToDeed' : 'deedToPerson';
        }
    }

    if (currentSeries === 'year') {
      return modeToUse === 'eventToYear' ? 
        { q: `${item.event} が起きた年は？`, a: item.year.toString() } :
        { q: `${item.year}年 に起きた出来事は？`, a: item.event };
    } else {
      return modeToUse === 'deedToPerson' ?
        { q: `${item.deed} を行った人物は？`, a: item.person } :
        { q: `${item.person} の功績は？`, a: item.deed };
    }
  });

  currentQuestions.sort(() => Math.random() - 0.5);
  showScreen('screen-battle');
  updateHPUI();
  nextQuestion();
}

function updateHPUI() {
    setText('playerHPText', `HP ${playerHP}/5`);
    const pBar = document.getElementById('playerHP');
    if(pBar) pBar.style.width = (playerHP / 5 * 100) + '%';
    
    const eBar = document.getElementById('enemyHP');
    if(eBar) eBar.style.width = '100%';
}

function nextQuestion() {
  if (currentIdx >= currentQuestions.length || playerHP <= 0) {
    endQuiz();
    return;
  }
  const qObj = currentQuestions[currentIdx];
  const qEl = document.getElementById('battleQ');
  if(qEl) qEl.textContent = qObj.q;
  
  const input = document.getElementById('battleInput');
  if(input) {
      input.value = '';
      input.style.display = 'block';
      setTimeout(() => input.focus(), 100);
  }
  
  document.getElementById('btnAttack').style.display = 'block';
  document.getElementById('btnNext').style.display = 'none';
  
  setText('enemyName', currentSeries==='year' ? '年号ゴブリン' : '歴史のエリート');
  document.getElementById('enemyEmoji').textContent = currentSeries==='year' ? '👺' : '🤺';
  document.getElementById('enemyHP').style.width = '100%';
}

function checkAnswer() {
  const inputEl = document.getElementById('battleInput');
  const input = inputEl ? inputEl.value.trim() : "";
  const qObj = currentQuestions[currentIdx];
  const correct = qObj.a;
  
  const isCorrect = fuzzyMatch(input, correct);

  if (isCorrect) {
    score++;
    showToast("正解！", "success");
    const eBar = document.getElementById('enemyHP');
    if(eBar) eBar.style.width = '0%';
    if(typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  } else {
    playerHP--;
    showToast(`不正解...`, "error");
    updateHPUI();
    wrongList.push({ q: qObj.q, a: correct, user: input });
  }

  document.getElementById('btnAttack').style.display = 'none';
  document.getElementById('btnNext').style.display = 'block';
  
  currentIdx++;
}

function fuzzyMatch(input, correct) {
    if (input === correct) return true;
    if (isNaN(Number(correct))) {
        if (input.length >= 2 && (correct.includes(input) || input.includes(correct))) return true;
    }
    return false;
}

function endQuiz() {
  showScreen('screen-result');
  setText('rTitle', playerHP > 0 ? '勝利！' : '敗北...');
  setText('rsCorrect', score);
  setText('rsWrong', 10 - score);
  const xp = score * 10;
  setText('rsXP', `+${xp}`);
  
  const progArr = currentSeries === 'year' ? progress.year : progress.person;
  if (score > progArr[currentStage]) progArr[currentStage] = score;

  userXP += xp;
  const oldLv = userLv;
  while (userXP >= userLv * 100) {
    userXP -= userLv * 100;
    userLv++;
  }
  
  const lvUp = document.getElementById('lvUpArea');
  if(lvUp) lvUp.style.display = (userLv > oldLv) ? 'block' : 'none';

  records.unshift({ date: new Date().toLocaleString(), series: currentSeries, stage: currentStage+1, score });
  if(records.length > 30) records.pop();

  const pc = document.getElementById('perfectCeleb');
  if(pc) pc.style.display = (score === 10) ? 'block' : 'none';
  if (score === 10) showCert();

  const wp = document.getElementById('wrongPanel');
  const rl = document.getElementById('reviewList');
  if (wrongList.length > 0) {
      if(wp) wp.style.display = 'block';
      if(rl) rl.innerHTML = wrongList.map(w => `
          <div style="margin-bottom:8px; border-bottom:1px solid #333; padding-bottom:4px;">
            <p style="color:var(--m-gold)">問: ${w.q}</p>
            <p>解: ${w.a}</p>
          </div>
      `).join('');
  } else {
      if(wp) wp.style.display = 'none';
  }

  updateBars();
  saveLocal();
}

function showCert() {
    const overlay = document.getElementById('certOverlay');
    if(!overlay) return;
    setText('certName', (currentUser ? currentUser.name : '冒険者') + ' 殿');
    setText('certDate', new Date().toLocaleDateString());
    overlay.classList.add('active');
}

function closeCert() {
    const overlay = document.getElementById('certOverlay');
    if(overlay) overlay.classList.remove('active');
}

function goHome() {
    showScreen('screen-main');
    switchTab('quest');
    renderStageGrid();
}

function retryWrong() {
    startStage(currentStage);
}

function toggleAuth(isSignup) {
    const l = document.getElementById('loginFormArea');
    const s = document.getElementById('signupFormArea');
    if(l) l.style.display = isSignup ? 'none' : 'block';
    if(s) s.style.display = isSignup ? 'block' : 'none';
}

function handleLogin(e) {
  if(e) e.preventDefault();
  currentUser = { name: '冒険者', id: 'guest' };
  showScreen('screen-main');
  updateBars();
}

function handleSignup(e) {
  if(e) e.preventDefault();
  const nameInput = document.getElementById('signupName');
  const name = (nameInput && nameInput.value) ? nameInput.value : '冒険者';
  currentUser = { name, id: 'guest' };
  showScreen('screen-main');
  updateBars();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('histRPG_data');
  location.reload();
}

function showToast(msg, type="info") {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  if (type === 'success') {
      t.style.background = '#00ff00';
      t.style.color = '#000';
  } else if (type === 'error') {
      t.style.background = '#ff0000';
      t.style.color = '#fff';
  } else {
      t.style.background = '#0055ff';
      t.style.color = '#fff';
  }
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function getRole(lv) {
  let res = ROLES[0];
  for (let r of ROLES) {
    if (lv >= r.lv) res = r;
  }
  return res;
}

function getNextRole(lv) {
  for (let r of ROLES) {
    if (r.lv > lv) return r;
  }
  return ROLES[ROLES.length - 1];
}

function saveLocal() {
    const d = { currentUser, userLv, userXP, progress, records };
    localStorage.setItem('histRPG_data', JSON.stringify(d));
}

function loadLocal() {
    const raw = localStorage.getItem('histRPG_data');
    if (!raw) return;
    const d = JSON.parse(raw);
    if(d.currentUser) currentUser = d.currentUser;
    if(d.userLv) userLv = d.userLv;
    if(d.userXP) userXP = d.userXP;
    if(d.progress) progress = d.progress;
    if(d.records) records = d.records;
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
    loadLocal();
    showScreen('screen-auth'); 
    updateBars();
});
