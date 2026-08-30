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
  it("preserves unknown bits instead of pretending to interpret them", () => {
    expect(calculate({ flag: 4096 })).toEqual({
      enabledFlags: [],
      unknownBits: 4096,
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
    expectIssue({}, "flag", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("decodes the mate flag and all standard bits in specification order", () => {
    expect(calculate({ flag: 147 })).toEqual({ enabledFlags: ["paired", "proper-pair", "reverse", "last-segment"], unknownBits: 0 });
    expect(calculate({ flag: 65535 })).toEqual({ enabledFlags: ["paired", "proper-pair", "unmapped", "mate-unmapped", "reverse", "mate-reverse", "first-segment", "last-segment", "secondary", "qc-fail", "duplicate", "supplementary"], unknownBits: 61440 });
    expect(calculate({ flag: 0 })).toEqual({ enabledFlags: [], unknownBits: 0 });
  });
  it("requires an unsigned 16-bit integer", () => {
    for (const flag of [-1, 0.5, 65536, NaN]) expectIssue({ flag }, "flag", "invalid_field");
  });
});
