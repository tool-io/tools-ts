import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, wilsonPrimeCheckerInputSchema, wilsonPrimeCheckerOutputSchema } from "./index.js";

describe("math/wilson-prime-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, wilsonPrimeCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, wilsonPrimeCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      p: 5,
    })).toEqual({ ok: true, output: {
      isWilson: true,
    } });
    expect(tool.execute({
      p: 563,
    })).toEqual({ ok: true, output: {
      isWilson: true,
    } });
    expect(tool.execute({
      p: 7,
    })).toEqual({ ok: true, output: {
      isWilson: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      p: 1,
    })).toEqual({ ok: true, output: {
      isWilson: false,
    } });
    expect(tool.execute({
      p: 2,
    })).toEqual({ ok: true, output: {
      isWilson: false,
    } });
    expect(tool.execute({
      p: 4,
    })).toEqual({ ok: true, output: {
      isWilson: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "p", code: "invalid_type" }] } });
    expect(tool.execute({
      p: 13,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      p: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "p", code: "invalid_type" }] } });
  });

});
