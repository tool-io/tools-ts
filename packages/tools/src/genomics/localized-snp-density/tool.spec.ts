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
    expectIssue({}, "snpPositions", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("deduplicates SNPs and excludes the half-open end coordinate", () => {
    expect(calculate({ snpPositions: [5, 0, 0, 4], windowBp: 5, minimumSnps: 2 })).toEqual({ clusterStarts: [0, 4], clusterEnds: [5, 9], clusterCounts: [2, 2] });
    expectIssue({ snpPositions: [Number.MAX_SAFE_INTEGER], windowBp: 1, minimumSnps: 1 }, "windowBp", "coordinate_overflow");
  });
});
