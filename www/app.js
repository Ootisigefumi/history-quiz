/**
 * 勉強RPG 歴史クエスト
 * app.js - Optimized for Root index.html (Retro UI)
 * FIX: Map 'yearToEvent'/'eventToYear' modes to Person equivalents (personToDeed/deedToPerson)
 */

/* --- Supabase Config (Mock Placeholder) --- */
let sb;
async function initSB() {
  if (typeof supabase !== 'undefined') {
    // Supabase logic
  }
}

/* --- Core Data: Year (100 items) --- */
const YEAR_DATA = [
  {year: 239, event: '邪馬台国の卑弥呼が魏に使いを送る'},
  {year: 538, event: '百済から仏教が伝来する'},
  {year: 593, event: '聖徳太子が推古天皇의 摂政になる'},
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
  {person: '聖徳太子', deed: '冠位十二階・十七条の憲法を制定。小野妹子を遣隋使として送る。'},
  {person: '天智天皇', deed: '蘇我氏を滅ぼして大化の改新を始める。後に、大津で即位して天智天皇に。'},
  {person: '元明天皇', deed: '710年に都を藤原京から平城京に移した女性の天皇。'},
  {person: '聖武天皇', deed: '国ごとに国分寺を、東大寺に大仏をつくることを命令。墾田永年私財法を制定。'},
  {person: '桓武天皇', deed: '平安京に都を移し、律令政治の立て直しに努める。坂上田村麻呂を東北地方に派遣。'},
  {person: '白河上皇', deed: '1086年、天皇をしりぞいて上皇となり、院政を始める。'},
  {person: '後鳥羽上皇', deed: '鎌倉幕府を倒そうと承久の乱を起こすが、幕府軍に敗れ、隠岐に流される。'},
  {person: '後醍醐天皇', deed: '鎌倉幕府を倒して建武の新政を始めるが失敗。吉野に逃れ、南朝を開く。'},
  {person: '明治天皇', deed: '五か条の御誓文・大日本帝国憲法・教育勅語などを発布し、天皇の権威を確立する。'},
  {person: '中臣鎌足', deed: '中大兄皇子に協力して大化の改新をすすめる。天智天皇から藤原の姓を授かる。'},
  {person: '阿倍仲麻呂', deed: '唐に送られた留学生で、唐で一生を終える。「天の原 ふりさけみれば…」の歌の作者。'},
  {person: '菅原道真', deed: '遣唐使の停止を提案。藤原氏によって大宰府に移される。学問の神様として知られる。'},
  {person: '藤原純友', deed: '10世紀、瀬戸内海の海賊を率いて反乱を起こす。'},
  {person: '藤原道長', deed: '11世紀前半、摂関政治の全盛期を築く。「この世をば わが世とぞ思う…」の歌の作者。'},
  {person: '藤原頼通', deed: '藤原道長の子で、摂政・関白を務める。宇治に平等院鳳凰堂を建立。'},
  {person: '坂上田村麻呂', deed: '桓武天皇から征夷大将軍に任命され、東北地方の蝦夷をおさえる。'},
  {person: '平将門', deed: '10世紀に関東で反乱を起こし、自ら「新皇」を名のる。'},
  {person: '平清盛', deed: '平治の乱で源義朝を破り、武士で最初の太政大臣となる。日宋貿易をさかんにする。'},
  {person: '源頼朝', deed: '1192年、征夷大将軍に任命され、鎌倉幕府を開く。源義経の兄。'},
  {person: '源義経', deed: '源義朝の子で源頼朝の弟。壇ノ浦の戦いで平氏を滅ぼす。'},
  {person: '北条泰時', deed: '鎌倉幕府の3代執権。最初の武家法である御成敗式目を制定し、執権政治を確立。'},
  {person: '北条時宗', deed: '鎌倉幕府の8代執権。元寇（文永の役・弘安の役）をしりぞける。円覚寺を建立。'},
  {person: '足利尊氏', deed: '室町幕府の初代将軍。京都の朝廷（北朝）から征夷大将軍に任じられて幕府を開く。'},
  {person: '足利義満', deed: '室町幕府の3代執権。南北朝を合一し、金閣（鹿苑寺）を建てる。日明貿易を開始。'},
  {person: '足利義政', deed: '室町幕府の8代執権。後継者争いなどから応仁の乱が起こる。東山に銀閣（慈照寺）を建てる。'},
  {person: '足利義昭', deed: '室町幕府最後の将軍。織田信長によって京都から追放され、室町幕府が滅亡する。'},
  {person: '織田信長', deed: '尾張国（愛知県）の戦国大名。安土城を建てる。本能寺で明智光秀に滅ぼされる。'},
  {person: '武田信玄', deed: '甲斐国（山梨県）の戦国大名。上杉謙信と川中島でたびたび戦う。信玄堤を築く。'},
  {person: '豊臣秀吉', deed: '尾張国の出身で、全国を統一。太閤検地・刀狩・朝鮮侵略などを行う。大阪城を築く。'},
  {person: '徳川家康', deed: '三河国（愛知県）の出身。関ヶ原の戦いに勝利し、1603年、江戸に幕府を開く。'},
  {person: '徳川家光', deed: '江戸幕府の3代将軍。武家諸法度に参勤交代を定める。鎖国を完成させる。'},
  {person: '天草四郎', deed: '島原・天草一揆（島原 de 乱）のときの一揆軍の首領。'},
  {person: '山田長政', deed: '江戸時代初め、シャム（タイ）のアユタヤにあった日本町の長。'},
  {person: '徳川綱吉', deed: '江戸幕府の5代将軍。生類憐みの令を出し、「犬公方」と呼ばれる。元禄文化が栄える。'},
  {person: '新井白石', deed: '朱子学の学者。江戸幕府の6・7代将軍に仕え、正徳の治を行う。長崎貿易を制限。'},
  {person: '徳川吉宗', deed: '江戸幕府の8代将軍。享保の改革を行い、「米将軍」と呼ばれる。目安箱を設置。'},
  {person: '田沼意次', deed: '江戸幕府の老中。株仲間を積極的に認め、長崎貿易を拡大した。'},
  {person: '松平定信', deed: '徳川吉宗の孫。白河藩主から老中となり、寛政の改革を行った。'},
  {person: '大塩平八郎', deed: '大阪町奉行所の元役人で、天保のききんのときに大阪で反乱を起こす。'},
  {person: '水野忠邦', deed: '江戸幕府の老中。物価を下げるため、株仲間を解散させるなど、天保の改革を行う。'},
  {person: '井伊直弼', deed: '江戸幕府の大老。日米修好通商条約を結ぶ。桜田門外の変で暗殺される。'},
  {person: '吉田松陰', deed: '長州藩（山口県）の出身。私塾の松下村塾で教える。安政の大獄で処刑される。'},
  {person: '坂本龍馬', deed: '土佐藩（高知県）の出身。薩長同盟を実現させる。'},
  {person: '徳川慶喜', deed: '江戸幕府最後の15代将軍。1867年、大政奉還を申し出る。'},
  {person: '岩倉具視', deed: '公家出身。王政復古を実現して明治政府の要職につく。岩倉使節団として欧米を視察。'},
  {person: '西郷隆盛', deed: '薩摩藩（鹿児島県）の出身。征韓論を主張し政府を去る。西南戦争を起こすが敗れる。'},
  {person: '大久保利通', deed: '薩摩藩の出身。版籍奉還・廃藩置県を実施し、殖産興業をすすめる。'},
  {person: '木戸孝允', deed: '長州藩出身で吉田松陰に学ぶ。西郷隆盛・大久保利通とならび維新の三傑の一人。'},
  {person: '板垣退助', deed: '土佐藩の出身。民選議員設立白書を政府に提出。自由党の党首。'},
  {person: '大隈重信', deed: '佐賀藩（佐賀県）の出身。立憲改進党を結成。東京専門学校（後の早稲田大学）を設立。'},
  {person: '伊藤博文', deed: '初代の内閣総理大臣。大日本帝国憲法の草案を作成。'},
  {person: '渋沢栄一', deed: '日本初の銀行など、多くの会社を創設。新1万円札の肖像。'},
  {person: '陸奥宗光', deed: '1894年、領事裁判権の撤廃に成功。日清戦争の講和会議に伊藤博文とともに出席。'},
  {person: '小村寿太郎', deed: 'ポーツマス講和会議の全権。1911年、アメリカと交渉して関税自主権の回復に成功。'},
  {person: '田中正造', deed: '栃木県出身の衆議院議員。足尾銅山鉱毒事件の解決に一生をささげる。'},
  {person: '原敬', deed: '米騒動の直後、立憲政友会を中心に、初の本格的な政党内閣を組織。'},
  {person: '尾崎行雄', deed: '犬養毅らとともに護憲運動・普通選挙運動を指導。「憲政の神様」と呼ばれる。'},
  {person: '犬養毅', deed: '護憲運動の中心的人物。1932年の五・一五事件で暗殺され、政党政治が中断する。'},
  {person: '吉田茂', deed: '日本国憲法が公布されたときの首相。サンフランシスコ平和条約・日米安全保障条約に調印。'},
  {person: '佐藤栄作', deed: '日韓基本条約に調印。沖縄返還を実現。非核三原則を国会で決議。ノーベル平和賞。'},
  {person: '田中角栄', deed: '1972年、日中国同声明を発表し、中国との国交正常化を実現。'},
  {person: '杉田玄白', deed: '小浜藩（福井県）出身の蘭学者。オランダ語の医学書を翻訳し、「解体新書」を刊行。'},
  {person: '前野良沢', deed: '中津藩（大分県）の医者・蘭学者。杉田玄白とともに「解体新書」を刊行。'},
  {person: '本居宣長', deed: '松阪（三重県）出身の国学者。「古事記伝」を著し、国学を大成する。'},
  {person: '高野長英', deed: '蘭学者で、シーボルトの弟子。鎖国政策を批判して、幕府に弾圧される。'},
  {person: '伊能忠敬', deed: '佐原（千葉県）の商人。幕府の命令で全国を測量し、正確な日本地図を作成する。'},
  {person: '福沢諭吉', deed: '中津藩の出身。「学問のすゝめ」の著者で慶應義塾を設立。'},
  {person: '北里柴三郎', deed: '破傷風の血清療法とベスト菌を発見。感染症の研究所を設立。新千円札の肖像。'},
  {person: '野口英世', deed: '細菌学者で黄熱病の研究に学ぶ。アフリカで黄熱病の研究中に死亡。'},
  {person: '吉野作造', deed: '民主主義をとなえた大正デモクラシーの指導者。普通選挙と政党内閣の確立を主張。'},
  {person: '湯川秀樹', deed: '物理学者。1949年に日本人で初のノーベル賞（物理学賞）を受賞。'},
  {person: '山上憶良', deed: '奈良時代の歌人。農民の生活をうたった「貧窮問答歌」が「万葉集」に収められる。'},
  {person: '運慶', deed: '鎌倉時代の仏師。東大寺南大門の金剛力士像は、快慶との合作。'},
  {person: '雪舟', deed: '室町時代の僧侶。明にわたって絵を学び、帰国後、水墨画を大成。'},
  {person: '世阿弥', deed: '足利義満の保護を受けて、父の観阿弥とともに能を大成。'},
  {person: '千利休', deed: '堺の豪商で、茶道を大成。織田信長や豊臣秀吉に仕えた。'},
  {person: '井原西鶴', deed: '元禄文化を代表する作家。「世間胸算用」などの浮世草子（小説）を著す。'},
  {person: '松尾芭蕉', deed: '元禄時代の俳人で、俳諧（俳句）を大成。紀行文の「おくのほそ道」など。'},
  {person: '近松門左衛門', deed: '元禄時代の浄瑠璃・歌舞伎の脚本家。代表作は「曽根崎心中」「国性爺合戦」など。'},
  {person: '菱川師宣', deed: '元禄文化を代表する浮世絵師。代表作は「見返り美人図」。木版画の浮世絵を確立。'},
  {person: '葛飾北斎', deed: '化政文化を代表する浮世絵師。風景画にすぐれ、「富嶽三十六景」などを描く。'},
  {person: '歌川広重', deed: '化政文化を代表する浮世絵師。「東海道五十三次」によって、風景画を大成する。'},
  {person: '十返舎一九', deed: '化政文化のころの作家。「東海道中膝栗毛」が代表作。'},
  {person: '行基', deed: '諸国をまわって社会事業につくす。東大寺の大仏づくりに協力。渡来人を祖先にもつ。'},
  {person: '最澄', deed: '9世紀、唐から天台宗を伝え、比叡山に延暦寺を建てる。伝教大師ともよばれる。'},
  {person: '空海', deed: '9世紀、唐から真言宗を伝え、高野山に金剛峯寺を建てる。弘法大師ともよばれる。'},
  {person: '法然', deed: '比叡山で学んだ後、浄土宗を開く。ひたすら念仏をとなえれば救われると説く。'},
  {person: '親鸞', deed: '比叡山で学んだ後、法然の弟子となり、浄土真宗（一向宗）を開く。'},
  {person: '一遍', deed: '踊りながら念仏をとなえる踊り念仏により、時宗を広める。'},
  {person: '日蓮', deed: '日蓮宗（法華宗）を開く。「南無妙法蓮華経」の題目をとなえることを説く。'},
  {person: '栄西', deed: '宋から、禅宗の臨済宗を伝える。'},
  {person: '道元', deed: '宋から、禅宗の曹洞宗を伝える。'},
  {person: '釈迦', deed: '紀元前5世紀ごろ、仏教を開く。'},
  {person: 'イエス・キリスト', deed: '1世紀前半にキリスト教を開く。'},
  {person: 'ムハンマド', deed: '7世紀にイスラム教を開く。'},
  {person: '鑑真', deed: '唐の高僧。5度の失敗の後、753年に日本へ来るが、その間に失明。唐招提寺を建立。'},
  {person: 'フビライ・ハン', deed: 'モンゴル帝国を築いたチンギス・ハンの孫で元の皇帝。2度にわたり日本を攻める。'},
  {person: 'マルコ・ポーロ', deed: 'イタリアの商人でフビライ・ハンに仕え、その体験を「世界の記述（東方見聞録）」に残す。'},
  {person: 'フランシスコ・ザビエル', deed: 'スペイン人のイエズス会宣教師。1549年、鹿児島に来て日本にキリスト教を伝える。'},
  {person: 'シャクシャイン', deed: '1669年、松前藩による不正な取り引きに反発し、アイヌの人々を率いて反乱を起こす。'},
  {person: 'シーボルト', deed: 'ドイツ人。長崎の出島におかれたオランダ商館の医師。長崎郊外に鳴滝塾を開く。'},
  {person: 'リンカーン', deed: 'アメリカ大統領。民主政治を「人民の、人民による、人民のための政治」と表現した。'},
  {person: 'ペリー', deed: '1853年、黒船を率いて浦賀に来航。翌年再び来日して、日米和親条約を結ぶ。'},
  {person: 'ハリス', deed: '初代のアメリカ総領事として下田に来る。1858年、日米修好通商条約を結ぶ。'},
  {person: 'マッカーサー', deed: '連合国軍最高司令官（GHQ）の最高司令官。戦後の日本の占領政策をすすめた。'}
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

    renderRecords();
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
    btn.style.padding = '8px';
    btn.style.textAlign = 'center';
    
    const isUnlocked = i === 0 || progArr[i-1] >= 10;
    
    const high = progArr[i] || 0;
    if (isUnlocked) {
      btn.style.cursor = 'pointer';
      btn.innerHTML = `
        <div style="font-size:0.55rem; color:var(--m-gold)">STAGE ${i+1}</div>
        <div style="font-size:0.75rem; margin:2px 0;">${label}</div>
        <div style="font-size:0.55rem;">記録: ${high}/10</div>
        ${high >= 10 ? '<div style="color:var(--m-green); font-size:0.5rem;">★CLEAR★</div>' : ''}
      `;
      btn.onclick = () => startStage(i);
    } else {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.innerHTML = `
        <div style="font-size:0.55rem;">STAGE ${i+1}</div>
        <div style="font-size:0.75rem; color:#888;">🔒 封印</div>
        <div style="font-size:0.5rem; color:var(--m-red); margin-top:2px;">要:前満点</div>
      `;
      btn.onclick = () => showToast("前のステージを満点でクリアしてください", "error");
    }
    grid.appendChild(btn);
  });
}

function renderRecords() {
    const list = document.getElementById('recordsList');
    if (!list) return;
    if (records.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:10px;">まだ冒険の記録がありません</p>';
        return;
    }
    list.innerHTML = records.map((r, i) => `
        <div style="border-bottom:1px solid #333; padding:8px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>${r.date.split(' ')[0]} ${r.series==='year'?'年号':'人物'}-S${r.stage}</span>
            <span style="color:${r.score===10?'var(--m-gold)':'#fff'}">${r.score}/10点</span>
          </div>
          ${r.wrongs && r.wrongs.length > 0 ? `
            <button class="btn-sm" style="font-size:0.6rem; padding:2px 6px; margin-top:4px;" onclick="toggleRecordDetail(${i})">レビューを見る</button>
            <div id="rec-detail-${i}" style="display:none; margin-top:6px; font-size:0.7rem; color:#ccc; background:#111; padding:4px; border:1px solid #444;">
              ${r.wrongs.map(w => `<div>Q: ${w.q}<br>A: <span style="color:var(--m-gold)">${w.a}</span></div>`).join('<hr style="border-color:#222">')}
            </div>
          ` : '<div style="font-size:0.6rem; color:var(--m-green); margin-top:4px;">パーフェクト！</div>'}
        </div>
    `).join('');
}

function toggleRecordDetail(idx) {
    const el = document.getElementById(`rec-detail-${idx}`);
    if(el) el.style.display = (el.style.display === 'none') ? 'block' : 'none';
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
    
    // Normalize mode for Person series (Map year-based labels to person/deed logic)
    if (currentSeries === 'person') {
       if (currentMode === 'yearToEvent') modeToUse = 'personToDeed';
       if (currentMode === 'eventToYear') modeToUse = 'deedToPerson';
    }

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
      // PERSON Series Logic
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
        // Broaden fuzzy match for long deeds/names
        if (input.length >= 2 && (correct.includes(input) || input.includes(correct))) return true;
    }
    return false;
}

function endQuiz() {
  showScreen('screen-result');
  setText('rTitle', playerHP > 0 ? (score===10?'PERFECT!':'勝利！') : '敗北...');
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

  records.unshift({ 
      date: new Date().toLocaleString(), 
      series: currentSeries, 
      stage: currentStage+1, 
      score,
      wrongs: [...wrongList]
  });
  if(records.length > 50) records.pop();

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
