import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./index.js";
const expectIssue = (input: unknown, field: string, code: string): void => {
  const result = tool.execute(input);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected a structured input error.");
  expect(result.error.code).toBe("invalid_input");
  expect(result.error.issues).toEqual(
    expect.arrayContaining([expect.objectContaining({ field, code })]),
  );
};
describe(tool.id, () => {
  it("signals when assembly length cannot reach half the reference", () => {
    expect(calculate({ contigLengths: [1], referenceGenomeBases: 10 })).toEqual(
      { ng50: 0, thresholdReached: false },
    );
  });
  it("executes the canonical example exactly", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "contigLengths", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("uses the reference threshold rather than the assembly total", () => {
    expect(calculate({ contigLengths: [6, 3, 1], referenceGenomeBases: 13 })).toEqual({ ng50: 3, thresholdReached: true });
    expect(calculate({ contigLengths: [6, 3, 1], referenceGenomeBases: 21 })).toEqual({ ng50: 0, thresholdReached: false });
  });
  it("handles a half-base threshold near the safe-integer limit", () => {
    expect(calculate({ contigLengths: [4503599627370495, 1], referenceGenomeBases: Number.MAX_SAFE_INTEGER })).toEqual({ ng50: 1, thresholdReached: true });
  });
  it("rejects a nonpositive reference and fractional contig lengths", () => {
    expectIssue({ ...example.input, referenceGenomeBases: 0 }, "referenceGenomeBases", "invalid_field");
    expectIssue({ ...example.input, contigLengths: [1.5] }, "contigLengths", "invalid_field");
  });

  it("rejects sparse numeric lists before calculating output", () => {
    expectIssue({ ...example.input, contigLengths: new Array<number>(2) }, "contigLengths", "invalid_field");
  });
});
