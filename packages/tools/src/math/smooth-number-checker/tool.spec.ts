import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, smoothNumberCheckerInputSchema, smoothNumberCheckerOutputSchema } from "./index.js";

describe("math/smooth-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, smoothNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, smoothNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 14,
      bound: 5,
    })).toEqual({ ok: true, output: {
      isSmooth: false,
    } });
    expect(tool.execute({
      n: 49,
      bound: 7,
    })).toEqual({ ok: true, output: {
      isSmooth: true,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
      bound: 1,
    })).toEqual({ ok: true, output: {
      isSmooth: true,
    } });
    expect(tool.execute({
      n: 2,
      bound: 1,
    })).toEqual({ ok: true, output: {
      isSmooth: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 360,
      bound: 5,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, n: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
