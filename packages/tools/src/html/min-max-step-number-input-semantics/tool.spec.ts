import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, minMaxStepNumberInputSemanticsInputSchema, minMaxStepNumberInputSemanticsOutputSchema } from "./index.js";
describe("html/min-max-step-number-input-semantics", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, minMaxStepNumberInputSemanticsInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, minMaxStepNumberInputSemanticsOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "value": 0.4,
  "hasMin": true,
  "min": 0.1,
  "hasMax": true,
  "max": 1,
  "stepAny": false,
  "step": 0.2,
  "hasValueAttribute": false,
  "valueAttribute": 0
})).toEqual({ ok: true, output: {
  "rangeUnderflow": false,
  "rangeOverflow": false,
  "stepMismatch": true,
  "stepBase": 0.1
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, step: 0 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "step", code: "out_of_range" }] } });
  });

  it("uses value attribute as step base only when min is absent", () => {
    expect(tool.execute({ value: 1.5, hasMin: false, min: 0, hasMax: false, max: 0, stepAny: false, step: 1, hasValueAttribute: true, valueAttribute: 0.5 })).toEqual({ ok: true, output: { rangeUnderflow: false, rangeOverflow: false, stepMismatch: false, stepBase: 0.5 } });
    expect(tool.execute({ ...example.input, value: -0.1, stepAny: true })).toEqual({ ok: true, output: { rangeUnderflow: true, rangeOverflow: false, stepMismatch: false, stepBase: 0.1 } });
  });
});
