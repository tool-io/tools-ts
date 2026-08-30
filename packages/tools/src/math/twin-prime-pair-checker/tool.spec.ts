import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, twinPrimePairCheckerInputSchema, twinPrimePairCheckerOutputSchema } from "./index.js";

describe("math/twin-prime-pair-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, twinPrimePairCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, twinPrimePairCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      first: 7,
      second: 5,
    })).toEqual({ ok: true, output: {
      isTwinPair: true,
    } });
    expect(tool.execute({
      first: 9,
      second: 11,
    })).toEqual({ ok: true, output: {
      isTwinPair: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      first: 2,
      second: 3,
    })).toEqual({ ok: true, output: {
      isTwinPair: false,
    } });
    expect(tool.execute({
      first: 3,
      second: 5,
    })).toEqual({ ok: true, output: {
      isTwinPair: true,
    } });
    expect(tool.execute({
      first: 5,
      second: 5,
    })).toEqual({ ok: true, output: {
      isTwinPair: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
    expect(tool.execute({
      first: 11,
      second: 13,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, first: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
  });

});
