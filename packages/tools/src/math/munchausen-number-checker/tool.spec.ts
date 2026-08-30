import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, munchausenNumberCheckerInputSchema, munchausenNumberCheckerOutputSchema } from "./index.js";

describe("math/munchausen-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, munchausenNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, munchausenNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "438579088",
      zeroPowerZero: 0,
    })).toEqual({ ok: true, output: {
      isMunchausen: true,
    } });
    expect(tool.execute({
      n: "438579088",
      zeroPowerZero: 1,
    })).toEqual({ ok: true, output: {
      isMunchausen: false,
    } });
    expect(tool.execute({
      n: "10",
      zeroPowerZero: 1,
    })).toEqual({ ok: true, output: {
      isMunchausen: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "0",
      zeroPowerZero: 0,
    })).toEqual({ ok: true, output: {
      isMunchausen: true,
    } });
    expect(tool.execute({
      n: "0",
      zeroPowerZero: 1,
    })).toEqual({ ok: true, output: {
      isMunchausen: false,
    } });
    expect(tool.execute({
      n: "1",
      zeroPowerZero: 1,
    })).toEqual({ ok: true, output: {
      isMunchausen: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "3435",
      zeroPowerZero: 1,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: "3435",
      zeroPowerZero: 2,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "zeroPowerZero", code: "out_of_range" }] } });
  });

});
