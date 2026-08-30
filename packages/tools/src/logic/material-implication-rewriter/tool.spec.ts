import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, materialImplicationRewriterInputSchema, materialImplicationRewriterOutputSchema } from "./index.js";
describe("logic/material-implication-rewriter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, materialImplicationRewriterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, materialImplicationRewriterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "antecedent": "a",
      "consequent": "b"
    })).toEqual({ ok: true, output: {
      "original": "(a -> b)",
      "rewritten": "(!a || b)"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "antecedent": "p",
      "consequent": "p"
    })).toEqual({ ok: true, output: {
      "original": "(p -> p)",
      "rewritten": "(!p || p)"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "antecedent", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["antecedent", "consequent"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("keeps Boolean literals distinct from identifier atoms", () => {
    for (const field of ["antecedent", "consequent"] as const) {
      expect(tool.execute({ ...example.input, [field]: "true" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_format" }] } });
    }
  });
  it("rejects trailing line breaks in identifier operands", () => {
    expect(tool.execute({ antecedent: "p\n", consequent: "q" })).toMatchObject({ ok: false, error: { issues: [{ field: "antecedent", code: "invalid_format" }] } });
  });
});
