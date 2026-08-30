import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, fermatNumberCheckerInputSchema, fermatNumberCheckerOutputSchema } from "./index.js";

describe("math/fermat-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, fermatNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fermatNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "257",
    })).toEqual({ ok: true, output: {
      isFermat: true,
    } });
    expect(tool.execute({
      n: "9",
    })).toEqual({ ok: true, output: {
      isFermat: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "0",
    })).toEqual({ ok: true, output: {
      isFermat: false,
    } });
    expect(tool.execute({
      n: "2",
    })).toEqual({ ok: true, output: {
      isFermat: false,
    } });
    expect(tool.execute({
      n: "3",
    })).toEqual({ ok: true, output: {
      isFermat: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "4294967297",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
