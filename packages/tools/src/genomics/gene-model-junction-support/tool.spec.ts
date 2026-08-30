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
  it("ignores read evidence at coordinates inconsistent with the gene model", () => {
    expect(
      calculate({ ...example.input, junctionStarts: [9, 29] })
        .supportedIntronCount,
    ).toBe(0);
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
    expectIssue({}, "exonStarts", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("aggregates exact junction evidence and saturates at a safe threshold", () => {
    expect(calculate({ exonStarts: [0, 20], exonEnds: [10, 30], junctionStarts: [10, 10], junctionEnds: [20, 20], junctionReadCounts: [2, 1], minimumReadCount: 3 })).toEqual({ supportedIntronCount: 1, intronCount: 1, supportedFraction: 1 });
    expect(calculate({ exonStarts: [0, 20], exonEnds: [10, 30], junctionStarts: [10, 10], junctionEnds: [20, 20], junctionReadCounts: [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], minimumReadCount: Number.MAX_SAFE_INTEGER }).supportedFraction).toBe(1);
    expectIssue({ ...example.input, junctionEnds: [10, 40] }, "junctionEnds");
    expectIssue({ ...example.input, junctionReadCounts: [8] }, "junctionReadCounts");
  });
});
