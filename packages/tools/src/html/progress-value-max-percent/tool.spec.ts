import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, progressValueMaxPercentInputSchema, progressValueMaxPercentOutputSchema } from "./index.js";
describe("html/progress-value-max-percent", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, progressValueMaxPercentInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, progressValueMaxPercentOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "hasValue": true,
  "value": 5,
  "max": 2
})).toEqual({ ok: true, output: {
  "indeterminate": false,
  "effectiveMax": 2,
  "effectiveValue": 2,
  "percent": 100
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "hasValue": false,
  "value": 5,
  "max": 0
})).toEqual({ ok: true, output: {
  "indeterminate": true,
  "effectiveMax": 1,
  "effectiveValue": 0,
  "percent": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hasValue", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
