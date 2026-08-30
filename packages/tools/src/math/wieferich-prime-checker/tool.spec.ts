import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, wieferichPrimeCheckerInputSchema, wieferichPrimeCheckerOutputSchema } from "./index.js";

describe("math/wieferich-prime-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, wieferichPrimeCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, wieferichPrimeCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      p: 3511,
    })).toEqual({ ok: true, output: {
      isWieferich: true,
    } });
    expect(tool.execute({
      p: 3,
    })).toEqual({ ok: true, output: {
      isWieferich: false,
    } });
    expect(tool.execute({
      p: 15,
    })).toEqual({ ok: true, output: {
      isWieferich: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      p: 1,
    })).toEqual({ ok: true, output: {
      isWieferich: false,
    } });
    expect(tool.execute({
      p: 2,
    })).toEqual({ ok: true, output: {
      isWieferich: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "p", code: "invalid_type" }] } });
    expect(tool.execute({
      p: 1093,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      p: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "p", code: "invalid_type" }] } });
  });

});
