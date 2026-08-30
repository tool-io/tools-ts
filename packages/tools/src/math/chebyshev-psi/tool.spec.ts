import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, chebyshevPsiInputSchema, chebyshevPsiOutputSchema } from "./index.js";

describe("math/chebyshev-psi", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, chebyshevPsiInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, chebyshevPsiOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 2,
    })).toEqual({ ok: true, output: {
      value: 0.6931471805599453,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
    })).toEqual({ ok: true, output: {
      value: 0,
    } });
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      value: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 4,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });
  it("includes repeated logarithms for prime powers", () => {
    const result = tool.execute({ n: 10 });
    if (!result.ok) throw new Error("Expected psi");
    expect(result.output.value).toBeCloseTo(Math.log(2520), 13);
  });
});
