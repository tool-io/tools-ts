import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, halfAdderSumCarryCheckerInputSchema, halfAdderSumCarryCheckerOutputSchema } from "./index.js";
describe("logic/half-adder-sum-carry-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, halfAdderSumCarryCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, halfAdderSumCarryCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "a": true,
      "b": false
    })).toEqual({ ok: true, output: {
      "sum": true,
      "carry": false
    } });
    expect(tool.execute({
      "a": false,
      "b": true
    })).toEqual({ ok: true, output: {
      "sum": true,
      "carry": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "a": false,
      "b": false
    })).toEqual({ ok: true, output: {
      "sum": false,
      "carry": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "a", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["a", "b"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
