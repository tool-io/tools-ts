import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, achillesNumberCheckerInputSchema, achillesNumberCheckerOutputSchema } from "./index.js";

describe("math/achilles-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, achillesNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, achillesNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 108,
    })).toEqual({ ok: true, output: {
      isAchilles: true,
    } });
    expect(tool.execute({
      n: 36,
    })).toEqual({ ok: true, output: {
      isAchilles: false,
    } });
    expect(tool.execute({
      n: 216,
    })).toEqual({ ok: true, output: {
      isAchilles: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      isAchilles: false,
    } });
    expect(tool.execute({
      n: 12,
    })).toEqual({ ok: true, output: {
      isAchilles: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 72,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
