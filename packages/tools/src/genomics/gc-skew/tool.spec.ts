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

  it("includes the tolerance boundary and reverses bias under complementation", () => {
    expect(calculate({ sequence: "GGGC", neutralTolerance: 0.5 })).toEqual({ gCount: 3, cCount: 1, gcSkew: 0.5, bias: "near-balanced" });
    expect(calculate({ sequence: "CCCG", neutralTolerance: 0.1 })).toEqual({ gCount: 1, cCount: 3, gcSkew: -0.5, bias: "C-enriched" });
  });
  it("requires GC bases and a tolerance in [0, 1]", () => {
    expectIssue({ sequence: "AAAT", neutralTolerance: 0 }, "sequence", "invalid_value");
    for (const neutralTolerance of [-0.1, 1.1, NaN])
      expectIssue({ ...example.input, neutralTolerance }, "neutralTolerance", "invalid_field");
  });
});
