import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, extendedEuclideanCoefficientsInputSchema, extendedEuclideanCoefficientsOutputSchema } from "./index.js";

describe("math/extended-euclidean-coefficients", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, extendedEuclideanCoefficientsInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, extendedEuclideanCoefficientsOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      a: "-240",
      b: "46",
    })).toEqual({ ok: true, output: {
      gcd: "2",
      x: "9",
      y: "47",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      a: "0",
      b: "0",
    })).toEqual({ ok: true, output: {
      gcd: "0",
      x: "1",
      y: "0",
    } });
    expect(tool.execute({
      a: "0",
      b: "-5",
    })).toEqual({ ok: true, output: {
      gcd: "5",
      x: "0",
      y: "-1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "a", code: "invalid_type" }] } });
    expect(tool.execute({
      a: "240",
      b: "46",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      a: "01",
      b: "2",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "a", code: "invalid_format" }] } });
  });
  it("satisfies Bezout's identity for large exact integers", () => {
    const input = { a: "9007199254740993", b: "12345678901234567890" };
    const result = tool.execute(input);
    if (!result.ok) throw new Error("Expected valid coefficients");
    expect(BigInt(input.a) * BigInt(result.output.x) + BigInt(input.b) * BigInt(result.output.y)).toBe(BigInt(result.output.gcd));
  });
});
