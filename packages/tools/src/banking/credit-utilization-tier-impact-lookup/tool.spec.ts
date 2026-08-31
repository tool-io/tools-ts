import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-9,
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
  it("bounds policy bands and rejects duplicate upper edges", () => {
    expect(
      tool.execute({
        ...example.input,
        callerInclusiveUtilizationPercentEdges: Array.from(
          { length: 129 },
          (_, i) => i,
        ),
      }),
    ).toMatchObject({ ok: false });
    expect(
      tool.execute({
        ...example.input,
        callerInclusiveUtilizationPercentEdges: [30, 30],
      }),
    ).toMatchObject({ ok: false });
  });
  it("pools balances and limits instead of averaging per-card utilization", () => {
    const r = calculate({
      ...example.input,
      revolvingReportedBalancesMinor: [50, 0],
      revolvingCreditLimitsMinor: [100, 900],
    });
    expect(r.perAccountUtilizationPercents).toEqual([50, 0]);
    expect(r.aggregateReportedUtilizationPercent).toBe(5);
  });
  it("computes independently specified canonical results", () => {
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
  it("rejects mistyped and nonfinite evidence", () => {
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
  it("is deterministic and preserves caller evidence", () => {
    const input = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("rejects invalid domains and bounded resource requests", () => {
    const input = { ...example.input, revolvingCreditLimitsMinor: [0, 100] };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      revolvingReportedBalancesMinor: [150, 90],
    };
    close(calculate(input), {
      perAccountUtilizationPercents: [150, 90],
      aggregateReportedUtilizationPercent: 120,
      callerUtilizationBandIndices: [2, 2],
      aggregateCallerUtilizationBandIndex: 2,
      overLimitAccountIndices: [0],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        perAccountUtilizationPercents: [150, 90],
        aggregateReportedUtilizationPercent: 120,
        callerUtilizationBandIndices: [2, 2],
        aggregateCallerUtilizationBandIndex: 2,
        overLimitAccountIndices: [0],
      });
  });
});
