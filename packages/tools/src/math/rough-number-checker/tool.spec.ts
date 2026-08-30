import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, roughNumberCheckerInputSchema, roughNumberCheckerOutputSchema } from "./index.js";

describe("math/rough-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, roughNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, roughNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 35,
      bound: 7,
    })).toEqual({ ok: true, output: {
      isRough: false,
    } });
    expect(tool.execute({
      n: 49,
      bound: 7,
    })).toEqual({ ok: true, output: {
      isRough: true,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
      bound: 100,
    })).toEqual({ ok: true, output: {
      isRough: true,
    } });
    expect(tool.execute({
      n: 2,
      bound: 1,
    })).toEqual({ ok: true, output: {
      isRough: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 77,
      bound: 7,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, n: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
