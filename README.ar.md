# إطار عمل حوكمة التطوير بمساعدة الذكاء الاصطناعي (Vibe Coding Governance Framework)

<p align="center">
  <a href="README.md">English</a> •
  <b><a href="README.ar.md">العربية</a></b>
</p>

شجرة مرجعية نقية من ملفات Markdown (`.md`) فقط، خالية من الاعتماديات ومحايدة للغات البرمجة، لضبط التطوير بمساعدة الذكاء الاصطناعي. وجّه أي أداة ذكاء اصطناعي (`Antigravity`, `Cursor`, `Claude Code`, `Windsurf`, `GitHub Copilot`) إلى [INDEX.md](INDEX.md) لتأسيس قواعد هندسية صارمة، وبوابات تخطيط قبل الكود، وأدوات جودة حتمية، وتوثيق حي، وإدارة مشروع شجرية من اليوم الأول.

**الرخصة:** [MIT](LICENSE) | **نقطة الدخول:** [INDEX.md](INDEX.md) | **مهارة الـ Agent:** [SKILL.md](SKILL.md) | **جميع البرومبتات:** [QUICK_START_PROMPTS.md](QUICK_START_PROMPTS.md)

---

## البدء السريع: أضف الإطار إلى مشروعك (نسخ ولصق)

انسخ أحد البرومبتين التاليين وألصقه مباشرةً في أداة الذكاء الاصطناعي داخل مشروعك:

### 1. مشروع جديد من الصفر (Greenfield Bootstrap)

```text
Adopt the engineering governance framework from https://github.com/wabdelgilil/vibe-coding-framework (start at INDEX.md and follow 08_adoption_and_onboarding/greenfield_bootstrap.md).

Execute Stage A first:
1. Challenge any risky architectural, security, or scalability assumptions objectively before writing code.
2. Clarify stack, database, authentication/tenancy, and non-functional constraints with me.
3. Propose a dependency-ordered roadmap (P0 security/data -> P1 foundations -> P2 features) and wait for my sign-off before scaffolding detailed phase files or application code.
4. Once approved, compile one primary Tier-0 rules file (<= 90 lines) for this tool, scaffold `project_management/` and living docs, and configure native deterministic tooling (formatter, strict linter, type checker, tests, dependency audit).

Project idea:
[اكتب وصف مشروعك هنا]
```

### 2. مشروع قائم بالفعل (Brownfield 3-Stage Audit)

```text
Adopt the engineering governance framework from https://github.com/wabdelgilil/vibe-coding-framework (start at INDEX.md and follow 08_adoption_and_onboarding/brownfield_three_stage_audit.md) on this repository:
1. Stage 1: Install a single primary Tier-0 rules file (<= 90 lines) and `project_management/` without modifying application code.
2. Stage 2: Run an evidence-based diagnostic audit across Pillars 01-07 using Dual Verification (automated checks + direct reading of high-risk files and random samples). Report compliance % (`PASS / (Total - N/A) * 100%`), letter grade (automatic F on any critical `SEC-*` failure), and `[RULE-ID]` file/line findings.
3. Stage 3: Propose a dependency-ordered Wave remediation plan and wait for my sign-off before editing application code.
```

### 3. تحديث مشروع يستخدم الإطار بالفعل إلى أحدث إصدار (تحديث آمن بدون مسح التخصيصات)

```text
Sync this repository's governance setup with the latest version of https://github.com/wabdelgilil/vibe-coding-framework (check INDEX.md and 09_output_blueprints/agent_rule_adapters.md):
1. Compare our current Tier-0 rules file and `project_management/` / `docs/` governance structure against the latest upstream framework.
2. Merge any new Non-Negotiable Laws, Trigger Routing Table rows, or missing governance templates (such as `docs/memory/`) while keeping the primary Tier-0 file strictly <= 90 lines.
3. STRICTLY PRESERVE all existing project-specific `Standing User Preferences`, `docs/memory/` entries, `SRS.md`, `ADRs`, `MASTER_PLAN.md`, and active plans—never overwrite custom content or touch application source code.
4. Verify zero broken relative links and summarize the exact upgrades applied.
```

*(لبرومبت مراجعة الـ Pull Requests والميزات، راجع [QUICK_START_PROMPTS.md](QUICK_START_PROMPTS.md)).*

---

## لماذا نحتاج هذا الإطار؟

التطوير العفوي بالذكاء الاصطناعي (Vibe Coding) يتعثر في المشاريع الحقيقية لأسباب متكررة:
- **المجاملة والاختصارات:** موافقة تلقائية على أفكار خطيرة، تثبيت أسرار أو بيانات وهمية في الكود، إخفاء الأخطاء (`catch {}`)، وتعطيل فحوصات الـ Linter والأنواع.
- **التنفيذ قبل التخطيط:** القفز لكتابة الكود بخطط سطحية وتنفيذ المهام بترتيب أعمى يتجاهل الاعتماديات والأولويات الأمنية.
- **تآكل السياق وتضخم التوكنز:** حشو كل القواعد في ملف واحد يستهلك آلاف التوكنز، بينما إخفاؤها يؤدي لنسيانها عبر الجلسات.
- **غياب التوثيق المعياري:** تجاهل أو تقادم `SRS.md`، مواصفات الميزات، عقود الـ API، سجلات القرارات (`ADRs`)، و `CHANGELOG.md`.

---

## المعمارية: الذاكرة ثلاثية الطبقات والركائز التسع

بدلاً من حشو نافذة السياق، يولّد الإطار ملفاً واحداً خفيفاً في مشروعك (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursor/rules`, أو `.github/copilot-instructions.md`) لا يتجاوز **30–90 سطراً (~650 توكن)** يضم **10 قوانين غير قابلة للتفاوض + جدول محفّزات (Trigger Table)**. يلتزم الـ Agent بقاعدة **التوقف عند الهدف (Stop-on-Target)** فلا يقرأ سوى الورقة الدقيقة (`≤ 120` سطراً) المطلوبة لخطوته الحالية فقط.

| الركيزة | ملف التوجيه | نطاق المسؤولية |
| :-: | :--- | :--- |
| **01** | [01_anti_shortcuts/README.md](01_anti_shortcuts/README.md) | الموضوعية ومنع التطبيل، حظر الاختصارات، السبب الجذري، الأثر بعيد المدى، البحث الموجه، التحقق المزدوج، والمراجعة الخصومية |
| **02** | [02_clean_code/README.md](02_clean_code/README.md) | صفر بصمة ذكاء اصطناعي، التسمية والوضوح، حدود الملفات والدوال، صرامة الأنواع، والأدوات الحتمية |
| **03** | [03_scalability/README.md](03_scalability/README.md) | التصميم غير المعتمد على الحالة المحلية، منع $N+1$ والـ Pagination والفهرسة، التنفيذ غير المتزامن، وحدود الموارد |
| **04** | [04_maintainability/README.md](04_maintainability/README.md) | فصل الطبقات، تحليل الأثر وتماثل العلاقات، معالجة الأخطاء والسجلات، الاختبارات السلوكية، وسجل الديون التقنية |
| **05** | [05_documentation/README.md](05_documentation/README.md) | الملفات المعيارية لكل ميزة (`SRS.md`, `Feature Spec`, عقود الـ API, `ADRs`) والتزامن الإلزامي مع الكود |
| **06** | [06_security_and_reliability/README.md](06_security_and_reliability/README.md) | نظافة الأسرار، التحقق من المدخلات، الصلاحيات وعزل المستأجرين على الخادم، وحماية سلامة البيانات |
| **07** | [07_project_management_and_context/README.md](07_project_management_and_context/README.md) | بوابة التخطيط قبل الكود، ترتيب الأولويات بالاعتماديات، `MASTER_PLAN.md` الخفيف، الخطط الشجرية، والأرشفة الفعلية |
| **08** | [08_adoption_and_onboarding/README.md](08_adoption_and_onboarding/README.md) | تأسيس المشاريع الجديدة (Greenfield) والتدقيق ثلاثي المراحل للمشاريع القائمة (Brownfield) |
| **09** | [09_output_blueprints/README.md](09_output_blueprints/README.md) | محوّلات قواعد أدوات الذكاء الاصطناعي والقوالب الهندسية القياسية |

---

## بورتال المتابعة المحلي الاختياري (`portal/`)

إذا أردت واجهة ويب نظيفة (عربي/إنجليزي + فاتح/داكن) لمتابعة `MASTER_PLAN.md` و `ACTIVE_CONTEXT.md` وشجرة الخطط والديون التقنية و `SRS.md` بدون استهلاك أي توكن من الـ Agent:
- انسخ مجلد `portal/` الاختياري إلى مشروعك (معزول تماماً عن الـ Agent، وبصفر `node_modules` أو تثبيت مكتبات).
- شغّل `portal/start_portal.bat` (على Windows) أو `./portal/start_portal.sh` (على macOS/Linux): يفحص الجهاز تلقائياً ويشغّل خادماً محلياً آمناً على `127.0.0.1`، أو يفتح وضع المتصفح المباشر بدون تثبيت، ويحفظ اختيارك محلياً في `portal/.portal-pref` (المتجاهَل في Git؛ استخدم `--reset` لتغييره).

---

## المساهمة والرخصة

المشروع مفتوح المصدر تحت [رخصة MIT](LICENSE). نرحّب بالمساهمات وفق معايير الروابط وميزانية السطور الموضحة في [CONTRIBUTING.md](CONTRIBUTING.md).
