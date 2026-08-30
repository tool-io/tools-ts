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
    expectIssue({}, "upstreamExonDepth", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("avoids overflow in the flank mean and preserves signed deficits", () => {
    expect(calculate({ upstreamExonDepth: Number.MAX_VALUE, intronDepth: Number.MAX_VALUE, downstreamExonDepth: Number.MAX_VALUE, minimumIntronExonRatio: 1 })).toEqual({ intronExonRatio: 1, leftDropFraction: 0, rightRiseFraction: 0, retentionCandidate: true });
    expect(calculate({ upstreamExonDepth: Number.MIN_VALUE, intronDepth: Number.MIN_VALUE, downstreamExonDepth: Number.MIN_VALUE, minimumIntronExonRatio: 1 }).intronExonRatio).toBe(1);
    expect(calculate({ upstreamExonDepth: Number.MIN_VALUE, intronDepth: Number.MIN_VALUE, downstreamExonDepth: 2 * Number.MIN_VALUE, minimumIntronExonRatio: 0 }).intronExonRatio).toBe(2 / 3);
    expect(calculate({ ...example.input, intronDepth: 40 }).leftDropFraction).toBe(-1);
    expectIssue({ ...example.input, upstreamExonDepth: Number.MIN_VALUE }, "intronDepth", "result_overflow");
  });
});
