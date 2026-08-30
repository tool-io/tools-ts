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
  it("combines reverse-complement k-mers only when requested", () => {
    expect(
      calculate({ sequence: "ATGCAT", k: 3, canonicalReverseComplement: true }),
    ).toEqual({
      kmers: ["ATG", "GCA"],
      occurrenceCounts: [2, 2],
      totalWindows: 4,
    });
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
    expectIssue({}, "sequence", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("counts overlaps and conserves the number of full windows", () => {
    expect(calculate({ sequence: "AAAA", k: 2, canonicalReverseComplement: false })).toEqual({ kmers: ["AA"], occurrenceCounts: [3], totalWindows: 3 });
    const output = calculate({ sequence: "ACGTAC", k: 2, canonicalReverseComplement: true });
    expect(output.occurrenceCounts.reduce((sum, count) => sum + count, 0)).toBe(output.totalWindows);
    expect(output.totalWindows).toBe(5);
  });
  it("does not double-count palindromes and includes a full-length k-mer", () => {
    expect(calculate({ sequence: "ATAT", k: 2, canonicalReverseComplement: true })).toEqual({ kmers: ["AT", "TA"], occurrenceCounts: [2, 1], totalWindows: 3 });
    expect(calculate({ sequence: "ACGT", k: 4, canonicalReverseComplement: false })).toEqual({ kmers: ["ACGT"], occurrenceCounts: [1], totalWindows: 1 });
  });
  it("rejects an oversized k and nonboolean canonicalization", () => {
    expectIssue({ ...example.input, k: 5 }, "k", "invalid_value");
    expectIssue({ ...example.input, k: 0 }, "k", "invalid_field");
    expectIssue({ ...example.input, canonicalReverseComplement: 1 }, "canonicalReverseComplement", "invalid_field");
  });
});
