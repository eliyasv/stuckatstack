import { QuestionnaireAnswers, StackRecommendation, AlternativesConsidered, TechnologyChoice, SourceReference } from '@/types';

/**
 * Source database - authoritative references for recommendations
 */
const SOURCES: Record<string, SourceReference> = {
  // Books
  DDIA: {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    type: 'book',
    year: 2017,
    link: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321"
  },
  SRE: {
    title: "Site Reliability Engineering",
    author: "Google",
    type: 'book',
    year: 2016,
    link: "https://sre.google/books/"
  },
  Microservices: {
    title: "Building Microservices",
    author: "Sam Newman",
    type: 'book',
    year: 2021,
    link: "https://www.amazon.com/Building-Microservices-2nd-Designing-Systems/dp/1492034029"
  },
  Accelerate: {
    title: "Accelerate: The Science of Lean Software and DevOps",
    author: "Nicole Forsgren et al.",
    type: 'book',
    year: 2018,
    link: "https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339"
  },
  LeanStartup: {
    title: "The Lean Startup",
    author: "Eric Ries",
    type: 'book',
    year: 2011,
    link: "https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898"
  },
  EvolutionaryArch: {
    title: "Building Evolutionary Architectures",
    author: "Neal Ford, Rebecca Parsons, Patrick Kua",
    type: 'book',
    year: 2020,
    link: "https://www.amazon.com/Building-Evolutionary-Architectures-2nd-Support/dp/1492048186"
  },
  TeamTopologies: {
    title: "Team Topologies",
    author: "Matthew Skelton & Manuel Pais",
    type: 'book',
    year: 2019,
    link: "https://www.amazon.com/Team-Topologies-Organizing-Business-Technology/dp/1942788819"
  },
  HighPerfNetworking: {
    title: "High Performance Browser Networking",
    author: "Ilya Grigorik",
    type: 'book',
    year: 2013,
    link: "https://hpbn.co/"
  },
  RedisInAction: {
    title: "Redis in Action",
    author: "Josiah L. Carlson",
    type: 'book',
    year: 2013,
    link: "https://www.amazon.com/Redis-Action-Josiah-L-Carlson/dp/1617290858"
  },
  MonolithFirst: {
    title: "Monolith First (Article)",
    author: "Martin Fowler",
    type: 'blog',
    year: 2015,
    link: "https://martinfowler.com/bliki/MonolithFirst.html"
  },
  
  // Engineering Blogs
  NetflixTech: {
    title: "Netflix Tech Blog",
    author: "Netflix Engineering",
    type: 'blog',
    link: "https://netflixtechblog.com/"
  },
  UberEngineering: {
    title: "Uber Engineering Blog",
    author: "Uber",
    type: 'blog',
    link: "https://www.uber.com/blog/engineering/"
  },
  AWSPatterns: {
    title: "AWS Architecture Blog",
    author: "Amazon Web Services",
    type: 'blog',
    link: "https://aws.amazon.com/blogs/architecture/"
  },
};

/**
 * Dynamic decision engine - generates recommendations and explanations
 * based on the specific combination of answers, not predefined templates.
 */
export class DecisionEngine {
  recommend(answers: QuestionnaireAnswers): StackRecommendation {
    const backend = this.selectBackend(answers);
    const frontend = this.selectFrontend(answers);
    const database = this.selectDatabase(answers);
    const deployment = this.selectDeployment(answers);

    const backendDetails = this.getBackendDetails(backend, answers);
    const frontendDetails = this.getFrontendDetails(frontend, answers);
    const databaseDetails = this.getDatabaseDetails(database, answers);
    const deploymentDetails = this.getDeploymentDetails(deployment, answers);

    return {
      backend,
      frontend,
      database,
      deployment,
      reasoning: this.generateReasoning(answers, { backend, frontend, database, deployment }),
      scalingStrategy: this.generateScalingStrategy(answers),
      scalingRoadmap: this.generateScalingRoadmap(answers),
      estimatedHosting: this.estimateCost(answers),
      backendDetails,
      frontendDetails,
      databaseDetails,
      deploymentDetails,
    };
  }

  private selectBackend(answers: QuestionnaireAnswers): string {
    const factors: string[] = [];
    
    // AI/ML requirement
    if (answers.aiIntegration || answers.appType === 'ai-app') {
      return 'Python + FastAPI';
    }
    
    // Real-time at scale
    if (answers.realTimeFeatures && ['10k-100k', '100k+'].includes(answers.expectedUsers)) {
      return answers.budget === 'high' ? 'Go' : 'Node.js + Socket.IO';
    }
    
    // Compliance requirements
    if (answers.compliance === 'hipaa') {
      return 'Python + Django';  // Built-in security controls
    }
    
    // Team size and budget
    if (answers.teamSize === 'solo' || answers.budget === 'low') {
      return 'Node.js + Express';  // Fastest development
    }
    
    if (answers.teamSize === 'funded-team' && answers.budget === 'high') {
      return 'Go + Microservices';
    }
    
    // Time to market
    if (answers.timeToMarket === 'fast') {
      return 'Node.js + Express';
    }
    
    if (answers.timeToMarket === 'long-term') {
      return 'Go or Rust';
    }
    
    // App type specific
    if (answers.appType === 'saas') return 'Node.js + NestJS';
    if (answers.appType === 'marketplace') return 'Node.js + Express';
    if (answers.appType === 'social-app') return 'Node.js + Socket.IO';
    if (answers.appType === 'internal-tool') return 'Python + Django';
    
    return 'Node.js + Express';
  }

  private selectFrontend(answers: QuestionnaireAnswers): string {
    // Social apps need PWA for mobile
    if (answers.appType === 'social-app') {
      return 'Next.js + PWA';
    }
    
    // Internal tools can use low-code
    if (answers.appType === 'internal-tool' && answers.timeToMarket === 'fast') {
      return 'Next.js or Retool';
    }
    
    // Funded teams can invest in strict TS
    if (answers.budget === 'high' && answers.timeToMarket === 'long-term') {
      return 'Next.js with strict TypeScript';
    }
    
    // Default: Next.js for all cases (SSR, SEO, API routes)
    return 'Next.js';
  }

  private selectDatabase(answers: QuestionnaireAnswers): string {
    const parts: string[] = [];
    
    // Primary database
    if (answers.compliance === 'hipaa') {
      parts.push('PostgreSQL with TDE (Transparent Data Encryption)');
    } else if (answers.compliance === 'gdpr') {
      parts.push('PostgreSQL with data anonymization');
    } else if (answers.appType === 'social-app') {
      parts.push('PostgreSQL + Cassandra');
    } else if (answers.budget === 'low') {
      parts.push('PostgreSQL (Supabase free tier)');
    } else {
      parts.push('PostgreSQL');
    }
    
    // Add caching layer when needed
    if (answers.realTimeFeatures || answers.expectedUsers === '100k+') {
      parts.push('Redis');
    } else if (['medium', 'high'].includes(answers.budget)) {
      parts.push('Redis (caching)');
    }
    
    // Add search for marketplaces/social
    if (['marketplace', 'social-app'].includes(answers.appType) && answers.budget === 'high') {
      parts.push('Elasticsearch');
    }
    
    return parts.join(' + ');
  }

  private selectDeployment(answers: QuestionnaireAnswers): string {
    // Compliance dictates deployment
    if (answers.compliance === 'hipaa') {
      return 'AWS HIPAA-eligible services (BAA required)';
    }
    
    if (answers.compliance === 'gdpr') {
      return 'EU hosting (Hetzner, OVH, or AWS EU regions)';
    }
    
    // Budget and team size
    if (answers.budget === 'low' && answers.teamSize === 'solo') {
      return 'Vercel (frontend) + Railway (backend)';
    }
    
    if (answers.budget === 'low' && answers.teamSize === 'small-team') {
      return 'Vercel + Fly.io';
    }
    
    if (answers.budget === 'medium') {
      return 'AWS ECS or DigitalOcean App Platform';
    }
    
    if (answers.budget === 'high') {
      return 'Kubernetes (EKS/GKE)';
    }
    
    // Time to market
    if (answers.timeToMarket === 'fast') {
      return 'Vercel (zero-config deployment)';
    }
    
    return 'Vercel + Railway';
  }

  private generateReasoning(
    answers: QuestionnaireAnswers,
    selection: { backend: string; frontend: string; database: string; deployment: string }
  ): string {
    const paragraphs: string[] = [];
    
    // Opening based on primary constraint
    if (answers.budget === 'low' && answers.teamSize === 'solo') {
      paragraphs.push(
        `As a solo founder with limited budget, your primary constraint is **development velocity**, not technology perfection. ` +
        `This stack prioritizes rapid iteration and minimal operational overhead.`
      );
    } else if (answers.compliance === 'hipaa') {
      paragraphs.push(
        `HIPAA compliance fundamentally changes the architecture. **Security and auditability take priority over speed**. ` +
        `Every component is chosen for its compliance capabilities and ability to sign a BAA.`
      );
    } else if (answers.compliance === 'gdpr') {
      paragraphs.push(
        `GDPR compliance requires **data residency, portability, and erasure capabilities**. ` +
        `This stack ensures EU data stays in EU and provides APIs for data export/deletion.`
      );
    } else if (answers.aiIntegration || answers.appType === 'ai-app') {
      paragraphs.push(
        `AI workloads have unique requirements: **GPU access, async inference, and model serving**. ` +
        `Python is non-negotiable for the ML ecosystem - it has TensorFlow, PyTorch, and Hugging Face.`
      );
    } else if (answers.realTimeFeatures) {
      paragraphs.push(
        `Real-time features at scale require **event-driven architecture and WebSocket handling**. ` +
        `The C10K problem (10,000+ concurrent connections) dictates non-blocking I/O.`
      );
    } else if (answers.timeToMarket === 'fast') {
      paragraphs.push(
        `Speed to market is your competitive advantage. **Ship fast, learn faster**. ` +
        `This stack minimizes setup time and maximizes developer productivity.`
      );
    } else if (answers.timeToMarket === 'long-term') {
      paragraphs.push(
        `Long-term thinking justifies **upfront investment in type safety and maintainability**. ` +
        `The extra complexity pays dividends as the codebase grows.`
      );
    }
    
    // Backend explanation
    const backendExp = this.explainBackend(selection.backend, answers);
    paragraphs.push(`**Backend: ${selection.backend}** — ${backendExp.explanation}`);

    // Frontend explanation
    const frontendExp = this.explainFrontend(selection.frontend, answers);
    paragraphs.push(`**Frontend: ${selection.frontend}** — ${frontendExp.explanation}`);

    // Database explanation
    const databaseExp = this.explainDatabase(selection.database, answers);
    paragraphs.push(`**Database: ${selection.database}** — ${databaseExp.explanation}`);

    // Deployment explanation
    const deploymentExp = this.explainDeployment(selection.deployment, answers);
    paragraphs.push(`**Deployment: ${selection.deployment}** — ${deploymentExp.explanation}`);
    
    return paragraphs.join('\n\n');
  }

  private explainBackend(backend: string, answers: QuestionnaireAnswers): { explanation: string; sources: SourceReference[] } {
    const explanations: Record<string, { text: string; sources: string[] }> = {
      'Python + FastAPI':
        {
          text: `Python dominates AI/ML (TensorFlow, PyTorch, scikit-learn, Hugging Face). ` +
        `FastAPI provides async I/O for handling multiple inference requests concurrently, automatic OpenAPI documentation, ` +
        `and Pydantic validation at API boundaries. Performance is 2-3x faster than Flask due to Starlette foundation. ` +
        `Trade-off: Python's GIL limits CPU parallelism, but for I/O-bound ML inference this is acceptable.`,
          sources: ['DDIA']
        },

      'Node.js + Express':
        {
          text: `JavaScript/TypeScript everywhere reduces context switching. ` +
        `Express is minimal but mature, with the largest ecosystem (npm). Event loop architecture handles ` +
        `concurrent requests efficiently. Easy to find developers and contractors.`,
          sources: ['MonolithFirst']
        },

      'Node.js + Socket.IO':
        {
          text: `WebSocket handling is Node.js's strength. ` +
        `Socket.IO provides automatic reconnection, room-based pub/sub, and fallback to long-polling. ` +
        `Event loop architecture (similar to nginx) handles 10,000+ concurrent connections.`,
          sources: ['HighPerfNetworking']
        },

      'Node.js + NestJS':
        {
          text: `Angular-inspired architecture for Node.js. ` +
        `Dependency injection enables testable code, modules define clear boundaries, ` +
        `guards/interceptors handle cross-cutting concerns. TypeScript-first catches bugs at compile time. ` +
        `Worth the complexity at 5+ developers.`,
          sources: ['Microservices']
        },

      'Go':
        {
          text: `Goroutine-based concurrency (CSP model). ` +
        `Goroutines use 2KB stack vs 1MB threads (can spawn millions). Channels for safe communication. ` +
        `Compiled language provides better CPU utilization and type safety. ` +
        `Ideal for CPU-bound workloads and microservices.`,
          sources: ['SRE']
        },

      'Go + Microservices':
        {
          text: `Microservices make sense at 20+ engineers (Conway's Law). ` +
        `Go excels at distributed systems: fast compilation, small binaries, built-in concurrency. ` +
        `Service mesh (Istio/Linkerd) at 10+ services provides discovery, load balancing, mTLS.`,
          sources: ['Microservices']
        },

      'Python + Django':
        {
          text: `Django provides built-in security controls accelerating compliance. ` +
        `Authentication (PBKDF2), admin interface with audit logging, ORM prevents SQL injection, ` +
        `CSRF/XSS protection built-in. For HIPAA, this saves months of security development.`,
          sources: ['SRE']
        },

      'Go or Rust':
        {
          text: `Go: simple language (learn in weekend), fast compilation, excellent tooling. ` +
        `Rust: memory safety without garbage collection, zero-cost abstractions, steeper learning curve. ` +
        `Both provide type safety and performance for long-term maintainability.`,
          sources: ['EvolutionaryArch']
        },
    };

    const data = explanations[backend] || { text: `Selected based on your requirements.`, sources: [] };
    return {
      explanation: data.text,
      sources: data.sources.map(key => SOURCES[key]).filter(Boolean)
    };
  }

  private explainFrontend(frontend: string, answers: QuestionnaireAnswers): { explanation: string; sources: SourceReference[] } {
    let text = '';
    const sources: string[] = [];

    if (frontend.includes('PWA')) {
      text = `Social apps need mobile-first experience. ` +
        `PWA provides app-like experience with offline support (service workers), push notifications, ` +
        `and optimistic UI updates. Critical for user retention on mobile.`;
      sources.push('HighPerfNetworking');
    } else if (frontend.includes('Retool')) {
      text = `Internal tools prioritize development speed over UX. ` +
        `Retool provides drag-and-drop components with database integration. ` +
        `80% of internal tools can be built without custom code.`;
      sources.push('TeamTopologies');
    } else if (frontend.includes('strict')) {
      text = `Strict TypeScript catches bugs at compile time. ` +
        `Better IDE support, self-documenting code, easier refactoring. ` +
        `The upfront type definition investment pays dividends as the team grows.`;
      sources.push('Accelerate');
    } else {
      text = `Next.js provides server-side rendering (SEO), ` +
        `API routes (can replace separate backend initially), image optimization (Core Web Vitals), ` +
        `and file-based routing. Vercel deployment is zero-config with preview deployments.`;
      sources.push('Accelerate');
    }

    return {
      explanation: text,
      sources: sources.map(key => SOURCES[key]).filter(Boolean)
    };
  }

  private explainDatabase(database: string, answers: QuestionnaireAnswers): { explanation: string; sources: SourceReference[] } {
    let text = '';
    const sources: string[] = [];

    if (database.includes('TDE')) {
      text = `Transparent Data Encryption ensures data at rest is encrypted (AES-256). ` +
        `Column-level encryption for sensitive fields (SSN, diagnoses). ` +
        `pgAudit extension provides detailed query logging for compliance audits. ` +
        `Row-Level Security enforces access control at database level (defense in depth).`;
      sources.push('SRE');
    } else if (database.includes('anonymization')) {
      text = `GDPR requires data minimization and anonymization. ` +
        `PostgreSQL provides pg_anonymize extension, Foreign Data Wrappers for data portability, ` +
        `and Logical Replication for data residency (keep EU data in EU).`;
      sources.push('DDIA');
    } else if (database.includes('Cassandra')) {
      text = `Social apps need high write throughput for activity feeds. ` +
        `Cassandra is write-optimized (billions of writes/day) with eventual consistency. ` +
        `Used by Instagram, Discord for feed storage. PostgreSQL handles user data and relationships (ACID).`;
      sources.push('DDIA');
    } else if (database.includes('Supabase')) {
      text = `Supabase free tier provides managed PostgreSQL with benefits: ` +
        `500MB storage (enough for 10K+ users), real-time subscriptions, auto-generated REST API, ` +
        `Row-Level Security (GDPR-ready), and authentication included (saves 40+ hours).`;
      sources.push('LeanStartup');
    } else if (database.includes('Redis')) {
      text = `Redis implements the Cache-Aside pattern. ` +
        `Caches expensive queries, stores sessions, enables pub/sub for real-time features. ` +
        `TTL-based invalidation for simplicity, or write-through for consistency.`;
      sources.push('RedisInAction', 'DDIA');
    } else {
      text = `PostgreSQL is the default for good reason: 30+ years of development, ` +
        `ACID compliance, rich features (JSONB, full-text search, geospatial), ` +
        `strong community (security patches), and multiple hosting options (avoid lock-in).`;
      sources.push('DDIA');
    }

    return {
      explanation: text,
      sources: sources.map(key => SOURCES[key]).filter(Boolean)
    };
  }

  private explainDeployment(deployment: string, answers: QuestionnaireAnswers): { explanation: string; sources: SourceReference[] } {
    let text = '';
    const sources: string[] = [];

    if (deployment.includes('HIPAA')) {
      text = `You must sign a BAA (Business Associate Agreement) ` +
        `with any vendor handling PHI. AWS HIPAA-eligible services include RDS, S3, EC2. ` +
        `Network architecture: VPC with private subnets (no public IPs for DB), NAT Gateway for outbound, ` +
        `Security Groups as virtual firewalls, VPC Flow Logs for network audit trail.`;
      sources.push('SRE');
    } else if (deployment.includes('EU')) {
      text = `GDPR Article 44-50 restricts international data transfers. ` +
        `EU data must stay in EU unless adequacy decision exists (UK, Japan) or SCCs are in place. ` +
        `Hetzner (German), OVHcloud (French), or AWS eu-central-1 (Frankfurt) ensure data residency. ` +
        `Cloudflare CDN with EU edge locations for performance.`;
      sources.push('SRE');
    } else if (deployment.includes('Vercel') && answers.budget === 'low') {
      text = `Zero-config deployment is critical for solo founders. ` +
        `Vercel free tier: 100GB bandwidth/month, preview deployments for every PR, automatic HTTPS/CDN. ` +
        `Railway: $5/month for 512MB RAM with PostgreSQL included. ` +
        `Total: $5-20/month. Git push = production.`;
      sources.push('Accelerate');
    } else if (deployment.includes('Kubernetes')) {
      text = `Kubernetes provides portability (avoid cloud lock-in), ` +
        `ecosystem (Helm, Operators), industry standard (easier hiring), and advanced deployments ` +
        `(canary, blue-green). Requires: platform team expertise (2-3 engineers), monitoring stack ` +
        `(Prometheus, Grafana), security hardening (CIS benchmarks), quarterly upgrades.`;
      sources.push('SRE');
    } else {
      text = `Managed services reduce operational burden, ` +
        `letting the team focus on product development. Auto-scaling, backups, and monitoring included.`;
      sources.push('Accelerate');
    }

    return {
      explanation: text,
      sources: sources.map(key => SOURCES[key]).filter(Boolean)
    };
  }

  private getBackendDetails(backend: string, answers: QuestionnaireAnswers): AlternativesConsidered {
    const backendExplanation = this.explainBackend(backend, answers);
    const chosen: TechnologyChoice = {
      name: backend,
      explanation: backendExplanation.explanation,
      sources: backendExplanation.sources,
    };

    const rejected: AlternativesConsidered['rejected'] = [];

    // Common alternatives based on what was NOT chosen
    if (!backend.includes('Python')) {
      rejected.push({
        name: 'Python + FastAPI/Django',
        reason: answers.aiIntegration 
          ? 'Python would be ideal for AI/ML, but may have performance limitations for CPU-bound tasks' 
          : 'Python adds unnecessary complexity when JavaScript/TypeScript stack suffices',
        whenToUse: 'AI/ML workloads, data science applications, rapid prototyping with Django',
      });
    }

    if (!backend.includes('Go')) {
      rejected.push({
        name: 'Go',
        reason: answers.teamSize === 'solo' || answers.timeToMarket === 'fast'
          ? 'Go has steeper learning curve and longer development time for MVP'
          : 'Go excels at microservices but adds complexity for monolithic architectures',
        whenToUse: 'High-performance microservices, CPU-bound workloads, systems programming',
      });
    }

    if (!backend.includes('Node.js')) {
      rejected.push({
        name: 'Node.js + Express/NestJS',
        reason: answers.budget === 'high' && answers.expectedUsers === '100k+'
          ? 'Node.js may face performance bottlenecks at extreme scale compared to Go/Rust'
          : 'Node.js single-threaded model can be limiting for CPU-intensive tasks',
        whenToUse: 'Full-stack JavaScript teams, I/O-bound applications, real-time features',
      });
    }

    if (!backend.includes('Rust')) {
      rejected.push({
        name: 'Rust',
        reason: 'Rust has the steepest learning curve and longest development time, best for performance-critical systems',
        whenToUse: 'Performance-critical systems, memory safety requirements, embedded systems',
      });
    }

    return { chosen, rejected: rejected.slice(0, 3) };
  }

  private getFrontendDetails(frontend: string, answers: QuestionnaireAnswers): AlternativesConsidered {
    const frontendExplanation = this.explainFrontend(frontend, answers);
    const chosen: TechnologyChoice = {
      name: frontend,
      explanation: frontendExplanation.explanation,
      sources: frontendExplanation.sources,
    };

    const rejected: AlternativesConsidered['rejected'] = [];

    if (!frontend.includes('Next.js')) {
      rejected.push({
        name: 'Next.js',
        reason: 'Next.js provides SSR/SEO benefits but adds build complexity; may be overkill for internal tools',
        whenToUse: 'SEO-critical apps, content sites, when you need SSR or API routes',
      });
    }

    rejected.push({
      name: 'React SPA (Vite/CRA)',
      reason: answers.appType === 'saas' || answers.appType === 'marketplace'
        ? 'SPA lacks SSR which hurts SEO and initial load performance'
        : 'SPA is viable but Next.js provides better performance out of the box',
      whenToUse: 'Dashboards, internal tools, apps behind authentication',
    });

    rejected.push({
      name: 'Vue.js / Nuxt',
      reason: 'Vue has smaller ecosystem and fewer hiring options compared to React ecosystem',
      whenToUse: 'Teams with Vue expertise, simpler projects, progressive migration from jQuery',
    });

    if (!frontend.includes('PWA')) {
      rejected.push({
        name: 'PWA (Progressive Web App)',
        reason: answers.appType !== 'social-app'
          ? 'PWA adds service worker complexity; native apps may be better for mobile-first experiences'
          : 'Consider React Native if you need deep native integration',
        whenToUse: 'Mobile-first apps, offline-first requirements, push notifications',
    });
    }

    return { chosen, rejected: rejected.slice(0, 3) };
  }

  private getDatabaseDetails(database: string, answers: QuestionnaireAnswers): AlternativesConsidered {
    const databaseExplanation = this.explainDatabase(database, answers);
    const chosen: TechnologyChoice = {
      name: database,
      explanation: databaseExplanation.explanation,
      sources: databaseExplanation.sources,
    };

    const rejected: AlternativesConsidered['rejected'] = [];

    if (!database.includes('PostgreSQL')) {
      rejected.push({
        name: 'PostgreSQL',
        reason: 'PostgreSQL is the default for most use cases; not chosen due to specific requirements',
        whenToUse: 'Relational data, ACID compliance, complex queries, JSONB flexibility',
      });
    }

    if (!database.includes('MongoDB')) {
      rejected.push({
        name: 'MongoDB',
        reason: 'MongoDB lacks ACID transactions (multi-document) and schema enforcement; can lead to data quality issues',
        whenToUse: 'Document storage, rapid prototyping, content management, event logging',
      });
    }

    if (!database.includes('MySQL')) {
      rejected.push({
        name: 'MySQL',
        reason: 'MySQL has fewer advanced features than PostgreSQL (JSON, full-text search, extensions)',
        whenToUse: 'Simple read-heavy workloads, WordPress/Laravel ecosystems, legacy compatibility',
      });
    }

    if (!database.includes('Redis')) {
      rejected.push({
        name: 'Redis',
        reason: answers.realTimeFeatures 
          ? 'Redis should be added as cache layer when real-time features are needed'
          : 'Redis adds operational complexity; can be added later when caching is needed',
        whenToUse: 'Caching, sessions, real-time features, pub/sub, leaderboards',
      });
    }

    if (!database.includes('DynamoDB')) {
      rejected.push({
        name: 'DynamoDB',
        reason: 'DynamoDB locks you into AWS ecosystem; requires careful access pattern design upfront',
        whenToUse: 'AWS-native apps, extreme scale, serverless architectures',
      });
    }

    return { chosen, rejected: rejected.slice(0, 3) };
  }

  private getDeploymentDetails(deployment: string, answers: QuestionnaireAnswers): AlternativesConsidered {
    const deploymentExplanation = this.explainDeployment(deployment, answers);
    const chosen: TechnologyChoice = {
      name: deployment,
      explanation: deploymentExplanation.explanation,
      sources: deploymentExplanation.sources,
    };

    const rejected: AlternativesConsidered['rejected'] = [];

    if (!deployment.includes('Kubernetes')) {
      rejected.push({
        name: 'Kubernetes (EKS/GKE/AKS)',
        reason: answers.teamSize !== 'funded-team' || answers.budget !== 'high'
          ? 'Kubernetes requires dedicated platform team (2-3 engineers) and adds significant operational overhead'
          : 'Kubernetes may be premature optimization for early-stage products',
        whenToUse: '20+ engineers, multi-cloud requirements, complex microservices (10+)',
      });
    }

    if (!deployment.includes('Vercel')) {
      rejected.push({
        name: 'Vercel + Serverless',
        reason: 'Vercel can get expensive at scale; cold starts for serverless functions; vendor lock-in',
        whenToUse: 'Frontend-heavy apps, JAMstack, rapid prototyping, preview deployments',
      });
    }

    rejected.push({
      name: 'Traditional VPS (DigitalOcean/Linode)',
      reason: 'Manual server management, no auto-scaling, requires DevOps expertise for security/updates',
      whenToUse: 'Cost-sensitive projects, full control requirements, predictable workloads',
    });

    if (!deployment.includes('AWS')) {
      rejected.push({
        name: 'AWS (EC2/ECS)',
        reason: 'AWS has steep learning curve, complex pricing, and operational overhead for small teams',
        whenToUse: 'Enterprise scale, compliance requirements, full cloud ecosystem needed',
    });
    }

    return { chosen, rejected: rejected.slice(0, 3) };
  }

  private generateScalingStrategy(answers: QuestionnaireAnswers): string {
    const strategies: string[] = [];
    
    if (answers.budget === 'low') {
      strategies.push('Start with monolith on free tiers');
      strategies.push('Focus on finding PMF, not premature optimization');
      strategies.push('Use managed services to avoid DevOps overhead');
    } else if (answers.compliance === 'hipaa') {
      strategies.push('Security over speed - comprehensive audit logging');
      strategies.push('VPC and private subnets exclusively');
      strategies.push('Regular third-party security assessments');
    } else if (answers.realTimeFeatures) {
      strategies.push('Horizontal scaling with sticky sessions (WebSocket stateful)');
      strategies.push('Redis Cluster for pub/sub');
      strategies.push('Circuit breakers to prevent cascade failures');
    } else if (answers.budget === 'high') {
      strategies.push('Service mesh for observability (Istio/Linkerd)');
      strategies.push('Event-driven architecture (Kafka/SNS/SQS)');
      strategies.push('Define SLOs and error budgets');
    } else {
      strategies.push('Start simple, monitor bottlenecks');
      strategies.push('Add caching before adding complexity');
      strategies.push('Scale horizontally when needed');
    }
    
    if (answers.timeToMarket === 'fast') {
      strategies.push('Ship fast, iterate based on feedback');
      strategies.push('Technical debt acceptable if it accelerates learning');
    }
    
    return strategies.join('. ') + '.';
  }

  private generateScalingRoadmap(answers: QuestionnaireAnswers): StackRecommendation['scalingRoadmap'] {
    const scale = answers.expectedUsers;
    const budget = answers.budget;
    
    const costMultiplier = budget === 'high' ? 3 : budget === 'low' ? 0.5 : 1;
    
    if (scale === '0-1k') {
      return {
        stage1: `Launch (0-1K users): Single server or managed platform, managed database with automated backups, CDN for static assets. Focus: ship features, get user feedback. Cost: $${Math.round(50 * costMultiplier)}-${Math.round(100 * costMultiplier)}/mo.`,
        stage2: `Optimize (1K-10K): Add Redis caching (Cache-Aside pattern), database connection pooling (PgBouncer), query optimization with EXPLAIN ANALYZE. Focus: implement observability (metrics, logs, traces). Cost: $${Math.round(100 * costMultiplier)}-${Math.round(300 * costMultiplier)}/mo.`,
        stage3: `Growth (10K+): Horizontal scaling with load balancer, database read replicas, background job processing (Bull/Celery). Focus: define SLOs, implement circuit breakers. Cost: $${Math.round(300 * costMultiplier)}-${Math.round(1000 * costMultiplier)}/mo.`,
      };
    }
    
    if (scale === '1k-10k') {
      return {
        stage1: `Foundation (1K-10K): Managed services with auto-scaling, CDN with edge caching, comprehensive monitoring (APM, logs, metrics). Focus: CI/CD pipeline, automated testing (70%+ coverage). Cost: $${Math.round(100 * costMultiplier)}-${Math.round(400 * costMultiplier)}/mo.`,
        stage2: `Scaling (10K-100K): Database read replicas, Redis cluster, message queue (Bull/RabbitMQ) for async processing. Focus: distributed tracing, error budgets. Cost: $${Math.round(400 * costMultiplier)}-${Math.round(1500 * costMultiplier)}/mo.`,
        stage3: `Maturity (100K+): Microservices for independent scaling, event-driven architecture (Kafka/RabbitMQ), database sharding. Focus: chaos engineering, multi-region deployment. Cost: $${Math.round(1500 * costMultiplier)}-${Math.round(5000 * costMultiplier)}/mo.`,
      };
    }
    
    if (scale === '10k-100k') {
      return {
        stage1: `Scale (10K-100K): Multi-AZ deployment for high availability, database with read replicas, circuit breakers and retry logic. Focus: capacity planning, on-call rotation. Cost: $${Math.round(500 * costMultiplier)}-${Math.round(2500 * costMultiplier)}/mo.`,
        stage2: `Distribution (100K-1M): Service mesh (Istio/Linkerd) for traffic management, distributed caching (Redis cluster), database sharding by tenant or data type. Focus: edge computing, canary deployments. Cost: $${Math.round(2500 * costMultiplier)}-${Math.round(10000 * costMultiplier)}/mo.`,
        stage3: `Global (1M+): Multi-region deployment with data locality, global CDN with edge computing, federated database architecture. Focus: automated incident response, compliance across regions. Cost: $${Math.round(10000 * costMultiplier)}+/mo.`,
      };
    }
    
    return {
      stage1: `Enterprise (100K+): Kubernetes cluster with auto-scaling, service mesh for observability and security, managed database with multi-AZ. Focus: platform team, golden paths for developers. Cost: $${Math.round(2000 * costMultiplier)}-${Math.round(10000 * costMultiplier)}/mo.`,
      stage2: `Global (1M+): Multi-region Kubernetes deployment, database federation with conflict resolution, global CDN with edge functions. Focus: real-time analytics, ML for capacity planning. Cost: $${Math.round(10000 * costMultiplier)}-${Math.round(50000 * costMultiplier)}/mo.`,
      stage3: `Hyper-scale (10M+): Regional data centers for compliance, custom infrastructure optimizations, dedicated teams per service. Focus: hardware-level optimization, regulatory automation. Cost: $${Math.round(50000 * costMultiplier)}+/mo.`,
    };
  }

  private estimateCost(answers: QuestionnaireAnswers): string {
    const baseCosts: Record<string, number> = {
      '0-1k': 50,
      '1k-10k': 200,
      '10k-100k': 1000,
      '100k+': 5000,
    };
    
    const budgetMultipliers: Record<string, number> = {
      'low': 0.3,
      'medium': 1,
      'high': 3,
    };
    
    const complianceAddons: Record<string, number> = {
      'none': 0,
      'gdpr': 100,
      'hipaa': 500,
    };
    
    let cost = baseCosts[answers.expectedUsers] || 50;
    cost *= budgetMultipliers[answers.budget] || 1;
    cost += complianceAddons[answers.compliance] || 0;
    
    if (answers.aiIntegration) cost *= 2;  // GPU costs
    if (answers.realTimeFeatures) cost *= 1.5;  // WebSocket infrastructure
    
    const max = Math.round(cost * 2);
    const min = Math.round(cost * 0.5);
    
    return `$${min}-${max}/month initially`;
  }
}

let instance: DecisionEngine | null = null;
export function getDecisionEngine(): DecisionEngine {
  if (!instance) instance = new DecisionEngine();
  return instance;
}
