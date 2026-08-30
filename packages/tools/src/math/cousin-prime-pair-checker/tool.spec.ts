import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, cousinPrimePairCheckerInputSchema, cousinPrimePairCheckerOutputSchema } from "./index.js";

describe("math/cousin-prime-pair-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, cousinPrimePairCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cousinPrimePairCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      first: 17,
      second: 13,
    })).toEqual({ ok: true, output: {
      isCousinPair: true,
    } });
    expect(tool.execute({
      first: 5,
      second: 9,
    })).toEqual({ ok: true, output: {
      isCousinPair: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      first: 2,
      second: 6,
    })).toEqual({ ok: true, output: {
      isCousinPair: false,
    } });
    expect(tool.execute({
      first: 3,
      second: 7,
    })).toEqual({ ok: true, output: {
      isCousinPair: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
    expect(tool.execute({
      first: 7,
      second: 11,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, first: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
  });

});
