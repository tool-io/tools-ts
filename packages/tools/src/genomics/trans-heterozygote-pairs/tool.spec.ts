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
    expectIssue({}, "variantIds", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("excludes same-haplotype and cross-gene pairs", () => {
    expect(calculate({ variantIds: ["a", "b", "c", "d"], geneIds: ["A", "A", "A", "B"], phasedAlternateHaplotypes: [0, 0, 1, 1] })).toEqual({ firstVariants: ["a", "b"], secondVariants: ["c", "c"], pairGenes: ["A", "A"] });
    expectIssue({ ...example.input, phasedAlternateHaplotypes: [0, 2, 0] }, "phasedAlternateHaplotypes", "invalid_field");
    expectIssue({ ...example.input, geneIds: ["A", "A"] }, "geneIds");
    expectIssue({ variantIds: Array.from({ length: 401 }, (_, i) => `v${i}`), geneIds: Array.from({ length: 401 }, () => "A"), phasedAlternateHaplotypes: Array.from({ length: 401 }, () => 0) }, "variantIds", "invalid_field");
  });
});
