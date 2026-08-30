import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, transitionDelayStaggerIncrementInputSchema, transitionDelayStaggerIncrementOutputSchema } from "./index.js";
describe("css/transition-delay-stagger-increment", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, transitionDelayStaggerIncrementInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, transitionDelayStaggerIncrementOutputSchema)).toBe(true);
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "initialDelay": -100,
      "increment": 50,
      "index": 1
    })).toEqual({ ok: true, output: {
      "delay": -50
    } });
    expect(tool.execute({
      "initialDelay": 0,
      "increment": 0,
      "index": 9007199254740991
    })).toEqual({ ok: true, output: {
      "delay": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "initialDelay", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, increment: -1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "increment", code: "out_of_range" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["initialDelay", "increment", "index"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["initialDelay", "increment", "index"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("preserves a finite result after cancellation of large inputs", () => {
    expect(tool.execute({ initialDelay: -1e308, increment: 1e308, index: 2 })).toEqual({ ok: true, output: { delay: 1e308 } });
    expect(tool.execute({ initialDelay: 1e308, increment: 1e308, index: 2 })).toMatchObject({ ok: false, error: { issues: [{ code: "numeric_overflow" }] } });
  });
});
