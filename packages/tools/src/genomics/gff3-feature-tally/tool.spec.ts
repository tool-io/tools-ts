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
    expectIssue({}, "gff3", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("counts feature records rather than IDs and stops before embedded FASTA", () => {
    expect(calculate({ gff3: "chr1\tx\tCDS\t1\t3\t.\t+\t0\tID=c\nchr1\tx\tCDS\t10\t12\t.\t+\t0\tID=c\n##FASTA\n>chr1\nACGT\n" })).toEqual({ featureTypes: ["CDS"], featureCounts: [2], recordCount: 2 });
    expect(calculate({ gff3: "# comment only\n" })).toEqual({ featureTypes: [], featureCounts: [], recordCount: 0 });
  });
  it("rejects unsafe coordinates and malformed strand or CDS phase", () => {
    expectIssue({ gff3: "chr1\tx\tgene\t1\t9007199254740992\t.\t+\t.\tID=g" }, "gff3");
    expectIssue({ gff3: "chr1\tx\tgene\t2\t1\t.\t+\t.\tID=g" }, "gff3");
    expectIssue({ gff3: "chr1\tx\tgene\t1\t3\t.\tx\t.\tID=g" }, "gff3");
    expectIssue({ gff3: "chr1\tx\tCDS\t1\t3\t.\t+\t.\tID=c" }, "gff3");
    expectIssue({ gff3: "chr1\tx\t \t1\t3\t.\t+\t.\tID=g" }, "gff3");
    expectIssue({ gff3: "chr1\tx\tgene\t1\t3\t0x10\t+\t.\tID=g" }, "gff3");
  });
});
