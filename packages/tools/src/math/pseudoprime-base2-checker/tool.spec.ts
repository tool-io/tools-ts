import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, pseudoprimeBase2CheckerInputSchema, pseudoprimeBase2CheckerOutputSchema } from "./index.js";

describe("math/pseudoprime-base2-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, pseudoprimeBase2CheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, pseudoprimeBase2CheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 561,
    })).toEqual({ ok: true, output: {
      isPseudoprime: true,
    } });
    expect(tool.execute({
      n: 15,
    })).toEqual({ ok: true, output: {
      isPseudoprime: false,
    } });
    expect(tool.execute({
      n: 17,
    })).toEqual({ ok: true, output: {
      isPseudoprime: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      isPseudoprime: false,
    } });
    expect(tool.execute({
      n: 2,
    })).toEqual({ ok: true, output: {
      isPseudoprime: false,
    } });
    expect(tool.execute({
      n: 4,
    })).toEqual({ ok: true, output: {
      isPseudoprime: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 341,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
