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
  it("scans forward frames and returns explicit absence when no complete ORF exists", () => {
    expect(calculate({ sequence: "CATGAAATAA" })).toMatchObject({
      strand: "forward",
      frame: 1,
      startIndex: 1,
      endIndex: 10,
      codingBases: 6,
    });
    expect(calculate({ sequence: "ACGT" })).toMatchObject({
      strand: "none",
      startIndex: -1,
      endIndex: -1,
    });
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
    expectIssue({}, "sequence", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("chooses the earliest nested start and excludes stops from coding length", () => {
    expect(calculate({ sequence: "ATGATGTAA" })).toEqual({ strand: "forward", frame: 0, startIndex: 0, endIndex: 9, codingBases: 6, aminoAcidCount: 2 });
    expect(calculate({ sequence: "ATGAAA" })).toEqual({ strand: "none", frame: -1, startIndex: -1, endIndex: -1, codingBases: 0, aminoAcidCount: 0 });
    expectIssue({ sequence: "ATGNAA" }, "sequence", "invalid_field");
  });
});
