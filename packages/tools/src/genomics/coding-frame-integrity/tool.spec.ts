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
    expectIssue({}, "sequence", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("honors optional terminal stops for a single sense codon", () => {
    expect(calculate({ sequence: "ATG", requireStartCodon: true, requireTerminalStop: false })).toEqual({ frameDivisible: true, internalStopCount: 0, intact: true });
    expect(calculate({ sequence: "TAG", requireStartCodon: false, requireTerminalStop: false }).intact).toBe(false);
    expect(calculate({ ...example.input, sequence: "ATGTAAAAATAA" })).toEqual({ frameDivisible: true, internalStopCount: 1, intact: false });
    expect(calculate({ ...example.input, sequence: "ATGAAATA" }).intact).toBe(false);
    expectIssue({ ...example.input, sequence: "ATGNAA" }, "sequence", "invalid_field");
  });
});
