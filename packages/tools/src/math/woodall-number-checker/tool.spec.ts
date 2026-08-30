import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, woodallNumberCheckerInputSchema, woodallNumberCheckerOutputSchema } from "./index.js";

describe("math/woodall-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, woodallNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, woodallNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "23",
    })).toEqual({ ok: true, output: {
      isWoodall: true,
    } });
    expect(tool.execute({
      n: "7",
    })).toEqual({ ok: true, output: {
      isWoodall: true,
    } });
    expect(tool.execute({
      n: "15",
    })).toEqual({ ok: true, output: {
      isWoodall: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "0",
    })).toEqual({ ok: true, output: {
      isWoodall: false,
    } });
    expect(tool.execute({
      n: "1",
    })).toEqual({ ok: true, output: {
      isWoodall: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "63",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
