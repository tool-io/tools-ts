import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, convergentsFromContinuedFractionInputSchema, convergentsFromContinuedFractionOutputSchema } from "./index.js";

describe("math/convergents-from-continued-fraction", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, convergentsFromContinuedFractionInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, convergentsFromContinuedFractionOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      coefficients: [-2, 3],
    })).toEqual({ ok: true, output: {
      convergents: [
        {
          numerator: "-2",
          denominator: "1",
        },
        {
          numerator: "-5",
          denominator: "3",
        },
      ],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      coefficients: [0],
    })).toEqual({ ok: true, output: {
      convergents: [
        {
          numerator: "0",
          denominator: "1",
        },
      ],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "coefficients", code: "invalid_type" }] } });
    expect(tool.execute({
      coefficients: [3, 7, 16],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      coefficients: [1, 0],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "coefficients.1", code: "invalid_coefficient" }] } });
    expect(tool.execute({
      coefficients: [],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "coefficients", code: "out_of_range" }] } });
    expect(tool.execute({ coefficients: [1, Infinity] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "coefficients.1", code: "invalid_type" }] } });
  });

});
