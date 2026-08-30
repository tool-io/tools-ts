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
  it("maps purine substitutions to the same reverse-complement channel", () => {
    expect(calculate({ trinucleotide: "TGT", alternateBase: "A" })).toEqual(
      example.output,
    );
    expect(
      tool.execute({ trinucleotide: "ACA", alternateBase: "C" }),
    ).toMatchObject({ ok: false });
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
    expectIssue({}, "trinucleotide", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("uses the documented substitution-major order at both ends of the index range", () => {
    expect(calculate({ trinucleotide: "ACA", alternateBase: "A" })).toEqual({ canonicalContext: "ACA", canonicalChange: "C>A", channelIndex: 0 });
    expect(calculate({ trinucleotide: "TTT", alternateBase: "G" })).toEqual({ canonicalContext: "TTT", canonicalChange: "T>G", channelIndex: 95 });
    expectIssue({ trinucleotide: "NCA", alternateBase: "T" }, "trinucleotide", "invalid_field");
    expectIssue({ trinucleotide: "ACA", alternateBase: "AA" }, "alternateBase", "invalid_field");
  });
});
