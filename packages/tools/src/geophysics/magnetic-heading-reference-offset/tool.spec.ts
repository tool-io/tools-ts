import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geophysics/magnetic-heading-reference-offset", () => {
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
      tool.execute({ headingDegrees: 10, suppliedDeclinationDegrees: -20 }),
    ).toEqual({ ok: true, output: { correctedDegrees: 350 } });
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
    "rejects nonfinite headingDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, headingDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedDeclinationDegrees",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedDeclinationDegrees: value })
          .ok,
      ).toBe(false),
  );
});

describe("modular precision regressions", () => {
  it("preserves a tiny positive corrected heading", () => {
    expect(
      calculate({ headingDegrees: 1e-20, suppliedDeclinationDegrees: 0 }),
    ).toEqual({ correctedDegrees: 1e-20 });
    expect(
      tool.execute({ headingDegrees: 1e-20, suppliedDeclinationDegrees: 0 }),
    ).toEqual({ ok: true, output: { correctedDegrees: 1e-20 } });
  });
  it("reduces headings before an overflowing addition", () => {
    expect(
      calculate({ headingDegrees: 1e308, suppliedDeclinationDegrees: 1e308 }),
    ).toEqual({ correctedDegrees: 232 });
    expect(
      tool.execute({
        headingDegrees: 1e308,
        suppliedDeclinationDegrees: 1e308,
      }),
    ).toEqual({ ok: true, output: { correctedDegrees: 232 } });
  });
});
