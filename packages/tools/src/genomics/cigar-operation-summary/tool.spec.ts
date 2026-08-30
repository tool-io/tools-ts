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
  it("rejects partial or zero-length operations", () => {
    expect(tool.execute({ cigar: "10Mbad" })).toMatchObject({ ok: false });
    expect(tool.execute({ cigar: "0M" })).toMatchObject({ ok: false });
    expect(calculate({ cigar: "2=1X" })).toMatchObject({
      queryConsumed: 3,
      referenceConsumed: 3,
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
    expectIssue({}, "cigar", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("uses the SAM consumption table for all nine operators", () => {
    expect(calculate({ cigar: "2H3S5M2I4D6N1P7=8X9S1H" })).toEqual({
      operations: ["H", "S", "M", "I", "D", "N", "P", "=", "X"],
      operationBases: [3, 12, 5, 2, 4, 6, 1, 7, 8], queryConsumed: 34, referenceConsumed: 30,
    });
  });
  it("rejects clipping inside an alignment and unparsed trailing text", () => {
    for (const cigar of ["5M2S5M", "5M2H5M"])
      expectIssue({ cigar }, "cigar", "invalid_clipping");
    for (const cigar of ["1M\n", "1M!", "*", "0M"])
      expectIssue({ cigar }, "cigar", "invalid_field");
  });
  it("rejects unsafe per-operator and cross-operator totals", () => {
    expectIssue({ cigar: "9007199254740991M1M" }, "cigar", "count_overflow");
    expectIssue({ cigar: "9007199254740991M1I" }, "cigar", "count_overflow");
  });
});
