import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, scaleNegativeFlipMirrorCheckerInputSchema, scaleNegativeFlipMirrorCheckerOutputSchema } from "./index.js";
describe("css/scale-negative-flip-mirror-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, scaleNegativeFlipMirrorCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, scaleNegativeFlipMirrorCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "scaleX": -2,
      "scaleY": -2
    })).toEqual({ ok: true, output: {
      "horizontalFlip": true,
      "verticalFlip": true,
      "reversesOrientation": false,
      "degenerate": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "scaleX": 0,
      "scaleY": -1
    })).toEqual({ ok: true, output: {
      "horizontalFlip": false,
      "verticalFlip": true,
      "reversesOrientation": false,
      "degenerate": true
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "scaleX", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, scaleX: Infinity })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "scaleX", code: "invalid_type" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["scaleX", "scaleY"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["scaleX", "scaleY"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
});
