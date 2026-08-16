// LingoQuest Comprehensive Word Vault & Smart Dictionary with 120+ words, phonetics, hints, and examples
import { KO_TRANSLATIONS, KO_EXAMPLES } from "./words-ko";

export const CATEGORIES = [
  { id: "all", labelUz: "Barchasi", labelRu: "Все темы", labelEn: "All Topics", labelKo: "전체 주제", icon: "✨" },
  { id: "daily", labelUz: "Kundalik", labelRu: "Повседневное", labelEn: "Daily Life", labelKo: "일상생활", icon: "☕" },
  { id: "tech", labelUz: "IT & Texno", labelRu: "Технологии", labelEn: "Tech & AI", labelKo: "기술 & AI", icon: "💻" },
  { id: "food", labelUz: "Taomlar", labelRu: "Еда и напитки", labelEn: "Food & Drinks", labelKo: "음식 & 음료", icon: "🍕" },
  { id: "nature", labelUz: "Tabiat & Hayvonlar", labelRu: "Природа и животные", labelEn: "Nature & Animals", labelKo: "자연 & 동물", icon: "🌿" },
  { id: "travel", labelUz: "Sayohat", labelRu: "Путешествия", labelEn: "Travel & Places", labelKo: "여행 & 장소", icon: "✈️" },
  { id: "business", labelUz: "Biznes & Ish", labelRu: "Бизнес и карьера", labelEn: "Business & Work", labelKo: "비즈니스 & 직업", icon: "💼" },
  { id: "verbs", labelUz: "Harakat Fe'llari", labelRu: "Глаголы", labelEn: "Action Verbs", labelKo: "동사", icon: "⚡" },
  { id: "emotions", labelUz: "Hissiyotlar", labelRu: "Эмоции и чувства", labelEn: "Emotions", labelKo: "감정", icon: "🧠" },
  { id: "idioms", labelUz: "Iboralar (Idioms)", labelRu: "Идиомы и фразы", labelEn: "Idioms & Slang", labelKo: "관용구 & 속어", icon: "💡" },
];

/**
 * Pick the localized label for an object that has labelUz / labelRu / labelEn / labelKo
 */
export function localizedLabel(obj, lang) {
  if (!obj) return "";
  if (lang === "ru") return obj.labelRu || obj.labelUz;
  if (lang === "en") return obj.labelEn || obj.labelRu || obj.labelUz;
  if (lang === "ko") return obj.labelKo || obj.labelEn || obj.labelRu || obj.labelUz;
  return obj.labelUz;
}

export const WORD_BANK = [
  // --- Daily Life & Essentials ---
  { en: "Book", ru: "Книга", uz: "Kitob", ipa: "/bʊk/", category: "daily", hintUz: "O'qish uchun mo'ljallangan varaqlardan iborat manba", hintRu: "Печатное или рукописное издание", exampleEn: "I love reading an inspiring book.", exampleUz: "Ilhomlantiruvchi kitob o'qishni yaxshi ko'raman.", exampleRu: "Я люблю читать вдохновляющую книгу." },
  { en: "Friend", ru: "Друг", uz: "Do'st", ipa: "/frend/", category: "daily", hintUz: "Sizga eng yaqin va sirdosh inson", hintRu: "Близкий и надежный человек", exampleEn: "A loyal friend is a rare treasure.", exampleUz: "Sodiq do'st — bebaho xazina.", exampleRu: "Верный друг — редкое сокровище." },
  { en: "Family", ru: "Семья", uz: "Oila", ipa: "/ˈfæm.əl.i/", category: "daily", hintUz: "Ota-ona, farzandlar va yaqinlar jamiyati", hintRu: "Группа близких родственников", exampleEn: "Family always supports you.", exampleUz: "Oila har doim sizni qo'llab-quvvatlaydi.", exampleRu: "Семья всегда поддерживает тебя." },
  { en: "House", ru: "Дом / Здание", uz: "Uy / Xonadon", ipa: "/haʊs/", category: "daily", hintUz: "Odamlar yashaydigan bino yoki xonadon", hintRu: "Здание для жилья", exampleEn: "They built a modern eco-friendly house.", exampleUz: "Ular zamonaviy ekologik uy qurdilar.", exampleRu: "Они построили современный экологичный дом." },
  { en: "Time", ru: "Время", uz: "Vaqt", ipa: "/taɪm/", category: "daily", hintUz: "Soat va daqiqalar bilan o'lchanadigan o'lchov", hintRu: "Непрерывное течение событий", exampleEn: "Time is our most valuable asset.", exampleUz: "Vaqt — bizning eng qimmatli boyligimiz.", exampleRu: "Время — наш самый ценный актив." },
  { en: "Morning", ru: "Утро", uz: "Ertalab / Tong", ipa: "/ˈmɔːr.nɪŋ/", category: "daily", hintUz: "Kunning boshlang'ich va quyosh chiqadigan qismi", hintRu: "Начало дня, рассвет", exampleEn: "Morning sunshine gives great energy.", exampleUz: "Ertalabki quyosh nuri ajoyib energiya beradi.", exampleRu: "Утренний солнечный свет дает отличную энергию." },
  { en: "Night", ru: "Ночь", uz: "Tun / Kecha", ipa: "/naɪt/", category: "daily", hintUz: "Qorong'u tushadigan va uxlash vaqti", hintRu: "Темное время суток", exampleEn: "The starry night sky is breathtaking.", exampleUz: "Yulduzli tungi osmon kishini hayratga soladi.", exampleRu: "Звездное ночное небо захватывает дух." },
  { en: "Music", ru: "Музыка", uz: "Musiqa / Kuy", ipa: "/ˈmjuː.zɪk/", category: "daily", hintUz: "Ohanglar va kuylar san'ati", hintRu: "Искусство звуков и гармонии", exampleEn: "Music calms the mind and inspires.", exampleUz: "Musiqa ongni tinchlantiradi va ilhom beradi.", exampleRu: "Музыка успокаивает разум и вдохновляет." },
  { en: "Game", ru: "Игра", uz: "O'yin", ipa: "/ɡeɪm/", category: "daily", hintUz: "Qiziqarli musobaqa yoki ko'ngilochar mashg'ulot", hintRu: "Развлекательное соревнование", exampleEn: "This English learning game is so engaging!", exampleUz: "Bu ingliz tili o'yini juda qiziqarli!", exampleRu: "Эта обучающая игра на английском такая увлекательная!" },
  { en: "School", ru: "Школа", uz: "Maktab", ipa: "/skuːl/", category: "daily", hintUz: "Bolalar ta'lim oladigan dargoh", hintRu: "Учебное заведение для детей", exampleEn: "Knowledge starts at school.", exampleUz: "Bilim maktabdan boshlanadi.", exampleRu: "Знания начинаются со школы." },
  { en: "Teacher", ru: "Учитель", uz: "O'qituvchi / Ustoz", ipa: "/ˈtiː.tʃər/", category: "daily", hintUz: "Dars beruvchi va yo'l ko'rsatuvchi murabbiy", hintRu: "Человек, передающий знания", exampleEn: "A great teacher inspires curiosity.", exampleUz: "Buyuk ustoz qiziquvchanlikni uyg'otadi.", exampleRu: "Великий учитель пробуждает любознательность." },
  { en: "Money", ru: "Деньги", uz: "Pul / Mablag'", ipa: "/ˈmʌn.i/", category: "daily", hintUz: "Xaridlarni to'lash vositasi", hintRu: "Средство оплаты товаров и услуг", exampleEn: "Smart budgeting saves money.", exampleUz: "Oqilona byudjet pulni tejaydi.", exampleRu: "Разумное планирование экономит деньги." },

  // --- Tech & AI ---
  { en: "Computer", ru: "Компьютер", uz: "Kompyuter", ipa: "/kəmˈpjuː.tər/", category: "tech", hintUz: "Ma'lumotlar bilan ishlovchi elektron qurilma", hintRu: "Электронно-вычислительная машина", exampleEn: "I code algorithms on my computer.", exampleUz: "Men kompyuterimda algoritmlar yozaman.", exampleRu: "Я пишу алгоритмы на своем компьютере." },
  { en: "Artificial Intelligence", ru: "Искусственный интеллект", uz: "Sun'iy intellekt", ipa: "/ˌɑːr.t̬əˈfɪʃ.əl ɪnˈtel.ə.dʒəns/", category: "tech", hintUz: "Mashinalarning insondek fikrlash texnologiyasi (AI)", hintRu: "Технология машинного мышления (ИИ)", exampleEn: "Artificial Intelligence is transforming our world.", exampleUz: "Sun'iy intellekt dunyomizni o'zgartirmoqda.", exampleRu: "Искусственный интеллект меняет наш мир." },
  { en: "Algorithm", ru: "Алгоритм", uz: "Algoritm", ipa: "/ˈæl.ɡə.rɪð.əm/", category: "tech", hintUz: "Masalani yechish ketma-ketligi va qoidalari", hintRu: "Последовательность шагов для решения задачи", exampleEn: "Fast search algorithms optimize speed.", exampleUz: "Tezkor qidiruv algoritmlari tezlikni oshiradi.", exampleRu: "Быстрые алгоритмы поиска оптимизируют скорость." },
  { en: "Database", ru: "База данных", uz: "Ma'lumotlar bazasi", ipa: "/ˈdeɪ.tə.beɪs/", category: "tech", hintUz: "Ma'lumotlar saqlanadigan tartiblangan tizim", hintRu: "Организованное хранилище информации", exampleEn: "PostgreSQL is a powerful relational database.", exampleUz: "PostgreSQL — kuchli relyatsion ma'lumotlar bazasi.", exampleRu: "PostgreSQL — мощная реляционная база данных." },
  { en: "Network", ru: "Сеть", uz: "Tarmoq", ipa: "/ˈnet.wɜːrk/", category: "tech", hintUz: "Qurilmalarni bir-biriga bog'lovchi tizim", hintRu: "Система соединенных устройств", exampleEn: "Cloud servers rely on ultra-fast network.", exampleUz: "Bulutli serverlar yuqori tezlikdagi tarmoqqa tayanadi.", exampleRu: "Облачные серверы зависят от сверхбыстрой сети." },
  { en: "Software", ru: "Программное обеспечение", uz: "Dasturiy ta'minot / Dastur", ipa: "/ˈsɑːft.wer/", category: "tech", hintUz: "Kompyuterda ishlaydigan ilovalar va kodlar", hintRu: "Программы и приложения", exampleEn: "Modern software must be user-friendly.", exampleUz: "Zamonaviy dastur foydalanuvchiga qulay bo'lishi kerak.", exampleRu: "Современное ПО должно быть удобным." },
  { en: "Developer", ru: "Разработчик / Программист", uz: "Dasturchi / Ishlab chiquvchi", ipa: "/dɪˈvel.ə.pər/", category: "tech", hintUz: "Dastur va veb-saytlar yaratuvchi mutaxassis", hintRu: "Создатель программных решений", exampleEn: "He works as a Senior Frontend Developer.", exampleUz: "U Senior Frontend dasturchi sifatida ishlaydi.", exampleRu: "Он работает Senior Frontend разработчиком." },
  { en: "Security", ru: "Безопасность", uz: "Xavfsizlik", ipa: "/səˈkjʊr.ə.t̬i/", category: "tech", hintUz: "Kiberhujumlardan himoya va ishonchlilik", hintRu: "Защищенность от угроз и взлома", exampleEn: "Cybersecurity protects confidential user data.", exampleUz: "Kiberxavfsizlik foydalanuvchi ma'lumotlarini himoya qiladi.", exampleRu: "Кибербезопасность защищает конфиденциальные данные." },
  { en: "Cloud", ru: "Облако / Облачные сервисы", uz: "Bulutli xizmatlar (Cloud)", ipa: "/klaʊd/", category: "tech", hintUz: "Internet orqali taqdim etiladigan server xizmatlari", hintRu: "Удаленные серверные хранилища", exampleEn: "We deploy our web apps to the cloud.", exampleUz: "Biz veb-ilovalarimizni bulutga joylashtiramiz.", exampleRu: "Мы развертываем веб-приложения в облаке." },
  { en: "Interface", ru: "Интерфейс", uz: "Interfeys / Tashqi ko'rinish", ipa: "/ˈɪn.t̬ɚ.feɪs/", category: "tech", hintUz: "Foydalanuvchi va dastur o'rtasidagi ko'rinish", hintRu: "Внешний вид и взаимодействие программы", exampleEn: "Clean user interface improves UX dramatically.", exampleUz: "Toza interfeys foydalanish qulayligini oshiradi.", exampleRu: "Чистый интерфейс значительно улучшает опыт." },

  // --- Food & Drinks ---
  { en: "Apple", ru: "Яблоко", uz: "Olma", ipa: "/ˈæp.əl/", category: "food", hintUz: "Shirin va qarsildoq mashhur meva", hintRu: "Популярный круглый фрукт", exampleEn: "An apple a day keeps the doctor away.", exampleUz: "Kuniga bitta olma salomatlik garovidir.", exampleRu: "Яблоко в день избавит от врачей." },
  { en: "Water", ru: "Вода", uz: "Suv", ipa: "/ˈwɔː.tər/", category: "food", hintUz: "Hayot uchun eng zarur shaffof suyuqlik", hintRu: "Прозрачная жидкость, основа жизни", exampleEn: "Stay hydrated by drinking pure water.", exampleUz: "Toza suv ichib organizmni tetik saqlang.", exampleRu: "Поддерживайте водный баланс чистой водой." },
  { en: "Bread", ru: "Хлеб", uz: "Non", ipa: "/bred/", category: "food", hintUz: "Undan yopiladigan dasturxon ko'rki", hintRu: "Выпечка из муки, основа стола", exampleEn: "Freshly baked bread smells amazing.", exampleUz: "Yangi tandir nonining hidi ajoyib.", exampleRu: "Свежеиспеченный хлеб пахнет изумительно." },
  { en: "Milk", ru: "Молоко", uz: "Sut", ipa: "/mɪlk/", category: "food", hintUz: "Sigir yoki echkidan olinadigan oq suyuqlik", hintRu: "Белый питательный напиток", exampleEn: "Warm milk with honey helps you sleep.", exampleUz: "Asal qo'shilgan iliq sut uyquni yaxshilaydi.", exampleRu: "Теплое молоко с медом помогает уснуть." },
  { en: "Coffee", ru: "Кофе", uz: "Qahva / Kofe", ipa: "/ˈkɒf.i/", category: "food", hintUz: "Ertalab tetiklashtiruvchi xushbo'y ichimlik", hintRu: "Ароматный бодрящий напиток", exampleEn: "Espresso is a strong black coffee.", exampleUz: "Espresso — kuchli qora qahva.", exampleRu: "Эспрессо — крепкий черный кофе." },
  { en: "Tea", ru: "Чай", uz: "Choy", ipa: "/tiː/", category: "food", hintUz: "O'zbek xalqining eng sevimli issiq ichimligi", hintRu: "Традиционный горячий настой", exampleEn: "Green tea boosts metabolism and focus.", exampleUz: "Ko'k choy moddalar almashinuvini yaxshilaydi.", exampleRu: "Зеленый чай ускоряет метаболизм и фокус." },
  { en: "Honey", ru: "Мёд", uz: "Asal", ipa: "/ˈhʌn.i/", category: "food", hintUz: "Asalarilar to'playdigan tabiiy shirin shifo", hintRu: "Сладкий продукт пчеловодства", exampleEn: "Natural honey never spoils.", exampleUz: "Tabiiy asal hech qachon buzilmaydi.", exampleRu: "Натуральный мед никогда не портится." },
  { en: "Fruit", ru: "Фрукт", uz: "Meva", ipa: "/fruːt/", category: "food", hintUz: "Daraxt va butalarda pishadigan shirin ne'mat", hintRu: "Сочный сладкий плод растений", exampleEn: "Fresh fruits provide essential vitamins.", exampleUz: "Yangi mevalar zarur vitaminlarni yetkazadi.", exampleRu: "Свежие фрукты содержат важные витамины." },
  { en: "Vegetable", ru: "Овощ", uz: "Sabzavot", ipa: "/ˈvedʒ.tə.bəl/", category: "food", hintUz: "Sabzi, bodring, pomidor kabi o'simlik mahsulotlari", hintRu: "Растительная огородная пища", exampleEn: "Eating green vegetables strengthens immunity.", exampleUz: "Ko'kat va sabzavotlar immunitetni kuchaytiradi.", exampleRu: "Зеленые овощи укрепляют иммунитет." },
  { en: "Cheese", ru: "Сыр", uz: "Pishloq / Sir", ipa: "/tʃiːz/", category: "food", hintUz: "Sutdan tayyorlanadigan mazali mahsulot", hintRu: "Кисломолочный твердый продукт", exampleEn: "Melted cheese makes pizza delicious.", exampleUz: "Eritilgan pishloq pitsani mazali qiladi.", exampleRu: "Расплавленный сыр делает пиццу вкусной." },
  { en: "Rice", ru: "Рис", uz: "Guruch / Osh", ipa: "/raɪs/", category: "food", hintUz: "Palovning asosiy masallig'i", hintRu: "Крупа, основа для плова", exampleEn: "Rice is the main ingredient of national pilaf.", exampleUz: "Guruch — milliy palovning asosiy tarkibi.", exampleRu: "Рис — главный ингредиент плова." },
  { en: "Meat", ru: "Мясо", uz: "Go'sht", ipa: "/miːt/", category: "food", hintUz: "Protein va oqsilga boy ozuqa", hintRu: "Белковый продукт животного происхождения", exampleEn: "Lean meat provides rich protein.", exampleUz: "Yog'siz go'sht ko'p oqsil beradi.", exampleRu: "Нежирное мясо дает много белка." },

  // --- Nature & Animals ---
  { en: "Sun", ru: "Солнце", uz: "Quyosh", ipa: "/sʌn/", category: "nature", hintUz: "Yer yuzini yorituvchi va isituvchi yulduz", hintRu: "Центральная звезда нашей системы", exampleEn: "The morning sun fills the room with light.", exampleUz: "Ertalabki quyosh xonani nurga to'ldiradi.", exampleRu: "Утреннее солнце наполняет комнату светом." },
  { en: "Moon", ru: "Луна", uz: "Oy", ipa: "/muːn/", category: "nature", hintUz: "Tunda osmonda porlovchi Yer yo'ldoshi", hintRu: "Спутник Земли на ночном небе", exampleEn: "The full moon shines brightly in the sky.", exampleUz: "To'lin oy osmonda charog'on porlamoqda.", exampleRu: "Полная луна ярко светит в небе." },
  { en: "Star", ru: "Звезда", uz: "Yulduz", ipa: "/stɑːr/", category: "nature", hintUz: "Koinotda miltillab yonuvchi osmon jismi", hintRu: "Небесное светящееся тело", exampleEn: "Millions of stars illuminate the galaxy.", exampleUz: "Millionlab yulduzlar galaktikani yoritadi.", exampleRu: "Миллионы звезд освещают галактику." },
  { en: "Dog", ru: "Собака", uz: "It", ipa: "/dɒɡ/", category: "nature", hintUz: "Insonning eng vafodor to'rt oyoqli do'sti", hintRu: "Преданный домашний питомец", exampleEn: "The dog wagged its tail happily.", exampleUz: "It xursand bo'lib dumini likillatdi.", exampleRu: "Собака радостно виляла хвостом." },
  { en: "Cat", ru: "Кошка", uz: "Mushuk", ipa: "/kæt/", category: "nature", hintUz: "Miyovlaydigan va erkalanishni yoqtiradigan uy hayvoni", hintRu: "Пушистый мурлыкающий питомец", exampleEn: "The cat was napping in the warm sun.", exampleUz: "Mushuk issiq quyoshda mudrab yotgan edi.", exampleRu: "Кошка дремала на теплом солнышке." },
  { en: "Bird", ru: "Птица", uz: "Qush", ipa: "/bɜːrd/", category: "nature", hintUz: "Qanotlari bor va osmonda uchuvchi jonivor", hintRu: "Пернатое летающее существо", exampleEn: "Early birds sing cheerful melodies.", exampleUz: "Qushlar ertalab quvnoq kuylar kuylaydi.", exampleRu: "Птицы поют веселые мелодии по утрам." },
  { en: "Tree", ru: "Дерево", uz: "Daraxt", ipa: "/triː/", category: "nature", hintUz: "Barglari, tanasi va ildizi bor ko'p yillik o'simlik", hintRu: "Многолетнее растение со стволом", exampleEn: "Planting a tree creates oxygen for future generations.", exampleUz: "Daraxt ekish kelajak avlod uchun kislorod yaratadi.", exampleRu: "Посадка дерева дает кислород будущим поколениям." },
  { en: "Flower", ru: "Цветок", uz: "Gul", ipa: "/ˈflaʊ.ər/", category: "nature", hintUz: "Chiroyli ochiladigan va xushbo'y hid taratadigan o'simlik", hintRu: "Цветущее ароматное растение", exampleEn: "Red roses are symbols of love.", exampleUz: "Qizil atirgullar mehr va sevgi ramzidir.", exampleRu: "Красные розы — символ любви." },
  { en: "Mountain", ru: "Гора", uz: "Tog'", ipa: "/ˈmaʊn.tɪn/", category: "nature", hintUz: "Yer yuzasidan baland ko'tarilgan qoyali cho'qqi", hintRu: "Высокая возвышенность земной коры", exampleEn: "Snow peaks on the mountain look majestic.", exampleUz: "Tog'dagi qorli cho'qqilar muhtasham ko'rinadi.", exampleRu: "Снежные вершины на горе выглядят величественно." },
  { en: "River", ru: "Река", uz: "Daryo / Soy", ipa: "/ˈrɪv.ər/", category: "nature", hintUz: "Oqib turuvchi tabiiy suv oqimi", hintRu: "Постоянный природный водный поток", exampleEn: "The crystal clear river flows into the sea.", exampleUz: "Musaffo daryo dengizga quyiladi.", exampleRu: "Кристально чистая река впадает в море." },
  { en: "Ocean", ru: "Океан", uz: "Okean", ipa: "/ˈoʊ.ʃən/", category: "nature", hintUz: "Qit'alarni o'rab turuvchi ulkan sho'r suv havzasi", hintRu: "Крупнейший водный бассейн планеты", exampleEn: "The Pacific is the largest ocean on Earth.", exampleUz: "Tinch okeani Yer yuzidagi eng katta okeandir.", exampleRu: "Тихий океан — крупнейший океан на Земле." },
  { en: "Rain", ru: "Дождь", uz: "Yomg'ir", ipa: "/reɪn/", category: "nature", hintUz: "Bulutlardan yog'adigan suv tomchilari", hintRu: "Атмосферные осадки в виде капель", exampleEn: "Warm spring rain brings flowers to bloom.", exampleUz: "Iliq bahor yomg'iri gullarni ochiltiradi.", exampleRu: "Теплый весенний дождь заставляет цветы распускаться." },
  { en: "Wind", ru: "Ветер", uz: "Shamol / Sabo", ipa: "/wɪnd/", category: "nature", hintUz: "Havoning harakatlanishi va esishi", hintRu: "Движение воздушных масс", exampleEn: "A gentle cool wind refreshed the evening.", exampleUz: "Muloyim salqin shamol oqshomni xushnud etdi.", exampleRu: "Нежный прохладный ветер освежил вечер." },

  // --- Travel & Places ---
  { en: "City", ru: "Город", uz: "Shahar", ipa: "/ˈsɪt.i/", category: "travel", hintUz: "Katta aholi punkti, binolar va ko'chalar markazi", hintRu: "Крупный населенный пункт", exampleEn: "Tashkent is a modern ancient city.", exampleUz: "Toshkent — zamonaviy va qadimiy shahar.", exampleRu: "Ташкент — современный древний город." },
  { en: "Airport", ru: "Аэропорт", uz: "Aeroport / Tayyoragoh", ipa: "/ˈeə.pɔːt/", category: "travel", hintUz: "Samolyotlar uchadigan va qo'nadigan joy", hintRu: "Авиационный транспортный узел", exampleEn: "We arrived at the international airport early.", exampleUz: "Biz xalqaro aeroportga erta yetib keldik.", exampleRu: "Мы прибыли в международный аэропорт пораньше." },
  { en: "Hotel", ru: "Отель / Гостиница", uz: "Mehmonxona", ipa: "/hoʊˈtel/", category: "travel", hintUz: "Sayohatchilar tunab qoladigan qulay maskan", hintRu: "Место для временного проживания туристов", exampleEn: "The hotel room has a breathtaking sea view.", exampleUz: "Mehmonxona xonasi ajoyib dengiz manzarasiga ega.", exampleRu: "Номер в отеле имеет захватывающий вид на море." },
  { en: "Passport", ru: "Паспорт", uz: "Pasport", ipa: "/ˈpæs.pɔːrt/", category: "travel", hintUz: "Chet elga chiqishda shaxsni tasdiqlovchi rasmiy hujjat", hintRu: "Главный документ, удостоверяющий личность", exampleEn: "Keep your passport safe during travel.", exampleUz: "Sayohat paytida pasportingizni ehtiyot qiling.", exampleRu: "Берегите свой паспорт во время путешествий." },
  { en: "Journey", ru: "Путешествие", uz: "Sayohat / Safar", ipa: "/ˈdʒɜː.ni/", category: "travel", hintUz: "Uzoq masofaga qilingan qiziqarli safar", hintRu: "Длительная увлекательная поездка", exampleEn: "Every great journey begins with a single step.", exampleUz: "Har bir ulkan sayohat birinchi qadamdan boshlanadi.", exampleRu: "Каждое великое путешествие начинается с одного шага." },
  { en: "Ticket", ru: "Билет", uz: "Chipta / Bilet", ipa: "/ˈtɪk.ɪt/", category: "travel", hintUz: "Poyezd, samolyot yoki kinoga kirish ruxsatnomasi", hintRu: "Документ на проезд или посещение", exampleEn: "I booked a flight ticket online.", exampleUz: "Men onlayn samolyot chiptasini sotib oldim.", exampleRu: "Я забронировал авиабилет онлайн." },
  { en: "Bridge", ru: "Мост", uz: "Ko'prik", ipa: "/brɪdʒ/", category: "travel", hintUz: "Daryo yoki yo'l ustidan o'tkazilgan inshoot", hintRu: "Сооружение через реку или препятствие", exampleEn: "The illuminated bridge glows in the night.", exampleUz: "Yoritilgan ko'prik tunda charog'on porlaydi.", exampleRu: "Освещенный мост сияет в темноте." },

  // --- Business & Work ---
  { en: "Success", ru: "Успех", uz: "Muvaffaqiyat / Zafar", ipa: "/səkˈses/", category: "business", hintUz: "Qattiq mehnat natijasida erishilgan yutuq", hintRu: "Достижение поставленных целей", exampleEn: "Hard work and learning lead to real success.", exampleUz: "Mehnat va bilim haqiqiy muvaffaqiyatga olib keladi.", exampleRu: "Упорный труд и учеба ведут к настоящему успеху." },
  { en: "Goal", ru: "Цель", uz: "Maqsad / Niyat", ipa: "/ɡoʊl/", category: "business", hintUz: "Erishmoqchi bo'lgan narsa yoki reja", hintRu: "Желаемый конечный результат", exampleEn: "Set clear goals and work every day.", exampleUz: "Aniq maqsadlar qo'ying va har kuni harakat qiling.", exampleRu: "Ставьте четкие цели и работайте каждый день." },
  { en: "Leader", ru: "Лидер / Руководитель", uz: "Lider / Yetakchi", ipa: "/ˈliː.dər/", category: "business", hintUz: "Jamoani oldinga boshlovchi va ilhomlantiruvchi inson", hintRu: "Человек, ведущий команду вперед", exampleEn: "A visionary leader empowers the team.", exampleUz: "Keng fikrli yetakchi o'z jamoasini ruhlantiradi.", exampleRu: "Мудрый лидер вдохновляет свою команду." },
  { en: "Project", ru: "Проект", uz: "Loyiha", ipa: "/ˈprɑː.dʒekt/", category: "business", hintUz: "Bajarilishi kerak bo'lgan katta vazifa yoki ish", hintRu: "Запланированное предприятие или задача", exampleEn: "We launched an innovative AI project.", exampleUz: "Biz innovatsion sun'iy intellekt loyihasini ishga tushirdik.", exampleRu: "Мы запустили инновационный проект в сфере ИИ." },
  { en: "Strategy", ru: "Стратегия", uz: "Strategiya / Reja", ipa: "/ˈstræt̬.ə.dʒi/", category: "business", hintUz: "G'alabaga erishish uchun tuzilgan uzoq muddatli reja", hintRu: "Долгосрочный план победы или развития", exampleEn: "A smart marketing strategy boosts growth.", exampleUz: "Oqilona marketing strategiyasi o'sishni ta'minlaydi.", exampleRu: "Умная маркетинговая стратегия ускоряет рост." },

  // --- Action Verbs ---
  { en: "Learn", ru: "Учить / Изучать", uz: "O'rganmoq / O'qimoq", ipa: "/lɜːrn/", category: "verbs", hintUz: "Yangi bilim va ko'nikma hosil qilmoq", hintRu: "Приобретать знания и навыки", exampleEn: "You can learn anything with continuous practice.", exampleUz: "Muntazam amaliyot bilan xohlagan narsani o'rganish mumkin.", exampleRu: "Можно выучить все что угодно при постоянной практике." },
  { en: "Create", ru: "Создавать / Творить", uz: "Yaratmoq / Ixtiro qilmoq", ipa: "/kriˈeɪt/", category: "verbs", hintUz: "Yangi loyiha, san'at yoki narsa vujudga keltirmoq", hintRu: "Производить нечто новое и уникальное", exampleEn: "Creativity lets you create amazing things.", exampleUz: "Ijodkorlik ajoyib narsalar yaratishga imkon beradi.", exampleRu: "Креативность позволяет создавать удивительные вещи." },
  { en: "Speak", ru: "Говорить / Разговаривать", uz: "Gapirmoq / So'zlamoq", ipa: "/spiːk/", category: "verbs", hintUz: "So'zlar orqali fikr bildirmoq", hintRu: "Выражать мысли словами вслух", exampleEn: "Practice speaking English aloud every day.", exampleUz: "Har kuni ingliz tilida ovoz chiqarib gapirishni mashq qiling.", exampleRu: "Практикуйтесь говорить по-английски вслух каждый день." },
  { en: "Think", ru: "Думать / Мыслить", uz: "O'ylamoq / Fikrlamoq", ipa: "/θɪŋk/", category: "verbs", hintUz: "Aql va ong orqali mulohaza yuritmoq", hintRu: "Размышлять и рассуждать", exampleEn: "Think critically and solve complex problems.", exampleUz: "Tanqidiy fikrlang va murakkab masalalarni yeching.", exampleRu: "Мыслите критически и решайте сложные задачи." },
  { en: "Improve", ru: "Улучшать / Совершенствовать", uz: "Rivojlantirmoq / Yaxshilamoq", ipa: "/ɪmˈpruːv/", category: "verbs", hintUz: "Biror narsaning sifatini oshirmoq", hintRu: "Делать качественнее и лучше", exampleEn: "Consistent habits improve your memory.", exampleUz: "Muntazam odatlar xotirangizni yaxshilaydi.", exampleRu: "Постоянные привычки улучшают память." },
  { en: "Win", ru: "Побеждать / Выигрывать", uz: "G'alaba qozonmoq / Yutmoq", ipa: "/wɪn/", category: "verbs", hintUz: "Musobaqada birinchi bo'lmoq", hintRu: "Одерживать победу в соревновании", exampleEn: "Champions train hard to win the championship.", exampleUz: "Chempionlar g'alaba qozonish uchun tinimsiz shug'ullanadilar.", exampleRu: "Чемпионы упорно тренируются, чтобы победить." },

  // --- Emotions & Traits ---
  { en: "Happy", ru: "Счастливый / Радостный", uz: "Baxtli / Xursand", ipa: "/ˈhæp.i/", category: "emotions", hintUz: "Quvonch va shodlikka to'la holat", hintRu: "Чувствующий глубокую радость", exampleEn: "I feel happy when I achieve my daily goals.", exampleUz: "Kunlik maqsadlarimga erishganimda baxtli his qilaman.", exampleRu: "Я счастлив, когда достигаю ежедневных целей." },
  { en: "Brave", ru: "Храбрый / Смелый", uz: "Jasur / Botir", ipa: "/breɪv/", category: "emotions", hintUz: "Qo'rqmaydigan, qat'iyatli inson", hintRu: "Не боящийся трудностей и опасностей", exampleEn: "Be brave enough to try new challenges.", exampleUz: "Yangi sinovlarni boshlash uchun jasur bo'ling.", exampleRu: "Будь смелым, чтобы пробовать новые вызовы." },
  { en: "Smart", ru: "Умный / Сообразительный", uz: "Aqlli / Zukko", ipa: "/smɑːrt/", category: "emotions", hintUz: "Tez tushunadigan va zakovatli", hintRu: "Обладающий острым умом", exampleEn: "Smart learning strategies save hours of time.", exampleUz: "Zukko ta'lim strategiyalari soatlab vaqtni tejaydi.", exampleRu: "Умные стратегии обучения экономят часы времени." },
  { en: "Kind", ru: "Добрый / Отзывчивый", uz: "Mehribon / Oqko'ngil", ipa: "/kaɪnd/", category: "emotions", hintUz: "Boshqalarga yaxshilik qiluvchi samimiy inson", hintRu: "Проявляющий заботу и теплоту к людям", exampleEn: "Kind words brighten someone's entire day.", exampleUz: "Mehribon so'zlar kimningdir butun kunini yoritadi.", exampleRu: "Добрые слова озаряют чей-то целый день." },
  { en: "Strong", ru: "Сильный / Крепкий", uz: "Kuchli / Baquvvat", ipa: "/strɔːŋ/", category: "emotions", hintUz: "Jismoniy yoki ruhiy jihatdan qudratli", hintRu: "Обладающий большой мощью и волей", exampleEn: "A strong mindset overcomes any obstacle.", exampleUz: "Kuchli iroda har qanday to'siqni yengib o'tadi.", exampleRu: "Сильный настрой преодолевает любые препятствия." },

  // --- Idioms & Popular Slang ---
  { en: "Piece of cake", ru: "Проще простого / Легкотня", uz: "Juda oson / Suv ichgandek oson", ipa: "/piːs əv keɪk/", category: "idioms", hintUz: "Juda yengil va oson bajariladigan ish", hintRu: "Очень легкое и простое дело", exampleEn: "This English quiz was a piece of cake!", exampleUz: "Bu ingliz tili viktorinasi juda oson bo'ldi!", exampleRu: "Этот тест по английскому был проще простого!" },
  { en: "Break a leg", ru: "Ни пуха ни пера / Удачи!", uz: "Omad yor bo'lsin!", ipa: "/breɪk ə leɡ/", category: "idioms", hintUz: "Imtihon yoki chiqishdan oldin omad tilash", hintRu: "Пожелание удачи перед выступлением", exampleEn: "You are going on stage? Break a leg!", exampleUz: "Sahnaga chiqyapsanmi? Omad yor bo'lsin!", exampleRu: "Выходишь на сцену? Ни пуха ни пера!" },
  { en: "Hit the books", ru: "Сесть за учебу / Зубрить", uz: "Dars qilishga kirishmoq", ipa: "/hɪt ðə bʊks/", category: "idioms", hintUz: "Imtihonga jiddiy tayyorgarlik ko'rishni boshlamoq", hintRu: "Усердно учиться к экзамену", exampleEn: "I need to hit the books before my IELTS exam.", exampleUz: "IELTS imtihonimdan oldin jiddiy dars qilishim kerak.", exampleRu: "Мне нужно сесть за учебу перед экзаменом IELTS." },
  { en: "Once in a blue moon", ru: "В кои-то веки / Очень редко", uz: "Juda kamdan-kam / Yilda bir", ipa: "/wʌns ɪn ə bluː muːn/", category: "idioms", hintUz: "Juda kam uchraydigan voqea", hintRu: "Крайне редкое событие", exampleEn: "He visits his hometown once in a blue moon.", exampleUz: "U o'z qishlog'iga juda kamdan-kam boradi.", exampleRu: "Он навещает родной город в кои-то веки." },
  { en: "Under the weather", ru: "Нездоровится / Приболел", uz: "Biroz tobi qochmoq", ipa: "/ˈʌn.dɚ ðə ˈweð.ɚ/", category: "idioms", hintUz: "O'zini biroz noxush yoki shamollagan his qilmoq", hintRu: "Плохо себя чувствовать, приболеть", exampleEn: "I felt a bit under the weather yesterday.", exampleUz: "Kecha biroz tobim qochgan edi.", exampleRu: "Вчера мне немного нездоровилось." },
];

// Merge Korean translations & examples into every word (leaves en/ru/uz untouched)
for (const w of WORD_BANK) {
  w.ko = KO_TRANSLATIONS[w.en] || w.uz;
  w.exampleKo = KO_EXAMPLES[w.en] || w.exampleEn;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick questionCount random words for a round, optionally filtered by category */
export function pickRoundWords(questionCount = 10, category = "all") {
  let pool = WORD_BANK;
  if (category && category !== "all") {
    const filtered = WORD_BANK.filter((w) => w.category === category);
    if (filtered.length >= 4) {
      pool = filtered;
    }
  }
  return shuffle(pool)
    .slice(0, Math.min(questionCount, pool.length))
    .map((word, index) => ({ id: `${index}-${word.en}`, ...word }));
}

/**
 * Builds 4 options for a word on the chosen target language
 * (1 correct translation + 3 smart distractors)
 */
export function buildOptions(word, lang) {
  const targetKey = lang === "en" ? "ru" : lang;
  const correct = word[targetKey] || word.ru || word.uz;

  const sameCat = WORD_BANK.filter((w) => w.en !== word.en && w.category === word.category);
  const otherCat = WORD_BANK.filter((w) => w.en !== word.en && w.category !== word.category);

  const pool = [...shuffle(sameCat), ...shuffle(otherCat)];
  const distractors = pool.slice(0, 3).map((d) => d[targetKey] || d.ru || d.uz);

  const options = shuffle([correct, ...distractors]);
  return { correct, options };
}

/**
 * Get contextual smart hints from Duo Mascot
 */
export function getSmartDuoHint(word, lang = "uz") {
  if (!word) return "Diqqat bilan o'ylab ko'r! 🦉";
  const firstLetter = word.en.charAt(0);
  const len = word.en.length;
  const targetTrans = word[lang] || word.uz || word.ru;

  if (lang === "ru") {
    return word.hintRu || `Подсказка от Дуо: слово начинается на "${firstLetter}", состоит из ${len} букв! Перевод: "${targetTrans}" 🦉`;
  } else if (lang === "en") {
    return `Duo's Hint: Starts with "${firstLetter}", ${len} letters total! 🦉`;
  } else if (lang === "ko") {
    return `두오의 힌트: "${firstLetter}"(으)로 시작하고 총 ${len}개의 글자예요! 뜻: "${targetTrans}" 🦉`;
  }
  return word.hintUz || `Duo maslahati: Bu so'z "${firstLetter}" harfidan boshlanadi va ${len} ta harfdan iborat! 🦉`;
}
