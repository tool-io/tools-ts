import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sternBrocotMediantInputSchema, sternBrocotMediantOutputSchema } from "./index.js";

describe("math/stern-brocot-mediant", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sternBrocotMediantInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sternBrocotMediantOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      leftNumerator: "2",
      leftDenominator: "5",
      rightNumerator: "1",
      rightDenominator: "2",
    })).toEqual({ ok: true, output: {
      numerator: "3",
      denominator: "7",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      leftNumerator: "0",
      leftDenominator: "1",
      rightNumerator: "1",
      rightDenominator: "0",
    })).toEqual({ ok: true, output: {
      numerator: "1",
      denominator: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "leftNumerator", code: "invalid_type" }] } });
    expect(tool.execute({
      leftNumerator: "1",
      leftDenominator: "3",
      rightNumerator: "1",
      rightDenominator: "2",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      leftNumerator: "1",
      leftDenominator: "2",
      rightNumerator: "3",
      rightDenominator: "4",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "rightNumerator", code: "invalid_neighbors" }] } });
  });

});
