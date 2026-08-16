import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:5173";
const results = [];
const errors = [];

function log(name, ok, extra = "") {
  results.push(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " | " + extra : ""}`);
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function bodyText(page) {
  return page.evaluate(() => document.body.innerText || "");
}

async function clickByText(page, pattern, { all = false } = {}) {
  const src = typeof pattern === "string" ? pattern : pattern.source;
  return page.evaluate(({ src, all }) => {
    const rx = new RegExp(src);
    const btns = [...document.querySelectorAll("button")].filter((b) =>
      rx.test(b.innerText || "")
    );
    if (!btns.length) return false;
    if (all) {
      btns.forEach((b) => b.click());
    } else {
      btns[0].click();
    }
    return true;
  }, { src, all });
}

async function newPage(browser, { clearStorage = false } = {}) {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  page.on("requestfailed", (r) =>
    errors.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText || ""}`)
  );
  await page.goto(BASE, { waitUntil: "networkidle2", timeout: 30000 });
  await wait(1200);
  if (clearStorage) {
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload({ waitUntil: "networkidle2" });
    await wait(1200);
  }
  return page;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--window-size=1365,900"],
});

async function main() {
  // ---------- FLOW 1: Google sign-in ----------
  let page = await newPage(browser, { clearStorage: true });
  let text = await bodyText(page);
  log("Register screen renders (welcome + Google btn)", /LingoQuest|Google/.test(text) && text.includes("gmail.com") === false);

  await clickByText(page, "Google");
  await wait(900);
  text = await bodyText(page);
  log("Google account picker opens", /Akkauntni tanlang|Выберите аккаунт|Choose an account/.test(text));
  await page.screenshot({ path: "e2e-1-picker.png" });

  const picked = await clickByText(page, "gmail\\.com");
  await wait(2600);
  text = await bodyText(page);
  log("Account picked → difficulty screen", picked && /O'yin rejimini tanlang|Выбери режим|Select Game Mode/.test(text));
  await page.screenshot({ path: "e2e-2-difficulty-google.png" });

  // Google badge in header
  const hasG = await page.evaluate(() =>
    [...document.querySelectorAll("span")].some((s) => s.textContent === "G")
  );
  log("Google badge 'G' in header", hasG);

  // Daily goal chip visible
  log("Daily goal chip", /Kunlik maqsad|Дневная цель|Daily Goal/.test(text));

  // ---------- FLOW 2: start speed quiz, finish a round ----------
  await clickByText(page, "O'yinni boshlash|Начать раунд|Start Round");
  await wait(1600);
  text = await bodyText(page);
  log("Speed quiz renders", /tarjimasi qaysi|Как переводится|What is the translation/.test(text));
  await page.screenshot({ path: "e2e-3-speedquiz.png" });

  // Answer with keyboard '1' until round ends (medium: 10 questions)
  let finished = false;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("1");
    await wait(1150);
    const t = await bodyText(page);
    if (/Mashg'ulot yakunlandi|Тренировка завершена|Round Completed|Yana o'ynash|Пройти ещё раз/.test(t)) {
      finished = true;
      break;
    }
  }
  text = await bodyText(page);
  log("Round completes → results screen", finished || /Mashg'ulot yakunlandi|Тренировка завершена/.test(text));
  await page.screenshot({ path: "e2e-4-results.png" });

  // Back to difficulty via "Boshqa o'yin tanlash"
  await clickByText(page, "Boshqa o'yin tanlash|Выбрать другую игру|Choose Another Mode");
  await wait(1400);

  // ---------- FLOW 3: other game modes ----------
  const modes = [
    { btn: "Xotira Kartalari|Флеш-карточки|3D Flashcards", marker: "Kartani bosib|Нажми на карточку|Click card to flip", name: "Flashcards" },
    { btn: "So'z Yasash|Собери Слово|Word Scramble", marker: "Harflarni to'g'ri|Собери английское слово|Assemble the letters", name: "Scramble" },
    { btn: "Tinglab Topish|Аудио-Вызов|Audio Challenge", marker: "Ovozni diqqat|Послушай произношение|Listen carefully", name: "Listening" },
  ];
  for (const m of modes) {
    await clickByText(page, m.btn);
    await wait(600);
    await clickByText(page, "O'yinni boshlash|Начать раунд|Start Round");
    await wait(1500);
    const t = await bodyText(page);
    log(`${m.name} renders`, new RegExp(m.marker).test(t));
    await page.screenshot({ path: `e2e-5-${m.name.toLowerCase()}.png` });
    // back to difficulty
    await page.reload({ waitUntil: "networkidle2" });
    await wait(1500);
  }

  // ---------- FLOW 4: Korean UI ----------
  await clickByText(page, "🇺🇿|UZ");
  await wait(500);
  await clickByText(page, "🇰🇷|KR");
  await wait(700);
  text = await bodyText(page);
  log("Korean UI active", /게임 모드 선택/.test(text) || /오늘의 목표/.test(text));
  await page.screenshot({ path: "e2e-6-korean.png" });

  // Start a speed round in Korean and check a Korean question appears
  await clickByText(page, "라운드 시작");
  await wait(1600);
  text = await bodyText(page);
  log("Korean game round renders", /이 단어의 뜻은/.test(text));
  await page.screenshot({ path: "e2e-7-korean-game.png" });

  // ---------- FLOW 5: vault & translator modals ----------
  await page.reload({ waitUntil: "networkidle2" });
  await wait(1500);
  await clickByText(page, "단어장|Lug'at|Словарь|Vault");
  await wait(800);
  text = await bodyText(page);
  log("Vocabulary Vault opens", /bʊk|dʒɜː\.ni|ˈæp\.əl/.test(text));
  await page.screenshot({ path: "e2e-8-vault.png" });
  await page.keyboard.press("Escape");
  await wait(400);

  await clickByText(page, "번역기|Perevodchik|Переводчик|Translator");
  await wait(800);
  text = await bodyText(page);
  log("Translator opens", /번역|Перевести|Translate/.test(text));
  await page.screenshot({ path: "e2e-9-translator.png" });

  // ---------- FLOW 6: manual sign-up ----------
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle2" });
  await wait(1200);
  text = await bodyText(page);
  log("Register screen (fresh)", /LingoQuest/.test(text));
  await clickByText(page, "Qo'lda ro'yxatdan o'tish|Зарегистрироваться вручную|Sign up manually");
  await wait(500);
  await page.type("input", "TestUser");
  await clickByText(page, "Sarguzashtni boshlash|Начать приключение|Start Quest");
  await wait(1600);
  text = await bodyText(page);
  log("Manual sign-up → difficulty", /O'yin rejimini tanlang|Выбери режим игры|Select Game Mode/.test(text));
  await page.screenshot({ path: "e2e-10-manual.png" });
}

await main().catch((e) => {
  console.error("SCRIPT ERROR:", e.message);
});

try {
  await browser.close();
} catch {
  // Windows Chrome teardown can race on the temp profile — ignore
}

console.log("\n===== E2E SUMMARY =====");
console.log(results.join("\n"));
console.log("\n===== JS ERRORS (" + errors.length + ") =====");
errors.forEach((e) => console.log(e));
