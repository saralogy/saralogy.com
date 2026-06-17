#!/usr/bin/env bun
/**
 * Saralogy SEO audit script.
 * Runs every 5 hours in GitHub Actions.
 * Checks schedule adherence and sets catch-up flag if behind.
 * Exits with code 2 if catch-up is needed (triggers content cycle in workflow).
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dir, "..");
const STATE_PATH = join(__dir, "state.json");
const CALENDAR_PATH = join(__dir, "content-calendar.json");
const AUDIT_LOG = join(__dir, "audit-log.jsonl");

interface State {
  meta: { workflow_start: string; workflow_end: string; total_target: number };
  progress: {
    cycles_completed: number;
    articles_written: number;
    articles_total: number;
    last_cycle_at: string | null;
  };
  articles: Record<string, unknown>;
}

interface Calendar { articles: Array<{ slug: string; status: string }> }

function readJSON<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function writeJSON(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function daysSince(isoDate: string): number {
  return (Date.now() - new Date(isoDate).getTime()) / 86_400_000;
}

function hoursSince(isoDate: string | null): number {
  if (!isoDate) return 999;
  return (Date.now() - new Date(isoDate).getTime()) / 3_600_000;
}

const state = readJSON<State>(STATE_PATH);
const calendar = readJSON<Calendar>(CALENDAR_PATH);

const now = new Date().toISOString();
const start = state.meta?.workflow_start ?? "2026-06-17";
const totalTarget = state.meta?.total_target ?? 15;

const elapsed = daysSince(start);
const totalDays = 7;
const progress = Math.min(elapsed / totalDays, 1);

// Expected articles by now (linear schedule)
const expected = Math.floor(progress * totalTarget);
const actual = state.progress.articles_written;
const behind = Math.max(0, expected - actual);
const remaining = totalTarget - actual;
const daysLeft = Math.max(0, totalDays - elapsed);

// Hours since last successful cycle
const idleHours = hoursSince(state.progress.last_cycle_at);

// Pending article slugs
const done = new Set(Object.keys(state.articles));
const pendingSlugs = calendar.articles.filter(a => !done.has(a.slug)).map(a => a.slug);

// Determine status
const needsCatchUp = behind >= 2 || (idleHours > 9 && remaining > 0);
const isComplete = remaining === 0;

const auditEntry = {
  ts: now,
  elapsed_days: Math.round(elapsed * 10) / 10,
  days_left: Math.round(daysLeft * 10) / 10,
  expected_by_now: expected,
  actual: actual,
  behind: behind,
  idle_hours: Math.round(idleHours * 10) / 10,
  remaining: remaining,
  pending: pendingSlugs.slice(0, 5),
  needs_catch_up: needsCatchUp,
  complete: isComplete,
};

// Append to audit log
appendFileSync(AUDIT_LOG, JSON.stringify(auditEntry) + "\n", "utf-8");

// Print audit report
console.log("\n══ SARALOGY SEO AUDIT ══════════════════════════");
console.log(`  Time:       ${now}`);
console.log(`  Elapsed:    Day ${Math.round(elapsed * 10) / 10} of ${totalDays}`);
console.log(`  Progress:   ${actual}/${totalTarget} articles written`);
console.log(`  Expected:   ${expected} articles by now`);
console.log(`  Behind:     ${behind} articles`);
console.log(`  Idle:       ${Math.round(idleHours)}h since last cycle`);
console.log(`  Remaining:  ${remaining} articles, ${Math.round(daysLeft * 10) / 10} days left`);
if (pendingSlugs.length > 0) {
  console.log(`  Next up:    ${pendingSlugs.slice(0, 3).join(", ")}`);
}
console.log(`  Status:     ${isComplete ? "✅ COMPLETE" : needsCatchUp ? "⚠️  CATCH-UP NEEDED" : "✅ ON TRACK"}`);
console.log("════════════════════════════════════════════════\n");

if (isComplete) {
  console.log("All articles written. Workflow complete.");
  process.exit(0);
}

if (needsCatchUp) {
  console.log(`⚡ Catch-up required: ${behind} behind schedule, ${Math.round(idleHours)}h idle.`);
  process.exit(2); // GH Actions checks this to trigger content generation
}

console.log("✅ On schedule. No action needed.");
process.exit(0);
