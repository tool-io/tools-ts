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
  it("advances over deletions but not insertions before N operators", () => {
    expect(calculate({ cigar: "5M2I3D4N5M", alignmentStart: 100 })).toEqual({
      junctionStarts: [108],
      junctionEnds: [112],
      junctionCount: 1,
    });
  });
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
    expectIssue({}, "cigar", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("advances over =, X, D and earlier skips but never I or clipping", () => {
    expect(calculate({ cigar: "4S3=2X1I2D4N3M5N1H", alignmentStart: 0 })).toEqual({ junctionStarts: [7, 14], junctionEnds: [11, 19], junctionCount: 2 });
    expect(calculate({ cigar: "5M", alignmentStart: 10 })).toEqual({ junctionStarts: [], junctionEnds: [], junctionCount: 0 });
  });
  it("shifts both half-open boundaries with the reference start", () => {
    expect(calculate({ cigar: "3M4N", alignmentStart: 7 })).toEqual({ junctionStarts: [10], junctionEnds: [14], junctionCount: 1 });
    expect(calculate({ cigar: "1N", alignmentStart: Number.MAX_SAFE_INTEGER - 1 })).toEqual({ junctionStarts: [Number.MAX_SAFE_INTEGER - 1], junctionEnds: [Number.MAX_SAFE_INTEGER], junctionCount: 1 });
  });
  it("rejects unsafe coordinates and invalid clipping before any junction", () => {
    expectIssue({ cigar: "1M1N", alignmentStart: Number.MAX_SAFE_INTEGER }, "alignmentStart", "coordinate_overflow");
    expectIssue({ cigar: "1M1S1N", alignmentStart: 0 }, "cigar", "invalid_clipping");
  });

  it("normalizes negative zero in count or coordinate outputs", () => {
    expect(calculate({ cigar: "1N", alignmentStart: -0 })).toEqual({ junctionStarts: [0], junctionEnds: [1], junctionCount: 1 });
  });
});
