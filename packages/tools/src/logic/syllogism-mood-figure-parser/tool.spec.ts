import { categoricalValidity, type PropositionKind } from "./index.js";
import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, syllogismMoodFigureParserInputSchema, syllogismMoodFigureParserOutputSchema } from "./index.js";
describe("logic/syllogism-mood-figure-parser", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, syllogismMoodFigureParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, syllogismMoodFigureParserOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "syllogism": "EIO-2"
    })).toEqual({ ok: true, output: {
      "majorKind": "E",
      "minorKind": "I",
      "conclusionKind": "O",
      "figure": 2,
      "majorSubject": "P",
      "majorPredicate": "M",
      "minorSubject": "S",
      "minorPredicate": "M"
    } });
    expect(tool.execute({
      "syllogism": "OAO-3"
    })).toEqual({ ok: true, output: {
      "majorKind": "O",
      "minorKind": "A",
      "conclusionKind": "O",
      "figure": 3,
      "majorSubject": "M",
      "majorPredicate": "P",
      "minorSubject": "M",
      "minorPredicate": "S"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "syllogism": "AAI-4"
    })).toEqual({ ok: true, output: {
      "majorKind": "A",
      "minorKind": "A",
      "conclusionKind": "I",
      "figure": 4,
      "majorSubject": "P",
      "majorPredicate": "M",
      "minorSubject": "M",
      "minorPredicate": "S"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "syllogism", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "syllogism": "AAA-5"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "syllogism", code: "invalid_format" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["syllogism"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("agrees with the independently tabulated 15 modern and 24 nonempty-term valid forms", () => {
    const modern = new Set(["AAA-1", "EAE-1", "AII-1", "EIO-1", "EAE-2", "AEE-2", "EIO-2", "AOO-2", "AII-3", "IAI-3", "OAO-3", "EIO-3", "AEE-4", "IAI-4", "EIO-4"]);
    const traditional = new Set([...modern, "AAI-1", "EAO-1", "AEO-2", "EAO-2", "AAI-3", "EAO-3", "AEO-4", "EAO-4", "AAI-4"]);
    const kinds: readonly PropositionKind[] = ["A", "E", "I", "O"];
    for (const major of kinds) for (const minor of kinds) for (const conclusion of kinds) for (let figure = 1; figure <= 4; figure++) {
      const label = `${major}${minor}${conclusion}-${figure}`;
      expect(categoricalValidity(major, minor, conclusion, figure, [])).toBe(modern.has(label));
      expect(categoricalValidity(major, minor, conclusion, figure, ["S", "M", "P"])).toBe(traditional.has(label));
    }
  });
});
