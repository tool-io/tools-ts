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
    expectIssue({}, "onBaitReads", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("compares read and genomic fractions and validates their separate subsets", () => {
    expect(calculate({ onBaitReads: 25, totalMappedReads: 100, baitBases: 5, genomeBases: 100 })).toEqual({ observedOnBaitFraction: 0.25, expectedGenomicFraction: 0.05, enrichmentFold: 5 });
    expectIssue({ ...example.input, baitBases: 1001 }, "baitBases");
    expectIssue({ ...example.input, onBaitReads: 1001 }, "onBaitReads");
    expectIssue({ ...example.input, baitBases: 0 }, "baitBases", "invalid_field");
  });
});
