import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sophieGermainPrimeCheckerInputSchema, sophieGermainPrimeCheckerOutputSchema } from "./index.js";

describe("math/sophie-germain-prime-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sophieGermainPrimeCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sophieGermainPrimeCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      p: 11,
    })).toEqual({ ok: true, output: {
      isSophieGermain: true,
    } });
    expect(tool.execute({
      p: 13,
    })).toEqual({ ok: true, output: {
      isSophieGermain: false,
    } });
    expect(tool.execute({
      p: 9,
    })).toEqual({ ok: true, output: {
      isSophieGermain: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      p: 0,
    })).toEqual({ ok: true, output: {
      isSophieGermain: false,
    } });
    expect(tool.execute({
      p: 1,
    })).toEqual({ ok: true, output: {
      isSophieGermain: false,
    } });
    expect(tool.execute({
      p: 2,
    })).toEqual({ ok: true, output: {
      isSophieGermain: true,
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
