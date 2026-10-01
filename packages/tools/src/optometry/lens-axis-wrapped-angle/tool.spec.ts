import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("optometry/lens-axis-wrapped-angle", () => {
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
    expect(tool.execute({ axisDegrees: -10, originDegrees: 0 })).toEqual({
      ok: true,
      output: { wrappedDegrees: 170 },
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
    "rejects nonfinite axisDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, axisDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite originDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, originDegrees: value }).ok).toBe(
        false,
      ),
  );
});

describe("modular precision regressions", () => {
  it("retains a tiny angle already inside its range", () => {
    expect(calculate({ axisDegrees: 1e-20, originDegrees: 0 })).toEqual({
      wrappedDegrees: 1e-20,
    });
    expect(tool.execute({ axisDegrees: 1e-20, originDegrees: 0 })).toEqual({
      ok: true,
      output: { wrappedDegrees: 1e-20 },
    });
  });
});
