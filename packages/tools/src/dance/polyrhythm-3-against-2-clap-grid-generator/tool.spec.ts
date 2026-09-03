import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as swing,
  example as swingExample,
} from "../syncopation-swing-ratio-eighth-calculator/tool.js";
import {
  calculate as bars,
  example as barsExample,
} from "../bars-per-phrase-32-count-conversion/tool.js";
import {
  calculate as counts,
  example as countsExample,
} from "../bpm-to-counts-per-minute-converter/tool.js";
import {
  calculate as waltz,
  example as waltzExample,
} from "../waltz-bar-3-4-measure-map/tool.js";
import {
  calculate as breaks,
  example as breakExample,
} from "../hydration-break-per-90min-class-lookup/tool.js";
import {
  calculate as impact,
  example as impactExample,
} from "../impact-absorption-court-vs-dance-floor-compare-lookup/tool.js";
import {
  calculate as crosswalk,
  example as crosswalkExample,
} from "../cecchetti-vaganova-rad-method-crossref-lookup/tool.js";
import {
  calculate as readiness,
  example as readinessExample,
} from "../pointe-readiness-age-ankle-test-checklist/tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("does not duplicate the next-cycle endpoint in a polyrhythm grid", () => {
    const r = calculate(example.input);
    expect(r.threePulseTimesSeconds).toEqual([0, 2, 4]);
    expect(r.twoPulseTimesSeconds).toEqual([0, 3]);
    expect(r.coincidentPulseTimesSeconds).toEqual([0]);
  });
  it("pools measured swing interval durations rather than averaging ratios", () => {
    expect(swing(swingExample.input).pooledLongShortRatio).toBeCloseTo(17 / 7);
  });
  it("requires each annotated offbeat inside its measured beat pair", () => {
    expect(() =>
      swing({ ...swingExample.input, observedOffbeatTimesSeconds: [-1, 1.75] }),
    ).toThrow();
  });
  it("keeps dance-count rate separate from the notated musical BPM", () => {
    expect(counts(countsExample.input).conditionalCountsPerMinute).toBe(60);
    expect(
      bars({ ...barsExample.input, callerCountsPerNotatedBeat: 2 })
        .conditionalBarsPerPhrase,
    ).toBe(4);
  });
  it("numbers notated waltz beats within each three-beat measure", () => {
    expect(
      waltz({ ...waltzExample.input, callerWaltzBeatOrdinals: [3, 4, 5] })
        .oneBasedBeatWithinThreeBeatBars,
    ).toEqual([1, 2, 3]);
  });
  it("rejects overlapping caller approved class-break windows", () => {
    expect(() =>
      breaks({ ...breakExample.input, callerBreakStartMinutes: [30, 32] }),
    ).toThrow();
  });
  it("compares observed impact forces without substituting static floor deflection", () => {
    expect(
      impact(impactExample.input).pairedDanceMinusCourtPeakNewtons,
    ).toEqual([-20, -20]);
  });
  it("preserves absent ballet-method crosswalk evidence", () => {
    expect(
      crosswalk({ ...crosswalkExample.input, querySourcePositionId: "unknown" })
        .matchedCallerTargetPositionIds,
    ).toEqual([]);
  });
  it("does not treat missing pointe-assessment evidence as physical clearance", () => {
    const r = readiness({
      ...readinessExample.input,
      knownPointeAssessmentFlags: [0, 0],
    });
    expect(r.fullyWitnessedCallerClasses).toEqual([]);
    expect(r.compatibleCallerClasses).toEqual(["a", "b"]);
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds evidence and refuses inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("rejects invalid domains", () => {
    const input = { ...example.input, callerCycleDurationSeconds: 0 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, callerCycleDurationSeconds: 3 };
    close(calculate(input), {
      threePulseTimesSeconds: [0, 1, 2],
      twoPulseTimesSeconds: [0, 1.5],
      coincidentPulseTimesSeconds: [0],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        threePulseTimesSeconds: [0, 1, 2],
        twoPulseTimesSeconds: [0, 1.5],
        coincidentPulseTimesSeconds: [0],
      });
  });
});
