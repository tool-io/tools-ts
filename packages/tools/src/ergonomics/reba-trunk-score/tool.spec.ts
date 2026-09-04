import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as legScore,
  example as legExample,
} from "../reba-leg-posture-score/tool.js";
import {
  calculate as cli,
  example as cliExample,
} from "../niosh-composite-lifting-index/tool.js";
import { calculate as horizontal } from "../niosh-horizontal-multiplier/tool.js";
import { calculate as vertical } from "../niosh-vertical-multiplier/tool.js";
import { calculate as travel } from "../niosh-distance-multiplier/tool.js";
import { calculate as asymmetry } from "../niosh-asymmetry-multiplier/tool.js";
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
  it.each([
    [-30, 3],
    [-20, 2],
    [0, 1],
    [20, 2],
    [60, 3],
    [60.1, 4],
  ])("retains REBA extension/flexion boundary %s", (angle, score) => {
    expect(
      calculate({ signedTrunkFlexionDegrees: angle, twistedOrSideBent: false })
        .rebaTrunkScore,
    ).toBe(score);
  });
  it("does not add standing knee adjustments to seated observations", () => {
    expect(
      legScore({
        ...legExample.input,
        observedSeated: true,
        kneeFlexionDegrees: 90,
      }).rebaLegScore,
    ).toBe(1);
    expect(
      legScore({
        ...legExample.input,
        observedSeated: false,
        kneeFlexionDegrees: 90,
      }).rebaLegScore,
    ).toBe(3);
  });
  it("keeps CLI cumulative incremental factors distinct from summed STLI", () => {
    const r = cli({
      ...cliExample.input,
      callerOrderedSingleTaskIndices: [3, 2, 1],
      callerOrderedFrequencyIndependentIndices: [2, 1, 1],
      callerPriorCumulativeFrequencyMultipliers: [1, 1, 0.5],
      callerNewCumulativeFrequencyMultipliers: [1, 0.5, 0.25],
    });
    expect(r.compositeLiftingIndex).toBe(6);
  });
  it("rejects reversed cumulative frequency order", () => {
    expect(() =>
      cli({
        ...cliExample.input,
        callerNewCumulativeFrequencyMultipliers: [1, 1],
        callerPriorCumulativeFrequencyMultipliers: [1, 0.5],
      }),
    ).toThrow();
  });
  it("checks RNLE named edge domains without extrapolating", () => {
    expect(horizontal({ horizontalReachCm: 25 }).horizontalMultiplier).toBe(1);
    expect(() => horizontal({ horizontalReachCm: 63.01 })).toThrow();
    expect(
      vertical({ verticalHandHeightCm: 0 }).verticalMultiplier,
    ).toBeCloseTo(0.775);
    expect(
      vertical({ verticalHandHeightCm: 175 }).verticalMultiplier,
    ).toBeCloseTo(0.7);
    expect(travel({ verticalTravelCm: 175 }).distanceMultiplier).toBeCloseTo(
      0.82 + 4.5 / 175,
    );
    expect(
      asymmetry({ asymmetryDegrees: 135 }).asymmetryMultiplier,
    ).toBeCloseTo(0.568);
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
    const input = { ...example.input, signedTrunkFlexionDegrees: 200 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      signedTrunkFlexionDegrees: 0,
      twistedOrSideBent: false,
    };
    close(calculate(input), { rebaTrunkScore: 1 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, { rebaTrunkScore: 1 });
  });
});
