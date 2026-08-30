import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, involutionCancelCheckerInputSchema, involutionCancelCheckerOutputSchema } from "./index.js";
describe("logic/involution-cancel-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, involutionCancelCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, involutionCancelCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "atom": "p",
      "negationCount": 3
    })).toEqual({ ok: true, output: {
      "simplified": "!p",
      "remainingNegations": 1
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "atom": "p",
      "negationCount": 0
    })).toEqual({ ok: true, output: {
      "simplified": "p",
      "remainingNegations": 0
    } });
    expect(tool.execute({
      "atom": "p",
      "negationCount": 9007199254740991
    })).toEqual({ ok: true, output: {
      "simplified": "!p",
      "remainingNegations": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "atom", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["atom", "negationCount"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["negationCount"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("keeps Boolean literals distinct from identifier atoms", () => {
    for (const field of ["atom"] as const) {
      expect(tool.execute({ ...example.input, [field]: "true" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_format" }] } });
    }
  });
});
