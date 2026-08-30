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
  it("allows reference parents to pass a reference genotype but not alternate homozygosity", () => {
    expect(
      calculate({
        motherGenotypes: ["0/0", "0/1"],
        fatherGenotypes: ["0/0", "0/0"],
        childGenotypes: ["0/0", "1/1"],
      }),
    ).toEqual({
      violationIndexes: [1],
      denovoCandidateIndexes: [],
      consistentCount: 1,
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
    expectIssue({}, "motherGenotypes", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("compares canonical decimal alleles without losing large indexes or leading zeros", () => {
    expect(calculate({ motherGenotypes: ["00/01", "9007199254740992/0"], fatherGenotypes: ["0|0", "0/0"], childGenotypes: ["1|0", "0/9007199254740992"] })).toEqual({ violationIndexes: [], denovoCandidateIndexes: [], consistentCount: 2 });
    expect(calculate({ motherGenotypes: ["0/9007199254740992"], fatherGenotypes: ["0/0"], childGenotypes: ["0/9007199254740993"] })).toEqual({ violationIndexes: [0], denovoCandidateIndexes: [0], consistentCount: 0 });
  });
  it("reports missing or malformed parental calls without labelling them child errors", () => {
    expectIssue({ ...example.input, motherGenotypes: ["./.", "0/1"] }, "motherGenotypes", "invalid_field");
    expectIssue({ ...example.input, fatherGenotypes: ["0/0\n", "0/0"] }, "fatherGenotypes", "invalid_field");
    expectIssue({ ...example.input, motherGenotypes: ["0/0"] }, "motherGenotypes");
  });
});
