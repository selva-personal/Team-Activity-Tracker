/**
 * Project Detailed Technical Documentation Generator
 * Output: Project_Detailed_Technical_Documentation.docx
 * Do not include proprietary third-party product names in the narrative.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, PageNumber, Footer, Header, PageBreak,
  LevelFormat, ShadingType, TableOfContents,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'Project_Detailed_Technical_Documentation.docx');

const BLUE = '1E3A5F';
const ACCENT = '2563EB';
const LIGHT = 'F1F5F9';
const CODE_BG = 'EEF2FF';
const WHITE = 'FFFFFF';
const BLACK = '0F172A';
const GRAY = '475569';

const border = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
const borders = { top: border, bottom: border, left: border, right: border };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 140, before: opts.before ?? 0 },
    alignment: opts.align,
    children: [new TextRun({
      text: String(text ?? ''),
      font: opts.mono ? 'Consolas' : 'Calibri',
      size: opts.size || 22,
      bold: opts.bold,
      italics: opts.italics,
      color: opts.color || BLACK,
    })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: 'Calibri', color: BLUE })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 26, font: 'Calibri', color: ACCENT })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: 'Calibri', color: '1E40AF' })],
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 70 },
    children: [new TextRun({ text, font: 'Calibri', size: 22, color: BLACK })],
  });
}
function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 70 },
    children: [new TextRun({ text, font: 'Calibri', size: 22, color: BLACK })],
  });
}
function codeBlock(lines) {
  const arr = Array.isArray(lines) ? lines : String(lines).split('\n');
  return arr.map((line) => new Paragraph({
    spacing: { after: 0, before: 0 },
    shading: { type: ShadingType.CLEAR, fill: CODE_BG },
    children: [new TextRun({ text: line || ' ', font: 'Consolas', size: 16, color: '312E81' })],
  }));
}
function note(text) {
  return new Paragraph({
    spacing: { after: 160, before: 80 },
    shading: { type: ShadingType.CLEAR, fill: 'FEF3C7' },
    children: [
      new TextRun({ text: 'Note: ', bold: true, font: 'Calibri', size: 20, color: '92400E' }),
      new TextRun({ text, font: 'Calibri', size: 20, color: '92400E' }),
    ],
  });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function spacer() {
  return p('', { after: 60 });
}
function coverField(label, value) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, font: 'Calibri', size: 22, color: GRAY }),
      new TextRun({ text: value, font: 'Calibri', size: 22, color: BLACK }),
    ],
  });
}
function cell(text, opts = {}) {
  return new TableCell({
    borders,
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: opts.header
      ? { type: ShadingType.CLEAR, fill: BLUE }
      : opts.fill
        ? { type: ShadingType.CLEAR, fill: opts.fill }
        : undefined,
    children: [new Paragraph({
      spacing: { after: 40, before: 40 },
      children: [new TextRun({
        text: String(text ?? ''),
        font: opts.mono ? 'Consolas' : 'Calibri',
        size: opts.size || 17,
        bold: opts.header || opts.bold,
        color: opts.header ? WHITE : BLACK,
      })],
    })],
  });
}
function table(headers, rows, colWidths) {
  const widths = colWidths || headers.map(() => Math.floor(9360 / headers.length));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ children: headers.map((h, i) => cell(h, { header: true, width: widths[i] })) }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((c, i) => cell(c, { width: widths[i], fill: ri % 2 ? LIGHT : WHITE })),
      })),
    ],
  });
}

const C = [];
const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

// ========================= COVER =========================
C.push(
  new Paragraph({ spacing: { before: 900 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: 'PROJECT DOCUMENTATION', bold: true, size: 28, font: 'Calibri', color: GRAY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: 'Vigilon Platform', bold: true, size: 56, font: 'Calibri', color: BLUE })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({
      text: 'AI-Based Employee Activity Monitoring & Face Recognition System',
      italics: true, size: 22, font: 'Calibri', color: GRAY,
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 1 } },
    children: [new TextRun({ text: 'Detailed Technical Documentation', bold: true, size: 36, font: 'Calibri', color: BLACK })],
  }),
  p('Handover package for development teams responsible for maintaining, extending, and integrating additional applications into this web platform.', {
    align: AlignmentType.CENTER, color: GRAY, size: 20,
  }),
  spacer(),
  coverField('Document Title', 'Project Detailed Technical Documentation'),
  coverField('Version', '1.0.0'),
  coverField('Date', today),
  coverField('Prepared By', 'Software Architecture & Documentation Engineering'),
  coverField('Audience', 'Integrating developers, technical leads, AI engineers'),
  coverField('Classification', 'Internal / Proprietary'),
  coverField('Application', 'Vigilon Web Application (SPA)'),
  coverField('Repository Package', 'company-operations-tracker'),
  coverField('Branch Baseline', 'development'),
  coverField('Stack', 'React 18 · TypeScript · Vite 5 · Redux Toolkit / RTK Query · Tailwind CSS'),
  pageBreak(),
);

// ========================= TOC =========================
C.push(
  h1('Table of Contents'),
  p('In Microsoft Word: right-click the table of contents → Update Field → Update entire table to refresh page numbers.', {
    italics: true, color: GRAY, size: 18,
  }),
  new TableOfContents('Table of Contents', { hyperlink: true }),
  pageBreak(),
);

// ========================= 3 EXEC SUMMARY =========================
C.push(
  h1('3. Executive Summary'),
  p('This document describes the complete technical design of the current Vigilon web application: a React-based single-page application (SPA) for monitoring employee activity, team and project performance, daily work logs, analytics reports, notifications, and developer productivity insights.'),
  p('The platform currently operates with a mock data access layer implemented through Redux Toolkit Query (RTK Query). Each API slice declares a conventional HTTP base path (/api) but resolves data via in-memory queryFn handlers. Authentication is demo-grade (client-side flag). This architecture is intentional preparation for replacing mocks with a real backend API gateway while keeping the UI, routing, and state contracts stable.'),
  p('A secondary application will be integrated later, followed by Claude AI capabilities. Sections 32 and 33 provide concrete integration blueprints. Sections 34–38 capture risks, debt, and recommended practices so a new team can operate without tribal knowledge.'),
  bullet('Product brand in UI: Vigilon'),
  bullet('npm package name: company-operations-tracker (legacy naming; do not rename unless planned)'),
  bullet('Primary runtime: Browser SPA; no embedded backend in this repository'),
  bullet('Data: mock entities for teams, employees, projects, tasks, reports, notifications, developer metrics'),
  pageBreak(),
);

// ========================= 4 OVERVIEW =========================
C.push(
  h1('4. Project Overview'),
  h2('4.1 Purpose'),
  p('Provide managers, team leads, and operations stakeholders with a unified web interface to observe workforce activity, delivery health, and productivity signals. The system is branded as an AI-oriented monitoring platform; AI features are planned (see §33) and are not yet implemented as live model integrations.'),
  h2('4.2 Objectives'),
  bullet('Deliver a modern, responsive SPA with consistent layout and theming.'),
  bullet('Expose operational modules: Dashboard, Teams, Employees, Projects, Daily Activity, Reports, Developer Productivity, Settings, Profile.'),
  bullet('Structure data access so backend replacement is a localized change (API slices).'),
  bullet('Support future multi-application integration and AI assistant capabilities.'),
  bullet('Establish documentation and onboarding sufficient for independent team handover.'),
  h2('4.3 Scope'),
  h3('In scope'),
  bullet('Frontend SPA source under src/'),
  bullet('Build tooling (Vite, TypeScript, Tailwind)'),
  bullet('Client routing, demo auth, Redux store, mock APIs, UI kit'),
  h3('Out of scope (this repository)'),
  bullet('Production identity provider / JWT issuance'),
  bullet('Real database or server APIs'),
  bullet('Native face-recognition pipelines (branding only today)'),
  bullet('Claude AI runtime (planned)'),
  h2('4.4 Main Features'),
  table(
    ['Feature', 'Description', 'Maturity'],
    [
      ['Demo Login', 'Any email/password; Redux + localStorage flag', 'Demo'],
      ['Dashboard', 'KPIs and Recharts visualizations', 'Functional (mock)'],
      ['Org modules', 'Teams, Employees, Projects cards/lists', 'Functional (mock)'],
      ['Daily Activity', 'Filter/sort/paginate activity rows', 'Functional (mock)'],
      ['Reports', 'Team/Employee/Project/Daily generators', 'Functional (mock)'],
      ['Developer Productivity', 'Commits, attendance, hours, performance', 'Functional (mock)'],
      ['Notifications', 'Panel with mark read / mark all', 'Functional (mock)'],
      ['Theme', 'Light/Dark via class + localStorage', 'Functional'],
      ['Settings/Profile', 'Mostly UI; limited persistence', 'Partial'],
    ],
    [2200, 4600, 2560],
  ),
  spacer(),
  h2('4.5 Target Users'),
  bullet('Operations / delivery managers'),
  bullet('Team leads and engineering managers'),
  bullet('HR/admin personas (future attendance/HR depth)'),
  bullet('Integrating application developers'),
  bullet('AI feature engineers (future)'),
  pageBreak(),
);

// ========================= 5 STACK =========================
C.push(
  h1('5. Technology Stack'),
  p('Every major technology below is present in package.json or configuration and used for the stated reason.'),
  table(
    ['Technology', 'Role', 'Why Chosen'],
    [
      ['React 18', 'UI library', 'Component model, hooks, ecosystem'],
      ['TypeScript 5', 'Typing', 'Safer refactors and API contracts'],
      ['Vite 5', 'Bundler/dev server', 'Fast HMR, simple SPA builds'],
      ['React Router 6', 'Routing', 'Declarative SPA routes + guards'],
      ['Redux Toolkit', 'Global state', 'auth + theme predictability'],
      ['RTK Query', 'Data layer', 'Caching, tags, hook DX; HTTP-ready'],
      ['react-redux', 'Bindings', 'Provider and typed hooks'],
      ['Tailwind CSS 3', 'Styling', 'Utility-first, darkMode class'],
      ['PostCSS/Autoprefixer', 'CSS pipeline', 'Tailwind processing'],
      ['Recharts', 'Charts', 'Dashboard & productivity visuals'],
      ['lucide-react', 'Icons', 'Consistent icon set'],
      ['clsx', 'classNames', 'Conditional styling'],
      ['date-fns', 'Dates', 'Formatting and calendar math'],
      ['ESLint (+ plugins)', 'Lint (planned)', 'Script exists; config missing'],
      ['npm', 'Packages', 'Lockfile-based installs'],
    ],
    [2400, 2400, 4560],
  ),
  spacer(),
  h2('5.1 Authentication Technology'),
  p('No third-party auth SDK is used. Authentication is implemented as a Redux slice writing localStorage.isLoggedIn. This must be replaced before production integrations that require trusted identity.'),
  h2('5.2 CSS Approach'),
  bullet('Tailwind utilities in JSX'),
  bullet('Global styles and animations in src/index.css'),
  bullet('ThemeProvider toggles dark / dark-theme / light-theme on documentElement'),
  pageBreak(),
);

// ========================= 6 FOLDERS =========================
C.push(
  h1('6. Folder Structure'),
  ...codeBlock([
    'Team-Activity-Tracker/',
    '├── index.html',
    '├── package.json / package-lock.json',
    '├── vite.config.ts',
    '├── tsconfig.json / tsconfig.node.json',
    '├── tailwind.config.js / postcss.config.js',
    '├── README.md',
    '├── docs/                          # technical documentation assets',
    '└── src/',
    '    ├── main.tsx                   # application bootstrap',
    '    ├── App.tsx                    # router + providers shell',
    '    ├── index.css',
    '    ├── vite-env.d.ts',
    '    ├── config/appConfig.ts        # brand/copy constants',
    '    ├── types/index.ts             # shared domain types',
    '    ├── data/mockData.ts           # mock datasets & generators',
    '    ├── contexts/SidebarContext.tsx',
    '    ├── components/',
    '    │   ├── ThemeProvider.tsx',
    '    │   ├── routing/ProtectedRoute.tsx',
    '    │   ├── layout/                # Layout, Sidebar, Header, NotificationPanel',
    '    │   ├── ui/                    # Button, Card, Badge, Input, Select, Table, Skeleton',
    '    │   └── charts/TeamProductivityHeatmap.tsx  # currently unused',
    '    ├── pages/                     # route-level modules',
    '    └── store/',
    '        ├── store.ts / hooks.ts',
    '        ├── slices/                # authSlice, themeSlice',
    '        └── api/                   # seven RTK Query API modules',
  ]),
  h2('6.1 Folder Responsibilities'),
  table(
    ['Path', 'Responsibility', 'Collaborates With'],
    [
      ['src/config', 'Brand strings / titles', 'Login, Sidebar, Dashboard, Reports, main'],
      ['src/types', 'Domain TypeScript contracts', 'APIs, pages, mockData'],
      ['src/data', 'Mock persistence substitute', 'All store/api modules'],
      ['src/contexts', 'Sidebar collapse UI state', 'Layout, Sidebar'],
      ['src/components/ui', 'Design-system primitives', 'Pages & layout'],
      ['src/components/layout', 'App chrome', 'Router, auth, notifications API'],
      ['src/components/routing', 'Auth gate', 'authSlice, react-router'],
      ['src/pages', 'Business screens', 'store APIs + UI'],
      ['src/store/slices', 'Client session & theme', 'localStorage, ThemeProvider'],
      ['src/store/api', 'Data access (mock→future HTTP)', 'mockData, pages'],
      ['docs', 'Documentation generators & DOCX', 'Handover artifacts'],
    ],
    [2200, 3400, 3760],
  ),
  spacer(),
  note('There is presently no src/hooks, src/services, src/utils, or src/assets directory. Integration work should introduce services/ and hooks/ intentionally (see §32–§33).'),
  pageBreak(),
);

// ========================= 7 ARCHITECTURE =========================
C.push(
  h1('7. Application Architecture'),
  p('The system is a client-only SPA. Presentation, client state, and a mock data gateway live in the browser. A future backend API and optional AI gateway will sit behind the existing RTK Query boundary.'),
  p('Mermaid — Logical architecture:', { bold: true }),
  ...codeBlock([
    'flowchart TB',
    '  subgraph Client[Web Application Browser]',
    '    UI[Pages + Layout + UI Kit]',
    '    R[React Router + ProtectedRoute]',
    '    ST[Redux Store auth theme]',
    '    RTK[RTK Query API Slices]',
    '    MOCK[queryFn Mock Layer]',
    '  end',
    '  UI --> R --> ST',
    '  UI --> RTK --> MOCK',
    '  MOCK -. planned .-> API[Platform Backend API]',
    '  API -. planned .-> DB[(Database)]',
    '  UI -. planned .-> AIGW[AI Gateway BFF]',
    '  AIGW -. planned .-> LLM[Claude API]',
  ]),
  h2('7.1 Architectural Layers'),
  numbered('Presentation: pages, layout, UI components'),
  numbered('Application state: Redux slices + React context'),
  numbered('Data access: RTK Query APIs'),
  numbered('Domain types: src/types'),
  numbered('Bootstrap/config: main, vite, appConfig'),
  h2('7.2 Design Principles Observed'),
  bullet('Feature pages own orchestration; UI kit stays presentational.'),
  bullet('API modules isolate data concerns from JSX.'),
  bullet('Path alias @ maps to src for clean imports.'),
  bullet('Brand copy centralized in appConfig.ts.'),
  pageBreak(),
);

// ========================= 8 STARTUP =========================
C.push(
  h1('8. Startup Flow'),
  numbered('User opens the application URL (dev: http://localhost:3000).'),
  numbered('index.html mounts #root and loads /src/main.tsx.'),
  numbered('main.tsx sets document.title from APP_FULL_NAME.'),
  numbered('React renders StrictMode → Redux Provider → ThemeProvider → App.'),
  numbered('App mounts BrowserRouter → SidebarProvider → Layout → Routes.'),
  numbered('Unauthenticated users hitting protected paths redirect to /login.'),
  numbered('After demo login, navigation goes to /dashboard.'),
  numbered('Dashboard issues RTK Query hooks; mocks resolve; UI paints KPIs/charts.'),
  p('Mermaid — Startup sequence:', { bold: true, before: 160 }),
  ...codeBlock([
    'sequenceDiagram',
    '  participant B as Browser',
    '  participant M as main.tsx',
    '  participant S as Redux Store',
    '  participant T as ThemeProvider',
    '  participant A as App Router',
    '  participant P as ProtectedRoute',
    '  participant D as Dashboard',
    '  B->>M: Load SPA',
    '  M->>S: Provider',
    '  M->>T: Theme sync',
    '  T->>A: Render routes',
    '  A->>P: Guard feature routes',
    '  alt not authenticated',
    '    P-->>B: Redirect /login',
    '  else authenticated',
    '    P->>D: Render',
    '    D->>S: RTK queries',
    '    S-->>D: Mock payloads',
    '  end',
  ]),
  pageBreak(),
);

// ========================= 9 ROUTING =========================
C.push(
  h1('9. Routing'),
  table(
    ['Path', 'Component', 'Access', 'Notes'],
    [
      ['/login', 'Login', 'Public', 'Layout hides chrome'],
      ['/dashboard', 'Dashboard', 'Protected', 'Post-login landing'],
      ['/teams', 'Teams', 'Protected', ''],
      ['/employees', 'Employees', 'Protected', ''],
      ['/projects', 'Projects', 'Protected', ''],
      ['/activity', 'DailyActivity', 'Protected', ''],
      ['/reports', 'Reports', 'Protected', ''],
      ['/developer-productivity/*', 'DeveloperProductivity', 'Protected', 'Internal section via path segment'],
      ['/settings', 'Settings', 'Protected', ''],
      ['/profile', 'Profile', 'Protected', ''],
      ['/', 'Navigate → /login', '—', ''],
      ['*', 'Navigate → /login', '—', 'Catch-all'],
    ],
    [2800, 2400, 1400, 2760],
  ),
  spacer(),
  h2('9.1 Route Guard'),
  p('ProtectedRoute reads state.auth.isLoggedIn. On failure it navigates to /login with replace and stores state.from. Login currently ignores state.from and always sends users to /dashboard.'),
  h2('9.2 Developer Productivity Sub-navigation'),
  p('Sections overview | commits | attendance | hours | performance are derived from the URL path inside the page component rather than nested <Route> declarations.'),
  h2('9.3 Lazy Loading'),
  p('Not implemented. All pages are statically imported in App.tsx. Recommended for integration scale-up.'),
  pageBreak(),
);

// ========================= 10 AUTH =========================
C.push(
  h1('10. Authentication Flow'),
  h2('10.1 Login'),
  numbered('User submits email/password on /login (password is not validated).'),
  numbered('dispatch(login({ email, user })) sets isLoggedIn and user.'),
  numbered('localStorage.isLoggedIn = "true".'),
  numbered('navigate("/dashboard", { replace: true }).'),
  h2('10.2 Logout'),
  numbered('Header profile menu → Logout.'),
  numbered('dispatch(logout()) clears state and localStorage flag.'),
  numbered('Navigate to /login.'),
  h2('10.3 Session Characteristics'),
  table(
    ['Concern', 'Current Behavior', 'Production Target'],
    [
      ['Credential check', 'Always succeeds (demo)', 'Verify via backend'],
      ['Token', 'None', 'JWT / opaque access token'],
      ['Refresh', 'None', 'Refresh rotation via BFF'],
      ['User persistence', 'User object not stored', 'Persist/rehydrate profile'],
      ['RBAC', 'Role string decorative', 'Enforce permissions'],
      ['API auth', 'None', 'Authorization header'],
    ],
    [2200, 3600, 3560],
  ),
  spacer(),
  p('Mermaid — Auth flow:', { bold: true }),
  ...codeBlock([
    'stateDiagram-v2',
    '  [*] --> Anonymous',
    '  Anonymous --> Authenticated: login action',
    '  Authenticated --> Anonymous: logout action',
    '  Authenticated --> ProtectedPages: isLoggedIn true',
    '  Anonymous --> LoginPage: guard redirect',
  ]),
  pageBreak(),
);

// ========================= 11 STATE =========================
C.push(
  h1('11. State Management'),
  h2('11.1 Redux Store Composition'),
  bullet('theme — light/dark mode'),
  bullet('auth — isLoggedIn + user'),
  bullet('seven RTK Query reducerPaths with matching middleware'),
  h2('11.2 Typed Hooks'),
  ...codeBlock([
    '// src/store/hooks.ts',
    'export const useAppDispatch = () => useDispatch<AppDispatch>();',
    'export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;',
  ]),
  h2('11.3 Local vs Global'),
  bullet('Global: auth, theme, server-cache (RTK).'),
  bullet('Context: sidebar collapsed.'),
  bullet('Local useState: filters, pagination, modals, report type, chat-like UI state (future).'),
  h2('11.4 Cache Lifecycle'),
  p('RTK Query caches by endpoint name + serialized args. Tag invalidation is used by notifications mutations. Default retention applies on unmount.'),
  pageBreak(),
);

// ========================= 12 COMPONENTS =========================
C.push(
  h1('12. Component Architecture'),
  ...codeBlock([
    'Provider(store)',
    '  ThemeProvider',
    '    BrowserRouter',
    '      SidebarProvider',
    '        Layout',
    '          Sidebar | Header | main(Routes→Page)',
  ]),
  table(
    ['Category', 'Examples', 'Responsibility'],
    [
      ['Providers', 'ThemeProvider, SidebarProvider', 'Cross-cutting UI/session chrome'],
      ['Layout', 'Layout, Sidebar, Header, NotificationPanel', 'Navigation & shell'],
      ['Routing', 'ProtectedRoute', 'Access control'],
      ['UI kit', 'Button, Card, Badge, Input, Select, Table, Skeleton', 'Reusable primitives'],
      ['Charts', 'Recharts in pages; Heatmap unused', 'Visualization'],
      ['Pages', 'Dashboard … Profile', 'Business orchestration'],
    ],
    [2000, 3600, 3760],
  ),
  spacer(),
  h2('12.1 Communication Patterns'),
  bullet('Props downward (e.g., NotificationPanel isOpen/onClose).'),
  bullet('Redux for auth/theme.'),
  bullet('RTK Query hooks for asynchronous resources.'),
  bullet('Context for sidebar width only.'),
  pageBreak(),
);

// ========================= 13 LAYOUT =========================
C.push(
  h1('13. Layout Structure'),
  h2('13.1 Layout'),
  p('Reads SidebarContext.collapsed and useLocation(). On /login, Sidebar and Header are hidden and main is full-bleed. Otherwise main receives left margin ml-20 or ml-64 depending on collapse state.'),
  h2('13.2 Sidebar'),
  bullet('Brand block using APP_NAME and APP_SIDEBAR_TAGLINE'),
  bullet('Static menu list with active route highlighting'),
  bullet('Expandable Developer Productivity submenu'),
  bullet('Collapse toggle; footer APP_FOOTER_TEXT'),
  h2('13.3 Header'),
  bullet('Search input (non-functional placeholder)'),
  bullet('Theme toggle'),
  bullet('Notifications bell → NotificationPanel'),
  bullet('Profile dropdown / mobile sheet: Profile, Settings, Logout'),
  h2('13.4 NotificationPanel'),
  p('Drawer listing notifications (max 8 shown), supporting mark-one and mark-all mutations with loading/empty states.'),
  pageBreak(),
);

// ========================= 14 MODULES =========================
C.push(
  h1('14. Business Modules'),
  h2('14.1 Login Module'),
  bullet('Purpose: Demo authentication gateway.'),
  bullet('Components: Login page form.'),
  bullet('Services: none (direct Redux).'),
  bullet('Business logic: Accept any credentials; default email demo@company.com if empty.'),
  bullet('API: none.'),
  bullet('Dependencies: authSlice, appConfig, UI inputs/buttons.'),
  bullet('Workflow: submit → dispatch login → /dashboard.'),
  bullet('Gaps: rememberMe unused; isSubmitting never cleared; password ignored.'),

  h2('14.2 Dashboard Module'),
  bullet('Purpose: Executive KPI overview and charts.'),
  bullet('Components: page-local cards/tables + Recharts.'),
  bullet('API: getDashboardStats, getDailyActivity, getProjects, getTeams.'),
  bullet('Business logic: render stats; some chart series use Math.random (non-deterministic).'),
  bullet('Dependencies: Skeleton, appConfig titles.'),
  bullet('Workflow: mount → parallel queries → skeleton → populated UI.'),

  h2('14.3 Teams Module'),
  bullet('Purpose: Visualize teams, leads, members.'),
  bullet('API: getTeams, getEmployees (for member chips).'),
  bullet('Workflow: load → map teams to cards with color accents.'),

  h2('14.4 Employees Module'),
  bullet('Purpose: Directory with search and team filter.'),
  bullet('API: getEmployees, getTeams.'),
  bullet('Business logic: client-side filter by name/email/team; show performance bars.'),

  h2('14.5 Projects Module'),
  bullet('Purpose: Project health and completion tracking.'),
  bullet('API: getProjects.'),
  bullet('UI: progress bars, status/health badges.'),

  h2('14.6 Daily Activity Module'),
  bullet('Purpose: Operational activity ledger.'),
  bullet('API: getDailyActivity, getTeams, getProjects.'),
  bullet('Business logic: client filter/sort/paginate (10/page) even though API supports filters.'),
  bullet('Workflow: fetch all → apply UI filters → table.'),

  h2('14.7 Reports Module'),
  bullet('Purpose: Generate typed analytical reports.'),
  bullet('API: lazy getTeamReport / getEmployeeReport / getProjectReport / getDailyReport.'),
  bullet('Business logic: select type + filters → Generate → render specialized view.'),
  bullet('Dependencies: hardcoded option lists (sample dates/entities).'),

  h2('14.8 Developer Productivity Module'),
  bullet('Purpose: Engineering productivity analytics.'),
  bullet('API: getCommitAnalytics, getAttendanceInsights, getWorkHours.'),
  bullet('Sections: overview, commits, attendance, hours, performance + advanced insights.'),
  bullet('Business logic: client filters; performance score weights commits/tasks/hours/attendance.'),
  bullet('Dependencies: Recharts heavily; large single file — refactor candidate.'),

  h2('14.9 Settings Module'),
  bullet('Purpose: Preference/system UI.'),
  bullet('API: none; buttons do not persist.'),
  bullet('Gap: theme select not wired to setTheme.'),

  h2('14.10 Profile Module'),
  bullet('Purpose: User profile display/edit.'),
  bullet('API: none; updateUser for name/email only.'),
  bullet('Many fields hardcoded (employee id, location, metrics).'),

  h2('14.11 Notifications Module (cross-cutting)'),
  bullet('Purpose: In-app alerts.'),
  bullet('API: getNotifications, markAsRead, markAllRead.'),
  bullet('Hosted in Header/NotificationPanel.'),
  pageBreak(),
);

// ========================= 15 API =========================
C.push(
  h1('15. API Documentation'),
  note('No real network I/O occurs today. Tables describe the logical contract the UI expects and the mock behavior. Replace queryFn with query/mutation when connecting the platform backend.'),
  h2('15.1 Cross-cutting Conventions'),
  bullet('Library: createApi from @reduxjs/toolkit/query/react'),
  bullet('Declared baseUrl: /api (unused while queryFn is active)'),
  bullet('Headers: none'),
  bullet('Auth: none'),
  bullet('Artificial latency: ~200–600ms'),
  bullet('Error object example: { status: 404, data: "..." }'),

  h2('15.2 Endpoint Catalog'),
  table(
    ['API Module', 'Endpoint', 'Method*', 'Payload/Args', 'Response', 'Used By'],
    [
      ['activityApi', 'getDailyActivity', 'GET', 'filters optional', 'DailyActivity[]', 'Dashboard, Activity'],
      ['activityApi', 'getDashboardStats', 'GET', '—', 'DashboardStats', 'Dashboard'],
      ['teamsApi', 'getTeams', 'GET', '—', 'Team[]', 'Multiple pages'],
      ['teamsApi', 'getTeamById', 'GET', 'id', 'Team', 'Unused'],
      ['employeesApi', 'getEmployees', 'GET', '—', 'Employee[]', 'Teams, Employees'],
      ['employeesApi', 'getEmployeeById', 'GET', 'id', 'Employee', 'Unused'],
      ['employeesApi', 'getEmployeesByTeam', 'GET', 'teamId', 'Employee[]', 'Unused'],
      ['projectsApi', 'getProjects', 'GET', '—', 'Project[]', 'Multiple pages'],
      ['projectsApi', 'getProjectById', 'GET', 'id', 'Project', 'Unused'],
      ['reportsApi', 'getReports', 'GET', '—', 'Report[]', 'Unused'],
      ['reportsApi', 'getTeamReport', 'GET', 'team key', 'TeamReportData', 'Reports'],
      ['reportsApi', 'getEmployeeReport', 'GET', 'id + dates', 'EmployeeReportData', 'Reports'],
      ['reportsApi', 'getProjectReport', 'GET', 'id + dates', 'ProjectReportData', 'Reports'],
      ['reportsApi', 'getDailyReport', 'GET', 'date', 'DailyReportData', 'Reports'],
      ['notificationsApi', 'getNotifications', 'GET', '—', 'Notification[]', 'Header'],
      ['notificationsApi', 'markAsRead', 'PATCH', 'id', 'Notification', 'Panel'],
      ['notificationsApi', 'markAllRead', 'PATCH', '—', 'Notification[]', 'Panel'],
      ['developerProductivityApi', 'getCommitAnalytics', 'GET', '—', 'commits+summaries', 'Dev Productivity'],
      ['developerProductivityApi', 'getAttendanceInsights', 'GET', '—', 'AttendancePoint[]', 'Dev Productivity'],
      ['developerProductivityApi', 'getWorkHours', 'GET', '—', 'WorkHourPoint[]', 'Dev Productivity'],
    ],
    [1700, 1700, 900, 1400, 1600, 2060],
  ),
  spacer(),
  p('*Method is the intended HTTP verb once mocks are replaced.'),
  h2('15.3 ActivityFilters Payload'),
  ...codeBlock([
    '{ teamId?, employeeId?, projectId?, status?, startDate?, endDate? }',
  ]),
  h2('15.4 DashboardStats Response'),
  ...codeBlock([
    '{ totalEmployees, activeToday, tasksCompletedToday, tasksPending,',
    '  teamPerformance /* % */, projectCompletion /* % */ }',
  ]),
  h2('15.5 Error Handling'),
  p('By-id mocks return 404-style RTK errors. UI pages rarely surface isError. Notification mutations swallow errors in empty catch blocks. Integrators should add normalized error toasts and global 401 handling.'),
  h2('15.6 Future HTTP Paths (comments in code)'),
  bullet('/api/github/commits or /api/gitlab/commits'),
  bullet('/api/attendance'),
  bullet('/api/work-hours'),
  bullet('Resource collections under /api/teams|employees|projects|activity|reports|notifications'),
  pageBreak(),
);

// ========================= 16 DATA FLOW =========================
C.push(
  h1('16. Data Flow'),
  h2('16.1 Current Mock Path'),
  ...codeBlock([
    'sequenceDiagram',
    '  participant Page',
    '  participant RTK as RTK Query',
    '  participant QF as queryFn',
    '  participant MD as mockData',
    '  Page->>RTK: useXQuery(args)',
    '  RTK->>QF: run',
    '  QF->>MD: read/filter',
    '  MD-->>QF: entities',
    '  QF-->>RTK: {data}',
    '  RTK-->>Page: render',
  ]),
  h2('16.2 Target Backend Path'),
  ...codeBlock([
    'sequenceDiagram',
    '  participant Page',
    '  participant RTK as RTK Query',
    '  participant HTTP as fetchBaseQuery',
    '  participant API as Platform API',
    '  participant DB as Database',
    '  Page->>RTK: hook',
    '  RTK->>HTTP: REST + Bearer',
    '  HTTP->>API: request',
    '  API->>DB: query',
    '  DB-->>API: rows',
    '  API-->>Page: JSON via RTK cache',
  ]),
  h2('16.3 Mutation Example (Notifications)'),
  p('markAsRead updates a module-level array, returns the entity, and invalidates notification tags so subscribers refetch.'),
  pageBreak(),
);

// ========================= 17 COMPONENT DOCS =========================
C.push(
  h1('17. Component Documentation'),
  table(
    ['Component', 'Key Props', 'Behavior'],
    [
      ['Button', 'variant, size, native button attrs', 'Styled variants primary/secondary/outline/ghost'],
      ['Card', 'children, className, onClick?', 'Elevates on clickable'],
      ['Badge', 'variant', 'success/warning/danger/info/default'],
      ['Input', 'label, error, input attrs', 'Labeled field'],
      ['Select', 'label, error, options[]', 'Native select wrapper'],
      ['Table*', 'children / onClick / sortable', 'Composable table primitives'],
      ['Skeleton', 'variant', 'Loading placeholders'],
      ['ProtectedRoute', 'children', 'Auth gate'],
      ['ThemeProvider', 'children', 'Syncs theme class on <html>'],
      ['TeamProductivityHeatmap', 'data, teams, month?', 'UNUSED heatmap grid'],
    ],
    [2600, 3200, 3560],
  ),
  pageBreak(),
);

// ========================= 18 HOOKS =========================
C.push(
  h1('18. Hooks Documentation'),
  table(
    ['Hook', 'Source', 'Params', 'Returns', 'Usage'],
    [
      ['useAppDispatch', 'store/hooks', '—', 'AppDispatch', 'Dispatch actions'],
      ['useAppSelector', 'store/hooks', 'selector', 'Selected state', 'Read store'],
      ['useSidebar', 'SidebarContext', '—', '{collapsed,setCollapsed}', 'Layout/Sidebar'],
    ],
    [2000, 1800, 1400, 2200, 1960],
  ),
  spacer(),
  p('Additionally, every createApi export yields generated hooks (useGetXQuery, useLazyYQuery, useZMutation). Prefer those over manual dispatch for server cache.'),
  pageBreak(),
);

// ========================= 19 UTILS =========================
C.push(
  h1('19. Utility Documentation'),
  p('No dedicated utils module exists. Notable helpers:'),
  table(
    ['Symbol', 'Location', 'Input', 'Output', 'Notes'],
    [
      ['generateTasks', 'mockData.ts', 'employees context', 'Task[]', 'Randomized; non-deterministic'],
      ['generateDailyActivity', 'mockData.ts', 'tasks + joins', 'DailyActivity[]', 'Denormalized rows'],
      ['clsx', 'UI components', 'class parts', 'string', 'Conditional classes'],
      ['date-fns helpers', 'pages/charts', 'Date', 'formatted', 'Locale formatting'],
    ],
    [2200, 1800, 1800, 1800, 1760],
  ),
  pageBreak(),
);

// ========================= 20 CONTEXT =========================
C.push(
  h1('20. Context Documentation'),
  h2('20.1 SidebarContext'),
  ...codeBlock([
    'type SidebarContextValue = {',
    '  collapsed: boolean;',
    '  setCollapsed: (value: boolean) => void;',
    '};',
  ]),
  bullet('Default collapsed = false'),
  bullet('Provider wraps routes in App.tsx'),
  bullet('useSidebar throws outside provider'),
  bullet('Not persisted across reloads'),
  pageBreak(),
);

// ========================= 21 SERVICES =========================
C.push(
  h1('21. Services Documentation'),
  p('There is no src/services layer yet. RTK Query API modules currently act as the service boundary. Recommended future services:'),
  bullet('services/http.ts — shared baseQuery with prepareHeaders'),
  bullet('services/authToken.ts — token read/write abstraction'),
  bullet('services/claude/* — AI client (see §33)'),
  bullet('services/analytics.ts — optional telemetry'),
  pageBreak(),
);

// ========================= 22 CONFIG =========================
C.push(
  h1('22. Configuration Files'),
  h2('22.1 package.json'),
  bullet('name: company-operations-tracker; version 1.0.0; type module'),
  bullet('scripts: dev, build (tsc && vite build), lint, preview'),
  h2('22.2 vite.config.ts'),
  bullet('React plugin; alias @ → ./src; server port 3000 open true'),
  h2('22.3 tsconfig.json'),
  bullet('strict; noUnusedLocals/Parameters; paths @/*; jsx react-jsx'),
  h2('22.4 tailwind.config.js'),
  bullet('content globs; darkMode class; primary color scale; pulse-slow'),
  h2('22.5 postcss.config.js'),
  bullet('tailwindcss + autoprefixer'),
  h2('22.6 ESLint / Prettier'),
  p('npm run lint references ESLint, but no eslint config file and no Prettier config are present in the tree. Add configs before enforcing CI lint.'),
  h2('22.7 appConfig.ts'),
  p('Central brand/copy constants (APP_NAME, titles, footer). Prefer edits here for white-label adjustments.'),
  pageBreak(),
);

// ========================= 23 ENV =========================
C.push(
  h1('23. Environment Variables'),
  p('None currently defined or read via import.meta.env.'),
  table(
    ['Recommended Variable', 'Purpose', 'Exposure'],
    [
      ['VITE_API_BASE_URL', 'Platform API origin for RTK baseQuery', 'Public (Vite)'],
      ['VITE_APP_ENV', 'development|staging|production', 'Public'],
      ['VITE_USE_MOCKS', 'Toggle mock queryFn vs real HTTP', 'Public'],
      ['VITE_AI_PROXY_URL', 'Browser→BFF AI endpoint', 'Public'],
      ['ANTHROPIC_API_KEY', 'Model provider secret', 'SERVER ONLY — never VITE_'],
    ],
    [2800, 4000, 2560],
  ),
  spacer(),
  note('.gitignore already ignores .env variants. Add .env.example when wiring backends.'),
  pageBreak(),
);

// ========================= 24 ERRORS =========================
C.push(
  h1('24. Error Handling'),
  table(
    ['Layer', 'Today', 'Recommendation'],
    [
      ['RTK queryFn', '404 objects for missing ids', 'Map to typed error union'],
      ['Pages', 'Mostly skeletons only', 'Render isError banners'],
      ['Notifications', 'Empty catch', 'Toast on failure'],
      ['Login', 'No failure path', 'Show auth errors'],
      ['Global', 'No ErrorBoundary', 'Boundary around Layout'],
      ['Toasts', 'Absent', 'Add lightweight toast system'],
    ],
    [2200, 3600, 3560],
  ),
  pageBreak(),
);

// ========================= 25 SECURITY =========================
C.push(
  h1('25. Security'),
  bullet('Demo auth flag in localStorage is forgeable — not production security.'),
  bullet('No Authorization headers on data access.'),
  bullet('React text escaping provides baseline XSS protection; sanitize any future Markdown/HTML from AI.'),
  bullet('No CSRF surface yet (no cookie-authenticated mutating APIs).'),
  bullet('Do not place model provider secrets in client bundles.'),
  bullet('When enabling real APIs: short-lived tokens, HTTPS only, RBAC for sensitive HR/monitoring data.'),
  pageBreak(),
);

// ========================= 26 PERF =========================
C.push(
  h1('26. Performance'),
  bullet('RTK Query caching avoids duplicate identical requests.'),
  bullet('No route-based code splitting yet.'),
  bullet('DeveloperProductivity page is large — split by section for parse/render gains.'),
  bullet('Remove Math.random chart seeds on Dashboard for stable renders.'),
  bullet('Skeleton loaders improve perceived latency during mock delays.'),
  bullet('lucide-react icons are tree-shakeable when imported per-icon.'),
  pageBreak(),
);

// ========================= 27 BUILD =========================
C.push(
  h1('27. Build Process'),
  ...codeBlock([
    'npm install',
    'npm run dev      # Vite HMR on :3000',
    'npm run build    # tsc typecheck + vite build → dist/',
    'npm run preview  # serve production build locally',
    'npm run lint     # requires ESLint config to succeed',
  ]),
  p('TypeScript must pass before Vite emits production assets because build runs tsc first.'),
  pageBreak(),
);

// ========================= 28 DEPLOY =========================
C.push(
  h1('28. Deployment'),
  p('This repository produces a static SPA in dist/. Host on any static provider (object storage + CDN, nginx, IIS, Vercel/Netlify). Configure fallback routing so unknown paths serve index.html for client-side routes.'),
  bullet('Set VITE_API_BASE_URL per environment at build time.'),
  bullet('No CI/CD workflows are bundled in the current tree — add pipeline for lint/test/build on pull requests.'),
  bullet('Cache hashed assets aggressively; do not long-cache index.html.'),
  pageBreak(),
);

// ========================= 29 DEPS =========================
C.push(
  h1('29. Dependency Analysis'),
  h2('29.1 Runtime Packages'),
  table(
    ['Package', 'Critical', 'Rationale'],
    [
      ['react / react-dom', 'Yes', 'UI runtime'],
      ['react-router-dom', 'Yes', 'SPA routing'],
      ['@reduxjs/toolkit', 'Yes', 'State + RTK Query'],
      ['react-redux', 'Yes', 'React bindings'],
      ['recharts', 'High', 'Charts'],
      ['lucide-react', 'Medium', 'Icons'],
      ['clsx', 'Medium', 'className helper'],
      ['date-fns', 'Medium', 'Date utilities'],
    ],
    [2800, 1400, 5160],
  ),
  spacer(),
  h2('29.2 Development Packages'),
  p('vite, @vitejs/plugin-react, typescript, tailwindcss, postcss, autoprefixer, eslint family, @types/react(-dom) — required for DX and production builds.'),
  pageBreak(),
);

// ========================= 30 CODE FLOW =========================
C.push(
  h1('30. Code Flow — Login to Logout'),
  numbered('Anonymous user lands on /login (or is redirected there).'),
  numbered('Login dispatches auth.login; flag persisted.'),
  numbered('Router renders protected Dashboard inside Layout chrome.'),
  numbered('User navigates modules via Sidebar; each page fires its queries.'),
  numbered('Header may open notifications and mutate read state.'),
  numbered('Profile can updateUser name/email in Redux memory.'),
  numbered('Logout clears auth; ProtectedRoute blocks features; user returns to Login.'),
  p('Throughout, ThemeProvider keeps document classes aligned with theme slice; SidebarContext only affects layout width.'),
  pageBreak(),
);

// ========================= 31 JOURNEY =========================
C.push(
  h1('31. Complete User Journey'),
  ...codeBlock([
    'flowchart LR',
    '  A[Open App] --> B[Login]',
    '  B --> C[Dashboard KPIs]',
    '  C --> D[Select Module]',
    '  D --> E[Teams/Employees/Projects]',
    '  D --> F[Daily Activity]',
    '  D --> G[Reports Generate]',
    '  D --> H[Developer Productivity]',
    '  C --> I[Notifications]',
    '  C --> J[Profile/Settings]',
    '  J --> K[Logout]',
    '  K --> B',
  ]),
  p('Data path for any module: UI event → RTK hook → mock (future API/DB) → cache → UI re-render.'),
  pageBreak(),
);

// ========================= 32 INTEGRATION =========================
C.push(
  h1('32. Integration Guide'),
  p('Another application will be integrated with this platform. Use the following extension points without renaming the current project.'),
  h2('32.1 Possible Integration Points'),
  bullet('New protected route + Sidebar entry'),
  bullet('New RTK Query API module registered in store.ts'),
  bullet('Shared Layout chrome or path-based chrome opt-out (pattern exists for /login)'),
  bullet('Shared auth token provider (to be introduced)'),
  bullet('Shared UI kit under components/ui'),
  h2('32.2 Shared APIs'),
  p('Prefer one platform API gateway. Both apps should consume the same resource contracts (Team, Employee, Project, etc.) via RTK Query or generated clients.'),
  h2('32.3 Shared Authentication'),
  p('Replace demo auth with a shared Auth module exposing getAccessToken(). All API slices must attach headers through one baseQuery factory. Do not trust localStorage.isLoggedIn alone across applications.'),
  h2('32.4 Shared Components'),
  bullet('Reuse Button/Card/Table/Badge for visual consistency.'),
  bullet('Avoid importing page internals across apps; extract shared widgets to components/shared or a package.'),
  h2('32.5 Routing Integration'),
  bullet('Mount secondary app under /apps/<name>/* before the catch-all * → /login route.'),
  bullet('Consider React.lazy for the secondary bundle.'),
  h2('32.6 State Sharing'),
  bullet('Share Redux store for auth/theme when co-bundled.'),
  bullet('For microfrontends, prefer token + event bus or module federation with carefully owned state slices.'),
  h2('32.7 Microfrontend Possibilities'),
  bullet('Module Federation / native ESM remotes'),
  bullet('iframe + postMessage (simplest isolation, weaker UX)'),
  bullet('Monorepo packages (ui, auth, api-client) consumed by both apps'),
  h2('32.8 Folder Recommendations'),
  ...codeBlock([
    'src/',
    '  features/<feature>/',
    '  services/http.ts',
    '  services/auth/',
    '  hooks/',
    '  utils/',
    '  apps/<integrated-app>/   # optional co-located remote UI',
  ]),
  h2('32.9 Best Practices'),
  numbered('Feature-flag mocks with VITE_USE_MOCKS during cutover.'),
  numbered('Contract-first TypeScript interfaces aligned to OpenAPI.'),
  numbered('Keep dependency direction: pages → features/services → types.'),
  numbered('Add CI checks before merging integration branches.'),
  pageBreak(),
);

// ========================= 33 CLAUDE =========================
C.push(
  h1('33. Future Claude AI Integration Guide'),
  h2('33.1 Recommended Architecture'),
  p('Never call the model provider directly from the browser with a secret key. Introduce a Backend-for-Frontend (BFF) / AI gateway that authenticates the user, applies rate limits, logs usage, and proxies streaming responses.'),
  ...codeBlock([
    'flowchart LR',
    '  SPA[Web Application] -->|JWT| BFF[AI Gateway]',
    '  BFF -->|API key| Claude[Claude Model API]',
    '  BFF --> Hist[(Conversation Store)]',
    '  SPA --> ChatUI[Assistant Feature UI]',
  ]),
  h2('33.2 Folder Structure'),
  ...codeBlock([
    'src/features/ai-assistant/',
    '  pages/AssistantPage.tsx',
    '  components/ChatWindow.tsx',
    '  components/MessageList.tsx',
    '  components/PromptComposer.tsx',
    '  components/StreamingText.tsx',
    '  hooks/useClaudeChat.ts',
    '  prompts/system/*.md',
    '  prompts/templates/*.ts',
    'src/services/claude/',
    '  claudeClient.ts',
    '  types.ts',
    'src/store/api/claudeApi.ts  # non-stream helpers optional',
  ]),
  h2('33.3 Service Layer'),
  bullet('startChat({ messages, context, signal }) → async iterable / SSE'),
  bullet('complete({ messages }) → final JSON for non-UI batch tasks'),
  bullet('Map domain entities (team/report snippets) into structured context'),
  h2('33.4 Prompt Manager'),
  bullet('Version system prompts as files; never hardcode long prompts in JSX.'),
  bullet('Separate system, tool, and user layers.'),
  bullet('Include safety instructions for HR/monitoring data.'),
  h2('33.5 Conversation History'),
  bullet('Client holds active thread; server persists per user for audit.'),
  bullet('Summarize older turns server-side to control context windows.'),
  h2('33.6 Streaming Responses'),
  bullet('SSE or fetch streams from BFF; AbortController on navigate.'),
  bullet('Render incremental tokens via StreamingText.'),
  h2('33.7 Caching / Logging / Security'),
  bullet('Cache idempotent explanations keyed by entity + prompt version.'),
  bullet('Log token usage and prompt hashes server-side; respect privacy policy.'),
  bullet('Sanitize Markdown/HTML; secrets only on server; JWT on every AI call.'),
  h2('33.8 Error Handling'),
  bullet('Normalize provider errors at BFF; show retryable UI on 429/5xx.'),
  h2('33.9 Context Management & Tools'),
  p('Prefer tool/function calling so the model requests getTeamReport(teamId) through the gateway instead of stuffing large datasets into prompts.'),
  h2('33.10 Scalability & Future Enhancements'),
  bullet('Queue long jobs; support multiple models; eval harness for prompt regressions.'),
  bullet('Role-aware tools (manager vs member).'),
  bullet('Embed assistant drawer globally from Header.'),
  ...codeBlock([
    'sequenceDiagram',
    '  actor U as User',
    '  participant UI as Chat UI',
    '  participant H as useClaudeChat',
    '  participant B as AI Gateway',
    '  participant C as Claude API',
    '  U->>UI: Ask question with team context',
    '  UI->>H: sendMessage',
    '  H->>B: POST /ai/chat (JWT, stream)',
    '  B->>C: messages + tools',
    '  C-->>B: tool_use',
    '  B->>B: call platform API',
    '  B->>C: tool_result',
    '  C-->>B: text deltas',
    '  B-->>UI: SSE tokens',
  ]),
  pageBreak(),
);

// ========================= 34-38 =========================
C.push(
  h1('34. Architecture Improvements'),
  bullet('Introduce services/http baseQuery with auth headers.'),
  bullet('Persist full auth session (user + tokens) safely.'),
  bullet('Add feature modules folder to reduce pages/ bloat.'),
  bullet('Enable route-level code splitting.'),
  bullet('Add ErrorBoundary + toast channel.'),
  bullet('Align README branding with Vigilon.'),
  bullet('Add OpenAPI-driven types for backend parity.'),

  h1('35. Refactoring Suggestions'),
  table(
    ['Item', 'Suggestion'],
    [
      ['DeveloperProductivity.tsx', 'Split into section components + hooks'],
      ['Unused API hooks / Heatmap', 'Delete or wire intentionally'],
      ['Duplicate User types', 'Unify auth user vs domain user'],
      ['Login form flags', 'Fix isSubmitting; wire or remove rememberMe'],
      ['Dashboard random series', 'Replace with deterministic mock/API data'],
      ['Settings forms', 'Persist via API or disable actions'],
      ['CSS keyframe duplication', 'Deduplicate in index.css'],
    ],
    [3600, 5760],
  ),

  h1('36. Risks'),
  bullet('Demo auth mistaken for production security.'),
  bullet('Mock contracts drift from real backend.'),
  bullet('Non-deterministic mocks complicate QA.'),
  bullet('Catch-all redirect to /login can break deep links for integrated apps if routes are mis-ordered.'),
  bullet('Large pages increase regression risk.'),
  bullet('Missing CI allows broken builds to merge.'),

  h1('37. Technical Debt'),
  bullet('ESLint config absent despite lint script.'),
  bullet('README still describes outdated product naming.'),
  bullet('Dead code paths (unused endpoints/components).'),
  bullet('Settings/Profile incomplete persistence.'),
  bullet('No automated tests in repository snapshot.'),
  bullet('Package name ≠ product name.'),

  h1('38. Best Practices'),
  numbered('Keep API contracts in types/; treat mockData as disposable.'),
  numbered('Prefer RTK Query tags for cache coherence.'),
  numbered('Do not commit secrets; use server env for AI keys.'),
  numbered('Add tests for auth guard and critical reducers before integration.'),
  numbered('Document new modules using the §14 template.'),
  numbered('Use conventional commits on development branch.'),
  pageBreak(),
);

// ========================= 39 ONBOARDING =========================
C.push(
  h1('39. Developer Onboarding Guide'),
  numbered('Install Node.js 18+.'),
  numbered('Clone repository; checkout development branch.'),
  numbered('npm install'),
  numbered('npm run dev → http://localhost:3000'),
  numbered('Sign in with any email/password.'),
  numbered('Walk Dashboard → Activity → Reports → Developer Productivity.'),
  numbered('Read App.tsx (routes), store.ts (data), appConfig.ts (branding), one file under store/api (mock pattern).'),
  numbered('Run npm run build to confirm TypeScript health.'),
  p('Mental model: Pages orchestrate → RTK hooks fetch → mocks return → UI renders. Auth is a boolean until replaced. Layout wraps all feature pages.'),
  pageBreak(),
);

// ========================= 40 APPENDIX =========================
C.push(
  h1('40. Appendix'),
  h2('40.1 Glossary'),
  table(
    ['Term', 'Definition'],
    [
      ['SPA', 'Single Page Application'],
      ['RTK Query', 'Redux Toolkit data fetching/caching'],
      ['queryFn', 'Custom data resolver bypassing HTTP'],
      ['BFF', 'Backend for Frontend'],
      ['ProtectedRoute', 'Client auth gate component'],
      ['Vigilon', 'Product brand of this web application'],
      ['Platform API', 'Future backend replacing mocks'],
    ],
    [2400, 6960],
  ),
  spacer(),
  h2('40.2 Important Files'),
  bullet('src/main.tsx, src/App.tsx'),
  bullet('src/store/store.ts, slices/authSlice.ts, slices/themeSlice.ts'),
  bullet('src/store/api/*.ts'),
  bullet('src/data/mockData.ts, src/types/index.ts, src/config/appConfig.ts'),
  bullet('src/components/routing/ProtectedRoute.tsx'),
  bullet('src/components/layout/*'),
  bullet('src/pages/*'),
  h2('40.3 Dependency Graph'),
  ...codeBlock([
    'pages → store hooks/api + components/ui + config',
    'store/api → types + data/mockData',
    'layout → auth + notificationsApi + SidebarContext + config',
    'ThemeProvider → theme slice',
    'ProtectedRoute → auth slice + router',
  ]),
  h2('40.4 Domain ER Sketch (logical future DB)'),
  ...codeBlock([
    'erDiagram',
    '  TEAM ||--o{ EMPLOYEE : contains',
    '  PROJECT ||--o{ TASK : includes',
    '  EMPLOYEE ||--o{ TASK : performs',
    '  EMPLOYEE ||--o{ NOTIFICATION : receives',
    '  EMPLOYEE ||--o{ ATTENDANCE : logs',
    '  EMPLOYEE ||--o{ COMMIT_METRICS : produces',
  ]),
  h2('40.5 Folder Tree (src condensed)'),
  ...codeBlock([
    'src/{main,App,index.css,vite-env.d.ts}',
    'src/config · contexts · types · data',
    'src/components/{ThemeProvider,routing,layout,ui,charts}',
    'src/pages/{Login,Dashboard,Teams,Employees,Projects,DailyActivity,',
    '           Reports,DeveloperProductivity,Settings,Profile}',
    'src/store/{store,hooks,slices,api}',
  ]),
  h2('40.6 Document Control'),
  coverField('Output file', 'Project_Detailed_Technical_Documentation.docx'),
  coverField('Generator', 'docs/generate-project-doc.mjs'),
  coverField('Baseline branch', 'development'),
  p('Regenerate after major structural changes: node docs/generate-project-doc.mjs', { before: 160 }),
);

// Scrub safety: ensure no forbidden third-party product token leaked
const FORBIDDEN = /\bFurtim\b/i;
function assertClean(nodes) {
  const walk = (n) => {
    if (!n) return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (typeof n === 'object') {
      for (const [k, v] of Object.entries(n)) {
        if (typeof v === 'string' && FORBIDDEN.test(v)) {
          throw new Error(`Forbidden token found in field ${k}: ${v}`);
        }
        if (v && typeof v === 'object') walk(v);
      }
    }
  };
  walk(nodes);
}
assertClean(C);

const doc = new Document({
  creator: 'Software Architecture & Documentation Engineering',
  title: 'Project Detailed Technical Documentation — Vigilon Platform',
  description: 'Complete technical handover documentation for the Vigilon web application',
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({
            text: 'Vigilon Platform — Detailed Technical Documentation',
            italics: true, size: 16, color: GRAY, font: 'Calibri',
          })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Confidential  |  Page ', size: 16, color: GRAY, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY, font: 'Calibri' }),
            new TextRun({ text: ' of ', size: 16, color: GRAY, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GRAY, font: 'Calibri' }),
          ],
        })],
      }),
    },
    children: C,
  }],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(OUT, buffer);
console.log('Wrote', OUT);
console.log('Size KB:', Math.round(buffer.length / 1024));
