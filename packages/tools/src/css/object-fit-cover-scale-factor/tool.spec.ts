import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, objectFitCoverScaleFactorInputSchema, objectFitCoverScaleFactorOutputSchema } from "./index.js";
describe("css/object-fit-cover-scale-factor", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, objectFitCoverScaleFactorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, objectFitCoverScaleFactorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "imageWidth": 100,
      "imageHeight": 200,
      "boxWidth": 200,
      "boxHeight": 100
    })).toEqual({ ok: true, output: {
      "scale": 2,
      "renderedWidth": 200,
      "renderedHeight": 400,
      "cropWidth": 0,
      "cropHeight": 300
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "imageWidth": 10,
      "imageHeight": 10,
      "boxWidth": 10,
      "boxHeight": 10
    })).toEqual({ ok: true, output: {
      "scale": 1,
      "renderedWidth": 10,
      "renderedHeight": 10,
      "cropWidth": 0,
      "cropHeight": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "imageWidth", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, imageWidth: 0 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "imageWidth", code: "out_of_range" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["imageWidth", "imageHeight", "boxWidth", "boxHeight"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["imageWidth", "imageHeight", "boxWidth", "boxHeight"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("accepts a collapsed content box", () => {
    expect(tool.execute({ imageWidth: 400, imageHeight: 200, boxWidth: 0, boxHeight: 0 })).toEqual({ ok: true, output: { scale: 0, renderedWidth: 0, renderedHeight: 0, cropWidth: 0, cropHeight: 0 } });
  });
});
