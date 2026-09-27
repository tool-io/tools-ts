import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("evolutionary-biology/kimura-two-parameter-distance-domain-gap", () => {
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
      tool.execute({ transitionFraction: 0, transversionFraction: 0 }),
    ).toEqual({
      ok: true,
      output: { distance: 0, transitionLogMargin: 1, transversionLogMargin: 1 },
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
    "rejects nonfinite transitionFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, transitionFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite transversionFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, transversionFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { transitionFraction: 0.5 },
    { transversionFraction: 0.5 },
    { transitionFraction: -1 },
    { transversionFraction: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
  it("rejects both logarithmic saturation boundaries directly", () => {
    expect(() =>
      calculate({ transitionFraction: 0.5, transversionFraction: 0 }),
    ).toThrow();
    expect(() =>
      calculate({ transitionFraction: 0, transversionFraction: 0.5 }),
    ).toThrow();
  });
  it.each([
    { transitionFraction: 0.5 },
    { transversionFraction: 0.5 },
    { transitionFraction: -1 },
    { transversionFraction: -1 },
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
