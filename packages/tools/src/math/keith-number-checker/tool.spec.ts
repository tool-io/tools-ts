import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, keithNumberCheckerInputSchema, keithNumberCheckerOutputSchema } from "./index.js";

describe("math/keith-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, keithNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, keithNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 14,
    })).toEqual({ ok: true, output: {
      isKeith: true,
    } });
    expect(tool.execute({
      n: 15,
    })).toEqual({ ok: true, output: {
      isKeith: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
    })).toEqual({ ok: true, output: {
      isKeith: false,
    } });
    expect(tool.execute({
      n: 7,
    })).toEqual({ ok: true, output: {
      isKeith: false,
    } });
    expect(tool.execute({
      n: 10,
    })).toEqual({ ok: true, output: {
      isKeith: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 197,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
