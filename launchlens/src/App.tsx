import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Share2, 
  ArrowLeft, 
  Database,
  LayoutDashboard,
  Compass,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dashboard } from "@/components/dashboard";
import { AppShell } from "@/components/app-shell";

// Types
interface PresetIdea {
  title: string;
  niche: string;
  pitch: string;
}

interface ValidationData {
  score: number;
  niche: string;
  name: string;
  metrics: {
    demand: number;
    pay: number;
    competition: number;
    urgency: number;
  };
  pains: Array<{
    source: "reddit" | "twitter" | "hackernews";
    author: string;
    content: string;
    sentiment: "negative" | "frustrated";
    likes: number;
  }>;
  competitors: Array<{
    name: string;
    gap: string;
    moat: string;
  }>;
  aiPivots: string[];
  recommendation: string;
}

const presets: PresetIdea[] = [
  {
    title: "Web3 micro-donations",
    niche: "Fintech & Web3 Creator Economy",
    pitch: "ChainGive: Gasless, one-click Web3 micro-donations for content creators using stablecoins and social log-ins."
  },
  {
    title: "AI UI/UX Linter",
    niche: "Developer & Designer Productivity Tools",
    pitch: "DesignCop: An AST-based Figma plugin that lint-checks layouts in real-time, matching CSS tokens directly to production code."
  },
  {
    title: "Gym No-Code SaaS",
    niche: "Local Business Management Software",
    pitch: "FitSync: A white-label booking and membership SMS automation app designed specifically for boutique, local CrossFit boxes."
  }
];

export function App() {
  const [startupIdea, setStartupIdea] = useState("");
  const [currentView, setCurrentView] = useState<"input" | "scanning" | "report">("input");
  const [adminMode, setAdminMode] = useState(false);
  
  // Scanning Terminal State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  // Computed Validation Report State
  const [validationReport, setValidationReport] = useState<ValidationData | null>(null);

  // Sync hash routing if user clicks sidebar items
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/overview";
      const cleaned = hash.replace("#/", "");
      if (cleaned !== "overview") {
        setAdminMode(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Scroll terminal logs automatically
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Handle Preset Clicks
  const handlePresetSelect = (preset: PresetIdea) => {
    setStartupIdea(preset.pitch);
    runValidationScan(preset.pitch, preset.title);
  };

  // Run the Validation Scan
  const runValidationScan = (pitch: string, title?: string) => {
    if (!pitch.trim()) return;
    
    setCurrentView("scanning");
    setScanProgress(0);
    setTerminalLogs([]);

    const logs = [
      "🤖 LaunchLens Validation Crawler v2.4 initialized...",
      "🔍 parsing input query semantics...",
      `📝 Target Idea: "${pitch.slice(0, 75)}..."`,
      "🌐 Spawning sub-crawlers across public APIs...",
      "📶 Connect [REDDIT API]: Connected. Crawling r/startups, r/solopreneur, r/ProductHacker...",
      "📶 Connect [X CRAWLER]: Connected. Filtering real-time tweets for pain point intent...",
      "📶 Connect [PRODUCT HUNT]: Connected. Indexing launched products...",
      "📶 Connect [GOOGLE TRENDS]: Connected. Compiling keyword search volumes...",
      "📦 Crawled 1,240 social signals. Commencing natural language parsing...",
      "⚙️ Synthesizing market pain severity coefficient...",
      "📊 Aggregating direct competitor profiles...",
      "🧠 LaunchLens AI model compiling viability ratings and pivot models...",
      "✅ Scan successfully completed! Generating startup profile dashboard..."
    ];

    let currentLogIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        setScanProgress(Math.min(((currentLogIndex + 1) / logs.length) * 100, 100));
        currentLogIndex++;
      } else {
        clearInterval(interval);
        
        // Compile dynamic results based on input
        setTimeout(() => {
          generateReport(pitch, title);
          setCurrentView("report");
        }, 800);
      }
    }, 350);
  };

  const generateReport = (pitch: string, title?: string) => {
    const defaultTitle = title || "Your Custom Concept";
    
    // Choose dynamic or matching data
    if (pitch.toLowerCase().includes("micro-donation") || defaultTitle.includes("Web3")) {
      setValidationReport({
        name: "ChainGive",
        niche: "Fintech & Web3 Creator Economy",
        score: 87,
        metrics: { demand: 90, pay: 84, competition: 89, urgency: 85 },
        pains: [
          {
            source: "reddit",
            author: "u/content_king99",
            content: "I want to tip creators $0.50 for cool posts, but credit card processors take a flat $0.35 + 3% fee! That ruins micro-payments completely.",
            sentiment: "frustrated",
            likes: 142
          },
          {
            source: "twitter",
            author: "@web3_enthusiast",
            content: "Tip jars using standard crypto are terrible. Copy-pasting raw hex wallet addresses, checking gas fees, and signing metamask prompts just to send $1 is a massive user experience nightmare.",
            sentiment: "negative",
            likes: 89
          },
          {
            source: "hackernews",
            author: "digitalnomad",
            content: "Most micro-donation platforms hold your money until you reach $50, then charge ridiculous payout fees. A truly peer-to-peer payout framework would be game-changing.",
            sentiment: "frustrated",
            likes: 56
          }
        ],
        competitors: [
          { name: "Patreon", gap: "Centralized, high platform transaction cuts (8-12%), lacks true micro-payments.", moat: "Direct wallet-to-wallet micro-payouts using scalable L2 networks (Base/Arbitrum) with flat 0.5% cuts." },
          { name: "Gitcoin tips", gap: "Strictly developer-focused, complex setup requiring MetaMask / Web3 wallet.", moat: "Account abstraction enables instant web3 wallets via standard Google/X social logins." }
        ],
        aiPivots: [
          "Deploy one-click login utilizing Web3Auth for seamless onboarding of non-crypto users.",
          "Partner with premium Substack writers and indie bloggers for early SDK integrations.",
          "Provide auto-conversions to localized stablecoins (USDC) to bypass standard price volatility."
        ],
        recommendation: "Highly Viable. Strong consumer demand and powerful user pain points. Focus purely on removing the technical wallet friction to convert mainstream audiences."
      });
    } else if (pitch.toLowerCase().includes("linter") || defaultTitle.includes("AI UI/UX")) {
      setValidationReport({
        name: "DesignCop",
        niche: "Developer & Designer Productivity",
        score: 93,
        metrics: { demand: 95, pay: 92, competition: 94, urgency: 91 },
        pains: [
          {
            source: "reddit",
            author: "u/pixel_perfector",
            content: "I spent 4 hours today manually reviewing front-end pull requests because the engineering team completely ignored my Figma grid layout, margins, and border-radii values again.",
            sentiment: "frustrated",
            likes: 218
          },
          {
            source: "twitter",
            author: "@dev_designer_war",
            content: "Handing over Figma files is just throwing things over a massive brick wall. There needs to be an automated compiler that tells developers instantly if a layout is broken or out of sync with CSS tokens.",
            sentiment: "negative",
            likes: 174
          },
          {
            source: "hackernews",
            author: "front_end_guy",
            content: "We tried using Figma code exports, but they are incredibly messy and unusable in real React/Tailwind production apps. A clean linter on pull requests would save our sprints.",
            sentiment: "frustrated",
            likes: 95
          }
        ],
        competitors: [
          { name: "Zeplin", gap: "Purely static asset and spec inspector. No automated checking or PR workflows.", moat: "AST-based comparison engine that automatically scans GitHub PRs against the Figma single source of truth." },
          { name: "Anima App", gap: "Focuses on direct HTML generation, which usually yields unmaintainable code.", moat: "Acts strictly as a linter and QA tool, integrating directly into existing design systems and custom Tailwind configurations." }
        ],
        aiPivots: [
          "Publish a lightweight, high-performance Figma plugin first to seed designer interest.",
          "Integrate directly with GitHub actions as a design QA checker to automatically block out-of-spec PRs.",
          "Provide full support for custom CSS variables and Tailwind theme configurations."
        ],
        recommendation: "Elite Viability. Design-to-code alignment remains a multi-million dollar bottleneck for corporate product teams. High premium SaaS value potential."
      });
    } else if (pitch.toLowerCase().includes("gym") || defaultTitle.includes("Gym No-Code")) {
      setValidationReport({
        name: "FitSync",
        niche: "Local Business Management SaaS",
        score: 68,
        metrics: { demand: 70, pay: 65, competition: 62, urgency: 75 },
        pains: [
          {
            source: "reddit",
            author: "u/crossfit_box_boss",
            content: "Mindbody charges us $250 a month and is filled with bloat we never use! I just want my members to book a class slot and pay their dues via text without the massive overhead.",
            sentiment: "frustrated",
            likes: 94
          },
          {
            source: "twitter",
            author: "@boutiquefit",
            content: "We paid an agency $12,000 to build a custom booking application, and now it's breaking on iOS 17 and they are charging $200/hr for minor fixes. This is highway robbery.",
            sentiment: "negative",
            likes: 47
          },
          {
            source: "hackernews",
            author: "smallbiz_builder",
            content: "Most gym booking tools force members to register long logins. If we could automate scheduling through simple WhatsApp or SMS links, conversions would skyrocket.",
            sentiment: "frustrated",
            likes: 31
          }
        ],
        competitors: [
          { name: "Mindbody", gap: "Overpriced, bloated features, steep learning curve for local trainers.", moat: "Simple $49 flat monthly fee, white-labeled template design, focus entirely on mobile SMS class booking." },
          { name: "ClassPass", gap: "Eats into small business margins and acts as a generic aggregator.", moat: "Empowers direct owner-to-member relationships without taking heavy cut percentages." }
        ],
        aiPivots: [
          "Focus on boutique fitness niches first (CrossFit, Pilates, Yoga) where owner communities are tightly knit.",
          "Provide seamless Stripe/Apple Pay integrations directly within the text message booking flow.",
          "Automate gym intake waver forms and contract signing through mobile friendly webviews."
        ],
        recommendation: "Moderate Viability. Market is highly crowded but local gym owners are deeply frustrated with legacy fees. Winning strategy is hyper-focused local SEO and pricing simplicity."
      });
    } else {
      // Dynamic fallback for custom user inputs
      const derivedScore = Math.floor(Math.random() * 25) + 65; // 65-90
      setValidationReport({
        name: pitch.split(" ").slice(0, 2).join(" ") || "Your Startup Idea",
        niche: "Identified Product Market",
        score: derivedScore,
        metrics: { 
          demand: Math.floor(Math.random() * 20) + 70, 
          pay: Math.floor(Math.random() * 25) + 60, 
          competition: Math.floor(Math.random() * 30) + 50, 
          urgency: Math.floor(Math.random() * 20) + 75 
        },
        pains: [
          {
            source: "reddit",
            author: "u/early_adopter",
            content: `Existing tools in this domain do not solve this core problem well. I am still doing this manually with complicated spreadsheets and manual syncs daily.`,
            sentiment: "frustrated",
            likes: 45
          },
          {
            source: "twitter",
            author: "@founder_daily",
            content: `The pricing models of existing solutions for this are ridiculous. Small startups get completely priced out before they can even prove basic value.`,
            sentiment: "negative",
            likes: 32
          }
        ],
        competitors: [
          { name: "Manual Excel / GSheets", gap: "Extremely error-prone, highly labor intensive, lacks collaboration.", moat: "Fully automated SaaS framework designed to handle scaling loads instantly." },
          { name: "Legacy ERP Platforms", gap: "Complicated enterprise setups, high cost, slow interface speeds.", moat: "Sleek, product-led user experience focused strictly on high conversion speed." }
        ],
        aiPivots: [
          "Narrow your target audience specifically to small teams of 2 to 10 to establish early PMF.",
          "Differentiate from massive incumbents by focusing on speed, automated integrations, and elite design.",
          "Set up simple landing pages with waitlist forms to measure true buyer interest before writing code."
        ],
        recommendation: "Viable Concept. Social crawls show active frustration with manual workarounds. Build a fast, lightweight MVP specifically addressing the primary bottleneck."
      });
    }
  };

  const resetValidator = () => {
    setStartupIdea("");
    setCurrentView("input");
    setValidationReport(null);
  };

  return (
    <AppShell>
      {/* Dynamic Header Mode */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            LaunchLens
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {adminMode 
              ? "Platform performance, api ingestion rates, and founders active worldwide." 
              : "Futuristic Startup Validation Engine - Scans community channels for real customer proof."
            }
          </p>
        </div>
        
        {/* Toggle Mode Button */}
        <Button 
          onClick={() => setAdminMode(!adminMode)}
          variant="outline"
          className="flex items-center gap-2 border-primary/20 bg-background/50 hover:bg-accent/80 transition-all font-semibold"
        >
          {adminMode ? (
            <>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Switch to Idea Validator</span>
            </>
          ) : (
            <>
              <LayoutDashboard className="h-4 w-4 text-emerald-500" />
              <span>Switch to Admin Analytics</span>
            </>
          )}
        </Button>
      </div>

      {/* Render Selected View */}
      {adminMode ? (
        // RENDER EFFERD ADMIN DASHBOARD
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card/30 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-2">Global LaunchLens Telemetry</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Real-time visualization of aggregate validation activity across active accounts globally.
            </p>
            <Dashboard />
          </div>
        </div>
      ) : (
        // RENDER ACTIVE VALIDATION SANDBOX
        <div className="w-full">
          {currentView === "input" && (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="max-w-2xl text-center space-y-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.08)]">
                  <Compass className="h-6 w-6 animate-spin-slow" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold sm:text-3xl tracking-tight">
                    What are you building?
                  </h2>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Type a startup description or value proposition below. LaunchLens will crawl Reddit, X, Product Hunt, and Google Trends to calculate market viability.
                  </p>
                </div>

                {/* Input Area */}
                <div className="relative flex items-center">
                  <Input
                    placeholder="e.g. A marketplace that connects local chefs with families for healthy home-cooked meals..."
                    value={startupIdea}
                    onChange={(e) => setStartupIdea(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runValidationScan(startupIdea)}
                    className="h-14 pl-12 pr-32 bg-background/50 border-border/60 rounded-2xl text-base shadow-sm focus-visible:ring-1 focus-visible:ring-primary backdrop-blur-sm"
                  />
                  <div className="absolute left-4 text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </div>
                  <Button 
                    onClick={() => runValidationScan(startupIdea)}
                    disabled={!startupIdea.trim()}
                    className="absolute right-2 h-10 px-6 rounded-xl font-medium tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all"
                  >
                    <span>Validate</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Or select an elite concept preset to scan:
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.title}
                        onClick={() => handlePresetSelect(preset)}
                        className="group flex flex-col items-start text-left p-4 rounded-xl border border-border bg-card/20 hover:bg-card/50 hover:border-primary/30 transition-all backdrop-blur-sm"
                      >
                        <Badge className="mb-2 bg-primary/10 text-primary border border-primary/20 font-medium">
                          {preset.niche}
                        </Badge>
                        <span className="font-bold text-sm text-card-foreground group-hover:text-primary transition-colors">
                          {preset.title}
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {preset.pitch}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === "scanning" && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-full max-w-xl space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary animate-pulse" />
                    <span className="font-mono text-sm font-bold uppercase tracking-wider">
                      LaunchLens Crawl Engine
                    </span>
                  </div>
                  <Badge variant="outline" className="animate-pulse border-primary/30 text-primary">
                    Crawling APIs...
                  </Badge>
                </div>

                {/* Simulated Log Output Screen */}
                <div className="h-64 rounded-xl border border-border/80 bg-black/90 p-4 font-mono text-xs text-emerald-400 overflow-y-auto space-y-2 shadow-inner">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-muted-foreground select-none">&gt;</span>
                      <span className={log.includes("✅") ? "text-cyan-400 font-bold" : log.includes("📶") ? "text-amber-300" : ""}>
                        {log}
                      </span>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Aggregation Scan</span>
                    <span>{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(var(--primary),0.5)]"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === "report" && validationReport && (
            <div className="space-y-6">
              {/* Back to Validation Input */}
              <button 
                onClick={resetValidator}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Validate another idea</span>
              </button>

              {/* Validation Summary Header Card */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-xl">
                <div className="absolute inset-0 bg-radial-at-t from-primary/5 to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border border-primary/20 font-medium">
                        {validationReport.niche}
                      </Badge>
                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-semibold">
                        Proof Score Stable
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      {validationReport.name} Report
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                      {startupIdea}
                    </p>
                  </div>

                  {/* High fidelity Validation Dial */}
                  <div className="flex items-center gap-4 bg-background/40 border p-4 rounded-xl backdrop-blur-sm shadow-sm">
                    <div className="relative h-20 w-20 flex items-center justify-center">
                      {/* Gauge Circle */}
                      <svg className="absolute transform -rotate-90" width="80" height="80">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="rgba(255, 255, 255, 0.05)"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 * (1 - validationReport.score / 100)}
                          className="text-primary transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="font-mono text-2xl font-black">{validationReport.score}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Market Viability
                      </span>
                      <p className="text-sm font-bold text-foreground">
                        {validationReport.score >= 85 ? "Excellent Viability" : validationReport.score >= 70 ? "Moderate Viability" : "Refinement Needed"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Validated against 1,240 social feeds, Reddit forums, competitor matrices, and search analytics.</span>
                </div>
              </div>

              {/* Key Viability Sub-metrics */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Market Demand", val: validationReport.metrics.demand, desc: "Community discussion volume", color: "text-blue-500" },
                  { label: "Willingness to Pay", val: validationReport.metrics.pay, desc: "Active purchasing frustration", color: "text-emerald-500" },
                  { label: "Moat Feasibility", val: validationReport.metrics.competition, desc: "Incumbent gaps/weaknesses", color: "text-purple-500" },
                  { label: "Problem Urgency", val: validationReport.metrics.urgency, desc: "Frequency and severity level", color: "text-amber-500" }
                ].map((metric) => (
                  <Card key={metric.label} className="bg-card/25 hover:bg-card/40 transition-colors dark:bg-transparent">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {metric.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-3xl font-extrabold">{metric.val}%</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-normal">
                        {metric.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pains and Competitors grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Real-time Customer Pains Crawled */}
                <Card className="bg-card/25 backdrop-blur-md dark:bg-transparent">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span>Customer Proof & Pain Points Feed</span>
                    </CardTitle>
                    <CardDescription>
                      Actual statements aggregated from Reddit, Twitter (X), and HackerNews.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-border">
                    {validationReport.pains.map((pain, index) => (
                      <div key={index} className="p-4 space-y-2 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold capitalize px-1.5 py-0.5 rounded ${
                              pain.source === 'reddit' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                              pain.source === 'twitter' ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                            }`}>
                              {pain.source}
                            </span>
                            <span>{pain.author}</span>
                          </div>
                          <span>❤ {pain.likes} upvotes</span>
                        </div>
                        <p className="text-sm italic font-medium leading-relaxed">
                          "{pain.content}"
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Direct Competitors Matrix */}
                <Card className="bg-card/25 backdrop-blur-md dark:bg-transparent">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="h-5 w-5 text-primary" />
                      <span>Direct Competitor Gap Analysis</span>
                    </CardTitle>
                    <CardDescription>
                      How your startup builds a strategic moat over current legacy incumbents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-border">
                    {validationReport.competitors.map((comp, index) => (
                      <div key={index} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-foreground">{comp.name}</h4>
                          <span className="text-xs text-rose-500 font-semibold uppercase flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            <span>Vulnerable Gap</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs leading-normal">
                          <div className="bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-lg">
                            <span className="font-bold block text-rose-500 mb-1">Their Weakness:</span>
                            <span className="text-muted-foreground">{comp.gap}</span>
                          </div>
                          <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                            <span className="font-bold block text-emerald-500 mb-1">Your Moat Advantage:</span>
                            <span className="text-muted-foreground">{comp.moat}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* AI Pivot Recommendations */}
              <Card className="border-primary/20 bg-card/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <span>LaunchLens AI Pivot Engine</span>
                  </CardTitle>
                  <CardDescription>
                    Recommended adjustments to maximize conversion rates and scale value propositions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm font-semibold text-foreground leading-relaxed">
                    🎯 <span className="font-bold">Summary Verdict: </span>{validationReport.recommendation}
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                      Strategic Pivot Roadmap:
                    </span>
                    <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                      {validationReport.aiPivots.map((pivot, i) => (
                        <li key={i} className="text-muted-foreground">
                          <span className="text-foreground font-medium">{pivot}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t flex flex-wrap gap-3">
                    <Button 
                      className="shadow-lg shadow-primary/20 font-bold"
                      onClick={() => alert("Report Exported! (Simulated PDF download initiated.)")}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Export Validation PDF</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetValidator}
                      className="font-bold"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span>Validate Another Startup</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

export default App;
