import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, nthChildZebraOddEvenClassifierInputSchema, nthChildZebraOddEvenClassifierOutputSchema } from "./index.js";
describe("css/nth-child-zebra-odd-even-classifier", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, nthChildZebraOddEvenClassifierInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, nthChildZebraOddEvenClassifierOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "index": 2
    })).toEqual({ ok: true, output: {
      "matchesOdd": false,
      "matchesEven": true
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "index": 1
    })).toEqual({ ok: true, output: {
      "matchesOdd": true,
      "matchesEven": false
    } });
    expect(tool.execute({
      "index": 9007199254740991
    })).toEqual({ ok: true, output: {
      "matchesOdd": true,
      "matchesEven": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "index", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "index": 0
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "index", code: "out_of_range" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["index"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["index"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
});
