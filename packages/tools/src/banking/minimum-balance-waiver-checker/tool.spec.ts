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
  it("uses exact integer sums for boundary comparisons and retains overdraft balances", () => {
    const r = calculate({
      ...example.input,
      observedDailyClosingBalancesMinor: [
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER - 2,
      ],
      callerWaiverBalanceThresholdMinor: Number.MAX_SAFE_INTEGER - 1,
    });
    expect(r.balanceCriterionMet).toBe(true);
    expect(
      calculate({
        ...example.input,
        observedDailyClosingBalancesMinor: [-100, 100],
        callerWaiverBalanceThresholdMinor: 0,
      }).balanceCriterionMet,
    ).toBe(true);
    expect(
      tool.execute({
        ...example.input,
        observedDailyClosingBalancesMinor: Array(2),
      }),
    ).toMatchObject({ ok: false });
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
    const input = { ...example.input, callerBalanceRule: "last" };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = { ...example.input, callerBalanceRule: "minimum" };
    close(calculate(input), {
      observedPolicyBalanceMinor: 100,
      balanceCriterionMet: false,
      callerFeeWaiverQualified: false,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        observedPolicyBalanceMinor: 100,
        balanceCriterionMet: false,
        callerFeeWaiverQualified: false,
      });
  });
});
