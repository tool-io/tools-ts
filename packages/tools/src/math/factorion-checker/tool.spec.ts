import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, factorionCheckerInputSchema, factorionCheckerOutputSchema } from "./index.js";

describe("math/factorion-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, factorionCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, factorionCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "40585",
    })).toEqual({ ok: true, output: {
      isFactorion: true,
    } });
    expect(tool.execute({
      n: "3",
    })).toEqual({ ok: true, output: {
      isFactorion: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "0",
    })).toEqual({ ok: true, output: {
      isFactorion: false,
    } });
    expect(tool.execute({
      n: "1",
    })).toEqual({ ok: true, output: {
      isFactorion: true,
    } });
    expect(tool.execute({
      n: "2",
    })).toEqual({ ok: true, output: {
      isFactorion: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "145",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
