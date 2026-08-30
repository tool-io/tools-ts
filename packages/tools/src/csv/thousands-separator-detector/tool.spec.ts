import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, thousandsSeparatorDetectorInputSchema, thousandsSeparatorDetectorOutputSchema } from "./index.js";
describe("csv/thousands-separator-detector", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, thousandsSeparatorDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, thousandsSeparatorDetectorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "1,234"
      ]
    })).toEqual({ ok: true, output: {
      "groupingSeparators": [
        ","
      ],
      "mayBeDecimal": true
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [
        "123"
      ]
    })).toEqual({ ok: true, output: {
      "groupingSeparators": [],
      "mayBeDecimal": false
    } });
    expect(tool.execute({
      "values": []
    })).toEqual({ ok: true, output: {
      "groupingSeparators": [],
      "mayBeDecimal": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
