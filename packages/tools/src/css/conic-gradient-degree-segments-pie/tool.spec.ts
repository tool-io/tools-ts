import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, conicGradientDegreeSegmentsPieInputSchema, conicGradientDegreeSegmentsPieOutputSchema } from "./index.js";
describe("css/conic-gradient-degree-segments-pie", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, conicGradientDegreeSegmentsPieInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, conicGradientDegreeSegmentsPieOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "weights": [
        3,
        1
      ]
    })).toEqual({ ok: true, output: {
      "startDegrees": [
        0,
        270
      ],
      "endDegrees": [
        270,
        360
      ],
      "fractions": [
        0.75,
        0.25
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "weights": [
        0,
        5
      ]
    })).toEqual({ ok: true, output: {
      "startDegrees": [
        0,
        0
      ],
      "endDegrees": [
        0,
        360
      ],
      "fractions": [
        0,
        1
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "weights", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "weights": [
        0,
        0
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "weights", code: "zero_total" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["weights"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
