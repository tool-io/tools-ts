import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, binomialCoefficientModPrimeLucasInputSchema, binomialCoefficientModPrimeLucasOutputSchema } from "./index.js";

describe("math/binomial-coefficient-mod-prime-lucas", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, binomialCoefficientModPrimeLucasInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, binomialCoefficientModPrimeLucasOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "10",
      k: "3",
      prime: 7,
    })).toEqual({ ok: true, output: {
      residue: 1,
    } });
    expect(tool.execute({
      n: "9007199254740993",
      k: "1",
      prime: 2,
    })).toEqual({ ok: true, output: {
      residue: 1,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "0",
      k: "0",
      prime: 2,
    })).toEqual({ ok: true, output: {
      residue: 1,
    } });
    expect(tool.execute({
      n: "2",
      k: "3",
      prime: 3,
    })).toEqual({ ok: true, output: {
      residue: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "100",
      k: "50",
      prime: 7,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: "10",
      k: "2",
      prime: 4,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "prime", code: "not_prime" }] } });
    expect(tool.execute({
      n: "10",
      k: "2",
      prime: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "prime", code: "out_of_range" }] } });
  });

});
