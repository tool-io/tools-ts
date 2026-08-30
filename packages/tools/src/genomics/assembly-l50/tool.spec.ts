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
    expectIssue({}, "contigLengths", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("handles ties and an odd total without mutating the contigs", () => {
    const contigLengths = Object.freeze([2, 4, 4, 0]);
    expect(calculate({ contigLengths })).toEqual({ l50: 2, assemblyBases: 10 });
    expect(contigLengths).toEqual([2, 4, 4, 0]);
    expect(calculate({ contigLengths: [4, 3, 2] })).toEqual({ l50: 2, assemblyBases: 9 });
  });
  it("accepts an exact safe-integer total and rejects an unsafe aggregate", () => {
    expect(calculate({ contigLengths: [Number.MAX_SAFE_INTEGER] })).toEqual({
      l50: 1, assemblyBases: Number.MAX_SAFE_INTEGER,
    });
    expectIssue({ contigLengths: [Number.MAX_SAFE_INTEGER, 1] }, "contigLengths", "count_overflow");
  });
  it("rejects empty, fractional, non-finite, and zero-total assemblies", () => {
    for (const contigLengths of [[], [1.5], [-1], [NaN]])
      expectIssue({ contigLengths }, "contigLengths", "invalid_field");
    expectIssue({ contigLengths: [0, 0] }, "contigLengths", "invalid_value");
  });

  it("rejects sparse numeric lists before calculating output", () => {
    expectIssue({ ...example.input, contigLengths: new Array<number>(2) }, "contigLengths", "invalid_field");
  });
});
