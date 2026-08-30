import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("computes independent cash/in-kind/cap canonical results", () => {
    expect(calculate(example.input)).toEqual(example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toEqual(example.output);
  });
  it("publishes valid contracts and portable examples", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects malformed/nonfinite fields", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      } else
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("rejects invalid domain, calibration and alignment", () => {
    expect(() =>
      calculate({ ...example.input, requestedGrantAmount: 0 }),
    ).toThrow();
    expect(() =>
      calculate({ ...example.input, callerCashEligibilityFlags: [1] }),
    ).toThrow();
    expect(() =>
      calculate({ ...example.input, callerInKindRecognizedFractions: [2, 1] }),
    ).toThrow();
    expect(() =>
      calculate({
        ...example.input,
        callerMaximumInKindShareOfRequiredMatch: 1.1,
      }),
    ).toThrow();
  });
  it("threshold-equal match satisfies declared funding policy", () => {
    const r = calculate({
      ...example.input,
      cashContributionAmounts: [300, 200],
    });
    expect(r.signedMatchAmountMargin).toBe(0);
    expect(r.recognizedMatchPerGrantRatio).toBe(0.5);
    expect(r.meetsCallerFundingMatchPolicy).toBe(true);
  });
  it("does not let excluded cash or in-kind above cap erase shortfall", () => {
    const r = calculate({
      ...example.input,
      cashContributionAmounts: [100, 1000000],
      declaredInKindContributionAmounts: [1000000, 100],
    });
    expect(r.recognizedEligibleCash).toBe(100);
    expect(r.acceptedInKindUnderCallerCap).toBe(200);
    expect(r.signedMatchAmountMargin).toBe(-200);
  });
  it("zero required match does not require a fictitious in-kind amount", () => {
    const r = calculate({
      ...example.input,
      callerRequiredMatchPerGrantRatio: 0,
    });
    expect(r.requiredMatchAmount).toBe(0);
    expect(r.acceptedInKindUnderCallerCap).toBe(0);
    expect(r.recognizedMatchPerGrantRatio).toBe(0.1);
    expect(r.meetsCallerFundingMatchPolicy).toBe(true);
  });
});
