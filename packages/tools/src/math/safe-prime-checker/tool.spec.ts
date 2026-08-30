import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, safePrimeCheckerInputSchema, safePrimeCheckerOutputSchema } from "./index.js";

describe("math/safe-prime-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, safePrimeCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, safePrimeCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      p: 47,
    })).toEqual({ ok: true, output: {
      isSafePrime: true,
    } });
    expect(tool.execute({
      p: 13,
    })).toEqual({ ok: true, output: {
      isSafePrime: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      p: 2,
    })).toEqual({ ok: true, output: {
      isSafePrime: false,
    } });
    expect(tool.execute({
      p: 3,
    })).toEqual({ ok: true, output: {
      isSafePrime: false,
    } });
    expect(tool.execute({
      p: 5,
    })).toEqual({ ok: true, output: {
      isSafePrime: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "p", code: "invalid_type" }] } });
    expect(tool.execute({
      p: 23,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      p: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "p", code: "invalid_type" }] } });
  });

});
