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
    expectIssue({}, "firstReverse", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("classifies every left-right strand combination", () => {
    for (const [firstReverse, secondReverse, leftRightOrientation, inwardFacing] of [
      [false, false, "FF", false], [false, true, "FR", true],
      [true, false, "RF", false], [true, true, "RR", false],
    ] as const)
      expect(calculate({ firstReverse, secondReverse, firstPosition: 10, secondPosition: 20 })).toEqual({ leftRightOrientation, inwardFacing });
  });
  it("orders by alignment position rather than read number", () => {
    expect(calculate({ firstReverse: true, secondReverse: false, firstPosition: 200, secondPosition: 100 })).toEqual({ leftRightOrientation: "FR", inwardFacing: true });
  });
  it("rejects ambiguous equal starts and fractional coordinates", () => {
    expectIssue({ ...example.input, secondPosition: 100 }, "secondPosition", "invalid_value");
    expectIssue({ ...example.input, firstPosition: 0.5 }, "firstPosition", "invalid_field");
  });
});
