import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, complementLawPairCheckerInputSchema, complementLawPairCheckerOutputSchema } from "./index.js";
describe("logic/complement-law-pair-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, complementLawPairCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, complementLawPairCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "operator": "or",
      "left": "p",
      "right": "p",
      "leftNegated": true,
      "rightNegated": false
    })).toEqual({ ok: true, output: {
      "complementary": true,
      "simplified": "true"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "operator": "and",
      "left": "p",
      "right": "q",
      "leftNegated": false,
      "rightNegated": true
    })).toEqual({ ok: true, output: {
      "complementary": false,
      "simplified": "(p && !q)"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "operator", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["operator", "left", "right", "leftNegated", "rightNegated"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("keeps Boolean literals distinct from identifier atoms", () => {
    for (const field of ["left", "right"] as const) {
      expect(tool.execute({ ...example.input, [field]: "true" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_format" }] } });
    }
  });
});
