import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const expectIssue = (input: unknown, field: string, code = "invalid_value"): void => {
  expect(tool.execute(input)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ code, field }] } });
};
describe(tool.id, () => {
  it("does not intersect different chromosomes or touching half-open intervals", () => {
    expect(
      calculate({ ...example.input, secondChromosome: "chr2" }).overlapBases,
    ).toBe(0);
    expect(calculate({ ...example.input, secondStart: 30 }).overlapBases).toBe(
      0,
    );
  });
  it("computes the independent canonical example", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "firstChromosome", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("keeps zero-based containment coordinates and reports the offending interval", () => {
    expect(calculate({ ...example.input, firstStart: 0, firstEnd: 100, secondStart: 0, secondEnd: 5 })).toEqual({ overlapBases: 5, intersectionStart: 0, intersectionEnd: 5 });
    expectIssue({ ...example.input, secondEnd: 19 }, "secondEnd");
    expectIssue({ ...example.input, secondStart: 0.5 }, "secondStart", "invalid_field");
    expectIssue({ ...example.input, firstChromosome: " " }, "firstChromosome", "invalid_field");
  });
});
