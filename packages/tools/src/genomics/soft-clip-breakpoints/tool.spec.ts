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
    expectIssue({}, "cigar", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("uses terminal clips inside H and the entire reference-consuming span", () => {
    expect(calculate({ cigar: "2H5S10M2D3N7M4S1H", alignmentStart: 100, minimumClipLength: 4 })).toEqual({ leftClipLength: 5, rightClipLength: 4, breakpointHints: [100, 122] });
    expect(calculate({ cigar: "5M5S", alignmentStart: 0, minimumClipLength: 5 })).toEqual({ leftClipLength: 0, rightClipLength: 5, breakpointHints: [5] });
    expect(calculate({ cigar: "5M", alignmentStart: 0, minimumClipLength: 1 })).toEqual({ leftClipLength: 0, rightClipLength: 0, breakpointHints: [] });
  });
  it("rejects unaligned clips, interior clipping, and unsafe coordinates", () => {
    expectIssue({ cigar: "5S", alignmentStart: 0, minimumClipLength: 1 }, "cigar", "alignment_required");
    expectIssue({ cigar: "5M2S5M", alignmentStart: 0, minimumClipLength: 1 }, "cigar", "invalid_clipping");
    expectIssue({ cigar: "1M1S", alignmentStart: Number.MAX_SAFE_INTEGER, minimumClipLength: 1 }, "alignmentStart", "coordinate_overflow");
  });
  it("retains an exact maximum safe end coordinate", () => {
    expect(calculate({ cigar: "1M1S", alignmentStart: Number.MAX_SAFE_INTEGER - 1, minimumClipLength: 1 })).toEqual({ leftClipLength: 0, rightClipLength: 1, breakpointHints: [Number.MAX_SAFE_INTEGER] });
  });

  it("normalizes negative zero in count or coordinate outputs", () => {
    expect(calculate({ cigar: "1S1M", alignmentStart: -0, minimumClipLength: 1 })).toEqual({ leftClipLength: 1, rightClipLength: 0, breakpointHints: [0] });
  });
});
