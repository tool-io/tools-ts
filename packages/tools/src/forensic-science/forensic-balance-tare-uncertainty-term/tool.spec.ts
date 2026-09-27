import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("forensic-science/forensic-balance-tare-uncertainty-term", () => {
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
        gross: 8,
        tare: 3,
        grossUncertainty: 0.2,
        tareUncertainty: 0.2,
        correlation: 1,
      }),
    ).toEqual({ ok: true, output: { net: 5, combinedUncertainty: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite gross", (value) =>
    expect(tool.execute({ ...example.input, gross: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tare", (value) =>
    expect(tool.execute({ ...example.input, tare: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite grossUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, grossUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite tareUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, tareUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite correlation",
    (value) =>
      expect(tool.execute({ ...example.input, correlation: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { correlation: 2 },
    { grossUncertainty: -1 },
    { tareUncertainty: -1 },
    { correlation: -2 },
    { correlation: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
  it("accounts for perfect positive and negative uncertainty correlation", () => {
    expect(
      calculate({
        gross: 10,
        tare: 2,
        grossUncertainty: 0.25,
        tareUncertainty: 0.25,
        correlation: 1,
      }).combinedUncertainty,
    ).toBe(0);
    expect(
      calculate({
        gross: 10,
        tare: 2,
        grossUncertainty: 0.25,
        tareUncertainty: 0.25,
        correlation: -1,
      }).combinedUncertainty,
    ).toBe(0.5);
  });
  it.each([
    { correlation: 2 },
    { grossUncertainty: -1 },
    { tareUncertainty: -1 },
    { correlation: -2 },
    { correlation: 2 },
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
