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

  it("counts trimmed mixed-case DNA and changes sign under complementation", () => {
    expect(calculate({ sequence: "  aaaTCC\n" })).toEqual({ aCount: 3, tCount: 1, atSkew: 0.5 });
    expect(calculate({ sequence: "TTTAGG" })).toEqual({ aCount: 1, tCount: 3, atSkew: -0.5 });
    expect(calculate({ sequence: "AT" })).toEqual({ aCount: 1, tCount: 1, atSkew: 0 });
  });
  it("rejects an undefined skew and ambiguous DNA", () => {
    expectIssue({ sequence: "CGGC" }, "sequence", "invalid_value");
    expectIssue({ sequence: "AANT" }, "sequence", "invalid_field");
  });
});
