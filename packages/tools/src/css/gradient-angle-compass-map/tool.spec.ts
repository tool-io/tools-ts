import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, gradientAngleCompassMapInputSchema, gradientAngleCompassMapOutputSchema } from "./index.js";
describe("css/gradient-angle-compass-map", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, gradientAngleCompassMapInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, gradientAngleCompassMapOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "direction": "south"
    })).toEqual({ ok: true, output: {
      "angle": 180
    } });
    expect(tool.execute({
      "direction": "west"
    })).toEqual({ ok: true, output: {
      "angle": 270
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "direction": "north"
    })).toEqual({ ok: true, output: {
      "angle": 0
    } });
    expect(tool.execute({
      "direction": "northwest"
    })).toEqual({ ok: true, output: {
      "angle": 315
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "direction", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["direction"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
