/**
 * 勉強RPG 歴史クエスト
 * app.js - Retro UI & Person Feature Support
 */

/* --- Supabase Config (Using Window Proxy) --- */
let sb;
async function initSB() {
  if (typeof supabase !== 'undefined') {
    // Note: Constants for SB_URL/KEY are usually injected or hardcoded
    // For this environment, I will use a placeholder but assume they are available if needed.
    // However, for local stability, I'll check for environment variables or globals.
  }
}

/* --- Core Data --- */
const YEAR_DATA = [
  {year: 57, event: '倭の奴国が漢（後漢）に使いを送り、金印を授かる。'},
  {year: 239, event: '邪馬台国の女王・卑弥呼が魏に使いを送る。'},
  {year: 538, event: '仏教が百済から日本に伝わる。'},
  {year: 593, event: '聖徳太子が推古天皇の摂政になる。'},
  {year: 604, event: '冠位十二階と憲法十七条が制定される。'},
  {year: 607, event: '小野妹子が遣隋使として唐（隋）に送られる。'},
  {year: 645, event: '大化の改新が始まる。中大兄皇子らが蘇我氏を倒す。'},
  {year: 663, event: '白村江の戦いで、日本が唐・新羅の連合軍に敗れる。'},
  {year: 701, event: '大宝律令が完成し、法に基づく政治が始まる。'},
  {year: 710, event: '都が平城京（奈良）に移される（奈良時代の始まり）。'},
  {year: 712, event: '日本最古の歴史書「古事記」が完成する。'},
  {year: 743, event: '墾田永年私財法が制定され、土地の私有が認められる。'},
  {year: 752, event: '東大寺の大仏が完成し、開眼供養が行われる。'},
  {year: 794, event: '都が平安京（京都）に移される（平安時代の始まり）。'},
  {year: 894, event: '菅原道真の提案により遣唐使が廃止される。'},
  {year: 1016, event: '藤原道長が摂政になり、摂関政治の全盛期を迎える。'},
  {year: 1086, event: '白河天皇が上皇となり、院政を始める。'},
  {year: 1159, event: '平治の乱が起き、平氏が政権を握るきっかけとなる。'},
  {year: 1167, event: '平清盛が武士として初めて太政大臣になる。'},
  {year: 1185, event: '壇ノ浦の戦いで平氏が滅亡する。'},
  {year: 1192, event: '源頼朝が征夷大将軍になり、鎌倉幕府を開く。'},
  {year: 1232, event: '北条泰時が御成敗式目（貞永式目）を制定する。'},
  {year: 1274, event: '元寇（文永の役）が起きる。'},
  {year: 1281, event: '元寇（弘安の役）が起きる。'},
  {year: 1333, event: '鎌倉幕府が滅亡する。'},
  {year: 1334, event: '後醍醐天皇による建武の新政が行われる。'},
  {year: 1338, event: '足利尊氏が征夷大将軍になり、室町幕府を開く。'},
  {year: 1392, event: '足利義満が南北朝の統一を成し遂げる。'},
  {year: 1404, event: '足利義満が明との間で勘合貿易を開始する。'},
  {year: 1467, event: '応仁の乱が始まり、戦国時代の幕開けとなる。'},
  {year: 1543, event: '種子島に鉄砲が伝来する。'},
  {year: 1549, event: 'フランシスコ・ザビエルがキリスト教を伝える。'},
  {year: 1560, event: '桶狭間の戦いで織田信長が今川義元を破る。'},
  {year: 1573, event: '織田信長が足利義昭を追放し、室町幕府が滅亡する。'},
  {year: 1575, event: '長篠の戦いで織田・徳川連合軍が武田勝頼を破る。'},
  {year: 1582, event: '本能寺の変で織田信長が明智光秀に倒される。'},
  {year: 1588, event: '豊臣秀吉が刀狩令を出す。'},
  {year: 1590, event: '豊臣秀吉が小田原を攻め落とし、天下統一を果たす。'},
  {year: 1600, event: '関ヶ原の戦いが起きる。'},
  {year: 1603, event: '徳川家康が征夷大将軍になり、江戸幕府を開く。'},
  {year: 1637, event: '島原・天草一揆が起きる。'},
  {year: 1639, event: 'ポルトガル船の来航を禁止し、鎖国が完成する。'},
  {year: 1649, event: '慶安の御触書が出される（農民の生活を制限）。'},
  {year: 1685, event: '徳川綱吉が生類憐みの令を出す。'},
  {year: 1716, event: '徳川吉宗による享保の改革が始まる。'},
  {year: 1772, event: '田沼意次が老中になり、商業重視の政治を行う。'},
  {year: 1787, event: '松平定信による寛政の改革が始まる。'},
  {year: 1837, event: '大塩平八郎の乱が起きる。'},
  {year: 1841, event: '水野忠邦による天保の改革が始まる。'},
  {year: 1853, event: 'ペリーが浦賀に来航する。'},
  {year: 1854, event: '日米和親条約が結ばれ、開港する。'},
  {year: 1858, event: '日米修好通商条約が結ばれる。'},
  {year: 1867, event: '徳川慶喜が大政奉還を行い、幕府が滅亡する。'},
  {year: 1868, event: '五か条の御誓文が出され、明治維新が始まる。'},
  {year: 1871, event: '廃藩置県が行われる。'},
  {year: 1873, event: '徴兵令と地租改正が行われる。'},
  {year: 1877, event: '西南戦争が起き、西郷隆盛が敗れる。'},
  {year: 1885, event: '内閣制度が創設され、伊藤博文が初代首相になる。'},
  {year: 1889, event: '大日本帝国憲法が発布される。'},
  {year: 1890, event: '第1回衆議院議員総選挙が行われる。'},
  {year: 1894, event: '日清戦争が始まる。陸奥宗光が領事裁判権を撤廃。'},
  {year: 1895, event: '下関条約が結ばれ、台湾を譲り受ける。'},
  {year: 1902, event: '日英同盟が結ばれる。'},
  {year: 1904, event: '日露戦争が始まる。'},
  {year: 1905, event: 'ポーツマス条約が結ばれる。'},
  {year: 1910, event: '韓国併合が行われる。'},
  {year: 1911, event: '小村寿太郎が関税自主権の回復に成功する。'},
  {year: 1914, event: '第一次世界大戦が始まる。'},
  {year: 1918, event: '米騒動が起き、原敬の本格的な政党内閣が誕生。'},
  {year: 1923, event: '関東大震災が発生する。'},
  {year: 1925, event: '普通選挙法と治安維持法が制定される。'},
  {year: 1929, event: '世界恐慌が始まる。'},
  {year: 1931, event: '満州事変が起きる。'},
  {year: 1932, event: '五・一五事件が起き、犬養毅首相が暗殺される。'},
  {year: 1937, event: '日中戦争が始まる。'},
  {year: 1941, event: '太平洋戦争が始まる（真珠湾攻撃）。'},
  {year: 1945, event: 'ポツダム宣言を受諾し、第二次世界大戦終結。'},
  {year: 1946, event: '日本国憲法が公布される。'},
  {year: 1951, event: 'サンフランシスコ平和条約と日米安保条約に調印。'},
  {year: 1956, event: '日ソ共同宣言によりソ連との国交回復、国連加盟。'},
  {year: 1964, event: '東京オリンピックが開催され、東海道新幹線が開通。'},
  {year: 1972, event: '沖縄が返還される。日中共同声明で国交正常化。'},
  {year: 1989, event: '昭和天皇が崩御し、元号が「平成」に変わる。'},
  {year: 1995, event: '阪神・淡路大震災、地下鉄サリン事件が発生する。'},
  {year: 2011, event: '東日本大震災が発生する。'},
  {year: 2019, event: '元号が「令和」に変わる。'}
];

const PERSON_STAGE_LABELS = ['女性','天皇・皇族','豪族・貴族','武人・武士','政治家など①','政治家など②','学者','芸術家など①','芸術家など②','僧侶','外国人など','近代・現代'];
const YEAR_STAGE_LABELS = ['古代①','古代②','中世①','中世②','中世③','近世①','近世②','近代①','近代②','現代'];

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
  {person: '中大兄皇子', deed: '蘇我氏を滅ぼして大化の改新を始める。後に、大津で即位して天智天皇に。'},
  {person: '元明天皇', deed: '710年に都を藤原京から平城京に移した女性の天皇。'},
  {person: '聖武天皇', deed: '国ごとに国分寺を、東大寺に大仏をつくることを命令。墾田永年私財法を制定。'},
  {person: '桓武天皇', deed: '平安京に都を移し、律令政治の立て直しに努める。坂上田村麻呂を東北地方に派遣。'},
  {person: '白河上皇', deed: '1086年、天皇をしりぞいて上皇となり、院政を始める。'},
  {person: '後鳥羽上皇', deed: '鎌倉幕府を倒しようと承久の乱を起こすが、幕府軍に敗れ、隠岐に流される。'},
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
  {person: '足利義満', deed: '室町幕府の3代将軍。南北朝を合一し、金閣（鹿苑寺）を建てる。日明貿易を開始。'},
  {person: '足利義政', deed: '室町幕府の8代将軍。後継者争いなどから応仁の乱が起こる。東山に銀閣（慈照寺）を建てる。'},
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
  {person: '大隈重信', deed: '佐賀藩（佐賀県）の出身。立憲改進党を結成。東京専門学校を設立。'},
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
  {person: '湯川秀樹', deed: '物理学者。1949年に日本人で初のノーベル賞を受賞。'},
  {person: '山上憶良', deed: '奈良時代の歌人。農民の生活をうたった「貧窮問答歌」が「万葉集」に収められる。'},
  {person: '運慶', deed: '鎌倉時代の仏師。東大寺南大門の金剛力士像を制作。'},
  {person: '雪舟', deed: '室町時代の僧侶。明にわたって絵を学び、帰国後、水墨画を大成。'},
  {person: '世阿弥', deed: '足利義満の保護を受けて、父の観阿弥とともに能を大成。'},
  {person: '千利休', deed: '堺の豪商で、茶道を大成。織田信長や豊臣秀吉に仕えた。'},
  {person: '井原西鶴', deed: '元禄文化を代表する作家。「世間胸算用」などの浮世草子を著す。'},
  {person: '松尾芭蕉', deed: '元禄時代の俳人で、俳諧を大成。紀行文の「おくのほそ道」など。'},
  {person: '近松門左衛門', deed: '元禄時代の浄瑠璃・歌舞伎の脚本家。代表作は「曽根崎心中」など。'},
  {person: '菱川師宣', deed: '元禄文化を代表する浮世絵師。代表作は「見返り美人図」。'},
  {person: '葛飾北斎', deed: '化政文化を代表する浮世絵師。風景画にすぐれ、「富嶽三十六景」などを描く。'},
  {person: '歌川広重', deed: '化政文化を代表する浮世絵師。「東海道五十三次」によって、風景画を大成する。'},
  {person: '十返舎一九', deed: '化政文化のころの作家。「東海道中膝栗毛」が代表作。'},
  {person: '行基', deed: '諸国をまわって社会事業につくす。東大寺の大仏づくりに協力。'},
  {person: '最澄', deed: '9世紀、唐から天台宗を伝え、比叡山に延暦寺を建てる。'},
  {person: '空海', deed: '9世紀、唐から真言宗を伝え、高野山に金剛峯寺を建てる。'},
  {person: '法然', deed: '比叡山で学んだ後、浄土宗を開く。ひたすら念仏をとなえれば救われると説く。'},
  {person: '親鸞', deed: '比叡山で学んだ後、法然の弟子となり、浄土真宗を開く。'},
  {person: '一遍', deed: '踊りながら念仏をとなえる踊り念仏により、時宗を広める。'},
  {person: '日蓮', deed: '日蓮宗を開く。「南無妙法蓮華経」の題目をとなえることを説く。'},
  {person: '栄西', deed: '宋から、禅宗の臨済宗を伝える。'},
  {person: '道元', deed: '宋から、禅宗の曹洞宗を伝える。'},
  {person: '釈迦', deed: '紀元前5世紀ごろ、仏教を開く。'},
  {person: 'イエス・キリスト', deed: '1世紀前半にキリスト教を開く。'},
  {person: 'ムハンマド', deed: '7世紀にイスラム教を開く。'},
  {person: '鑑真', deed: '唐の高僧。5度の失敗の後、753年に日本へ来るが、その間に失明。唐招提寺を建立。'},
  {person: 'フビライ・ハン', deed: '元の皇帝。2度にわたり日本を攻める。'},
  {person: 'マルコ・ポーロ', deed: 'イタリアの商人でフビライ・ハンに仕え、その体験を「東方見聞録」に残す。'},
  {person: 'フランシスコ・ザビエル', deed: 'スペイン人の宣教師。1549年、鹿児島に来て日本にキリスト教を伝える。'},
  {person: 'シャクシャイン', deed: '1669年、松前藩による不正な取り引きに反発し、アイヌの人々を率いて反乱を起こす。'},
  {person: 'シーボルト', deed: 'ドイツ人。長崎の出島におかれたオランダ商館の医師。鳴滝塾を開く。'},
  {person: 'リンカーン', deed: 'アメリカ大統領。民主政治を「人民の、人民による、人民のための政治」と表現した。'},
  {person: 'ペリー', deed: '1853年、黒船を率いて来航。日米和親条約を結ぶ。'},
  {person: 'ハリス', deed: '初代のアメリカ総領事。1858年、日米修好通商条約を結ぶ。'},
  {person: 'マッカーサー', deed: '連合国軍最高司令官。戦後の日本の占領政策をすすめた。'}
];

/* --- Global State --- */
let currentUser = null;
let localData = []; // OCR/User Manual Data
let currentSeries = 'year'; // 'year' or 'person'
let curMode = 'yearToEvent'; 
let currentStage = null;
let quizList = [];
let quizIndex = 0;
let quizScore = 0;
let playerHP = 5;
let playerMaxHP = 5;
let userXP = 0;
let userLv = 1;
let records = [];
let progress = {}; // { year: [s1, s2...], person: [s1, s2...] }

const STAGE_SIZE = 10;

/* --- UI Controls --- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${id}`).classList.add('active');
  document.getElementById(`tabBtn${id === 'guild' ? 1 : id === 'quest' ? 2 : 3}`).classList.add('active');
  if(id === 'records') renderRecords();
}

function setSeries(s) {
  currentSeries = s;
  document.getElementById('btnSeriesYear').classList.toggle('active', s === 'year');
  document.getElementById('btnSeriesPerson').classList.toggle('active', s === 'person');
  renderStageGrid();
}

function setMode(m, btn) {
  curMode = m;
  document.querySelectorAll('#tab-quest .btn-sm').forEach(b => {
    if(b.id.startsWith('modeBtn')) b.classList.remove('active');
  });
  btn.classList.add('active');
}

/* --- Logic: Stage & Quiz --- */
function renderStageGrid() {
  const grid = document.getElementById('stageGrid');
  grid.innerHTML = '';
  const data = currentSeries === 'year' ? YEAR_DATA : PERSON_DATA;
  const labels = currentSeries === 'year' ? YEAR_STAGE_LABELS : PERSON_STAGE_LABELS;
  const count = Math.ceil(data.length / STAGE_SIZE);
  
  const prog = progress[currentSeries] || [];

  for(let i=1; i<=count; i++) {
    const isLocked = i > 1 && !prog.includes(i-1);
    const label = labels[i-1] || `ST ${i}`;
    const btn = document.createElement('button');
    btn.className = 'btn-sm';
    btn.style.padding = '12px 0';
    btn.innerHTML = `${label}${prog.includes(i)?'<br>✅':''}`;
    if(isLocked) {
      btn.style.opacity = '0.4';
      btn.innerHTML = `${label}<br>🔒`;
    } else {
      btn.onclick = () => startStage(i);
    }
    grid.appendChild(btn);
  }
}

function startStage(num) {
  currentStage = num;
  const data = currentSeries === 'year' ? YEAR_DATA : PERSON_DATA;
  const start = (num - 1) * STAGE_SIZE;
  const items = data.slice(start, start + STAGE_SIZE);
  
  _prepareQuiz(items);
}

function startQuiz(mode) {
    const data = (localData.length > 0) ? localData : (currentSeries === 'year' ? YEAR_DATA : PERSON_DATA);
    if(data.length === 0) {
        showToast("データがありません");
        return;
    }
    currentStage = null;
    curMode = mode;
    _prepareQuiz(data.slice(0, 10)); // Just 10 random if manual
}

function _prepareQuiz(items) {
  quizList = items.map(it => {
    const type = curMode === 'random' ? (Math.random() > 0.5 ? 1 : 2) : (curMode === 'yearToEvent' ? 1 : 2);
    return { ...it, type };
  }).sort(() => Math.random() - 0.5);
  
  quizIndex = 0;
  quizScore = 0;
  playerHP = 5;
  document.getElementById('battleLog').innerHTML = '<div>バトル開始！</div>';
  updateBars();
  showScreen('screen-battle');
  renderQuestion();
}

function renderQuestion() {
  const q = quizList[quizIndex];
  document.getElementById('enemyHP').style.width = '100%';
  document.getElementById('battleBadge').textContent = currentStage ? `STAGE ${currentStage} - ${quizIndex+1}/10` : '特別試練';
  
  const qText = document.getElementById('battleQ');
  if (currentSeries === 'person') {
    qText.innerHTML = q.type === 1 
      ? `「${q.person}」は<br>何をした人物？`
      : `「${q.deed}」<br>この人物はだれ？`;
  } else {
    qText.innerHTML = q.type === 1
      ? `西暦 ${q.year}年<br>何が起きた？`
      : `「${q.event}」<br>西暦何年？`;
  }
  
  const input = document.getElementById('battleInput');
  input.value = '';
  input.disabled = false;
  input.type = (currentSeries === 'year' && q.type === 2) ? 'number' : 'text';
  input.focus();
  
  document.getElementById('btnAttack').style.display = 'block';
  document.getElementById('btnNext').style.display = 'none';
}

function checkAnswer() {
  const q = quizList[quizIndex];
  const ua = document.getElementById('battleInput').value.trim();
  let ok = false;
  
  if (currentSeries === 'person') {
    const target = q.type === 1 ? q.deed : q.person;
    ok = calculateSimilarity(target, ua) >= 0.4 || target.includes(ua) && ua.length >= 2;
  } else {
    if (q.type === 1) {
      // For events, if the answer is long but partially matches, or if it's a direct substring
      ok = calculateSimilarity(q.event, ua) >= 0.4 || q.event.includes(ua) && ua.length >= 2;
    } else {
      ok = Number(ua) === q.year;
    }
  }
  
  document.getElementById('btnAttack').style.display = 'none';
  document.getElementById('btnNext').style.display = 'block';
  document.getElementById('battleInput').disabled = true;
  
  if(ok) {
    quizScore++;
    addLog(`✨ 正解！`, 'green');
    document.getElementById('enemyHP').style.width = '0%';
  } else {
    playerHP--;
    addLog(`💥 ミス！ 正解は「${currentSeries === 'year' ? (q.type===1?q.event:q.year) : (q.type===1?q.deed:q.person)}」`, 'red');
    updateBars();
  }
  
  if(playerHP <= 0) {
    setTimeout(() => finishQuiz(false), 1000);
  }
}

function nextQuestion() {
  quizIndex++;
  if(quizIndex >= quizList.length) {
    finishQuiz(true);
  } else {
    renderQuestion();
  }
}

function finishQuiz(win) {
  const bonus = win ? quizScore * 10 : quizScore * 5;
  userXP += bonus;
  if(userXP >= userLv * 100) {
    userXP -= userLv * 100;
    userLv++;
    document.getElementById('lvUpArea').style.display = 'block';
  } else {
    document.getElementById('lvUpArea').style.display = 'none';
  }
  
  const d = new Date();
  records.unshift({
    date: `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`,
    series: currentSeries === 'year' ? '年号' : '人物',
    score: quizScore,
    win: win
  });
  if(records.length > 20) records.pop();

  if(win && quizScore === STAGE_SIZE && currentStage) {
    if(!progress[currentSeries]) progress[currentSeries] = [];
    if(!progress[currentSeries].includes(currentStage)) progress[currentSeries].push(currentStage);
  }
  saveLocal();

  if(win && quizScore === STAGE_SIZE && currentStage === Math.ceil((currentSeries==='year'?YEAR_DATA:PERSON_DATA).length/STAGE_SIZE)) {
    showCert();
  }
  
  document.getElementById('rTitle').textContent = win ? '勝利！' : '敗北...';
  document.getElementById('rsCorrect').textContent = quizScore;
  document.getElementById('rsWrong').textContent = quizList.length - quizScore;
  document.getElementById('rsXP').textContent = `+${bonus}`;
  
  updateBars();
  showScreen('screen-result');
}

/* --- UI Utilities --- */
function updateBars() {
  document.getElementById('headerLv').textContent = `Lv.${userLv}`;
  document.getElementById('headerXP').textContent = userXP;
  document.getElementById('headerXPBar').style.width = `${(userXP / (userLv*100)) * 100}%`;
  
  if(document.getElementById('screen-battle').classList.contains('active')) {
    document.getElementById('playerHP').style.width = `${(playerHP/playerMaxHP)*100}%`;
    document.getElementById('playerHPText').textContent = `HP ${playerHP}/${playerMaxHP}`;
  }
}

function addLog(msg, color) {
  const log = document.getElementById('battleLog');
  const d = document.createElement('div');
  d.style.color = color || 'white';
  d.textContent = msg;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

function showToast(m) {
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function showCert() {
  document.getElementById('certName').textContent = (currentUser ? currentUser.name : '冒険者') + ' 殿';
  document.getElementById('certDate').textContent = new Date().toLocaleDateString('ja-JP');
  document.getElementById('certOverlay').classList.add('active');
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function closeCert() {
  document.getElementById('certOverlay').classList.remove('active');
}

function goHome() {
  showScreen('screen-main');
  renderStageGrid();
}

/* --- Similarity (Simple character match) --- */
function calculateSimilarity(s1, s2) {
  if(!s1 || !s2) return 0;
  const v1 = s1.trim().replace(/[、。！？\s]/g, '');
  const v2 = s2.trim().replace(/[、。！？\s]/g, '');
  const set1 = new Set(v1);
  const set2 = new Set(v2);
  const common = [...set2].filter(x => set1.has(x)).length;
  return common / Math.max(1, v2.length); // How much of the user's answer is in the target
}

/* --- Storage & Auth --- */
function renderRecords() {
  const list = document.getElementById('recordsList');
  list.innerHTML = '';
  if(records.length === 0) { list.innerHTML = '<p style="text-align:center; opacity:0.5;">まだ記録がありません</p>'; return; }

  let totalClear = 0;
  let perfects = 0;
  let totalXP = 0; // Calculate from records if needed, or keep global

  records.forEach(r => {
    const div = document.createElement('div');
    div.className = 'data-item';
    div.innerHTML = `<span>[${r.date}] ${r.series}</span> <span>${r.score}/10 ${r.win?'⭕':'❌'}</span>`;
    list.appendChild(div);
    if(r.win) totalClear++;
    if(r.score === 10) perfects++;
  });

  document.getElementById('statTotal').textContent = totalClear;
  document.getElementById('statPerfect').textContent = perfects;
}

function saveLocal() {
    localStorage.setItem('hist_quiz_v2', JSON.stringify({ userLv, userXP, progress, records }));
}
function loadLocal() {
    const d = JSON.parse(localStorage.getItem('hist_quiz_v2') || '{}');
    if(d.userLv) userLv = d.userLv;
    if(d.userXP) userXP = d.userXP;
    if(d.progress) progress = d.progress;
    if(d.records) records = d.records;
}

function handleLogin(e) {
  e.preventDefault();
  // Simple Mock Auth
  currentUser = { name: '冒険者', id: 'guest' };
  showScreen('screen-main');
  renderStageGrid();
  updateBars();
}

function logout() {
  currentUser = null;
  showScreen('screen-auth');
}

function manualAdd() {
    const y = document.getElementById('manualYear').value;
    const e = document.getElementById('manualEvent').value;
    if(!y || !e) return;
    localData.push({ year: Number(y), event: e });
    document.getElementById('dataCount').textContent = localData.length;
    showToast("追加しました");
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
    loadLocal();
    showScreen('screen-auth'); 
    // Ensure cert is hidden initially
    document.getElementById('certOverlay').classList.remove('active');
});
