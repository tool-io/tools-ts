import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sphenicNumberCheckerInputSchema, sphenicNumberCheckerOutputSchema } from "./index.js";

describe("math/sphenic-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sphenicNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sphenicNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 105,
    })).toEqual({ ok: true, output: {
      isSphenic: true,
    } });
    expect(tool.execute({
      n: 60,
    })).toEqual({ ok: true, output: {
      isSphenic: false,
    } });
    expect(tool.execute({
      n: 8,
    })).toEqual({ ok: true, output: {
      isSphenic: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      isSphenic: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 30,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
