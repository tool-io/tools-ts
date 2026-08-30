import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("computes independent finite-product reference", () => {
    const r = calculate(example.input);
    expect(r.finiteSineEulerProduct).toBeCloseTo((175 * Math.PI) / 512, 12);
    expect(r.zeroFactorIncluded).toBe(false);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.finiteSineEulerProduct).toBeCloseTo(
        example.output.finiteSineEulerProduct,
        12,
      );
  });
  it("publishes valid contracts and portable examples", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing, unknown and malformed inputs", () => {
    for (const input of [
      {},
      { ...example.input, unknown: 1 },
      { ...example.input, normalizedArgumentX: null },
      { ...example.input, productFactors: null },
    ])
      expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("rejects nonfinite direct and wrapper fields", () => {
    for (const k of Object.keys(example.input)) {
      expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject({
        ok: false,
      });
    }
  });
  it("rejects excessive factors, fractional counts and out-of-range arguments", () => {
    for (const input of [
      { ...example.input, productFactors: 100001 },
      { ...example.input, productFactors: 0.5 },
      { ...example.input, normalizedArgumentX: 101 },
    ]) {
      expect(() => calculate(input)).toThrow();
      expect(tool.execute(input)).toMatchObject({ ok: false });
    }
  });
  it("preserves exact included integer roots without log zero", () => {
    expect(calculate({ ...example.input, normalizedArgumentX: 1 })).toEqual({
      finiteSineEulerProduct: 0,
      zeroFactorIncluded: true,
    });
    expect(calculate({ ...example.input, normalizedArgumentX: 0 })).toEqual({
      finiteSineEulerProduct: 0,
      zeroFactorIncluded: false,
    });
  });
  it("is odd and keeps finite product distinct from its limiting sine", () => {
    expect(
      calculate({ ...example.input, normalizedArgumentX: -0.5 })
        .finiteSineEulerProduct,
    ).toBeCloseTo(-example.output.finiteSineEulerProduct, 12);
    expect(calculate(example.input).finiteSineEulerProduct).toBeGreaterThan(1);
  });
  it("approaches independently known sin(π/2) under larger cutoff", () => {
    expect(
      calculate({ ...example.input, productFactors: 10000 })
        .finiteSineEulerProduct,
    ).toBeCloseTo(1, 4);
  });
});
