import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("missioncom.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    category TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS ministries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    icon_name TEXT
  );
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    category TEXT -- '업체' or '총회'
  );
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    month TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default settings if not exists
const seedSettings = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
seedSettings.run("site_name", "미션컴 (MissionCom)");
seedSettings.run("primary_color", "#1B4332");
seedSettings.run("secondary_color", "#D8E2DC");
seedSettings.run("font_family", "serif");
seedSettings.run("logo_url", "/logo.png");
seedSettings.run("intro_title", "함께 걷는 길, 더 나은 내일을 만듭니다");
seedSettings.run("intro_subtitle", "Our Vision");
seedSettings.run("intro_content", "미션컴(MissionCom)은 2010년, 한 사람의 작은 기도로 시작되었습니다. 우리는 단순한 원조를 넘어, 현지 공동체가 스스로 일어설 수 있는 지속 가능한 선교 모델을 지향합니다.\n\n청년들의 열정과 전문성을 선교 현장과 연결하며, 복음이 필요한 곳에 가장 창의적이고 따뜻한 방법으로 다가갑니다.");
seedSettings.run("intro_quote", "우리는 말보다 삶으로, 사랑을 증명합니다.");
seedSettings.run("intro_image_url", "https://picsum.photos/seed/intro-mission/800/1000");
seedSettings.run("contact_address", "서울특별시 강남구 선릉로 123");
seedSettings.run("contact_phone", "02-1234-5678");
seedSettings.run("contact_email", "hello@missioncom.org");
seedSettings.run("show_contact", "true");
seedSettings.run("show_email", "true");
seedSettings.run("social_blog", "https://blog.naver.com");

// Seed default ministries if empty
const ministryCount = db.prepare("SELECT COUNT(*) as count FROM ministries").get() as any;
if (ministryCount.count === 0) {
  const insertMinistry = db.prepare("INSERT INTO ministries (title, description, image_url, icon_name) VALUES (?, ?, ?, ?)");
  insertMinistry.run('해외 선교 프로젝트', '현지 교회를 세우고 복음의 씨앗을 심는 해외 파송 사역입니다.', 'https://picsum.photos/seed/m1/600/400', 'Globe');
  insertMinistry.run('교육 및 자립 지원', '학교 설립과 직업 교육을 통해 현지인들의 자립을 돕습니다.', 'https://picsum.photos/seed/m2/600/400', 'BookOpen');
  insertMinistry.run('청년 선교사 양성', '다음 세대 리더들을 훈련하고 선교 현장으로 연결합니다.', 'https://picsum.photos/seed/m3/600/400', 'Users');
}

// Seed default partners if empty
const partnerCount = db.prepare("SELECT COUNT(*) as count FROM partners").get() as any;
if (partnerCount.count === 0) {
  const insertPartner = db.prepare("INSERT INTO partners (name, description, logo_url, website_url, category) VALUES (?, ?, ?, ?, ?)");
  insertPartner.run('대한예수교장로회 총회', '선교 사역을 지원하는 협력 총회입니다.', 'https://picsum.photos/seed/p1/200/200', 'https://example.com', '총회');
  insertPartner.run('미션 테크놀로지', 'IT 기술로 선교 현장을 돕는 파트너 업체입니다.', 'https://picsum.photos/seed/p2/200/200', 'https://example.com', '업체');
  insertPartner.run('글로벌 에이드', '국제 구호 활동을 함께하는 협력 기구입니다.', 'https://picsum.photos/seed/p3/200/200', 'https://example.com', '업체');
}

// Seed default history if empty
const historyCount = db.prepare("SELECT COUNT(*) as count FROM history").get() as any;
if (historyCount.count === 0) {
  const insertHistory = db.prepare("INSERT INTO history (year, month, content) VALUES (?, ?, ?)");
  insertHistory.run('2010', '03', '미션컴(MissionCom) 창립 및 첫 기도모임 시작');
  insertHistory.run('2012', '05', '동남아시아 교육 지원 프로젝트 1호 학교 설립');
  insertHistory.run('2015', '08', '청년 선교사 훈련 프로그램 1기 수료');
  insertHistory.run('2018', '11', '아프리카 자립 지원 센터 개소');
  insertHistory.run('2023', '01', '글로벌 선교 네트워크 50개국 돌파');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    // Simple hardcoded password for demo purposes
    if (password === "tlsgkrtodcntn08!!") {
      res.json({ success: true, token: "admin-token-xyz" });
    } else {
      res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsMap);
  });

  const ALLOWED_SETTINGS = [
    'site_name', 'primary_color', 'secondary_color', 'font_family', 'logo_url',
    'intro_title', 'intro_subtitle', 'intro_content', 'intro_quote', 'intro_image_url',
    'contact_address', 'contact_phone', 'contact_email', 'show_contact', 'show_email',
    'social_instagram', 'social_youtube', 'social_blog'
  ];

  app.post("/api/settings", (req, res) => {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: "Invalid settings data" });
    }
    const update = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (!ALLOWED_SETTINGS.includes(key)) continue;
        if (value === undefined) continue;
        // SQLite3 can only bind numbers, strings, bigints, buffers, and null
        // Convert booleans to strings
        const bindValue = typeof value === 'boolean' ? String(value) : value;
        update.run(key, bindValue);
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { title, content, category, image_url } = req.body;
    const info = db.prepare("INSERT INTO posts (title, content, category, image_url) VALUES (?, ?, ?, ?)")
      .run(title, content, category, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/posts/:id", (req, res) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/ministries", (req, res) => {
    const ministries = db.prepare("SELECT * FROM ministries").all();
    res.json(ministries);
  });

  app.post("/api/ministries", (req, res) => {
    const { title, description, image_url, icon_name } = req.body;
    const info = db.prepare("INSERT INTO ministries (title, description, image_url, icon_name) VALUES (?, ?, ?, ?)")
      .run(title, description, image_url, icon_name);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/ministries/:id", (req, res) => {
    const { title, description, image_url, icon_name } = req.body;
    db.prepare("UPDATE ministries SET title = ?, description = ?, image_url = ?, icon_name = ? WHERE id = ?")
      .run(title, description, image_url, icon_name, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/ministries/:id", (req, res) => {
    db.prepare("DELETE FROM ministries WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/partners", (req, res) => {
    const partners = db.prepare("SELECT * FROM partners").all();
    res.json(partners);
  });

  app.post("/api/partners", (req, res) => {
    const { name, description, logo_url, website_url, category } = req.body;
    const info = db.prepare("INSERT INTO partners (name, description, logo_url, website_url, category) VALUES (?, ?, ?, ?, ?)")
      .run(name, description, logo_url, website_url, category);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/partners/:id", (req, res) => {
    const { name, description, logo_url, website_url, category } = req.body;
    db.prepare("UPDATE partners SET name = ?, description = ?, logo_url = ?, website_url = ?, category = ? WHERE id = ?")
      .run(name, description, logo_url, website_url, category, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/partners/:id", (req, res) => {
    db.prepare("DELETE FROM partners WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/history", (req, res) => {
    const history = db.prepare("SELECT * FROM history ORDER BY year DESC, month DESC").all();
    res.json(history);
  });

  app.post("/api/history", (req, res) => {
    const { year, month, content } = req.body;
    const info = db.prepare("INSERT INTO history (year, month, content) VALUES (?, ?, ?)")
      .run(year, month, content);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/history/:id", (req, res) => {
    const { year, month, content } = req.body;
    db.prepare("UPDATE history SET year = ?, month = ?, content = ? WHERE id = ?")
      .run(year, month, content, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/history/:id", (req, res) => {
    db.prepare("DELETE FROM history WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
