import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, fareySequenceOrderNInputSchema, fareySequenceOrderNOutputSchema } from "./index.js";

describe("math/farey-sequence-order-n", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, fareySequenceOrderNInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fareySequenceOrderNOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      order: 2,
    })).toEqual({ ok: true, output: {
      fractions: [
        {
          numerator: 0,
          denominator: 1,
        },
        {
          numerator: 1,
          denominator: 2,
        },
        {
          numerator: 1,
          denominator: 1,
        },
      ],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      order: 1,
    })).toEqual({ ok: true, output: {
      fractions: [
        {
          numerator: 0,
          denominator: 1,
        },
        {
          numerator: 1,
          denominator: 1,
        },
      ],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "order", code: "invalid_type" }] } });
    expect(tool.execute({
      order: 4,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      order: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "order", code: "invalid_type" }] } });
    expect(tool.execute({
      order: 0,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "order", code: "out_of_range" }] } });
    expect(tool.execute({
      order: 301,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "order", code: "resource_limit" }] } });
  });

});
