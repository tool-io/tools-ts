import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("entrepreneurship-studies/option-pool-shuffle-pre-post-money-gap", () => {
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
        existingShares: 1000,
        investment: 100,
        preMoney: 900,
        targetPostPoolFraction: 0.1,
        existingPoolShares: 100,
      }),
    ).toEqual({
      ok: true,
      output: { newPoolShares: 12.500000000000004, investorShares: 112.5 },
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite existingShares",
    (value) =>
      expect(tool.execute({ ...example.input, existingShares: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite investment", (value) =>
    expect(tool.execute({ ...example.input, investment: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite preMoney", (value) =>
    expect(tool.execute({ ...example.input, preMoney: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetPostPoolFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, targetPostPoolFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite existingPoolShares",
    (value) =>
      expect(
        tool.execute({ ...example.input, existingPoolShares: value }).ok,
      ).toBe(false),
  );
  it.each([
    { existingShares: 0 },
    { investment: -1 },
    { preMoney: 0 },
    { targetPostPoolFraction: -1 },
    { targetPostPoolFraction: 2 },
    { existingPoolShares: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
  it("solves the stated post-round pool fraction including investor shares", () => {
    const out = calculate(example.input);
    const total =
      example.input.existingShares + out.newPoolShares + out.investorShares;
    expect(
      (example.input.existingPoolShares + out.newPoolShares) / total,
    ).toBeCloseTo(0.2, 14);
    expect(out.investorShares / total).toBeCloseTo(0.2, 14);
  });
  it.each([
    { existingShares: 0 },
    { investment: -1 },
    { preMoney: 0 },
    { targetPostPoolFraction: -1 },
    { targetPostPoolFraction: 2 },
    { existingPoolShares: -1 },
  ])("reviewed-domain direct validation %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrow();
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect([
        "invalid_field",
        "invalid_domain",
        "result_out_of_range",
      ]).toContain(result.error.issues[0].code);
  });
});
