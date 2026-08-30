import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, cubicBezierEasingNamePointsLookupInputSchema, cubicBezierEasingNamePointsLookupOutputSchema } from "./index.js";
describe("css/cubic-bezier-easing-name-points-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, cubicBezierEasingNamePointsLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cubicBezierEasingNamePointsLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "keyword": "ease-in"
    })).toEqual({ ok: true, output: {
      "x1": 0.42,
      "y1": 0,
      "x2": 1,
      "y2": 1
    } });
    expect(tool.execute({
      "keyword": "ease-out"
    })).toEqual({ ok: true, output: {
      "x1": 0,
      "y1": 0,
      "x2": 0.58,
      "y2": 1
    } });
    expect(tool.execute({
      "keyword": "ease-in-out"
    })).toEqual({ ok: true, output: {
      "x1": 0.42,
      "y1": 0,
      "x2": 0.58,
      "y2": 1
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "keyword": "linear"
    })).toEqual({ ok: true, output: {
      "x1": 0,
      "y1": 0,
      "x2": 1,
      "y2": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "keyword", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["keyword"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
