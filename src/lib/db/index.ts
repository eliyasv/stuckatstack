import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'stuckatstack.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(database: Database.Database): void {
  // Create recommendations table
  database.exec(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_type TEXT NOT NULL,
      expected_users TEXT NOT NULL,
      real_time_features INTEGER NOT NULL,
      budget TEXT NOT NULL,
      team_size TEXT NOT NULL,
      ai_integration INTEGER NOT NULL,
      compliance TEXT NOT NULL,
      time_to_market TEXT NOT NULL,
      backend TEXT NOT NULL,
      frontend TEXT NOT NULL,
      database_rec TEXT NOT NULL,
      deployment TEXT NOT NULL,
      scaling_strategy TEXT NOT NULL,
      reasoning TEXT NOT NULL,
      scaling_roadmap TEXT NOT NULL,
      estimated_hosting TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create index for faster queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_recommendations_created_at 
    ON recommendations(created_at DESC)
  `);
}

export interface SaveRecommendationParams {
  appType: string;
  expectedUsers: string;
  realTimeFeatures: boolean;
  budget: string;
  teamSize: string;
  aiIntegration: boolean;
  compliance: string;
  timeToMarket: string;
  backend: string;
  frontend: string;
  databaseRec: string;
  deployment: string;
  scalingStrategy: string;
  reasoning: string;
  scalingRoadmap: string;
  estimatedHosting?: string;
}

export function saveRecommendation(params: SaveRecommendationParams): number {
  const database = getDatabase();
  
  const stmt = database.prepare(`
    INSERT INTO recommendations (
      app_type, expected_users, real_time_features, budget, team_size,
      ai_integration, compliance, time_to_market,
      backend, frontend, database_rec, deployment, scaling_strategy,
      reasoning, scaling_roadmap, estimated_hosting
    ) VALUES (
      @appType, @expectedUsers, @realTimeFeatures, @budget, @teamSize,
      @aiIntegration, @compliance, @timeToMarket,
      @backend, @frontend, @databaseRec, @deployment, @scalingStrategy,
      @reasoning, @scalingRoadmap, @estimatedHosting
    )
  `);

  const result = stmt.run({
    appType: params.appType,
    expectedUsers: params.expectedUsers,
    realTimeFeatures: params.realTimeFeatures ? 1 : 0,
    budget: params.budget,
    teamSize: params.teamSize,
    aiIntegration: params.aiIntegration ? 1 : 0,
    compliance: params.compliance,
    timeToMarket: params.timeToMarket,
    backend: params.backend,
    frontend: params.frontend,
    databaseRec: params.databaseRec,
    deployment: params.deployment,
    scalingStrategy: params.scalingStrategy,
    reasoning: params.reasoning,
    scalingRoadmap: params.scalingRoadmap,
    estimatedHosting: params.estimatedHosting || null,
  });

  return result.lastInsertRowid as number;
}

export function getRecentRecommendations(limit: number = 10) {
  const database = getDatabase();
  
  const stmt = database.prepare(`
    SELECT * FROM recommendations 
    ORDER BY created_at DESC 
    LIMIT @limit
  `);

  return stmt.all({ limit }) as any[];
}
