// Recommendation content data - separated from logic for faster compilation
export interface RecommendationContent {
  backend: string;
  frontend: string;
  database: string;
  deployment: string;
  reasoning: string;
  scalingStrategy: string;
  estimatedHosting?: string;
  detailedWhy: Record<string, string>;
}

export const RECOMMENDATIONS: Record<string, RecommendationContent> = {
  // AI Applications
  'ai-app': {
    backend: 'Python + FastAPI',
    frontend: 'Next.js',
    database: 'PostgreSQL + Redis',
    deployment: 'Docker + AWS/GCP',
    reasoning: 'Python dominates AI/ML (TensorFlow, PyTorch, scikit-learn). FastAPI provides async I/O for concurrent inference requests.',
    scalingStrategy: 'Start monolithic. Use Celery for background tasks. Cache predictions aggressively. Scale: TensorFlow Serving, feature stores.',
    detailedWhy: {
      backend: 'Python: TensorFlow, PyTorch, Hugging Face ecosystem. FastAPI: async I/O, auto OpenAPI docs, Pydantic validation. Reference: DDIA Ch.4 on async I/O.',
      database: 'PostgreSQL: ACID for user data. Redis: Cache-Aside pattern for expensive predictions, sessions, pub/sub.',
      deployment: 'Docker for reproducibility. GPU: NVIDIA Container Toolkit, model quantization (FP16/INT8). Reference: Google SRE Ch.13.',
    },
  },
  // Real-time High Traffic
  'realtime-high': {
    backend: 'Node.js + Socket.IO or Go',
    frontend: 'Next.js',
    database: 'PostgreSQL + Redis (pub/sub)',
    deployment: 'AWS ALB + Auto-scaling',
    reasoning: 'C10K requires non-blocking I/O. Node.js event loop excels at WebSocket handling. Go provides superior CPU performance.',
    scalingStrategy: 'Horizontal scaling with sticky sessions. Redis Cluster for pub/sub. Circuit breakers prevent cascade failures.',
    detailedWhy: {
      backend: 'Node.js: event loop, libuv, Socket.IO (reconnection, rooms). Go: goroutines (2KB stack), channels, compiled performance.',
      database: 'PostgreSQL: pg_partman, PgBouncer pooling. Redis pub/sub: fan-out pattern, cross-server communication.',
      deployment: 'Sticky sessions required. AWS ALB supports WebSocket. Monitor: connections, latency (p50/p99), reconnection rate.',
    },
  },
  // HIPAA Compliance
  'hipaa': {
    backend: 'Python + Django',
    frontend: 'Next.js',
    database: 'PostgreSQL with TDE',
    deployment: 'AWS HIPAA-eligible (BAA required)',
    reasoning: 'HIPAA requires access controls, audit logging, encryption. Django provides built-in security controls accelerating compliance.',
    scalingStrategy: 'Security over speed. Comprehensive audit logging. VPC private subnets only. Third-party assessments. MFA for admin.',
    detailedWhy: {
      backend: 'Django: auth (PBKDF2), admin audit, ORM (SQL injection prevention), CSRF/XSS protection. Log all PHI access.',
      database: 'PostgreSQL: pgcrypto (TDE), column encryption, pgAudit, Row-Level Security. Encrypted backups, test quarterly.',
      deployment: 'BAA required. AWS HIPAA-eligible (RDS, S3, EC2). VPC private subnets, NAT Gateway, Security Groups, VPC Flow Logs.',
    },
  },
  // GDPR Compliance
  'gdpr': {
    backend: 'Node.js + Express',
    frontend: 'Next.js',
    database: 'PostgreSQL with anonymization',
    deployment: 'EU hosting (Hetzner/OVH/AWS EU)',
    reasoning: 'GDPR requires data portability, erasure, EU residency. Build export/deletion APIs from day one.',
    scalingStrategy: 'Partition by region. Data export APIs. Automated deletion with audit trails. Consent records with timestamps.',
    detailedWhy: {
      backend: 'Build: Export API (JSON/XML, 30 days), Deletion API, Consent Management (granular, withdrawable, versioned).',
      database: 'PostgreSQL: Foreign Data Wrappers, Row-Level Security, Logical Replication, pg_anonymize, pg_cron.',
      deployment: 'EU data in EU. Hetzner, OVHcloud, AWS eu-central-1. Cloudflare CDN (EU edge). Avoid US analytics.',
    },
  },
  // Low Budget Solo
  'low-solo': {
    backend: 'Node.js + Express',
    frontend: 'Next.js',
    database: 'Supabase (free tier)',
    deployment: 'Vercel + Railway',
    reasoning: 'Solo founders need maximum velocity. TypeScript full-stack, free tiers, zero DevOps, focus on PMF.',
    scalingStrategy: 'Monolith on free tiers. Focus PMF not optimization. Automate everything. Tech debt OK for learning.',
    estimatedHosting: '$0-20/month',
    detailedWhy: {
      backend: 'TypeScript everywhere. npm ecosystem. Monolith First (Fowler) - microservices need 10+ engineers.',
      frontend: 'Next.js: SSR (SEO), API routes, image optimization. Templates: T3 App, shadcn/ui.',
      database: 'Supabase free: 500MB, real-time, auto REST API, RLS, auth included (saves 40hrs).',
      deployment: 'Vercel: free 100GB/mo, previews. Railway: $5/mo 512MB, PostgreSQL. Total: $5-20/mo.',
    },
  },
  // Low Budget Team
  'low-team': {
    backend: 'Node.js + Express',
    frontend: 'Next.js',
    database: 'Neon or Supabase',
    deployment: 'Vercel + Fly.io',
    reasoning: 'Small teams balance speed/maintainability. Managed services reduce ops burden.',
    scalingStrategy: 'Managed services. CI/CD day one. Feature flags. Monitoring. Document ADRs. Plan bus factor.',
    estimatedHosting: '$20-50/month',
    detailedWhy: {
      backend: 'Team Topology: minimize handoffs, full-stack developers. Choose based on expertise not hype.',
      database: 'Neon: branching (Git for DB), scale-to-zero. Supabase: auth, real-time, auto APIs.',
      deployment: 'Vercel: previews, rollbacks. Fly.io: global edge, $1.50/GB. GitHub Actions CI/CD.',
    },
  },
  // Medium Budget
  'medium': {
    backend: 'Node.js + NestJS or Go',
    frontend: 'Next.js',
    database: 'Managed PostgreSQL + Redis',
    deployment: 'AWS ECS or DigitalOcean',
    reasoning: 'Medium budget allows managed services reducing ops. Building scale foundations.',
    scalingStrategy: 'Managed DB with replicas. Monitoring (DataDog/Grafana). Staging=prod. Testing 70%+. Plan sharding.',
    estimatedHosting: '$100-300/month',
    detailedWhy: {
      backend: 'NestJS: DI, modules, guards, TS-first. Worth at 5+ devs. Go: CPU, concurrency, microservices.',
      database: 'Managed PostgreSQL: backups (PITR), multi-AZ, replicas. Redis Cache-Aside pattern.',
      deployment: 'AWS ECS: containers, Fargate, scaling. IaC: Terraform/CDK.',
    },
  },
  // High Budget Funded
  'high-funded': {
    backend: 'Go + Microservices',
    frontend: 'Next.js + TypeScript',
    database: 'Aurora + Redis + Elasticsearch',
    deployment: 'Kubernetes (EKS/GKE)',
    reasoning: 'Funded teams invest in scale. Microservices enable independence. Kubernetes with complexity.',
    scalingStrategy: 'Service mesh. Event-driven (Kafka). Observability (Jaeger/Prometheus). Multi-region. SLOs/error budgets.',
    estimatedHosting: '$500-2000+/month',
    detailedWhy: {
      backend: 'Microservices at 20+ engineers (Conway Law). Go: fast compile, goroutines, stdlib. Service mesh at 10+ services.',
      database: 'Aurora: auto-storage (128TB), 15 replicas. Polyglot: PostgreSQL, Redis, Elasticsearch, S3.',
      deployment: 'Kubernetes at 20+ microservices. Requires platform team (2-3), on-call. Alternative: ECS.',
    },
  },
  // Fast Time to Market
  'fast': {
    backend: 'Node.js + Express',
    frontend: 'Next.js',
    database: 'Supabase or Firebase',
    deployment: 'Vercel',
    reasoning: 'Speed critical: opinionated frameworks, BaaS, zero-config. Optimize learning not scale.',
    scalingStrategy: 'Ship fast, iterate feedback. Monitor basics. Refactor after PMF. Document tech debt backlog.',
    detailedWhy: {
      backend: 'Lean Startup: validate minimum effort. Node.js: 5min setup, npm, Stack Overflow.',
      database: 'Supabase: auth (40hrs), auto APIs (weeks), real-time. Firebase: Firestore, auth, Cloud Functions.',
      deployment: 'Vercel: git-push=prod, zero config, rollback. CI/CD: git-push-test-deploy.',
    },
  },
  // Long-term Scalable
  'long-term': {
    backend: 'Go or Rust',
    frontend: 'Next.js (strict TS)',
    database: 'PostgreSQL with replicas',
    deployment: 'Kubernetes',
    reasoning: 'Long-term benefits from type safety, performance. Go/Rust foundations. Investment pays dividends.',
    scalingStrategy: 'Testing (unit/integration/e2e). DDD. Fitness functions. Eventual consistency. Monitoring. ADRs.',
    detailedWhy: {
      backend: 'Evolutionary Architecture. Go: simple, idiomatic, fast compile. Rust: memory safety (no GC), zero-cost.',
      database: 'PostgreSQL scale (Instagram, Apple): ACID, features, community. Replicas, sharding.',
      deployment: 'Kubernetes: portability, ecosystem, standard. Requires expertise, monitoring, security.',
    },
  },
  // SaaS
  'saas': {
    backend: 'Node.js + NestJS',
    frontend: 'Next.js',
    database: 'PostgreSQL (multi-tenant)',
    deployment: 'Vercel + AWS',
    reasoning: 'SaaS needs multi-tenancy, subscriptions. NestJS modular. Plan tenancy early.',
    scalingStrategy: 'Tenant isolation day one. RLS cost-effective. Usage metering. Feature flags. Enterprise custom.',
    detailedWhy: {
      backend: 'Multi-tenancy: DB per tenant (isolation), Schema per tenant, RLS (cost-effective). Stripe Billing.',
      database: 'Row-Level Security: CREATE POLICY tenant_isolation. Tenant ID: subdomain, JWT, header.',
    },
  },
  // Marketplace
  'marketplace': {
    backend: 'Node.js + Express',
    frontend: 'Next.js',
    database: 'PostgreSQL + Redis',
    deployment: 'AWS + Stripe Connect',
    reasoning: 'Marketplaces need real-time, split payments, trust. Focus trust mechanisms.',
    scalingStrategy: 'Escrow payments. Reputation algorithms. Webhooks. Separate services. Fraud detection.',
    detailedWhy: {
      backend: 'Two-sided platform: buyers/sellers, transactions, trust, liquidity. Stripe Connect: split payments, KYC.',
      database: 'Entities: users, listings, transactions (state machine), reviews. Immutable records, escrow.',
    },
  },
  // Social App
  'social-app': {
    backend: 'Node.js + Socket.IO',
    frontend: 'Next.js + PWA',
    database: 'PostgreSQL + Redis + Cassandra',
    deployment: 'Multi-region + CDN',
    reasoning: 'Social needs real-time, feeds, write throughput. Mobile-first (PWA). Plan viral growth.',
    scalingStrategy: 'Fan-out feeds (push/pull). CDN media. Mobile-first. Rate limit. Auto-scale viral.',
    detailedWhy: {
      backend: 'Feed: Fan-out Write (push, <10K followers), Fan-out Load (pull, celebrities), Hybrid.',
      database: 'PostgreSQL: users, relationships. Redis: feed cache, presence. Cassandra: write-optimized billions/day.',
      deployment: 'Latency: feed <200ms, real-time <100ms. Multi-region: active-active, DB/region, async.',
    },
  },
  // Internal Tool
  'internal-tool': {
    backend: 'Python + Django',
    frontend: 'Next.js or Retool',
    database: 'PostgreSQL',
    deployment: 'Internal VPC',
    reasoning: 'Internal prioritizes speed. Django Admin/Retool accelerate. Security/access focus.',
    scalingStrategy: 'Security (SSO, RBAC). Integrate (Slack/Google). Minimal managed. Document. Low-code.',
    detailedWhy: {
      backend: 'Internal: employees tolerate bugs, speed priority. Django Admin: auto CRUD, auth, ORM.',
      database: 'PostgreSQL: existing sources, replicas, RLS. ETL (Airflow/dbt), warehouse, APIs.',
      deployment: 'Simplicity over scale. Docker Compose, internal K8s, VM. VPN, internal LB, no public.',
    },
  },
  // Default
  'default': {
    backend: 'Node.js + Express',
    frontend: 'Next.js',
    database: 'PostgreSQL',
    deployment: 'Vercel + Railway',
    reasoning: 'Solid, proven stack. Great DX, docs, community. Cannot go wrong.',
    scalingStrategy: 'Start monolith. Monitor bottlenecks. Scale horizontal. Cache before complexity.',
    estimatedHosting: '$20-100/month',
    detailedWhy: {
      backend: 'Node.js: TS everywhere, npm, hiring, scale (Netflix/Uber). Next.js: React conventions, SSR.',
      database: 'PostgreSQL: 30+ years, ACID, features (JSONB/full-text/geo), managed, open source.',
      deployment: 'Vercel: git-push=prod, previews, HTTPS/CDN. Railway: $5/mo, PostgreSQL, auto-deploy.',
    },
  },
};

// Scaling roadmaps by user scale
export const SCALING_ROADMAPS: Record<string, { stage1: string; stage2: string; stage3: string }> = {
  '0-1k': {
    stage1: 'Launch (0-1K): Single server/managed, managed DB backups, CDN, basic monitoring. Focus: ship, feedback. Cost: $0-50/mo.',
    stage2: 'Optimize (1K-10K): Redis Cache-Aside, PgBouncer, query optimization, logging/alerting. Focus: observability, runbooks. Cost: $50-200/mo.',
    stage3: 'Growth (10K+): Horizontal scaling, read replicas, background jobs, microservices hot paths. Focus: SLOs, circuit breakers. Cost: $200-1000+/mo.',
  },
  '1k-10k': {
    stage1: 'Foundation (1K-10K): Managed auto-scaling, managed DB, CDN, monitoring (APM/logs). Focus: CI/CD, testing 70%+. Cost: $100-300/mo.',
    stage2: 'Scaling (10K-100K): Read replicas, Redis cluster, message queue, rate limiting. Focus: distributed tracing, error budgets. Cost: $300-1000/mo.',
    stage3: 'Maturity (100K+): Microservices, event-driven (Kafka), DB sharding, service mesh. Focus: chaos engineering, multi-region. Cost: $1000-5000+/mo.',
  },
  '10k-100k': {
    stage1: 'Scale (10K-100K): Multi-AZ, managed DB replicas, circuit breakers/retries. Focus: observability, capacity, on-call. Cost: $500-2000/mo.',
    stage2: 'Distribution (100K-1M): Service mesh (Istio), Redis cluster, DB sharding, eventual consistency. Focus: edge, canary. Cost: $2000-10000/mo.',
    stage3: 'Global (1M+): Multi-region, global CDN edge, federated DB, dedicated SRE. Focus: chaos, automated incident. Cost: $10000+/mo.',
  },
  '100k+': {
    stage1: 'Enterprise (100K+): Kubernetes auto-scaling, service mesh, managed DB multi-AZ. Focus: platform team, golden paths. Cost: $2000-10000/mo.',
    stage2: 'Global (1M+): Multi-region K8s, DB federation, global CDN edge. Focus: analytics, ML capacity. Cost: $10000-50000/mo.',
    stage3: 'Hyper-scale (10M+): Regional DCs, custom optimizations, dedicated teams, 99.99%+. Focus: hardware, custom silicon. Cost: $50000+/mo.',
  },
};
