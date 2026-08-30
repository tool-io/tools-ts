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
    expectIssue({}, "readCount", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("counts individual reads and preserves zero and depth scaling", () => {
    expect(calculate({ readCount: 100, readLength: 150, genomeBases: 1000 })).toEqual({ sequencedBases: 15000, foldCoverage: 15 });
    expect(calculate({ readCount: 200, readLength: 150, genomeBases: 1000 })).toEqual({ sequencedBases: 30000, foldCoverage: 30 });
    expect(calculate({ readCount: 0, readLength: 150, genomeBases: 1000 })).toEqual({ sequencedBases: 0, foldCoverage: 0 });
  });
  it("reports count overflow against the input rather than an output port", () => {
    expectIssue({ readCount: Number.MAX_SAFE_INTEGER, readLength: 2, genomeBases: 1 }, "readCount", "count_overflow");
    expectIssue({ ...example.input, readLength: 0 }, "readLength", "invalid_field");
    expectIssue({ ...example.input, readCount: 0.5 }, "readCount", "invalid_field");
  });

  it("normalizes negative zero in count or coordinate outputs", () => {
    expect(calculate({ readCount: -0, readLength: 2, genomeBases: 3 })).toEqual({ sequencedBases: 0, foldCoverage: 0 });
  });
});
