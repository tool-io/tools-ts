import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, carmichaelNumberCheckerInputSchema, carmichaelNumberCheckerOutputSchema } from "./index.js";

describe("math/carmichael-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, carmichaelNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, carmichaelNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 1105,
    })).toEqual({ ok: true, output: {
      isCarmichael: true,
    } });
    expect(tool.execute({
      n: 341,
    })).toEqual({ ok: true, output: {
      isCarmichael: false,
    } });
    expect(tool.execute({
      n: 45,
    })).toEqual({ ok: true, output: {
      isCarmichael: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      isCarmichael: false,
    } });
    expect(tool.execute({
      n: 17,
    })).toEqual({ ok: true, output: {
      isCarmichael: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 561,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
