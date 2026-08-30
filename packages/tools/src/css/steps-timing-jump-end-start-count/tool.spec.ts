import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, stepsTimingJumpEndStartCountInputSchema, stepsTimingJumpEndStartCountOutputSchema } from "./index.js";
describe("css/steps-timing-jump-end-start-count", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, stepsTimingJumpEndStartCountInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, stepsTimingJumpEndStartCountOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "steps": 4,
      "position": "jump-start",
      "progress": 0,
      "before": false
    })).toEqual({ ok: true, output: {
      "jumps": 4,
      "outputProgress": 0.25
    } });
    expect(tool.execute({
      "steps": 4,
      "position": "jump-end",
      "progress": 0.5,
      "before": true
    })).toEqual({ ok: true, output: {
      "jumps": 4,
      "outputProgress": 0.25
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "steps": 1,
      "position": "jump-start",
      "progress": 1,
      "before": false
    })).toEqual({ ok: true, output: {
      "jumps": 1,
      "outputProgress": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "steps", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, steps: 0 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "steps", code: "out_of_range" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["steps", "position", "progress", "before"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["steps", "progress"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
});
