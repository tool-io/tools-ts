import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dateFormatDetectionFromColumnSampleInputSchema, dateFormatDetectionFromColumnSampleOutputSchema } from "./index.js";
describe("csv/date-format-detection-from-column-sample", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dateFormatDetectionFromColumnSampleInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dateFormatDetectionFromColumnSampleOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "01/02/2024"
      ]
    })).toEqual({ ok: true, output: {
      "formats": [
        "MM/DD/YYYY",
        "DD/MM/YYYY"
      ],
      "ambiguous": true,
      "observedCount": 1
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": []
    })).toEqual({ ok: true, output: {
      "formats": [],
      "ambiguous": true,
      "observedCount": 0
    } });
    expect(tool.execute({
      "values": [
        "2023-02-29"
      ]
    })).toEqual({ ok: true, output: {
      "formats": [],
      "ambiguous": true,
      "observedCount": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
