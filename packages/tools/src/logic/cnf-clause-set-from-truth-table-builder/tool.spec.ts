import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, cnfClauseSetFromTruthTableBuilderInputSchema, cnfClauseSetFromTruthTableBuilderOutputSchema } from "./index.js";
describe("logic/cnf-clause-set-from-truth-table-builder", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, cnfClauseSetFromTruthTableBuilderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cnfClauseSetFromTruthTableBuilderOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "variables": [
        "p"
      ],
      "values": [
        false,
        true
      ]
    })).toEqual({ ok: true, output: {
      "clauses": [
        "p"
      ],
      "formula": "(p)"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "variables": [],
      "values": [
        true
      ]
    })).toEqual({ ok: true, output: {
      "clauses": [],
      "formula": "true"
    } });
    expect(tool.execute({
      "variables": [],
      "values": [
        false
      ]
    })).toEqual({ ok: true, output: {
      "clauses": [
        "false"
      ],
      "formula": "(false)"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "variables", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "variables": [
        "p"
      ],
      "values": [
        true
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "length_mismatch" }] } });
    expect(tool.execute({
      "variables": [
        "p",
        "p"
      ],
      "values": [
        true,
        true,
        true,
        true
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "variables", code: "duplicate_variable" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["variables", "values"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("reconstructs all sixteen two-variable truth functions from the emitted literals", () => {
    for (let mask = 0; mask < 16; mask++) {
      const values = Array.from({ length: 4 }, (_, row) => (mask & (1 << row)) !== 0);
      const result = tool.execute({ variables: ["p", "q"], values });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (let row = 0; row < 4; row++) {
        const assignment = { p: row >= 2, q: row % 2 === 1 };
        const evaluateLiteral = (literal: string): boolean => {
          const name = literal.replace(/^!/, "");
          const value = name === "p" ? assignment.p : assignment.q;
          return literal.startsWith("!") ? !value : value;
        };
        const actual = result.output.clauses.every((term) => term.split(" || ").some(evaluateLiteral));
        expect(actual).toBe(values[row]);
      }
    }
  });
  it("rejects ambiguous identifiers and bounds rendered expansion", () => {
    expect(tool.execute({ variables: ["true"], values: [false, true] })).toMatchObject({ ok: false, error: { issues: [{ field: "variables.0", code: "invalid_format" }] } });
    const variables = Array.from({ length: 12 }, (_, index) => "v".repeat(90) + String(index));
    expect(tool.execute({ variables, values: Array.from({ length: 4096 }, () => false) })).toMatchObject({ ok: false, error: { issues: [{ field: "variables", code: "resource_limit" }] } });
  });
});
