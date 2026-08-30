import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, math3nPlus1StepInputSchema, math3nPlus1StepOutputSchema } from "./index.js";

describe("math/3n-plus-1-step", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, math3nPlus1StepInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, math3nPlus1StepOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "82",
    })).toEqual({ ok: true, output: {
      value: "41",
    } });
    expect(tool.execute({
      n: "9007199254740993",
    })).toEqual({ ok: true, output: {
      value: "27021597764222980",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "1",
    })).toEqual({ ok: true, output: {
      value: "4",
    } });
    expect(tool.execute({
      n: "2",
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "27",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: "0",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_format" }] } });
  });

});
