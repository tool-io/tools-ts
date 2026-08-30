import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, fourTermEquivocationDetectorInputSchema, fourTermEquivocationDetectorOutputSchema } from "./index.js";
describe("logic/four-term-equivocation-detector", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, fourTermEquivocationDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fourTermEquivocationDetectorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "majorSubject": "M",
      "majorPredicate": "P",
      "minorSubject": "S",
      "minorPredicate": "M",
      "conclusionSubject": "S",
      "conclusionPredicate": "P"
    })).toEqual({ ok: true, output: {
      "distinctTermCount": 3,
      "fourTerms": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "majorSubject": "X",
      "majorPredicate": "X",
      "minorSubject": "X",
      "minorPredicate": "X",
      "conclusionSubject": "X",
      "conclusionPredicate": "X"
    })).toEqual({ ok: true, output: {
      "distinctTermCount": 1,
      "fourTerms": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "majorSubject", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["majorSubject", "majorPredicate", "minorSubject", "minorPredicate", "conclusionSubject", "conclusionPredicate"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("keeps Boolean literals distinct from identifier atoms", () => {
    for (const field of ["majorSubject", "majorPredicate", "minorSubject", "minorPredicate", "conclusionSubject", "conclusionPredicate"] as const) {
      expect(tool.execute({ ...example.input, [field]: "true" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_format" }] } });
    }
  });
});
