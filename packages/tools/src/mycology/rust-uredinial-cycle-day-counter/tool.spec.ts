import { describe, expect, it } from "vitest";
import { runRustUredinialCycleDayCounter } from "./tool.js";
describe("Uredinial Cycle Days", () => {
  it("counts five generations for six day cycles", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 6 }),
    ).toEqual({
      ok: true,
      output: { cycleDays: 6, generationsPerThirtyDays: 5 },
    }));
  it("allows daily cycles all month", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 1 }),
    ).toEqual({
      ok: true,
      output: { cycleDays: 1, generationsPerThirtyDays: 30 },
    }));
  it("allows one generation for month long cycles", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 30 }),
    ).toEqual({
      ok: true,
      output: { cycleDays: 30, generationsPerThirtyDays: 1 },
    }));
  it("yields zero for cycles longer than a month", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 31 }),
    ).toEqual({
      ok: true,
      output: { cycleDays: 31, generationsPerThirtyDays: 0 },
    }));
  it("floors partial generations", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 7 }),
    ).toEqual({
      ok: true,
      output: { cycleDays: 7, generationsPerThirtyDays: 4 },
    }));
  it("counts three generations for ten day cycles", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 10 }),
    ).toEqual({
      ok: true,
      output: { cycleDays: 10, generationsPerThirtyDays: 3 },
    }));
  it("rejects zero day cycles", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: 0 }).ok,
    ).toBe(false));
  it("rejects negative cycles", () =>
    expect(
      runRustUredinialCycleDayCounter({ daysBetweenGenerationsInt: -6 }).ok,
    ).toBe(false));
});
