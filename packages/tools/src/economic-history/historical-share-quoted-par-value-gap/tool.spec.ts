import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("economic-history/historical-share-quoted-par-value-gap", () => {
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
      tool.execute({ parValue: 50, quotePercent: 120, paidFraction: 1 }),
    ).toEqual({
      ok: true,
      output: { marketPrice: 60, paidCapital: 50, premiumToPaid: 10 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite parValue", (value) =>
    expect(tool.execute({ ...example.input, parValue: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite quotePercent",
    (value) =>
      expect(tool.execute({ ...example.input, quotePercent: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite paidFraction",
    (value) =>
      expect(tool.execute({ ...example.input, paidFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { parValue: 0 },
    { quotePercent: -1 },
    { paidFraction: -1 },
    { paidFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });

  it.each([
    { parValue: 0 },
    { quotePercent: -1 },
    { paidFraction: -1 },
    { paidFraction: 2 },
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
