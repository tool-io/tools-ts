import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("artificial-intelligence/prompt-cache-discount-one-token-cost", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({
        tokens: 2000000,
        basePerMillion: 1,
        cachedFraction: 1,
        cachedPriceFraction: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: {
        uncachedTokens: 0,
        cachedTokens: 2000000,
        totalCost: 1,
        savings: 1,
      },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tokens", (value) =>
    expect(tool.execute({ ...example.input, tokens: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite basePerMillion",
    (value) =>
      expect(tool.execute({ ...example.input, basePerMillion: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cachedFraction",
    (value) =>
      expect(tool.execute({ ...example.input, cachedFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cachedPriceFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, cachedPriceFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { tokens: -1 },
    { basePerMillion: -1 },
    { cachedFraction: -1 },
    { cachedFraction: 2 },
    { cachedPriceFraction: -1 },
    { cachedPriceFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
